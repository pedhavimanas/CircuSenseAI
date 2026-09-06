# CircuSense AI

**CircuSense AI** is a professional, AI-assisted PCB inspection and component detection application. It uses a trained **Ultralytics YOLO** object detection model (`models/best.pt`) as the authoritative detector to identify components on physical printed circuit boards, accurately map bounding boxes, synchronize with a hardware inspection panel and detection table, and assist engineers with netlist cataloging and troubleshooting.

---

## System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                      CircuSense Frontend                    │
│               React 19 • TypeScript • Tailwind CSS           │
│     (PCB Analysis Canvas, Component Inspector, Table, UI)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / Multipart Upload (/api/*)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Vite Reverse Proxy (Port 3000)            │
│               Proxies /api/* → http://127.0.0.1:8000        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Inference Backend                │
│                 Python 3.11 • OpenCV • Pillow               │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               Authoritative YOLO Object Detector            │
│                Ultralytics YOLO • models/best.pt            │
│               (22 Trained Hardware Component Classes)       │
└─────────────────────────────────────────────────────────────┘
```

---

## Model Taxonomy (22 Classes)

The integrated model detects 22 distinct PCB component classes:

| ID | Class Name | Category Group | ID | Class Name | Category Group |
|---|---|---|---|---|---|
| 0 | `battery` | Power | 11 | `inductor` | Passive |
| 1 | `button` | Electromechanical | 12 | `led` | Semiconductor |
| 2 | `buzzer` | Electromechanical | 13 | `pads` | Mechanical/PCB Feature |
| 3 | `capacitor` | Passive | 14 | `pins` | Connector |
| 4 | `clock` | Semiconductor | 15 | `potentiometer` | Passive |
| 5 | `connector` | Connector | 16 | `relay` | Electromechanical |
| 6 | `diode` | Semiconductor | 17 | `resistor` | Passive |
| 7 | `display` | Display | 18 | `switch` | Electromechanical |
| 8 | `fuse` | Power | 19 | `transducer` | Electromechanical |
| 9 | `heatsink` | Mechanical/PCB Feature | 20 | `transformer` | Power |
| 10 | `ic` | Semiconductor | 21 | `transistor` | Semiconductor |

---

## Quick Start / Local Development

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10 or v3.11)
- Git

---

### 2. Backend Setup (FastAPI & YOLO)

1. Create a Python virtual environment and activate it:
   ```bash
   # Windows (PowerShell)
   python -m venv backend/.venv
   backend\.venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv backend/.venv
   source backend/.venv/bin/activate
   ```

2. Install backend dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. Ensure the trained model is located at `models/best.pt`:
   ```text
   models/
     best.pt
     README.md
   ```

4. Start the FastAPI inference service:
   ```bash
   uvicorn backend.app:app --host 127.0.0.1 --port 8000
   ```
   The API will be available at `http://127.0.0.1:8000` with interactive Swagger docs at `http://127.0.0.1:8000/docs`.

---

### 3. Frontend Setup (React & Vite)

1. In another terminal, install frontend dependencies:
   ```bash
   npm install
   ```

2. Copy the environment configuration (optional):
   ```bash
   cp .env.example .env
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open your browser at [http://localhost:3000](http://localhost:3000).
   Vite automatically proxies `/api/*` calls to the FastAPI backend on port 8000.

---

## API Endpoints

- `GET /api/health` — Verifies detector service status, compute device, and that `best.pt` is loaded with 22 classes.
- `GET /api/model-info` — Returns the complete 22-class taxonomy, input resolution, and default thresholds.
- `POST /api/detect-pcb` — Multipart upload endpoint that accepts real PCB images (`JPG`, `PNG`, `WEBP`) and returns real bounding boxes, confidences, and summary metrics.
- `POST /api/chat-pcb` — AI assistant endpoint receiving real detection context for engineering troubleshooting.

---

## Engineering Testing

### Automated Backend Tests
```bash
python backend/test_backend.py
```

### End-to-End Integration Verification
```bash
python backend/e2e_verification.py
```

### Frontend Type Checking & Production Build
```bash
npm run lint
npm run build
```

---

## Accuracy & Safety Notice

Optical PCB inspection provides surface package detection. A photograph alone cannot verify internal electrical integrity. Always perform benchtop digital multimeter (DMM), oscilloscope, or ESR measurements before component de-soldering or replacement.
