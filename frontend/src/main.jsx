/**
 * Main entry point for the React application.
 * 
 * This file initializes the React application and renders the root App component.
 * It also imports global CSS styles for Tailwind and theme configuration.
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Create root and render the App component in strict mode for development checks
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
