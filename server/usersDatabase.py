# Import necessary libraries and modules
from pymongo import MongoClient
from dotenv import load_dotenv
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import bson
import base64
import pymongo
import projectsDatabase

'''
Structure of User entry:
User = {
    'userId': userId,
    'password': password,
    'projects': [project1_ID, project2_ID, ...]
}
'''
MONGODB_SERVER = "mongodb+srv://masterUser:iXshJM0Tn5C9aAYt@userinfo.qp9mr.mongodb.net/?retryWrites=true&w=majority&appName=UserInfo"
client = MongoClient(MONGODB_SERVER)
db = client["info"]
doc = db["Users"]
key = b'1234567890123456'  # AES key must be either 16, 24, or 32 bytes long
cipher = AES.new(key, AES.MODE_ECB)

# Function to add a new user
def addUser(client, userId, password):
    # Add a new user to the database
    if __queryUser(client,userId):
        return False
    User = {
    'userId': cipher.encrypt(pad(userId.encode(), AES.block_size)),
    'password':cipher.encrypt(pad(password.encode(), AES.block_size)),
    'projects': []
}
    doc.insert_one(User)
    # print(userId +"\n"+password+"\n") #for debug
    return True

# Helper function to query a user by userId
def __queryUser(client,  userId):
    # Query and return a user from the database
    User = {'userId': cipher.encrypt(pad(userId.encode(), AES.block_size))}
    u=doc.find_one(User)
    if u:
        return u
    return False

def get_user_projects(client, userId):
    user_document = __queryUser(client, userId)
    if not user_document:
        print("User not found.")
        return None

    encrypted_projects = user_document.get('projects')
    
    if encrypted_projects is not None:
        try:
            # Decrypt the projects list
            decrypted_data = cipher.decrypt(encrypted_projects)
            # Unpad the decrypted data
            projects_data = unpad(decrypted_data, AES.block_size)
            # Decode the bytes to a string
            projects_string = projects_data.decode()
            # Convert the string to a Python data structure (e.g., list)
            import json
            projects_list = json.loads(projects_string)
            return projects_list
        except Exception as e:
            print(f"Error decrypting projects list: {e}")
            return None
    else:
        print("No projects found for this user.")
        return []

# Function to log in a user
def login(client, userId, password):
    # Authenticate a user and return login status
    user = __queryUser(client,userId)
    return user and user['password']==cipher.encrypt(pad(password.encode(), AES.block_size))

# Function to add a user to a project
def joinProject(client, userId, projectId):
    # Add a user to a specified project
    user = __queryUser(client, userId)
    if user:
        arr = user.get("projects", [])
        arr.append(projectId)
        arr.sort()
        # Use $set to update the projects field correctly
        doc.update_one({ 'userId': cipher.encrypt(pad(userId.encode(), AES.block_size)) }, { '$set': { 'projects': arr } })
        return True
    return False

# Function to get the list of projects for a user
def getUserProjectsList(client, userId):
    # Get and return the list of projects a user is part of
    user = __queryUser(client, userId)
    if user:
        arr = user.get("projects", [])   
        return arr
    return False
        