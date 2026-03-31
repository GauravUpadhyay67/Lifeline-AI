# Project Overview: Lifeline AI

Lifeline AI is a comprehensive healthcare platform designed to bridge the gap between patients, doctors, hospitals, and blood donors. It leverages modern web technologies and Artificial Intelligence to provide services like disease detection, blood inventory management, report analysis, and emergency coordination.

## 🏗️ Tech Stack

### Frontend (Client-Side)
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS (via `tailwind-merge` and `clsx`)
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Markdown Rendering**: React Markdown

### Backend (Server-Side)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs
- **Security**: Helmet
- **Logging**: Morgan
- **File Handling**: Multer (for image uploads)
- **Real-time**: Socket.io

### ML Service (AI/Data Science)
- **Framework**: FastAPI (Python)
- **Server**: Uvicorn
- **Machine Learning**: 
    - **PyTorch/Torchvision**: For training and running custom local models (ResNet18).
    - **Transformers**: For advanced NLP/Vision tasks.
    - **Google Generative AI (Gemini)**: Fallback and advanced general analysis.
- **Data Handling**: Pandas, NumPy, Datasets (HuggingFace)
- **Image Processing**: Pillow (PIL)

## 🚀 Key Features

### 1. AI-Powered Disease Detection
- **Functionality**: Users can upload medical images (X-rays, MRIs).
- **Technology**: Uses a **custom locally trained ResNet18 model** to detect conditions like Pneumonia, Brain Tumors, and Bone Fractures.
- **Fallback**: Seamlessly falls back to Google's Gemini API if the local model is unavailable or uncertain (though local is currently prioritized).

### 2. Medical Report Analysis
- **Functionality**: Upload complex lab reports to get a simplified, easy-to-understand summary.
- **Technology**: Generative AI extracts key values and explains them in plain English.

### 3. Role-Based Dashboards
The platform serves multiple stakeholders with dedicated dashboards:
- **🏥 Hospital Dashboard**: Manage blood inventory, blood camps, and handle emergency requests.
- **🩺 Doctor Dashboard**: Review patient reports and manage appointments.
- **🩸 Donor Dashboard**: View blood donation requests, donations history, and nearby camps.
- **👤 Patient Dashboard**: Access personal health records, upload reports, and use AI tools.

### 4. Blood Bank & Inventory Management
- **Real-time Inventory**: Hospitals can track blood stock levels (A+, B-, etc.).
- **Forecasting**: (Planned) AI prediction of blood demand to prevent shortages.

### 5. Emergency Services & Coordination
- **Real-time Requests**: Emergency blood requests are broadcast to relevant donors/hospitals.
- **Camps**: Organization and listing of blood donation camps.

### 6. AI Chatbot
- **Assistant**: A built-in chatbot to answer general health queries and guide users through the app.

### 7. Modern UI & UX Updates
- **Profile System**: Secure, tab-based profile management with robust image upload and role-specific fields (Doctors/Patients).
- **Dark Mode**: Fully responsive Dark/Light theme toggle across all dashboards.
- **Enhanced Dashboards**:
    - **Doctor**: Real-time appointment stats, quick action cards, and patient history access.
    - **Patient**: Visual quick actions, improved appointment cards, and responsive layout.

## 📂 Project Structure
- **`/frontend`**: React application containing all UI pages, components, and dashboards.
- **`/backend`**: Express API handling users, authentication, database operations, and file storage.
- **`/ml-service`**: Python-based microservice hosting the AI models and training scripts (`train_model.py`, `download_data.py`).
