/**
 * API Service Layer
 * Ready for backend integration
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Generic fetch wrapper
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Orders API
export const ordersAPI = {
  getAll: () => fetchAPI('/orders'),
  getById: (id) => fetchAPI(`/orders/${id}`),
  create: (data) => fetchAPI('/orders', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/orders/${id}`, { method: 'DELETE' }),
};

// Delivery Notes API (formerly Production Sheets)
export const productionAPI = {
  generate: (orderId) => fetchAPI(`/production/${orderId}`, { method: 'POST' }),
  getAll: () => fetchAPI('/production'),
  updateStatus: (id, status) => fetchAPI(`/production/${id}/status`, { 
    method: 'PATCH', 
    body: JSON.stringify({ status }) 
  }),
};

// Labels API
export const labelsAPI = {
  generate: (orderId) => fetchAPI(`/labels/${orderId}`, { method: 'POST' }),
};

// Integrations API
export const integrationsAPI = {
  sync: (marketplace) => fetchAPI(`/integrations/${marketplace}/sync`, { method: 'POST' }),
  getStatus: () => fetchAPI('/integrations/status'),
};

// Settings API
export const settingsAPI = {
  get: () => fetchAPI('/settings'),
  update: (data) => fetchAPI('/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

