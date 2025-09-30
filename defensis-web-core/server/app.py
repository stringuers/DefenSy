#!/usr/bin/env python3
"""
DefenSys Web Core Backend
FastAPI backend integrated with the DefenSys security scanner CLI
"""

import os
import sys
import json
import asyncio
import logging
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any, Union
from pathlib import Path
import subprocess
import uuid
from contextlib import asynccontextmanager

# Add IasTam src to path for imports
IASTAM_PATH = Path(__file__).parent.parent.parent / "IasTam" / "src"
if IASTAM_PATH.exists():
    sys.path.insert(0, str(IASTAM_PATH))

from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect, status, BackgroundTasks, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel, Field, EmailStr
import uvicorn
import jwt
from passlib.context import CryptContext
import sqlite3
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database setup
DB_PATH = Path(__file__).parent / "defensis.db"

def init_database():
    """Initialize SQLite database with required tables"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            plan TEXT DEFAULT 'free',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP
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
            is_private BOOLEAN DEFAULT FALSE,
            github_url TEXT,
            last_scan TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    
    # Scans table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS scans (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            repository_id TEXT,
            scan_type TEXT NOT NULL,
            status TEXT DEFAULT 'running',
            progress INTEGER DEFAULT 0,
            current_phase TEXT,
            results_json TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP,
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
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    
    conn.commit()
    conn.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_database()
    logger.info("Database initialized")
    yield
    # Shutdown
    logger.info("Shutting down...")

# Initialize FastAPI app
app = FastAPI(
    title="DefenSys Web Core API",
    description="Backend for DefenSys Cybersecurity Platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "defensys-web-core-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)

# Global state
active_scans: Dict[str, Dict[str, Any]] = {}
websocket_connections: List[WebSocket] = []

# Import schemas
from schemas import (
    UserCreate, UserLogin, User, Repository, ScanRequest, ScanResponse,
    Vulnerability, SecurityAlert, DashboardStats
)

# Utility functions
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

def get_db_connection():
    return sqlite3.connect(DB_PATH)

# Database helper functions
def create_user(name: str, email: str, password: str) -> str:
    user_id = str(uuid.uuid4())
    password_hash = get_password_hash(password)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            INSERT INTO users (id, email, name, password_hash)
            VALUES (?, ?, ?, ?)
        """, (user_id, email, name, password_hash))
        conn.commit()
        return user_id
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already registered")
    finally:
        conn.close()

def authenticate_user(email: str, password: str) -> Optional[User]:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user_data = cursor.fetchone()
    conn.close()
    
    if not user_data:
        return None
    
    if not verify_password(password, user_data[3]):  # password_hash is at index 3
        return None
    
    return User(
        id=user_data[0],
        email=user_data[1],
        name=user_data[2],
        plan=user_data[4],
        created_at=user_data[5],
        last_login=user_data[6]
    )

def get_user_by_id(user_id: str) -> Optional[User]:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user_data = cursor.fetchone()
    conn.close()
    
    if not user_data:
        return None
    
    return User(
        id=user_data[0],
        email=user_data[1],
        name=user_data[2],
        plan=user_data[4],
        created_at=user_data[5],
        last_login=user_data[6]
    )

# Import and register routes will be done at the end

@app.get("/")
async def root():
    return {"message": "DefenSys Web Core API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# Import and register routes at the end to avoid circular imports
# Let's include the routes directly to avoid circular imports

auth_router = APIRouter(prefix="/api/auth", tags=["authentication"])
dashboard_router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])
scan_router = APIRouter(prefix="/api/scans", tags=["scanning"])
repo_router = APIRouter(prefix="/api/repositories", tags=["repositories"])
websocket_router = APIRouter()

# ========================================
# Authentication Routes
# ========================================

@auth_router.post("/signup")
async def signup(user_data: UserCreate):
    """Register a new user"""
    try:
        user_id = create_user(user_data.name, user_data.email, user_data.password)
        
        # Create access token
        access_token = create_access_token(data={"sub": user_id})
        
        user = get_user_by_id(user_id)
        
        return {
            "message": "User created successfully",
            "access_token": access_token,
            "token_type": "bearer",
            "user": user.dict()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@auth_router.post("/login")
async def login(credentials: UserLogin):
    """Authenticate user and return token"""
    user = authenticate_user(credentials.email, credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )
    
    # Update last login
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE users SET last_login = ? WHERE id = ?",
        (datetime.utcnow().isoformat(), user.id)
    )
    conn.commit()
    conn.close()
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": user.dict()
    }

@auth_router.get("/me", response_model=User)
async def get_current_user_profile(user_id: str = Depends(get_current_user)):
    """Get current user profile"""
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# ========================================
# Dashboard Routes
# ========================================

@dashboard_router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(user_id: str = Depends(get_current_user)):
    """Get dashboard statistics"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get counts
    cursor.execute("SELECT COUNT(*) FROM scans WHERE user_id = ? AND status = 'running'", (user_id,))
    active_scans_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM vulnerabilities v JOIN scans s ON v.scan_id = s.id WHERE s.user_id = ? AND v.severity = 'critical' AND v.status = 'open'", (user_id,))
    critical_issues = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM vulnerabilities v JOIN scans s ON v.scan_id = s.id WHERE s.user_id = ? AND v.status = 'resolved'", (user_id,))
    issues_resolved = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM repositories WHERE user_id = ?", (user_id,))
    repositories_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT created_at FROM scans WHERE user_id = ? ORDER BY created_at DESC LIMIT 1", (user_id,))
    last_scan_result = cursor.fetchone()
    last_scan = last_scan_result[0] if last_scan_result else None
    
    # Calculate security score (simple algorithm)
    cursor.execute("SELECT COUNT(*) FROM vulnerabilities v JOIN scans s ON v.scan_id = s.id WHERE s.user_id = ? AND v.status = 'open'", (user_id,))
    open_issues = cursor.fetchone()[0]
    
    # Basic security score calculation
    security_score = max(0, 100 - (critical_issues * 20) - (open_issues * 2))
    
    conn.close()
    
    return DashboardStats(
        security_score=security_score,
        active_scans=active_scans_count,
        critical_issues=critical_issues,
        issues_resolved=issues_resolved,
        last_scan=last_scan,
        repositories=repositories_count
    )

app.include_router(auth_router)
app.include_router(dashboard_router)

# Import scan routes from separate file to avoid circular imports
from scan_routes import scan_router, repo_router
app.include_router(scan_router)
app.include_router(repo_router)
logger.info("All routers registered successfully")

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
