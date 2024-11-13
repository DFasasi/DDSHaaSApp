from pymongo import MongoClient
import hardwareDatabase
import logging

# MongoDB setup
MONGODB_SERVER = "mongodb+srv://masterUser:iXshJM0Tn5C9aAYt@userinfo.qp9mr.mongodb.net/?retryWrites=true&w=majority&appName=UserInfo"
client = MongoClient(MONGODB_SERVER)
db = client["info"]
projects_collection = db["Projects"]

# Function to query a project by ID
def queryProject(client, projectId):
    projects_collection = client["info"]["Projects"]
    return projects_collection.find_one({"projectId": projectId})

# Function to create a new project
def createProject(client, projectName, projectId, description):
    projects_collection = client["info"]["Projects"]
    if projects_collection.find_one({"projectId": projectId}):
        return False, "Project ID already exists"
    
    # project_data = {
    #     "projectId": projectId,
    #     "projectName": projectName,
    #     "description": description,
    #     "hwSets": {},
    #     "users": []
    # }

    project_data = {
        "projectId": projectId,
        "projectName": projectName,
        "description": description,
        "hwSets": {
            "Hardware Set 1": {
            
            },
            "Hardware Set 2": {
            
                }
            }
    }

    projects_collection.insert_one(project_data)
    return True, "Project created successfully"

# Function to add a user to a project
def addUser(client, projectId, userId):
    add_user_to_hw_set(projectId,'Hardware Set 1',userId,0)
    add_user_to_hw_set(projectId,'Hardware Set 2',userId,0)
    
def add_user_to_hw_set(projectId, hwSetName, userId, initial_value=0):
    projects_collection = client["info"]["Projects"]
    update_field = f"hwSets.{hwSetName}.{userId}"
    result = projects_collection.update_one( {"projectId": projectId}, {"$set": {update_field: initial_value}} )
    return result.matched_count, result.modified_count

# Function to update hardware usage in a project
def updateUsage(client, projectId, hwSetName, quantity, userId):
    projects_collection = client["info"]["Projects"]
    update_field = f"hwSets.{hwSetName}.{userId}" 
    result = projects_collection.update_one( {"projectId": projectId}, {"$set": {update_field: quantity}} ) 
    return result.matched_count, result.modified_count

# Function to check out hardware for a project
def checkOutHW(client, projectId, hwSetName, qty, userId):
    hw_set = hardwareDatabase.queryHardwareSet(client, hwSetName,projectId)
    projects_collection = client["info"]["Projects"]
    query = { "projectId": projectId, f"hwSets.{hwSetName}.{userId}": {"$exists": True} }
    projection = { f"hwSets.{hwSetName}.{userId}": 1, "_id": 0 }

    result = projects_collection.find_one(query, projection)
    user_checkout = result['hwSets'][hwSetName].get(userId, 0)

    if hw_set and hw_set['availability'] >= qty:
        new_availability = hw_set['availability'] - qty 
        hardwareDatabase.updateAvailability(hwSetName, new_availability,projectId) 
        updateUsage(client, projectId, hwSetName, qty+user_checkout, userId)
        return 200, f"{qty} units of '{hwSetName}' checked out successfully.",new_availability,qty+user_checkout
    else: 
        new_availability = 0 
        hardwareDatabase.updateAvailability(hwSetName, new_availability,projectId) 
        updateUsage(client, projectId, hwSetName, hw_set['availability']+user_checkout, userId)
        return 404, f"Insufficient availability for '{hwSetName}'.",new_availability,hw_set['availability']+user_checkout

# Function to check in hardware for a project
def checkInHW(client, projectId, hwSetName, qty, userId):
    hw_set = hardwareDatabase.queryHardwareSet(client, hwSetName,projectId)
    projects_collection = client["info"]["Projects"]
    query = { "projectId": projectId, f"hwSets.{hwSetName}.{userId}": {"$exists": True} }
    projection = { f"hwSets.{hwSetName}.{userId}": 1, "_id": 0 }

    result = projects_collection.find_one(query, projection)
    if not result:
        return 400, f"Project does not exist."
    
    user_checkout = result['hwSets'][hwSetName].get(userId, 0)

    if hw_set and qty <= user_checkout:
        hardwareDatabase.updateAvailability(hwSetName, hw_set['availability'] + qty,projectId)
        updateUsage(client, projectId, hwSetName, user_checkout-qty, userId)
        return 200, f"{qty} units of '{hwSetName}' checked in successfully.",hw_set['availability'] + qty,qty+user_checkout
    else:
        return 400, f"Cannot check in more than checked out for '{hwSetName}'.",hw_set['availability'] + qty,qty+user_checkout
