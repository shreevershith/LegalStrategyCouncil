"""
Legal Strategy Council API - FastAPI Backend

This module provides the FastAPI application and REST API endpoints for the
multi-agent legal strategy system. It handles:

- Case creation and management
- PDF document processing and extraction
- Server-Sent Events (SSE) for real-time updates
- Agent orchestration and workflow management
- MongoDB integration for data persistence

Key Endpoints:
- POST /api/cases: Create a new case and start analysis
- GET /api/cases/{case_id}/stream: SSE stream for real-time agent updates
- POST /api/cases/process-documents: Extract case info from PDF files
- GET /api/cases/{case_id}: Get full case with all agent outputs

The application uses MongoDB as the coordination backbone, with each agent
writing to MongoDB collections that other agents can read from.
"""
import asyncio
from fastapi import FastAPI, HTTPException, BackgroundTasks, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
from pydantic import BaseModel
from typing import Optional, List
import json
import io
import PyPDF2
from agents.base_agent import BaseAgent

from models.schemas import CaseCreate, CaseResponse
from services.orchestrator import get_orchestrator
import database

# Initialize FastAPI application
app = FastAPI(
    title="Legal Strategy Council API",
    description="Multi-agent legal strategy system for hackathon",
    version="1.0.0"
)

# Add CORS middleware to allow frontend to connect
# In production, replace "*" with specific frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store for tracking active analysis tasks
# Maps case_id to background task handles
_active_tasks: dict = {}


@app.on_event("startup")
async def startup_event():
    """Initialize database connection on startup."""
    try:
        database.init_collections()
        print("Database collections initialized successfully")
    except Exception as e:
        print(f"Warning: Could not initialize database: {e}")


@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection on shutdown."""
    database.close_connection()


@app.get("/")
async def root():
    """Root endpoint - API health check."""
    return {
        "message": "Legal Strategy Council API",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.post("/api/cases/process-documents")
async def process_documents(files: List[UploadFile] = File(...)):
    """
    Process uploaded PDF documents and extract case information using LLM.
    Returns structured case data that can be used to populate the case input form.
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")
    
    # Initialize combined_text to avoid NameError in exception handler
    combined_text = ""
    
    try:
        # Extract text from all PDFs
        extracted_texts = []
        for file in files:
            if not file.filename.endswith('.pdf'):
                raise HTTPException(status_code=400, detail=f"File {file.filename} is not a PDF")
            
            try:
                contents = await file.read()
                pdf_file = io.BytesIO(contents)
                pdf_reader = PyPDF2.PdfReader(pdf_file)
                
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
                
                extracted_texts.append({
                    "filename": file.filename,
                    "text": text
                })
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Error processing {file.filename}: {str(e)}")
        
        # Combine all extracted text
        combined_text = "\n\n".join([doc["text"] for doc in extracted_texts])
        
        # Check if we extracted any text
        if not combined_text or not combined_text.strip():
            return {
                "caseTitle": "",
                "caseType": "",
                "plaintiffName": "",
                "defendantName": "",
                "otherParties": "",
                "jurisdiction": "",
                "caseDescription": "No text could be extracted from the PDF. Please fill the form manually.",
                "moneyAtStake": "",
                "stakesRange": "",
                "caseStatus": "",
                "keyDates": []
            }
        
        # Use LLM to extract structured case information
        try:
            # Create a temporary agent instance to use the LLM
            temp_agent = BaseAgent(name="DocumentProcessor", system_prompt="You are a legal document processor.")
            
            # Limit to first 10000 chars to avoid token limits
            limited_text = combined_text[:10000]
            
            extraction_prompt = f"""You are a legal document parser. Extract case information from the following legal document and return it as a valid JSON object.

DOCUMENT TEXT:
{limited_text}

Extract the following fields and return ONLY a valid JSON object (no markdown, no code blocks, just pure JSON):

{{
  "caseTitle": "Extract the case title (e.g., 'Smith v. Jones Corporation') or empty string if not found",
  "caseType": "Extract the case type. Must be one of: Contract Dispute, Intellectual Property, Employment, Fraud, Trade Secrets, Personal Injury, Real Estate, Corporate, or Other. If not found, use empty string",
  "plaintiffName": "Extract the plaintiff or claimant name or empty string if not found",
  "defendantName": "Extract the defendant name or empty string if not found",
  "otherParties": "Extract any other parties mentioned or empty string if none",
  "jurisdiction": "Extract jurisdiction. Prefer: California, New York, Texas, Delaware, Florida, Illinois, Federal, or Other. If not found, use empty string",
  "caseDescription": "Extract a comprehensive summary of the case facts, dispute, and key details. If not found, use the first 2000 characters of the document",
  "moneyAtStake": "Extract the monetary amount at stake as a string with only numbers (no $ or commas). Example: '500000' for $500,000. If not found, use empty string",
  "stakesRange": "If moneyAtStake is found, calculate the range: 'under-100k', '100k-500k', '500k-1m', '1m-5m', '5m-10m', or 'over-10m'. Otherwise empty string",
  "caseStatus": "Extract case status (e.g., 'Ongoing Litigation', 'Pre-litigation', 'Appeal', etc.) or empty string if not found",
  "keyDates": []
}}

IMPORTANT: 
- Return ONLY the JSON object, no explanations, no markdown code blocks, no other text
- Use empty strings for missing fields, not null
- For moneyAtStake, extract only the numeric value (remove $ and commas)
- For caseType and jurisdiction, try to match the provided options"""
            
            # Get LLM response
            response = temp_agent.think(extraction_prompt)
            print(f"LLM Response (first 500 chars): {response[:500]}")
        except Exception as llm_error:
            print(f"LLM extraction failed: {str(llm_error)}")
            import traceback
            traceback.print_exc()
            # Fall through to regex extraction
            response = None
        
        # Try to parse JSON from response (handle various formats)
        import re
        extracted_data = None
        
        if response:
            # Try multiple JSON extraction patterns
            json_patterns = [
                r'```(?:json)?\s*(\{.*?\})\s*```',  # JSON in markdown code blocks
                r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}',  # Nested JSON (greedy)
                r'\{.*?\}',  # Simple JSON (non-greedy)
            ]
            
            for pattern in json_patterns:
                json_match = re.search(pattern, response, re.DOTALL)
                if json_match:
                    json_str = json_match.group(1) if json_match.groups() else json_match.group(0)
                    # Clean up the JSON string
                    json_str = json_str.strip()
                    # Remove markdown code blocks if still present
                    json_str = re.sub(r'^```(?:json)?\s*', '', json_str)
                    json_str = re.sub(r'\s*```$', '', json_str)
                    
                    try:
                        extracted_data = json.loads(json_str)
                        print(f"Successfully parsed JSON from LLM response")
                        break
                    except json.JSONDecodeError as e:
                        print(f"JSON decode error with pattern {pattern}: {e}")
                        continue
        
        if extracted_data:
            # Ensure all required fields exist with proper defaults
            extracted_data.setdefault("caseTitle", "")
            extracted_data.setdefault("caseType", "")
            extracted_data.setdefault("plaintiffName", "")
            extracted_data.setdefault("defendantName", "")
            extracted_data.setdefault("otherParties", "")
            extracted_data.setdefault("jurisdiction", "")
            # Always populate caseDescription - use extracted or fallback to text
            if not extracted_data.get("caseDescription") or extracted_data["caseDescription"].strip() == "":
                extracted_data["caseDescription"] = combined_text[:2000] if combined_text else ""
            extracted_data.setdefault("moneyAtStake", "")
            extracted_data.setdefault("stakesRange", "")
            extracted_data.setdefault("caseStatus", "")
            extracted_data.setdefault("keyDates", [])
            
            # Clean moneyAtStake - remove $ and commas, keep only numbers
            if extracted_data.get("moneyAtStake"):
                money_str = str(extracted_data["moneyAtStake"])
                money_clean = re.sub(r'[^0-9]', '', money_str)
                extracted_data["moneyAtStake"] = money_clean
                # Auto-set stakesRange if not provided
                if not extracted_data.get("stakesRange") and money_clean:
                    try:
                        amount = int(money_clean)
                        if amount < 100000:
                            extracted_data["stakesRange"] = "under-100k"
                        elif amount < 500000:
                            extracted_data["stakesRange"] = "100k-500k"
                        elif amount < 1000000:
                            extracted_data["stakesRange"] = "500k-1m"
                        elif amount < 5000000:
                            extracted_data["stakesRange"] = "1m-5m"
                        elif amount < 10000000:
                            extracted_data["stakesRange"] = "5m-10m"
                        else:
                            extracted_data["stakesRange"] = "over-10m"
                    except:
                        pass
            
            # Normalize jurisdiction to match dropdown options
            if extracted_data.get("jurisdiction"):
                jur = extracted_data["jurisdiction"]
                jur_lower = jur.lower()
                # Check if it contains any of our jurisdiction options
                for j in ["California", "New York", "Texas", "Delaware", "Florida", "Illinois", "Federal"]:
                    if j.lower() in jur_lower:
                        extracted_data["jurisdiction"] = j
                        break
                # If no match and not "Other", keep original
            
            # Normalize caseType to match dropdown options
            if extracted_data.get("caseType"):
                case_type = extracted_data["caseType"]
                case_type_lower = case_type.lower()
                # Valid case types from frontend
                valid_case_types = [
                    "Contract Dispute", "Intellectual Property", "Employment",
                    "Fraud", "Trade Secrets", "Personal Injury",
                    "Real Estate", "Corporate", "Other"
                ]
                # Check if it matches any of our case types
                for ct in valid_case_types:
                    if ct.lower() in case_type_lower or case_type_lower in ct.lower():
                        extracted_data["caseType"] = ct
                        break
            
            print(f"Extracted data (LLM): {extracted_data}")
            return extracted_data
        else:
            print("No valid JSON found in LLM response, falling back to regex extraction")
        
        # Fallback: try to extract basic info using simple text parsing
        extracted_data = {
            "caseTitle": "",
            "caseType": "",
            "plaintiffName": "",
            "defendantName": "",
            "otherParties": "",
            "jurisdiction": "",
            "caseDescription": combined_text[:2000],
            "moneyAtStake": "",
            "stakesRange": "",
            "caseStatus": "",
            "keyDates": []
        }
        
        # Simple text extraction as fallback - improved regex patterns
        text_lower = combined_text.lower()
        print(f"Fallback extraction from text (first 500 chars): {combined_text[:500]}")
        
        # Case Title - try multiple patterns
        title_patterns = [
            r'case title[:\s]+([^\n]+)',
            r'title[:\s]+([^\n]+)',
            r'([A-Z][a-z]+\s+v\.?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+[A-Z][a-z]+)*)',  # Smith v. Jones pattern
        ]
        for pattern in title_patterns:
            title_match = re.search(pattern, combined_text, re.IGNORECASE)
            if title_match:
                extracted_data["caseTitle"] = title_match.group(1).strip()
                print(f"Found case title: {extracted_data['caseTitle']}")
                break
        
        # Case Type - try multiple patterns
        type_patterns = [
            r'case type[:\s]+([^\n]+)',
            r'type[:\s]+([^\n]+)',
        ]
        for pattern in type_patterns:
            type_match = re.search(pattern, combined_text, re.IGNORECASE)
            if type_match:
                case_type = type_match.group(1).strip()
                # Map to valid case types
                case_type_lower = case_type.lower()
                if "contract" in case_type_lower or "breach" in case_type_lower:
                    extracted_data["caseType"] = "Contract Dispute"
                elif "trade secret" in case_type_lower:
                    extracted_data["caseType"] = "Trade Secrets"
                elif "employment" in case_type_lower:
                    extracted_data["caseType"] = "Employment"
                elif "fraud" in case_type_lower:
                    extracted_data["caseType"] = "Fraud"
                elif "personal injury" in case_type_lower:
                    extracted_data["caseType"] = "Personal Injury"
                elif "real estate" in case_type_lower:
                    extracted_data["caseType"] = "Real Estate"
                elif "corporate" in case_type_lower:
                    extracted_data["caseType"] = "Corporate"
                elif "intellectual property" in case_type_lower or "ip" in case_type_lower:
                    extracted_data["caseType"] = "Intellectual Property"
                else:
                    extracted_data["caseType"] = case_type
                print(f"Found case type: {extracted_data['caseType']}")
                break
        
        # Plaintiff - try multiple patterns
        plaintiff_patterns = [
            r'(?:plaintiff|claimant)[:\s/]+([^\n]+)',
            r'plaintiff[:\s]+([^\n]+)',
            r'claimant[:\s]+([^\n]+)',
        ]
        for pattern in plaintiff_patterns:
            plaintiff_match = re.search(pattern, combined_text, re.IGNORECASE)
            if plaintiff_match:
                extracted_data["plaintiffName"] = plaintiff_match.group(1).strip()
                print(f"Found plaintiff: {extracted_data['plaintiffName']}")
                break
        
        # Defendant - try multiple patterns
        defendant_patterns = [
            r'defendant[:\s]+([^\n]+)',
            r'defendant[:\s/]+([^\n]+)',
        ]
        for pattern in defendant_patterns:
            defendant_match = re.search(pattern, combined_text, re.IGNORECASE)
            if defendant_match:
                extracted_data["defendantName"] = defendant_match.group(1).strip()
                print(f"Found defendant: {extracted_data['defendantName']}")
                break
        
        # Other Parties
        other_patterns = [
            r'other parties[:\s]+([^\n]+)',
            r'other party[:\s]+([^\n]+)',
        ]
        for pattern in other_patterns:
            other_match = re.search(pattern, combined_text, re.IGNORECASE)
            if other_match:
                extracted_data["otherParties"] = other_match.group(1).strip()
                print(f"Found other parties: {extracted_data['otherParties']}")
                break
        
        # Jurisdiction - try multiple patterns
        jurisdiction_patterns = [
            r'jurisdiction[:\s]+([^\n]+)',
            r'governing law[:\s]+([^\n]+)',
            r'venue[:\s]+([^\n]+)',
        ]
        for pattern in jurisdiction_patterns:
            jurisdiction_match = re.search(pattern, combined_text, re.IGNORECASE)
            if jurisdiction_match:
                jurisdiction_text = jurisdiction_match.group(1).strip()
                # Try to extract state name
                states = ["California", "New York", "Texas", "Delaware", "Florida", "Illinois", "Federal"]
                for state in states:
                    if state.lower() in jurisdiction_text.lower():
                        extracted_data["jurisdiction"] = state
                        print(f"Found jurisdiction: {extracted_data['jurisdiction']}")
                        break
                if not extracted_data.get("jurisdiction"):
                    extracted_data["jurisdiction"] = jurisdiction_text
                break
        
        # Case Description - try multiple patterns
        desc_patterns = [
            r'case description[:\s]+([^\n]+(?:\n[^\n]+)*)',
            r'description[:\s]+([^\n]+(?:\n[^\n]+)*)',
            r'facts[:\s]+([^\n]+(?:\n[^\n]+)*)',
        ]
        for pattern in desc_patterns:
            desc_match = re.search(pattern, combined_text, re.IGNORECASE | re.MULTILINE)
            if desc_match:
                extracted_data["caseDescription"] = desc_match.group(1).strip()
                print(f"Found case description (length: {len(extracted_data['caseDescription'])})")
                break
        
        # Amount at Stake - improved pattern matching
        if "$" in combined_text or "damages" in text_lower or "stake" in text_lower:
            # Try multiple patterns
            money_patterns = [
                r'\$[\d,]+(?:\.[\d]+)?',  # $1,000,000 or $1000000
                r'[\d,]+(?:\.[\d]+)?\s*(?:dollars?|USD)',  # 1,000,000 dollars
                r'damages?[:\s]+[\$]?[\d,]+',  # damages: $1,000,000
                r'amount[:\s]+[\$]?[\d,]+',  # amount: $1,000,000
            ]
            for pattern in money_patterns:
                money_match = re.search(pattern, combined_text, re.IGNORECASE)
                if money_match:
                    money_str = re.sub(r'[^0-9]', '', money_match.group(0))
                    if money_str:
                        extracted_data["moneyAtStake"] = money_str
                        print(f"Found money at stake: {extracted_data['moneyAtStake']}")
                        # Determine range
                        try:
                            amount = int(money_str)
                            if amount < 100000:
                                extracted_data["stakesRange"] = "under-100k"
                            elif amount < 500000:
                                extracted_data["stakesRange"] = "100k-500k"
                            elif amount < 1000000:
                                extracted_data["stakesRange"] = "500k-1m"
                            elif amount < 5000000:
                                extracted_data["stakesRange"] = "1m-5m"
                            elif amount < 10000000:
                                extracted_data["stakesRange"] = "5m-10m"
                            else:
                                extracted_data["stakesRange"] = "over-10m"
                        except:
                            pass
                        break
        
        # Case Status
        status_patterns = [
            r'case status[:\s]+([^\n]+)',
            r'status[:\s]+([^\n]+)',
        ]
        for pattern in status_patterns:
            status_match = re.search(pattern, combined_text, re.IGNORECASE)
            if status_match:
                extracted_data["caseStatus"] = status_match.group(1).strip()
                print(f"Found case status: {extracted_data['caseStatus']}")
                break
        
        print(f"Final extracted data (fallback): {extracted_data}")
        return extracted_data
        
    except HTTPException:
        # Re-raise HTTP exceptions (like 400 errors)
        raise
    except Exception as e:
        print(f"Error in PDF extraction: {str(e)}")
        import traceback
        traceback.print_exc()
        # Fallback: return basic structure with raw text
        error_message = f"Error processing PDF: {str(e)}"
        print(f"Returning error response: {error_message}")
        return {
            "caseTitle": "",
            "caseType": "",
            "plaintiffName": "",
            "defendantName": "",
            "otherParties": "",
            "jurisdiction": "",
            "caseDescription": combined_text[:2000] if combined_text else error_message,
            "moneyAtStake": "",
            "stakesRange": "",
            "caseStatus": "",
            "keyDates": []
        }


@app.post("/api/cases", response_model=dict)
async def create_case(case_data: CaseCreate, background_tasks: BackgroundTasks):
    """
    Create a new case and trigger the multi-agent analysis.
    Returns the case_id immediately while analysis runs in background.
    """
    orchestrator = get_orchestrator()

    # Create the case in MongoDB
    case = orchestrator.create_case(
        title=case_data.title,
        facts=case_data.facts,
        jurisdiction=case_data.jurisdiction,
        stakes=case_data.stakes
    )

    # Mark case as active for SSE streaming
    _active_tasks[case.case_id] = {
        "status": "pending",
        "events": []
    }

    return {
        "case_id": case.case_id,
        "title": case.title,
        "status": "created",
        "message": "Case created. Connect to /api/cases/{case_id}/stream for real-time updates."
    }


@app.get("/api/cases/{case_id}/stream")
async def stream_case_analysis(case_id: str):
    """
    SSE endpoint that streams agent updates in real-time.
    Events: agent_started, agent_completed, conflict_detected, strategy_ready, error
    """
    orchestrator = get_orchestrator()

    # Check if case exists
    case = orchestrator._get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    async def event_generator():
        """Generate SSE events from the orchestrator."""
        try:
            async for event in orchestrator.run_analysis(case_id):
                yield event
        except Exception as e:
            yield f"event: error\ndata: {json.dumps({'message': str(e)})}\n\n"

    return EventSourceResponse(event_generator())


@app.get("/api/cases/{case_id}")
async def get_case(case_id: str):
    """
    Get full case with all arguments, counterarguments, conflicts, and strategy.
    """
    orchestrator = get_orchestrator()
    result = orchestrator.get_case_with_details(case_id)

    if not result:
        raise HTTPException(status_code=404, detail="Case not found")

    return result


@app.get("/api/cases/{case_id}/arguments")
async def get_case_arguments(case_id: str):
    """Get all arguments for a case."""
    orchestrator = get_orchestrator()

    # Check if case exists
    case = orchestrator._get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    arguments = orchestrator.get_arguments(case_id)
    return {"case_id": case_id, "arguments": arguments}


@app.get("/api/cases/{case_id}/conflicts")
async def get_case_conflicts(case_id: str):
    """Get all conflicts for a case."""
    orchestrator = get_orchestrator()

    # Check if case exists
    case = orchestrator._get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    conflicts = orchestrator.get_conflicts(case_id)
    return {"case_id": case_id, "conflicts": conflicts}


@app.get("/api/cases/{case_id}/strategy")
async def get_case_strategy(case_id: str):
    """Get the final strategy for a case."""
    orchestrator = get_orchestrator()

    # Check if case exists
    case = orchestrator._get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    strategy = orchestrator.get_strategy(case_id)
    if not strategy:
        return {
            "case_id": case_id,
            "strategy": None,
            "message": "Strategy not yet generated. Run analysis first."
        }

    return {"case_id": case_id, "strategy": strategy}


# Additional utility endpoints

@app.get("/api/cases")
async def list_cases():
    """List all cases (for debugging/admin purposes)."""
    cases_collection = database.get_cases_collection()
    cases = list(cases_collection.find().sort("created_at", -1).limit(20))
    for case in cases:
        if "_id" in case:
            del case["_id"]
    return {"cases": cases}


@app.delete("/api/cases/{case_id}")
async def delete_case(case_id: str):
    """Delete a case and all associated data."""
    # Delete from all collections
    database.get_cases_collection().delete_many({"case_id": case_id})
    database.get_arguments_collection().delete_many({"case_id": case_id})
    database.get_counterarguments_collection().delete_many({"case_id": case_id})
    database.get_conflicts_collection().delete_many({"case_id": case_id})
    database.get_strategies_collection().delete_many({"case_id": case_id})

    return {"message": f"Case {case_id} and all associated data deleted"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
