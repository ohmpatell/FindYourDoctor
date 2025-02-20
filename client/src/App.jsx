import React from 'react'

import { CustomThemeProvider } from './utils/ThemeContext'


function App() {

  return (
    <CustomThemeProvider>
      <img src="logo.png" alt="doctor" style={{height: "100px", width: "auto"}}/>
      <h1>Welcome to FindYourDoctor</h1>
    </CustomThemeProvider>
  )
}

export default App
