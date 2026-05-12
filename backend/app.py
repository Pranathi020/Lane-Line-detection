"""
Flask API for the Lane Line Detection demo.

Endpoints
---------
GET  /health                  -> service status & feature flags
POST /api/detect-image        -> single image (multipart "file") -> annotated PNG
POST /api/detect-base64       -> JSON {"image": "data:image/...;base64,..."} -> JSON result
POST /api/detect-video        -> multipart "file" video -> annotated MP4 stream
"""

from __future__ import annotations

import base64
import io
import os
import tempfile
import time
import uuid
from typing import Tuple

import cv2
import numpy as np
from flask import Flask, Response, jsonify, request, send_file
from flask_cors import CORS

from lane_detector import LaneDetector, get_detector

app = Flask(__name__)
CORS(app)
app.config["MAX_CONTENT_LENGTH"] = 100 * 1024 * 1024  # 100 MB


def _decode_image(data: bytes) -> np.ndarray:
    arr = np.frombuffer(data, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode image")
    return img


def _encode_png(img_bgr: np.ndarray) -> bytes:
    ok, buf = cv2.imencode(".png", img_bgr)
    if not ok:
        raise RuntimeError("PNG encode failed")
    return buf.tobytes()


def _b64_data_url(img_bgr: np.ndarray) -> str:
    return "data:image/png;base64," + base64.b64encode(_encode_png(img_bgr)).decode()


@app.get("/health")
def health():
    detector = get_detector()
    return jsonify(
        {
            "status": "ok",
            "version": "1.0.0",
            "tensorflow_available": _tf_status(),
            "deep_learning_enabled": detector.use_dl,
        }
    )


def _tf_status() -> bool:
    try:
        import tensorflow as tf  # noqa: F401
        return True
    except Exception:  # noqa: BLE001
        return False


@app.post("/api/detect-image")
def detect_image():
    if "file" not in request.files:
        return jsonify({"error": "missing 'file' field"}), 400
    file = request.files["file"]
    img = _decode_image(file.read())

    detector = get_detector()
    detector.reset_history()
    t0 = time.time()
    result = detector.detect(img)
    elapsed = time.time() - t0

    return jsonify(
        {
            "image": _b64_data_url(result.image),
            "is_night": result.is_night,
            "confidence": result.confidence,
            "elapsed_ms": round(elapsed * 1000, 2),
            "left_line": result.left_line,
            "right_line": result.right_line,
            "center_line": result.center_line,
        }
    )


@app.post("/api/detect-base64")
def detect_base64():
    payload = request.get_json(silent=True) or {}
    data_url = payload.get("image", "")
    if "," in data_url:
        data_url = data_url.split(",", 1)[1]
    try:
        raw = base64.b64decode(data_url)
    except Exception:  # noqa: BLE001
        return jsonify({"error": "invalid base64"}), 400

    img = _decode_image(raw)
    detector = get_detector()
    t0 = time.time()
    result = detector.detect(img)
    elapsed = time.time() - t0

    return jsonify(
        {
            "image": _b64_data_url(result.image),
            "is_night": result.is_night,
            "confidence": result.confidence,
            "elapsed_ms": round(elapsed * 1000, 2),
        }
    )


@app.post("/api/detect-video")
def detect_video():
    if "file" not in request.files:
        return jsonify({"error": "missing 'file' field"}), 400
    file = request.files["file"]

    tmp_in = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
    tmp_out_path = os.path.join(
        tempfile.gettempdir(), f"lane_out_{uuid.uuid4().hex}.mp4"
    )
    file.save(tmp_in.name)
    tmp_in.close()

    cap = cv2.VideoCapture(tmp_in.name)
    if not cap.isOpened():
        return jsonify({"error": "cannot open video"}), 400

    fps = cap.get(cv2.CAP_PROP_FPS) or 24.0
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    writer = cv2.VideoWriter(tmp_out_path, fourcc, fps, (w, h))

    detector = LaneDetector(use_dl=False)
    frames = 0
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        result = detector.detect(frame)
        writer.write(result.image)
        frames += 1

    cap.release()
    writer.release()
    try:
        os.unlink(tmp_in.name)
    except OSError:
        pass

    return send_file(
        tmp_out_path,
        mimetype="video/mp4",
        as_attachment=False,
        download_name="lane_detection.mp4",
    )


@app.errorhandler(413)
def too_large(_):
    return jsonify({"error": "file too large (limit 100MB)"}), 413


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False, threaded=True)
