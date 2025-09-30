"""
Pydantic models for DefenSys Web Core Backend
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# Pydantic models
class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., pattern=r'^[^@]+@[^@]+\.[^@]+$')
    password: str = Field(..., min_length=6, max_length=100)

class UserLogin(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: str
    email: str
    name: str
    plan: str
    created_at: str
    last_login: Optional[str] = None

class Repository(BaseModel):
    id: str
    user_id: str
    name: str
    full_name: str
    description: Optional[str] = None
    language: Optional[str] = None
    is_private: bool = False
    github_url: Optional[str] = None
    last_scan: Optional[str] = None
    created_at: str

class ScanRequest(BaseModel):
    repository_id: Optional[str] = None
    scan_type: str = "full"
    target_path: Optional[str] = None

class ScanResponse(BaseModel):
    id: str
    status: str
    progress: int
    current_phase: Optional[str] = None
    created_at: str

class Vulnerability(BaseModel):
    id: str
    type: str
    severity: str
    title: str
    description: Optional[str] = None
    file_path: Optional[str] = None
    line_number: Optional[int] = None
    confidence: Optional[float] = None
    status: str = "open"

class SecurityAlert(BaseModel):
    id: str
    type: str
    severity: str
    title: str
    message: Optional[str] = None
    is_read: bool = False
    created_at: str

class DashboardStats(BaseModel):
    security_score: int
    active_scans: int
    critical_issues: int
    issues_resolved: int
    last_scan: Optional[str] = None
    repositories: int
    total_scans: int = 0
    vulnerabilities: int = 0
