import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Punto de entrada principal. 
// Aquí es donde usualmente se envuelve la App con un BrowserRouter en pasos posteriores.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
