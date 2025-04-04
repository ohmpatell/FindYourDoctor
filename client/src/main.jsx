import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { CustomThemeProvider } from './utils/ThemeContext.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <CustomThemeProvider>
      <App />
      </CustomThemeProvider>
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
