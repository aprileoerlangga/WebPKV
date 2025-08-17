// Main App Module
const app = {
    currentPage: null,
    pages: {},

    async init() {
        this.setupEventListeners();
        this.setDefaultDate();

        // Check authentication
        const isAuthenticated = await auth.checkAuth();
        if (isAuthenticated) {
            this.showMainApp();
            this.navigateTo('dashboard');
        } else {
            this.showLogin();
        }
    },

    setupEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', this.toggleSidebar);
        }

        // Sidebar links
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                if (page) {
                    this.navigateTo(page);
                }
            });
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.navigateTo(e.state.page, false);
            }
        });
    },

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        const dateInputs = ['issuanceDate', 'returnDate'];
        dateInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.value = today;
            }
        });
    },

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('sidebar-active');
        sidebar.classList.toggle('sidebar-inactive');
    },

    showLogin() {
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('pageContent').classList.add('hidden');
        document.querySelector('.lg\\:ml-64').classList.add('hidden');
        document.getElementById('pageTitle').textContent = 'Login';
    },

    showMainApp() {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('pageContent').classList.remove('hidden');
        document.querySelector('.lg\\:ml-64').classList.remove('hidden');

        if (auth.currentUser) {
            document.getElementById('adminName').textContent = auth.currentUser.name;
        }
    },

    async navigateTo(page, pushState = true) {
        if (page === this.currentPage) return;

        // Update URL
        if (pushState) {
            history.pushState({ page }, '', `#${page}`);
        }

        // Update active sidebar link
        this.updateSidebarActive(page);

        // Update page title
        this.updatePageTitle(page);

        // Load page content
        await this.loadPage(page);

        this.currentPage = page;
    },

    updateSidebarActive(page) {
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(link => {
            link.classList.remove('bg-blue-50', 'text-blue-600');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('bg-blue-50', 'text-blue-600');
            }
        });
    },

    updatePageTitle(page) {
        const titles = {
            dashboard: 'Dashboard',
            applications: 'Verifikasi & Persetujuan',
            cards: 'Kartu Visitor',
            history: 'Riwayat Pengembalian',
            reports: 'Laporan'
        };

        document.getElementById('pageTitle').textContent = titles[page] || 'Dashboard';
    },

    async loadPage(page) {
        const pageContent = document.getElementById('pageContent');

        try {
            utils.showLoading(true);

            // Get page module
            const pageModule = this.getPageModule(page);
            if (!pageModule) {
                throw new Error(`Page module for '${page}' not found`);
            }

            // Render page
            pageContent.innerHTML = pageModule.render();

            // Initialize page
            if (pageModule.init) {
                await pageModule.init();
            }

        } catch (error) {
            console.error(`Error loading page '${page}':`, error);
            pageContent.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Error Loading Page</h3>
                    <p class="text-gray-600">${error.message}</p>
                    <button onclick="app.navigateTo('dashboard')" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Back to Dashboard
                    </button>
                </div>
            `;
        } finally {
            utils.showLoading(false);
        }
    },

    getPageModule(page) {
        switch (page) {
            case 'dashboard':
                return dashboard;
            case 'applications':
                return applications;
            case 'cards':
                return cards;
            case 'history':
                return history;
            case 'reports':
                return reports;
            default:
                return null;
        }
    },

    // Global navigation function for onclick handlers
    navigateToPage(page) {
        this.navigateTo(page);
    }
};

// Make navigateTo available globally for onclick handlers
window.navigateTo = (page) => app.navigateTo(page);
window.logout = () => auth.logout();
