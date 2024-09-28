from flask import Flask, jsonify, request
import os
import requests
import json
import google.generativeai as genai
import time

api_key = os.environ.get('gemini_key')
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

app = Flask(__name__)

def get_feedbackprompt(task):
    prompt = f"""The user is doing the following task: {task}. If they are doing the task and not another task, say well done and give any helpful advice if they are stuck. If they
    are not doing the task, gently prompt them to go back to the relevant application window and do the task."""
    return prompt

def get_taskbreakdown(task):
    prompt = f"""The user wants to do the following task: {task}. 
Break down the tasks into multiple, actionable steps to make the task easier to work on step by step. Give an estimate of the time needed to take to do each task"""
    return prompt

@app.route('/video', methods=['POST'])
def set_video():
    video_file = request.files.get('video')  # Get the uploaded video file
    if video_file:
        filename = video_file.filename  # Get the filename from the video file
        os.makedirs('videos', exist_ok=True)  # Create the 'videos' directory if it doesn't exist
        video_file.save(os.path.join('videos', filename))  # Save the video to the 'videos' directory
        return jsonify({"message": "Video uploaded successfully!"}), 201
    else:
        return jsonify({"error": "No video file provided"}), 400

@app.route('/tasks', methods=['POST'])
def get_tasks():
    task = request.form.get('task')
    if task:
        response = model.generate_content(get_taskbreakdown(task))
        return jsonify(response.text)
    else:
        return jsonify({"error": "No task provided"}), 400

@app.route('/feedback', methods=['POST'])
def get_feedback():
    task = request.form.get('task')
    video = request.files.get('video')
    
    if task and video:
        filename = video.filename
        os.makedirs('videos', exist_ok=True)  
        video.save(os.path.join('videos', filename)) 
        video_file = genai.upload_file(path="videos/" + filename)
        while video_file.state.name == "PROCESSING":
            print('.', end='')
            time.sleep(10)
            video_file = genai.get_file(video_file.name)

        if video_file.state.name == "FAILED":
            return jsonify({"error": "Gemini video file upload"}), 400
                
        response = model.generate_content([video_file, get_feedbackprompt(task)],
                                          request_options={"timeout": 600})
        return jsonify(response.text)
    else:
        return jsonify({"error": "Task or video file missing"}), 400

def main():
    app.run(debug=True)

if __name__ == '__main__':
    main()