# Import necessary libraries and modules
from pymongo import MongoClient
import hardwareDatabase

MONGODB_SERVER = "mongodb+srv://masterUser:iXshJM0Tn5C9aAYt@userinfo.qp9mr.mongodb.net/?retryWrites=true&w=majority&appName=UserInfo"
# Connect to MongoDB
client = MongoClient(MONGODB_SERVER)
db = client["info"]
projects_collection = db["Projects"]

'''
Structure of Project entry:
Project = {
    'projectName': projectName,
    'projectId': projectId,
    'description': description,
    'hwSets': {HW1: 0, HW2: 10, ...},
    'users': [user1, user2, ...]
}
'''

# Function to query a project by its ID
def queryProject(client, projectId):
    # Query and return a project from the database
    project = projects_collection.find_one({'projectId': projectId})
    if project:
        return project
    else:
        return False
    pass

# Function to create a new project
def createProject(client, projectName, projectId, description):
    # Create a new project in the database
    if(not queryProject(client,projectId)):
        Project = {
            'projectName': projectName,
            'projectId': projectId,
            'description': description,
            'hwSets': {},
            'users': []
        }
        projects_collection.insert_one(Project)
        return f"Project '{projectName}' created with ID {projectId}"
    return False

# Function to add a user to a project
def addUser(client, projectId, userId):
    # Add a user to the specified project
    proj=queryProject(client,projectId)
    flag = any(user==userId for user in proj['users'].count(userId) )
    if(not flag):
        result = projects_collection.update_one(
            {'projectId': projectId},
            {'$addToSet': {'users': userId}}
        )
        return f"User {userId} added to project {projectId}"
    else:
        return False
    pass

# Function to update hardware usage in a project
def updateUsage(client, projectId, hwSetName, increment=True):
    # Update the usage of a hardware set in the specified project
    change = 1 if increment else -1
    result = projects_collection.update_one(
        {'projectId': projectId, f'hwSets.{hwSetName}': {'$exists': True}},
        {'$inc': {f'hwSets.{hwSetName}': change}}
    )
    if result.modified_count > 0:
        return f"Hardware usage for '{hwSetName}' in project {projectId} updated"
    else:
        return f"No project found with ID '{projectId}' or hardware set does not exist"
    pass

# Function to check out hardware for a project
def checkOutHW(client, projectId, hwSetName, qty, userId):
    # Check out hardware for the specified project and update availability
    hw_set = hardwareDatabase.queryHardwareSet(hwSetName)
    if hw_set and hw_set['availability'] >= qty:
        hardwareDatabase.updateAvailability(hwSetName, hw_set['availability'] - qty)
        updateUsage(projectId, hwSetName, increment=True)
        addUser(projectId, userId)
        return f"{qty} units of '{hwSetName}' checked out for project {projectId}"
    else:
        return f"Insufficient hardware availability for '{hwSetName}'"
    pass

# Function to check in hardware for a project
def checkInHW(client, projectId, hwSetName, qty, userId):
    # Check in hardware for the specified project and update availability
    hardwareDatabase.updateAvailability(hwSetName, qty, increase=True)
    updateUsage(projectId, hwSetName, increment=False)
    return f"{qty} units of '{hwSetName}' checked in for project {projectId}"
    pass

