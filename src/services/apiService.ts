/**
 * Unified API Client for NexusCRM
 * Provides typed methods for all backend REST endpoints with automatic JSON parsing and error handling.
 */

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

class ApiService {
  private baseUrl = '/api';

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || `HTTP error ${response.status}`,
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Network request failed',
      };
    }
  }

  // Dashboard & Metrics
  async getDashboardStats() {
    return this.request<any>('/dashboard/stats');
  }

  // Leads API
  async getLeads(params?: { status?: string; search?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/leads${query ? `?${query}` : ''}`);
  }

  async createLead(lead: any) {
    return this.request<any>('/leads', {
      method: 'POST',
      body: JSON.stringify(lead),
    });
  }

  async updateLead(id: string, updates: any) {
    return this.request<any>(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteLead(id: string) {
    return this.request<any>(`/leads/${id}`, {
      method: 'DELETE',
    });
  }

  // Deals & Pipeline API
  async getDeals() {
    return this.request<any[]>('/deals');
  }

  async createDeal(deal: any) {
    return this.request<any>('/deals', {
      method: 'POST',
      body: JSON.stringify(deal),
    });
  }

  async updateDeal(id: string, updates: any) {
    return this.request<any>(`/deals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Tasks API
  async getTasks() {
    return this.request<any[]>('/tasks');
  }

  async createTask(task: any) {
    return this.request<any>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: string, updates: any) {
    return this.request<any>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Invoices & Billing API
  async getInvoices() {
    return this.request<any[]>('/invoices');
  }

  async createInvoice(invoice: any) {
    return this.request<any>('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoice),
    });
  }

  // Profile & Workspace Settings API
  async getProfile() {
    return this.request<any>('/auth/profile');
  }

  async updateProfile(profile: any) {
    return this.request<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  async getWorkspace() {
    return this.request<any>('/workspace');
  }

  async updateWorkspace(workspace: any) {
    return this.request<any>('/workspace', {
      method: 'PUT',
      body: JSON.stringify(workspace),
    });
  }

  // AI Generation API
  async generateAIContent(prompt: string, systemInstruction?: string) {
    return this.request<{ text: string }>('/gemini/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, systemInstruction }),
    });
  }
}

export const api = new ApiService();
