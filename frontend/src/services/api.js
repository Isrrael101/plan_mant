// Use relative URL - Nginx will proxy to backend
// Updated for Kubernetes deployment - v7 MySQL only - CRUD Complete - Costs in BOB - PMP Names - Clean Text
const API_BASE_URL = '/api';

class ApiService {
    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Accept': 'application/json; charset=utf-8',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    async fetchData(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: this.getAuthHeaders()
            });
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    // Token inválido o expirado
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Get all sheet names
    async getSheets() {
        return this.fetchData('/sheets');
    }

    // Get specific sheet data
    async getSheet(sheetName) {
        return this.fetchData(`/sheet/${encodeURIComponent(sheetName)}`);
    }

    // Get machinery data
    async getMachinery() {
        return this.fetchData('/machinery');
    }

    // Get personnel data
    async getPersonnel() {
        return this.fetchData('/personnel');
    }

    // Get tools data
    async getTools() {
        return this.fetchData('/tools');
    }

    // Get supplies data
    async getSupplies() {
        return this.fetchData('/supplies');
    }

    // Get dashboard statistics
    async getStats() {
        return this.fetchData('/stats');
    }

    // Health check
    async healthCheck() {
        return this.fetchData('/health');
    }

    // ============================================
    // Authentication - Public routes
    // ============================================
    async register(data) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Accept': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al registrar usuario');
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // ============================================
    // User Profile
    // ============================================
    async getProfile() {
        return this.fetchData('/auth/profile');
    }

    async updateProfile(data) {
        return this.putData('/auth/profile', data);
    }

    // ============================================
    // Password Recovery
    // ============================================
    async forgotPassword(data) {
        return this.postData('/auth/forgot-password', data);
    }

    async verifyResetToken(token) {
        return this.postData('/auth/verify-reset-token', { token });
    }

    async resetPassword(token, newPassword) {
        return this.postData('/auth/reset-password', { token, newPassword });
    }

    // ============================================
    // CRUD Operations - Users (Admin only)
    // ============================================
    async getUsers() {
        return this.fetchData('/users');
    }

    async getUserById(id) {
        return this.fetchData(`/users/${id}`);
    }

    async createUser(data) {
        return this.postData('/users', data);
    }

    async updateUser(id, data) {
        return this.putData(`/users/${id}`, data);
    }

    async deleteUser(id) {
        return this.deleteData(`/users/${id}`);
    }

    // CRUD Operations - Machinery
    async createMachinery(data) {
        return this.postData('/machinery', data);
    }

    async updateMachinery(id, data) {
        return this.putData(`/machinery/${id}`, data);
    }

    async deleteMachinery(id) {
        return this.deleteData(`/machinery/${id}`);
    }

    // CRUD Operations - Personnel
    async createPersonnel(data) {
        return this.postData('/personnel', data);
    }

    async updatePersonnel(id, data) {
        return this.putData(`/personnel/${id}`, data);
    }

    async deletePersonnel(id) {
        return this.deleteData(`/personnel/${id}`);
    }

    // CRUD Operations - Tools
    async createTool(data) {
        return this.postData('/tools', data);
    }

    async updateTool(id, data) {
        return this.putData(`/tools/${id}`, data);
    }

    async deleteTool(id) {
        return this.deleteData(`/tools/${id}`);
    }

    // CRUD Operations - Supplies
    async createSupply(data) {
        return this.postData('/supplies', data);
    }

    async updateSupply(id, data) {
        return this.putData(`/supplies/${id}`, data);
    }

    async deleteSupply(id) {
        return this.deleteData(`/supplies/${id}`);
    }

    // Maintenance Operations
    async getMaintenance(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.fetchData(`/maintenance?${params}`);
    }

    async getMaintenanceById(id) {
        return this.fetchData(`/maintenance/${id}`);
    }

    async createMaintenance(data) {
        return this.postData('/maintenance', data);
    }

    async updateMaintenance(id, data) {
        return this.putData(`/maintenance/${id}`, data);
    }

    async deleteMaintenance(id) {
        return this.deleteData(`/maintenance/${id}`);
    }

    async addPersonnelToMaintenance(maintenanceId, data) {
        return this.postData(`/maintenance/${maintenanceId}/personnel`, data);
    }

    async addSupplyToMaintenance(maintenanceId, data) {
        return this.postData(`/maintenance/${maintenanceId}/supplies`, data);
    }

    async getPlans() {
        return this.fetchData('/plans');
    }

    async getPlanById(id) {
        return this.fetchData(`/plans/${id}`);
    }

    async createPlan(data) {
        return this.postData('/plans', data);
    }

    async updatePlan(id, data) {
        return this.putData(`/plans/${id}`, data);
    }

    async deletePlan(id) {
        return this.deleteData(`/plans/${id}`);
    }

    // Activities Operations
    async getActivities(planId = null) {
        const params = planId ? `?plan_id=${planId}` : '';
        return this.fetchData(`/activities${params}`);
    }

    async getActivityById(id) {
        return this.fetchData(`/activities/${id}`);
    }

    async createActivity(data) {
        return this.postData('/activities', data);
    }

    async updateActivity(id, data) {
        return this.putData(`/activities/${id}`, data);
    }

    async deleteActivity(id) {
        return this.deleteData(`/activities/${id}`);
    }

    // Helper methods for POST, PUT, DELETE
    async postData(endpoint, data) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    ...this.getAuthHeaders()
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async putData(endpoint, data) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    ...this.getAuthHeaders()
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async deleteData(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
}

export default new ApiService();
