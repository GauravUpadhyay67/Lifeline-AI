from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def read_root():
    return {"message": "Lifeline AI ML Service is running"}

import io
from PIL import Image

from transformers import pipeline

# Initialize Gemini (moved up for global access)
import google.generativeai as genai
import os

# Configure Gemini API
genai.configure(api_key="AIzaSyBPdcTZh-4FmplkJf_qxI9vpro0MOo8AEg")
model = genai.GenerativeModel('gemini-2.0-flash')

# [NEW] Custom Model Setup
import torch
from torchvision import models, transforms
import json

device = torch.device("cpu")
local_model = None
class_names = []

# Preprocessing
local_preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

def load_custom_model():
    global local_model, class_names
    try:
        if os.path.exists("labels.json"):
            with open("labels.json", "r") as f:
                class_names = json.load(f)
            print(f"Loaded classes: {class_names}")
            
            # Initialize model architecture
            l_model = models.resnet18(pretrained=False)
            num_ftrs = l_model.fc.in_features
            l_model.fc = torch.nn.Linear(num_ftrs, len(class_names))
            
            if os.path.exists("custom_model.pth"):
                l_model.load_state_dict(torch.load("custom_model.pth", map_location=device))
                l_model.eval()
                local_model = l_model
                print("Custom model loaded!")
            else:
                print("custom_model.pth not found")
        else:
            print("labels.json not found")
    except Exception as e:
        print(f"Error loading custom model: {e}")

load_custom_model()

@app.post("/predict/disease")
async def predict_disease(file: UploadFile = File(...)):
    try:
        print("Received file upload request")
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # [NEW] Local prediction
        if local_model:
            try:
                print("Using local model...")
                if image.mode != 'RGB':
                    img_input = image.convert('RGB')
                else:
                    img_input = image
                    
                tensor = local_preprocess(img_input).unsqueeze(0).to(device)
                with torch.no_grad():
                    outputs = local_model(tensor)
                    probs = torch.nn.functional.softmax(outputs, dim=1)
                    conf, idx = torch.max(probs, 1)
                    label = class_names[idx.item()]
                    
                print(f"Local Result: {label} ({conf.item():.2f})")
                return {
                    "analysis": f"**AI Analysis (Local):** {label}\n**Confidence:** {conf.item():.2f}\n\n*Processed by Custom Local Model*"
                }
            except Exception as loc_e:
                print(f"Local inference failed: {loc_e}")
                # Fallthrough to Gemini
        
        print("Sending image to Gemini for analysis...")
        prompt = """
        Analyze this medical image (X-ray, MRI, CT scan, etc.). 
        Identify the body part and any potential abnormalities or diseases (e.g., Pneumonia, Fracture, Tumor, etc.).
        If the image is normal, state that it appears normal.
        Provide a confidence level (High/Medium/Low) based on visual evidence.
        
        Format the output as:
        **AI Analysis:** [Condition Name or Normal]
        **Confidence:** [High/Medium/Low]
        **Details:** [Brief explanation of findings]
        
        *Disclaimer: This is an AI analysis and not a substitute for a doctor's diagnosis.*
        """
        
        response = model.generate_content([prompt, image])
        
        # Extract text from response
        analysis_text = response.text
        
        return {"analysis": analysis_text}
    except Exception as e:
        print(f"Error in predict_disease: {e}")
        return {"analysis": f"Error analyzing image: {str(e)}"}

@app.post("/analyze/report")
async def analyze_report(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        prompt = "Analyze this medical lab report or health document. Extract key findings, identify any abnormal values (high/low), and explain what they mean in simple, easy-to-understand language for the patient. Summarize the overall health status based on this report."
        
        response = model.generate_content([prompt, image])
        
        return {"analysis": response.text}
    except Exception as e:
        return {"analysis": f"Error analyzing report: {str(e)}"}

@app.get("/predict/blood-demand")
async def predict_blood_demand():
    try:
        prompt = "Generate a realistic blood demand forecast for the next 7 days for a general hospital. Analyze trends and predict demand levels (Low, Medium, High, Critical) for different blood types (A+, A-, B+, B-, AB+, AB-, O+, O-). Explain the reasoning briefly."
        
        response = model.generate_content(prompt)
        return {"forecast": response.text}
    except Exception as e:
        return {"forecast": f"Error generating forecast: {str(e)}"}

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = model.generate_content(request.message)
        return {"response": response.text}
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "quota" in error_msg.lower():
            return {"response": "⚠️ **System Busy**: The AI is currently experiencing high traffic (Google API Free Tier Quota Exceeded). Please try again in 1 minute."}
        return {"response": f"Error communicating with AI: {error_msg}"}
