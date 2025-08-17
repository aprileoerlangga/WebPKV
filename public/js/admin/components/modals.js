// Modals Component Module
const modals = {
    currentModal: null,

    // Show modal with HTML content
    showModal(html) {
        this.closeModal(); // Close any existing modal

        const container = document.getElementById('modalsContainer');
        container.innerHTML = html;
        this.currentModal = container.firstElementChild;

        // Add event listeners for backdrop click
        if (this.currentModal) {
            this.currentModal.addEventListener('click', (e) => {
                if (e.target === this.currentModal) {
                    this.closeModal();
                }
            });
        }

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    },

    // Close current modal
    closeModal() {
        const container = document.getElementById('modalsContainer');
        container.innerHTML = '';
        this.currentModal = null;

        // Restore body scroll
        document.body.style.overflow = '';
    },

    // Show application detail modal - Updated sesuai dengan gambar
    showApplicationDetail(application) {
        const modalHtml = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="applicationDetailModal">
                <div class="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <!-- Header -->
                    <div class="gradient-blue text-white p-6">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold">Detail Pengajuan Visitor</h3>
                            <button onclick="modals.closeModal()" class="text-white hover:text-gray-200">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        <!-- Breadcrumb -->
                        <div class="flex items-center mt-2 text-sm">
                            <span class="text-blue-100">verifikasi & persetujuan</span>
                            <i class="fas fa-chevron-right mx-2 text-blue-200"></i>
                            <span>Detail Pengajuan</span>
                        </div>
                    </div>

                    <!-- Status Badge -->
                    <div class="p-6 border-b">
                        <div class="flex items-center justify-between">
                            <h2 class="text-xl font-semibold text-gray-900">${application.full_name}</h2>
                            <span class="px-3 py-1 rounded-full text-sm font-medium ${
                                application.status === 'menunggu' ? 'bg-yellow-100 text-yellow-800' :
                                application.status === 'disetujui' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                            }">
                                ${application.status === 'menunggu' ? 'Menunggu Persetujuan' :
                                  application.status === 'disetujui' ? 'Disetujui' : 'Ditolak'}
                            </span>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="p-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Left Column -->
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Nama Pemohon</label>
                                    <div class="bg-gray-100 p-3 rounded-lg">
                                        <p class="text-sm text-gray-900">${application.full_name}</p>
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Nomor KTP</label>
                                    <div class="bg-gray-100 p-3 rounded-lg">
                                        <p class="text-sm text-gray-900">${application.id_number}</p>
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <div class="bg-gray-100 p-3 rounded-lg">
                                        <p class="text-sm text-gray-900">${application.email}</p>
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Kunjungan</label>
                                    <div class="bg-gray-100 p-3 rounded-lg">
                                        <p class="text-sm text-gray-900">${application.visit_start_date}</p>
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Tujuan Kunjungan</label>
                                    <div class="bg-gray-100 p-3 rounded-lg">
                                        <p class="text-sm text-gray-900">${application.visit_purpose}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Right Column -->
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Instansi/Perusahaan</label>
                                    <div class="bg-gray-100 p-3 rounded-lg">
                                        <p class="text-sm text-gray-900">${application.company_institution}</p>
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Nomor Handphone</label>
                                    <div class="bg-gray-100 p-3 rounded-lg">
                                        <p class="text-sm text-gray-900">${application.phone}</p>
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Stasiun Tujuan</label>
                                    <div class="bg-gray-100 p-3 rounded-lg">
                                        <p class="text-sm text-gray-900">${application.station.name}</p>
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Selesai Kunjungan</label>
                                    <div class="bg-gray-100 p-3 rounded-lg">
                                        <p class="text-sm text-gray-900">${application.visit_end_date}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Document Section -->
                        ${application.support_document ? `
                            <div class="mt-6">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Dokumen Pendukung</label>
                                <div class="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
                                    <span class="text-sm text-gray-900">${application.support_document}</span>
                                    <button class="text-blue-600 hover:text-blue-800 text-sm">
                                        <i class="fas fa-eye mr-1"></i>Lihat
                                    </button>
                                </div>
                            </div>
                        ` : ''}

                        <!-- Status Information -->
                        ${application.status === 'ditolak' ? `
                            <div class="mt-6 p-4 bg-red-50 rounded-lg">
                                <div class="text-red-800 text-sm font-medium mb-2">Tidak menyertakan surat tugas</div>
                                <div class="text-red-600 text-sm">Petugas : Rafi</div>
                            </div>
                        ` : application.status === 'disetujui' ? `
                            <div class="mt-6 p-4 bg-green-50 rounded-lg">
                                <div class="text-green-800 text-sm font-medium">Petugas : Rafi</div>
                            </div>
                        ` : ''}
                    </div>

                    <!-- Action Buttons -->
                    <div class="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                        ${application.status === 'menunggu' ? `
                            <button onclick="modals.showRejectModal(${application.id})"
                                    class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-200">
                                Tolak
                            </button>
                            <button onclick="modals.showApproveModal(${application.id})"
                                    class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200">
                                Setujui
                            </button>
                        ` : ''}
                        <button onclick="modals.closeModal()"
                                class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-200">
                            Kembali
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.showModal(modalHtml);
    },

    // Show reject confirmation modal
    showRejectModal(applicationId) {
        const modalHtml = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="rejectModal">
                <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
                    <div class="p-6 border-b">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-red-600">
                                <i class="fas fa-times-circle mr-2"></i>
                                Konfirmasi Penolakan?
                            </h3>
                            <button onclick="modals.closeModal()" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                    </div>

                    <div class="p-6">
                        <form onsubmit="modals.handleReject(event, ${applicationId})">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Nama Petugas: *</label>
                                    <input type="text" id="officerName" required placeholder="Masukkan nama petugas yang menangani"
                                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Alasan Penolakan: *</label>
                                    <textarea id="rejectionReason" required placeholder="Masukkan alasan penolakan..."
                                             class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" rows="4"></textarea>
                                </div>
                            </div>

                            <div class="mt-6 flex space-x-3">
                                <button type="button" onclick="modals.closeModal()" 
                                        class="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200">
                                    Batal
                                </button>
                                <button type="submit" 
                                        class="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200">
                                    Tolak
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        this.showModal(modalHtml);
    },

    // Show approve confirmation modal
    showApproveModal(applicationId) {
        const modalHtml = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="approveModal">
                <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
                    <div class="p-6 border-b">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-green-600">
                                <i class="fas fa-check-circle mr-2"></i>
                                Konfirmasi Persetujuan?
                            </h3>
                            <button onclick="modals.closeModal()" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                    </div>

                    <div class="p-6">
                        <form onsubmit="modals.handleApprove(event, ${applicationId})">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Nama Petugas: *</label>
                                    <input type="text" id="approveOfficerName" required placeholder="Masukkan nama petugas yang menangani"
                                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Catatan Persetujuan: *</label>
                                    <textarea id="approvalNotes" required placeholder="Catatan tambahan (opsional):"
                                             class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" rows="3"></textarea>
                                </div>
                            </div>

                            <div class="mt-6 flex space-x-3">
                                <button type="button" onclick="modals.closeModal()" 
                                        class="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200">
                                    Batal
                                </button>
                                <button type="submit" 
                                        class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200">
                                    Setujui
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        this.showModal(modalHtml);
    },

    // Handle reject form submission
    async handleReject(event, applicationId) {
        event.preventDefault();
        
        const officerName = document.getElementById('officerName').value;
        const reason = document.getElementById('rejectionReason').value;
        
        this.closeModal();
        await applications.reject(applicationId, officerName, reason);
        
        // Close detail modal if open
        const detailModal = document.getElementById('applicationDetailModal');
        if (detailModal) {
            this.closeModal();
        }
    },

    // Handle approve form submission
    async handleApprove(event, applicationId) {
        event.preventDefault();
        
        const officerName = document.getElementById('approveOfficerName').value;
        const notes = document.getElementById('approvalNotes').value;
        
        this.closeModal();
        await applications.approve(applicationId, officerName, notes);
        
        // Close detail modal if open
        const detailModal = document.getElementById('applicationDetailModal');
        if (detailModal) {
            this.closeModal();
        }
    },

    // Show approved applications for card issuance
    showApprovedApplications(applications) {
        const modalHtml = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="approvedApplicationsModal">
                <div class="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div class="p-6 border-b">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold">Serahkan Kartu Visitor</h3>
                            <button onclick="modals.closeModal()" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        <p class="text-sm text-gray-600 mt-2">Pilih pengajuan yang akan diserahkan kartunya</p>
                    </div>

                    <div class="p-6">
                        ${applications.length === 0 ? `
                            <div class="text-center py-8">
                                <i class="fas fa-inbox text-3xl text-gray-400 mb-3"></i>
                                <p class="text-gray-600">Tidak ada pengajuan yang siap untuk diserahkan kartu</p>
                            </div>
                        ` : `
                            <div class="space-y-3">
                                ${applications.map(app => `
                                    <div class="border rounded-lg p-4 hover:bg-gray-50 transition duration-200">
                                        <div class="flex items-center justify-between">
                                            <div class="flex-1">
                                                <div class="flex items-center mb-2">
                                                    <h4 class="font-medium text-gray-900">${app.full_name}</h4>
                                                    <span class="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                                        Disetujui
                                                    </span>
                                                </div>
                                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                                    <div>
                                                        <span class="font-medium">No. Pengajuan:</span><br>
                                                        <span class="font-mono">${app.application_number}</span>
                                                    </div>
                                                    <div>
                                                        <span class="font-medium">Instansi:</span><br>
                                                        <span>${app.company_institution}</span>
                                                    </div>
                                                    <div>
                                                        <span class="font-medium">Stasiun:</span><br>
                                                        <span>${app.station.name}</span>
                                                    </div>
                                                </div>
                                                <div class="mt-2 text-sm text-gray-600">
                                                    <span class="font-medium">Periode:</span>
                                                    ${utils.formatDate(app.visit_start_date)} - ${utils.formatDate(app.visit_end_date)}
                                                </div>
                                            </div>
                                            <div class="ml-4">
                                                <button onclick="cards.issueCard(${app.id})"
                                                        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">
                                                    <i class="fas fa-hand-holding mr-2"></i>Serahkan Kartu
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        `}
                    </div>

                    <div class="p-6 border-t bg-gray-50 flex justify-end">
                        <button onclick="modals.closeModal()"
                                class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200">
                            <i class="fas fa-times mr-2"></i>Tutup
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.showModal(modalHtml);
    },

    // Show return card modal
    showReturnCardModal(cardId) {
        const modalHtml = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="returnCardModal">
                <div class="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4">
                    <div class="p-6 border-b">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold">Terima Pengembalian Kartu</h3>
                            <button onclick="modals.closeModal()" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                    </div>

                    <div class="p-6">
                        <form onsubmit="modals.handleReturnCard(event, ${cardId})">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Kondisi Kartu</label>
                                    <select id="returnCondition" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Pilih kondisi kartu</option>
                                        <option value="good">Baik</option>
                                        <option value="damaged">Rusak</option>
                                        <option value="lost">Hilang</option>
                                    </select>
                                </div>

                                <div id="damageReasonContainer" class="hidden">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Alasan Kerusakan/Kehilangan</label>
                                    <textarea id="returnReason" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Jelaskan alasan kerusakan atau kehilangan..."></textarea>
                                </div>

                                <div id="damageHandlingContainer" class="hidden">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Penanganan</label>
                                    <textarea id="returnHandling" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Jelaskan penanganan yang dilakukan..."></textarea>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Catatan Tambahan</label>
                                    <textarea id="returnNotes" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows="2" placeholder="Catatan tambahan (opsional)..."></textarea>
                                </div>
                            </div>

                            <div class="mt-6 flex space-x-3">
                                <button type="submit" class="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200">
                                    <i class="fas fa-check mr-2"></i>Terima Kartu
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

        this.showModal(modalHtml);

        // Add event listener for condition change
        document.getElementById('returnCondition').addEventListener('change', function() {
            const condition = this.value;
            const reasonContainer = document.getElementById('damageReasonContainer');
            const handlingContainer = document.getElementById('damageHandlingContainer');
            const reasonField = document.getElementById('returnReason');
            const handlingField = document.getElementById('returnHandling');

            if (condition === 'damaged' || condition === 'lost') {
                reasonContainer.classList.remove('hidden');
                handlingContainer.classList.remove('hidden');
                reasonField.required = true;
                handlingField.required = true;
            } else {
                reasonContainer.classList.add('hidden');
                handlingContainer.classList.add('hidden');
                reasonField.required = false;
                handlingField.required = false;
                reasonField.value = '';
                handlingField.value = '';
            }
        });
    },

    // Handle return card form submission
    async handleReturnCard(event, cardId) {
        event.preventDefault();

        const condition = document.getElementById('returnCondition').value;
        const reason = document.getElementById('returnReason').value;
        const handling = document.getElementById('returnHandling').value;
        const notes = document.getElementById('returnNotes').value;

        const formData = {
            condition: condition,
            damage_reason: reason || null,
            damage_handling: handling || null,
            notes: notes || null
        };

        await cards.processReturn(cardId, formData);
    },

    // Show card history modal
    showCardHistory(histories) {
        const modalHtml = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="cardHistoryModal">
                <div class="bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div class="p-6 border-b">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold">Riwayat Kartu Visitor</h3>
                            <button onclick="modals.closeModal()" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                    </div>

                    <div class="p-6">
                        ${histories.length === 0 ? `
                            <div class="text-center py-8">
                                <i class="fas fa-history text-3xl text-gray-400 mb-3"></i>
                                <p class="text-gray-600">Tidak ada riwayat aktivitas</p>
                            </div>
                        ` : `
                            <div class="space-y-4">
                                ${histories.map(history => `
                                    <div class="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-lg">
                                        <div class="flex items-center justify-between mb-2">
                                            <span class="font-medium text-gray-900">
                                                ${this.getActionText(history.action)}
                                            </span>
                                            <span class="text-sm text-gray-500">
                                                ${utils.formatDateTime(history.created_at)}
                                            </span>
                                        </div>
                                        ${history.notes ? `
                                            <p class="text-sm text-gray-600 mb-2">${history.notes}</p>
                                        ` : ''}
                                        ${history.performer ? `
                                            <p class="text-xs text-gray-500">
                                                Oleh: ${history.performer.name}
                                            </p>
                                        ` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        `}
                    </div>

                    <div class="p-6 border-t bg-gray-50 flex justify-end">
                        <button onclick="modals.closeModal()"
                                class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200">
                            <i class="fas fa-times mr-2"></i>Tutup
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.showModal(modalHtml);
    },

    // Get action text for history
    getActionText(action) {
        const actionTexts = {
            'issued': 'Kartu Diserahkan',
            'returned': 'Kartu Dikembalikan',
            'marked_damaged': 'Kartu Ditandai Rusak',
            'marked_lost': 'Kartu Ditandai Hilang'
        };
        return actionTexts[action] || action;
    },

    // Show confirmation dialog
    showConfirmation(title, message, onConfirm, onCancel = null) {
        const modalHtml = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="confirmationModal">
                <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
                    <div class="p-6 border-b">
                        <h3 class="text-lg font-semibold text-gray-900">${title}</h3>
                    </div>

                    <div class="p-6">
                        <p class="text-gray-600">${message}</p>
                    </div>

                    <div class="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                        <button onclick="modals.closeModal(); ${onCancel ? onCancel + '()' : ''}"
                                class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200">
                            Batal
                        </button>
                        <button onclick="modals.closeModal(); ${onConfirm}()"
                                class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200">
                            Konfirmasi
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.showModal(modalHtml);
    },

    // Show input dialog
    showInputDialog(title, placeholder, onConfirm, onCancel = null, inputType = 'text') {
        const modalHtml = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="inputModal">
                <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
                    <div class="p-6 border-b">
                        <h3 class="text-lg font-semibold text-gray-900">${title}</h3>
                    </div>

                    <div class="p-6">
                        <input type="${inputType}"
                               id="modalInput"
                               placeholder="${placeholder}"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                               onkeypress="if(event.key==='Enter') modals.handleInputConfirm('${onConfirm}')">
                    </div>

                    <div class="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                        <button onclick="modals.closeModal(); ${onCancel ? onCancel + '()' : ''}"
                                class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200">
                            Batal
                        </button>
                        <button onclick="modals.handleInputConfirm('${onConfirm}')"
                                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">
                            Konfirmasi
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.showModal(modalHtml);

        // Focus on input
        setTimeout(() => {
            const input = document.getElementById('modalInput');
            if (input) input.focus();
        }, 100);
    },

    // Handle input confirmation
    handleInputConfirm(onConfirm) {
        const input = document.getElementById('modalInput');
        const value = input ? input.value.trim() : '';

        this.closeModal();

        // Execute the callback function with the input value
        if (onConfirm && value) {
            // Create a temporary function to execute the callback
            const func = new Function('value', `return (${onConfirm})(value)`);
            func(value);
        }
    },

    // Show loading modal
    showLoading(message = 'Loading...') {
        const modalHtml = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="loadingModal">
                <div class="bg-white rounded-lg shadow-lg p-8">
                    <div class="text-center">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p class="text-gray-600">${message}</p>
                    </div>
                </div>
            </div>
        `;

        this.showModal(modalHtml);
    }
};

// Make modals available globally
window.modals = modals;
