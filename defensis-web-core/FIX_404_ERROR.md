# Fix for 404 Error: POST /api/scans/start

## Problem
The frontend was getting a **404 (Not Found)** error when trying to call:
```
POST http://localhost:8000/api/scans/start
```

## Root Cause
The scan router (`scan_router`) was defined in `routes.py` but **not registered** with the FastAPI app in `app.py`. Only the `auth_router` and `dashboard_router` were included.

## Solution Applied

### 1. Updated `server/app.py`
Added the missing router registrations at the end of the file:

```python
app.include_router(auth_router)
app.include_router(dashboard_router)

# Import scan and repository routers at the end to avoid circular imports
import routes
app.include_router(routes.scan_router)
app.include_router(routes.repo_router)
app.include_router(routes.websocket_router)
logger.info("All routers registered successfully")
```

**Why this approach?**
- Importing `routes` module at the end avoids circular import issues
- `routes.py` imports from `app.py`, so we can't import from `routes.py` at the top of `app.py`

### 2. Updated `server/routes.py`
Added missing logger import:

```python
import logging

logger = logging.getLogger(__name__)
```

## How to Verify the Fix

### Method 1: Check Server Logs
When you start the server, you should see:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:app:Database initialized
INFO:app:All routers registered successfully
INFO:     Application startup complete.
```

### Method 2: Check API Documentation
Visit: http://localhost:8000/api/docs

You should see all these endpoint groups:
- **authentication** - Auth endpoints
- **dashboard** - Dashboard stats
- **scanning** - Scan endpoints ✅ (This should now appear!)
- **repositories** - Repository management

### Method 3: Run Test Script
```bash
cd server
python test_endpoints.py
```

Expected output:
```
✓ Health check: 200
✓ API docs: 200
✓ /api/scans/start: Registered (returns 401 - expected without auth)
```

### Method 4: Test from Frontend
1. Restart the backend server:
   ```bash
   cd server
   python app.py
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```

3. Login and navigate to Dashboard → Pre-Deploy Security
4. Click "Scan" on any repository
5. The scan modal should open and start the scan (no more 404 error!)

## Registered Endpoints

After the fix, these scan endpoints are now available:

### Scan Endpoints
- `POST /api/scans/start` - Start a new security scan
- `GET /api/scans/{scan_id}/status` - Get scan progress
- `GET /api/scans/{scan_id}/results` - Get scan results

### Repository Endpoints
- `GET /api/repositories` - List user repositories
- `POST /api/repositories` - Create a repository
- `POST /api/repositories/github/connect` - Connect GitHub

### WebSocket
- `WS /ws/{user_id}` - Real-time updates

## Troubleshooting

### Still Getting 404?
1. **Restart the server** - Changes to router registration require a restart
   ```bash
   # Stop the server (Ctrl+C)
   python app.py
   ```

2. **Check for import errors** in the console
   ```bash
   # Look for errors like:
   ImportError: cannot import name 'scan_router' from 'routes'
   ```

3. **Verify routes.py has no syntax errors**
   ```bash
   python -m py_compile routes.py
   ```

### Getting 401 Unauthorized?
This is **expected** and means the endpoint is working! You just need to:
1. Login through the frontend
2. The auth token will be automatically included in requests

### Getting 422 Validation Error?
This means the endpoint exists but the request body is invalid. Check:
- Request body format
- Required fields
- Data types

## Files Modified

1. ✅ `server/app.py` - Added router registrations
2. ✅ `server/routes.py` - Added logger import
3. ✅ `server/schemas.py` - Added missing fields to DashboardStats
4. ✅ `server/test_endpoints.py` - Created test script

## Next Steps

1. **Restart your backend server**
2. **Test the scan functionality** from the frontend
3. **Check the console** for any other errors
4. **Monitor the scan progress** in the UI

## Additional Notes

### Why the Circular Import Issue?
- `app.py` defines core functions and models
- `routes.py` imports these from `app.py`
- If `app.py` imports from `routes.py` at the top, Python can't resolve the circular dependency
- **Solution**: Import `routes` module at the end, after all definitions are complete

### Router Registration Order
The order matters for route precedence:
1. `auth_router` - Authentication (highest priority)
2. `dashboard_router` - Dashboard stats
3. `scan_router` - Scanning operations
4. `repo_router` - Repository management
5. `websocket_router` - Real-time updates

---

**Status**: ✅ Fixed
**Date**: 2025-09-30
**Impact**: Scan functionality now fully operational
