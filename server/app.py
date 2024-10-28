# Import necessary libraries and modules
from bson.objectid import ObjectId
from flask import Flask, request, jsonify
from pymongo import MongoClient
from cryptography.fernet import Fernet

# Import custom modules for database interactions
import usersDatabase
import projectsDatabase
import hardwareDatabase
import socket
import threading
import os
key = "GveCI0oMOaBIEzjiSa3UekwMIb_T-7d--aeyEqtPycY=".encode()


# Define the MongoDB connection string
MONGODB_SERVER = "mongodb+srv://masterUser:iXshJM0Tn5C9aAYt@userinfo.qp9mr.mongodb.net/?retryWrites=true&w=majority&appName=UserInfo"

# Initialize a new Flask web application
app = Flask(__name__)

# Route for user login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    userId = data.get('userId')
    password = data.get('password')

    client = MongoClient(MONGODB_SERVER)
    try:
        login_status = usersDatabase.login(client, username, userId, password)
        return jsonify({"status": "success" if login_status else "error"}), 200 if login_status else 401
    finally:
        client.close()

# Route for the main page
@app.route('/main')
def mainPage():
    userId = request.args.get('userId')
    client = MongoClient(MONGODB_SERVER)
    try:
        user_projects = usersDatabase.__queryUser(client, userId)
        return jsonify({"projects": user_projects}), 200
    finally:
        client.close()

# Route for joining a project
@app.route('/join_project', methods=['POST'])
def join_project():
    data = request.json
    userId = data.get('userId')
    projectId = data.get('projectId')

    client = MongoClient(MONGODB_SERVER)
    try:
        join_status = projectsDatabase.addUser(client, projectId, userId)
        return jsonify({"status": "success" if join_status else "error"}), 200 if join_status else 500
    finally:
        client.close()

# Route for adding a new user
@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.json
    username = data.get('username')
    userId = data.get('userId')
    password = data.get('password')

    client = MongoClient(MONGODB_SERVER)
    try:
        usersDatabase.addUser(client, username, userId, password)
        return jsonify({"status": "success"}), 200
    finally:
        client.close()

# Route for getting the list of user projects
@app.route('/get_user_projects_list', methods=['POST'])
def get_user_projects_list():
    data = request.json
    userId = data.get('userId')

    client = MongoClient(MONGODB_SERVER)
    try:
        projects = usersDatabase.__queryUser(client, userId)
        return jsonify({"projects": projects}), 200
    finally:
        client.close()

# Route for creating a new project
@app.route('/create_project', methods=['POST'])
def create_project():
    data = request.json
    projectName = data.get('projectName')
    projectId = data.get('projectId')
    description = data.get('description')

    client = MongoClient(MONGODB_SERVER)
    try:
        projectsDatabase.createProject(client, projectName, projectId, description)
        return jsonify({"status": "success"}), 200
    finally:
        client.close()

# Route for getting project information
@app.route('/get_project_info', methods=['POST'])
def get_project_info():
    data = request.json
    projectId = data.get('projectId')

    client = MongoClient(MONGODB_SERVER)
    try:
        project_info = projectsDatabase.queryProject(client, projectId)
        return jsonify({"project_info": project_info}), 200
    finally:
        client.close()

# Route for getting all hardware names
@app.route('/get_all_hw_names', methods=['POST'])
def get_all_hw_names():
    client = MongoClient(MONGODB_SERVER)
    try:
        hardware_names = hardwareDatabase.getAllHardwareNames(client)
        return jsonify({"hardware_names": hardware_names}), 200
    finally:
        client.close()

# Route for getting hardware information
@app.route('/get_hw_info', methods=['POST'])
def get_hw_info():
    data = request.json
    hwName = data.get('hwName')

    client = MongoClient(MONGODB_SERVER)
    try:
        hw_info = hardwareDatabase.queryHardwareSet(client, hwName)
        return jsonify({"hw_info": hw_info}), 200
    finally:
        client.close()

# Route for checking out hardware
@app.route('/check_out', methods=['POST'])
def check_out():
    data = request.json
    projectId = data.get('projectId')
    hwName = data.get('hwName')
    quantity = data.get('quantity')

    client = MongoClient(MONGODB_SERVER)
    try:
        status = projectsDatabase.checkOutHardware(client, projectId, hwName, quantity)
        return jsonify({"status": "success" if status else "error"}), 200 if status else 500
    finally:
        client.close()

# Route for checking in hardware
@app.route('/check_in', methods=['POST'])
def check_in():
    data = request.json
    projectId = data.get('projectId')
    hwName = data.get('hwName')
    quantity = data.get('quantity')

    client = MongoClient(MONGODB_SERVER)
    try:
        status = projectsDatabase.checkInHardware(client, projectId, hwName, quantity)
        return jsonify({"status": "success" if status else "error"}), 200 if status else 500
    finally:
        client.close()

# Route for creating a new hardware set
@app.route('/create_hardware_set', methods=['POST'])
def create_hardware_set():
    data = request.json
    hwName = data.get('hwName')
    initCapacity = data.get('initCapacity')

    client = MongoClient(MONGODB_SERVER)
    try:
        hardwareDatabase.createHardwareSet(client, hwName, initCapacity)
        return jsonify({"status": "success"}), 200
    finally:
        client.close()

# Route for checking the inventory of projects
@app.route('/api/inventory', methods=['GET'])
def check_inventory():
    client = MongoClient(MONGODB_SERVER)
    try:
        inventory = hardwareDatabase.getInventory(client)
        return jsonify({"inventory": inventory}), 200
    finally:
        client.close()

# Main entry point for the application
if __name__ == '__main__':
    # 1 - Server sets up a listening socket
    HOST = "127.0.0.1"
    port =8080
    try:
        serv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        serv.bind((HOST, port))
        serv.listen(1)  # Start listening for connections

        print(f"Listening on port {port}")
        conn, addr = serv.accept()
        with conn:
            print(f"Connected by {addr}")
            while True:
                data = conn.recv(1024)
                if not data:
                    break
                print(f"Received data: {data}")
    except socket.error as e:
        print(f'[ERROR] Port {port} error: {e}')
    finally:
        serv.close()

    # app.run()