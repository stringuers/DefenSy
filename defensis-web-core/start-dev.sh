#!/bin/bash

# DefenSys Web Core - Development Startup Script

echo "🛡️  Starting DefenSys Web Core Development Environment..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Node.js/npm is not installed. Please install Node.js."
    exit 1
fi

# Function to cleanup background processes
cleanup() {
    echo "🔄 Shutting down services..."
    if [[ ! -z $BACKEND_PID ]]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [[ ! -z $FRONTEND_PID ]]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start Backend Server
echo "🚀 Starting Backend Server (port 3001)..."
cd server

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Start the backend server
python app.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start Frontend Development Server
echo "🚀 Starting Frontend Development Server (port 8080)..."
cd ..

# Install Node.js dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
fi

# Start the frontend server
npm run dev &
FRONTEND_PID=$!

echo "✅ Both servers are starting up..."
echo "🌐 Frontend: http://localhost:8080"
echo "🔧 Backend API: http://localhost:3001"
echo "📚 API Docs: http://localhost:3001/api/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait