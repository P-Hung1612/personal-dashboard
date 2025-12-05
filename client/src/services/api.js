const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log("backend", BACKEND_URL);

let backendAlive = true;
console.log("backend", BACKEND_URL);
export const apiRequest = async (path, options = {}) => {
    const mergedHeaders = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    try {
        const res = await fetch(`${BACKEND_URL}${path}`, {
            ...options,
            headers: mergedHeaders,
        });

        backendAlive = res.ok;

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(data.error || "API Error");
        }

        return data;
    } catch (err) {
        console.warn("Backend lỗi:", err.message);
        backendAlive = false;
        throw err;
    }
};

export const isBackendAlive = () => backendAlive;
