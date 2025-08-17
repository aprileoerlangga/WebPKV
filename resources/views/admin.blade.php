<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Sistem Kartu Visitor</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        .sidebar-active { transform: translateX(0); }
        .sidebar-inactive { transform: translateX(-100%); }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Loading Overlay -->
    <div id="loadingOverlay" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div class="bg-white p-6 rounded-lg">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-2 text-gray-600">Loading...</p>
        </div>
    </div>

    <!-- Alert Container -->
    <div id="alertContainer" class="fixed top-4 right-4 z-50 space-y-2"></div>

    <!-- Sidebar -->
    <div id="sidebar" class="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform sidebar-inactive transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0">
        <div class="flex items-center justify-center h-16 bg-blue-600 text-white">
            <i class="fas fa-train mr-2"></i>
            <span class="text-lg font-semibold">Admin Dashboard</span>
        </div>

        <nav class="mt-8">
            <a href="#" onclick="navigateTo('dashboard')" class="sidebar-link flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-200" data-page="dashboard">
                <i class="fas fa-tachometer-alt mr-3"></i>
                Dashboard
            </a>
            <a href="#" onclick="navigateTo('applications')" class="sidebar-link flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-200" data-page="applications">
                <i class="fas fa-file-alt mr-3"></i>
                Verifikasi & Persetujuan
            </a>
            <a href="#" onclick="navigateTo('cards')" class="sidebar-link flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-200" data-page="cards">
                <i class="fas fa-id-card mr-3"></i>
                Kartu Visitor
            </a>
            <a href="#" onclick="navigateTo('history')" class="sidebar-link flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-200" data-page="history">
                <i class="fas fa-history mr-3"></i>
                Riwayat Pengembalian
            </a>
            <a href="#" onclick="navigateTo('reports')" class="sidebar-link flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-200" data-page="reports">
                <i class="fas fa-chart-bar mr-3"></i>
                Laporan
            </a>
        </nav>

        <div class="absolute bottom-0 w-full p-6">
            <button onclick="logout()" class="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200">
                <i class="fas fa-sign-out-alt mr-2"></i>
                Logout
            </button>
        </div>
    </div>

    <!-- Main Content -->
    <div class="lg:ml-64">
        <!-- Top Bar -->
        <div class="bg-white shadow-sm border-b">
            <div class="flex items-center justify-between px-6 py-4">
                <div class="flex items-center">
                    <button id="sidebarToggle" class="lg:hidden mr-4 text-gray-600">
                        <i class="fas fa-bars text-xl"></i>
                    </button>
                    <h1 id="pageTitle" class="text-xl font-semibold text-gray-800">Dashboard</h1>
                </div>
                <div class="flex items-center space-x-4">
                    <span id="adminName" class="text-gray-600"></span>
                    <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        <i class="fas fa-user"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Content Area -->
        <div class="p-6">
            <!-- Login Form -->
            <div id="loginForm" class="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
                <div class="text-center mb-6">
                    <i class="fas fa-user-shield text-4xl text-blue-600 mb-4"></i>
                    <h2 class="text-2xl font-bold text-gray-800">Login Admin</h2>
                    <p class="text-gray-600">Masuk untuk mengakses dashboard admin</p>
                </div>
                <form onsubmit="auth.login(event)">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input type="email" id="loginEmail" value="superadmin@stasiun.com"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input type="password" id="loginPassword" value="password123"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    </div>
                    <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
                        <i class="fas fa-sign-in-alt mr-2"></i>
                        Login
                    </button>
                </form>
            </div>

            <!-- Page Content Container -->
            <div id="pageContent" class="hidden">
                <!-- Content will be loaded here dynamically -->
            </div>
        </div>
    </div>

    <!-- Modals Container -->
    <div id="modalsContainer"></div>

    <!-- Core Scripts -->
    <script src="/js/admin/core/auth.js"></script>
    <script src="/js/admin/core/api.js"></script>
    <script src="/js/admin/core/utils.js"></script>
    <script src="/js/admin/core/app.js"></script>

    <!-- Page Scripts -->
    <script src="/js/admin/pages/dashboard.js"></script>
    <script src="/js/admin/pages/applications.js"></script>
    <script src="/js/admin/pages/cards.js"></script>
    <script src="/js/admin/pages/history.js"></script>
    <script src="/js/admin/pages/reports.js"></script>

    <!-- Components Scripts -->
    <script src="/js/admin/components/modals.js"></script>
    <script src="/js/admin/components/tables.js"></script>

    <script>
        // Initialize app when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            app.init();
        });
    </script>
</body>
</html>
