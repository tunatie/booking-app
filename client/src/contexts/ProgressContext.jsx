import React, { createContext, useContext, useState } from 'react';

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
    const [progress, setProgress] = useState({
        step1: '0',
        step2: '0',
        step3: '0'
    });

    return (
        <ProgressContext.Provider value={{ progress, setProgress }}>
            {children}
        </ProgressContext.Provider>
    );
}

export function useProgress() {
    const context = useContext(ProgressContext);
    if (!context) {
        throw new Error('useProgress must be used within a ProgressProvider');
    }
    return context;
} 