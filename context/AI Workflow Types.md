# CircuSense AI — AI Workflow Types

This document defines the discrete Artificial Intelligence and Computer Vision workflows in CircuSense AI, detailing their input, processing, output, implementation status, dependencies, and operational limitations.

---

## Workflow Matrix Summary

| Workflow ID | Workflow Name | Current Status | Core Technology |
|---|---|---|---|
| **A** | PCB Component Detection | **Implemented** | Ultralytics YOLO (`models/best.pt`) |
| **B** | OCR / Marking Extraction | **Partially Implemented (Stub)** | Pytesseract / PIL Crop |
| **C** | Component Identification | **Planned (Mock Only)** | Heuristic / Netlist Matching |
| **D** | Datasheet / Technical Retrieval | **Partially Implemented (Static)** | Static Lookups in `mockBoards.ts` |
| **E** | PCB Defect / Fault Analysis | **Partially Implemented (UI Only)** | DMM Manual Verification Guides |
| **F** | AI PCB Assistant / Chat | **Partially Implemented** | Gemini 2.5 Flash / Fast Fallback |
| **G** | Circuit Understanding & Netlists | **Planned** | Multi-modal Reasoning / Graph CV |

---

## A. PCB Component Detection

### Purpose
To detect physical hardware components on an optical photograph of a PCB, locate their 2D spatial boundaries, classify their package types, and quantify detection confidence.

### Input
- Optical PCB photograph (`.jpg`, `.png`, `.webp`, `.bmp`).
- Detection parameters: `confidence_threshold` (0.05–0.95), `iou_threshold` (0.1–0.9), `image_size` (typically 640).

### Processing
1. Image validation: Checks file size (&le;30 MB) and minimum resolution (&ge;32×32).
2. Orientation normalization: EXIF transpose using Pillow.
3. RGB conversion: Ensures 3-channel RGB array.
4. Tensor inference: Executes `PCBDetector.predict()` with Ultralytics YOLO on CPU or CUDA.
5. Postprocessing: Clamps pixel bounding boxes to image dimensions and computes percentage normalized coordinates (0%–100%).
6. Taxonomy categorization: Maps 22 class IDs into high-level engineering groups (*Passive*, *Semiconductor*, *Power*, *Electromechanical*, *Connector*, *Display*, *Mechanical*).

### Output
- List of `PCBDetectionItem` objects:
  - `id`: Unique detection identifier (e.g. `det-0001`).
  - `classId`: Integer class index (0–21).
  - `className`: Authoritative class string (e.g. `capacitor`, `ic`, `resistor`).
  - `categoryGroup`: Group name.
  - `confidence`: Confidence score (0.0000–1.0000).
  - `bbox`: Raw pixel coordinates (`x1`, `y1`, `x2`, `y2`).
  - `bboxNormalized`: Percentage coordinates (`x`, `y`, `width`, `height`).
  - `healthStatus`: Defaulted to `"not_assessed"`.
- Summary metrics: Class distribution, category counts, average confidence, low-confidence count.

### Current Implementation Status
**Implemented**. Operating in production code via `backend/detector.py`, `backend/preprocessing.py`, and `backend/postprocessing.py`.

### Dependencies
- `ultralytics >= 8.3.0`
- `torch >= 2.4.0`
- `torchvision >= 0.19.0`
- `pillow >= 10.4.0`
- `numpy`
- Trained weights file: `models/best.pt`

### Known Limitations
- Does not segment rotated/oriented bounding boxes (standard axis-aligned rectangular boxes only).
- Performance degrades on extreme oblique angles or heavy lens glare/shadows.
- Limited to the 22 trained classes; does not distinguish internal IC types (e.g., MCU vs. Op-Amp).

---

## B. OCR / Marking Extraction

### Purpose
To read silkscreen markings, alphanumeric component codes (e.g., SMD resistor codes like `103`, IC part numbers like `NE555P`, diode codes like `1N4007`), and reference designators (`R1`, `C14`, `U3`) from component surfaces.

### Input
- Cropped PIL image corresponding to individual component bounding boxes with 2px margin.

### Processing
1. Image crop based on YOLO bounding boxes.
2. Grayscale conversion (`crop.convert('L')`).
3. Optical text recognition using Tesseract OCR with whitelist (`0-9A-Za-z.-/`) and PSM mode 7 (single text line).

### Output
- `OCRResult` object:
  - `text`: Extracted string.
  - `confidence`: Estimated OCR confidence.
  - `status`: `"detected"` | `"uncertain"` | `"not_found"` | `"not_attempted"`.

### Current Implementation Status
**Partially Implemented (Stub)**. The code exists in `backend/ocr.py`, but `pytesseract` is not included in `backend/requirements.txt`, the external Tesseract C++ binary is not installed, and the endpoint defaults to `run_ocr=False` (`status="not_attempted"`).

### Dependencies
- `pytesseract` (missing from `requirements.txt`)
- Google Tesseract OCR binary (system-level)
- `pillow`

### Known Limitations
- Surface-mount laser etched markings are often microscopic, low-contrast, or obscured by conformal coating, requiring high-resolution macro photography and adaptive thresholding to yield usable OCR results.

---

## C. Component Identification

### Purpose
To resolve generic package detections (e.g., `class: "ic"`) into specific commercial part numbers (e.g., `ATmega328P`, `LM7805CV`) and reference designators (`U1`, `C14`) by correlating OCR text and silkscreen labels.

### Input
- YOLO detection items + OCR extracted strings + board silkscreen context.

