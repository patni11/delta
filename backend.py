from flask import Flask, jsonify, request
import os
import requests
import json
import google.generativeai as genai
import time
import cv2
import numpy as np
import pyautogui
import threading
from datetime import datetime
import subprocess

api_key = os.environ.get('gemini_key')
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

app = Flask(__name__)

# Global variables to keep track of recording state
is_recording = False
recording_thread = None

# ... (previous functions remain unchanged)

def screen_recorder():
    global is_recording
    os.makedirs('recordings', exist_ok=True)
    filename = f"recordings/screen_recording_{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp4"
    
    # Get the screen size
    screen_size = pyautogui.size()
    
    # Use a different codec that's more compatible with macOS
    fourcc = cv2.VideoWriter_fourcc(*'avc1')
    out = cv2.VideoWriter(filename, fourcc, 10.0, screen_size)

    while is_recording:
        # Capture the screen
        img = pyautogui.screenshot()
        frame = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        out.write(frame)
        time.sleep(0.1)  # Add a small delay to reduce CPU usage

    out.release()

@app.route('/start_recording', methods=['POST'])
def start_recording():
    global is_recording, recording_thread
    if not is_recording:
        is_recording = True
        recording_thread = threading.Thread(target=screen_recorder)
        recording_thread.start()
        return jsonify({"message": "Screen recording started"}), 200
    else:
        return jsonify({"message": "Recording is already in progress"}), 400

@app.route('/stop_recording', methods=['POST'])
def stop_recording():
    global is_recording, recording_thread
    if is_recording:
        is_recording = False
        recording_thread.join()
        return jsonify({"message": "Screen recording stopped"}), 200
    else:
        return jsonify({"message": "No recording in progress"}), 400

def take_screenshot():
    screenshots_dir = 'screenshots'
    os.makedirs(screenshots_dir, exist_ok=True)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"{screenshots_dir}/screenshot_{timestamp}.png"
    
    try:
        subprocess.run(['screencapture', '-x', filename], check=True)
        return filename
    except subprocess.CalledProcessError:
        return None

@app.route('/take_screenshot', methods=['POST'])
def screenshot_endpoint():
    screenshot_path = take_screenshot()
    if screenshot_path:
        return jsonify({"message": "Screenshot taken successfully", "path": screenshot_path}), 200
    else:
        return jsonify({"message": "Failed to take screenshot"}), 500

def main():
    app.run(debug=False)  # Set debug to False for production use

if __name__ == '__main__':
    main()