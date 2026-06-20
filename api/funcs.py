from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from api.db import supabase          # our shared Supabase client
from api.models import WorkerCreate, Worker

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
   



# File: api/funcs.py
# This is your router file, imported into index.py as 'funcs_router'

# ─────────────────────────────────────────────
# CREATE — POST /workers
# ─────────────────────────────────────────────
@router.post("/workers", response_model=Worker)
def create_worker(worker: WorkerCreate):
    # .table("workers") targets the table we made in SQL
    # .insert() sends an INSERT INTO workers (...) VALUES (...) under the hood
    # worker.dict() converts the Pydantic model into a plain Python dict (JSON-able)
    response = supabase.table("workers").insert(worker.dict()).execute()

    # Supabase returns a list of inserted rows in response.data
    # We grab the first (and only) one
    if not response.data:
        raise HTTPException(status_code=400, detail="Insert failed")

    return response.data[0]


# ─────────────────────────────────────────────
# READ ALL — GET /workers
# ─────────────────────────────────────────────
@router.get("/workers")
def get_workers():
    # .select("*") means "give me every column"
    response = supabase.table("workers").select("*").execute()
    return response.data   # this is a list of worker dicts


# ─────────────────────────────────────────────
# READ ONE — GET /workers/{worker_id}
# ─────────────────────────────────────────────
@router.get("/workers/{worker_id}")
def get_worker(worker_id: str):
    # .eq("id", worker_id) means WHERE id = worker_id
    response = supabase.table("workers").select("*").eq("id", worker_id).execute()

    if not response.data:
        # 404 = "not found" — standard HTTP status for missing resources
        raise HTTPException(status_code=404, detail="Worker not found")

    return response.data[0]


# ─────────────────────────────────────────────
# UPDATE — PUT /workers/{worker_id}
# ─────────────────────────────────────────────
@router.put("/workers/{worker_id}")
def update_worker(worker_id: str, worker: WorkerCreate):
    # .update() builds an UPDATE workers SET ... WHERE id = worker_id
    response = (
        supabase.table("workers")
        .update(worker.dict())
        .eq("id", worker_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="Worker not found")

    return response.data[0]


# ─────────────────────────────────────────────
# DELETE — DELETE /workers/{worker_id}
# ─────────────────────────────────────────────
@router.delete("/workers/{worker_id}")
def delete_worker(worker_id: str):
    response = supabase.table("workers").delete().eq("id", worker_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Worker not found")

    return {"message": "Worker deleted", "id": worker_id}