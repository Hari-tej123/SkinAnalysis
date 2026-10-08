import torch
import torch.nn as nn
from torchvision import models

CLASSES = ['acne', 'oily', 'dry', 'pigmentation', 'normal']

class SkinAnalysisModel(nn.Module):
    def __init__(self, num_classes=5, pretrained=True):
        super().__init__()

        # Load pretrained EfficientNet-B0
        weights = models.EfficientNet_B0_Weights.DEFAULT if pretrained else None
        self.backbone = models.efficientnet_b0(weights=weights)

        # Replace the final classifier layer
        in_features = self.backbone.classifier[1].in_features
        self.backbone.classifier = nn.Sequential(
            nn.Dropout(p=0.3),
            nn.Linear(in_features, 512),
            nn.ReLU(),
            nn.Dropout(p=0.2),
            nn.Linear(512, num_classes)
        )

    def forward(self, x):
        return self.backbone(x)


def load_model(checkpoint_path, device='cpu'):
    """Load a saved model for inference."""
    model = SkinAnalysisModel(num_classes=len(CLASSES))
    model.load_state_dict(torch.load(checkpoint_path, map_location=device))
    model.eval()
    return model.to(device)