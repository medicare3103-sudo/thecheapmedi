import os
from pymongo.collection import ReturnDocument
import certifi
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

# Retrieve MongoDB URI from environment or default to local
MONGODB_URI = os.getenv("MONGODB_URI")

if MONGODB_URI:
    try:
        from pymongo import MongoClient
        client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=2000, tlsCAFile=certifi.where())
        client.admin.command('ping')
        db = client.get_database("medicare")
        print("Connected to MongoDB via URI")
    except Exception as e:
        print(f"Failed to connect to MongoDB URI: {e}. Falling back to mongomock.")
        import mongomock
        client = mongomock.MongoClient()
        db = client.get_database("medicare")
else:
    try:
        from pymongo import MongoClient
        client = MongoClient("mongodb://localhost:27017", serverSelectionTimeoutMS=1000)
        client.admin.command('ping')
        db = client.get_database("medicare")
        print("Connected to local MongoDB")
    except Exception:
        print("Local MongoDB not running. Using in-memory mongomock database.")
        import mongomock
        client = mongomock.MongoClient()
        db = client.get_database("medicare")

def get_db():
    """
    Dependency that yields the MongoDB database connection.
    MongoClient is thread-safe and handles connection pooling internally.
    """
    yield db

def get_next_id(collection_name: str) -> int:
    """
    Generates and returns an auto-incrementing integer ID for a given collection.
    This maintains numeric IDs without modifying frontend routes or Pydantic schemas.
    """
    counter = db.counters.find_one_and_update(
        {"_id": collection_name},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER
    )
    return counter["seq"]

# Auto-seed the database if it is empty and has never been initialized
try:
    if db.counters.count_documents({}) == 0 and db.products.count_documents({}) == 0:
        print("No products or counters found in database. Auto-seeding database...")
        # Import seed dynamically to avoid circular import issues
        from . import seed
except Exception as e:
    print(f"Failed to auto-seed database: {e}")


