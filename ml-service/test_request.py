import requests

url = "http://127.0.0.1:8000/predict/disease"
file_path = r"C:/Users/msi/.gemini/antigravity/brain/78258bad-7edf-4993-a02d-c4d0f07ef1a9/uploaded_image_1765291707056.png"

try:
    with open(file_path, "rb") as f:
        files = {"file": f}
        print(f"Sending request to {url}...")
        response = requests.post(url, files=files)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
