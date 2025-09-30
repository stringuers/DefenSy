# DefenSys Scan Functionality Documentation

## Overview
The scan functionality allows users to perform security scans on their repositories through an integrated frontend-backend system.

## Architecture

### Frontend Components

#### 1. **ScanModal** (`src/components/ScanModal.tsx`)
- **Purpose**: Modal dialog that handles the scan process and displays results
- **Features**:
  - Real-time scan progress tracking
  - Status polling every 2 seconds
  - Error handling with retry capability
  - Results display with severity badges
  - Automatic timeout after 5 minutes

**Props**:
```typescript
{
  isOpen: boolean;
  onClose: () => void;
  repositoryName?: string;
  repositoryId?: string;
  scanType?: string; // 'full', 'quick', 'dependency', etc.
}
```

#### 2. **PreDeploySection** (`src/components/PreDeploySection.tsx`)
- **Purpose**: Dashboard section for managing pre-deployment scans
- **Features**:
  - Repository list with scan status
  - Individual repository scan buttons
  - "Scan All" functionality
  - Quick actions panel

### Backend API

#### Endpoints

**1. Start Scan**
```
POST /api/scans/start
Authorization: Bearer <token>
Body: {
  repository_id?: string,
  scan_type: string,
  target_path?: string
}
Response: {
  id: string,
  status: "running",
  progress: 0,
  current_phase: string,
  created_at: string
}
```

**2. Get Scan Status**
```
GET /api/scans/{scan_id}/status
Authorization: Bearer <token>
Response: {
  id: string,
  status: "running" | "completed" | "failed",
  progress: number (0-100),
  current_phase: string,
  created_at: string,
  completed_at?: string
}
```

**3. Get Scan Results**
```
GET /api/scans/{scan_id}/results
Authorization: Bearer <token>
Response: {
  vulnerabilities: [
    {
      id: string,
      type: string,
      severity: "critical" | "high" | "medium" | "low",
      title: string,
      description: string,
      file_path: string,
      line_number?: number,
      confidence: number,
      status: "open" | "resolved"
    }
  ]
}
```

## Database Schema

### Scans Table
```sql
CREATE TABLE scans (
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
);
```

### Vulnerabilities Table
```sql
CREATE TABLE vulnerabilities (
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
);
```

## Scan Process Flow

### 1. User Initiates Scan
```
User clicks "Scan" button → ScanModal opens → startScanProcess() called
```

### 2. Backend Processing
```
1. Create scan record in database (status: 'running')
2. Add to active_scans dictionary
3. Start background task: run_security_scan()
4. Return scan_id to frontend
```

### 3. Background Scan Execution
```
Phase 1: Preparing scan environment (10%)
Phase 2: Starting DefenSys security analysis (20%)
Phase 3: Analyzing code structure (30%)
Phase 4: Running security checks (50%)
Phase 5: Processing scan results (80%)
Phase 6: Saving results to database (90%)
Phase 7: Complete (100%)
```

### 4. Frontend Polling
```
Every 2 seconds:
  - Call GET /api/scans/{scan_id}/status
  - Update progress bar and phase text
  - If status === 'completed':
    - Fetch results
    - Display vulnerabilities
    - Stop polling
```

### 5. Results Display
```
- Group by severity
- Show file path and line number
- Display confidence score
- Provide remediation suggestions
```

## Integration with DefenSys CLI

The backend integrates with the IasTam DefenSys CLI scanner:

```python
async def run_defensys_cli(scan_id: str, target_path: str):
    cli_path = IASTAM_PATH / "defensys_cli_api_enhanced.py"
    
    cmd = [
        "python3", str(cli_path),
        target_path,
        "-r",  # recursive
        "-f", "json",  # output format
        "--deep-analysis"
    ]
    
    # Execute with 5-minute timeout
    process = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )
    
    stdout, stderr = await asyncio.wait_for(
        process.communicate(), 
        timeout=300
    )
    
    # Parse JSON results and convert to our format
    results = json.loads(stdout.decode())
    return format_vulnerabilities(results)
```

