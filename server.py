import os
from flask import Flask, request, jsonify, send_from_directory
from groq import Groq

app = Flask(__name__, static_folder='.')

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

conversation_history = []

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')

    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    conversation_history.append({'role': 'user', 'content': user_message})

    response = client.chat.completions.create(
        model='llama-3.1-8b-instant',
        messages=[
            {'role': 'system', 'content': 'You are a helpful assistant on a website. Be concise and friendly.'},
            *conversation_history
        ]
    )

    reply = response.choices[0].message.content
    conversation_history.append({'role': 'assistant', 'content': reply})

    return jsonify({'reply': reply})

if __name__ == '__main__':
    app.run(debug=True, port=3000)
