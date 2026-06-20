# File: api/models.py
# Pydantic models define what valid input/output JSON looks like
# FastAPI uses these to auto-validate requests AND generate API docs

from pydantic import BaseModel
from typing import Optional

# Shape of data the CLIENT sends when creating a worker
# (no 'id' here — the database generates that for us)
class WorkerCreate(BaseModel):
    name: str          # must be a string
    age: int           # must be a whole number
    salary: float       # decimal number
    position: str       # job title string

# Shape of data we SEND BACK after fetching a worker
# (includes 'id' since the DB has already assigned it)
class Worker(WorkerCreate):
    id: str             # UUID comes back as a string from Supabase