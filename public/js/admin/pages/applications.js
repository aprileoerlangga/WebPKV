// Applications Page Module - Updated untuk sesuai dengan gambar
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
            <!-- Header with Search -->
            <div class="bg-white rounded-lg shadow-sm mb-6 p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Verifikasi & Persetujuan</h3>
                    <div class="flex items-center space-x-3">
                        <div class="relative">
                            <input type="text" id="searchApplications" placeholder="Cari berdasarkan nama pemohon"
                                   class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64">
                            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                        </div>
                        <span class="text-sm text-gray-600">Menunggu : <span id="pendingCount" class="font-semibold">3</span></span>
                    </div>
                </div>

                <!-- Applications Table -->
                <div id="applicationsTableContainer" class="overflow-x-auto">
                    <table class="min-w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pemohon</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Kunjungan</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Kunjungan</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stasiun Kunjungan</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dokumen</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="applicationsTableBody" class="bg-white divide-y divide-gray-200">
                            <!-- Data akan dimuat di sini -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    async init() {
        this.setupEventListeners();
        await this.loadApplications();
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
    },

    async loadApplications(page = 1) {
        try {
            // Untuk saat ini kita gunakan data mock sesuai gambar
            const mockData = [
                {
                    id: 1,
                    full_name: 'Azida Kautsar',
                    visit_type: 'Magang',
                    visit_start_date: '2025-08-08',
                    station: { name: 'St. Lempuyangan' },
                    has_document: true,
                    status: 'menunggu'
                },
                {
                    id: 2,
                    full_name: 'Milano Sitanggang',
                    visit_type: 'Vendor',
                    visit_start_date: '2025-08-09',
                    station: { name: 'St. Yogyakarta' },
                    has_document: false,
                    status: 'menunggu'
                },
                {
                    id: 3,
                    full_name: 'Maula Azkadina',
                    visit_type: 'Magang',
                    visit_start_date: '2025-08-09',
                    station: { name: 'St. Lempuyangan' },
                    has_document: false,
                    status: 'disetujui'
                },
                {
                    id: 4,
                    full_name: 'Yudhita Melka',
                    visit_type: 'Inspeksi',
                    visit_start_date: '2025-08-10',
                    station: { name: 'St. Solo Balapan' },
                    has_document: false,
                    status: 'disetujui'
                },
                {
                    id: 5,
                    full_name: 'Ahmad Arfan',
                    visit_type: 'Vendor',
                    visit_start_date: '2025-08-11',
                    station: { name: 'St. Klaten' },
                    has_document: false,
                    status: 'disetujui'
                },
                {
                    id: 6,
                    full_name: 'Gading Subagio',
                    visit_type: 'Inspeksi',
                    visit_start_date: '2025-08-11',
                    station: { name: 'St. Lempuyangan' },
                    has_document: false,
                    status: 'ditolak'
                }
            ];

            this.data.applications = mockData;
            this.renderApplicationsTable();
            this.updatePendingCount();

        } catch (error) {
            console.error('Error loading applications:', error);
            utils.showAlert('Error loading applications', 'error');
        }
    },

    updatePendingCount() {
        const pendingCount = this.data.applications.filter(app => app.status === 'menunggu').length;
        document.getElementById('pendingCount').textContent = pendingCount;
    },

    renderApplicationsTable() {
        const tbody = document.getElementById('applicationsTableBody');
        
        if (!this.data.applications || this.data.applications.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-12">
                        <i class="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
                        <p class="text-gray-600">Tidak ada pengajuan</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.data.applications.map(app => this.renderApplicationRow(app)).join('');
    },

    renderApplicationRow(app) {
        const statusColors = {
            'menunggu': 'bg-yellow-100 text-yellow-800',
            'disetujui': 'bg-green-100 text-green-800',
            'ditolak': 'bg-red-100 text-red-800'
        };

        const statusText = {
            'menunggu': 'Menunggu',
            'disetujui': 'Disetujui',
            'ditolak': 'Ditolak'
        };

        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${app.full_name}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${app.visit_type}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${utils.formatDate(app.visit_start_date)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${app.station.name}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${app.has_document ? 
                        '<span class="text-blue-600"><i class="fas fa-file-pdf mr-1"></i>Lihat</span>' : 
                        '<span class="text-gray-400">-</span>'
                    }
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${statusColors[app.status] || 'bg-gray-100 text-gray-800'}">
                        ${statusText[app.status] || app.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="applications.showDetail(${app.id})"
                            class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs transition duration-200">
                        Lihat Detail
                    </button>
                </td>
            </tr>
        `;
    },

    async showDetail(applicationId) {
        // Mencari data aplikasi berdasarkan ID
        const application = this.data.applications.find(app => app.id === applicationId);
        
        if (!application) {
            utils.showAlert('Data aplikasi tidak ditemukan', 'error');
            return;
        }

        // Mock data detail lengkap sesuai gambar
        const mockDetailData = {
            id: applicationId,
            full_name: application.full_name,
            application_number: `VST-2025-${String(applicationId).padStart(6, '0')}`,
            id_number: '350613243654600',
            email: 'azida@gmail.com',
            phone: '081234252611',
            company_institution: 'Politeknik Elektronika Negeri Surabaya',
            visit_start_date: '2025-08-08',
            visit_end_date: '2025-08-11',
            station: { name: 'Stasiun Lempuyangan' },
            visit_purpose: 'Melakukan observasi dan kegiatan magang di PT KAI',
            support_document: 'Proposal_Magang.pdf',
            status: application.status,
            status_text: application.status === 'menunggu' ? 'Menunggu Persetujuan' : 
                        application.status === 'disetujui' ? 'Disetujui' : 'Ditolak'
        };

        modals.showApplicationDetail(mockDetailData);
    },

    async approve(applicationId, officerName, notes) {
        try {
            // Update status di data mock
            const appIndex = this.data.applications.findIndex(app => app.id === applicationId);
            if (appIndex !== -1) {
                this.data.applications[appIndex].status = 'disetujui';
                this.renderApplicationsTable();
                this.updatePendingCount();
                utils.showAlert('Pengajuan berhasil disetujui', 'success');
            }
        } catch (error) {
            utils.showAlert('Error: ' + error.message, 'error');
        }
    },

    async reject(applicationId, officerName, reason) {
        try {
            // Update status di data mock
            const appIndex = this.data.applications.findIndex(app => app.id === applicationId);
            if (appIndex !== -1) {
                this.data.applications[appIndex].status = 'ditolak';
                this.renderApplicationsTable();
                this.updatePendingCount();
                utils.showAlert('Pengajuan berhasil ditolak', 'success');
            }
        } catch (error) {
            utils.showAlert('Error: ' + error.message, 'error');
        }
    }
};
