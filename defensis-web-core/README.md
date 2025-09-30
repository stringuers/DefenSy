# 🛡️ DefenSys Web Core

**Where Intelligence Meets Security**

DefenSys Web Core is a comprehensive cybersecurity platform that provides AI-powered security scanning and vulnerability detection capabilities. Built with modern web technologies and integrated with the DefenSys CLI for advanced security analysis.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+ and pip
- **Git** for cloning repositories

### One-Command Setup

```bash
# Clone the repository
git clone <repository-url>
cd defensis-web-core

# Make startup script executable
chmod +x start-dev.sh

# Start both frontend and backend
./start-dev.sh
```

The startup script will:
- Install Python dependencies in a virtual environment
- Install Node.js dependencies  
- Start the backend API server on port 3001
- Start the frontend development server on port 8080
- Open the application in your default browser

### Manual Setup

**Backend Setup:**
```bash
cd server
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**Frontend Setup:**
```bash
# In a new terminal
npm install
npm run dev
```

## 🎯 Features

### 🔒 Security Scanning
- **AI-Powered Analysis**: Advanced vulnerability detection using the DefenSys CLI
- **Real-time Scanning**: Live progress updates via WebSocket connections
- **Multi-Language Support**: Scans TypeScript, Python, JavaScript, and more
- **Comprehensive Reports**: Detailed vulnerability reports with confidence scores

### 🔗 GitHub Integration
- **Repository Connection**: Easy GitHub OAuth integration
- **Automated Scanning**: Scan repositories directly from GitHub
- **Branch Analysis**: Support for multiple branches and pull requests

### 📊 Dashboard & Analytics
- **Security Score**: Real-time security posture calculation
- **Vulnerability Tracking**: Track and manage security issues
- **Scan History**: Complete history of all security scans
- **Alert System**: Immediate notifications for critical vulnerabilities

### 🛠️ Platform Features
- **User Authentication**: Secure JWT-based authentication
- **Multi-tier Access**: Free, developer, team, and enterprise plans
- **API-First Design**: Complete REST API with OpenAPI documentation
- **Real-time Updates**: WebSocket-based live updates

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript and Vite
- **UI Library**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context + TanStack Query
- **Real-time**: WebSocket integration for live updates

### Backend (FastAPI + Python)
- **API Framework**: FastAPI with automatic OpenAPI docs
- **Database**: SQLite with automatic schema creation
- **Authentication**: JWT tokens with bcrypt password hashing
- **CLI Integration**: DefenSys security scanner integration
- **Real-time**: WebSocket support for live scan updates

### DefenSys CLI Integration
- **Location**: `../IasTam/src/defensys_cli_api_enhanced.py`
- **Features**: AI-powered security scanning, attack chain analysis
- **Fallback**: Mock data when CLI is unavailable
- **Output**: JSON-formatted vulnerability reports

## 📁 Project Structure

```
defensis-web-core/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── AuthModal.tsx  # Authentication modal
│   │   ├── GitHubModal.tsx # GitHub integration
│   │   ├── ScanModal.tsx  # Security scanning
│   │   └── Dashboard*.tsx # Dashboard components
│   ├── contexts/          # React contexts
│   ├── lib/              # Utilities and API client
│   ├── pages/            # Main application pages
│   └── hooks/            # Custom React hooks
├── server/                # Backend source code
│   ├── app.py            # Main FastAPI application
│   ├── routes.py         # API route definitions
│   └── requirements.txt  # Python dependencies
├── start-dev.sh          # Development startup script
├── WARP.md              # Development guide for AI assistants
└── README.md            # This file
```

## 🔌 API Documentation

When running the backend, visit:
- **API Docs**: http://localhost:3001/api/docs
- **ReDoc**: http://localhost:3001/api/redoc

### Key Endpoints

**Authentication**:
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Current user profile

**Security Scanning**:
- `POST /api/scans/start` - Start security scan
- `GET /api/scans/{id}/status` - Scan progress
- `GET /api/scans/{id}/results` - Vulnerability results

**Dashboard**:
- `GET /api/dashboard/stats` - Security metrics
- `GET /api/dashboard/alerts` - Security notifications

## 🗄️ Database Schema

The application uses SQLite with the following tables:

- **users**: User accounts and authentication
- **repositories**: Connected GitHub repositories
- **scans**: Security scan records and status
- **vulnerabilities**: Detected security issues
- **security_alerts**: User notifications

Database is automatically created on first run with proper foreign key relationships.

## 🔧 Development

### Adding New Features

1. **Backend Changes**: Add endpoints in `server/routes.py`
2. **API Client**: Update `src/lib/api.ts` with new methods
3. **Frontend**: Create/update React components
4. **Testing**: Use the API docs for endpoint testing

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001
VITE_APP_TITLE=DefenSys Web Core
```

### CLI Integration

The backend integrates with the DefenSys CLI located in the IasTam repository:

```
../IasTam/src/defensys_cli_api_enhanced.py
```

If the CLI is not available, the system falls back to mock vulnerability data for demonstration purposes.

## 🚦 Troubleshooting

### Backend Issues
- Ensure Python 3.8+ is installed
- Check if IasTam CLI is available at `../IasTam/src/`
- Verify virtual environment is activated
- Database permissions (SQLite file creation)

### Frontend Issues
- Ensure Node.js 18+ is installed
- Check if backend is running on port 3001
- Verify API base URL in environment variables
- Browser console for detailed error messages

### Integration Issues
- Check DefenSys CLI path in `server/routes.py`
- Verify JSON output format from CLI
- Monitor backend logs for CLI execution errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Related Projects

- **IasTam**: DefenSys CLI and security analysis engine
- **shadcn/ui**: UI component library
- **FastAPI**: Modern Python web framework
- **React**: Frontend JavaScript library

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api/docs`
- Review the WARP.md file for development guidance

---

Built with ❤️ for cybersecurity professionals and developers who prioritize secure code.
