// Authentication Module
const auth = {
    token: localStorage.getItem('admin_token'),
    currentUser: null,

    async login(event) {
        event.preventDefault();
        utils.showLoading(true);

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await api.post('/admin/login', { email, password });

            if (response.success) {
                this.token = response.data.token;
                this.currentUser = response.data.user;
                localStorage.setItem('admin_token', this.token);
                api.setAuthToken(this.token);
                app.showMainApp();
                app.navigateTo('dashboard');
            } else {
                utils.showAlert('Login gagal: ' + response.message, 'error');
            }
        } catch (error) {
            utils.showAlert('Error: ' + error.message, 'error');
        }

        utils.showLoading(false);
    },

    async logout() {
        try {
            if (this.token) {
                await api.post('/admin/logout');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }

        localStorage.removeItem('admin_token');
        this.token = null;
        this.currentUser = null;
        api.setAuthToken(null);
        app.showLogin();
    },

    async checkAuth() {
        if (!this.token) {
            return false;
        }

        try {
            api.setAuthToken(this.token);
            const response = await api.get('/admin/me');

            if (response.success) {
                this.currentUser = response.data.user;
                return true;
            } else {
                throw new Error('Authentication failed');
            }
        } catch (error) {
            localStorage.removeItem('admin_token');
            this.token = null;
            api.setAuthToken(null);
            return false;
        }
    },

    isAuthenticated() {
        return this.token !== null && this.currentUser !== null;
    },

    getUser() {
        return this.currentUser;
    },

    getToken() {
        return this.token;
    }
};
