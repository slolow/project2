import os
import requests

# for tests delete later on
import random
import string

from datetime import datetime
from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

title = {'name_page': 'name',
         'new_chat_page': 'create  new chat'}

h1 = {'name_page': 'Welcome Amigo! Please, tell me your name.',
          'new_chat_page': 'Create a new chat my friend!'}

button_texts = {'name_page': 'let\'s chat',
               'new_chat_page': 'create'}

messages_dict = {}
# test chatrooms:
#messages_dict = {'try': [1, 3, 4], 'color': ['a'], 'harrybo': [9]}
long_string = string.ascii_lowercase + string.ascii_uppercase
for c in long_string:
    messages_dict[c] = []


@app.route("/")
def index():
    return render_template("index.html")


# find out how to combinate /name and /new-chat to one route
@app.route("/name")
def prompt_name():
    return render_template("form.html", title=title['name_page'], h1=h1['name_page'], buttonText=button_texts['name_page'])


@app.route("/new-chat")
def prompt_new_chat():
    return render_template("form.html", title=title['new_chat_page'], h1=h1['new_chat_page'], buttonText=button_texts['new_chat_page'])


@app.route("/chats", methods=["POST"])
def chats():
    data = list(messages_dict.keys())

    # Return list of chats.
    return jsonify(data)


@app.route("/is_chat_name_available", methods=["POST"])
def is_chat_name_available():

    # Get chat name
    chat_name = request.form.get("chat_name")

    if chat_name in messages_dict.keys():
        response = False
    else:
        response = True

    return jsonify(response)


@app.route("/messages", methods=["POST"])
def messages():

    # Get start and end point for messages to generate.
    start = int(request.form.get("start") or 0)
    end = int(request.form.get("end") or (start + 9))

    # for tests delete later on
    user = ['ju', 'Harry']

    # Generate list of messages. Change later on by real message
    data = []
    for i in range(start, end + 1):
        data.append({'message': f"message #{i}", 'user': user[random.randint(0, 1)], 'time': '06.09.2020 at 12:45Am'})
        #print(user[random.randint(0, 1)])
        #data.append(f"message #{i}")

    # Return list of chats.
    return jsonify(data)


@socketio.on("create new chat")
def create_new_chat(data):
    new_chat = data['new_chat']
    messages_dict[new_chat] = []
    emit("new chat created", {'new_chat': new_chat} , broadcast=True)
