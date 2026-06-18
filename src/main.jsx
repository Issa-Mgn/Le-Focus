import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'

// Afficher la bannière de performance en développement
if (process.env.NODE_ENV === 'development') {
  import('./utils/performanceBanner').then(module => {
    module.displayPerformanceBanner();
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
