import google.generativeai as genai
import os

genai.configure(api_key="AIzaSyBPdcTZh-4FmplkJf_qxI9vpro0MOo8AEg")

with open("models.txt", "w") as f:
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                f.write(m.name + "\n")
    except Exception as e:
        f.write(f"Error: {e}\n")
