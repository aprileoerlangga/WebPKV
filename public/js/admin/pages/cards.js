// Cards Page Module - Updated sesuai dengan gambar
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
            <!-- Header with Export Button -->
            <div class="bg-white rounded-lg shadow-sm mb-6 p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Penyerahan & Pengembalian Kartu</h3>
                    <button onclick="cards.exportReport()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                        <i class="fas fa-download mr-2"></i>Export Laporan
                    </button>
                </div>

                <!-- Cards Table -->
                <div id="cardsTableContainer" class="overflow-x-auto">
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
                        <tbody id="cardsTableBody" class="bg-white divide-y divide-gray-200">
                            <!-- Data akan dimuat di sini -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    async init() {
        await this.loadCards();
    },

    async loadCards(page = 1) {
        try {
            // Mock data sesuai gambar
            const mockData = [
                {
                    id: 1,
                    full_name: 'Azida Kautsar',
                    tanggal_pinjam: '04 Agustus 2025',
                    tanggal_kembali: '08 Agustus 2025',
                    kondisi_kartu: '-',
                    keterangan: 'Tidak Aktif',
                    status: 'inactive',
                    action: 'Terima Kartu'
                },
                {
                    id: 2,
                    full_name: 'Milano Sitanggang',
                    tanggal_pinjam: '05 Agustus 2025',
                    tanggal_kembali: '08 Agustus 2025',
                    kondisi_kartu: 'Hilang',
                    keterangan: 'Aktif',
                    status: 'active',
                    action: 'Serahkan Kartu'
                },
                {
                    id: 3,
                    full_name: 'Azka Mauladina',
                    tanggal_pinjam: '03 Agustus 2025',
                    tanggal_kembali: '08 Agustus 2025',
                    kondisi_kartu: 'Hilang',
                    keterangan: 'Tidak Aktif',
                    status: 'inactive',
                    action: 'Terima Kartu'
                },
                {
                    id: 4,
                    full_name: 'Yudhita Melka',
                    tanggal_pinjam: '06 Agustus 2025',
                    tanggal_kembali: '08 Agustus 2025',
                    kondisi_kartu: 'Rusak',
                    keterangan: 'Tidak Aktif',
                    status: 'inactive',
                    action: 'Terima Kartu'
                },
                {
                    id: 5,
                    full_name: 'Ahmad Arfan',
                    tanggal_pinjam: '07 Agustus 2025',
                    tanggal_kembali: '08 Agustus 2025',
                    kondisi_kartu: 'Baik',
                    keterangan: 'Aktif',
                    status: 'active',
                    action: 'Serahkan Kartu'
                },
                {
                    id: 6,
                    full_name: 'Gading Subagio',
                    tanggal_pinjam: '08 Agustus 2025',
                    tanggal_kembali: '08 Agustus 2025',
                    kondisi_kartu: '-',
                    keterangan: 'Aktif',
                    status: 'active',
                    action: 'Serahkan Kartu'
                }
            ];

            this.data.cards = mockData;
            this.renderCardsTable();

        } catch (error) {
            console.error('Error loading cards:', error);
            utils.showAlert('Error loading cards', 'error');
        }
    },

    renderCardsTable() {
        const tbody = document.getElementById('cardsTableBody');
        
        if (!this.data.cards || this.data.cards.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-12">
                        <i class="fas fa-id-card text-4xl text-gray-400 mb-4"></i>
                        <p class="text-gray-600">Tidak ada data kartu</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.data.cards.map(card => this.renderCardRow(card)).join('');
    },

    renderCardRow(card) {
        const statusColors = {
            'active': 'bg-green-100 text-green-800',
            'inactive': 'bg-red-100 text-red-800'
        };

        const actionColors = {
            'Terima Kartu': 'bg-blue-600 hover:bg-blue-700',
            'Serahkan Kartu': 'bg-green-600 hover:bg-green-700'
        };

        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${card.full_name}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${card.tanggal_pinjam}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${card.tanggal_kembali}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${card.kondisi_kartu}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${statusColors[card.status] || 'bg-gray-100 text-gray-800'}">
                        ${card.keterangan}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="cards.handleCardAction(${card.id}, '${card.action}')"
                            class="${actionColors[card.action]} text-white px-3 py-1 rounded text-xs transition duration-200">
                        ${card.action}
                    </button>
                </td>
            </tr>
        `;
    },

    async handleCardAction(cardId, action) {
        const card = this.data.cards.find(c => c.id === cardId);
        if (!card) return;

        if (action === 'Terima Kartu') {
            this.showReceiveCardModal(cardId, card.full_name);
        } else if (action === 'Serahkan Kartu') {
            this.showIssueCardModal(cardId, card.full_name);
        }
    },

    showIssueCardModal(cardId, name) {
        const card = this.data.cards.find(c => c.id === cardId);
        
        // Mock data untuk modal sesuai gambar penyerahan kartu
        const modalData = {
            nama_lengkap: 'Milano Sitanggang',
            nomor_pengajuan: 'VST-2025-123456',
            instansi: 'CV. Digital Media',
            tujuan_kunjungan: 'Presentasi proposal vendor',
            email: 'milanos@digimedia.com',
            waktu_peminjaman: '08 Agustus 2025 08:30 WIB',
            waktu_pengembalian: '08 Agustus 2025 17:00 WIB'
        };

        const modalHtml = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="issueCardModal">
                <div class="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4">
                    <!-- Header -->
                    <div class="bg-blue-600 text-white p-4 rounded-t-lg">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold">
                                <i class="fas fa-id-card mr-2"></i>
                                Konfirmasi Penyerahan Kartu Visitor
                            </h3>
                            <button onclick="modals.closeModal()" class="text-white hover:text-gray-200">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="p-6">
                        <div class="bg-gray-100 p-4 rounded-lg mb-4">
                            <h4 class="font-semibold text-gray-800 mb-3">Data Penerima Kartu</h4>
                            
                            <div class="grid grid-cols-1 gap-3 text-sm">
                                <div class="flex">
                                    <span class="font-medium text-gray-600 w-32">Nama Lengkap</span>
                                    <span class="text-gray-900">: ${modalData.nama_lengkap}</span>
                                </div>
                                <div class="flex">
                                    <span class="font-medium text-gray-600 w-32">Nomor Pengajuan</span>
                                    <span class="text-gray-900">: ${modalData.nomor_pengajuan}</span>
                                </div>
                                <div class="flex">
                                    <span class="font-medium text-gray-600 w-32">Instansi</span>
                                    <span class="text-gray-900">: ${modalData.instansi}</span>
                                </div>
                                <div class="flex">
                                    <span class="font-medium text-gray-600 w-32">Tujuan Kunjungan</span>
                                    <span class="text-gray-900">: ${modalData.tujuan_kunjungan}</span>
                                </div>
                                <div class="flex">
                                    <span class="font-medium text-gray-600 w-32">Email</span>
                                    <span class="text-gray-900">: ${modalData.email}</span>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <div class="bg-blue-50 p-3 rounded-lg">
                                <div class="text-blue-800 text-sm font-medium">
                                    <i class="fas fa-clock mr-2"></i>Waktu Peminjaman:
                                </div>
                                <div class="text-blue-700 text-sm ml-6">${modalData.waktu_peminjaman}</div>
                            </div>

                            <div class="bg-purple-50 p-3 rounded-lg">
                                <div class="text-purple-800 text-sm font-medium">
                                    <i class="fas fa-calendar-alt mr-2"></i>Waktu Pengembalian:
                                </div>
                                <div class="text-purple-700 text-sm ml-6">${modalData.waktu_pengembalian}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                        <button onclick="modals.closeModal()" 
                                class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200">
                            Kembali
                        </button>
                        <button onclick="cards.confirmIssueCard(${cardId})"
                                class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200">
                            Konfirmasi Penyerahan
                        </button>
                    </div>
                </div>
            </div>
        `;

        modals.showModal(modalHtml);
    },

    showReceiveCardModal(cardId, name) {
        // Mock data untuk modal sesuai gambar laporan kartu rusak/hilang
        const modalHtml = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="receiveCardModal">
                <div class="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4">
                    <!-- Header -->
                    <div class="bg-blue-600 text-white p-4 rounded-t-lg">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold">Laporan Kartu Rusak/Hilang</h3>
                            <button onclick="modals.closeModal()" class="text-white hover:text-gray-200">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="p-6">
                        <div class="bg-gray-100 p-4 rounded-lg mb-4">
                            <h4 class="font-semibold text-gray-800 mb-3">Data Pengembalian</h4>
                            
                            <div class="grid grid-cols-1 gap-3 text-sm">
                                <div class="flex">
                                    <span class="font-medium text-gray-600 w-32">Nama Lengkap</span>
                                    <span class="text-gray-900">: Azida Kautsar Milla</span>
                                </div>
                                <div class="flex">
                                    <span class="font-medium text-gray-600 w-32">Nomor Pengajuan</span>
                                    <span class="text-gray-900">: VST-2025-123456</span>
                                </div>
                                <div class="flex">
                                    <span class="font-medium text-gray-600 w-32">Instansi</span>
                                    <span class="text-gray-900">: Politeknik Elektronika Negeri Surabaya</span>
                                </div>
                                <div class="flex">
                                    <span class="font-medium text-gray-600 w-32">Tanggal Kunjungan</span>
                                    <span class="text-gray-900">: 04 Agustus 2025</span>
                                </div>
                            </div>
                        </div>

                        <form onsubmit="cards.handleReceiveCard(event, ${cardId})">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Kondisi Kartu</label>
                                    <select id="cardCondition" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Pilih kondisi kartu</option>
                                        <option value="Baik">Baik</option>
                                        <option value="Rusak">Rusak</option>
                                        <option value="Hilang">Hilang</option>
                                    </select>
                                </div>

                                <div id="reasonContainer" class="hidden">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Alasan :</label>
                                    <textarea id="conditionReason" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Masukkan alasan kondisi (Opsional)"></textarea>
                                </div>

                                <div id="handlingContainer" class="hidden">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Penanganan :</label>
                                    <textarea id="conditionHandling" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Masukkan catatan penanganan..."></textarea>
                                </div>
                            </div>

                            <div class="mt-6 flex space-x-3">
                                <button type="button" onclick="modals.closeModal()" 
                                        class="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200">
                                    Kembali
                                </button>
                                <button type="submit" 
                                        class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200">
                                    Simpan Data
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        modals.showModal(modalHtml);

        // Add event listener for condition change
        document.getElementById('cardCondition').addEventListener('change', function() {
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

    async confirmIssueCard(cardId) {
        try {
            // Update status di data mock
            const cardIndex = this.data.cards.findIndex(c => c.id === cardId);
            if (cardIndex !== -1) {
                this.data.cards[cardIndex].keterangan = 'Aktif';
                this.data.cards[cardIndex].status = 'active';
                this.renderCardsTable();
                utils.showAlert('Kartu berhasil diserahkan', 'success');
                modals.closeModal();
            }
        } catch (error) {
            utils.showAlert('Error: ' + error.message, 'error');
        }
    },

    async handleReceiveCard(event, cardId) {
        event.preventDefault();
        
        const condition = document.getElementById('cardCondition').value;
        const reason = document.getElementById('conditionReason').value;
        const handling = document.getElementById('conditionHandling').value;

        try {
            // Update status di data mock
            const cardIndex = this.data.cards.findIndex(c => c.id === cardId);
            if (cardIndex !== -1) {
                this.data.cards[cardIndex].keterangan = 'Diserahkan';
                this.data.cards[cardIndex].kondisi_kartu = condition;
                this.data.cards[cardIndex].status = 'returned';
                this.renderCardsTable();
                utils.showAlert('Data pengembalian kartu berhasil disimpan', 'success');
                modals.closeModal();
            }
        } catch (error) {
            utils.showAlert('Error: ' + error.message, 'error');
        }
    },

    exportReport() {
        const today = new Date().toISOString().split('T')[0];
        const filename = `laporan-penyerahan-pengembalian-kartu-${today}.xlsx`;
        utils.showAlert('Laporan sedang diunduh...', 'info');
        // Simulasi download
        setTimeout(() => {
            utils.showAlert('Laporan berhasil diunduh', 'success');
        }, 2000);
    }
};
