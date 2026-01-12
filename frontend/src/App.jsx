/**
 * Main Application Component
 * 
 * This is the root component that manages the application state and routing.
 * It handles:
 * - Case creation and submission
 * - Server-Sent Events (SSE) connection for real-time updates
 * - Agent status tracking
 * - Phase management (landing, input, analyzing, complete)
 * - Polling fallback mechanism to ensure data consistency
 * 
 * Application Flow:
 * 1. Landing Page → User sees hero, features, FAQ
 * 2. Case Input → User uploads PDF or fills form manually
 * 3. Analyzing → Agents work on the case, updates via SSE
 * 4. Complete → Final strategy and conflicts displayed
 */
import React, { useState, useCallback, useEffect } from 'react'
import CaseInput from './components/CaseInput'
import DebateView from './components/DebateView'
import ConflictView from './components/ConflictView'
import FinalStrategy from './components/FinalStrategy'
import LandingPage from './components/LandingPage'
import Footer from './components/Footer'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import { Loader2, AlertCircle } from 'lucide-react'
import { cn } from './lib/utils'

const API_URL = '/api'

/**
 * Initial agent state structure.
 * Each agent has:
 * - status: 'waiting' | 'thinking' | 'done'
 * - content: The agent's analysis output (null until done)
 * - role: Display name for the agent's role
 */
const INITIAL_AGENTS = {
  'Harvey': { status: 'waiting', content: null, role: 'Lead Strategist' },
  'Louis': { status: 'waiting', content: null, role: 'Precedent Expert' },
  'Tanner': { status: 'waiting', content: null, role: 'Adversarial Counsel' },
  'Jessica': { status: 'waiting', content: null, role: 'Managing Partner' }
}

