import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

// Request interceptor: attach Bearer token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 Unauthorized
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and trigger auth redirect if not on public auth pages
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==========================================
// AUTH API
// ==========================================
export async function registerUser(email, fullName, password) {
  const { data } = await API.post('/auth/register', {
    email,
    full_name: fullName,
    password
  });
  if (data.access_token) {
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
}

export async function loginUser(email, password) {
  const { data } = await API.post('/auth/login', {
    email,
    password
  });
  if (data.access_token) {
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
}

export async function getMe() {
  const { data } = await API.get('/auth/me');
  return data;
}

export async function logoutUser() {
  try {
    await API.post('/auth/logout');
  } catch (e) {
    console.warn('Logout notice:', e);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

// ==========================================
// ANALYSIS API
// ==========================================
export async function analyzeSkin(imageFile, onUploadProgress) {
  const formData = new FormData();
  formData.append('file', imageFile);

  const { data } = await API.post('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(percent);
      }
    }
  });

  return data;
}

// ==========================================
// WEEKLY PROGRESS API (FEATURE 2)
// ==========================================
export async function submitWeeklyCheckin(imageFile) {
  const formData = new FormData();
  formData.append('file', imageFile);

  const { data } = await API.post('/checkin', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}

export async function getProgress() {
  const { data } = await API.get('/progress');
  return data;
}

export async function compareProgress(week1, week2) {
  const { data } = await API.get(`/progress/compare?week1=${week1}&week2=${week2}`);
  return data;
}

// ==========================================
// PRODUCT SCANNER OCR (FEATURE 4)
// ==========================================
export async function scanProduct(imageFile, analysisId = null) {
  const formData = new FormData();
  formData.append('file', imageFile);
  if (analysisId) {
    formData.append('analysis_id', analysisId);
  }

  const { data } = await API.post('/scan-product', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}

// ==========================================
// CHAT API
// ==========================================
export async function sendChatMessage(message, skinContext = null, history = [], sessionId = null, analysisId = null) {
  const { data } = await API.post('/chat', {
    message,
    skin_context: skinContext,
    history,
    session_id: sessionId,
    analysis_id: analysisId
  });

  return data;
}

export async function streamChatMessage({
  message,
  skinContext = null,
  history = [],
  sessionId = null,
  analysisId = null,
  onToken,
  onComplete,
  onError
}) {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/chat/stream`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        message,
        skin_context: skinContext,
        history,
        session_id: sessionId,
        analysis_id: analysisId
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || `Server responded with status ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      if (onToken) onToken(chunk, fullText);
    }

    if (onComplete) onComplete(fullText);
    return fullText;
  } catch (err) {
    if (onError) onError(err);
    else throw err;
  }
}

// ==========================================
// HISTORY API
// ==========================================
export async function getHistory(skip = 0, limit = 20) {
  const { data } = await API.get(`/history?skip=${skip}&limit=${limit}`);
  return data;
}

export async function getAnalysisById(analysisId) {
  const { data } = await API.get(`/history/${analysisId}`);
  return data;
}

export async function deleteAnalysis(analysisId) {
  const { data } = await API.delete(`/history/${analysisId}`);
  return data;
}

export async function checkHealth() {
  const { data } = await API.get('/health');
  return data;
}