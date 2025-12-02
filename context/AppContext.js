import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
// 1. Initialize theme state by checking localStorage
const [theme, setThemeState] = useState(() => {
    // Check if window is defined (to handle Next.js SSR)
    if (typeof window !== 'undefined') {
        const storedTheme = localStorage.getItem('appTheme');
        return storedTheme ? storedTheme : 'light';
    }
    return 'light';
});

const [isLoggedIn, setIsLoggedIn] = useState(false);
const [userName, setUserName] = useState('Slyvia');
const [selectedDepartement, setSelectedDepartement] = useState('');

const setTheme = (newTheme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
        localStorage.setItem('appTheme', newTheme);
    }
};

const value = {
    theme,
    setTheme, 
    isLoggedIn,
    setIsLoggedIn,
    userName,
    setUserName,
    selectedDepartement,
    setSelectedDepartement,
};


return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}