from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import io
from PIL import Image
import torch
from torchvision import models, transforms
import json
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Lifeline AI ML Service (Custom Model) is running"}

# Load Model and Labels
MODEL_PATH = "custom_model.pth"
LABELS_PATH = "labels.json"
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

print("Loading Custom Disease Detection Model...")
try:
    # Load Labels
    with open(LABELS_PATH, 'r') as f:
        class_names = json.load(f)
    print(f"Labels loaded: {class_names}")

    # Load Model Architecture
    model = models.resnet18(pretrained=False) # We load weights, so pretrained=False is fine/safer
    num_ftrs = model.fc.in_features
    model.fc = torch.nn.Linear(num_ftrs, len(class_names))
    
    # Load Weights
    model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
    model = model.to(device)
    model.eval()
    print("Custom Model Loaded Successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    class_names = []

# Preprocessing
data_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

@app.post("/predict/disease")
async def predict_disease(file: UploadFile = File(...)):
    if model is None:
        return {"analysis": "Error: Model not loaded."}

    try:
        print("Received file upload request")
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        if image.mode != 'RGB':
            image = image.convert('RGB')
            
        # Preprocess
        input_tensor = data_transforms(image).unsqueeze(0).to(device)
        
        print("Running custom model prediction...")
        with torch.no_grad():
            outputs = model(input_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            top_prob, top_class = torch.topk(probabilities, 1)
            
        class_index = top_class.item()
        confidence = top_prob.item()
        predicted_label = class_names[class_index]
        
        print(f"Prediction: {predicted_label} ({confidence:.2f})")
        
        # Format Analysis Text
        analysis_text = f"**AI Analysis:** {predicted_label}\n**Confidence:** {confidence:.2%}\n\n*Note: This is a custom trained model. Please consult a doctor.*"
        
        return {"analysis": analysis_text}
    except Exception as e:
        print(f"Error in predict_disease: {e}")
        return {"analysis": f"Error analyzing image: {str(e)}"}

# Keep other endpoints if needed (mocked or removed)
@app.post("/analyze/report")
async def analyze_report(file: UploadFile = File(...)):
    return {"analysis": "Report analysis not implemented in custom model version."}

@app.get("/predict/blood-demand")
async def predict_blood_demand():
    return {"forecast": "Blood demand forecasting not implemented."}

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):
    return {"response": "Chatbot not implemented."}
