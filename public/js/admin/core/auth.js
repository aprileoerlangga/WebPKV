// Authentication Module
const auth = {
    token: localStorage.getItem('admin_token'),
    currentUser: JSON.parse(localStorage.getItem('admin_user') || 'null'),

    async login(event) {
        event.preventDefault();
        utils.showLoading(true);

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            // Mock authentication for development
            if (email === 'superadmin@stasiun.com' && password === 'password123') {
                // Mock successful response
                const mockToken = 'mock_admin_token_' + Date.now();
                const mockUser = {
                    id: 1,
                    name: 'Super Admin',
                    email: 'superadmin@stasiun.com',
                    role: 'superadmin'
                };

                this.token = mockToken;
                this.currentUser = mockUser;
                localStorage.setItem('admin_token', this.token);
                localStorage.setItem('admin_user', JSON.stringify(this.currentUser));
                api.setAuthToken(this.token);
                
                utils.showAlert('Login berhasil!', 'success');
                app.showMainApp();
                app.navigateTo('dashboard');
            } else {
                utils.showAlert('Email atau password salah!', 'error');
            }
        } catch (error) {
            utils.showAlert('Error: ' + error.message, 'error');
        }

        utils.showLoading(false);
    },

    async logout() {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        this.token = null;
        this.currentUser = null;
        api.setAuthToken(null);
        app.showLogin();
        utils.showAlert('Logout berhasil!', 'info');
    },

    async checkAuth() {
        if (!this.token || !this.currentUser) {
            return false;
        }

        // For mock auth, just check if token and user exist
        api.setAuthToken(this.token);
        return true;
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
