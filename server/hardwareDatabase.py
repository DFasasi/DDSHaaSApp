# Import necessary libraries and modules
from pymongo import MongoClient
import app

# Connect to MongoDB
client = MongoClient(app.MONGODB_SERVER)
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
    print(f"Hardware set '{hwSetName}' created with capacity {initCapacity}") #later this will be changed to send update to the client in param
    pass

# Function to query a hardware set by its name
def queryHardwareSet(client, hwSetName):
    # Query and return a hardware set from the database
    result = hw_collection.find_one({'hwName': hwSetName})
    
    if result:
        return result
    else:
        print(f"No hardware set found with name '{hwSetName}'") #later this will be changed to send update to the client in param
        return None
    pass

# Function to update the availability of a hardware set
def updateAvailability(client, hwSetName, newAvailability):
    # Update the availability of an existing hardware set
    result = hw_collection.update_one(
        {'hwName': hwSetName},
        {'$set': {'availability': newAvailability}}
    )
    
    if result.matched_count > 0:
        print(f"Availability for '{hwSetName}' updated to {newAvailability}")
    else:
        print(f"No hardware set found with name '{hwSetName}'")
    pass

# Function to request space from a hardware set
def requestSpace(client, hwSetName, amount):
    # Request a certain amount of hardware and update availability
    hw_set = queryHardwareSet(client, hwSetName)
    
    if hw_set:
        available = hw_set['availability']
        if available >= amount:
            new_availability = available - amount
            updateAvailability(client, hwSetName, new_availability)
            print(f"{amount} units requested from '{hwSetName}'. New availability: {new_availability}")
        else:
            print(f"Insufficient availability in '{hwSetName}'. Only {available} units available.")
    else:
        print(f"Hardware set '{hwSetName}' not found.")
    pass

# Function to get all hardware set names
def getAllHwNames(client):
    # Get and return a list of all hardware set names
    hw_names = hw_collection.find({}, {'_id': 0, 'hwName': 1})
    return [hw['hwName'] for hw in hw_names]
    pass

