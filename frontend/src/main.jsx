import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'bootstrap/dist/css/bootstrap.min.css';

import './index.css'
import App from './App.jsx'
// 1. IMPORTAMOS EL TRANSMISOR CENTRAL
import { AuthProvider } from './context/AuthContext.jsx' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. ENVOLVEMOS LA APP CON EL PROVIDER */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)