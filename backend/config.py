"""
Configuration settings for the Legal Strategy Council application.

This module loads environment variables and defines application-wide settings
including API keys, database configuration, agent names, and model parameters.

Environment Variables Required:
- GROQ_API_KEY: Your Groq API key for LLM access
- MONGODB_URI: MongoDB connection string (Atlas or local)
- DATABASE_NAME: Name of the MongoDB database (default: legal_war_room)

Agent names inspired by the TV show "Suits":
- Harvey: Lead Trial Strategist (The Closer)
- Louis: Precedent & Research Expert (The Savant)
- Tanner: Adversarial Counsel (The Destroyer)
- Jessica: Managing Partner / Moderator (The Mediator)
"""
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# ============================================================================
# LLM API Configuration
# ============================================================================

# Groq API Configuration
# You can use any Groq-compatible API key here
# To use a different LLM provider, modify the BaseAgent class in agents/base_agent.py
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Groq Model Configuration
# Available models: llama-3.1-8b-instant, llama-3.3-70b-versatile, mixtral-8x7b-32768, etc.
# Smaller models (8b) have higher rate limits, larger models (70b) are more capable
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")  # Default to smaller model for rate limits
GROQ_TEMPERATURE = float(os.getenv("GROQ_TEMPERATURE", "0.7"))  # Creativity level (0.0-1.0)
GROQ_MAX_TOKENS = int(os.getenv("GROQ_MAX_TOKENS", "1500"))  # Maximum response length

# ============================================================================
# MongoDB Configuration
# ============================================================================

# MongoDB Connection String
# Format: mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
# For local MongoDB: mongodb://localhost:27017/
# Replace username and password with your MongoDB Atlas credentials
MONGODB_URI = os.getenv("MONGODB_URI")

# Database Name
# All collections will be created in this database
DATABASE_NAME = os.getenv("DATABASE_NAME", "legal_war_room")

# ============================================================================
# MongoDB Collection Names
# ============================================================================

# Collection Names
# These define the MongoDB collections used for storing different types of data
COLLECTIONS = {
    # Core data collections
    "cases": "cases",                    # Stores case facts and metadata
    "arguments": "arguments",            # Stores Harvey and Louis arguments
    "counterarguments": "counterarguments",  # Stores Tanner's attacks
    "conflicts": "conflicts",            # Stores detected disagreements between agents
    "strategies": "strategies",          # Stores Jessica's final synthesized strategies
    
    # Coordination collections (for multi-agent collaboration)
    "agent_runs": "agent_runs",          # Tracks agent execution for auditability
    "reasoning_steps": "reasoning_steps",  # Stores step-by-step agent thinking
    "agent_messages": "agent_messages",  # Stores inter-agent communication
}

# ============================================================================
# Agent Configuration
# ============================================================================

# Agent Names (Suits-inspired)
# These names are used throughout the application to identify agents
AGENT_NAMES = {
    "harvey": "Harvey",        # Lead Trial Strategist
    "louis": "Louis",          # Precedent & Research Expert
    "tanner": "Tanner",        # Adversarial Counsel
    "jessica": "Jessica",      # Managing Partner / Moderator
}

# Agent Descriptions (for UI display)
# These descriptions appear in the frontend to explain each agent's role
AGENT_DESCRIPTIONS = {
    "Harvey": "Lead Trial Strategist - Develops bold, winning strategies",
    "Louis": "Precedent Expert - Master of case law and legal research",
    "Tanner": "Adversarial Counsel - Ruthlessly attacks your strategy",
    "Jessica": "Managing Partner - Synthesizes and delivers final strategy",
}

# Agent Colors (for UI theming)
# These colors are used in the frontend to visually distinguish agents
AGENT_COLORS = {
    "Harvey": "#3182ce",    # Blue
    "Louis": "#805ad5",     # Purple
    "Tanner": "#e53e3e",    # Red
    "Jessica": "#38a169",   # Green
}

# ============================================================================
# Workflow Configuration
# ============================================================================

# Multi-round deliberation settings
# Number of Harvey <-> Tanner exchanges before Jessica synthesizes
# More rounds = more thorough debate but longer processing time
DELIBERATION_ROUNDS = int(os.getenv("DELIBERATION_ROUNDS", "2"))
