import React, { createContext, useState, useMemo, useContext } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

const getTheme = (mode) =>
  createTheme({
    palette: {
      mode, 
    },
    typography: {
      fontFamily: '"Poppins", sans-serif',
    },
  });

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light'); 

  /**
   * Toggles between 'light' and 'dark' theme modes. By default, the theme mode is set to 'light'.
   * Just call the function and it will switch the theme mode.
   * 
   * @usage
   * onClick={toggleTheme}
   * 
   * 
   */
  const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
