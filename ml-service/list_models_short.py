import google.generativeai as genai
import os

genai.configure(api_key="AIzaSyBPdcTZh-4FmplkJf_qxI9vpro0MOo8AEg")

print("MODELS:")
try:
    for m in genai.list_models():
        print(m.name)
except Exception as e:
    print(e)
