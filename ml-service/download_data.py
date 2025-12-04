import os
from datasets import load_dataset
from PIL import Image
from tqdm import tqdm

DATA_DIR = "data/train"
os.makedirs(DATA_DIR, exist_ok=True)

def save_images(dataset, class_name_map, subset_name="train"):
    print(f"Processing {subset_name}...")
    # Handle different dataset structures
    if "train" in dataset:
        data = dataset["train"]
    elif "Training" in dataset:
        data = dataset["Training"]
    else:
        data = dataset

    for item in tqdm(data):
        try:
            image = item['image']
            label = item['label']
            
            # Map label ID to class name
            if isinstance(class_name_map, dict):
                class_name = class_name_map.get(label)
            else:
                # If list, use index
                class_name = class_name_map[label]
                
            if not class_name:
                continue

            # Create class directory
            class_dir = os.path.join(DATA_DIR, class_name)
            os.makedirs(class_dir, exist_ok=True)

            # Save image
            # Use a unique name based on content hash or random
            import hashlib
            import time
            hash_obj = hashlib.md5(image.tobytes())
            filename = f"{hash_obj.hexdigest()}_{int(time.time()*1000)}.jpg"
            
            if image.mode != 'RGB':
                image = image.convert('RGB')
                
            image.save(os.path.join(class_dir, filename))
        except Exception as e:
            # print(f"Error saving image: {e}")
            pass

def download_pneumonia():
    print("Downloading Pneumonia Dataset...")
    try:
        dataset = load_dataset("mmenendezg/pneumonia_x_ray")
        # Labels: 0: Normal, 1: Pneumonia
        class_map = {0: "Chest_XRay_Normal", 1: "Chest_XRay_Pneumonia"}
        save_images(dataset, class_map)
        print("Pneumonia download complete.")
    except Exception as e:
        print(f"Failed to download Pneumonia dataset: {e}")

def download_brain_tumor():
    print("Downloading Brain Tumor Dataset...")
    try:
        dataset = load_dataset("sartajbhuvaji/Brain-Tumor-Classification")
        print(f"Dataset keys: {dataset.keys()}")
        if "train" in dataset:
            print(f"First item keys: {dataset['train'][0].keys()}")
            print(f"First item label: {dataset['train'][0]['label']}")
        
        # Labels: 0: glioma_tumor, 1: meningioma_tumor, 2: no_tumor, 3: pituitary_tumor
        # We will group tumors together and no_tumor as Normal
        class_map = {
            0: "Brain_MRI_Tumor", 
            1: "Brain_MRI_Tumor", 
            2: "Brain_MRI_Normal", 
            3: "Brain_MRI_Tumor"
        }
        save_images(dataset, class_map)
        print("Brain Tumor download complete.")
    except Exception as e:
        print(f"Failed to download Brain Tumor dataset: {e}")

def download_fracture():
    print("Downloading Fracture Dataset...")
    try:
        dataset = load_dataset("Hemg/bone-fracture-detection")
        # Labels: 0: fractured, 1: not fractured
        # Note: Check label mapping if needed, but usually 0/1
        # Based on verification: names=['fractured', 'not fractured']
        # So 0 -> fractured, 1 -> not fractured
        class_map = {
            0: "Bone_XRay_Fracture",
            1: "Bone_XRay_Normal"
        }
        save_images(dataset, class_map)
        print("Fracture download complete.")
    except Exception as e:
        print(f"Failed to download Fracture dataset: {e}")

if __name__ == "__main__":
    download_pneumonia()
    download_brain_tumor()
    download_fracture()
    print("Data download process finished.")
