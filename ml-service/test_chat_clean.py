import requests
import json

url = "http://127.0.0.1:8000/chat"
inputs = {"message": "Hello, I have a headache and fever. What should I do?"}

try:
    response = requests.post(url, json=inputs)
    if response.status_code == 200:
        data = response.json()
        print("Chatbot Response:")
        print(data.get("response", "No response text found."))
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"Error: {e}")
