"""
Base Agent class for all Legal Strategy Council agents.

This module provides the abstract base class that all specialized agents inherit from.
It handles common functionality like LLM API calls, database operations, and error handling.

To use a different LLM provider (e.g., OpenAI, Anthropic), modify the `think` method
to use the appropriate client library while keeping the same interface.
"""
from abc import ABC, abstractmethod
from typing import Optional
import time
from groq import Groq
import config
import database


class BaseAgent(ABC):
    """
    Base class for all agents in the Legal Strategy Council.
    
    This abstract class provides:
    - LLM API integration (currently Groq)
    - Database read/write operations
    - Retry logic for API calls
    - Common interface for all agents
    
    Each specialized agent (Harvey, Louis, Tanner, Jessica) extends this class
    and implements the `analyze` method with their specific logic.
    """

    def __init__(self, name: str, system_prompt: str):
        """
        Initialize the agent with a name and system prompt.
        
        Args:
            name: Agent's name (e.g., "Harvey", "Tanner")
            system_prompt: System prompt that defines the agent's personality and role
        """
        self.name = name
        self.system_prompt = system_prompt
        # Initialize Groq client with API key from config
        # To use a different LLM provider, modify this initialization
        self.client = Groq(api_key=config.GROQ_API_KEY)

    def think(self, prompt: str, retry_count: int = 1) -> str:
        """
        Call the LLM API with the given prompt.
        
        This method handles:
        - API calls to Groq (or other LLM providers)
        - Retry logic for handling transient API errors
        - Error handling and logging
        
        Args:
            prompt: The user prompt/question to send to the LLM
            retry_count: Number of retry attempts if API call fails (default: 1)
        
        Returns:
            str: The LLM's response text
        
        Raises:
            Exception: If all retry attempts fail
        
        Note:
            To use a different LLM provider (OpenAI, Anthropic, etc.):
            1. Install the provider's SDK
            2. Modify the client initialization in __init__
            3. Update the API call format in this method
            4. Keep the same return type (str) for compatibility
        """
        print(f"[{self.name}] Calling Groq API with model: {config.GROQ_MODEL}")
        for attempt in range(retry_count + 1):
            try:
                print(f"[{self.name}] Attempt {attempt + 1}...")
                # Make API call to Groq
                response = self.client.chat.completions.create(
                    model=config.GROQ_MODEL,
                    messages=[
                        {"role": "system", "content": self.system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=config.GROQ_TEMPERATURE,
                    max_tokens=config.GROQ_MAX_TOKENS
                )
                print(f"[{self.name}] Groq API call successful")
                return response.choices[0].message.content
            except Exception as e:
                print(f"[{self.name}] Groq API error: {e}")
                if attempt < retry_count:
                    time.sleep(2)  # Wait before retry
                    continue
                raise Exception(f"Groq API error after {retry_count + 1} attempts: {str(e)}")

    def write_to_db(self, collection_name: str, document: dict) -> str:
        """
        Write a document to MongoDB.
        
        This is a convenience method for agents to persist data to MongoDB.
        All agent outputs are stored in MongoDB for coordination and auditability.
        
        Args:
            collection_name: Name of the MongoDB collection (from config.COLLECTIONS)
            document: Dictionary containing the document to insert
        
        Returns:
            str: The inserted document's MongoDB _id as a string
        """
        collection = database.get_collection(collection_name)
        result = collection.insert_one(document)
        return str(result.inserted_id)

    def read_from_db(self, collection_name: str, query: dict) -> list:
        """
        Read documents from MongoDB.
        
        Agents use this to read previous outputs from other agents or their own
        previous runs. This enables multi-agent coordination through MongoDB.
        
        Args:
            collection_name: Name of the MongoDB collection (from config.COLLECTIONS)
            query: MongoDB query dictionary (e.g., {"case_id": "123"})
        
        Returns:
            list: List of matching documents (with _id fields removed for cleaner output)
        """
        collection = database.get_collection(collection_name)
        documents = list(collection.find(query))
        # Remove MongoDB _id field for cleaner output
        for doc in documents:
            if "_id" in doc:
                del doc["_id"]
        return documents

    @abstractmethod
    def analyze(self, case_data: dict) -> dict:
        """
        Analyze the case and return results.
        
        This is the main method that each specialized agent must implement.
        Each agent has different analysis logic based on their role:
        - Harvey: Develops primary strategy
        - Louis: Researches precedents
        - Tanner: Attacks the strategy
        - Jessica: Synthesizes final strategy
        
        Args:
            case_data: Dictionary containing case information (title, facts, jurisdiction, stakes)
        
        Returns:
            dict: Analysis results with agent-specific fields
        
        Raises:
            NotImplementedError: Must be implemented by subclasses
        """
        pass
