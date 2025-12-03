// src/context/DataContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { loadData, saveData } from '../lib/api.js';
import { useAuth } from './AuthContext.jsx';

const DataContext = createContext();

export function DataProvider({ children }) {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load dữ liệu khi user thay đổi
    useEffect(() => {
        if (user?.email) {
            loadData(user.email).then(data => {
                setUserData(data || { email: user.email, tasks: [], notes: [], goals: [], habits: [], areas: [] });
                setLoading(false);
            });
        } else {
            setUserData(null);
            setLoading(false);
        }
    }, [user]);

    // Auto-save khi userData thay đổi
    useEffect(() => {
        if (userData && user?.email) {
            saveData({ ...userData, email: user.email });
        }
    }, [userData]);

    return (
        <DataContext.Provider value={{ userData, setUserData, loading }}>
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => useContext(DataContext);