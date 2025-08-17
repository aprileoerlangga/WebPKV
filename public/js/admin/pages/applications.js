// Applications Page Module
const applications = {
    data: {
        applications: [],
        currentPage: 1,
        filters: {
            status: '',
            search: ''
        }
    },

    render() {
        return `
            <!-- Filter and Search Section -->
            <div class="bg-white rounded-lg shadow-md mb-6">
                <div class="p-6 border-b">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h3 class="text-lg font-semibold">Verifikasi & Persetujuan</h3>
                        <div class="flex flex-col sm:flex-row gap-3">
                            <select id="statusFilter" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Semua Status</option>
                                <option value="pending">Menunggu</option>
                                <option value="approved">Disetujui</option>
                                <option value="rejected">Ditolak</option>
                                <option value="cancelled">Dibatalkan</option>
                            </select>
                            <input type="text" id="searchApplications" placeholder="Cari nama, nomor pengajuan..."
                                   class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <button onclick="applications.loadApplications()" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">
                                <i class="fas fa-search mr-2"></i>Cari
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Summary Cards -->
                <div class="p-6 border-b">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div class="bg-yellow-50 p-4 rounded-lg">
                            <div class="flex items-center">
                                <i class="fas fa-clock text-yellow-600 mr-3"></i>
                                <div>
                                    <p class="text-sm text-yellow-600">Menunggu</p>
                                    <p id="pendingCount" class="text-xl font-bold text-yellow-700">-</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg">
                            <div class="flex items-center">
                                <i class="fas fa-check text-green-600 mr-3"></i>
                                <div>
                                    <p class="text-sm text-green-600">Disetujui</p>
                                    <p id="approvedCount" class="text-xl font-bold text-green-700">-</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-red-50 p-4 rounded-lg">
                            <div class="flex items-center">
                                <i class="fas fa-times text-red-600 mr-3"></i>
                                <div>
                                    <p class="text-sm text-red-600">Ditolak</p>
                                    <p id="rejectedCount" class="text-xl font-bold text-red-700">-</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <div class="flex items-center">
                                <i class="fas fa-ban text-gray-600 mr-3"></i>
                                <div>
                                    <p class="text-sm text-gray-600">Dibatalkan</p>
                                    <p id="cancelledCount" class="text-xl font-bold text-gray-700">-</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Applications Table -->
                <div id="applicationsTableContainer" class="overflow-x-auto">
                    <div class="min-h-96 flex items-center justify-center">
                        <div class="text-center">
                            <i class="fas fa-spinner fa-spin text-3xl text-gray-400 mb-4"></i>
                            <p class="text-gray-600">Loading applications...</p>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div id="applicationsPagination" class="p-6 border-t">
                    <!-- Pagination will be rendered here -->
                </div>
            </div>
        `;
    },

    async init() {
        this.setupEventListeners();
        await this.loadApplications();
        await this.loadSummary();
    },

    setupEventListeners() {
        // Search input with debounce
        const searchInput = document.getElementById('searchApplications');
        if (searchInput) {
            searchInput.addEventListener('input', utils.debounce(() => {
                this.data.filters.search = searchInput.value;
                this.data.currentPage = 1;
                this.loadApplications();
            }, 500));
        }

        // Status filter
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this.data.filters.status = statusFilter.value;
                this.data.currentPage = 1;
                this.loadApplications();
            });
        }
    },

    async loadApplications(page = 1) {
        try {
            utils.showLoading(true);

            const params = new URLSearchParams({
                page: page,
                ...this.data.filters
            });

            // Remove empty filters
            for (let [key, value] of params.entries()) {
                if (!value) params.delete(key);
            }

            const response = await api.get(`/admin/applications?${params.toString()}`);

            if (response.success) {
                this.data.applications = response.data.data;
                this.data.currentPage = page;
                this.renderApplicationsTable(response.data);
            }
        } catch (error) {
            console.error('Error loading applications:', error);
            utils.showAlert('Error loading applications', 'error');
        } finally {
            utils.showLoading(false);
        }
    },

    async loadSummary() {
        try {
            const response = await api.get('/admin/applications');
            if (response.success) {
                const applications = response.data.data;
                this.updateSummaryCards(applications);
            }
        } catch (error) {
            console.error('Error loading summary:', error);
        }
    },

    updateSummaryCards(applications) {
        const counts = {
            pending: 0,
            approved: 0,
            rejected: 0,
            cancelled: 0
        };

        applications.forEach(app => {
            if (counts.hasOwnProperty(app.status)) {
                counts[app.status]++;
            }
        });

        document.getElementById('pendingCount').textContent = utils.formatNumber(counts.pending);
        document.getElementById('approvedCount').textContent = utils.formatNumber(counts.approved);
        document.getElementById('rejectedCount').textContent = utils.formatNumber(counts.rejected);
        document.getElementById('cancelledCount').textContent = utils.formatNumber(counts.cancelled);
    },

    renderApplicationsTable(data) {
        const container = document.getElementById('applicationsTableContainer');

        if (!data.data || data.data.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Tidak ada pengajuan</h3>
                    <p class="text-gray-600">Belum ada pengajuan yang sesuai dengan filter</p>
                </div>
            `;
            return;
        }

        const tableHtml = `
            <table class="min-w-full divide-y divide-gray-200">
                ${utils.createTableHeader([
                    'No. Pengajuan',
                    'Nama Pemohon',
                    'Instansi',
                    'Jenis Kunjungan',
                    'Tanggal Kunjungan',
                    'Stasiun',
                    'Status',
                    'Aksi'
                ])}
                <tbody class="bg-white divide-y divide-gray-200">
                    ${data.data.map(app => this.renderApplicationRow(app)).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = tableHtml;

        // Render pagination
        document.getElementById('applicationsPagination').innerHTML =
            utils.createPagination(data, 'applications.loadApplications');
    },

    renderApplicationRow(app) {
        return `
            <tr class="hover:bg-gray-50 transition duration-200">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${app.application_number}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                        <div class="text-sm font-medium text-gray-900">${app.full_name}</div>
                        <div class="text-sm text-gray-500">${app.email}</div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${app.company_institution}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span class="px-2 py-1 text-xs rounded-full ${app.visit_type === 'regular' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}">
                        ${app.visit_type === 'regular' ? 'Regular' : 'Extended'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${utils.formatDate(app.visit_start_date)} - ${utils.formatDate(app.visit_end_date)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${app.station.name}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${utils.getStatusBadgeClass(app.status)}">
                        ${utils.getStatusText(app.status)}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                        <button onclick="applications.showDetail(${app.id})"
                                class="text-blue-600 hover:text-blue-900 transition duration-200" title="Lihat Detail">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${app.status === 'pending' ? `
                            <button onclick="applications.approve(${app.id})"
                                    class="text-green-600 hover:text-green-900 transition duration-200" title="Setujui">
                                <i class="fas fa-check"></i>
                            </button>
                            <button onclick="applications.reject(${app.id})"
                                    class="text-red-600 hover:text-red-900 transition duration-200" title="Tolak">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    },

    async showDetail(applicationId) {
        try {
            const response = await api.get(`/admin/applications/${applicationId}`);
            if (response.success) {
                modals.showApplicationDetail(response.data);
            }
        } catch (error) {
            console.error('Error loading application detail:', error);
            utils.showAlert('Error loading application detail', 'error');
        }
    },

    async approve(applicationId) {
        const notes = prompt('Catatan persetujuan (opsional):');
        if (notes !== null) {
            try {
                utils.showLoading(true);
                const response = await api.post(`/admin/applications/${applicationId}/approve`, { notes });

                if (response.success) {
                    utils.showAlert('Pengajuan berhasil disetujui', 'success');
                    this.loadApplications(this.data.currentPage);
                    this.loadSummary();
                } else {
                    utils.showAlert('Error: ' + response.message, 'error');
                }
            } catch (error) {
                utils.showAlert('Error: ' + error.message, 'error');
            } finally {
                utils.showLoading(false);
            }
        }
    },

    async reject(applicationId) {
        const reason = prompt('Alasan penolakan:');
        if (reason && reason.trim()) {
            try {
                utils.showLoading(true);
                const response = await api.post(`/admin/applications/${applicationId}/reject`, { reason });

                if (response.success) {
                    utils.showAlert('Pengajuan berhasil ditolak', 'success');
                    this.loadApplications(this.data.currentPage);
                    this.loadSummary();
                } else {
                    utils.showAlert('Error: ' + response.message, 'error');
                }
            } catch (error) {
                utils.showAlert('Error: ' + error.message, 'error');
            } finally {
                utils.showLoading(false);
            }
        }
    }
};
