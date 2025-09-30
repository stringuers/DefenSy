"""
Utility functions for DefenSys Web Core Backend
"""

import os
import sqlite3
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi import WebSocket

# Security configuration
SECRET_KEY = "your-secret-key-here"  # In production, use environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# IASTAM path
IASTAM_PATH = os.path.join(os.path.dirname(__file__), "..", "IasTam")

# Global state
active_scans: Dict[str, Dict[str, Any]] = {}
websocket_connections: List[WebSocket] = []

# Database functions
def get_db_connection():
    """Get database connection"""
    db_path = os.path.join(os.path.dirname(__file__), "defensis.db")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    """Initialize database tables"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            hashed_password TEXT NOT NULL,
            plan TEXT DEFAULT 'free',
            created_at TEXT NOT NULL,
            last_login TEXT
        )
    """)
    
    # Repositories table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS repositories (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            name TEXT NOT NULL,
            full_name TEXT NOT NULL,
            description TEXT,
            language TEXT,
            is_private BOOLEAN DEFAULT 0,
            github_url TEXT,
            last_scan TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    
    # Scans table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS scans (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            repository_id TEXT,
            status TEXT NOT NULL,
            progress INTEGER DEFAULT 0,
            current_phase TEXT,
            created_at TEXT NOT NULL,
            completed_at TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (repository_id) REFERENCES repositories (id)
        )
    """)
    
    # Vulnerabilities table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS vulnerabilities (
            id TEXT PRIMARY KEY,
            scan_id TEXT NOT NULL,
            type TEXT NOT NULL,
            severity TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            file_path TEXT,
            line_number INTEGER,
            confidence REAL,
            status TEXT DEFAULT 'open',
            created_at TEXT NOT NULL,
            FOREIGN KEY (scan_id) REFERENCES scans (id)
        )
    """)
    
    # Security alerts table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS security_alerts (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            type TEXT NOT NULL,
            severity TEXT NOT NULL,
            title TEXT NOT NULL,
            message TEXT,
            is_read BOOLEAN DEFAULT 0,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    
    conn.commit()
    conn.close()

# Password functions
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# JWT functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return user_id
    except JWTError:
        raise credentials_exception

# User functions
def create_user(user_data: dict):
    """Create a new user"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    user_id = str(datetime.utcnow().timestamp())
    hashed_password = get_password_hash(user_data["password"])
    
    cursor.execute("""
        INSERT INTO users (id, email, name, hashed_password, plan, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        user_id,
        user_data["email"],
        user_data["name"],
        hashed_password,
        "free",
        datetime.utcnow().isoformat()
    ))
    
    conn.commit()
    conn.close()
    return user_id

def authenticate_user(email: str, password: str):
    """Authenticate user with email and password"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user_data = cursor.fetchone()
    conn.close()
    
    if not user_data:
        return False
    
    if not verify_password(password, user_data[3]):  # hashed_password is at index 3
        return False
    
    return user_data

def get_user_by_id(user_id: str):
    """Get user by ID"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user_data = cursor.fetchone()
    conn.close()
    
    if not user_data:
        return None
    
    return {
        "id": user_data[0],
        "email": user_data[1],
        "name": user_data[2],
        "plan": user_data[4],
        "created_at": user_data[5],
        "last_login": user_data[6]
    }

# Authentication dependency
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    user_id = verify_token(token, credentials_exception)
    user = get_user_by_id(user_id)
    if user is None:
        raise credentials_exception
    return user
