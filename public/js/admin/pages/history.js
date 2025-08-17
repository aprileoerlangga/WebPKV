// History Page Module - Updated sesuai dengan gambar
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
            <!-- Header with Search and Export -->
            <div class="bg-white rounded-lg shadow-sm mb-6 p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Riwayat Pengembalian</h3>
                    <div class="flex items-center space-x-3">
                        <div class="relative">
                            <input type="text" id="searchHistory" placeholder="Cari berdasarkan nama pemohon"
                                   class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64">
                            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                        </div>
                        <button onclick="history.exportHistory()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                            <i class="fas fa-download mr-2"></i>Export Laporan
                        </button>
                    </div>
                </div>

                <!-- History Table -->
                <div id="historyTableContainer" class="overflow-x-auto">
                    <table class="min-w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pemohon</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Pinjam</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Kembali</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kondisi Kartu</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="historyTableBody" class="bg-white divide-y divide-gray-200">
                            <!-- Data akan dimuat di sini -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    async init() {
        this.setupEventListeners();
        await this.loadHistory();
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
    },

    async loadHistory(page = 1) {
        try {
            // Mock data sesuai gambar
            const mockData = [
                {
                    id: 1,
                    full_name: 'Azida Kautsar',
                    tanggal_pinjam: '04 Agustus 2025',
                    tanggal_kembali: '08 Agustus 2025',
                    kondisi_kartu: 'Baik',
                    keterangan: 'Selesai'
                },
                {
                    id: 2,
                    full_name: 'Milano Sitanggang',
                    tanggal_pinjam: '05 Agustus 2025',
                    tanggal_kembali: '08 Agustus 2025',
                    kondisi_kartu: 'Hilang',
                    keterangan: 'Selesai'
                },
                {
                    id: 3,
                    full_name: 'Azka Mauladina',
                    tanggal_pinjam: '03 Agustus 2025',
                    tanggal_kembali: '08 Agustus 2025',
                    kondisi_kartu: 'Hilang',
                    keterangan: 'Selesai'
                },
                {
                    id: 4,
                    full_name: 'Yudhita Melka',
                    tanggal_pinjam: '06 Agustus 2025',
                    tanggal_kembali: '08 Agustus 2025',
                    kondisi_kartu: 'Rusak',
                    keterangan: 'Selesai'
                },
                {
                    id: 5,
                    full_name: 'Ahmad Arfan',
                    tanggal_pinjam: '07 Agustus 2025',
                    tanggal_kembali: '08 Agustus 2025',
                    kondisi_kartu: 'Baik',
                    keterangan: 'Selesai'
                },
                {
                    id: 6,
                    full_name: 'Gading Subagio',
                    tanggal_pinjam: '08 Agustus 2025',
                    tanggal_kembali: '08 Agustus 2025',
                    kondisi_kartu: 'Rusak',
                    keterangan: 'Selesai'
                }
            ];

            this.data.history = mockData;
            this.renderHistoryTable();

        } catch (error) {
            console.error('Error loading history:', error);
            utils.showAlert('Error loading history', 'error');
        }
    },

    renderHistoryTable() {
        const tbody = document.getElementById('historyTableBody');
        
        if (!this.data.history || this.data.history.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-12">
                        <i class="fas fa-history text-4xl text-gray-400 mb-4"></i>
                        <p class="text-gray-600">Tidak ada riwayat pengembalian</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.data.history.map(record => this.renderHistoryRow(record)).join('');
    },

    renderHistoryRow(record) {
        const conditionColors = {
            'Baik': 'bg-green-100 text-green-800',
            'Rusak': 'bg-red-100 text-red-800',
            'Hilang': 'bg-orange-100 text-orange-800'
        };

        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${record.full_name}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${record.tanggal_pinjam}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${record.tanggal_kembali}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${conditionColors[record.kondisi_kartu] || 'bg-gray-100 text-gray-800'}">
                        ${record.kondisi_kartu}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        ${record.keterangan}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="history.editRecord(${record.id})"
                            class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs transition duration-200">
                        Edit
                    </button>
                </td>
            </tr>
        `;
    },

    editRecord(recordId) {
        const record = this.data.history.find(r => r.id === recordId);
        if (!record) {
            utils.showAlert('Data record tidak ditemukan', 'error');
            return;
        }

        this.showEditModal(record);
    },

    showEditModal(record) {
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
                        <form onsubmit="history.updateRecord(event, ${record.id})">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Nama Pemohon</label>
                                    <div class="bg-gray-100 p-3 rounded-lg">
                                        <p class="text-sm text-gray-900">${record.full_name}</p>
                                    </div>
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Pinjam</label>
                                        <div class="bg-gray-100 p-3 rounded-lg">
                                            <p class="text-sm text-gray-900">${record.tanggal_pinjam}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Kembali</label>
                                        <div class="bg-gray-100 p-3 rounded-lg">
                                            <p class="text-sm text-gray-900">${record.tanggal_kembali}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Kondisi Kartu</label>
                                    <select id="editCondition" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="Baik" ${record.kondisi_kartu === 'Baik' ? 'selected' : ''}>Baik</option>
                                        <option value="Rusak" ${record.kondisi_kartu === 'Rusak' ? 'selected' : ''}>Rusak</option>
                                        <option value="Hilang" ${record.kondisi_kartu === 'Hilang' ? 'selected' : ''}>Hilang</option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select id="editStatus" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="Selesai" ${record.keterangan === 'Selesai' ? 'selected' : ''}>Selesai</option>
                                        <option value="Dalam Proses" ${record.keterangan === 'Dalam Proses' ? 'selected' : ''}>Dalam Proses</option>
                                    </select>
                                </div>

                                <div id="reasonContainer" class="${record.kondisi_kartu === 'Baik' ? 'hidden' : ''}">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Alasan/Keterangan</label>
                                    <textarea id="editReason" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Masukkan alasan kerusakan atau kehilangan..."></textarea>
                                </div>

                                <div id="handlingContainer" class="${record.kondisi_kartu === 'Baik' ? 'hidden' : ''}">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Penanganan</label>
                                    <textarea id="editHandling" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Masukkan penanganan yang dilakukan..."></textarea>
                                </div>
                            </div>

                            <div class="mt-6 flex space-x-3">
                                <button type="submit" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">
                                    <i class="fas fa-save mr-2"></i>Simpan Perubahan
                                </button>
                                <button type="button" onclick="modals.closeModal()" class="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200">
                                    <i class="fas fa-times mr-2"></i>Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        modals.showModal(modalHtml);

        // Add event listener for condition change
        document.getElementById('editCondition').addEventListener('change', function() {
            const condition = this.value;
            const reasonContainer = document.getElementById('reasonContainer');
            const handlingContainer = document.getElementById('handlingContainer');

            if (condition === 'Rusak' || condition === 'Hilang') {
                reasonContainer.classList.remove('hidden');
                handlingContainer.classList.remove('hidden');
            } else {
                reasonContainer.classList.add('hidden');
                handlingContainer.classList.add('hidden');
            }
        });
    },

    async updateRecord(event, recordId) {
        event.preventDefault();

        const condition = document.getElementById('editCondition').value;
        const status = document.getElementById('editStatus').value;
        const reason = document.getElementById('editReason').value;
        const handling = document.getElementById('editHandling').value;

        try {
            // Update data di mock
            const recordIndex = this.data.history.findIndex(r => r.id === recordId);
            if (recordIndex !== -1) {
                this.data.history[recordIndex].kondisi_kartu = condition;
                this.data.history[recordIndex].keterangan = status;
                this.renderHistoryTable();
                utils.showAlert('Riwayat berhasil diperbarui', 'success');
                modals.closeModal();
            }
        } catch (error) {
            utils.showAlert('Error: ' + error.message, 'error');
        }
    },

    exportHistory() {
        const today = new Date().toISOString().split('T')[0];
        const filename = `riwayat-pengembalian-kartu-${today}.xlsx`;
        utils.showAlert('Laporan sedang diunduh...', 'info');
        // Simulasi download
        setTimeout(() => {
            utils.showAlert('Laporan berhasil diunduh', 'success');
        }, 2000);
    }
};