function App() {
  const [caseId, setCaseId] = useState(null)
  const [currentPhase, setCurrentPhase] = useState('landing') // landing, input, analyzing, complete
  const [agents, setAgents] = useState(INITIAL_AGENTS)
  const [conflicts, setConflicts] = useState([])
  const [strategy, setStrategy] = useState(null)
  const [error, setError] = useState(null)
  const [deliberationRound, setDeliberationRound] = useState(0)
  const [totalRounds, setTotalRounds] = useState(0)

  // Handle hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#case-input') {
        setCurrentPhase('input')
      } else if (window.location.hash === '') {
        setCurrentPhase('landing')
      }
    }
    
    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Fetch case data periodically when analyzing to ensure we have latest state
  useEffect(() => {
    if (currentPhase === 'analyzing' && caseId) {
      const fetchCaseData = async () => {
        try {
          const response = await fetch(`${API_URL}/cases/${caseId}`)
          if (response.ok) {
            const caseData = await response.json()
            console.log('[Poll] Fetched case data:', caseData)
            
            // Update agents from arguments
            if (caseData.arguments) {
              caseData.arguments.forEach(arg => {
                setAgents(prev => {
                  if (prev[arg.agent]?.status !== 'done') {
                    return {
                      ...prev,
                      [arg.agent]: { ...prev[arg.agent], status: 'done', content: arg.content }
                    }
                  }
                  return prev
                })
              })
            }
            
            // Update Tanner from counterarguments (use the latest one)
            if (caseData.counterarguments && caseData.counterarguments.length > 0) {
              const latestCounter = caseData.counterarguments[caseData.counterarguments.length - 1]
              setAgents(prev => {
                if (prev['Tanner']?.status !== 'done') {
                  return {
                    ...prev,
                    'Tanner': { ...prev['Tanner'], status: 'done', content: latestCounter.content }
                  }
                }
                return prev
              })
            }
            
            // Update Jessica from strategy
            if (caseData.strategy) {
              setAgents(prev => {
                if (prev['Jessica']?.status !== 'done') {
                  return {
                    ...prev,
                    'Jessica': { ...prev['Jessica'], status: 'done', content: caseData.strategy.final_strategy }
                  }
                }
                return prev
              })
              setStrategy(caseData.strategy)
              setCurrentPhase('complete')
            }
            
            // Update conflicts
            if (caseData.conflicts) {
              setConflicts(caseData.conflicts)
            }
          }
        } catch (e) {
          console.error('[Poll] Failed to fetch case data:', e)
        }
      }
      
      // Poll every 3 seconds while analyzing
      const interval = setInterval(fetchCaseData, 3000)
      fetchCaseData() // Initial fetch
      
      return () => clearInterval(interval)
    }
  }, [currentPhase, caseId])

  const resetState = () => {
    setCaseId(null)
    setCurrentPhase('input')
    setAgents(INITIAL_AGENTS)
    setConflicts([])
    setStrategy(null)
    setError(null)
    setDeliberationRound(0)
    setTotalRounds(0)
    window.location.hash = '#case-input'
  }

  const handleCaseSubmit = useCallback(async (caseData) => {
    setError(null)
    setCurrentPhase('analyzing')

    try {
      // Create the case
      const response = await fetch(`${API_URL}/cases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(caseData)
      })

      if (!response.ok) {
        throw new Error('Failed to create case')
      }

      const result = await response.json()
      setCaseId(result.case_id)

      // Connect to SSE stream
      const eventSource = new EventSource(`${API_URL}/cases/${result.case_id}/stream`)
      console.log('[SSE] Connecting to stream for case:', result.case_id)

      eventSource.onopen = () => {
        console.log('[SSE] Connection opened')
      }

      eventSource.addEventListener('agent_started', (event) => {
        const data = JSON.parse(event.data)
        console.log('[SSE] Agent started:', data.agent, data.phase)
        setAgents(prev => ({
          ...prev,
          [data.agent]: { ...prev[data.agent], status: 'thinking', phase: data.phase }
        }))
      })

      eventSource.addEventListener('agent_completed', (event) => {
        const data = JSON.parse(event.data)
        console.log('[SSE] Agent completed:', data.agent, 'content type:', typeof data.content, 'full data:', data)
        setAgents(prev => {
          const updated = {
            ...prev,
            [data.agent]: {
              ...prev[data.agent],
              status: 'done',
              content: data.content,
              attackVectors: data.attack_vectors,
              rejectedAlternatives: data.rejected_alternatives,
              round: data.round
            }
          }
          console.log('[SSE] Updated agents state:', updated)
          return updated
        })
      })

      eventSource.addEventListener('deliberation_round_started', (event) => {
        const data = JSON.parse(event.data)
        setDeliberationRound(data.round)
        setTotalRounds(data.total_rounds)
      })

      eventSource.addEventListener('deliberation_round_completed', (event) => {
        // Round completed
      })

      eventSource.addEventListener('detecting_conflicts', () => {
        // Detecting conflicts state
      })

      eventSource.addEventListener('conflict_detected', (event) => {
        const data = JSON.parse(event.data)
        setConflicts(data.conflicts || [])
      })

      eventSource.addEventListener('strategy_ready', (event) => {
        const data = JSON.parse(event.data)
        setStrategy(data.strategy)
        setCurrentPhase('complete')
        eventSource.close()
      })

      eventSource.addEventListener('error', (event) => {
        if (event.data) {
          const data = JSON.parse(event.data)
          setError(data.message)
        }
        eventSource.close()
      })

      eventSource.onerror = async () => {
        console.log('[SSE] Connection error, fetching existing data...')
        eventSource.close()
        // Try to fetch existing data if SSE fails
        try {
          const caseResponse = await fetch(`${API_URL}/cases/${result.case_id}`)
          if (caseResponse.ok) {
            const caseData = await caseResponse.json()
            console.log('[SSE] Fetched case data:', caseData)
            // Update agents from existing data
            if (caseData.arguments) {
              caseData.arguments.forEach(arg => {
                console.log('[SSE] Updating agent from argument:', arg.agent)
                setAgents(prev => ({
                  ...prev,
                  [arg.agent]: { ...prev[arg.agent], status: 'done', content: arg.content }
                }))
              })
            }
            // Update Tanner from counterarguments
            if (caseData.counterarguments && caseData.counterarguments.length > 0) {
              const tannerCounter = caseData.counterarguments[caseData.counterarguments.length - 1]
              console.log('[SSE] Updating Tanner from counterargument')
              setAgents(prev => ({
                ...prev,
                'Tanner': { ...prev['Tanner'], status: 'done', content: tannerCounter.content }
              }))
            }
            // Update Jessica from strategy
            if (caseData.strategy) {
              console.log('[SSE] Updating Jessica from strategy')
              setAgents(prev => ({
                ...prev,
                'Jessica': { ...prev['Jessica'], status: 'done', content: caseData.strategy.final_strategy }
              }))
              setStrategy(caseData.strategy)
              setCurrentPhase('complete')
            }
            if (caseData.conflicts) {
              setConflicts(caseData.conflicts)
            }
          }
        } catch (e) {
          console.error('Failed to fetch case data:', e)
        }
      }

    } catch (err) {
      setError(err.message)
      setCurrentPhase('input')
    }
  }, [])

  // Show landing page
  if (currentPhase === 'landing') {
    return <LandingPage />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <a href="/" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
              Multi-Agent Legal Strategy Council
            </a>
            <p className="text-xs text-muted-foreground">Inspired by Suits</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </a>
            {currentPhase !== 'input' && (
              <Button variant="outline" onClick={resetState}>
                New Case
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <Card className="mb-6 border-destructive/50 bg-destructive/10">
            <div className="p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium text-destructive">Error</p>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {currentPhase === 'input' && (
          <div id="case-input">
            <CaseInput onSubmit={handleCaseSubmit} />
          </div>
        )}

        {(currentPhase === 'analyzing' || currentPhase === 'complete') && (
          <div className="space-y-8">
            {/* Agent Debate View */}
            <DebateView 
              agents={agents} 
              deliberationRound={deliberationRound}
              totalRounds={totalRounds}
            />

            {/* Conflicts Section */}
            {conflicts.length > 0 && (
              <ConflictView conflicts={conflicts} />
            )}

            {/* Final Strategy Section */}
            {strategy && (
              <FinalStrategy strategy={strategy} />
            )}

            {/* Loading indicator when still analyzing */}
            {currentPhase === 'analyzing' && !strategy && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-full border border-primary/20">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  <span className="text-primary font-medium">Analysis in progress...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
