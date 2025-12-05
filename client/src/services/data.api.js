import { apiRequest, isBackendAlive } from "./api";

let saveTimeout = null;

export const loadData = async (email) => {
    if (!email) return null;

    // Ưu tiên backend
    if (isBackendAlive()) {
        try {
            return await apiRequest("/data", {
                method: "GET",
                headers: { "x-user-email": email },
            });
        } catch {
            console.warn("⚠ Fallback → LocalStorage");
        }
    }

    const local = localStorage.getItem("lifeos_data");
    return local ? JSON.parse(local) : null;
};

export const saveData = (data) => {
    clearTimeout(saveTimeout);

    saveTimeout = setTimeout(async () => {
        if (isBackendAlive()) {
            try {
                await apiRequest("/data", {
                    method: "POST",
                    headers: { "x-user-email": data.email },
                    body: JSON.stringify(data),
                });
                return;
            } catch {
                console.warn("⚠ Backend fail → LocalStorage");
            }
        }

        localStorage.setItem("lifeos_data", JSON.stringify(data));
    }, 1200);
};

export const generateDemoData = async (email) => {
    if (!email) throw new Error("Missing user email");

    await apiRequest("/data/generate-demo", {
        method: "POST",
        headers: { "x-user-email": email },
    });
};
export async function addTask(email, task) {
    // backend đang dùng single /data POST to save entire data, nhưng ta dùng saveData for simplicity
    // fetch current, push, save
    const data = (await loadData(email)) || { tasks: [] };
    const newTask = {
        ...task,
        id: task.id || crypto.randomUUID(),
        createdAt: new Date(),
    };
    data.tasks = [newTask, ...(data.tasks || [])];
    saveData({ ...data, email });
    return newTask;
}

export async function updateTask(email, taskId, patch) {
    const data = await loadData(email);
    if (!data) throw new Error("No data");
    data.tasks = (data.tasks || []).map((t) =>
        t.id === taskId ? { ...t, ...patch } : t
    );
    saveData({ ...data, email });
    return data.tasks.find((t) => t.id === taskId);
}

export async function deleteTask(email, taskId) {
    const data = await loadData(email);
    if (!data) throw new Error("No data");
    data.tasks = (data.tasks || []).filter((t) => t.id !== taskId);
    saveData({ ...data, email });
    return true;
}
