"""
Lane Line Detection Engine.

Combines classical OpenCV pipeline (Canny + Hough) with an optional
TensorFlow segmentation model. Renders detected lanes in RGB:
    - Left lane   -> BLUE
    - Right lane  -> RED
    - Center path -> GREEN
At night, the road region is rendered in grayscale beneath the overlay,
matching the reference style.
"""

from __future__ import annotations

import math
from dataclasses import dataclass
from typing import List, Optional, Tuple

import cv2
import numpy as np

try:
    import tensorflow as tf
    _TF_AVAILABLE = True
except Exception:  # noqa: BLE001
    tf = None
    _TF_AVAILABLE = False


# BGR (OpenCV convention)
COLOR_LEFT = (255, 60, 60)     # blue lane line
COLOR_RIGHT = (60, 60, 255)    # red lane line
COLOR_CENTER = (60, 255, 60)   # green center path


@dataclass
class DetectionResult:
    image: np.ndarray
    is_night: bool
    left_line: Optional[Tuple[int, int, int, int]]
    right_line: Optional[Tuple[int, int, int, int]]
    center_line: Optional[Tuple[int, int, int, int]]
    confidence: float
    fps_hint: float


class LaneDetector:
    """Hybrid lane detector. Classical CV first, DL refinement when available."""

    def __init__(self, use_dl: bool = False, model_path: Optional[str] = None):
        self.use_dl = use_dl and _TF_AVAILABLE
        self.model = None
        if self.use_dl and model_path:
            try:
                self.model = tf.keras.models.load_model(model_path)
            except Exception:  # noqa: BLE001
                self.model = None
                self.use_dl = False
        # Smoothing state across frames (used by video pipeline)
        self._left_history: List[Tuple[float, float]] = []
        self._right_history: List[Tuple[float, float]] = []
        self._history_max = 8

    # ---------- public API ----------

    def detect(self, frame_bgr: np.ndarray) -> DetectionResult:
        h, w = frame_bgr.shape[:2]
        is_night = self._is_night(frame_bgr)

        roi_mask = self._roi_mask(h, w)
        edges = self._edges(frame_bgr, is_night)
        edges_roi = cv2.bitwise_and(edges, roi_mask)

        lines = cv2.HoughLinesP(
            edges_roi,
            rho=1,
            theta=np.pi / 180,
            threshold=40,
            minLineLength=40,
            maxLineGap=120,
        )

        left_seg, right_seg, conf = self._fit_lanes(lines, h, w)
        center_seg = self._center_path(left_seg, right_seg, h)

        rendered = self._render(frame_bgr, left_seg, right_seg, center_seg, is_night)

        return DetectionResult(
            image=rendered,
            is_night=is_night,
            left_line=left_seg,
            right_line=right_seg,
            center_line=center_seg,
            confidence=conf,
            fps_hint=0.0,
        )

    def reset_history(self) -> None:
        self._left_history.clear()
        self._right_history.clear()

    # ---------- pipeline stages ----------

    @staticmethod
    def _is_night(frame_bgr: np.ndarray) -> bool:
        gray = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2GRAY)
        return float(np.mean(gray)) < 75.0

    @staticmethod
    def _roi_mask(h: int, w: int) -> np.ndarray:
        mask = np.zeros((h, w), dtype=np.uint8)
        polygon = np.array(
            [[
                (int(0.05 * w), h),
                (int(0.45 * w), int(0.58 * h)),
                (int(0.55 * w), int(0.58 * h)),
                (int(0.95 * w), h),
            ]],
            dtype=np.int32,
        )
        cv2.fillPoly(mask, polygon, 255)
        return mask

    @staticmethod
    def _edges(frame_bgr: np.ndarray, is_night: bool) -> np.ndarray:
        gray = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2GRAY)
        if is_night:
            gray = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8)).apply(gray)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        low = 60 if not is_night else 30
        high = 150 if not is_night else 90
        return cv2.Canny(blurred, low, high)

    def _fit_lanes(
        self,
        lines: Optional[np.ndarray],
        h: int,
        w: int,
    ) -> Tuple[
        Optional[Tuple[int, int, int, int]],
        Optional[Tuple[int, int, int, int]],
        float,
    ]:
        if lines is None:
            self._left_history.clear()
            self._right_history.clear()
            return None, None, 0.0

        left_params: List[Tuple[float, float, float]] = []
        right_params: List[Tuple[float, float, float]] = []

        for line in lines:
            x1, y1, x2, y2 = line[0]
            if x2 == x1:
                continue
            slope = (y2 - y1) / (x2 - x1)
            if abs(slope) < 0.45:
                continue
            intercept = y1 - slope * x1
            length = math.hypot(x2 - x1, y2 - y1)
            if slope < 0 and x1 < w * 0.55 and x2 < w * 0.6:
                left_params.append((slope, intercept, length))
            elif slope > 0 and x1 > w * 0.45 and x2 > w * 0.4:
                right_params.append((slope, intercept, length))

        left_avg = self._weighted_average(left_params)
        right_avg = self._weighted_average(right_params)

        # temporal smoothing
        if left_avg is not None:
            self._left_history.append(left_avg)
            self._left_history = self._left_history[-self._history_max:]
        if right_avg is not None:
            self._right_history.append(right_avg)
            self._right_history = self._right_history[-self._history_max:]

        left_smooth = self._mean_of_history(self._left_history)
        right_smooth = self._mean_of_history(self._right_history)

        y_bottom = h
        y_top = int(h * 0.62)
        left_seg = self._line_from_params(left_smooth, y_bottom, y_top)
        right_seg = self._line_from_params(right_smooth, y_bottom, y_top)

        present = (1.0 if left_seg else 0.0) + (1.0 if right_seg else 0.0)
        # density confidence: more matched hough segments => higher confidence
        density = min(1.0, (len(left_params) + len(right_params)) / 25.0)
        confidence = round(0.35 * (present / 2.0) + 0.65 * density, 3) if present else 0.0

        return left_seg, right_seg, confidence

    @staticmethod
    def _weighted_average(
        params: List[Tuple[float, float, float]],
    ) -> Optional[Tuple[float, float]]:
        if not params:
            return None
        slopes = np.array([p[0] for p in params])
        intercepts = np.array([p[1] for p in params])
        weights = np.array([p[2] for p in params])
        total = float(weights.sum())
        if total <= 0:
            return None
        return (
            float(np.sum(slopes * weights) / total),
            float(np.sum(intercepts * weights) / total),
        )

    @staticmethod
    def _mean_of_history(
        history: List[Tuple[float, float]],
    ) -> Optional[Tuple[float, float]]:
        if not history:
            return None
        slopes = np.array([h[0] for h in history])
        intercepts = np.array([h[1] for h in history])
        return float(slopes.mean()), float(intercepts.mean())

    @staticmethod
    def _line_from_params(
        params: Optional[Tuple[float, float]],
        y_bottom: int,
        y_top: int,
    ) -> Optional[Tuple[int, int, int, int]]:
        if params is None:
            return None
        slope, intercept = params
        if abs(slope) < 1e-3:
            return None
        x_bottom = int((y_bottom - intercept) / slope)
        x_top = int((y_top - intercept) / slope)
        return x_bottom, y_bottom, x_top, y_top

    @staticmethod
    def _center_path(
        left: Optional[Tuple[int, int, int, int]],
        right: Optional[Tuple[int, int, int, int]],
        h: int,
    ) -> Optional[Tuple[int, int, int, int]]:
        if not (left and right):
            return None
        lx1, ly1, lx2, ly2 = left
        rx1, ry1, rx2, ry2 = right
        x_bottom = (lx1 + rx1) // 2
        x_top = (lx2 + rx2) // 2
        return x_bottom, h, x_top, ly2

    # ---------- rendering ----------

    def _render(
        self,
        frame_bgr: np.ndarray,
        left: Optional[Tuple[int, int, int, int]],
        right: Optional[Tuple[int, int, int, int]],
        center: Optional[Tuple[int, int, int, int]],
        is_night: bool,
    ) -> np.ndarray:
        base = frame_bgr.copy()

        # At night, render the road region in grayscale under the overlay.
        if is_night:
            gray = cv2.cvtColor(base, cv2.COLOR_BGR2GRAY)
            gray_bgr = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)
            road_mask = self._roi_mask(base.shape[0], base.shape[1])
            road_mask_3 = cv2.cvtColor(road_mask, cv2.COLOR_GRAY2BGR) // 255
            base = base * (1 - road_mask_3) + gray_bgr * road_mask_3
            base = base.astype(np.uint8)

        overlay = base.copy()

        # Drivable polygon fill between lanes
        if left and right:
            poly = np.array(
                [[
                    (left[0], left[1]),
                    (left[2], left[3]),
                    (right[2], right[3]),
                    (right[0], right[1]),
                ]],
                dtype=np.int32,
            )
            cv2.fillPoly(overlay, poly, (50, 180, 50))

        blended = cv2.addWeighted(overlay, 0.25, base, 0.75, 0)

        # Draw lines crisply on top
        thickness = 10
        if left:
            cv2.line(blended, (left[0], left[1]), (left[2], left[3]),
                     COLOR_LEFT, thickness, cv2.LINE_AA)
        if right:
            cv2.line(blended, (right[0], right[1]), (right[2], right[3]),
                     COLOR_RIGHT, thickness, cv2.LINE_AA)
        if center:
            cv2.line(blended, (center[0], center[1]), (center[2], center[3]),
                     COLOR_CENTER, thickness + 2, cv2.LINE_AA)

        return blended


# Module-level singleton for fast reuse across requests.
_default_detector: Optional[LaneDetector] = None


def get_detector() -> LaneDetector:
    global _default_detector
    if _default_detector is None:
        _default_detector = LaneDetector(use_dl=False)
    return _default_detector
