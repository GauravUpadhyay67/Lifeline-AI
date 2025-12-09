import requests

url = "http://127.0.0.1:8000/chat"
inputs = {"message": "Hello, I am feeling a bit feverish."}

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, json=inputs)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
