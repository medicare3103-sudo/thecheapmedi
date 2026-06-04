import os
from pymongo import MongoClient
from pymongo.collection import ReturnDocument

# Retrieve MongoDB URI from environment or default to local
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client = MongoClient(MONGODB_URI)

# Select the database name. If specified in the URI connection string, pymongo
# handles it, otherwise we default to "medicare".
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
