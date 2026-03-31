# Lifeline AI - Project Overview

## 🌟 Project Goal
The core goal of **Lifeline AI** is to bridge the communication and service gap between Patients, Doctors, Hospitals, and Blood Donors in a single ecosystem, heavily supercharged by Artificial Intelligence for faster diagnoses and simplified medical data.

---

## 🏗️ The Tech Stack (What It's Built With)
The project is built using a modern decoupled architecture across three specific services:

### 1. Frontend (The User Interface)
- **React.js (Vite)**: For an incredibly fast and modern web interface.
- **Tailwind CSS & Framer Motion**: Used for beautiful styling, dark/light modes, and smooth micro-animations.
- **Redux Toolkit**: For managing the application's global state (like user sessions).
- **Socket.io Client**: For handling real-time data like live emergency requests.

### 2. Backend (The Core API & Database)
- **Node.js & Express.js**: The server that handles API requests, routing, and business logic.
- **MongoDB (Mongoose)**: The NoSQL database storing users, reports, and blood inventories safely.
- **Multer**: For handling secure image and document uploads safely.
- **JWT Authentication**: For handling secure, role-based logins.

### 3. ML Service (The AI Brain)
- **Python (FastAPI)**: A blazing-fast microservice dedicated strictly to running the AI models.
- **PyTorch**: Running a custom, locally-trained Convolutional Neural Network (ResNet18) to analyze medical images.
- **Google Gemini API**: A powerful fallback mechanism for advanced text processing and complex image analysis when the local model is uncertain.

---

## 🔥 Key Features & Functionality (What It Does)

Here are the six major services the platform provides to its users:

### 1. AI-Powered Disease Detection (Computer Vision)
Patients can upload medical scans like X-Rays or MRIs. The Python FastAPI service runs the image through a trained PyTorch model to look for markers of **Pneumonia, Brain Tumors, or Bone Fractures**, providing an immediate preliminary reading. 

### 2. "Plain English" Medical Report Analysis (Generative AI)
Medical jargon can be terrifying and confusing for regular people. Users can upload their complex lab reports, and the AI will analyze the document, extract the most important numbers, and summarize what it all means in easy-to-understand plain English.

### 3. Real-Time Emergency & Blood Coordination
If someone needs an urgent rare blood type, the platform can broadcast an emergency request in real-time (via WebSockets) to local Hospitals and registered Blood Donors so action can be taken immediately.

### 4. Blood Inventory Management
Hospitals have a dedicated system to track how much of each blood type (A+, O-, B, etc.) they currently have in stock, and they can organize/list upcoming Blood Donation Camps for donors to see.

### 5. Role-Specific Dashboards
The app adapts based on who logs in:
- **🏥 Hospitals** see inventory management and emergency requests.
- **🩺 Doctors** get a clean overview of their appointments and patient report histories.
- **👤 Patients** get access to their medical records, the AI report simplifier, and the disease detection tool.
- **🩸 Donors** get a list of nearby donation camps and emergency blood requests.

### 6. Smart AI Health Chatbot
There is a built-in virtual assistant chatbot. It can help guide users on how to use the dashboard or answer general wellness and medical questions.

---

## 💡 How To Run The Project
You must start all three services in three separate terminals:

**1. Start Backend:**
```bash
cd backend
npm run dev
```

**2. Start ML Service:**
```bash
cd ml-service
python -m uvicorn main:app --port 8000 --reload
```

**3. Start Frontend:**
```bash
cd frontend
npm run dev
```
