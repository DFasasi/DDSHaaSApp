# Import necessary libraries and modules
from bson.objectid import ObjectId
from flask import Flask, request, jsonify, send_from_directory
from pymongo import MongoClient
from flask_cors import CORS
# Import custom modules for database interactions
import usersDatabase
import projectsDatabase
import hardwareDatabase
import logging
import sys
import os
# Define the MongoDB connection string
MONGODB_SERVER = "mongodb+srv://masterUser:iXshJM0Tn5C9aAYt@userinfo.qp9mr.mongodb.net/?retryWrites=true&w=majority&appName=UserInfo"
client = MongoClient(MONGODB_SERVER)

# Initialize a new Flask web application
app = Flask(__name__, static_folder='build', static_url_path='')
CORS(app) 
logging.basicConfig(level=logging.INFO)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(f'build/{path}'):
        return send_from_directory('build', path)
    else:
        return send_from_directory('build', 'index.html')

# Route for user login
@app.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        app.logger.debug('Request content type is not JSON')
        return jsonify({"status": "error", "message": "Request must be JSON"}), 400

    data = request.json
    app.logger.debug(f'Received data: {data}')
    
    userId = data.get('userId')
    password = data.get('password')

    if not userId or not password:
        app.logger.debug('UserId or password is missing')
        return jsonify({"status": "error", "message": "UserId and password are required!"}), 400

    client = MongoClient(MONGODB_SERVER)
    try:
        # Call the usersDatabase.login function
        login_status = usersDatabase.login(client, userId, password)
        app.logger.debug(f'Status: {login_status}')
        return jsonify({"status": "success" if login_status else "error", "message": "Login successful!" if login_status else "Invalid credentials"}), 200 if login_status else 401
    except Exception as e:
        app.logger.debug(f'Error: {e}')
        return jsonify({"status": "error", "message": "An error occurred."}), 500
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

# Route for adding a new user
@app.route('/add_user', methods=['POST'])
def add_user():
    logging.basicConfig(level=app.logger.debug)
    data = request.json
    app.logger.debug(f'Received data: {data}')
    userId = data.get('userId')
    password = data.get('password')
    client = MongoClient(MONGODB_SERVER)
    if not userId or not password:
            app.logger.debug(f'error bruh')
            return jsonify({"status": "error", "message": "All fields are required!"}), 400
    try:
        result = usersDatabase.addUser(client, userId, password)
        if result:
            return jsonify({"status": "success"}), 200
        else:
            return jsonify({"status": "error", "message": "User already exists."}), 500
    except Exception as e:
        # print(traceback.format_exc())
        return jsonify({"status": "error", "message": "An error occurred."}), 500
    finally:
        client.close()

# Route for getting the list of user projects (idk if this is working)
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

@app.route('/user_projects', methods=['POST'])
def get_user_projects():##################################################################
    data = request.json
    userId = data.get('userId')
    projectId = data.get('projectId')

    client = MongoClient(MONGODB_SERVER)
    try:
        user_projects = usersDatabase.get_user_projects(client, userId)  # Most recetn error for projects list stems from an error with this call
        return jsonify({"status": "success", "projects": user_projects}), 200
    except Exception as e:
        logging.error(f"Error fetching user projects: {e}")
        return jsonify({"status": "error", "message": "Failed to fetch user projects"}), 500
    finally:
        client.close()

# Route for creating a new project
@app.route('/create_project', methods=['POST'])
def create_project():
    data = request.json
    logging.basicConfig(level=app.logger.debug)
    app.logger.debug(data)
    userId = data.get('userId')
    projectName = data.get('projectName')
    projectId = data.get('projectId')
    description = data.get('description')

    client = MongoClient(MONGODB_SERVER)
    try:
        success, message = projectsDatabase.createProject(client, projectName, projectId, description)
        if(success is not False):
            projectsDatabase.addUser(client, projectId, userId)
            usersDatabase.joinProject(client, userId,projectId)
            hardwareDatabase.createHardwareSet(client,"Hardware Set 1",200,projectId)
            hardwareDatabase.createHardwareSet(client,"Hardware Set 2",200,projectId)
            return jsonify({"status": "success"}), 200
        else:
            return jsonify({"status": "error", "message": "Project already exists."}), 500
    finally:
        client.close()

