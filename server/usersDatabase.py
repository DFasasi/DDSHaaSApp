# Import necessary libraries and modules
from pymongo import MongoClient
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
import bson
import base64
import pymongo
import projectsDatabase

'''
Structure of User entry:
User = {
    'username': username,
    'userId': userId,
    'password': password,
    'projects': [project1_ID, project2_ID, ...]
}
'''
MONGODB_SERVER = "mongodb+srv://masterUser:iXshJM0Tn5C9aAYt@userinfo.qp9mr.mongodb.net/?retryWrites=true&w=majority&appName=UserInfo"
client = MongoClient(MONGODB_SERVER)
db = client["info"]
doc = db["Users"]
# Function to add a new user
def addUser(client, username, userId, password):
    # Add a new user to the database
    if __queryUser(client,username,userId):
        return False
    User = {
    'username': username,
    'userId': generate_password_hash(userId),
    'password':generate_password_hash(password),
    'projects': []
}
    doc.insert_one(User)
    print(username +"\n"+password+"\n")
    client.close()
    return True
    pass

# Helper function to query a user by username and userId
def __queryUser(client, username, userId):
    # Query and return a user from the database
    User = {
    'username': username,
}
    u=doc.find_one(User)
    if u:
        check_password_hash(u['userId'],userId)
        return u
    client.close()
    return False

# Function to log in a user
def login(client, username, userId, password):
    # Authenticate a user and return login status
# Encrypt and encode
    query = {
        'username': username,
    }

    # Find a matching document
    user = doc.find_one(query)

    # Close the client connection
    client.close()

    if user and check_password_hash(user['userId'], userId) and check_password_hash(user['password'], password):
        return True
    print(username +"\n"+password)
    return False

# Function to add a user to a project
def joinProject(client, username, userId, projectId):
    # Add a user to a specified project
    user = __queryUser(client, username, userId)
    if user:
        arr = user.get("projects", [])
        arr.append(projectId)
        arr.sort()
        # Use $set to update the projects field correctly
        doc.update_one({ 'username': username }, { '$set': { 'projects': arr } })
        return True
    return False

# Function to get the list of projects for a user
def getUserProjectsList(client, username,userId):
    # Get and return the list of projects a user is part of
    user = __queryUser(client, username, userId)
    if user:
        arr = user.get("projects", [])   
        return arr
    return False
        