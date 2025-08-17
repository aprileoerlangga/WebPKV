<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel Kartu Visitor</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        .sidebar-active { transform: translateX(0); }
        .sidebar-inactive { transform: translateX(-100%); }
        .gradient-blue { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .card-hover:hover { transform: translateY(-2px); transition: all 0.3s ease; }
        .status-badge { @apply px-3 py-1 rounded-full text-xs font-medium; }
        .status-menunggu { @apply bg-yellow-100 text-yellow-800; }
        .status-disetujui { @apply bg-green-100 text-green-800; }
        .status-ditolak { @apply bg-red-100 text-red-800; }
        
        /* Fix layout issues */
        .main-layout {
            display: flex;
            min-height: 100vh;
        }
        .sidebar-fixed {
            width: 256px;
            flex-shrink: 0;
        }
        .content-area {
            flex: 1;
            min-width: 0;
        }
        .sidebar-link.active {
            background-color: rgb(239 246 255);
            color: rgb(37 99 235);
            border-right: 3px solid rgb(37 99 235);
        }
        
        /* Modal styles */
        .modal-backdrop {
            backdrop-filter: blur(4px);
        }
    </style>
</head>
<body class="bg-gray-100">
    <!-- Loading Overlay -->
    <div id="loadingOverlay" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div class="bg-white p-6 rounded-lg">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-2 text-gray-600">Loading...</p>
        </div>
    </div>

    <!-- Alert Container -->
    <div id="alertContainer" class="fixed top-4 right-4 z-50 space-y-2"></div>

    <!-- Modals Container -->
    <div id="modalsContainer"></div>

    <!-- Main Layout Container -->
    <div class="main-layout">
        <!-- Sidebar -->
        <div class="sidebar-fixed">
            <div class="bg-white shadow-lg h-full">
                <!-- Logo dan Title -->
                <div class="flex flex-col items-center justify-center h-32 bg-white border-b border-gray-200">
                    <div class="flex items-center mb-2">
                        <!-- Logo KAI -->
                        <div class="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                            <span class="text-white font-bold text-lg">KAI</span>
                        </div>
                    </div>
                    <div class="text-center">
                        <h2 class="text-sm font-semibold text-gray-800">Admin Panel Kartu Visitor</h2>
                    </div>
                </div>

                <nav class="mt-6">
                    <a href="#" onclick="navigateTo('dashboard')" class="sidebar-link active flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-200" data-page="dashboard">
                        <i class="fas fa-tachometer-alt mr-3 w-5"></i>
                        Dashboard
                    </a>
                    <a href="#" onclick="navigateTo('applications')" class="sidebar-link flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-200" data-page="applications">
                        <i class="fas fa-check-circle mr-3 w-5"></i>
                        Verifikasi & Persetujuan
                    </a>
                    <a href="#" onclick="navigateTo('cards')" class="sidebar-link flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-200" data-page="cards">
                        <i class="fas fa-id-card mr-3 w-5"></i>
                        Kartu Visitor
                    </a>
                    <a href="#" onclick="navigateTo('history')" class="sidebar-link flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-200" data-page="history">
                        <i class="fas fa-history mr-3 w-5"></i>
                        Riwayat Pengembalian
                    </a>
                </nav>
            </div>
        </div>

        <!-- Main Content Area -->
        <div class="content-area">
            <!-- Top Bar -->
            <div class="gradient-blue shadow-sm">
                <div class="flex items-center justify-between px-6 py-4">
                    <div class="flex items-center">
                        <h1 id="pageTitle" class="text-xl font-semibold text-white">Dashboard</h1>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="flex items-center space-x-3 text-white">
                            <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                A
                            </div>
                            <span id="adminName" class="text-white font-medium">Admin User</span>
                        </div>
                        <button onclick="logout()" class="text-white hover:text-gray-200 transition duration-200" title="Logout">
                            <i class="fas fa-sign-out-alt text-lg"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Content Area -->
            <div class="p-6">
                <!-- Page Content Container -->
                <div id="pageContent">
                    <!-- Content will be loaded here dynamically by JavaScript -->
                </div>
            </div>
        </div>
    </div>

    <!-- Modals Container -->
    <div id="modalsContainer"></div>

    <!-- Core Scripts -->
    <script src="/js/admin/core/utils.js"></script>
    <script src="/js/admin/core/api.js"></script>
    <script src="/js/admin/core/auth.js"></script>

    <!-- Page Scripts -->
    <script src="/js/admin/pages/dashboard.js"></script>
    <script src="/js/admin/pages/applications.js"></script>
    <script src="/js/admin/pages/cards.js"></script>
    <script src="/js/admin/pages/history.js"></script>
    <script src="/js/admin/pages/reports.js"></script>

    <!-- Components Scripts -->
    <script src="/js/admin/components/modals.js"></script>
    <script src="/js/admin/components/tables.js"></script>

    <!-- Main App Script - Load last -->
    <script src="/js/admin/core/app.js"></script>

    <script>
        // Dashboard content yang akan ditampilkan
        const dashboardContent = `
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div class="bg-white rounded-lg shadow-sm p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">Total Aktif</p>
                            <p class="text-3xl font-bold text-gray-900">20</p>
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
                            <p class="text-3xl font-bold text-gray-900">5</p>
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
                            <p class="text-3xl font-bold text-gray-900">10</p>
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
                            <p class="text-3xl font-bold text-gray-900">5</p>
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
                            <p class="text-3xl font-bold text-gray-900">5</p>
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
                            <p class="text-3xl font-bold text-gray-900">2</p>
                        </div>
                        <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-question-circle text-orange-600 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Fungsi untuk navigasi dengan active state
        function navigateTo(page) {
            const pageContent = document.getElementById('pageContent');
            const pageTitle = document.getElementById('pageTitle');
            
            // Update active sidebar
            document.querySelectorAll('.sidebar-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-page') === page) {
                    link.classList.add('active');
                }
            });

            // Load content based on page
            switch(page) {
                case 'dashboard':
                    pageTitle.textContent = 'Dashboard';
                    pageContent.innerHTML = dashboardContent;
                    break;
                case 'applications':
                    pageTitle.textContent = 'Verifikasi & Persetujuan';
                    pageContent.innerHTML = getApplicationsContent();
                    break;
                case 'cards':
                    pageTitle.textContent = 'Kartu Visitor';
                    pageContent.innerHTML = getCardsContent();
                    break;
                case 'history':
                    pageTitle.textContent = 'Riwayat Pengembalian';
                    pageContent.innerHTML = getHistoryContent();
                    break;
                default:
                    pageTitle.textContent = 'Dashboard';
                    pageContent.innerHTML = dashboardContent;
            }
        }

        // Fungsi logout
        function logout() {
            if(confirm('Apakah Anda yakin ingin logout?')) {
                alert('Logout berhasil!');
                location.reload();
            }
        }

        // Fungsi untuk menampilkan modal
        function showModal(content) {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 modal-backdrop flex items-center justify-center z-50';
            modal.innerHTML = content;
            document.body.appendChild(modal);
            
            // Close modal when clicking backdrop
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal();
                }
            });
        }

        function closeModal() {
            const modal = document.querySelector('.modal-backdrop');
            if (modal) {
                modal.remove();
            }
        }

        // Show/Hide Loading
        function showLoading() {
            document.getElementById('loadingOverlay').classList.remove('hidden');
        }

        function hideLoading() {
            document.getElementById('loadingOverlay').classList.add('hidden');
        }

        // Show Alert
        function showAlert(message, type = 'success') {
            const alertContainer = document.getElementById('alertContainer');
            const alert = document.createElement('div');
            alert.className = `p-4 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white max-w-sm transition-all duration-300`;
            alert.innerHTML = `
                <div class="flex items-center justify-between">
                    <span>${message}</span>
                    <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">×</button>
                </div>
            `;
            alertContainer.appendChild(alert);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                if (alert.parentElement) {
                    alert.remove();
                }
            }, 5000);
        }

        // Fungsi untuk aplikasi
        function showApplicationDetail(name, company, date, status) {
            const modalContent = `
                <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div class="gradient-blue text-white p-6">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold">Detail Pengajuan Visitor</h3>
                            <button onclick="closeModal()" class="text-white hover:text-gray-200">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                                <p class="text-sm text-gray-900">${name}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Perusahaan</label>
                                <p class="text-sm text-gray-900">${company}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Pengajuan</label>
                                <p class="text-sm text-gray-900">${date}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <span class="px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(status)}">${status}</span>
                            </div>
                        </div>
                        
                        ${status === 'Menunggu' ? `
                        <div class="border-t pt-6">
                            <h4 class="text-lg font-semibold mb-4">Aksi Verifikasi</h4>
                            <div class="flex space-x-3">
                                <button onclick="approveApplication('${name}')" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200">
                                    <i class="fas fa-check mr-2"></i>Setujui
                                </button>
                                <button onclick="rejectApplication('${name}')" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200">
                                    <i class="fas fa-times mr-2"></i>Tolak
                                </button>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
            showModal(modalContent);
        }

        function getStatusClass(status) {
            switch(status) {
                case 'Menunggu': return 'bg-yellow-100 text-yellow-800';
                case 'Disetujui': return 'bg-green-100 text-green-800';
                case 'Ditolak': return 'bg-red-100 text-red-800';
                default: return 'bg-gray-100 text-gray-800';
            }
        }

        function approveApplication(name) {
            if(confirm(`Apakah Anda yakin ingin menyetujui aplikasi ${name}?`)) {
                showLoading();
                
                // Simulate API call
                setTimeout(() => {
                    hideLoading();
                    closeModal();
                    showAlert(`Aplikasi ${name} berhasil disetujui!`, 'success');
                    navigateTo('applications'); // Refresh page
                }, 2000);
            }
        }

        function rejectApplication(name) {
            if(confirm(`Apakah Anda yakin ingin menolak aplikasi ${name}?`)) {
                showLoading();
                
                // Simulate API call
                setTimeout(() => {
                    hideLoading();
                    closeModal();
                    showAlert(`Aplikasi ${name} berhasil ditolak!`, 'error');
                    navigateTo('applications'); // Refresh page
                }, 2000);
            }
        }

        // Fungsi untuk kartu visitor
        function issueCard() {
            const modalContent = `
                <div class="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4">
                    <div class="gradient-blue text-white p-6">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold">Terbitkan Kartu Visitor</h3>
                            <button onclick="closeModal()" class="text-white hover:text-gray-200">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                    </div>
                    <div class="p-6">
                        <form onsubmit="processIssueCard(event)">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Pilih Aplikasi yang Disetujui</label>
                                    <select required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Pilih aplikasi...</option>
                                        <option value="Milano Sitanggang">Milano Sitanggang - CV Maju Bersama</option>
                                        <option value="Gading Subagio">Gading Subagio - CV Sukses Mandiri</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Nomor Kartu</label>
                                    <input type="text" value="KV-003" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" readonly>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Terbit</label>
                                    <input type="date" value="2025-08-17" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                                </div>
                            </div>
                            <div class="mt-6 flex space-x-3">
                                <button type="submit" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">
                                    <i class="fas fa-plus mr-2"></i>Terbitkan Kartu
                                </button>
                                <button type="button" onclick="closeModal()" class="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200">
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            showModal(modalContent);
        }

        function processIssueCard(event) {
            event.preventDefault();
            showLoading();
            
            // Simulate API call
            setTimeout(() => {
                hideLoading();
                closeModal();
                showAlert('Kartu visitor berhasil diterbitkan!', 'success');
                navigateTo('cards');
            }, 2000);
        }

        function returnCard(cardNumber, name) {
            const modalContent = `
                <div class="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4">
                    <div class="gradient-blue text-white p-6">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold">Kembalikan Kartu Visitor</h3>
                            <button onclick="closeModal()" class="text-white hover:text-gray-200">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                    </div>
                    <div class="p-6">
                        <form onsubmit="processReturnCard(event)">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Nomor Kartu</label>
                                    <input type="text" value="${cardNumber}" class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" readonly>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Nama Pemohon</label>
                                    <input type="text" value="${name}" class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" readonly>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Kondisi Kartu</label>
                                    <select required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Pilih kondisi...</option>
                                        <option value="Baik">Baik</option>
                                        <option value="Rusak">Rusak</option>
                                        <option value="Hilang">Hilang</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
                                    <textarea class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Catatan tambahan..."></textarea>
                                </div>
                            </div>
                            <div class="mt-6 flex space-x-3">
                                <button type="submit" class="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition duration-200">
                                    <i class="fas fa-undo mr-2"></i>Kembalikan Kartu
                                </button>
                                <button type="button" onclick="closeModal()" class="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200">
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            showModal(modalContent);
        }

        function processReturnCard(event) {
            event.preventDefault();
            showLoading();
            
            // Simulate API call
            setTimeout(() => {
                hideLoading();
                closeModal();
                showAlert('Kartu visitor berhasil dikembalikan!', 'success');
                navigateTo('cards');
            }, 2000);
        }

        // Fungsi untuk edit history
        function editHistory(name) {
            const modalContent = `
                <div class="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4">
                    <div class="gradient-blue text-white p-6">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold">Edit Riwayat Pengembalian</h3>
                            <button onclick="closeModal()" class="text-white hover:text-gray-200">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                    </div>
                    <div class="p-6">
                        <form onsubmit="processEditHistory(event)">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Nama Pemohon</label>
                                    <input type="text" value="${name}" class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" readonly>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Kondisi Kartu</label>
                                    <select required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="Baik">Baik</option>
                                        <option value="Rusak">Rusak</option>
                                        <option value="Hilang">Hilang</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="Selesai">Selesai</option>
                                        <option value="Dalam Proses">Dalam Proses</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                                    <textarea class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Keterangan tambahan..."></textarea>
                                </div>
                            </div>
                            <div class="mt-6 flex space-x-3">
                                <button type="submit" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">
                                    <i class="fas fa-save mr-2"></i>Simpan Perubahan
                                </button>
                                <button type="button" onclick="closeModal()" class="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200">
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            showModal(modalContent);
        }

        function processEditHistory(event) {
            event.preventDefault();
            showLoading();
            
            // Simulate API call
            setTimeout(() => {
                hideLoading();
                closeModal();
                showAlert('Riwayat berhasil diperbarui!', 'success');
                navigateTo('history');
            }, 1500);
        }

        // Fungsi export
        function exportReport() {
            showLoading();
            
            // Simulate file generation and download
            setTimeout(() => {
                hideLoading();
                showAlert('Laporan berhasil diunduh!', 'success');
                
                // Create a dummy download
                const link = document.createElement('a');
                link.href = 'data:text/csv;charset=utf-8,Laporan%20Visitor%20Card%20System';
                link.download = 'visitor_report_' + new Date().getTime() + '.csv';
                link.click();
            }, 2000);
        }

        function getApplicationsContent() {
            return `
                <div class="bg-white rounded-lg shadow-sm mb-6 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Verifikasi & Persetujuan</h3>
                        <div class="flex items-center space-x-3">
                            <div class="relative">
                                <input type="text" placeholder="Cari berdasarkan nama pemohon" onkeyup="searchApplications(this.value)"
                                       class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64">
                                <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                            </div>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="min-w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Pemohon</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Perusahaan</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Pengajuan</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200" id="applicationsTableBody">
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Azida Kautsar</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">PT ABC Indonesia</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">04 Agustus 2025</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Menunggu</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onclick="showApplicationDetail('Azida Kautsar', 'PT ABC Indonesia', '04 Agustus 2025', 'Menunggu')" 
                                                class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs mr-2">Detail</button>
                                        <button onclick="approveApplication('Azida Kautsar')" 
                                                class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs mr-2">Setujui</button>
                                        <button onclick="rejectApplication('Azida Kautsar')" 
                                                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs">Tolak</button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Milano Sitanggang</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">CV Maju Bersama</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">05 Agustus 2025</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Disetujui</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onclick="showApplicationDetail('Milano Sitanggang', 'CV Maju Bersama', '05 Agustus 2025', 'Disetujui')" 
                                                class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs">Detail</button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Azka Mauladina</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">PT Teknologi Maju</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">03 Agustus 2025</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Menunggu</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onclick="showApplicationDetail('Azka Mauladina', 'PT Teknologi Maju', '03 Agustus 2025', 'Menunggu')" 
                                                class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs mr-2">Detail</button>
                                        <button onclick="approveApplication('Azka Mauladina')" 
                                                class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs mr-2">Setujui</button>
                                        <button onclick="rejectApplication('Azka Mauladina')" 
                                                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs">Tolak</button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Yudhita Melka</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">PT Digital Solusi</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">06 Agustus 2025</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Ditolak</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onclick="showApplicationDetail('Yudhita Melka', 'PT Digital Solusi', '06 Agustus 2025', 'Ditolak')" 
                                                class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs">Detail</button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Ahmad Arfan</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">PT Konsultan Prima</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">07 Agustus 2025</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Menunggu</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onclick="showApplicationDetail('Ahmad Arfan', 'PT Konsultan Prima', '07 Agustus 2025', 'Menunggu')" 
                                                class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs mr-2">Detail</button>
                                        <button onclick="approveApplication('Ahmad Arfan')" 
                                                class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs mr-2">Setujui</button>
                                        <button onclick="rejectApplication('Ahmad Arfan')" 
                                                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs">Tolak</button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Gading Subagio</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">CV Sukses Mandiri</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">08 Agustus 2025</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Disetujui</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onclick="showApplicationDetail('Gading Subagio', 'CV Sukses Mandiri', '08 Agustus 2025', 'Disetujui')" 
                                                class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs">Detail</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        // Fungsi search untuk aplikasi
        function searchApplications(query) {
            const rows = document.querySelectorAll('#applicationsTableBody tr');
            rows.forEach(row => {
                const name = row.cells[0].textContent.toLowerCase();
                const company = row.cells[1].textContent.toLowerCase();
                if (name.includes(query.toLowerCase()) || company.includes(query.toLowerCase())) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }

        function getCardsContent() {
            return `
                <div class="bg-white rounded-lg shadow-sm mb-6 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Pengelolaan Kartu Visitor</h3>
                        <div class="flex items-center space-x-3">
                            <button onclick="issueCard()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                                <i class="fas fa-plus mr-2"></i>Terbitkan Kartu
                            </button>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="min-w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Kartu</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Pemohon</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Perusahaan</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Terbit</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">KV-001</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Milano Sitanggang</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">CV Maju Bersama</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">05 Agustus 2025</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Aktif</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onclick="returnCard('KV-001', 'Milano Sitanggang')" class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs">Kembalikan</button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">KV-002</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Gading Subagio</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">CV Sukses Mandiri</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">08 Agustus 2025</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Aktif</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onclick="returnCard('KV-002', 'Gading Subagio')" class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs">Kembalikan</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        function getHistoryContent() {
            return `
                <div class="bg-white rounded-lg shadow-sm mb-6 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Riwayat Pengembalian</h3>
                        <div class="flex items-center space-x-3">
                            <div class="relative">
                                <input type="text" placeholder="Cari berdasarkan nama pemohon" onkeyup="searchHistory(this.value)"
                                       class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64">
                                <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                            </div>
                            <button onclick="exportReport()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                                <i class="fas fa-download mr-2"></i>Export Laporan
                            </button>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="min-w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Pemohon</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Pinjam</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Kembali</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kondisi Kartu</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200" id="historyTableBody">
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Azida Kautsar</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">04 Agustus 2025</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">08 Agustus 2025</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Baik</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Selesai</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onclick="editHistory('Azida Kautsar')" class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs">Edit</button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Milano Sitanggang</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">05 Agustus 2025</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">08 Agustus 2025</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">Hilang</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Selesai</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onclick="editHistory('Milano Sitanggang')" class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs">Edit</button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Azka Mauladina</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">03 Agustus 2025</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">08 Agustus 2025</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">Hilang</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Selesai</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onclick="editHistory('Azka Mauladina')" class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs">Edit</button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Yudhita Melka</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">06 Agustus 2025</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">08 Agustus 2025</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Rusak</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Selesai</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onclick="editHistory('Yudhita Melka')" class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs">Edit</button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Ahmad Arfan</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">07 Agustus 2025</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">08 Agustus 2025</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Baik</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Selesai</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onclick="editHistory('Ahmad Arfan')" class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs">Edit</button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Gading Subagio</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">08 Agustus 2025</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">08 Agustus 2025</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Rusak</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Selesai</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onclick="editHistory('Gading Subagio')" class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs">Edit</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        // Fungsi search untuk history
        function searchHistory(query) {
            const rows = document.querySelectorAll('#historyTableBody tr');
            rows.forEach(row => {
                const name = row.cells[0].textContent.toLowerCase();
                if (name.includes(query.toLowerCase())) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }

        // Initialize when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM loaded, initializing admin panel...');
            
            // Set default to dashboard
            navigateTo('dashboard');
            
            // Setup sidebar navigation
            document.querySelectorAll('.sidebar-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const page = this.getAttribute('data-page');
                    navigateTo(page);
                });
            });
        });
    </script>
</body>
</html>
