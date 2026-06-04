
# Import the main FastAPI app class
from fastapi import FastAPI
# Import your CORS middleware
from fastapi.middleware.cors import CORSMiddleware
# Import StaticFiles for serving frontend assets
from fastapi.staticfiles import StaticFiles

# IMPORTANT: Import the routers from your other Python files
# We rename them using 'as' so we don't confuse the two 'router' variables
from api.funcs import router as funcs_router

# Initialize the main application
app = FastAPI()

# --- CORS Configuration (Same as before) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routing Delegation ---

# Tell the main app to include all endpoints from the users.py file
app.include_router(funcs_router)

# Mount the static/public directory at the root after other API routes are defined
app.mount("/", StaticFiles(directory="public", html=True), name="public")