// Dashboard Page Module
const dashboard = {
    data: {
        stats: null
    },

    render() {
        return `
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                            <i class="fas fa-users text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Pengunjung Aktif</p>
                            <p id="activeVisitors" class="text-2xl font-bold text-blue-600">-</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                            <i class="fas fa-clock text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Menunggu Verifikasi</p>
                            <p id="pendingApplications" class="text-2xl font-bold text-yellow-600">-</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-green-100 text-green-600">
                            <i class="fas fa-arrow-up text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Kartu Masuk Hari Ini</p>
                            <p id="cardsIssuedToday" class="text-2xl font-bold text-green-600">-</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-purple-100 text-purple-600">
                            <i class="fas fa-arrow-down text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Kartu Keluar Hari Ini</p>
                            <p id="cardsReturnedToday" class="text-2xl font-bold text-purple-600">-</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-red-100 text-red-600">
                            <i class="fas fa-exclamation-triangle text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Kartu Rusak</p>
                            <p id="damagedCards" class="text-2xl font-bold text-red-600">-</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-gray-100 text-gray-600">
                            <i class="fas fa-search text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Kartu Hilang</p>
                            <p id="lostCards" class="text-2xl font-bold text-gray-600">-</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button onclick="navigateTo('applications')" class="flex items-center justify-center p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition duration-200">
                        <i class="fas fa-file-alt mr-2"></i>
                        Verifikasi Pengajuan
                    </button>
                    <button onclick="navigateTo('cards')" class="flex items-center justify-center p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition duration-200">
                        <i class="fas fa-id-card mr-2"></i>
                        Kelola Kartu
                    </button>
                    <button onclick="navigateTo('reports')" class="flex items-center justify-center p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition duration-200">
                        <i class="fas fa-chart-bar mr-2"></i>
                        Lihat Laporan
                    </button>
                    <button onclick="navigateTo('history')" class="flex items-center justify-center p-4 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition duration-200">
                        <i class="fas fa-history mr-2"></i>
                        Riwayat Pengembalian
                    </button>
                </div>
            </div>

            <!-- Recent Activities -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Recent Applications -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold">Pengajuan Terbaru</h3>
                        <button onclick="navigateTo('applications')" class="text-blue-600 hover:text-blue-800 text-sm">
                            Lihat Semua →
                        </button>
                    </div>
                    <div id="recentApplications" class="space-y-3">
                        <!-- Recent applications will be loaded here -->
                    </div>
                </div>

                <!-- Recent Card Activities -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold">Aktivitas Kartu Terbaru</h3>
                        <button onclick="navigateTo('cards')" class="text-blue-600 hover:text-blue-800 text-sm">
                            Lihat Semua →
                        </button>
                    </div>
                    <div id="recentCards" class="space-y-3">
                        <!-- Recent card activities will be loaded here -->
                    </div>
                </div>
            </div>
        `;
    },

    async init() {
        await this.loadStats();
        await this.loadRecentActivities();
        this.startAutoRefresh();
    },

    async loadStats() {
        try {
            const response = await api.get('/admin/dashboard');
            if (response.success) {
                this.data.stats = response.data;
                this.updateStatsDisplay();
            }
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
            utils.showAlert('Error loading dashboard statistics', 'error');
        }
    },

    updateStatsDisplay() {
        if (!this.data.stats) return;

        const stats = this.data.stats;
        document.getElementById('activeVisitors').textContent = utils.formatNumber(stats.active_visitors);
        document.getElementById('pendingApplications').textContent = utils.formatNumber(stats.pending_applications);
        document.getElementById('cardsIssuedToday').textContent = utils.formatNumber(stats.cards_issued_today);
        document.getElementById('cardsReturnedToday').textContent = utils.formatNumber(stats.cards_returned_today);
        document.getElementById('damagedCards').textContent = utils.formatNumber(stats.damaged_cards);
        document.getElementById('lostCards').textContent = utils.formatNumber(stats.lost_cards);
    },

    async loadRecentActivities() {
        await Promise.all([
            this.loadRecentApplications(),
            this.loadRecentCards()
        ]);
    },

    async loadRecentApplications() {
        try {
            const response = await api.get('/admin/applications?limit=5');
            if (response.success) {
                this.renderRecentApplications(response.data.data);
            }
        } catch (error) {
            console.error('Error loading recent applications:', error);
            document.getElementById('recentApplications').innerHTML = `
                <div class="text-center text-gray-500 py-4">
                    <i class="fas fa-exclamation-triangle mb-2"></i>
                    <p>Error loading recent applications</p>
                </div>
            `;
        }
    },

    async loadRecentCards() {
        try {
            const response = await api.get('/admin/cards?limit=5');
            if (response.success) {
                this.renderRecentCards(response.data.data);
            }
        } catch (error) {
            console.error('Error loading recent cards:', error);
            document.getElementById('recentCards').innerHTML = `
                <div class="text-center text-gray-500 py-4">
                    <i class="fas fa-exclamation-triangle mb-2"></i>
                    <p>Error loading recent card activities</p>
                </div>
            `;
        }
    },

    renderRecentApplications(applications) {
        const container = document.getElementById('recentApplications');

        if (!applications || applications.length === 0) {
            container.innerHTML = `
                <div class="text-center text-gray-500 py-4">
                    <i class="fas fa-inbox mb-2"></i>
                    <p>Tidak ada pengajuan terbaru</p>
                </div>
            `;
            return;
        }

        const html = applications.map(app => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex-1">
                    <div class="flex items-center">
                        <span class="font-medium text-gray-900">${app.full_name}</span>
                        <span class="ml-2 px-2 py-1 text-xs rounded-full ${utils.getStatusBadgeClass(app.status)}">
                            ${utils.getStatusText(app.status)}
                        </span>
                    </div>
                    <p class="text-sm text-gray-600">${app.application_number} • ${app.station.name}</p>
                    <p class="text-xs text-gray-500">${utils.formatDateTime(app.created_at)}</p>
                </div>
                <button onclick="applications.showDetail(${app.id})" class="text-blue-600 hover:text-blue-800">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        `).join('');

        container.innerHTML = html;
    },

    renderRecentCards(cards) {
        const container = document.getElementById('recentCards');

        if (!cards || cards.length === 0) {
            container.innerHTML = `
                <div class="text-center text-gray-500 py-4">
                    <i class="fas fa-inbox mb-2"></i>
                    <p>Tidak ada aktivitas kartu terbaru</p>
                </div>
            `;
            return;
        }

        const html = cards.map(card => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex-1">
                    <div class="flex items-center">
                        <span class="font-medium text-gray-900">${card.application.full_name}</span>
                        <span class="ml-2 px-2 py-1 text-xs rounded-full ${utils.getStatusBadgeClass(card.status)}">
                            ${utils.getStatusText(card.status)}
                        </span>
                    </div>
                    <p class="text-sm text-gray-600">${card.card_number}</p>
                    <p class="text-xs text-gray-500">${utils.formatDateTime(card.issued_at)}</p>
                </div>
                <div class="text-right">
                    <i class="fas fa-id-card text-gray-400"></i>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    },

    startAutoRefresh() {
        // Refresh stats every 30 seconds
        setInterval(() => {
            if (app.currentPage === 'dashboard') {
                this.loadStats();
            }
        }, 30000);
    },

    destroy() {
        // Clean up any intervals or event listeners
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }
};
