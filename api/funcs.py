# Import APIRouter instead of the main FastAPI class
from fastapi import APIRouter

# Create a router instance specifically for user-related endpoints
router = APIRouter()

# Define a GET endpoint on this specific router
@router.get("/users")
# The function that runs when someone visits /users
def get_users():
    # Return a dummy list of users
    return {"users": ["Alice", "Bob", "Charlie"]}

# Define another endpoint expecting a user ID parameter
@router.get("/users/{user_id}")
# The function accepts the user_id from the URL
def get_single_user(user_id: int):
    # Return data specific to that ID
    return {"message": f"Fetching data for user {user_id}"}