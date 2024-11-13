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
            "hwSet1": {
            "user1": 0,
            },
            "hwSet2": {
            "user1": 0
                }
            }
    }

    projects_collection.insert_one(project_data)
    return True, "Project created successfully"

# Function to add a user to a project
def addUser(client, projectId, userId):
    projects_collection = client["info"]["Projects"]
    project = projects_collection.find_one({"projectId": projectId})
    if project and userId not in project["users"]:
        projects_collection.update_one(
            {"projectId": projectId},
            {"$addToSet": {"users": userId}}
        )
        return True
    return False

# Function to update hardware usage in a project
def updateUsage(client, projectId, hwSetName, quantity, increment=True):
    projects_collection = client["info"]["Projects"]
    change = quantity if increment else -quantity
    projects_collection.update_one(
        {"projectId": projectId},
        {"$inc": {f"hwSets.{hwSetName}": change}}
    )

# Function to check out hardware for a project
def checkOutHW(client, projectId, hwSetName, qty, userId):
    hw_set = hardwareDatabase.queryHardwareSet(client, hwSetName)
    if hw_set and hw_set['availability'] >= qty:
        hardwareDatabase.updateAvailability(client, hwSetName, hw_set['availability'] - qty)
        updateUsage(client, projectId, hwSetName, qty, increment=True)
        addUser(client, projectId, userId)
        return True, f"{qty} units of '{hwSetName}' checked out successfully."
    else:
        return False, f"Insufficient availability for '{hwSetName}'."

# Function to check in hardware for a project
def checkInHW(client, projectId, hwSetName, qty, userId):
    hw_set = hardwareDatabase.queryHardwareSet(client, hwSetName)
    projects_collection = client["info"]["Projects"]
    checked_out_quantity = projects_collection.find_one({"projectId": projectId}).get("hwSets", {}).get(hwSetName, {}).get(userId, 0)
    
    if hw_set and checked_out_quantity >= qty:
        hardwareDatabase.updateAvailability(client, hwSetName, hw_set['availability'] + qty)
        updateUsage(client, projectId, hwSetName, qty, increment=False)
        return True, f"{qty} units of '{hwSetName}' checked in successfully."
    else:
        return False, f"Cannot check in more than checked out for '{hwSetName}'."
