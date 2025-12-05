import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import { useAuth } from "./AuthContext.jsx";
import {
    loadData,
    saveData,
    generateDemoData,
    addTask,
    updateTask,
    deleteTask,
} from "../services/data.api.js";

const DataContext = createContext();

export function DataProvider({ children }) {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshData = useCallback(async () => {
        if (!user?.email) {
            setUserData(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        const data = await loadData(user.email);
        setUserData(data || null);
        setLoading(false);
    }, [user]);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    // sync backend when userData changes (debounced inside saveData)
    useEffect(() => {
        if (!user || !userData) return;
        saveData({ ...userData, email: user.email });
    }, [userData, user]);

    // CRUD helpers that update context then persist
    const createTask = useCallback(
        async (task) => {
            if (!user?.email) throw new Error("Not logged in");
            const newTask = await addTask(user.email, task);
            setUserData((prev) => ({
                ...prev,
                tasks: [newTask, ...(prev?.tasks || [])],
            }));
            return newTask;
        },
        [user]
    );

    const editTask = useCallback(
        async (taskId, patch) => {
            if (!user?.email) throw new Error("Not logged in");
            const updated = await updateTask(user.email, taskId, patch);
            setUserData((prev) => ({
                ...prev,
                tasks: prev.tasks.map((t) => (t.id === taskId ? updated : t)),
            }));
            return updated;
        },
        [user]
    );

    const removeTask = useCallback(
        async (taskId) => {
            if (!user?.email) throw new Error("Not logged in");
            await deleteTask(user.email, taskId);
            setUserData((prev) => ({
                ...prev,
                tasks: prev.tasks.filter((t) => t.id !== taskId),
            }));
        },
        [user]
    );

    const initDemo = useCallback(async () => {
        if (!user?.email) throw new Error("Not logged in");
        await generateDemoData(user.email);
        await refreshData();
    }, [user, refreshData]);

    return (
        <DataContext.Provider
            value={{
                userData,
                setUserData,
                refreshData,
                loading,
                createTask,
                editTask,
                removeTask,
                initDemo,
            }}
        >
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => useContext(DataContext);
