# Import necessary libraries and modules
from pymongo import MongoClient
from dotenv import load_dotenv
from cryptography.fernet import Fernet
import bson

import app
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
client = MongoClient(app.MONGODB_SERVER)
db = client["info"]
doc = db["Users"]
# Function to add a new user
def addUser(client, username, userId, password):
    # Add a new user to the database
    cipher_suite = Fernet(app.key)
    enc_user=cipher_suite.encrypt(username.encode())
    enc_pwd=cipher_suite.encrypt(password.encode())
    enc_uid=cipher_suite.encrypt(userId.encode())

    User = {
    'username': enc_user,
    'userId': enc_uid,
    'password': enc_pwd,
    'projects': []
}
    doc.insert_one(User)
    pass

# Helper function to query a user by username and userId
def __queryUser(client, username, userId):
    # Query and return a user from the database
    cipher_suite = Fernet(app.key)

    for x in doc.find({},{ "username": cipher_suite.encrypt(username.encode()), "userId": cipher_suite.encrypt(userId.encode()) }):
        print(x)
        return x

# Function to log in a user
def login(client, username, userId, password):
    # Authenticate a user and return login status
    cipher_suite = Fernet(app.key)

    for x in doc.find({},{ "username": cipher_suite.encrypt(username.encode()), "userId": cipher_suite.encrypt(userId.encode()),"password":cipher_suite.encrypt(password.encode()) }):
        print (x)
        return x
    return "error"
    pass

# Function to add a user to a project
def joinProject(client, userId, projectId):
    # Add a user to a specified project
    cipher_suite = Fernet(app.key)
    arr = doc.find_one({'userId': bson.ObjectId(cipher_suite.encrypt(userId.encode()))})["projects"]
    arr.append(projectId)
    update_result = doc.update_one({ 'userId': userId }, {
    'projects': {"projects": arr}
    })
    pass

# Function to get the list of projects for a user
def getUserProjectsList(client, userId):
    # Get and return the list of projects a user is part of
    cipher_suite = Fernet(app.key)
    return doc.find_one({'userId': bson.ObjectId(cipher_suite.encrypt(userId.encode()))})["projects"]
    pass