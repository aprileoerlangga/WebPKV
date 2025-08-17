// Dashboard Page Module - Updated untuk sesuai dengan gambar
const dashboard = {
    data: {
        stats: null
    },

    render() {
        return `
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div class="bg-white rounded-lg shadow-sm p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">Total Aktif</p>
                            <p id="activeVisitors" class="text-3xl font-bold text-gray-900">20</p>
                        </div>
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-users text-blue-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-sm p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">Menunggu Verifikasi</p>
                            <p id="pendingApplications" class="text-3xl font-bold text-gray-900">5</p>
                        </div>
                        <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-clock text-yellow-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-sm p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">Total Kartu Masuk Hari Ini</p>
                            <p id="cardsIssuedToday" class="text-3xl font-bold text-gray-900">10</p>
                        </div>
                        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-id-card text-green-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-sm p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">Total Kartu Keluar Hari Ini</p>
                            <p id="cardsReturnedToday" class="text-3xl font-bold text-gray-900">5</p>
                        </div>
                        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-sign-out-alt text-purple-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-sm p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">Total Kartu Rusak</p>
                            <p id="damagedCards" class="text-3xl font-bold text-gray-900">5</p>
                        </div>
                        <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-sm p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">Kartu Hilang</p>
                            <p id="lostCards" class="text-3xl font-bold text-gray-900">2</p>
                        </div>
                        <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-question-circle text-orange-600 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    async init() {
        await this.loadStats();
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
            // Use default values shown in the render method
        }
    },

    updateStatsDisplay() {
        if (!this.data.stats) return;

        const stats = this.data.stats;
        document.getElementById('activeVisitors').textContent = utils.formatNumber(stats.active_visitors || 20);
        document.getElementById('pendingApplications').textContent = utils.formatNumber(stats.pending_applications || 5);
        document.getElementById('cardsIssuedToday').textContent = utils.formatNumber(stats.cards_issued_today || 10);
        document.getElementById('cardsReturnedToday').textContent = utils.formatNumber(stats.cards_returned_today || 5);
        document.getElementById('damagedCards').textContent = utils.formatNumber(stats.damaged_cards || 5);
        document.getElementById('lostCards').textContent = utils.formatNumber(stats.lost_cards || 2);
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
