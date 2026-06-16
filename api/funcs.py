from pydantic import BaseModel
from fastapi import APIRouter

router = APIRouter()

# ---- Two storage spots ----
people = []       # simple users (no id)
my_users = {}     # users with a random id  →  { 42: {"name": "Jose", "age": 20} }

# ---- Models: define what data the frontend must send ----
class User(BaseModel):
    name: str
    age: int

class UserWithId(BaseModel):
    name: str
    age: int
    id: int



# ---- GET /users → return everyone ----
@router.get("/users")
def get_users():
    return people + [{"id": k, **v} for k, v in my_users.items()]

# ---- GET /users/42 → return one user by id ----
@router.get("/users/{user_id}")
def get_single_user(user_id: int):

    if user_id in my_users:
        return {"id": user_id, **my_users[user_id]}
    return {"error": "User not found"}



# ---- POST /addUser → add a simple user ----
@router.post("/addUser")
def add_user(user: User):
    people.append(user)
    return people

# ---- POST /randomUserId → add a user with a random id ----

#user takes on all the information of UserWithId


@router.post("/randomUserId")
def add_user_with_id(user: UserWithId):

    my_users[user.id] = {
        "name": user.name,
        "age": user.age
    }
   
