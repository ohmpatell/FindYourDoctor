import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { CustomThemeProvider } from './utils/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CustomThemeProvider>
      <App />
      </CustomThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
