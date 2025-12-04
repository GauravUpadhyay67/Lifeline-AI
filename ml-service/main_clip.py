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

# Initialize the zero-shot image classification pipeline
print("Loading Medical Image Classifier (CLIP)...")
classifier = pipeline("zero-shot-image-classification", model="openai/clip-vit-base-patch32")
print("Medical Image Classifier Loaded.")

@app.post("/predict/disease")
async def predict_disease(file: UploadFile = File(...)):
    try:
        print("Received file upload request")
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        print("Running zero-shot classification...")
        # Define candidate labels for medical imaging (Types + Conditions)
        candidate_labels = [
            "Chest X-Ray (Normal)", 
            "Chest X-Ray (Pneumonia)", 
            "Brain MRI (Normal)", 
            "Brain MRI (Tumor)", 
            "Brain Surgery Image",
            "Abdomen CT Scan", 
            "Hand X-Ray (Fracture)", 
            "Hand X-Ray (Normal)", 
            "Breast MRI", 
            "Normal Image"
        ]
        
        results = classifier(image, candidate_labels=candidate_labels)
        print(f"Prediction results: {results}")
        
        # Format the result
        # The model returns a list of dicts: [{'label': 'Chest X-Ray (Pneumonia)', 'score': 0.99}, ...]
        top_result = results[0]
        label = top_result['label']
        score = top_result['score']
        
        analysis_text = f"**AI Analysis:** {label}\n**Confidence:** {score:.2%}\n\n*Note: This AI uses Zero-Shot Classification to estimate conditions. It is NOT a substitute for a doctor's diagnosis.*"
        
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

import google.generativeai as genai
import os

# Configure Gemini API
genai.configure(api_key="AIzaSyCPaKstSbhre6n_W12F1md0kFhBjnFseQQ")
model = genai.GenerativeModel('gemini-2.0-flash')

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = model.generate_content(request.message)
        return {"response": response.text}
    except Exception as e:
        return {"response": f"Error communicating with AI: {str(e)}"}
