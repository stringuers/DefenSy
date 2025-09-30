"""
Scan Routes - Separate file to avoid circular imports
"""

import json
import asyncio
import uuid
import logging
from datetime import datetime
from typing import List, Dict, Any
from pathlib import Path

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel

from scanner import get_scanner

logger = logging.getLogger(__name__)

# Create routers
scan_router = APIRouter(prefix="/api/scans", tags=["scanning"])
repo_router = APIRouter(prefix="/api/repositories", tags=["repositories"])

# Import app utilities dynamically to avoid circular import
def get_db_connection():
    """Get database connection"""
    import sqlite3
    from pathlib import Path
    DB_PATH = Path(__file__).parent / "defensis.db"
    return sqlite3.connect(DB_PATH)

def get_current_user_id(credentials = None):
    """Get current user from JWT token"""
    if credentials is None:
        # For testing, return a default user
        return "test-user-id"
    
    try:
        from app import get_current_user
        return get_current_user(credentials)
    except:
        return "test-user-id"

def get_active_scans():
    """Get active scans dict"""
    from app import active_scans
    return active_scans

# Pydantic models
class ScanRequest(BaseModel):
    repository_id: str | None = None
    scan_type: str = "full"
    target_path: str | None = None

class ScanResponse(BaseModel):
    id: str
    status: str
    progress: int
    current_phase: str | None = None
    created_at: str

# ========================================
# Scanning Routes
# ========================================

@scan_router.post("/start", response_model=ScanResponse)
async def start_scan(
    scan_request: ScanRequest,
    background_tasks: BackgroundTasks
):
    """Start a new security scan"""
    scan_id = str(uuid.uuid4())
    user_id = "test-user-id"  # Default user for testing
    
    # Create scan record
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO scans (id, user_id, repository_id, scan_type, status, progress, current_phase)
        VALUES (?, ?, ?, ?, 'running', 0, 'Initializing...')
    """, (scan_id, user_id, scan_request.repository_id, scan_request.scan_type))
    
    conn.commit()
    conn.close()
    
    # Add to active scans
    active_scans = get_active_scans()
    active_scans[scan_id] = {
        "id": scan_id,
        "user_id": user_id,
        "status": "running",
        "progress": 0,
        "current_phase": "Initializing..."
    }
    
    # Start background scan
    background_tasks.add_task(run_security_scan, scan_id, scan_request)
    
    return ScanResponse(
        id=scan_id,
        status="running",
        progress=0,
        current_phase="Initializing...",
        created_at=datetime.utcnow().isoformat()
    )

@scan_router.get("/{scan_id}/status")
async def get_scan_status(scan_id: str):
    """Get scan status"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT status, progress, current_phase, created_at, completed_at
        FROM scans 
        WHERE id = ?
    """, (scan_id,))
    
    result = cursor.fetchone()
    conn.close()
    
    if not result:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    return {
        "id": scan_id,
        "status": result[0],
        "progress": result[1],
        "current_phase": result[2],
        "created_at": result[3],
        "completed_at": result[4]
    }

@scan_router.get("/{scan_id}/results")
async def get_scan_results(scan_id: str):
    """Get scan results and vulnerabilities"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Verify scan exists
    cursor.execute("SELECT id FROM scans WHERE id = ?", (scan_id,))
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Scan not found")
    
    # Get vulnerabilities
    cursor.execute("""
        SELECT id, type, severity, title, description, file_path, line_number, confidence, status
        FROM vulnerabilities 
        WHERE scan_id = ?
        ORDER BY 
            CASE severity 
                WHEN 'critical' THEN 1
                WHEN 'high' THEN 2
                WHEN 'medium' THEN 3
                WHEN 'low' THEN 4
                ELSE 5
            END,
            created_at DESC
    """, (scan_id,))
    
    vulnerabilities = []
    for row in cursor.fetchall():
        vulnerabilities.append({
            "id": row[0],
            "type": row[1],
            "severity": row[2],
            "title": row[3],
            "description": row[4],
            "file_path": row[5],
            "line_number": row[6],
            "confidence": row[7],
            "status": row[8]
        })
    
    conn.close()
    return {"vulnerabilities": vulnerabilities}

# ========================================
# Background Tasks
# ========================================

async def run_security_scan(scan_id: str, scan_request: ScanRequest):
    """Run security scan using the DefenSys scanner"""
    try:
        # Update scan status
        await update_scan_status(scan_id, "running", 10, "Preparing scan environment...")
        
        # Determine target path
        target_path = scan_request.target_path or "/Users/kilanimoemen/Desktop/DefenSy/defensis-web-core"
        
        # Run scanner
        await update_scan_status(scan_id, "running", 20, "Initializing scanner...")
        scanner = get_scanner()
        
        await update_scan_status(scan_id, "running", 30, "Analyzing code...")
        vulnerabilities = await scanner.scan(
            target_path=target_path,
            scan_type=scan_request.scan_type
        )
        
        await update_scan_status(scan_id, "running", 90, "Saving scan results...")
        
        # Save vulnerabilities to database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        for vuln in vulnerabilities:
            vuln_id = str(uuid.uuid4())
            cursor.execute("""
                INSERT INTO vulnerabilities (id, scan_id, type, severity, title, description, file_path, line_number, confidence)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                vuln_id, scan_id, vuln["type"], vuln["severity"], vuln["title"],
                vuln["description"], vuln["file_path"], vuln.get("line_number"), vuln["confidence"]
            ))
        
        conn.commit()
        conn.close()
        
        # Complete scan
        await update_scan_status(scan_id, "completed", 100, "Scan completed successfully")
        
    except Exception as e:
        logger.error(f"Scan failed: {e}")
        await update_scan_status(scan_id, "failed", 0, f"Scan failed: {str(e)}")

async def update_scan_status(scan_id: str, status: str, progress: int, phase: str):
    """Update scan status in database"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if status == "completed":
        cursor.execute("""
            UPDATE scans 
            SET status = ?, progress = ?, current_phase = ?, completed_at = ?
            WHERE id = ?
        """, (status, progress, phase, datetime.utcnow().isoformat(), scan_id))
    else:
        cursor.execute("""
            UPDATE scans 
            SET status = ?, progress = ?, current_phase = ?
            WHERE id = ?
        """, (status, progress, phase, scan_id))
    
    conn.commit()
    conn.close()
    
    # Update active scans
    active_scans = get_active_scans()
    if scan_id in active_scans:
        active_scans[scan_id].update({
            "status": status,
            "progress": progress,
            "current_phase": phase
        })

# ========================================
# Repository Routes
# ========================================

@repo_router.get("/")
async def get_repositories(user_id: str = Depends(get_current_user_id)):
    """Get user repositories"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT id, user_id, name, full_name, description, language, 
               is_private, github_url, last_scan, created_at
        FROM repositories 
        WHERE user_id = ?
        ORDER BY created_at DESC
    """, (user_id,))
    
    repositories = []
    for row in cursor.fetchall():
        repositories.append({
            "id": row[0],
            "user_id": row[1],
            "name": row[2],
            "full_name": row[3],
            "description": row[4],
            "language": row[5],
            "is_private": bool(row[6]),
            "github_url": row[7],
            "last_scan": row[8],
            "created_at": row[9]
        })
    
    conn.close()
    return repositories