## Error Handling

### Frontend
- **Network Errors**: Display error message with retry button
- **Timeout**: Automatically stop polling after 5 minutes
- **API Errors**: Show toast notification with error details

### Backend
- **CLI Failure**: Falls back to mock data for testing
- **Timeout**: Kills process after 5 minutes
- **Parse Errors**: Returns mock vulnerabilities

## Mock Data Fallback

If the DefenSys CLI is not available, the system uses mock data:

```python
def get_mock_vulnerabilities():
    return [
        {
            "type": "vulnerability",
            "severity": "critical",
            "title": "SQL Injection vulnerability detected",
            "description": "User input directly inserted into SQL query",
            "file_path": "src/auth.py",
            "line_number": 45,
            "confidence": 0.95
        },
        # ... more mock vulnerabilities
    ]
```

## Usage Examples

### Start a Repository Scan
```typescript
// In PreDeploySection.tsx
const handleStartScan = (repoId: string, repoName: string) => {
  setSelectedRepo({ id: repoId, name: repoName });
  setIsScanModalOpen(true);
};
```

### Monitor Scan Progress
```typescript
// In ScanModal.tsx
const pollInterval = setInterval(async () => {
  const status = await getScanStatus(scanResponse.id);
  setScanProgress(status.progress);
  setCurrentPhase(status.current_phase);
  
  if (status.status === 'completed') {
    clearInterval(pollInterval);
    const results = await getScanResults(scanResponse.id);
    displayResults(results);
  }
}, 2000);
```

## Testing

### Manual Testing
1. Start the backend: `cd server && python app.py`
2. Start the frontend: `npm run dev`
3. Login to the dashboard
4. Navigate to "Pre-Deploy Security" tab
5. Click "Scan" on any repository
6. Observe the scan progress and results

### API Testing
```bash
# Start a scan
curl -X POST http://localhost:8000/api/scans/start \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"scan_type": "full"}'

# Check status
curl http://localhost:8000/api/scans/{scan_id}/status \
  -H "Authorization: Bearer <token>"

# Get results
curl http://localhost:8000/api/scans/{scan_id}/results \
  -H "Authorization: Bearer <token>"
```

## Future Enhancements

1. **WebSocket Support**: Real-time updates instead of polling
2. **Scan Scheduling**: Automated periodic scans
3. **Custom Scan Rules**: User-defined security policies
4. **Scan History**: View past scan results
5. **Export Reports**: PDF/CSV export of scan results
6. **Remediation Workflow**: Track fix progress
7. **CI/CD Integration**: GitHub Actions, GitLab CI integration
8. **Notifications**: Email/Slack alerts for critical findings

## Troubleshooting

### Scan Stuck at 0%
- Check backend logs for errors
- Verify DefenSys CLI is accessible
- Check database connection

### No Results Displayed
- Verify scan completed successfully
- Check API endpoint responses
- Look for JavaScript console errors

### Timeout Errors
- Increase timeout duration in ScanModal
- Optimize scan target (smaller codebase)
- Check system resources

## Configuration

### Environment Variables
```bash
# Backend
VITE_API_URL=http://localhost:8000
SECRET_KEY=your-secret-key

# Frontend
VITE_API_URL=http://localhost:8000
```

### Scan Types
- `full`: Complete security analysis
- `quick`: Fast vulnerability scan
- `dependency`: Dependency-only scan
- `sast`: Static analysis only
- `secrets`: Secret detection only

## Security Considerations

1. **Authentication**: All scan endpoints require valid JWT token
2. **Authorization**: Users can only access their own scans
3. **Rate Limiting**: Implement to prevent abuse
4. **Input Validation**: Sanitize all user inputs
5. **Secure Storage**: Encrypt sensitive scan results
6. **Access Control**: Role-based permissions for scan features

---

**Last Updated**: 2025-09-30
**Version**: 1.0.0
