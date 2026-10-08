import os
from PIL import Image
from torch.utils.data import Dataset
import albumentations as A
from albumentations.pytorch import ToTensorV2
import numpy as np

# Skin conditions we detect
CLASSES = ['acne', 'oily', 'dry', 'pigmentation', 'normal']

class SkinDataset(Dataset):
    """
    Dataset folder structure expected:
    data/
      train/
        acne/        (images here)
        oily_skin/   (images here)
        dry_skin/    ...
        ...
      val/
        acne/
        ...
    """
    def __init__(self, root_dir, split='train'):
        self.root_dir = os.path.join(root_dir, split)
        self.classes = CLASSES
        self.class_to_idx = {c: i for i, c in enumerate(CLASSES)}

        self.samples = []
        for cls in CLASSES:
            cls_dir = os.path.join(self.root_dir, cls)
            if not os.path.exists(cls_dir):
                continue
            for img_name in os.listdir(cls_dir):
                if img_name.lower().endswith(('.jpg', '.jpeg', '.png')):
                    self.samples.append((
                        os.path.join(cls_dir, img_name),
                        self.class_to_idx[cls]
                    ))

        # Data augmentation for training
        if split == 'train':
            self.transform = A.Compose([
                A.RandomResizedCrop(size=(224,224)),
                A.HorizontalFlip(p=0.5),
                A.RandomBrightnessContrast(p=0.3),
                A.HueSaturationValue(p=0.3),
                A.Normalize(mean=[0.485, 0.456, 0.406],
                            std=[0.229, 0.224, 0.225]),
                ToTensorV2()
            ])
        else:
            self.transform = A.Compose([
                A.Resize(height=256, width=256),
                A.CenterCrop(224, 224),
                A.Normalize(mean=[0.485, 0.456, 0.406],
                            std=[0.229, 0.224, 0.225]),
                ToTensorV2()
            ])

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        img_path, label = self.samples[idx]
        image = np.array(Image.open(img_path).convert('RGB'))
        transformed = self.transform(image=image)
        return transformed['image'], label