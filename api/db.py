import os
from supabase import create_client, Client

supabase_url = os.environ.get("SUPABASE_URL", "")
supabase_key = os.environ.get("SUPABASE_KEY", "")

supabase: Client = None

if supabase_url and supabase_key:
    supabase = create_client(supabase_url, supabase_key)
else:
    print("⚠️ WARNING: SUPABASE_URL or SUPABASE_KEY environment variables are missing.")
    # We will raise a helpful runtime exception if supabase is called without credentials set
    class MissingSupabaseClient:
        def __getattr__(self, name):
            raise RuntimeError(
                "Supabase client is not initialized. "
                "Please make sure SUPABASE_URL and SUPABASE_KEY environment variables are set."
            )
    supabase = MissingSupabaseClient()
