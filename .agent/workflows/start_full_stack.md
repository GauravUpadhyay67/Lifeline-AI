---
description: Start the Full Stack Application (Backend, Frontend, ML Service)
---
To start the application, you need to open 3 separate terminals and run the following commands:

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

### Terminal 3: ML Service
```bash
cd ml-service
python -m uvicorn main:app --port 8000 --reload
```
