from dataset import SkinDataset

# Load datasets
train_ds = SkinDataset('../dataset', split='train')
val_ds = SkinDataset('../dataset', split='val')

print("Train samples:", len(train_ds))
print("Validation samples:", len(val_ds))

# Test one sample
image, label = train_ds[0]

print("Image shape:", image.shape)
print("Label:", label)