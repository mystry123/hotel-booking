import React, { createContext, useState, useContext, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ message: '', show: false });

    const showToast = useCallback((message) => {
        setToast({ message, show: true });
    }, []);

    const hideToast = useCallback(() => {
        setToast({ message: '', show: false });
    }, []);

    return (
        <ToastContext.Provider value={{ toast, showToast, hideToast }}>
            {children}
        </ToastContext.Provider>
    );
};