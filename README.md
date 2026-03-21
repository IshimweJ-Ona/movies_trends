# MovieStream

A modern, full-stack movie streaming discovery application built with FastAPI and React that leverages The Movie Database (TMDB) API to provide comprehensive movie information, search capabilities, and user favorites management.

## Features

- **Browse Movies** - Discover movies with pagination support
- **Search Functionality** - Find movies by title in real-time
- **Movie Details** - View comprehensive movie information including synopsis, ratings, and genres
- **Watch Trailers** - View movie trailers directly in the app
- **Favorites System** - Save and manage your favorite movies
- **Responsive Design** - Optimized for desktop and mobile devices
- **Skeleton Loading** - Enhanced UX with loading states
- **Error Handling** - Graceful error handling with user-friendly notifications

## Tech Stack

### Backend
- **Framework**: FastAPI
- **Server**: Uvicorn
- **Language**: Python 3.11
- **Key Dependencies**:
  - `httpx` - Async HTTP client for TMDB API
  - `python-dotenv` - Environment variable management
  - `cachetools` - Caching for optimized API calls
  - `tenacity` - Retry logic for resilient API requests

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Component Library**: Radix UI
- **HTTP Client**: Axios/httpx

## Project Structure

```
moviestream/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile           # Docker configuration
├── frontend/
│   ├── src/
│   │   ├── main.tsx         # React entry point
│   │   ├── app/
│   │   │   ├── App.tsx      # Main app component
│   │   │   ├── api/         # API integration
│   │   │   ├── components/  # Reusable components
│   │   │   ├── data/        # Types and constants
│   │   │   └── hooks/       # Custom React hooks
│   │   └── styles/          # Global styles
│   ├── package.json         # Node dependencies
│   ├── vite.config.ts       # Vite configuration
│   └── Dockerfile           # Docker configuration
├── docker-compose.yml       # Multi-container orchestration
└── README.md               # This file
```

## Prerequisites

- **Python**: 3.11+
- **Node.js**: 20+
- **Docker**: 20.10+ (for containerized deployment)
- **TMDB API Key**: Free account at [themoviedb.org](https://www.themoviedb.org/settings/api)

## Installation & Setup

### Option 1: Local Development

#### Backend Setup
```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

#### Frontend Setup
```bash
cd frontend
npm install
```

#### Environment Variables
Create a `.env` file inside the `backend/` directory (backend expects this file):
```bash
cp backend/.env.example backend/.env
# on Windows (PowerShell)
Copy-Item backend\.env.example backend\.env
```

Edit `backend/.env`:
```env
TMDB_API_KEY=your_tmdb_api_key_here
```

Optionally, you can also use a project root `.env` file with the same variable if you run commands from root.

### Option 2: Docker Deployment

```bash
# Ensure .env file exists in root directory with TMDB_API_KEY

# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d
```
# Delete all containers + volumes + networks
```bash
docker system prune -a --volumes
```
## Running the Application

### Local Development

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

### Using Docker

```bash
docker-compose up

# Backend: http://localhost:8000
# Frontend: http://localhost:3000
# API Docs: http://localhost:8000/docs
```

## API Endpoints

The backend exposes FastAPI endpoints for movie operations:

- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation (ReDoc)

Full API details available at `http://localhost:8000/docs` when running

## Available Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
```

### Backend
```bash
uvicorn main:app --reload              # Development with auto-reload
uvicorn main:app --host 0.0.0.0        # Production build
```

## Features in Detail

### Caching Strategy
The backend implements TTL-based caching to minimize API calls to TMDB and improve performance.

### Error Handling
- Retry logic with exponential backoff for failed API requests
- User-friendly error toasts on the frontend
- Comprehensive error logging

### Favorites Management
User favorites are stored locally in the browser (localStorage), allowing persistent favorite movies across sessions.

## Environment Configuration

### Backend Environment Variables
```env
TMDB_API_KEY        # Required: Your TMDB API key
PYTHONDONTWRITEBYTECODE=1
PYTHONUNBUFFERED=1
```

### Frontend Configuration
The frontend automatically connects to the backend at `http://backend:8000` when running in Docker, or `http://localhost:8000` in local development.

## Troubleshooting

### Backend
- **"TMDB_API_KEY not found"**: Ensure `.env` file exists in the backend directory with a valid API key
- **Port 8000 already in use**: Run on a different port with `--port XXXX`

### Frontend
- **Cannot connect to backend**: Check that the backend is running and the API URL is correctly configured
- **Build errors**: Clear `node_modules/` and run `npm install` again

### Docker
- **Build fails**: Ensure all files are present and Docker daemon is running
- **Services can't communicate**: Verify they're on the same Docker network (handled by docker-compose)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for the movie data API
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [React](https://react.dev/) and [Vite](https://vitejs.dev/) for the frontend
- [Radix UI](https://www.radix-ui.com/) for accessible components

## Support

For issues and questions:
1. Check existing issues on GitHub
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce
