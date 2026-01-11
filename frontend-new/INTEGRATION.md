# Frontend-Backend Integration

## Overview
The `frontend-new` (Next.js/TypeScript) has been integrated with the backend API. All hardcoded data has been removed and replaced with real API calls.

## Key Changes

### 1. API Client (`lib/api.ts`)
- Created comprehensive API client with TypeScript interfaces
- Handles all backend communication:
  - Case creation (`/api/cases`)
  - Case details retrieval (`/api/cases/{caseId}`)
  - SSE streaming for real-time analysis (`/api/cases/{caseId}/stream`)
  - Document processing (`/api/cases/process-documents`)

### 2. Backend Endpoints Added
- `/api/cases/process-documents` - Document extraction endpoint (placeholder for now)
- All existing endpoints are now used by frontend

### 3. Components Updated

#### Case Input Form (`components/case-input/case-input-form.tsx`)
- ✅ Removed hardcoded extraction data
- ✅ Now calls backend API for document processing
- ✅ Creates case via `/api/cases` endpoint when starting analysis

#### Analysis Page (`app/analysis/page.tsx`)
- ✅ Removed all hardcoded agent outputs (`agentFinalOutputs`)
- ✅ Now streams real-time data via SSE from backend
- ✅ Displays actual agent content from backend
- ✅ Handles all SSE event types: `agent_started`, `agent_completed`, `deliberation_round_started`, etc.

#### Results Page (`app/results/page.tsx`)
- ✅ Fetches case details from backend via `getCaseDetails()`
- ✅ Passes real data to all result panels

#### Result Panels (All updated)
- ✅ `final-strategy-panel.tsx` - Accepts strategy from backend
- ✅ `arguments-panel.tsx` - Displays real arguments from backend
- ✅ `counterarguments-panel.tsx` - Displays real counterarguments
- ✅ `conflicts-panel.tsx` - Displays real conflicts
- ✅ `synthesis-panel.tsx` - Displays real synthesis
- ✅ `rejected-alternatives-panel.tsx` - Displays real rejected alternatives

## Environment Variables

Add to `.env.local` in `frontend-new/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Data Flow

1. **User uploads documents** → Frontend calls `/api/cases/process-documents`
2. **User submits case** → Frontend calls `/api/cases` (POST) → Returns `case_id`
3. **Analysis starts** → Frontend opens SSE stream `/api/cases/{caseId}/stream`
4. **Real-time updates** → Backend streams events via SSE:
   - `agent_started` - When an agent begins
   - `agent_completed` - When an agent finishes with content
   - `deliberation_round_started` - Round of Harvey/Tanner debate
   - `conflict_detected` - Conflicts identified
   - `strategy_ready` - Final strategy ready
5. **Results page** → Frontend calls `/api/cases/{caseId}` (GET) → Displays all data

## Notes

- All hardcoded data removed
- All processing happens in backend
- Frontend only displays data from backend
- SSE streaming provides real-time updates
- TypeScript types defined for all API interfaces

## TODO (Future Enhancements)

1. **Document Processing**: Implement actual document extraction in `/api/cases/process-documents`
   - Extract text from PDF/DOCX files
   - Use LLM to structure data (case title, parties, facts, etc.)
   - Return structured JSON

2. **Error Handling**: Add better error handling and retry logic

3. **Loading States**: Improve loading states during document processing

4. **Type Safety**: Fix TypeScript linting errors (mostly missing type annotations)

