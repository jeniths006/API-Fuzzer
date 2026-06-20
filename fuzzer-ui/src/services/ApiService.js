import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/payloads';

export const getResults = () => {
    return axios.get(`${API_BASE}/results`);
};

export const fuzzPayload = (targetUrl) => {
    return axios.post(`${API_BASE}/fuzz-all`,null, {params: { targetUrl }});
}