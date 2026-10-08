# CircuSense AI — Project Overview

## 1. Project Name
**CircuSense AI** (Repository: `CircuSenseAI`)

## 2. Project Purpose
CircuSense AI is a professional, AI-assisted Printed Circuit Board (PCB) inspection, component detection, and diagnostic assistant application. It helps electronics engineers, hardware diagnostic technicians, QA personnel, and students analyze physical circuit board photographs, catalog surface-mounted and through-hole components, inspect optical features, correlate detected packages with technical reference data, and troubleshoot hardware anomalies through guided bench measurement workflows and generative circuit reasoning.

## 3. Problem Being Solved
Manual optical inspection and troubleshooting of printed circuit boards is error-prone, time-consuming, and cognitively demanding:
- **Component Density & Obfuscation**: Modern high-density PCBs host dozens to hundreds of tiny components with obscure markings, making manual bill-of-materials (BOM) auditing tedious.
- **Silkscreen & Package Ambiguity**: Differentiating similarly packaged passives (e.g., 0603/0805 capacitors vs. resistors) or identifying IC package contours often requires manual cross-referencing.
- **Misleading Visual Anomalies**: Technicians frequently misidentify benign flux residue, solder mask color variations, or manufacturing patinas as electrical faults, leading to destructive or unnecessary de-soldering.
- **Disjointed Troubleshooting**: Hardware testing is typically fragmented across separate tools—optical microscopes, PDF datasheet manuals, physical digital multimeters (DMMs), and disparate notes.

CircuSense AI bridges this gap by unifying local computer vision object detection, client-side optical verification, interactive canvas inspection, guided electrical measurement entry, and an AI engineering assistant in a single interface.

## 4. Current MVP Goal
Deliver a functional, local end-to-end inspection workspace where:
1. A user can upload an optical photograph of a physical PCB (or explore curated offline benchmarks).
2. The system verifies that the image is a physical circuit board (rejecting non-PCB images).
3. A trained, local Ultralytics YOLO model (`models/best.pt`) detects components across 22 hardware package classes with real pixel coordinates, normalized percentages, and confidence scores.
4. An interactive PCB Analysis Canvas displays the image with zoom (40%–400%), pan, filterable bounding boxes, and component highlighting synchronized with a detection netlist table.
5. Users can inspect component parameters, record bench multimeter/ESR verification measurements, review technical datasheets, export audit reports as JSON, and consult an AI circuit reasoning assistant.

## 5. Target Users
- **Hardware Repair & Diagnostics Technicians**: Bench technicians needing rapid identification of components and guided test points.
- **Electronics & Embedded Systems Engineers**: Hardware designers validating prototype assembly and component placement.
- **Quality Assurance (QA) & Assembly Line Inspectors**: Operators conducting first-article optical verification on assembled boards.
- **Engineering Students & Hobbyists**: Learners reverse-engineering circuits, reading board layouts, and understanding component functions.

## 6. Current Technology Stack

### Frontend
- **Framework**: React 19 (`react` 19.0.1, `react-dom` 19.0.1)
- **Language**: TypeScript (~5.8.2)
- **Bundler & Dev Server**: Vite 6.2.3 (`@vitejs/plugin-react` 5.0.4) with reverse proxy (`/api/*` → `http://127.0.0.1:8000`)
- **Styling**: Tailwind CSS v4 (`tailwindcss` 4.1.14, `@tailwindcss/vite` 4.1.14), custom design system tokens in `src/index.css`
- **Iconography**: Lucide React (`lucide-react` 0.546.0)
- **Optical Preprocessing**: HTML5 Canvas 2D API for client-side substrate color, edge density, and paper luminance checks
- **Client Storage**:
  - `IndexedDB` (`circusense_store_v1`): Stores full-resolution raw PCB image blobs to bypass browser quotas.
  - `localStorage`: Stores simulated user session profiles, saved project records, and UI themes.

### Backend
- **Framework**: Python FastAPI (>=0.115.0) with ASGI server Uvicorn (>=0.30.0)
- **Data Validation**: Pydantic v2 (>=2.9.0)
- **Multipart Form Handling**: `python-multipart` (>=0.0.12)
- **Image Processing**: Pillow (>=10.4.0) for EXIF orientation correction, RGB conversion, and box cropping; OpenCV (`opencv-python-headless` >=4.10.0)

