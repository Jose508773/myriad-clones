import os
# Import the main FastAPI app class
from fastapi import FastAPI
# Import your CORS middleware
from fastapi.middleware.cors import CORSMiddleware
# Import StaticFiles for serving frontend assets
from fastapi.staticfiles import StaticFiles

# IMPORTANT: Import the routers from your other Python files
from api.funcs import router as funcs_router

# Initialize the main application
app = FastAPI()

# --- CORS Configuration ---
# Allow your production domain as well as local development domains
origins = [
    "https://myriad-clones.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:5500",  # Live Server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routing Delegation ---
# This activates your router routes
app.include_router(funcs_router)

# Mount the static/public directory at the root after other API routes are defined
# We only do this if the folder exists (e.g. during local development).
if os.path.exists("public"):
    app.mount("/", StaticFiles(directory="public", html=True), name="public")