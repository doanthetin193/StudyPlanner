/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first, default to light mode if not set
    const saved = localStorage.getItem("theme");
    if (!saved) {
      // First time - default to light mode
      return false;
    }
    return saved === "dark";
  });

  useEffect(() => {
    // Update document class and localStorage when theme changes
    const root = document.documentElement;
    console.log("Theme effect running. isDarkMode:", isDarkMode);
    console.log("HTML classList before:", root.classList.toString());
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    console.log("HTML classList after:", root.classList.toString());
  }, [isDarkMode]);

  const toggleTheme = () => {
    console.log("Toggle theme clicked. Current isDarkMode:", isDarkMode);
    setIsDarkMode((prev) => {
      const newValue = !prev;
      console.log("New isDarkMode value:", newValue);
      return newValue;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
