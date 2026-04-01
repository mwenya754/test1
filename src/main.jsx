// Main entry point for the React application
// This file initializes and renders the React app into the DOM

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'  // React 18 API for rendering
import './index.css'  // Global styles
import App from './App.jsx'  // Main App component

// Create React root and render the App component into the HTML element with id='root'
// StrictMode helps identify potential problems in the application during development
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
