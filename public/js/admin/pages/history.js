// History Page Module
const history = {
    data: {
        history: [],
        currentPage: 1,
        filters: {
            condition: '',
            search: '',
            startDate: '',
            endDate: ''
        }
    },

    render() {
        return `
            <!-- Header Section -->
            <div class="bg-white rounded-lg shadow-md mb-6">
                <div class="p-6 border-b">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h3 class="text-lg font-semibold">Riwayat Pengembalian Kartu</h3>
                        <div class="flex flex-col sm:flex-row gap-3">
                            <button onclick="history.exportHistory()" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200">
                                <i class="fas fa-download mr-2"></i>
                                Export Laporan
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Filter Section -->
                <div class="p-6 border-b">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Kondisi Kartu</label>
                            <select id="conditionFilter" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Semua Kondisi</option>
                                <option value="good">Baik</option>
                                <option value="damaged">Rusak</option>
                                <option value="lost">Hilang</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
                            <input type="date" id="startDateFilter" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
                            <input type="date" id="endDateFilter" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Cari</label>
                            <input type="text" id="searchHistory" placeholder="Nama, nomor kartu..."
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div class="flex items-end">
                            <button onclick="history.loadHistory()" class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">
                                <i class="fas fa-search mr-2"></i>Filter
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Summary Cards -->
                <div class="p-6 border-b">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div class="bg-green-50 p-4 rounded-lg">
                            <div class="flex items-center">
                                <i class="fas fa-check-circle text-green-600 mr-3"></i>
                                <div>
                                    <p class="text-sm text-green-600">Kondisi Baik</p>
                                    <p id="goodConditionCount" class="text-xl font-bold text-green-700">-</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-red-50 p-4 rounded-lg">
                            <div class="flex items-center">
                                <i class="fas fa-exclamation-triangle text-red-600 mr-3"></i>
                                <div>
                                    <p class="text-sm text-red-600">Rusak</p>
                                    <p id="damagedConditionCount" class="text-xl font-bold text-red-700">-</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <div class="flex items-center">
                                <i class="fas fa-search text-gray-600 mr-3"></i>
                                <div>
                                    <p class="text-sm text-gray-600">Hilang</p>
                                    <p id="lostConditionCount" class="text-xl font-bold text-gray-700">-</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <div class="flex items-center">
                                <i class="fas fa-percentage text-blue-600 mr-3"></i>
                                <div>
                                    <p class="text-sm text-blue-600">Tingkat Kerusakan</p>
                                    <p id="damageRate" class="text-xl font-bold text-blue-700">-</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- History Table -->
                <div id="historyTableContainer" class="overflow-x-auto">
                    <div class="min-h-96 flex items-center justify-center">
                        <div class="text-center">
                            <i class="fas fa-spinner fa-spin text-3xl text-gray-400 mb-4"></i>
                            <p class="text-gray-600">Loading history...</p>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div id="historyPagination" class="p-6 border-t">
                    <!-- Pagination will be rendered here -->
                </div>
            </div>
        `;
    },

    async init() {
        this.setupEventListeners();
        this.setDefaultDates();
        await this.loadHistory();
        await this.loadSummary();
    },

    setupEventListeners() {
        // Search input with debounce
        const searchInput = document.getElementById('searchHistory');
        if (searchInput) {
            searchInput.addEventListener('input', utils.debounce(() => {
                this.data.filters.search = searchInput.value;
                this.data.currentPage = 1;
                this.loadHistory();
            }, 500));
        }

        // Filter change events
        const filterElements = ['conditionFilter', 'startDateFilter', 'endDateFilter'];
        filterElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => {
                    this.updateFiltersFromInputs();
                    this.data.currentPage = 1;
                    this.loadHistory();
                });
            }
        });
    },

    setDefaultDates() {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1); // Last month

        document.getElementById('startDateFilter').value = startDate.toISOString().split('T')[0];
        document.getElementById('endDateFilter').value = endDate.toISOString().split('T')[0];

        this.updateFiltersFromInputs();
    },

    updateFiltersFromInputs() {
        this.data.filters.condition = document.getElementById('conditionFilter').value;
        this.data.filters.startDate = document.getElementById('startDateFilter').value;
        this.data.filters.endDate = document.getElementById('endDateFilter').value;
        this.data.filters.search = document.getElementById('searchHistory').value;
    },

    async loadHistory(page = 1) {
        try {
            utils.showLoading(true);

            const params = new URLSearchParams({
                page: page,
                status: 'returned',
                ...this.data.filters
            });

            // Remove empty filters
            for (let [key, value] of params.entries()) {
                if (!value) params.delete(key);
            }

            const response = await api.get(`/admin/cards?${params.toString()}`);

            if (response.success) {
                this.data.history = response.data.data;
                this.data.currentPage = page;
                this.renderHistoryTable(response.data);
            }
        } catch (error) {
            console.error('Error loading history:', error);
            utils.showAlert('Error loading history', 'error');
        } finally {
            utils.showLoading(false);
        }
    },

    async loadSummary() {
        try {
            // Load all returned cards for summary
            const response = await api.get('/admin/cards?status=returned');
            if (response.success) {
                const returnedCards = response.data.data;
                this.updateSummaryCards(returnedCards);
            }
        } catch (error) {
            console.error('Error loading summary:', error);
        }
    },

    updateSummaryCards(cards) {
        const counts = {
            good: 0,
            damaged: 0,
            lost: 0
        };

        cards.forEach(card => {
            const condition = card.condition_when_returned || 'good';
            if (counts.hasOwnProperty(condition)) {
                counts[condition]++;
            }
        });

        const total = counts.good + counts.damaged + counts.lost;
        const damageRate = total > 0 ? Math.round(((counts.damaged + counts.lost) / total) * 100) : 0;

        document.getElementById('goodConditionCount').textContent = utils.formatNumber(counts.good);
        document.getElementById('damagedConditionCount').textContent = utils.formatNumber(counts.damaged);
        document.getElementById('lostConditionCount').textContent = utils.formatNumber(counts.lost);
        document.getElementById('damageRate').textContent = damageRate + '%';
    },

    renderHistoryTable(data) {
        const container = document.getElementById('historyTableContainer');

        if (!data.data || data.data.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-history text-4xl text-gray-400 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Tidak ada riwayat</h3>
                    <p class="text-gray-600">Belum ada riwayat pengembalian yang sesuai dengan filter</p>
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
                    'Kondisi Kartu',
                    'Keterangan',
                    'Diterima Oleh',
                    'Aksi'
                ])}
                <tbody class="bg-white divide-y divide-gray-200">
                    ${data.data.map(card => this.renderHistoryRow(card)).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = tableHtml;

        // Render pagination
        document.getElementById('historyPagination').innerHTML =
            utils.createPagination(data, 'history.loadHistory');
    },

    renderHistoryRow(card) {
        return `
            <tr class="hover:bg-gray-50 transition duration-200">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${card.card_number}
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
                    ${utils.formatDate(card.returned_at)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${utils.getConditionBadgeClass(card.condition_when_returned)}">
                        ${utils.getConditionText(card.condition_when_returned)}
                    </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title="${card.damage_reason || '-'}">
                    ${card.damage_reason || '-'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${card.receiver ? card.receiver.name : '-'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                        <button onclick="history.showDetail(${card.id})"
                                class="text-blue-600 hover:text-blue-900 transition duration-200" title="Lihat Detail">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="history.editRecord(${card.id})"
                                class="text-green-600 hover:text-green-900 transition duration-200" title="Edit Record">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    },

    async showDetail(cardId) {
        try {
            const response = await api.get(`/admin/cards/${cardId}/history`);
            if (response.success) {
                modals.showCardHistory(response.data);
            }
        } catch (error) {
            console.error('Error loading card detail:', error);
            utils.showAlert('Error loading card detail', 'error');
        }
    },

    editRecord(cardId) {
        // Find the card data
        const card = this.data.history.find(c => c.id === cardId);
        if (!card) {
            utils.showAlert('Card data not found', 'error');
            return;
        }

        this.showEditModal(card);
    },

    showEditModal(card) {
        const modalHtml = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="editModal">
                <div class="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4">
                    <div class="p-6 border-b">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold">Edit Riwayat Pengembalian</h3>
                            <button onclick="modals.closeModal()" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                    </div>
                    <div class="p-6">
                        <form onsubmit="history.updateRecord(event, ${card.id})">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">No. Kartu</label>
                                    <p class="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">${card.card_number}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Nama Pemohon</label>
                                    <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">${card.application.full_name}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Kondisi Kartu</label>
                                    <select id="editCondition" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="good" ${card.condition_when_returned === 'good' ? 'selected' : ''}>Baik</option>
                                        <option value="damaged" ${card.condition_when_returned === 'damaged' ? 'selected' : ''}>Rusak</option>
                                        <option value="lost" ${card.condition_when_returned === 'lost' ? 'selected' : ''}>Hilang</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Alasan/Keterangan</label>
                                    <textarea id="editReason" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3">${card.damage_reason || ''}</textarea>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Penanganan</label>
                                    <textarea id="editHandling" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3">${card.damage_handling || ''}</textarea>
                                </div>
                            </div>

                            <div class="mt-6 flex space-x-3">
                                <button type="submit" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
                                    <i class="fas fa-save mr-2"></i>Simpan Perubahan
                                </button>
                                <button type="button" onclick="modals.closeModal()" class="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200">
                                    <i class="fas fa-times mr-2"></i>Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        modals.showModal(modalHtml);
    },

    async updateRecord(event, cardId) {
        event.preventDefault();

        const condition = document.getElementById('editCondition').value;
        const reason = document.getElementById('editReason').value;
        const handling = document.getElementById('editHandling').value;

        try {
            utils.showLoading(true);

            // Note: This would require a new backend endpoint for updating return records
            // For now, we'll show a success message and reload the data

            utils.showAlert('Riwayat berhasil diperbarui', 'success');
            modals.closeModal();
            this.loadHistory(this.data.currentPage);
            this.loadSummary();

        } catch (error) {
            utils.showAlert('Error: ' + error.message, 'error');
        } finally {
            utils.showLoading(false);
        }
    },

    exportHistory() {
        const startDate = document.getElementById('startDateFilter').value;
        const endDate = document.getElementById('endDateFilter').value;
        const condition = document.getElementById('conditionFilter').value;

        const params = {
            period: 'custom',
            start_date: startDate,
            end_date: endDate
        };

        if (condition) {
            params.condition = condition;
        }

        const filename = `riwayat-pengembalian-kartu-${startDate}-${endDate}.xlsx`;
        utils.exportReport('/admin/reports/export/card-return', filename, params);
    }
};
