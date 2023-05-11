from flask import Flask, request, send_file
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

import json
import hashlib
import random
from random_string import generate_random_string

app = Flask(__name__)
app.config["ALLOWED_EXTENSIONS"] = {"jpg", "jpeg", "png"}
limiter = Limiter(
    get_remote_address,
    app=app,
    storage_uri="memory://",
)
CORS(app)

@app.route("/images/<path:image_name>")
def display_image(image_name):
    return send_file(f'images/{image_name}.png')

@app.route("/fetch", methods=["GET"])
def get_random_image():
    with open("image.json", "r") as f:
        data = json.load(f)
        image_array = list(data.keys())
        rand_idx = random.randint(0, len(image_array)-1)
        selected_image = image_array[rand_idx]
        selected_text = data[selected_image]
    return {"img": selected_image, "text": selected_text}


@app.route("/upload", methods=["POST"])
@limiter.limit("10/minute")
def post_image():
    file = request.files.get('image', '')
    text = request.form.get('text', '')
    if file:
        # add to image.json
        with open("image.json", "r") as f:
            current_data = json.load(f)
            sha256_file_name = hashlib.sha256(
                str.encode(
                file.filename + generate_random_string(10)
                )
            ).hexdigest()
            current_data[sha256_file_name] = text
        
        with open("image.json", "w") as f:
            json.dump(current_data, f, indent=4)

        # add to data.json
        with open("data.json", "r") as f:
            current_data = json.load(f)
            new_data = {
                sha256_file_name: {
                    "up": 0,
                    "down": 0
                }
            }
            current_data.update(new_data)
        with open("data.json", "w") as f:
            json.dump(current_data, f, indent=4)
        
        # save file
        file.save("images/" + sha256_file_name + ".png")
        return {"status": 200}
    else:
        return {"status": 400, "message": "No file received"}

@app.route("/vote", methods=["POST"])
@limiter.limit("30/minute")
def post_vote_result():
    data = request.json
    print(data)
    with open("data.json", "r") as f:
        current_data = json.load(f)
        print(data)
        image_url = data["response"]["currentImage"]
        image_url = image_url.replace('http://localhost:8080/images/', '')
        image_url = image_url.replace('.png', '')
        vote_res = data["response"]["vote"]
        if image_url in current_data.keys():
            if vote_res == "up":
                current_data[image_url]["up"] += 1
            if vote_res == "down":
                current_data[image_url]["down"] += 1
        else:
            if vote_res == "up":
                current_data[image_url]["up"] = 1
            if vote_res == "down":
                current_data[image_url]["down"] = 1
        
        with open("data.json", "w") as f:
            json.dump(current_data, f, indent=4)
    return {"response": 200}
    

if __name__ == "__main__":
    app.run(host="localhost", port=8080, debug=True)