### AI & Machine Learning
- **Authoritative Object Detector**: Ultralytics YOLO (>=8.3.0) running on PyTorch (`torch` >=2.4.0, `torchvision` >=0.19.0)
- **Model File**: `models/best.pt` (~5.38 MB PyTorch weights)
- **Inference Runtime**: CPU or CUDA (automatic hardware detection)
- **LLM Circuit Assistant**: Google Gemini (`gemini-2.5-flash`) via the `google.genai` Python SDK (backend) and `@google/genai` (frontend)
- **Optical Character Recognition (OCR)**: Pytesseract stub (`backend/ocr.py`), currently unconfigured/optional

## 7. Current Model Information
- **Model Architecture**: Ultralytics YOLO Object Detection Model (YOLOv8/v11 architecture)
- **Model File**: `models/best.pt` (Location: `models/best.pt`)
- **Model Size**: ~5.38 MB (5,389,701 bytes)
- **Task**: `detect` (2D bounding box regression and classification)
- **Input Resolution**: 640×640 pixels (configurable via `IMAGE_SIZE` environment variable)
- **Default Confidence Threshold**: 0.25 (configurable in UI and backend)
- **Default IoU Threshold (NMS)**: 0.45
- **Execution Target**: `backend/detector.py` via `PCBDetector` singleton

## 8. Current Supported Component Classes (22 Classes)
The model taxonomy covers 22 distinct hardware package and feature classes:

| ID | Class Name | Category Group | Description / Package Scope |
|---|---|---|---|
| 0 | `battery` | Power | Coin cells (CR2032), battery clips, terminal blocks |
| 1 | `button` | Electromechanical | Momentary tactile push buttons, reset switches |
| 2 | `buzzer` | Electromechanical | Piezo buzzers, magnetic audio transducers |
| 3 | `capacitor` | Passive | Ceramic capacitors (SMD 0402–1206), electrolytic cans, tantalum |
| 4 | `clock` | Semiconductor | Crystal oscillators, RTC resonators, clock generators |
| 5 | `connector` | Connector | USB ports, barrel jacks, terminal blocks, pin headers |
| 6 | `diode` | Semiconductor | Rectifier diodes (1N4007, SMA), Schottky, Zener packages |
| 7 | `display` | Display | 7-segment displays, OLED/LCD modules, character displays |
| 8 | `fuse` | Power | PTC resettable polyfuses, glass cartridge fuses, SMD fuses |
| 9 | `heatsink` | Mechanical/PCB Feature | Aluminum extruded heatsinks, thermal clips |
| 10 | `ic` | Semiconductor | Integrated circuits (SOIC, TSSOP, QFP, DIP, QFN, BGA) |
| 11 | `inductor` | Passive | Toroidal chokes, SMD power inductors, ferrite beads |
| 12 | `led` | Semiconductor | Surface-mount LEDs (0603, 0805), 3mm/5mm THT indicator LEDs |
| 13 | `pads` | Mechanical/PCB Feature | Solder test pads, unpopulated footprints, fiducials |
| 14 | `pins` | Connector | Through-hole header pins, test point loops |
| 15 | `potentiometer` | Passive | Trimpots, rotary potentiometers, variable resistors |
| 16 | `relay` | Electromechanical | Electromagnetic relays, solid-state relays |
| 17 | `resistor` | Passive | Chip resistors (SMD 0402–2512), axial leaded resistors |
| 18 | `switch` | Electromechanical | Slide switches, DIP switches, toggle switches |
| 19 | `transducer` | Electromechanical | Ultrasonic sensors, microphones, pressure transducers |
| 20 | `transformer` | Power | Flyback transformers, pulse isolation transformers |
| 21 | `transistor` | Semiconductor | Bipolar (BJT) & MOSFET transistors (SOT-23, TO-220, TO-92) |

