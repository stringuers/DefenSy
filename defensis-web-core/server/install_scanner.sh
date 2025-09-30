#!/bin/bash

# DefenSys Scanner Installation Script
# Installs Semgrep and verifies the scanner setup

set -e

echo "=========================================="
echo "DefenSys Scanner Installation"
echo "=========================================="
echo ""

# Check Python version
echo "Checking Python version..."
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "✓ Python $python_version found"
echo ""

# Install Semgrep
echo "Installing Semgrep..."
pip3 install semgrep==1.55.2
echo "✓ Semgrep installed"
echo ""

# Verify Semgrep installation
echo "Verifying Semgrep installation..."
semgrep_version=$(semgrep --version)
echo "✓ Semgrep version: $semgrep_version"
echo ""

# Install other requirements
echo "Installing other dependencies..."
pip3 install -r requirements.txt
echo "✓ Dependencies installed"
echo ""

# Test scanner import
echo "Testing scanner module..."
python3 -c "from scanner import get_scanner; scanner = get_scanner(); print('✓ Scanner module loaded successfully')"
echo ""

# Run a quick test scan
echo "Running test scan..."
python3 << 'EOF'
import asyncio
from scanner import get_scanner

async def test_scan():
    scanner = get_scanner()
    print("Scanner initialized")
    print(f"Semgrep available: {scanner.semgrep_available}")
    
    # Get mock data to verify
    mock_vulns = scanner._get_mock_vulnerabilities()
    print(f"✓ Mock data loaded: {len(mock_vulns)} vulnerabilities")

asyncio.run(test_scan())
EOF

echo ""
echo "=========================================="
echo "Installation Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Start the backend: python app.py"
echo "2. Test the scanner from the dashboard"
echo "3. Check logs for Semgrep status"
echo ""
echo "For more info, see: SCANNER_SETUP.md"
echo ""
