# Import necessary libraries and modules
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb+srv://masterUser:iXshJM0Tn5C9aAYt@userinfo.qp9mr.mongodb.net/?retryWrites=true&w=majority&appName=UserInfo")
db = client["hardwareDB"]  # Define the database
hw_collection = db["hardwareSets"]  # Define the collection

'''
Structure of Hardware Set entry:
HardwareSet = {
    'hwName': hwSetName,
    'capacity': initCapacity,
    'availability': initCapacity
}
'''

# Function to create a new hardware set
def createHardwareSet(client, hwSetName, initCapacity):
    # Create a new hardware set in the database
    HardwareSet = {
        'hwName': hwSetName,
        'capacity': initCapacity,
        'availability': initCapacity
    }
    
    # Insert the hardware set into the collection
    hw_collection.insert_one(HardwareSet)
    print(f"Hardware set '{hwSetName}' created with capacity {initCapacity}")
    pass

# Function to query a hardware set by its name
def queryHardwareSet(client, hwSetName):
    # Query and return a hardware set from the database
    pass

# Function to update the availability of a hardware set
def updateAvailability(client, hwSetName, newAvailability):
    # Update the availability of an existing hardware set
    pass

# Function to request space from a hardware set
def requestSpace(client, hwSetName, amount):
    # Request a certain amount of hardware and update availability
    pass

# Function to get all hardware set names
def getAllHwNames(client):
    # Get and return a list of all hardware set names
    pass