### Processing
- Planned: Pattern matching against standard electronic naming conventions (EIA resistor codes, SMD capacitor codes, semiconductor part numbering prefixes like `LM*`, `STM32*`, `AMS*`).

### Output
- Identified component record with manufacturer part number, reference designator, and mounting package.

### Current Implementation Status
**Planned (Mock Only)**. On live YOLO scans, components are assigned sequential fallback names (e.g., `Capacitor #1`, `IC #2`). Real part numbers and reference designators currently exist **only** on static mock benchmark boards defined in `src/data/mockBoards.ts`.

### Dependencies
- Functional OCR workflow (Workflow B).
- Electronic component part numbering dictionary or lookup service.

### Known Limitations
- Bounding box detection alone cannot infer part numbers without legible optical markings.

---

## D. Datasheet & Technical Information Retrieval

### Purpose
To fetch pinout diagrams, absolute maximum ratings, operating voltage, and recommended circuit schematics for identified components.

### Input
- Resolved component part number or category ID.

### Processing
- Current: In-memory dictionary lookup against `DATASHEETS` array in `src/data/mockBoards.ts`.
- Planned: Real-time queries to electronic component distributor APIs (e.g., Octopart, DigiKey, Mouser, Nexar).

### Output
- `Datasheet` record: Pinout table, electrical specifications, typical circuit descriptions, and manufacturer info.

### Current Implementation Status
**Partially Implemented (Static Benchmark Only)**. The UI (`DatasheetsPage.tsx`, `DatasheetViewer.tsx`) is fully functional, but it only displays 4 pre-populated static datasheets (`LM7805`, `AMS1117-3.3`, `ATmega328P`, `1N4007`). No dynamic network retrieval is implemented.

### Dependencies
- Commercial parts distributor API key (Octopart/Nexar/DigiKey) — *Not yet integrated*.

### Known Limitations
- Only 4 components can display datasheets. Newly uploaded components cannot retrieve real-time datasheets.

---

## E. PCB Defect / Fault Analysis

### Purpose
To detect solder bridges, cold solder joints, missing components, lifted pads, blown electrolytic vents, and cracked packages on physical circuit boards.

### Input
- Optical PCB image, component bounding boxes, and manual bench multimeter/ESR probe measurements.

### Processing
- Current: The YOLO model does **not** perform defect classification; it assigns `healthStatus: "not_assessed"`. The UI allows manual recording of multimeter readings (`voltage`, `resistance`, `diode drop`) and compares them against expected limits.
- Planned: Dedicated visual anomaly neural network (e.g., YOLO defect detection model or Siamese anomaly detector trained on IPC-A-610 standards).

### Output
- `ComponentFault` record with severity (`issue`, `inspection`, `normal`), verification stages, and bench measurement statuses (`passed`, `marginal`, `failed`).

### Current Implementation Status
**Partially Implemented (UI & Manual Workflow Only)**. The UI (`FaultAnalysisPage.tsx`, `DiagnosticGuideModal.tsx`, `FaultAlert.tsx`) is complete, but there is **no AI defect model**. Real YOLO scans always return `"not_assessed"`. Fault scenarios currently appear only on preset mock boards.

### Dependencies
- Specialized defect detection ML model (separate from `models/best.pt`).

### Known Limitations
- A 2D photograph cannot verify internal silicon die integrity, latent ESD damage, or solder voids under ball grid array (BGA) packages.

---

## F. AI PCB Assistant / Chat

### Purpose
To provide conversational circuit engineering reasoning, explain circuit topologies, assist technicians in troubleshooting flagged anomalies, and suggest benchtop measurement points.

### Input
- User text query (`string`).
- PCB context: total component count, board code, detected component types, and currently selected component.

### Processing
1. Frontend calls `POST /api/chat-pcb`.
2. Backend inspects `GEMINI_API_KEY`.
3. If API key exists: Calls Google GenAI SDK (`model='gemini-2.5-flash'`) with an engineering prompt incorporating detection context.
4. If API key is absent: Returns an engineering fallback response recommending DMM verification.

### Output
- `ChatResponse`: Assistant reply text, suggested prompt chips, and optional related component/datasheet IDs.

### Current Implementation Status
**Partially Implemented**. The backend endpoint and fallback logic work. However, there is a field mismatch bug: `src/services/aiApi.ts` sends `boardContext` while `backend/schemas.py` expects `analysisContext`. As a result, the live component list is not ingested by the Gemini prompt.

### Dependencies
- `google-genai` Python library.
- Valid `GEMINI_API_KEY` environment variable.

### Known Limitations
- Context window is currently limited to 30 components in the prompt.
- Without a valid API key, responses are limited to static fallback text.

---

## G. Future Circuit Understanding & Netlist Reconstruction

### Purpose
To reconstruct the board's electrical schematic, trace conductive copper connections between pins, build a netlist (SPICE/KiCad compatible), and simulate circuit behavior.

### Input
- High-resolution top and bottom layer PCB photographs, component positions, and trace segmentation masks.

### Processing
- Planned: Trace line extraction (via U-Net segmentation or OpenCV ridge detection), via hole correlation, pad connection graph generation, and netlist synthesis.

### Output
- Interactive netlist graph, schematic diagram, and bus connection list.

### Current Implementation Status
**Planned (Not Implemented)**. The repository contains UI references to netlists, but no trace segmentation, graph extraction, or SPICE generation logic is implemented.

### Dependencies
- Dual-layer image alignment algorithms.
- Copper trace semantic segmentation models.
