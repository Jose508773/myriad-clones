from pydantic import BaseModel
from fastapi import APIRouter

router = APIRouter()

people = []

my_users = {}

class user(BaseModel):
    name: str
    age: int

class SpecialUser(BaseModel):
    name: str
    age: int
    id: int

@router.get("/users")
def get_users():
    return people + [{"id": k, **v} for k, v in my_users.items()]

@router.get("/users/{user_id}")
def get_single_user(user_id: int):
    if user_id in my_users:
        return my_users[user_id]
    idx = user_id - 1
    if 0 <= idx < len(people):
        return people[idx]
    return {"error": "User not found"}

@router.post("/addUser")
def add_user(user: user):
    people.append(user)
    return people

@router.post("/randomUserId")
def update_user(user: SpecialUser):
    if user.id in my_users:
        return {"error": "ID already exists"}
    my_users[user.id] = {"name": user.name, "age": user.age}
    return my_users
