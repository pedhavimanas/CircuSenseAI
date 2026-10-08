# CircuSense AI — Architecture

## 1. System Overview

CircuSense AI uses a decoupled hybrid architecture:
- A high-performance **Python FastAPI Inference Backend** running locally, responsible for image ingestion, computer vision preprocessing, and neural object detection using **Ultralytics YOLO** (`models/best.pt`).
- A modern **React 19 Single Page Application (SPA)** written in **TypeScript** and styled with **Tailwind CSS v4**, served by **Vite**.
- A **Vite Reverse Proxy** routing `/api/*` traffic directly to the backend ASGI service on port 8000.
- A **Dual Client-Side Storage Architecture** utilizing **IndexedDB** for high-resolution PCB image blobs and **localStorage** for user state and project metadata.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        CircuSense Frontend (SPA)                       │
│             React 19 • TypeScript • Tailwind CSS v4 • Vite             │
│        (PCB Analysis Canvas, Inspector, Netlist Table, Modals)         │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ HTTP / Multipart Upload (/api/*)
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Vite Reverse Proxy (Port 3000)                    │
│                 Proxies /api/* ──► http://127.0.0.1:8000               │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       FastAPI Inference Backend                        │
│                 Python 3.10/3.11 • Uvicorn • Pydantic v2               │
│          Endpoints: /health, /model-info, /detect-pcb, /chat-pcb       │
└──────────────────┬─────────────────┬─────────────────┬─────────────────┘
                   │                 │                 │
                   ▼                 ▼                 ▼
          ┌────────────────┐ ┌───────────────┐ ┌────────────────┐
          │ Preprocessing  │ │ Ultralytics   │ │ Postprocessing │
          │ Pillow EXIF/RGB│ │ YOLO best.pt  │ │ Clamping & Norm│
          └────────────────┘ └───────────────┘ └────────────────┘
```

---

## 2. Frontend Architecture

### Technology Foundation
- **React 19** (`react` 19.0.1, `react-dom` 19.0.1) using functional components and hooks.
- **TypeScript** (~5.8.2) ensuring end-to-end interface contracts across all UI state.
- **Vite 6.2.3** providing rapid development bundling, HMR, and API reverse proxying.
- **Tailwind CSS v4** utilizing modern `@theme` variables and tokens defined in `src/index.css`.

### Directory & Modular Separation
- `src/pages/`: Main application screen controllers:
  - `Dashboard.tsx`: Welcome metrics, quick image drop zone, benchmark board selector, and recent project list.
  - `Analyzer.tsx`: Interactive detection canvas with live confidence threshold adjustment and re-scan trigger.
  - `Results.tsx`: Split-screen workspace combining the canvas, component inspector, and detection table.
  - `ComponentsPage.tsx`: Searchable and filterable catalog of all identified components.
  - `FaultAnalysisPage.tsx`: Visual anomaly review, diagnostic notices, and measurement test point logs.
  - `DatasheetsPage.tsx`: Technical specifications, pinouts, and electrical limits viewer.
  - `AIAssistantPage.tsx`: Dedicated engineering assistant chat interface with board context.
  - `MyProjectsPage.tsx`: Historical project audit records grid.
  - `SettingsPage.tsx`: Live backend diagnostics (`/api/health`, `/api/model-info`) and CV settings.
- `src/components/`: Reusable interface components:
  - `PCBAnalysisCanvas.tsx`: Primary inspection canvas supporting pan, zoom (40%–400%), box selection, and filter overlays.
  - `PCBViewer.tsx`: Synthetic vector/SVG circuit board viewer used for preset demo benchmarks.
  - `DetectionTable.tsx`: Multi-column sortable table of detected components.
  - `ComponentInspector.tsx`: Detailed right-hand drawer showing selected component coordinates and electrical attributes.
  - `UploadModal.tsx`: Full-featured upload modal with image dimension extraction, format checks, and threshold sliders.
  - `DiagnosticGuideModal.tsx`: Step-by-step DMM/ESR measurement recording modal.
  - `SaveProjectModal.tsx`: Project persistence and JSON audit report export modal.
  - `Navbar.tsx` & `Sidebar.tsx`: Global navigation and active board picker.
  - `auth/`: Forms for login, signup, password reset, and layout.
  - `landing/`: 10 marketing landing page sections.
- `src/context/`:
  - `AuthContext.tsx`: Client-side authentication session state, stored in `localStorage`.
  - `ThemeContext.tsx`: Dark/Light theme toggle, updating DOM attributes and `localStorage`.
- `src/services/`:
  - `detectionApi.ts`: REST client for backend health, model info, and YOLO inference (`/api/detect-pcb`).
  - `pcbApi.ts`: High-level orchestrator coordinating image caching in IndexedDB, calling `detectionApi`, and persisting active boards.
  - `pcbValidator.ts`: In-browser HTML5 Canvas optical analyzer checking substrate solder mask colors and edge density.
  - `storageService.ts`: IndexedDB utility managing large image binary blobs.
  - `aiApi.ts`: Client fetch wrapper for `/api/chat-pcb`.
  - `componentApi.ts`: In-memory measurement recording and datasheet lookups.
- `src/types/`:
  - `index.ts`: Authoritative TypeScript models (`PCBBoard`, `PCBDetection`, `PCBComponent`, `Datasheet`, `ProjectRecord`, etc.).

---

## 3. Backend Architecture

### Framework & Components
- **FastAPI 0.115+**: Async REST API with automatic OpenAPI documentation (`/docs`).
- **Lifespan Manager**: Loads `PCBDetector` singleton on server startup and logs device and class availability.
- **Pydantic v2**: Type validation and schema generation in `backend/schemas.py`.

### Backend Modules
1. `backend/app.py`: Application entry point, CORS middleware, lifespan events, and route handlers.
2. `backend/detector.py`: The `PCBDetector` singleton class. Loads `models/best.pt`, verifies 22 classes, selects compute device (`cuda` if available, otherwise `cpu`), and provides the `predict()` inference method.
3. `backend/preprocessing.py`: Validates uploaded file bytes (size cap: 30 MB, formats: JPG, PNG, WEBP, BMP), corrects EXIF orientation via Pillow, ensures RGB mode, enforces minimum 32×32 resolution, and returns an RGB NumPy array.
4. `backend/postprocessing.py`: Extracts raw bounding box tensors from YOLO results, clamps coordinates to image boundaries, converts pixel values to 0–100% normalized percentages, assigns high-level category groups, and calculates summary metrics.
5. `backend/ocr.py`: Optional component marking crop reader using `pytesseract`. (Currently a stub; gracefully returns `status="not_attempted"` when disabled or when dependencies are absent).
6. `backend/schemas.py`: Pydantic models for bounding boxes, detection items, analysis responses, health checks, and chat requests.

---

## 4. End-to-End AI Inspection Pipeline

The current execution pipeline processes images through the following stages:

```text
[PCB Image File (JPG/PNG/WEBP)]
              │
              ▼
    1. Optical Preprocessing
       • In-browser CV Gatekeeper (pcbValidator.ts)
       • Backend Validation & EXIF auto-rotation (preprocessing.py)
       • Minimum resolution & 3-channel RGB conversion
              │
              ▼
    2. YOLO Component Detection
       • Ultralytics YOLO model (models/best.pt)
       • 22 Hardware package classes
       • Tensor bounding box regression & confidence scoring
              │
              ▼
    3. Postprocessing & Normalization
       • Boundary clamping: [0, width], [0, height]
       • Percentage normalization: 0% to 100%
       • Hardware category mapping (Passive, Semiconductor, Power, etc.)
              │
              ▼
    4. Optical Character Recognition (OCR) ──► [PARTIALLY IMPLEMENTED / STUB]
       • backend/ocr.py crop extraction
       • Currently defaults to status: "not_attempted"
              │
              ▼
    5. Component Part Number Identification ──► [PLANNED / MOCK ONLY]
       • Real YOLO detections receive sequential labels (e.g. "Capacitor #1")
       • Full part numbers only exist on static benchmark boards
              │
              ▼
    6. Technical / Datasheet Retrieval ───────► [STATIC LOOKUP ONLY]
       • Matches against 4 hardcoded datasheets in src/data/mockBoards.ts
       • No live external parts API integrated yet
              │
              ▼
    7. Frontend Result Display
       • PCB Analysis Canvas with interactive pan, zoom, overlays
       • Synchronized netlist table & parameter inspector
       • Multi-tier bench measurement verification guide
```

---

## 5. Current API Endpoints

All backend endpoints are prefixed with `/api` and proxied by Vite:

| Method | Endpoint | Request Body | Response Schema | Description |
|---|---|---|---|---|
| `GET` | `/api/health` | None | `HealthResponse` | Returns service status, loaded model name, 22 class count, and compute device (`cpu` / `cuda`). |
| `GET` | `/api/model-info` | None | `ModelInfoResponse` | Returns the complete 22-class taxonomy, default confidence (0.25), IoU (0.45), and resolution (640). |
| `POST` | `/api/detect-pcb` | `multipart/form-data`<br>• `image` (File)<br>• `confidence_threshold` (float, opt)<br>• `iou_threshold` (float, opt)<br>• `image_size` (int, opt)<br>• `run_ocr` (bool, opt) | `AnalysisResponse` | Primary inference endpoint. Runs YOLO on uploaded image and returns normalized boxes, metrics, and timings. |
| `POST` | `/api/verify-pcb` | `application/json`<br>`{ "imageBase64": str, "fileName": str }` | `JSONResponse`<br>`{ "isPcb": bool, "confidence": float, "reason": str }` | Basic payload format sanity check endpoint. |
| `POST` | `/api/chat-pcb` | `application/json`<br>`ChatRequest` | `ChatResponse` | AI circuit assistant endpoint invoking Gemini 2.5 Flash with detection context, or returning an engineering fallback. |

---

## 6. Frontend-to-Backend Communication

1. **Development Proxy**:
   In `vite.config.ts`, requests matching `/api/*` are automatically forwarded:
   ```typescript
   proxy: {
     '/api': {
       target: 'http://127.0.0.1:8000',
       changeOrigin: true,
       secure: false,
     },
   }
   ```
2. **Fetch Architecture**:
   The frontend communicates with the backend via native `fetch()` calls wrapped in services (`detectionApi.ts`, `aiApi.ts`).
3. **Known Contract Issue**:
   In `src/services/aiApi.ts`, the chat client sends:
   ```json
   { "query": "...", "boardContext": { ... }, "selectedComponent": { ... } }
   ```
   However, `backend/schemas.py` and `backend/app.py` expect:
   ```json
   { "query": "...", "analysisContext": { ... }, "selectedComponent": { ... } }
   ```
   Because of this key mismatch, the backend cannot access live detected board context and defaults to an empty context.

---

## 7. Storage Architecture

CircuSense AI currently has **no server-side database** (no PostgreSQL, SQLite, or MongoDB). All persistence is handled client-side:

### 1. IndexedDB (`storageService.ts`)
- **Database Name**: `circusense_store_v1`
- **Object Store**: `pcb_images`
- **Purpose**: Caches raw high-resolution PCB image blobs and data URLs.
- **Rationale**: Browser `localStorage` has a strict quota (typically ~5 MB). Storing multi-megabyte image strings directly in `localStorage` quickly causes `QuotaExceededError`. Storing images in IndexedDB allows storing large images safely.

### 2. Browser LocalStorage (`pcbApi.ts`, `AuthContext.tsx`, `App.tsx`)
- `circusense_auth_user`: Stores the current simulated user profile (`id`, `name`, `email`, `role`).
- `circusense_projects_v2`: Stores serialized project records (`ProjectRecord[]`). Large image data is replaced with an IndexedDB reference pointer (`indexeddb:img-<id>`).
- `circusense_active_board_v2`: Caches the currently loaded board model.
- `circusense_theme`: Stores the user's active theme preference (`light` or `dark`).

---

## 8. Authentication State

- **Current Implementation**: **Client-side simulation only**.
- Implemented in `src/context/AuthContext.tsx`.
- Accounts are created with artificial 500ms delay to simulate network latency and saved to `localStorage` under `circusense_auth_user`.
- A built-in **"Demo Account"** option allows instant login with mock credentials (`alex.chen@circusense.ai`).
- **No Backend Auth**: There are no `/api/auth/login`, `/api/auth/register`, JWT tokens, session cookies, password hashing, or database tables.
- **Route Gating**: Managed in `src/App.tsx`. If `isAuthenticated` is false, `App.tsx` renders `AuthPage` (which embeds the marketing landing page and auth portal).

---

## 9. Environment Variables

The project configuration relies on the following environment variables (defined in `.env.example`):

| Variable | Scope | Purpose | Default |
|---|---|---|---|
| `GEMINI_API_KEY` | Backend | API key for Google Gemini circuit reasoning (`gemini-2.5-flash`). Optional; local YOLO detection runs without it. | `""` |
| `MODEL_PATH` | Backend | Path to the trained YOLO model weights. | `"models/best.pt"` |
| `CONFIDENCE_THRESHOLD` | Backend | Default confidence score cutoff for component detection. | `0.25` |
| `IOU_THRESHOLD` | Backend | Non-Maximum Suppression (NMS) IoU overlap threshold. | `0.45` |
| `IMAGE_SIZE` | Backend | Inference input resolution. | `640` |
| `DEVICE` | Backend | Compute device (`"auto"`, `"cpu"`, or `"cuda"`). | `"auto"` |
| `VITE_API_BASE_URL` | Frontend | Target backend URL if bypassing the Vite reverse proxy. | `"http://localhost:8000"` |
| `DISABLE_HMR` | Frontend | Set to `"true"` to disable Hot Module Replacement in automated runners. | `undefined` |
