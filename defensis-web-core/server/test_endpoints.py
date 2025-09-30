#!/usr/bin/env python3
"""
Quick test script to verify API endpoints are registered
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✓ Health check: {response.status_code}")
        print(f"  Response: {response.json()}")
        return True
    except Exception as e:
        print(f"✗ Health check failed: {e}")
        return False

def test_docs():
    """Test API docs are accessible"""
    try:
        response = requests.get(f"{BASE_URL}/api/docs")
        print(f"✓ API docs: {response.status_code}")
        return True
    except Exception as e:
        print(f"✗ API docs failed: {e}")
        return False

def test_endpoints_exist():
    """Test that scan endpoints exist (will return 401 without auth, but not 404)"""
    endpoints = [
        "/api/auth/signup",
        "/api/auth/login",
        "/api/dashboard/stats",
        "/api/scans/start",
        "/api/repositories",
    ]
    
    print("\nTesting endpoint registration:")
    for endpoint in endpoints:
        try:
            response = requests.post(f"{BASE_URL}{endpoint}") if "start" in endpoint or "signup" in endpoint or "login" in endpoint else requests.get(f"{BASE_URL}{endpoint}")
            if response.status_code == 404:
                print(f"✗ {endpoint}: NOT FOUND (404)")
            elif response.status_code in [401, 422]:
                print(f"✓ {endpoint}: Registered (returns {response.status_code} - expected without auth)")
            else:
                print(f"✓ {endpoint}: {response.status_code}")
        except Exception as e:
            print(f"✗ {endpoint}: {e}")

if __name__ == "__main__":
    print("=" * 60)
    print("DefenSys API Endpoint Test")
    print("=" * 60)
    
    if test_health():
        test_docs()
        test_endpoints_exist()
    else:
        print("\n⚠️  Server is not running. Start it with: python app.py")
    
    print("\n" + "=" * 60)
    print("Test complete!")
    print("=" * 60)
