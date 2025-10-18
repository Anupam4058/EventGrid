import axios from 'axios';

const API_BASE_URL = 'https://eventgrid.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Profile API calls
export const profileAPI = {
    getAll: () => api.get('/profiles'),
    getById: (id) => api.get(`/profiles/${id}`),
    create: (data) => api.post('/profiles', data),
    update: (id, data) => api.put(`/profiles/${id}`, data)
};

// Event API calls
export const eventAPI = {
    getAll: (profileId = null) => {
        const url = profileId ? `/events?profileId=${profileId}` : '/events';
        return api.get(url);
    },
    getById: (id) => api.get(`/events/${id}`),
    create: (data) => api.post('/events', data),
    update: (id, data) => api.put(`/events/${id}`, data),
    delete: (id) => api.delete(`/events/${id}`),
    getLogs: (id) => api.get(`/events/${id}/logs`)
};

export default api;

