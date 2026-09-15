// Centralized API Service for Mr. Doc Frontend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

const getHeaders = (isJson = true) => {
  const headers: Record<string, string> = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const apiService = {
  get: async (endpoint: string) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  },

  post: async (endpoint: string, body: any) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  },

  put: async (endpoint: string, body: any) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  },

  delete: async (endpoint: string) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  },

  downloadPrescriptionPdf: async (prescriptionId: string) => {
    const token = getAuthToken();
    const res = await fetch(`${API_BASE_URL}/prescriptions/${prescriptionId}/pdf`, {
      method: 'GET',
      headers: getHeaders(false),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to download prescription PDF');
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Prescription-${prescriptionId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  viewPrescriptionPdf: async (prescriptionId: string) => {
    const token = getAuthToken();
    if (token) {
      window.open(`${API_BASE_URL}/prescriptions/${prescriptionId}/pdf?token=${token}`, '_blank');
    } else {
      window.open(`${API_BASE_URL}/prescriptions/${prescriptionId}/pdf`, '_blank');
    }
  }
};
