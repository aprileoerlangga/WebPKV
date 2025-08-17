// API Module
const api = {
    baseURL: '/api',
    authToken: null,

    setAuthToken(token) {
        this.authToken = token;
    },

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        if (this.authToken) {
            headers['Authorization'] = `Bearer ${this.authToken}`;
        }

        return headers;
    },

    async request(method, endpoint, data = null) {
        const url = `${this.baseURL}${endpoint}`;
        const options = {
            method: method.toUpperCase(),
            headers: this.getHeaders()
        };

        if (data && (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT' || method.toUpperCase() === 'PATCH')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                if (response.status === 401) {
                    auth.logout();
                    throw new Error('Session expired. Please login again.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    },

    async get(endpoint) {
        return await this.request('GET', endpoint);
    },

    async post(endpoint, data) {
        return await this.request('POST', endpoint, data);
    },

    async put(endpoint, data) {
        return await this.request('PUT', endpoint, data);
    },

    async delete(endpoint) {
        return await this.request('DELETE', endpoint);
    },

    async downloadFile(endpoint, filename) {
        const url = `${this.baseURL}${endpoint}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);

            utils.showAlert('File berhasil diunduh', 'success');
        } catch (error) {
            console.error('Download failed:', error);
            utils.showAlert('Error downloading file: ' + error.message, 'error');
        }
    }
};
