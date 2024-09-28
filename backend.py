from flask import Flask, jsonify, request
import os
import requests
import json
import google.generativeai as genai
import os



api_key = os.environ.get('gemini_key')
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")


app = Flask(__name__)


def get_feedbackprompt(task):
    prompt = f"""The user is doing the following task: {task}. If they are doing the task and not another task, say well done and give any helpful advice if they are stuck. If they
    are not doing the task, gently prompt them to go back to the relevant application window and do the task."""


def get_taskbreakdown(task):
    prompt = f"""The user wants to do the following task: {task}. 
Break down the tasks into multiple, actionable steps to make the task easier to work on step by step. Give an estimate of the time needed to take to do each task"""
    return prompt

@app.route('/video', methods=['POST'])
def set_video():
    video_file = request.files['video']  # Get the uploaded video file
    video_file.save(os.path.join('videos', video_file.filename))  # Save the video to the 'videos' directory
    return jsonify({"message": "Video uploaded successfully!"}), 201


@app.route('/tasks', methods=['GET'])
def get_tasks(task):
    response = model.generate_content(get_taskbreakdown(task))
    return jsonify(response.text)

@app.route('/feedback', methods=['GET'])
def get_feedback(task, video_file):
    response = model.generate_content([video_file, get_feedbackprompt(task)],
                                  request_options={"timeout": 600})
    
    return jsonify(response.text)



def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()









def main():
    pass