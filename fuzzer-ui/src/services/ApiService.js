import axios from 'axios';

const API_BASE = 'http://localhost:8080';

// Create a custom Axios instance
const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Token management helpers
export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
    } else {
        localStorage.removeItem('token');
    }
};
export const removeToken = () => {
    localStorage.removeItem('token');
};

// USER AUTHENTICATION
export const registerUser = async (username, name, email, password) => {
    const response = await api.post('/api/users/register', { username, name, email, password });
    return response.data;
};

export const loginUser = async (username, password) => {
    const response = await api.post('/api/users/login', { username, password });
    return response.data; // Expected: { token: '...', username: '...' }
};

export const getCurrentUser = async () => {
    const response = await api.get('/api/users/me');
    return response.data; // Expected: { id, username, name, email }
};

// PROJECTS
export const createProject = async (name, description) => {
    const response = await api.post('/api/projects', { name, description });
    return response.data;
};

// PAYLOADS
export const getPayloads = async () => {
    const response = await api.get('/api/payloads');
    return response.data;
};

export const createPayload = async (payloadData) => {
    const response = await api.post('/api/payloads', payloadData);
    return response.data;
};

export const deletePayload = async (id) => {
    const response = await api.delete(`/api/payloads/${id}`);
    return response.data;
};

// SCANS AND FUZZING
export const fuzzSingle = async (payloadId, targetUrl) => {
    const response = await api.post(`/api/payloads/fuzz/${payloadId}`, null, {
        params: { targetUrl },
    });
    return response.data;
};

export const fuzzAll = async (targetUrl) => {
    const response = await api.post('/api/payloads/fuzz-all', null, {
        params: { targetUrl },
    });
    return response.data;
};

export const getScans = async () => {
    const response = await api.get('/api/scans');
    return response.data; // Expected: list of { scanId, count }
};

export const getScanResults = async (scanId) => {
    const response = await api.get(`/api/payloads/results/scan/${scanId}`);
    return response.data;
};

export const getResults = async () => {
    const response = await api.get('/api/payloads/results');
    return response.data;
};

export default api;