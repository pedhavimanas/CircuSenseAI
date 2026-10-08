# CircuSense AI — Code Standards

This document establishes the mandatory engineering standards and conventions for the CircuSense AI codebase. All contributors and AI coding assistants must adhere to these guidelines.

---

## 1. General Principles
1. **Source Code is Ground Truth**: Documentation provides guidance, but current working code reflects actual behavior. Always inspect real files before proposing changes.
2. **Never Rewrite Working Modules**: Modify incrementally. Do not discard or replace working implementations with untested boilerplate.
3. **Preserve Backward Compatibility**: Ensure that existing API response schemas, component props, and client storage formats remain compatible.
4. **No Phantom Functionality**: Never present mock or placeholder logic as real AI inference. Clearly label demo, fallback, and benchmark pathways.
5. **Zero Unnecessary Dependencies**: Do not install additional npm or pip packages if standard libraries, existing utilities, or minimal custom logic can accomplish the task.
6. **Mandatory Verification**: Every code modification must be verified for syntax, typing, and runtime correctness.

---

## 2. Frontend Standards (React 19 & TypeScript)

### File & Directory Conventions
- **Component Files**: Named in `PascalCase` matching the exported component name (e.g. `PCBAnalysisCanvas.tsx`, `ComponentInspector.tsx`).
- **Utility / Service Files**: Named in `camelCase` (e.g. `detectionApi.ts`, `storageService.ts`, `pcbValidator.ts`).
- **One Component per File**: Keep components focused. Subcomponents used only within a single parent should reside in the same file or in a dedicated subfolder.

### TypeScript Conventions
- **Strict Typing**: Avoid `any`. If raw API data has dynamic keys, use `Record<string, unknown>` or explicit discriminated unions.
- **Explicit Interfaces**: All component props must be defined using an explicit interface named `<ComponentName>Props` (e.g. `DetectionTableProps`).
- **Centralized Domain Models**: Core application types (`PCBBoard`, `PCBDetection`, `PCBComponent`, `Datasheet`) must be defined in `src/types/index.ts` rather than redefined across individual components.

### React Component Architecture
- **Functional Components**: Use standard functional components with React hooks.
- **Clean State Management**:
  - Keep state localized to the lowest practical component tree level.
  - Global cross-cutting state (auth, theme) belongs in `src/context/`.
  - Avoid duplicate state: derive values using `useMemo` wherever possible (e.g., filtered components, category counts).
- **DOM & Canvas Performance**:
  - Optical canvas operations, mouse drag panning, and zoom scaling must use `useCallback` and `useRef` to avoid unnecessary re-renders.
  - Never store raw multi-megabyte image strings directly in standard component state if an ObjectURL or IndexedDB key suffices.

### API & Network Calls
- **Service Isolation**: Components must never call `fetch()` directly. All network requests must be encapsulated within modular service objects in `src/services/` (e.g. `detectionApi`, `pcbApi`, `aiApi`).
- **AbortController Support**: Long-running requests (such as image inference or validation) should accept an optional `AbortSignal` to cancel requests if the user navigates away or uploads a new file.
- **Defensive Error Handling**: Always catch errors, parse backend HTTP detail messages (`errorJson.detail`), and provide user-friendly feedback in the UI.

### Styling & CSS (Tailwind CSS v4)
- **Design System Consistency**: Use established color tokens defined in `src/index.css`:
  - Dark background: `#0A0C0E`
  - Dark surfaces: `#12151A`, `#1A1E25`
  - Accent cyan: `#00D1FF`, hover: `#00B8E0`
  - Subdued borders: `border-slate-800`
- **Class Grouping**: Organize Tailwind utility classes logically (layout &rarr; sizing &rarr; spacing &rarr; colors &rarr; typography &rarr; interactive states).

---

## 3. Backend Standards (Python & FastAPI)

### Framework & Code Structure
- **PEP 8 Compliance**: Follow standard Python conventions (snake_case functions and variables, PascalCase classes).
- **Service Separation**:
  - `app.py`: Route handlers, request validation, and HTTP responses only.
  - `detector.py`: Model loading, tensor device management, and inference execution.
  - `preprocessing.py`: Image I/O, format checking, and array transforms.
  - `postprocessing.py`: Bounding box clamping, percentage normalization, and metrics aggregation.
  - `schemas.py`: Pure Pydantic data schemas.
- **Singleton Model Pattern**: Machine learning models must be loaded once on server startup via the FastAPI lifespan context manager. Never reload the `.pt` model weights inside a request handler.

### Pydantic Schemas
- **Strict Data Contracts**: All incoming request bodies and outgoing responses must use explicit Pydantic v2 `BaseModel` classes with type annotations.
- **Coordinate Conventions**:
  - Raw pixel boxes: `RawBBox(x1, y1, x2, y2)` with float values.
  - Normalized boxes: `NormalizedBBox(x, y, width, height)` as percentages from `0.0` to `100.0`.
- **Field Consistency**: Ensure field names match between frontend TypeScript interfaces and Pydantic models (e.g., `analysisContext` vs `boardContext`).

### Error Handling & Logging
- **HTTP Exceptions**: Raise `fastapi.HTTPException` with appropriate status codes (`400` for bad image data, `422` for schema violations, `503` for unavailable model).
- **Structured Logging**: Use Python's standard `logging.getLogger("circusense.*")`. Log request IDs, input image filenames, inference times, and class counts. Never use bare `print()` statements in production backend modules.

---

## 4. AI & Machine Learning Standards

### Model Configuration & Environment
- **External Configuration**: Model paths, confidence thresholds, and image dimensions must be configurable via environment variables (`MODEL_PATH`, `CONFIDENCE_THRESHOLD`, `IMAGE_SIZE`) with sensible fallbacks.
- **Hardware Agnostic**: Always check `torch.cuda.is_available()` and default to `device="cpu"` smoothly without crashing.

### Preprocessing & Postprocessing
- **Boundary Clamping**: Never trust raw model outputs to stay within image boundaries. Always clamp bounding boxes:
  ```python
  x1 = max(0.0, min(float(x1_raw), float(image_width)))
  y1 = max(0.0, min(float(y1_raw), float(image_height)))
  x2 = max(0.0, min(float(x2_raw), float(image_width)))
  y2 = max(0.0, min(float(y2_raw), float(image_height)))
  ```
- **Degenerate Box Rejection**: Filter out boxes with zero or negative width/height ($w \le 0.5$ or $h \le 0.5$ pixels) before serializing responses.
- **No Hallucinated Detections**: If the model detects zero components above the threshold, return an empty detections list honestly with HTTP 200. Never substitute mock components into a real upload response.

### Model Weights Management
- Model files belong in `models/` (e.g. `models/best.pt`).
- Do not commit experimental, large multi-gigabyte checkpoints to git without using Git LFS or external artifact storage.

---

## 5. Testing & Maintenance Standards
- **Automated Regression Testing**:
  - Run `backend/test_backend.py` whenever backend logic or model dependencies change.
  - Run `npm run lint` (`tsc --noEmit`) before completing frontend tasks to verify zero TypeScript compilation errors.
- **Update Context Files**:
  - When new endpoints are added, update `context/Architecture.md`.
  - When new workflows are introduced, update `context/AI Workflow Types.md`.
  - Track completed milestones and newly identified issues in `context/Progress Tracker.md`.