## 9. Current Major Features
- **Authoritative YOLO Detection Engine**: Real detection of 22 PCB component classes from uploaded images via FastAPI.
- **Client-Side Optical Gatekeeper**: Fast pre-validation rejecting white documents, selfies, and natural photos before server upload.
- **Interactive PCB Analysis Canvas**: High-fidelity zoom (40%–400%), pan, color-coded bounding boxes, hover highlighting, and class filtering.
- **Synchronized Netlist Table**: Filterable and sortable table linked directly to canvas bounding boxes.
- **Component Inspector**: Deep-dive inspection panel displaying raw pixel bounds, normalized bounds, confidence, and package grouping.
- **Hardware Diagnostic Guide Modal**: Multi-tier electrical verification workflow for recording multimeter and ESR measurements.
- **Integrated Datasheet Viewer**: Component pinouts, electrical limits, and typical circuits for indexed parts.
- **Offline Benchmark Boards**: Three pre-configured boards (5V Linear PSU, ESP32 IoT Sensor Hub, L298N Motor Driver) for testing without camera input.
- **AI Circuit Assistant**: Conversational engineering troubleshooting powered by Gemini with detection context.
- **Local Project Storage**: Project saving, audit history review, and JSON report export powered by IndexedDB and localStorage.
- **Comprehensive Landing Page**: Marketing and onboarding portal with 10 sections and auth modal.

## 10. Current Project Structure
```text
CircuSenseAI/
├── context/                 # Persistent Project Context & Architectural Documentation
├── backend/                 # Python FastAPI inference backend & model orchestration
├── models/                  # Ultralytics YOLO model weights (best.pt)
├── public/assets/           # Static test images (sample-pcb.png)
└── src/                     # React 19 frontend application
    ├── components/          # Canvas, Table, Inspector, Modals, Navbar, Sidebar
    │   ├── auth/            # Login, Signup, Forgot Password forms
    │   └── landing/         # Marketing landing page sections
    ├── context/             # AuthContext, ThemeContext
    ├── data/                # Static mock boards, components, and datasheets
    ├── hooks/               # useAuth custom hook
    ├── pages/               # Analyzer, Results, Components, Faults, Datasheets, etc.
    ├── routes/              # Route guards
    ├── services/            # detectionApi, pcbApi, pcbValidator, storageService, aiApi
    └── types/               # Core TypeScript interface definitions
```

## 11. Feature Implementation Matrix

| Feature | Status | Notes |
|---|---|---|
| 22-Class YOLO Object Detection | **Implemented** | Working via `backend/detector.py` and `models/best.pt` |
| Image Preprocessing (EXIF, RGB) | **Implemented** | Working via `backend/preprocessing.py` |
| Bounding Box Normalization (0–100%) | **Implemented** | Working via `backend/postprocessing.py` |
| Client-Side CV Image Gatekeeper | **Implemented** | Working via `src/services/pcbValidator.ts` |
| Interactive Canvas (Pan / Zoom / Overlays) | **Implemented** | Working via `src/components/PCBAnalysisCanvas.tsx` |
| Netlist & Detection Table | **Implemented** | Working via `src/components/DetectionTable.tsx` |
| Component Parameter Inspector | **Implemented** | Working via `src/components/ComponentInspector.tsx` |
| Offline Benchmark Boards | **Implemented** | 3 preset boards in `src/data/mockBoards.ts` |
| Client Storage (IndexedDB + localStorage) | **Implemented** | Working via `storageService.ts` and `pcbApi.ts` |
| JSON Report Export | **Implemented** | Implemented in `SaveProjectModal.tsx` |
| AI Chat Assistant Backend Endpoint | **Partially Implemented** | Backend works, but frontend sends `boardContext` instead of expected `analysisContext` |
| Silkscreen Marking OCR | **Partially Implemented** | Stub in `backend/ocr.py`; dependencies missing from `requirements.txt` |
| Hardware Fault / Defect Analysis | **Partially Implemented** | UI & manual measurement workflow exist; YOLO model does NOT detect defects |
| User Authentication | **Partially Implemented** | Complete UI, but state is simulated in browser `localStorage` |
| Server-Side Persistent Database | **Planned** | No server database (PostgreSQL/SQLite) currently exists |
| Live External Datasheet API | **Planned** | No live API (Octopart/DigiKey); static records only |
| Automated Defect AI Model | **Planned** | Requires separate trained defect detection model |
| Circuit Netlist & Schematic Reconstruction | **Planned** | Requires trace extraction and optical character netlist pairing |
| Vector Store / RAG Pipeline | **Planned** | UI badge is cosmetic; no vector database is installed |
| Containerization & Production CI/CD | **Planned** | No Dockerfile or automated pipeline exists |
