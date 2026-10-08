import torch
import numpy as np
import cv2
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
import base64

def generate_gradcam(
    image_bytes: bytes,
    model,
    predicted_class_idx: int,
    device: str = 'cpu'
) -> str:
    """
    Generate Grad-CAM heatmap overlay on the input image.
    Returns base64 encoded PNG string to send to frontend.
    """
    try:
        # 1. Decode image
        nparr = np.frombuffer(image_bytes, np.uint8)
        img_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img_bgr is None:
            return ""

        img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
        img_resized = cv2.resize(img_rgb, (224, 224))
        img_float = img_resized.astype(np.float32) / 255.0

        # 2. Preprocess for model
        mean = np.array([0.485, 0.456, 0.406])
        std  = np.array([0.229, 0.224, 0.225])
        img_norm = (img_float - mean) / std
        tensor = torch.tensor(img_norm).permute(2, 0, 1).unsqueeze(0).float().to(device)

        # 3. Target the last convolutional feature block of EfficientNet-B0
        target_layers = [model.backbone.features[-1]]
        targets = [ClassifierOutputTarget(predicted_class_idx)]

        # 4. Generate CAM
        with GradCAM(model=model, target_layers=target_layers) as cam:
            grayscale_cam = cam(input_tensor=tensor, targets=targets)[0]

        # 5. Overlay heatmap on original image
        visualization = show_cam_on_image(img_float, grayscale_cam, use_rgb=True)

        # 6. Encode to base64
        _, buffer = cv2.imencode('.png', cv2.cvtColor(visualization, cv2.COLOR_RGB2BGR))
        b64 = base64.b64encode(buffer).decode('utf-8')
        return f"data:image/png;base64,{b64}"

    except Exception as e:
        print(f"GradCAM generation error: {e}")
        return ""
