const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('agrominds_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('agrominds_token', token);
    } else {
      localStorage.removeItem('agrominds_token');
    }
  }

  getToken() {
    return this.token;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(data.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.errors = data.errors || null;
        throw error;
      }

      return data;
    } catch (err) {
      console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err);
      throw err;
    }
  }

  // Health
  getHealth() {
    return this.request('/health');
  }

  // Agriculture
  getCategories() {
    return this.request('/agriculture/categories');
  }

  getRecords(params = {}) {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.tag) query.append('tag', params.tag);
    if (params.limit) query.append('limit', params.limit);
    if (params.offset) query.append('offset', params.offset);

    const qs = query.toString();
    return this.request(`/agriculture/records${qs ? `?${qs}` : ''}`);
  }

  getRecordBySlug(slug) {
    return this.request(`/agriculture/records/${slug}`);
  }

  // AI Assistant
  askAssistant({ prompt, context, conversationId }) {
    return this.request('/assistant/ask', {
      method: 'POST',
      body: JSON.stringify({ prompt, context, conversationId })
    });
  }

  getConversations() {
    return this.request('/assistant/conversations');
  }

  createConversation(data) {
    return this.request('/assistant/conversations', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  getMessages(conversationId) {
    return this.request(`/assistant/conversations/${conversationId}/messages`);
  }

  // Auth & Profile
  getMe() {
    return this.request('/auth/me');
  }

  updateMe(data) {
    return this.request('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  devLogin(email) {
    return this.request('/auth/dev-login', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  // Payments
  getPlans() {
    return this.request('/payments/plans');
  }

  createOrder({ planTier, notes }) {
    return this.request('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ planTier, notes })
    });
  }

  verifyPayment({ orderId, paymentId, signature }) {
    return this.request('/payments/verify', {
      method: 'POST',
      body: JSON.stringify({ orderId, paymentId, signature })
    });
  }

  getPaymentHistory() {
    return this.request('/payments/history');
  }
}

export const api = new ApiClient();
export default api;
