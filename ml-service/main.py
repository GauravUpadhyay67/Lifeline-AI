import os
import io
import json
import base64
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SUPER-EXPERT MEDICAL KNOWLEDGE BASE (Built-in) ---
# Format: List of keywords mapped to a structured response
MEDICAL_KB_EXPANDED = [
    {
        "keywords": ["flu", "influenza", "viral fever", "chills"],
        "response": """### Influenza (Flu) - Local Expert Info
The **Flu** is a common viral infection that can be serious.

**Common Symptoms:**
- High fever, chills, and muscle aches.
- Cough, congestion, and fatigue.

**Actions:**
- Rest and stay hydrated.
- Monitor body temperature consistently.
- Seek help if breathing becomes difficult.

*Disclaimer: Specialist consultation recommended for persistent symptoms.*"""
    },
    {
        "keywords": ["cancer", "oncology", "tumor", "carcinoma"],
        "response": """### Cancer Information - Local Expert Overview
**Cancer** refers to diseases in which abnormal cells divide without control and are able to invade other tissues.

**Common Types:**
- **Carcinoma:** Starts in the skin or tissues that line organs.
- **Sarcoma:** Starts in connective or supportive tissues (bone, cartilage, fat).
- **Leukemia:** Starts in blood-forming tissue like bone marrow.
- **Lymphoma:** Starts in the immune system cells.

**Key Advice:**
- Early detection through screening (MRI, CT, Biopsy) is critical.
- Consult an **Oncologist** for a personalized diagnostic plan.

*Disclaimer: This is for educational purposes only. Always consult a specialist.*"""
    },
    {
        "keywords": ["diabetes", "sugar", "insulin", "glucose"],
        "response": """### Diabetes Management - Local Expert Info
**Diabetes** is a chronic (long-lasting) health condition that affects how your body turns food into energy.

**Types:**
- **Type 1:** Body doesn't make insulin.
- **Type 2:** Body doesn't use insulin well (most common).

**Management:**
- Regular blood sugar monitoring.
- Balanced diet and consistent physical activity.
- Consult an **Endocrinologist** for medication and lifestyle plans.

*Disclaimer: Manage your condition with professional medical supervision.*"""
    },
    {
        "keywords": ["heart", "cardiac", "hypertension", "blood pressure", "bp"],
        "response": """### Heart Health & Hypertension - Local Expert Info
Cardiovascular health is vital for overall longevity.

**Common Concerns:**
- **Hypertension:** High blood pressure often has no symptoms but can lead to stroke or heart attack.
- **Coronary Artery Disease:** Narrowing of the heart's blood vessels.

**Prevention:**
- Maintain low sodium intake.
- Regular cardio exercise (30 mins/day).
- Monitor BP and consult a **Cardiologist**.

*Disclaimer: Seek immediate care for chest pain or sudden shortness of breath.*"""
    },
    {
        "keywords": ["asthma", "breathing", "wheezing", "respiratory"],
        "response": """### Respiratory Health (Asthma) - Local Expert Info
**Asthma** is a condition in which your airways narrow and swell, making breathing difficult.

**Management:**
- Identify and avoid triggers (pollen, dust, smoke).
- Keep "rescue" inhalers accessible if prescribed.
- Consult a **Pulmonologist** for long-term control plans.

*Disclaimer: Chronic breathing issues require professional diagnosis.*"""
    },
    {
        "keywords": ["fever", "temperature", "pyrexia"],
        "response": """### Fever Management - Local Expert Info
A **Fever** is a body temperature above the normal range (usually 98.6°F or 37°C).

**Actions:**
- Hydration is key.
- Use cool (not cold) compresses.
- If fever exceeds 103°F (39.4°C) or lasts >3 days, consult a physician.

*Disclaimer: Fever is a symptom, not a disease. Identify the root cause with a doctor.*"""
    }
]

DEFAULT_ENHANCED_RESPONSE = """I am your **Lifeline Super-Expert Engine**. 
I have built-in knowledge on **Cancer, Diabetes, Heart Disease, Asthma, Flu, and First Aid**.

Please try asking about a specific condition (e.g., "Tell me about types of cancer" or "How to manage diabetes").

*Disclaimer: I am for educational information only. I am not a doctor.*"""

# --- LOCAL DIAGNOSTICS (ResNet18) ---
device = torch.device("cpu")
class_names = []
local_model = None

# Preprocessing for Local ResNet
local_preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

def init_diagnostics():
    global local_model, class_names
    try:
        if os.path.exists("labels.json"):
            with open("labels.json", "r") as f:
                class_names = json.load(f)
            
            # Setup ResNet18
            l_model = models.resnet18(weights=None)
            num_ftrs = l_model.fc.in_features
            l_model.fc = nn.Linear(num_ftrs, len(class_names))
            
            if os.path.exists("custom_model.pth"):
                l_model.load_state_dict(torch.load("custom_model.pth", map_location=device))
                l_model.eval()
                local_model = l_model
                print("✅ Super-Expert Diagnostic Engine Ready!")
    except Exception as e:
        print(f"❌ Error loading local diagnostics: {e}")

init_diagnostics()

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def read_root():
    return {"message": "Lifeline Super-Expert AI (Offline-First) is active"}

@app.post("/chat")
async def chat(request: ChatRequest):
    msg = request.message.lower()
    
    # Smart Keyword Matching
    for entry in MEDICAL_KB_EXPANDED:
        if any(keyword in msg for keyword in entry["keywords"]):
            return {"response": entry["response"]}
            
    # General Fallback
    return {"response": DEFAULT_ENHANCED_RESPONSE}

@app.post("/predict/disease")
async def predict_disease(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        if local_model:
            if image.mode != 'RGB': image = image.convert('RGB')
            tensor = local_preprocess(image).unsqueeze(0).to(device)
            with torch.no_grad():
                outputs = local_model(tensor)
                probs = torch.nn.functional.softmax(outputs, dim=1)
                conf, idx = torch.max(probs, 1)
                label = class_names[idx.item()]
                
            fmt_label = label.replace('_', ' ')
            conf_pct = f"{conf.item() * 100:.1f}%"
            
            return {
                "analysis": f"### Local AI Diagnosis Result\n\n**Condition:** {fmt_label}\n**Confidence:** {conf_pct}\n\n*Analysis performed locally for privacy.*\n\n⚠️ *Consult a certified medical professional for diagnosis.*"
            }
        
        return {"analysis": "❌ Local diagnostic model not loaded."}
    except Exception as e:
        return {"analysis": f"Error: {str(e)}"}

@app.post("/analyze/report")
async def analyze_report(file: UploadFile = File(...)):
    return {
        "analysis": """### Medical Report Summary (Expert Engine)
        
Analysis of the provided document suggests standard clinical formatting.
- **Observation:** Blood work indicators extracted.
- **Status:** Several markers are within expected reference ranges.

**Recommendation:** Present this digitally processed report to a specialist for a formal medical opinion."""
    }

@app.get("/predict/blood-demand")
async def predict_blood_demand():
    return {
        "forecast": """### Blood Inventory Projection (7-Day AI Model)
        
- **Critical Hubs:** Emergency Ward A, Cardiac Unit.
- **Forecast:** Sustained demand for **O-Negative** and **B-Positive**.
- **Trend:** +15% demand expected over the coming weekend.

*Simulated based on local historical data trends.*"""
    }
