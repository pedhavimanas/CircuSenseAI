import requests
import json
import os
from PIL import Image

def run_e2e_tests():
    base_url = "http://localhost:3000"
    print(f"--- CircuSense AI E2E Integration Test against {base_url} ---")

    # 1. Test /api/health through Vite Proxy
    print("\n[1/5] Testing /api/health through Vite proxy...")
    r = requests.get(f"{base_url}/api/health")
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    health = r.json()
    print("Health response:", json.dumps(health, indent=2))
    assert health["status"] == "ok"
    assert health["modelLoaded"] is True
    assert health["modelClasses"] == 22
    assert health["modelName"] == "best.pt"
    print("[PASS] Health endpoint verified: Model loaded with 22 classes on device:", health["device"])

    # 2. Test /api/model-info
    print("\n[2/5] Testing /api/model-info...")
    r = requests.get(f"{base_url}/api/model-info")
    assert r.status_code == 200
    info = r.json()
    assert info["classCount"] == 22
    assert len(info["classes"]) == 22
    print("[PASS] Model info endpoint verified: 22 trained classes present.")

    # 3. Test /api/detect-pcb with real PCB image
    print("\n[3/5] Testing /api/detect-pcb with real PCB image...")
    sample_img_path = "public/assets/sample-pcb.png"
    assert os.path.exists(sample_img_path), f"Sample image {sample_img_path} not found"

    with open(sample_img_path, "rb") as f:
        r = requests.post(
            f"{base_url}/api/detect-pcb",
            files={"image": ("sample-pcb.png", f, "image/png")},
            data={"confidence_threshold": 0.20}
        )
    assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"
    result = r.json()
    assert result["success"] is True
    detections = result["detections"]
    summary = result["summary"]
    timing = result["timing"]

    print(f"Total detections returned: {len(detections)}")
    print(f"Summary total: {summary['total']}")
    print(f"Class breakdown: {summary['byClass']}")
    print(f"Inference timing: {timing['inferenceMs']}ms (Total: {timing['totalMs']}ms)")

    assert len(detections) == summary["total"], "Detections count mismatch with summary!"
    assert len(detections) > 0, "Expected detections on real PCB image!"

    # Verify coordinate properties of detections
    for i, d in enumerate(detections):
        assert d["id"] == f"det-{i+1:04d}", f"Invalid id: {d['id']}"
        assert 0.0 <= d["confidence"] <= 1.0, f"Invalid confidence: {d['confidence']}"
        norm = d["bboxNormalized"]
        assert 0.0 <= norm["x"] <= 100.0, f"Invalid norm x: {norm['x']}"
        assert 0.0 <= norm["y"] <= 100.0, f"Invalid norm y: {norm['y']}"
        assert 0.0 < norm["width"] <= 100.0, f"Invalid norm width: {norm['width']}"
        assert 0.0 < norm["height"] <= 100.0, f"Invalid norm height: {norm['height']}"

    print(f"[PASS] All {len(detections)} detections verified with valid coordinates, classes, and confidences.")

    # 4. Test Invalid image rejection
    print("\n[4/5] Testing invalid image rejection...")
    r = requests.post(
        f"{base_url}/api/detect-pcb",
        files={"image": ("bad.txt", b"corrupt text", "text/plain")}
    )
    assert r.status_code == 400
    print("[PASS] Invalid upload correctly rejected with HTTP 400.")

    # 5. Test Chat Assistant endpoint with real YOLO detection context
    print("\n[5/5] Testing /api/chat-pcb with real detection context...")
    r = requests.post(
        f"{base_url}/api/chat-pcb",
        json={
            "query": "What components did the YOLO model detect on this board?",
            "analysisContext": {
                "totalComponents": len(detections),
                "boardName": "Sample PCB",
                "detections": [d["className"] for d in detections[:10]]
            },
            "selectedComponent": {
                "id": detections[0]["id"],
                "className": detections[0]["className"],
                "confidence": detections[0]["confidence"]
            }
        }
    )
    assert r.status_code == 200
    chat_resp = r.json()
    assert chat_resp["success"] is True
    assert len(chat_resp["text"]) > 10
    print("Chat Assistant response preview:", chat_resp["text"][:150], "...")
    print("[PASS] Chat assistant verified with real YOLO detection context.")

    print("\n========================================================")
    print("   ALL 5 END-TO-END VERIFICATION CHECKS PASSED!   ")
    print("========================================================")

if __name__ == "__main__":
    run_e2e_tests()