# Route for joining a project
@app.route('/join_project', methods=['POST'])
def join_project():
    data = request.json
    userId = data.get('userId')
    projectId = data.get('projectId')
    app.logger.debug(f"Received data: {data}")
    app.logger.debug(f"userId: {userId}, projectId: {projectId}, type: {type(projectId)}")

    if not userId or not projectId:
        return jsonify({"status": "error", "message": "Missing userId or projectId."}), 400

    client = MongoClient(MONGODB_SERVER)
    try:
        # Ensure projectId is a string
        if not isinstance(projectId, str):
            projectId = str(projectId)
        project = projectsDatabase.queryProject(client, projectId)
        app.logger.debug(f"Project found: {project}")
        if not project:
            return jsonify({"status": "error", "message": "Project does not exist."}), 404

        join_status = projectsDatabase.addUser(client, projectId, userId)
        app.logger.debug(f"Join status: {join_status}")
        if join_status:
            usersDatabase.joinProject(client, userId, projectId)
            return jsonify({"status": "success", "message": "Joined project successfully!"}), 200
        else:
            return jsonify({"status": "error", "message": "User already exists in project."}), 400

    except Exception as e:
        app.logger.error(f"Error joining project: {e}")
        return jsonify({"status": "error", "message": "An error occurred while joining the project."}), 500
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

@app.route('/check_out', methods=['POST'])
def check_out():
    data = request.json
    app.logger.debug(data)
    projectId = data.get('projectId')
    hwName = data.get('hwName')
    quantity = data.get('quantity')
    userId = data.get('userId')

    app.logger.debug(f"Check-out request: projectId={projectId}, hwName={hwName}, quantity={quantity}, userId={userId}")
    
    try:
        status_code, message, avail, qty = projectsDatabase.checkOutHW(client, projectId, hwName, quantity, userId)
        app.logger.debug(f"Check-out result: {message}, Status: {status_code}")
        return jsonify({
            "status": "success" if status_code == 200 else "error",
            "message": message,
            "avail": avail,
            "qty": qty
        }), status_code
    except Exception as e:
        app.logger.error(f"Error during hardware check-out: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# Route for checking in hardware
@app.route('/check_in', methods=['POST'])
def check_in():
    data = request.json
    projectId = data.get('projectId')
    hwName = data.get('hwName')
    quantity = data.get('quantity')
    userId = data.get('userId')

    app.logger.debug(f"Check-in request: projectId={projectId}, hwName={hwName}, quantity={quantity}, userId={userId}")
    
    try:
        status_code, message, avail, qty = projectsDatabase.checkInHW(client, projectId, hwName, quantity, userId)
        app.logger.debug(f"Check-in result: {message}, Status: {status_code}")
        return jsonify({
            "status": "success" if status_code == 200 else "error",
            "message": message,
            "avail": avail,
            "qty": qty
        }), status_code
    except Exception as e:
        app.logger.error(f"Error during hardware check-in: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# Route for getting hardware data
@app.route('/get_hardware_data', methods=['POST'])
def get_hardware_data():
    data = request.json
    projectId = data.get('projectId')
    userId = data.get('userId')  # If needed for authorization

    try:
        # Fetch hardware data for the project
        hardware_sets = hardwareDatabase.getHardwareSets(client, projectId)
        if hardware_sets:
            hardware_data = {}
            for hw_set in hardware_sets:
                hw_name = hw_set['hwName']
                available_quantity = hw_set['availability']
                hardware_data[hw_name] = {
                    'capacity': hw_set['capacity'],
                    'available': available_quantity,
                    'checkedOut': hw_set['capacity'] - available_quantity,
                    'request': ''
                }
            return jsonify({"status": "success", "hardwareData": hardware_data}), 200
        else:
            return jsonify({"status": "error", "message": "No hardware data found."}), 404
    except Exception as e:
        app.logger.error(f"Error fetching hardware data: {e}")
        return jsonify({"status": "error", "message": "An error occurred while fetching hardware data."}), 500
    
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
    # print(usersDatabase.addUser("client", "test", "test1"))
    # print(usersDatabase.login("client", "test", "test"))
    # print(usersDatabase.getUserProjectsList(MongoClient(MONGODB_SERVER),"test","1"))
    # print(usersDatabase.joinProject(MongoClient(MONGODB_SERVER),"test","1",1))
    # print(sys.path)
    # projectsDatabase.createProject("client","test Proj", "1", "description")
    #  print(projectsDatabase.checkOutHW(MongoClient(MONGODB_SERVER), '1', 'Hardware Set 1', 300, 'test'))
    #print(usersDatabase.get_user_projects("DavidTest"))5rgffrf23
    #print(hardwareDatabase.getHardwareSets(MongoClient(MONGODB_SERVER), 'up'))
    #print(projectsDatabase.queryProject(MongoClient(MONGODB_SERVER), '14'))
    #print(projectsDatabase.createProject(MongoClient(MONGODB_SERVER), "test Proj", "1", "description"))
    app.run(debug=True)