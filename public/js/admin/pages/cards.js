// Cards Page Module
const cards = {
    data: {
        cards: [],
        currentPage: 1,
        filters: {
            status: '',
            search: ''
        }
    },

    render() {
        return `
            <!-- Header Section -->
            <div class="bg-white rounded-lg shadow-md mb-6">
                <div class="p-6 border-b">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h3 class="text-lg font-semibold">Manajemen Kartu Visitor</h3>
                        <div class="flex flex-col sm:flex-row gap-3">
                            <button onclick="cards.showApprovedApplications()" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">
                                <i class="fas fa-plus mr-2"></i>
                                Serahkan Kartu
                            </button>
                            <button onclick="cards.exportReport()" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200">
                                <i class="fas fa-download mr-2"></i>
                                Export Laporan
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Filter Section -->
                <div class="p-6 border-b">
                    <div class="flex flex-col md:flex-row gap-4">
                        <select id="cardStatusFilter" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Semua Status</option>
                            <option value="issued">Aktif</option>
                            <option value="returned">Dikembalikan</option>
                            <option value="damaged">Rusak</option>
                            <option value="lost">Hilang</option>
                        </select>
                        <input type="text" id="searchCards" placeholder="Cari nama, nomor kartu..."
                               class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <button onclick="cards.loadCards()" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">
                            <i class="fas fa-search mr-2"></i>Cari
                        </button>
                    </div>
                </div>

                <!-- Summary Cards -->
                <div class="p-6 border-b">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <div class="flex items-center">
                                <i class="fas fa-id-card text-blue-600 mr-3"></i>
                                <div>
                                    <p class="text-sm text-blue-600">Kartu Aktif</p>
                                    <p id="activeCardsCount" class="text-xl font-bold text-blue-700">-</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg">
                            <div class="flex items-center">
                                <i class="fas fa-undo text-green-600 mr-3"></i>
                                <div>
                                    <p class="text-sm text-green-600">Dikembalikan</p>
                                    <p id="returnedCardsCount" class="text-xl font-bold text-green-700">-</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-red-50 p-4 rounded-lg">
                            <div class="flex items-center">
                                <i class="fas fa-exclamation-triangle text-red-600 mr-3"></i>
                                <div>
                                    <p class="text-sm text-red-600">Rusak</p>
                                    <p id="damagedCardsCount" class="text-xl font-bold text-red-700">-</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <div class="flex items-center">
                                <i class="fas fa-search text-gray-600 mr-3"></i>
                                <div>
                                    <p class="text-sm text-gray-600">Hilang</p>
                                    <p id="lostCardsCount" class="text-xl font-bold text-gray-700">-</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cards Table -->
                <div id="cardsTableContainer" class="overflow-x-auto">
                    <div class="min-h-96 flex items-center justify-center">
                        <div class="text-center">
                            <i class="fas fa-spinner fa-spin text-3xl text-gray-400 mb-4"></i>
                            <p class="text-gray-600">Loading cards...</p>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div id="cardsPagination" class="p-6 border-t">
                    <!-- Pagination will be rendered here -->
                </div>
            </div>
        `;
    },

    async init() {
        this.setupEventListeners();
        await this.loadCards();
        await this.loadSummary();
    },

    setupEventListeners() {
        // Search input with debounce
        const searchInput = document.getElementById('searchCards');
        if (searchInput) {
            searchInput.addEventListener('input', utils.debounce(() => {
                this.data.filters.search = searchInput.value;
                this.data.currentPage = 1;
                this.loadCards();
            }, 500));
        }

        // Status filter
        const statusFilter = document.getElementById('cardStatusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this.data.filters.status = statusFilter.value;
                this.data.currentPage = 1;
                this.loadCards();
            });
        }
    },

    async loadCards(page = 1) {
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

            const response = await api.get(`/admin/cards?${params.toString()}`);

            if (response.success) {
                this.data.cards = response.data.data;
                this.data.currentPage = page;
                this.renderCardsTable(response.data);
            }
        } catch (error) {
            console.error('Error loading cards:', error);
            utils.showAlert('Error loading cards', 'error');
        } finally {
            utils.showLoading(false);
        }
    },

    async loadSummary() {
        try {
            const response = await api.get('/admin/cards');
            if (response.success) {
                const cards = response.data.data;
                this.updateSummaryCards(cards);
            }
        } catch (error) {
            console.error('Error loading summary:', error);
        }
    },

    updateSummaryCards(cards) {
        const counts = {
            issued: 0,
            returned: 0,
            damaged: 0,
            lost: 0
        };

        cards.forEach(card => {
            if (counts.hasOwnProperty(card.status)) {
                counts[card.status]++;
            }
        });

        document.getElementById('activeCardsCount').textContent = utils.formatNumber(counts.issued);
        document.getElementById('returnedCardsCount').textContent = utils.formatNumber(counts.returned);
        document.getElementById('damagedCardsCount').textContent = utils.formatNumber(counts.damaged);
        document.getElementById('lostCardsCount').textContent = utils.formatNumber(counts.lost);
    },

    renderCardsTable(data) {
        const container = document.getElementById('cardsTableContainer');

        if (!data.data || data.data.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-id-card text-4xl text-gray-400 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Tidak ada kartu</h3>
                    <p class="text-gray-600">Belum ada kartu yang sesuai dengan filter</p>
                </div>
            `;
            return;
        }

        const tableHtml = `
            <table class="min-w-full divide-y divide-gray-200">
                ${utils.createTableHeader([
                    'No. Kartu',
                    'Nama Pemohon',
                    'Instansi',
                    'Tanggal Pinjam',
                    'Tanggal Kembali',
                    'Status',
                    'Kondisi',
                    'Aksi'
                ])}
                <tbody class="bg-white divide-y divide-gray-200">
                    ${data.data.map(card => this.renderCardRow(card)).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = tableHtml;

        // Render pagination
        document.getElementById('cardsPagination').innerHTML =
            utils.createPagination(data, 'cards.loadCards');
    },

    renderCardRow(card) {
        const visitEndDate = new Date(card.application.visit_end_date);
        const today = new Date();
        const isOverdue = card.status === 'issued' && visitEndDate < today;

        return `
            <tr class="hover:bg-gray-50 transition duration-200 ${isOverdue ? 'bg-red-50' : ''}">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${card.card_number}
                    ${isOverdue ? '<span class="ml-2 text-xs text-red-600">(Terlambat)</span>' : ''}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                        <div class="text-sm font-medium text-gray-900">${card.application.full_name}</div>
                        <div class="text-sm text-gray-500">${card.application.phone_number}</div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${card.application.company_institution}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${utils.formatDate(card.issued_at)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${card.returned_at ? utils.formatDate(card.returned_at) : utils.formatDate(card.application.visit_end_date)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${utils.getStatusBadgeClass(card.status)}">
                        ${utils.getStatusText(card.status)}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${card.condition_when_returned ? utils.getConditionText(card.condition_when_returned) : 'Baik'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                        ${card.status === 'issued' ? `
                            <button onclick="cards.returnCard(${card.id})"
                                    class="text-green-600 hover:text-green-900 transition duration-200" title="Terima Kartu">
                                <i class="fas fa-undo"></i>
                            </button>
                            <button onclick="cards.markDamaged(${card.id})"
                                    class="text-red-600 hover:text-red-900 transition duration-200" title="Tandai Rusak">
                                <i class="fas fa-exclamation-triangle"></i>
                            </button>
                            <button onclick="cards.markLost(${card.id})"
                                    class="text-gray-600 hover:text-gray-900 transition duration-200" title="Tandai Hilang">
                                <i class="fas fa-search"></i>
                            </button>
                        ` : `
                            <button onclick="cards.showHistory(${card.id})"
                                    class="text-blue-600 hover:text-blue-900 transition duration-200" title="Lihat Riwayat">
                                <i class="fas fa-history"></i>
                            </button>
                        `}
                    </div>
                </td>
            </tr>
        `;
    },

    async showApprovedApplications() {
        try {
            const response = await api.get('/admin/cards/approved-applications');
            if (response.success) {
                const applications = response.data;

                if (applications.length === 0) {
                    utils.showAlert('Tidak ada pengajuan yang disetujui untuk diserahkan kartu', 'info');
                    return;
                }

                modals.showApprovedApplications(applications);
            }
        } catch (error) {
            console.error('Error loading approved applications:', error);
            utils.showAlert('Error loading approved applications', 'error');
        }
    },

    async issueCard(applicationId) {
        try {
            utils.showLoading(true);
            const response = await api.post('/admin/cards/issue', { application_id: applicationId });

            if (response.success) {
                utils.showAlert('Kartu berhasil diserahkan', 'success');
                modals.closeModal();
                this.loadCards(this.data.currentPage);
                this.loadSummary();
            } else {
                utils.showAlert('Error: ' + response.message, 'error');
            }
        } catch (error) {
            utils.showAlert('Error: ' + error.message, 'error');
        } finally {
            utils.showLoading(false);
        }
    },

    returnCard(cardId) {
        modals.showReturnCardModal(cardId);
    },

    async processReturn(cardId, formData) {
        try {
            utils.showLoading(true);
            const response = await api.post(`/admin/cards/${cardId}/return`, formData);

            if (response.success) {
                utils.showAlert('Kartu berhasil diterima kembali', 'success');
                modals.closeModal();
                this.loadCards(this.data.currentPage);
                this.loadSummary();
            } else {
                utils.showAlert('Error: ' + response.message, 'error');
            }
        } catch (error) {
            utils.showAlert('Error: ' + error.message, 'error');
        } finally {
            utils.showLoading(false);
        }
    },

    async markDamaged(cardId) {
        const reason = prompt('Alasan kerusakan:');
        const handling = prompt('Penanganan:');

        if (reason && handling) {
            try {
                utils.showLoading(true);
                const response = await api.post(`/admin/cards/${cardId}/mark-damaged`, { reason, handling });

                if (response.success) {
                    utils.showAlert('Kartu berhasil ditandai rusak', 'success');
                    this.loadCards(this.data.currentPage);
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

    async markLost(cardId) {
        const reason = prompt('Alasan kehilangan:');
        const handling = prompt('Penanganan:');

        if (reason && handling) {
            try {
                utils.showLoading(true);
                const response = await api.post(`/admin/cards/${cardId}/mark-lost`, { reason, handling });

                if (response.success) {
                    utils.showAlert('Kartu berhasil ditandai hilang', 'success');
                    this.loadCards(this.data.currentPage);
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

    async showHistory(cardId) {
        try {
            const response = await api.get(`/admin/cards/${cardId}/history`);
            if (response.success) {
                modals.showCardHistory(response.data);
            }
        } catch (error) {
            console.error('Error loading card history:', error);
            utils.showAlert('Error loading card history', 'error');
        }
    },

    exportReport() {
        const today = new Date().toISOString().split('T')[0];
        const filename = `laporan-kartu-visitor-${today}.xlsx`;
        utils.exportReport('/admin/reports/export/card-issuance', filename, {
            period: 'monthly',
            date: today
        });
    }
};
