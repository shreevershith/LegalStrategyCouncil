# Legal Strategy Council

A multi-agent legal strategy system built for the MongoDB Hackathon. This application demonstrates **Statement 2: Multi-Agent Collaboration** using MongoDB Atlas as the coordination backbone.  

**Statement Two: Multi-Agent Collaboration**  
Develop a multi-agent system in which specialized agents explore, assign tasks, and communicate with one another, using MongoDB to organize and oversee contexts. How do agents convey their skills, identify suitable peers for a sub-task, share context effectively within token limits, and perform intricate tasks resulting from successful collaborations?

**Agent names inspired by the TV show "Suits"**

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [MongoDB Configuration](#mongodb-configuration)
- [How It Works](#how-it-works)
- [API Endpoints](#api-endpoints)
- [Solution Architecture](#solution-architecture)
- [Troubleshooting](#troubleshooting)

## Overview

Legal Strategy Council employs four specialized AI agents that collaborate to analyze legal cases and develop winning strategies:

| Agent | Role | Nickname |
|-------|------|----------|
| **Harvey** | Lead Trial Strategist | "The Closer" |
| **Louis** | Precedent & Research Expert | "The Savant" |
| **Tanner** | Adversarial Counsel | "The Destroyer" |
| **Jessica** | Managing Partner / Moderator | "The Mediator" |

### Key Features

- **Multi-round deliberation**: Harvey and Tanner debate the strategy before Jessica synthesizes
- **Step-level tracing**: Every reasoning step is persisted to MongoDB for auditability
- **Inter-agent messaging**: Agents communicate through MongoDB for coordination
- **Real-time updates**: Watch agents analyze in real-time via Server-Sent Events (SSE)
- **PDF extraction**: Upload case documents and automatically extract case information
- **Conflict detection**: Automatically identifies disagreements between agents
- **Modern UI**: Beautiful, responsive interface with dark mode support

## Tech Stack

- **Backend**: Python 3.11+ with FastAPI
- **Frontend**: React 18+ with Vite and Tailwind CSS v4
- **Database**: MongoDB Atlas (or local MongoDB)
- **LLM**: Groq API (configurable - supports multiple models)
- **Real-time Updates**: Server-Sent Events (SSE)
- **PDF Processing**: PyPDF2 for document extraction
- **UI Components**: shadcn/ui (Radix UI primitives)

## Project Structure

```
legal-multi-agents/
├── backend/
│   ├── main.py                    # FastAPI application and endpoints
│   ├── config.py                  # Configuration settings and environment variables
│   ├── database.py                # MongoDB connection and collection management
│   ├── requirements.txt           # Python dependencies
│   ├── models/
│   │   └── schemas.py             # Pydantic models for data validation
│   ├── agents/
│   │   ├── base_agent.py          # Base agent class with LLM integration
│   │   ├── harvey.py              # Harvey - Lead Trial Strategist
│   │   ├── louis.py               # Louis - Precedent Expert
│   │   ├── tanner.py              # Tanner - Adversarial Counsel
│   │   └── jessica.py             # Jessica - Managing Partner
│   └── services/
│       ├── orchestrator.py        # Multi-round workflow orchestration
│       ├── conflict_detector.py   # Conflict detection service
│       ├── mongo_utils.py         # MongoDB coordination utilities
│       └── langgraph_wrapper.py   # Step-level tracing for auditability
├── frontend/
│   ├── package.json               # Node.js dependencies
│   ├── vite.config.js             # Vite configuration with proxy
│   ├── tailwind.config.js         # Tailwind CSS configuration
│   └── src/
│       ├── App.jsx                # Main application component
│       ├── main.jsx               # React entry point
│       ├── index.css              # Global styles and theme
│       ├── lib/
│       │   └── utils.js           # Utility functions (class merging)
│       └── components/
│           ├── CaseInput.jsx      # Case input form with PDF upload
│           ├── AgentPanel.jsx    # Individual agent display card
│           ├── DebateView.jsx    # Agent grid view
│           ├── ConflictView.jsx  # Conflict display component
│           ├── FinalStrategy.jsx # Final strategy display
│           ├── LandingPage.jsx   # Landing page with hero, features, FAQ
│           └── ui/                # Reusable UI components (shadcn/ui)
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
└── README.md                      # This file
```

## Setup Instructions

### Prerequisites

- **Python 3.11 or higher** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18 or higher** - [Download Node.js](https://nodejs.org/)
- **MongoDB Atlas account** (free tier available) - [Sign up](https://www.mongodb.com/cloud/atlas/register)
- **Groq API key** (free tier available) - [Get API key](https://console.groq.com/)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd legal-multi-agents
```

### Step 2: Configure Environment Variables

Create a `.env` file in the `backend` directory (or root directory) with the following variables:

```env
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=legal_war_room
```

**Important**: Replace `username` and `password` in the MongoDB URI with your actual MongoDB Atlas credentials.

### Step 3: Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn main:app --reload --port 8000
```

The backend will start on `http://localhost:8000` (or `http://127.0.0.1:8000`).

### Step 4: Frontend Setup

Open a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`.

### Step 5: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (Swagger UI)

## Environment Variables

The following environment variables are required:

| Variable | Description | Example |
|----------|-------------|---------|
| `GROQ_API_KEY` | Your Groq API key | `gsk_xxxxxxxxxxxxx` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/...` |
| `DATABASE_NAME` | MongoDB database name (optional, defaults to `legal_war_room`) | `legal_war_room` |

## MongoDB Configuration

### MongoDB Atlas Setup

1. **Create a MongoDB Atlas account**: https://www.mongodb.com/cloud/atlas/register
2. **Create a new cluster** (free tier M0 is sufficient)
3. **Create a database user**:
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set privileges to "Atlas admin" or "Read and write to any database"
4. **Whitelist your IP address**:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development) or add your specific IP
5. **Get your connection string**:
   - Go to "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<username>` with your database username

### Local MongoDB Setup

If you prefer to run MongoDB locally:

1. **Install MongoDB**: https://www.mongodb.com/try/download/community
2. **Start MongoDB service**:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```
3. **Use local connection string**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/
   ```

### Database Collections

The application automatically creates the following collections:

| Collection | Purpose |
|------------|---------|
| `cases` | Stores case facts and metadata |
| `arguments` | Stores Harvey and Louis arguments |
| `counterarguments` | Stores Tanner's attacks |
| `conflicts` | Stores detected disagreements between agents |
| `strategies` | Stores Jessica's final synthesized strategies |
| `agent_runs` | Tracks agent execution for auditability |
| `reasoning_steps` | Stores step-by-step agent thinking |
| `agent_messages` | Stores inter-agent communication |

## How It Works

### Multi-Agent Workflow with Deliberation

```
┌─────────────────────────────────────────────────────────────────┐
│                         Case Input                               │
│  (User uploads PDF or fills form manually)                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: Harvey develops initial strategy                        │
│  - Analyzes case facts                                            │
│  - Develops primary legal strategy                               │
│  - Writes to arguments collection                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: Louis researches precedents                             │
│  - Finds relevant case law                                        │
│  - Identifies legal doctrines                                     │
│  - Writes to arguments collection                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: Multi-Round Deliberation (2 rounds default)             │
│  ┌─────────────────┐    ┌─────────────────┐                     │
│  │ Round 1:        │    │ Round 1:        │                     │
│  │ Tanner attacks  │───▶│ Harvey rebuts   │                     │
│  │ (counterargs)   │    │ (revised args)  │                     │
│  └─────────────────┘    └─────────────────┘                     │
│           │                      │                               │
│           ▼                      ▼                               │
│  ┌─────────────────┐    ┌─────────────────┐                     │
│  │ Round 2:        │    │ (Final attack) │                     │
│  │ Tanner attacks  │───▶│                 │                     │
│  │ again           │    │                 │                     │
│  └─────────────────┘    └─────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 4: Conflict Detection                                      │
│  - Analyzes all arguments and counterarguments                   │
│  - Identifies disagreements between agents                       │
│  - Writes to conflicts collection                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 5: Jessica synthesizes final strategy                      │
│  - Reads all arguments, counterarguments, and conflicts           │
│  - Resolves conflicts with clear reasoning                        │
│  - Produces unified, actionable strategy                          │
│  - Writes to strategies collection                                │
└─────────────────────────────────────────────────────────────────┘
```

### MongoDB as Coordination Backbone

The application uses MongoDB as the coordination layer for multi-agent collaboration:

- **Immediate persistence**: Each agent writes to MongoDB immediately upon completion
- **Cross-agent reading**: Agents read from MongoDB to access previous outputs
- **Step-level tracing**: Every reasoning step is persisted to `reasoning_steps` for full auditability
- **Inter-agent messaging**: Agents communicate through `agent_messages` collection
- **Audit trail**: Complete history for replay, debugging, and analysis

### Real-time Updates

The application uses Server-Sent Events (SSE) to push updates to the frontend:

| Event | Description |
|-------|-------------|
| `agent_started` | When an agent begins analysis |
| `agent_completed` | When an agent finishes with output |
| `deliberation_round_started` | When a Harvey/Tanner round begins |
| `deliberation_round_completed` | When a round finishes |
| `detecting_conflicts` | When conflict detection starts |
| `conflict_detected` | When conflicts are identified |
| `strategy_ready` | When final strategy is available |
| `error` | When an error occurs |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API health check |
| `/health` | GET | Health check endpoint |
| `/api/cases` | POST | Create a new case and start analysis |
| `/api/cases/process-documents` | POST | Extract case information from PDF files |
| `/api/cases/{case_id}/stream` | GET | SSE stream for real-time updates |
| `/api/cases/{case_id}` | GET | Get full case with all data |
| `/api/cases/{case_id}/arguments` | GET | Get all arguments for a case |
| `/api/cases/{case_id}/conflicts` | GET | Get all conflicts for a case |
| `/api/cases/{case_id}/strategy` | GET | Get final strategy for a case |

## Solution Architecture

### Problem Statement

Build a multi-agent legal strategy system where multiple AI agents collaborate to analyze legal cases and develop winning strategies, using MongoDB as the coordination backbone.

### Solution Overview

1. **Multi-Agent Architecture**: Four specialized agents (Harvey, Louis, Tanner, Jessica) each with distinct roles
2. **MongoDB Coordination**: All agent outputs are stored in MongoDB, enabling agents to read each other's work
3. **Multi-Round Deliberation**: Harvey and Tanner engage in multiple rounds of debate before final synthesis
4. **Step-Level Tracing**: Every reasoning step is persisted for full auditability
5. **Real-Time Updates**: Server-Sent Events provide live updates to the frontend
6. **PDF Extraction**: Automatic extraction of case information from uploaded PDFs

### Key Design Decisions

- **MongoDB as Coordination Layer**: Instead of direct agent-to-agent communication, agents coordinate through MongoDB collections. This provides:
  - Persistence and auditability
  - Decoupling of agents
  - Easy scaling and debugging
  - Complete history of all interactions

- **Multi-Round Deliberation**: Harvey and Tanner engage in multiple rounds (default: 2) to ensure thorough debate before final synthesis

- **Step-Level Tracing**: Adapted from LegalServer-main, every agent reasoning step is persisted to enable full auditability and debugging

- **Async Processing**: Agents run asynchronously using thread pooling to avoid blocking the API

- **Error Handling**: Comprehensive error handling with retry logic for LLM calls and graceful degradation

### Technical Challenges Solved

1. **Circular Import Issues**: Resolved by lazy-loading agents inside the Orchestrator's `__init__` method
2. **MongoDB Index Conflicts**: Implemented robust index creation that handles conflicts by dropping and recreating indexes
3. **IPv6 vs IPv4 Resolution**: Fixed frontend proxy to use `127.0.0.1` instead of `localhost` on Windows
4. **SSE Connection Reliability**: Added polling fallback mechanism to ensure frontend always has latest data
5. **PDF Extraction**: Implemented LLM-based extraction with regex fallback for robust field extraction

## Troubleshooting

### Backend Issues

**Problem**: `ImportError: cannot import name 'HarveyAgent'`
- **Solution**: This is a circular import issue. Ensure agents are imported inside `Orchestrator.__init__`, not at module level.

**Problem**: `IndexKeySpecsConflict` errors
- **Solution**: The application automatically handles this by dropping and recreating indexes. If issues persist, manually drop indexes in MongoDB.

**Problem**: `Connection refused` errors
- **Solution**: 
  - Ensure MongoDB Atlas IP whitelist includes your IP address
  - Verify MongoDB URI has correct username and password
  - Check that MongoDB service is running (if using local MongoDB)

**Problem**: LLM API errors
- **Solution**:
  - Verify API key is correct in `.env` file
  - Check API rate limits (use smaller model if hitting limits)
  - Ensure internet connection is stable

### Frontend Issues

**Problem**: `ECONNREFUSED ::1:8000`
- **Solution**: The `vite.config.js` is configured to use `127.0.0.1` instead of `localhost`. Restart the Vite dev server after changes.

**Problem**: Agents not updating
- **Solution**: 
  - Check browser console for SSE connection errors
  - Verify backend is running on port 8000
  - Check network tab for failed API calls

**Problem**: PDF extraction not working
- **Solution**:
  - Ensure PDF file is not corrupted
  - Check backend logs for extraction errors
  - Verify PyPDF2 is installed: `pip install PyPDF2`

### MongoDB Issues

**Problem**: Cannot connect to MongoDB Atlas
- **Solution**:
  1. Verify connection string format: `mongodb+srv://username:password@cluster.mongodb.net/...`
  2. Check IP whitelist includes your current IP
  3. Verify database user has correct permissions
  4. Test connection using MongoDB Compass

**Problem**: Collections not created
- **Solution**: The application creates collections automatically on startup. Check backend logs for initialization messages.

## Credits

- Agent coordination patterns adapted from **LegalServer-main**
- Agent names inspired by the TV show **Suits**
- Built with Groq LLM and MongoDB Atlas
- UI components from **shadcn/ui**

## License

MIT License - Built for MongoDB Hackathon 2026
