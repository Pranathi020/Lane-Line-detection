# LaneVision — AI Lane Line Detection

A full-stack computer-vision demo that detects lane lines in road imagery using a hybrid
**OpenCV + TensorFlow** pipeline, served through a polished **Next.js** frontend.

- **Left lane**  → blue
- **Center path** → green
- **Right lane** → red
- **Night scenes** → road region rendered in **grayscale** beneath the colored overlay

---

## Project layout

```
Lane Line detection/
├── backend/        Flask + OpenCV + TensorFlow API
│   ├── app.py
│   ├── lane_detector.py
│   └── requirements.txt
├── frontend/       Next.js 14 + Tailwind + Framer Motion UI
│   ├── app/
│   │   ├── page.tsx
│   │   └── components/
│   └── package.json
└── README.md
```

---

## Quick start

### 1. Backend (Python ≥ 3.10)

```powershell
cd "c:\dev\Lane Line detection\backend"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

The API will be available at <http://localhost:5001>.

| Endpoint | Method | Description |
| --- | --- | --- |
| `/health` | GET | Status & feature flags |
| `/api/detect-image` | POST `multipart` | Single image → JSON with annotated PNG (base64) |
| `/api/detect-base64` | POST `JSON` | `{ "image": "data:image/png;base64,..." }` |
| `/api/detect-video` | POST `multipart` | MP4 in, annotated MP4 out |

### 2. Frontend (Node ≥ 18)

In a second terminal:

```powershell
cd "c:\dev\Lane Line detection\frontend"
copy .env.local.example .env.local      # optional, defaults to localhost:5001
npm install
npm run dev
```

Open <http://localhost:3000>, drop in a dashcam image, and watch the lanes light up.

---

## How it works

1. **ROI mask** — a trapezoidal road region is extracted from the frame.
2. **Edge map** — adaptive CLAHE (at night) → Gaussian blur → Canny.
3. **Hough transform** — probabilistic line segments are clustered into left/right by sign-of-slope and x-position.
4. **Temporal smoothing** — slope + intercept are averaged across the last 8 frames for video stability.
5. **Center path** — interpolated between the two lane fits.
6. **Render** — drivable polygon fill + three colored polylines. Night detection (mean luma < 75) swaps the road region for grayscale.

A TensorFlow Keras model can be plugged in via `LaneDetector(use_dl=True, model_path=...)` to refine raw Hough candidates. The hook is wired but disabled by default so the demo runs without a trained model.

---

## Customization

- Tweak ROI shape in `backend/lane_detector.py::_roi_mask`.
- Adjust night threshold in `_is_night` (default mean-luma 75).
- Swap colors in `COLOR_LEFT`, `COLOR_RIGHT`, `COLOR_CENTER` (BGR).
- Brand the UI in `frontend/app/components/Navbar.tsx` and `Hero.tsx`.

---

## Stack

| Layer | Tech |
| --- | --- |
| Vision | OpenCV 4.10, NumPy |
| ML hook | TensorFlow 2.16 (optional) |
| API | Flask 3, Flask-CORS |
| Web | Next.js 14, React 18, Tailwind 3, Framer Motion, lucide-react |
