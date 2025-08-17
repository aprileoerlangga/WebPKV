// Main App Module
const app = {
    currentPage: null,
    pages: {},

    async init() {
        console.log('App initializing...');
        this.setupEventListeners();
        this.setDefaultDate();

        // For demo purposes, skip authentication and go directly to main app
        this.showMainApp();
        await this.navigateTo('dashboard');
        console.log('App initialized successfully');
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
        // Hide the sidebar and main layout when showing login
        document.getElementById('sidebar').style.display = 'none';
        document.querySelector('.lg\\:ml-64').style.marginLeft = '0';
    },

    showMainApp() {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('pageContent').classList.remove('hidden');
        // Show the sidebar and restore layout
        document.getElementById('sidebar').style.display = 'block';
        document.querySelector('.lg\\:ml-64').style.marginLeft = '';

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
        console.log(`Loading page: ${page}`);

        try {
            utils.showLoading(true);

            // Get page module
            const pageModule = this.getPageModule(page);
            if (!pageModule) {
                throw new Error(`Page module for '${page}' not found`);
            }

            console.log(`Page module found for: ${page}`);

            // Render page
            const pageHtml = pageModule.render();
            console.log(`Page HTML rendered for: ${page}`);
            pageContent.innerHTML = pageHtml;

            // Initialize page
            if (pageModule.init) {
                console.log(`Initializing page: ${page}`);
                await pageModule.init();
                console.log(`Page initialized: ${page}`);
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
        console.log(`Getting page module for: ${page}`);
        
        switch (page) {
            case 'dashboard':
                console.log('Dashboard module:', typeof dashboard);
                return window.dashboard || dashboard;
            case 'applications':
                console.log('Applications module:', typeof applications);
                return window.applications || applications;
            case 'cards':
                console.log('Cards module:', typeof cards);
                return window.cards || cards;
            case 'history':
                console.log('History module:', typeof history);
                return window.history || history;
            case 'reports':
                console.log('Reports module:', typeof reports);
                return window.reports || reports;
            default:
                console.log(`No module found for page: ${page}`);
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
