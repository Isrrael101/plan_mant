// Use relative URL - Nginx will proxy to backend
// Updated for Kubernetes deployment - v7 MySQL only - CRUD Complete - Costs in BOB - PMP Names - Clean Text
const API_BASE_URL = '/api';

class ApiService {
    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Accept': 'application/json; charset=utf-8',
            'Content-Type': 'application/json; charset=utf-8',
            'Accept-Charset': 'utf-8',
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
        return this.fetchData('/maquinaria');
    }

    // Get personnel data
    async getPersonnel() {
        return this.fetchData('/personal');
    }

    // Get tools data
    async getTools() {
        return this.fetchData('/herramientas');
    }

    // Get supplies data
    async getSupplies() {
        return this.fetchData('/insumos');
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
        try {
            const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Accept': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                // Extraer el mensaje de error del backend
                const errorMessage = result.error || `Error ${response.status}: ${response.statusText}`;
                const error = new Error(errorMessage);
                error.status = response.status;
                throw error;
            }

            return result;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async verifyResetToken(token) {
        return this.postData('/auth/verify-reset-token', { token });
    }

    async resetPassword(token, newPassword) {
        return this.postData('/auth/reset-password', { token, newPassword });
    }

    // Resetear contraseña como administrador
    async adminResetPassword(userId, newPassword) {
        return this.postData(`/users/${userId}/reset-password`, { newPassword });
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

    async getPasswordResetRequests() {
        return this.fetchData('/password-reset-requests');
    }

    // ============================================
    // Two-Factor Authentication (2FA)
    // ============================================
    async getTwoFactorSetup() {
        return this.fetchData('/auth/two-factor/setup');
    }

    async verifyTwoFactorCode(code) {
        return this.postData('/auth/two-factor/verify', { code });
    }

    async disableTwoFactor(password) {
        return this.postData('/auth/two-factor/disable', { password });
    }

    async getTwoFactorStatus() {
        return this.fetchData('/auth/two-factor/status');
    }

    // CRUD Operations - Machinery
    async getMachineryById(id) {
        return this.fetchData(`/maquinaria/${id}`);
    }

    async createMachinery(data) {
        return this.postData('/maquinaria', data);
    }

    async updateMachinery(id, data) {
        return this.putData(`/maquinaria/${id}`, data);
    }

    async deleteMachinery(id) {
        return this.deleteData(`/maquinaria/${id}`);
    }

    // CRUD Operations - Personnel
    async createPersonnel(data) {
        return this.postData('/personal', data);
    }

    async updatePersonnel(id, data) {
        return this.putData(`/personal/${id}`, data);
    }

    async deletePersonnel(id) {
        return this.deleteData(`/personal/${id}`);
    }

    // CRUD Operations - Tools
    async createTool(data) {
        return this.postData('/herramientas', data);
    }

    async updateTool(id, data) {
        return this.putData(`/herramientas/${id}`, data);
    }

    async deleteTool(id) {
        return this.deleteData(`/herramientas/${id}`);
    }

    // CRUD Operations - Supplies
    async createSupply(data) {
        return this.postData('/insumos', data);
    }

    async updateSupply(id, data) {
        return this.putData(`/insumos/${id}`, data);
    }

    async deleteSupply(id) {
        return this.deleteData(`/insumos/${id}`);
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

    // ============================================
    // Machinery Specifications
    // ============================================
    async getMachinerySpecs(id) {
        return this.fetchData(`/maquinaria/${id}/specs`);
    }

    async updateMachinerySpecs(id, data) {
        return this.postData(`/maquinaria/${id}/specs`, data);
    }

    // ============================================
    // Checklists
    // ============================================
    async getChecklistsByMachinery(machineryId) {
        return this.fetchData(`/maquinaria/${machineryId}/checklists`);
    }

    async getChecklist(id) {
        return this.fetchData(`/checklists/${id}`);
    }

    async createChecklist(data) {
        return this.postData('/checklists', data);
    }

    async updateChecklist(id, data) {
        return this.putData(`/checklists/${id}`, data);
    }

    async deleteChecklist(id) {
        return this.deleteData(`/checklists/${id}`);
    }

    // ============================================
    // Daily Reports
    // ============================================
    async getDailyReportsByMachinery(machineryId) {
        return this.fetchData(`/maquinaria/${machineryId}/daily-reports`);
    }

    async getDailyReport(id) {
        return this.fetchData(`/daily-reports/${id}`);
    }

    async createDailyReport(data) {
        return this.postData('/daily-reports', data);
    }

    async updateDailyReport(id, data) {
        return this.putData(`/daily-reports/${id}`, data);
    }

    async deleteDailyReport(id) {
        return this.deleteData(`/daily-reports/${id}`);
    }

    // ============================================
    // Machinery History
    // ============================================
    async getMachineryHistory(machineryId) {
        return this.fetchData(`/maquinaria/${machineryId}/history`);
    }

    // ============================================
    // Work Orders
    // ============================================
    async getWorkOrders(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.fetchData(`/work-orders?${params}`);
    }

    async getWorkOrder(id) {
        return this.fetchData(`/work-orders/${id}`);
    }

    async createWorkOrder(data) {
        return this.postData('/work-orders', data);
    }

    async updateWorkOrder(id, data) {
        return this.putData(`/work-orders/${id}`, data);
    }

    async deleteWorkOrder(id) {
        return this.deleteData(`/work-orders/${id}`);
    }

    async assignMechanics(workOrderId, data) {
        return this.postData(`/work-orders/${workOrderId}/mechanics`, data);
    }

    async updateWorkOrderStatus(workOrderId, data) {
        return this.putData(`/work-orders/${workOrderId}/status`, data);
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
