# CircuSense AI Trained Models

This directory houses the trained component detection models for CircuSense AI.

## Included Models

### `best.pt`
- **Architecture:** Ultralytics YOLO Object Detection Model
- **File Size:** ~5.14 MB
- **Model Task:** `detect`
- **Class Count:** 22 Classes
- **Class Taxonomy:**
  1. `battery`
  2. `button`
  3. `buzzer`
  4. `capacitor`
  5. `clock`
  6. `connector`
  7. `diode`
  8. `display`
  9. `fuse`
  10. `heatsink`
  11. `ic`
  12. `inductor`
  13. `led`
  14. `pads`
  15. `pins`
  16. `potentiometer`
  17. `relay`
  18. `resistor`
  19. `switch`
  20. `transducer`
  21. `transformer`
  22. `transistor`

## Model Loading in Python
The backend service automatically loads this model at startup via:
```python
from ultralytics import YOLO

model = YOLO("models/best.pt")
```
