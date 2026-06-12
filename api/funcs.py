from fastapi import APIRouter

router = APIRouter()

people = [
]

@router.get("/users")
def get_users():
    return people

@router.get("/users/{user_id}")
def get_single_user(user_id: int):
    idx = user_id - 1
    if 0 <= idx < len(people):
        return people[idx]
    return {"error": "User not found"}

@router.post("/addUser")
def add_user(user: dict):
    people.append(user)
    return {"message": "User added successfully", "users": people}
