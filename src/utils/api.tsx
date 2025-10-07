import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-fe64975a`;

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
}

class ApiClient {
  private accessToken: string | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      localStorage.setItem('euroconnect_access_token', token);
    } else {
      localStorage.removeItem('euroconnect_access_token');
    }
  }

  getAccessToken(): string | null {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('euroconnect_access_token');
    }
    return this.accessToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = this.getAccessToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || publicAnonKey}`,
        ...options.headers,
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(`API Error on ${endpoint}:`, data);
        return {
          success: false,
          error: data.error || 'Došlo je do greške',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(`API Request failed on ${endpoint}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Došlo je do greške',
      };
    }
  }

  // Auth endpoints
  async signup(data: {
    email: string;
    password: string;
    name: string;
    role: 'candidate' | 'employer';
  }) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(email: string, password: string) {
    return this.request<{ access_token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    this.setAccessToken(null);
    return { success: true };
  }

  async getCurrentUser() {
    return this.request('/auth/me', { method: 'GET' });
  }

  // Jobs endpoints
  async getJobs(filters?: {
    category?: string;
    location?: string;
    search?: string;
  }) {
    const cleanFilters: Record<string, string> = {};
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          cleanFilters[key] = value;
        }
      });
    }
    const params = new URLSearchParams(cleanFilters);
    const queryString = params.toString();
    return this.request(`/jobs${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
  }

  async getJob(jobId: string) {
    return this.request(`/jobs/${jobId}`, { method: 'GET' });
  }

  async createJob(jobData: any) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async updateJob(jobId: string, jobData: any) {
    return this.request(`/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  }

  async deleteJob(jobId: string) {
    return this.request(`/jobs/${jobId}`, { method: 'DELETE' });
  }

  // Applications endpoints
  async applyToJob(applicationData: {
    jobId: string;
    coverLetter?: string;
    cvUrl: string;
  }) {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  async getMyApplications() {
    return this.request('/applications/my', { method: 'GET' });
  }

  async getJobApplications(jobId: string) {
    return this.request(`/applications/job/${jobId}`, { method: 'GET' });
  }

  async updateApplicationStatus(
    applicationId: string,
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  ) {
    return this.request(`/applications/${applicationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Profile endpoints
  async getProfile() {
    return this.request('/profile', { method: 'GET' });
  }

  async updateProfile(profileData: any) {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // File upload
  async uploadFile(file: File, type: 'cv' | 'logo'): Promise<ApiResponse<{ url: string }>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const token = this.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token || publicAnonKey}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Upload Error:', data);
        return {
          success: false,
          error: data.error || 'Upload nije uspeo',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload nije uspeo',
      };
    }
  }

  // Premium endpoints
  async getPremiumStatus() {
    return this.request('/premium/status', { method: 'GET' });
  }

  async purchasePremium(planType: 'basic' | 'professional' | 'enterprise', paymentMethod: string) {
    return this.request('/premium/purchase', {
      method: 'POST',
      body: JSON.stringify({ planType, paymentMethod }),
    });
  }

  async getPaymentHistory() {
    return this.request('/premium/payments', { method: 'GET' });
  }

  // Admin endpoints
  async getAllUsers() {
    return this.request('/admin/users', { method: 'GET' });
  }

  async getAllApplications() {
    return this.request('/admin/applications', { method: 'GET' });
  }

  async getAllPayments() {
    return this.request('/admin/payments', { method: 'GET' });
  }

  // Employer Premium Features
  async upgradeJobToPremium(jobId: string, featureType: 'featured' | 'boost' | 'highlight') {
    return this.request(`/jobs/${jobId}/upgrade`, {
      method: 'POST',
      body: JSON.stringify({ featureType }),
    });
  }

  // Payment Configuration (Admin only)
  async getPaymentConfig() {
    return this.request('/admin/payment-config', { method: 'GET' });
  }

  async savePaymentConfig(config: {
    provider: string;
    publishableKey: string;
    secretKey?: string;
    enabled: boolean;
  }) {
    return this.request('/admin/payment-config', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  // Email Configuration (Admin only)
  async getEmailConfig() {
    return this.request('/admin/email-config', { method: 'GET' });
  }

  async saveEmailConfig(config: {
    provider: string;
    apiKey: string;
    fromEmail: string;
    fromName: string;
    enabled: boolean;
  }) {
    return this.request('/admin/email-config', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async sendTestEmail(toEmail: string) {
    return this.request('/admin/test-email', {
      method: 'POST',
      body: JSON.stringify({ toEmail }),
    });
  }
}

export const api = new ApiClient();
