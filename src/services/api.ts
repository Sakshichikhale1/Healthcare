import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors for JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const PatientService = {
  getPatients: async () => {
    const response = await apiClient.get('/patients/');
    return response.data;
  },
  getPatient: async (id: string) => {
    const response = await apiClient.get(`/patients/${id}`);
    return response.data;
  },
  createPatient: async (data: any) => {
    const response = await apiClient.post('/patients/', data);
    return response.data;
  }
};

export const AgentService = {
  getLogs: async () => {
    const response = await apiClient.get('/agents/logs');
    return response.data;
  },
  getStatus: async () => {
    const response = await apiClient.get('/agents/status');
    return response.data;
  }
};

export const ConsultationService = {
  getSoapNote: async (id: number) => {
    const response = await apiClient.get(`/consultations/${id}/soap`);
    return response.data;
  },
  finishConsultation: async (id: number) => {
    const response = await apiClient.post(`/consultations/${id}/finish`);
    return response.data;
  },
  getTranscript: async (id: number) => {
    const response = await apiClient.get(`/consultations/${id}/transcript`);
    return response.data;
  }
};

export const UploadService = {
  uploadReport: async (patientId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/upload/reports?patient_id=${patientId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  uploadAudio: async (consultationId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/upload/audio?consultation_id=${consultationId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getReportStatus: async (reportId: number) => {
    const response = await apiClient.get(`/upload/reports/${reportId}`);
    return response.data;
  }
};

export const AnalyticsService = {
  getKpis: async () => {
    const response = await apiClient.get('/analytics/kpis');
    return response.data;
  }
};
