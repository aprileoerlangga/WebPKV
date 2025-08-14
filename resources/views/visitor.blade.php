<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Pengajuan Kartu Visitor - Stasiun Yogyakarta</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
    <!-- Header -->
    <header class="bg-white shadow-lg">
        <div class="container mx-auto px-6 py-4">
            <div class="flex items-center justify-center">
                <div class="flex items-center space-x-3">
                    <i class="fas fa-train text-3xl text-blue-600"></i>
                    <div class="text-center">
                        <h1 class="text-2xl font-bold text-gray-800">Sistem Kartu Visitor</h1>
                        <p class="text-sm text-gray-600">Stasiun Yogyakarta</p>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-8">
        <div class="text-center mb-12">
            <h2 class="text-4xl font-bold text-gray-800 mb-4">Selamat Datang</h2>
            <p class="text-xl text-gray-600 mb-8">Pilih layanan yang Anda butuhkan</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition duration-300">
                    <div class="text-center">
                        <i class="fas fa-file-plus text-5xl text-blue-600 mb-4"></i>
                        <h3 class="text-2xl font-semibold text-gray-800 mb-4">Ajukan Permohonan</h3>
                        <p class="text-gray-600 mb-6">Buat pengajuan kartu visitor baru untuk mengunjungi stasiun</p>
                        <a href="#application" onclick="showApplicationForm()"
                           class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium inline-block">
                            Mulai Pengajuan
                        </a>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition duration-300">
                    <div class="text-center">
                        <i class="fas fa-search text-5xl text-green-600 mb-4"></i>
                        <h3 class="text-2xl font-semibold text-gray-800 mb-4">Cek Status Pengajuan</h3>
                        <p class="text-gray-600 mb-6">Periksa status pengajuan kartu visitor Anda</p>
                        <a href="#status" onclick="showStatusCheck()"
                           class="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium inline-block">
                            Cek Status
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Application Form (Hidden by default) -->
        <div id="applicationForm" class="hidden max-w-4xl mx-auto">
            <div class="bg-white rounded-xl shadow-lg p-8">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-gray-800 mb-2">Formulir Pengajuan Kartu Visitor</h2>
                    <p class="text-gray-600">Lengkapi data berikut untuk mengajukan kartu visitor</p>
                </div>

                <div class="text-center py-8">
                    <i class="fas fa-tools text-4xl text-gray-400 mb-4"></i>
                    <p class="text-gray-600">Form pengajuan sedang dalam pengembangan.</p>
                    <p class="text-gray-500 text-sm">Silakan hubungi admin untuk sementara waktu.</p>
                    <button onclick="hideForm()" class="mt-4 bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700">
                        Kembali
                    </button>
                </div>
            </div>
        </div>

        <!-- Status Check (Hidden by default) -->
        <div id="statusCheck" class="hidden max-w-2xl mx-auto">
            <div class="bg-white rounded-xl shadow-lg p-8">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-gray-800 mb-2">Cek Status Pengajuan</h2>
                    <p class="text-gray-600">Masukkan nomor pengajuan untuk melihat status</p>
                </div>

                <div class="text-center py-8">
                    <i class="fas fa-tools text-4xl text-gray-400 mb-4"></i>
                    <p class="text-gray-600">Fitur cek status sedang dalam pengembangan.</p>
                    <p class="text-gray-500 text-sm">Silakan hubungi admin untuk informasi status pengajuan.</p>
                    <button onclick="hideForm()" class="mt-4 bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700">
                        Kembali
                    </button>
                </div>
            </div>
        </div>

        <!-- Contact Info -->
        <div class="bg-white rounded-xl shadow-lg p-8 mt-8 max-w-4xl mx-auto">
            <h3 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Informasi Kontak</h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                    <i class="fas fa-phone text-3xl text-blue-600 mb-3"></i>
                    <h4 class="font-semibold text-gray-800">Telepon</h4>
                    <p class="text-gray-600">+62 274 123456</p>
                </div>
                <div>
                    <i class="fas fa-envelope text-3xl text-green-600 mb-3"></i>
                    <h4 class="font-semibold text-gray-800">Email</h4>
                    <p class="text-gray-600">info@stasiun-yogya.co.id</p>
                </div>
                <div>
                    <i class="fas fa-map-marker-alt text-3xl text-red-600 mb-3"></i>
                    <h4 class="font-semibold text-gray-800">Alamat</h4>
                    <p class="text-gray-600">Jl. Pasar Kembang, Yogyakarta</p>
                </div>
            </div>

            <div class="text-center mt-8">
                <a href="/admin" class="text-blue-600 hover:text-blue-800 text-sm">
                    <i class="fas fa-cog mr-1"></i>Admin Login
                </a>
            </div>
        </div>
    </main>

    <script>
        function showApplicationForm() {
            document.getElementById('applicationForm').classList.remove('hidden');
            document.getElementById('statusCheck').classList.add('hidden');
            document.querySelector('main > div:first-child').classList.add('hidden');
        }

        function showStatusCheck() {
            document.getElementById('statusCheck').classList.remove('hidden');
            document.getElementById('applicationForm').classList.add('hidden');
            document.querySelector('main > div:first-child').classList.add('hidden');
        }

        function hideForm() {
            document.getElementById('applicationForm').classList.add('hidden');
            document.getElementById('statusCheck').classList.add('hidden');
            document.querySelector('main > div:first-child').classList.remove('hidden');
        }
    </script>
</body>
</html>
