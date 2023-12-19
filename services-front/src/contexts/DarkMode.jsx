import React, { createContext, useEffect, useState } from 'react';

const DarkModeContext = createContext();

const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') setIsDarkMode(true);
    else setIsDarkMode(false);
  }, []);

  const toggleDarkMode = () => {
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
    if (isDarkMode) {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
    else {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    }
    setIsDarkMode((prevState) => !prevState);
  };

  const contextValue = {
    isDarkMode,
    toggleDarkMode,
  };

  return <DarkModeContext.Provider value={contextValue}>{children}</DarkModeContext.Provider>;
};

export default DarkModeProvider;
export { DarkModeContext };
