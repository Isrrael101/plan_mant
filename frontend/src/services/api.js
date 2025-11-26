const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
    async fetchData(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`);
            if (!response.ok) {
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
}

export default new ApiService();
