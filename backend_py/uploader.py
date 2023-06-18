import requests
import os
import time

url = "https://2c96-104-204-138-4.ngrok.io/upload"
files = os.listdir("./sample")
for file in files:
    img = open(f"./sample/{file}", "rb")

    req = requests.post(
        url,
        files = {"image": img},
        data = {"text": ""}
    )
    print(f"Upload {files.index(file)}. {req.status_code}")
    time.sleep(3)
