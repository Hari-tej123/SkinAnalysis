import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torch.optim import AdamW
from torch.optim.lr_scheduler import CosineAnnealingLR

from dataset import SkinDataset
from model import SkinAnalysisModel, CLASSES


def train():

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Training on: {device}")

    # Data loaders
    train_ds = SkinDataset('../dataset', split='train')
    val_ds = SkinDataset('../dataset', split='val')

    train_loader = DataLoader(
        train_ds,
        batch_size=32,
        shuffle=True,
        num_workers=0
    )

    val_loader = DataLoader(
        val_ds,
        batch_size=32,
        shuffle=False,
        num_workers=0
    )

    # Model
    model = SkinAnalysisModel(
        num_classes=len(CLASSES),
        pretrained=True
    ).to(device)

    # Freeze backbone first
    for param in model.backbone.features.parameters():
        param.requires_grad = False

    optimizer = AdamW(
        model.backbone.classifier.parameters(),
        lr=1e-3,
        weight_decay=1e-4
    )

    criterion = nn.CrossEntropyLoss()

    scheduler = CosineAnnealingLR(
        optimizer,
        T_max=10
    )

    best_val_acc = 0

    # Phase 1
    for epoch in range(5):

        model.train()

        total_loss = 0
        correct = 0

        for images, labels in train_loader:

            images = images.to(device)
            labels = labels.to(device)

            optimizer.zero_grad()

            outputs = model(images)

            loss = criterion(outputs, labels)

            loss.backward()

            optimizer.step()

            total_loss += loss.item()

            correct += (
                outputs.argmax(1) == labels
            ).sum().item()

        train_acc = correct / len(train_ds)

        print(
            f"Epoch {epoch+1}/5 | "
            f"Loss: {total_loss:.3f} | "
            f"Train Acc: {train_acc:.3f}"
        )

    # Phase 2
    for param in model.parameters():
        param.requires_grad = True

    optimizer = AdamW(
        model.parameters(),
        lr=1e-4,
        weight_decay=1e-4
    )

    scheduler = CosineAnnealingLR(
        optimizer,
        T_max=20
    )

    for epoch in range(20):

        model.train()

        total_loss = 0
        correct = 0

        for images, labels in train_loader:

            images = images.to(device)
            labels = labels.to(device)

            optimizer.zero_grad()

            outputs = model(images)

            loss = criterion(outputs, labels)

            loss.backward()

            optimizer.step()

            total_loss += loss.item()

            correct += (
                outputs.argmax(1) == labels
            ).sum().item()

        scheduler.step()

        # Validation
        model.eval()

        val_correct = 0

        with torch.no_grad():

            for images, labels in val_loader:

                images = images.to(device)
                labels = labels.to(device)

                outputs = model(images)

                val_correct += (
                    outputs.argmax(1) == labels
                ).sum().item()

        val_acc = val_correct / len(val_ds)

        print(
            f"Epoch {epoch+1}/5 | "
            f"Loss: {total_loss:.3f} | "
            f"Val Acc: {val_acc:.3f}"
        )
        torch.save(model.state_dict(), "best_skin_model.pth")
        print("✅ Model saved")
        # Save best model
        if val_acc > best_val_acc:

            best_val_acc = val_acc

            torch.save(
                model.state_dict(),
                'best_skin_model.pth'
            )

            print(
                f"✅ Saved best model "
                f"(val_acc={val_acc:.3f})"
            )

    print(
        f"\nTraining done. "
        f"Best validation accuracy: {best_val_acc:.3f}"
    )


if __name__ == '__main__':
    train()