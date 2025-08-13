<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard - Visitor Card System</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
</head>
<body class="bg-gray-100">
    <div id="app" class="container mx-auto p-6">
        <h1 class="text-3xl font-bold mb-6">Admin Dashboard - Visitor Card System</h1>

        <!-- Login Form -->
        <div id="loginForm" class="bg-white p-6 rounded-lg shadow-md max-w-md">
            <h2 class="text-xl font-semibold mb-4">Login Admin</h2>
            <form onsubmit="login(event)">
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-2">Email</label>
                    <input type="email" id="email" value="superadmin@stasiun.com" class="w-full border rounded px-3 py-2" required>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-2">Password</label>
                    <input type="password" id="password" value="password123" class="w-full border rounded px-3 py-2" required>
                </div>
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Login</button>
            </form>
        </div>

        <!-- Dashboard -->
        <div id="dashboard" style="display: none;">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h3 class="text-lg font-semibold">Pengunjung Aktif</h3>
                    <p id="activeVisitors" class="text-3xl font-bold text-blue-600">-</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h3 class="text-lg font-semibold">Pending Applications</h3>
                    <p id="pendingApplications" class="text-3xl font-bold text-yellow-600">-</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h3 class="text-lg font-semibold">Kartu Diserahkan Hari Ini</h3>
                    <p id="cardsIssuedToday" class="text-3xl font-bold text-green-600">-</p>
                </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-xl font-semibold mb-4">Quick Actions</h3>
                <div class="space-x-4">
                    <button onclick="loadApplications()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">View Applications</button>
                    <button onclick="loadCards()" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Manage Cards</button>
                    <button onclick="logout()" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
                </div>
            </div>

            <div id="content" class="mt-6"></div>
        </div>
    </div>

    <script>
        let token = localStorage.getItem('admin_token');

        if (token) {
            showDashboard();
        }

        async function login(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await axios.post('/api/admin/login', {
                    email: email,
                    password: password
                });

                token = response.data.data.token;
                localStorage.setItem('admin_token', token);
                showDashboard();
            } catch (error) {
                alert('Login failed: ' + error.response.data.message);
            }
        }

        async function showDashboard() {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            loadDashboardStats();
        }

        async function loadDashboardStats() {
            try {
                const response = await axios.get('/api/admin/dashboard', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const stats = response.data.data;
                document.getElementById('activeVisitors').textContent = stats.active_visitors;
                document.getElementById('pendingApplications').textContent = stats.pending_applications;
                document.getElementById('cardsIssuedToday').textContent = stats.cards_issued_today;
            } catch (error) {
                console.error('Error loading dashboard:', error);
            }
        }

        async function loadApplications() {
            try {
                const response = await axios.get('/api/admin/applications', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const applications = response.data.data.data;
                let html = '<div class="bg-white p-6 rounded-lg shadow-md"><h3 class="text-xl font-semibold mb-4">Applications</h3><div class="overflow-x-auto"><table class="min-w-full table-auto"><thead><tr class="bg-gray-50"><th class="px-4 py-2 text-left">Application #</th><th class="px-4 py-2 text-left">Name</th><th class="px-4 py-2 text-left">Company</th><th class="px-4 py-2 text-left">Status</th><th class="px-4 py-2 text-left">Station</th></tr></thead><tbody>';

                applications.forEach(app => {
                    html += `<tr class="border-b"><td class="px-4 py-2">${app.application_number}</td><td class="px-4 py-2">${app.full_name}</td><td class="px-4 py-2">${app.company_institution}</td><td class="px-4 py-2"><span class="px-2 py-1 rounded text-sm ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : app.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${app.status}</span></td><td class="px-4 py-2">${app.station.name}</td></tr>`;
                });

                html += '</tbody></table></div></div>';
                document.getElementById('content').innerHTML = html;
            } catch (error) {
                console.error('Error loading applications:', error);
            }
        }

        async function loadCards() {
            try {
                const response = await axios.get('/api/admin/cards', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const cards = response.data.data.data;
                let html = '<div class="bg-white p-6 rounded-lg shadow-md"><h3 class="text-xl font-semibold mb-4">Visitor Cards</h3><div class="overflow-x-auto"><table class="min-w-full table-auto"><thead><tr class="bg-gray-50"><th class="px-4 py-2 text-left">Card #</th><th class="px-4 py-2 text-left">Applicant</th><th class="px-4 py-2 text-left">Status</th><th class="px-4 py-2 text-left">Issued Date</th><th class="px-4 py-2 text-left">Station</th></tr></thead><tbody>';

                cards.forEach(card => {
                    html += `<tr class="border-b"><td class="px-4 py-2">${card.card_number}</td><td class="px-4 py-2">${card.application.full_name}</td><td class="px-4 py-2"><span class="px-2 py-1 rounded text-sm ${card.status === 'issued' ? 'bg-blue-100 text-blue-800' : card.status === 'returned' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${card.status}</span></td><td class="px-4 py-2">${new Date(card.issued_at).toLocaleDateString()}</td><td class="px-4 py-2">${card.application.station.name}</td></tr>`;
                });

                html += '</tbody></table></div></div>';
                document.getElementById('content').innerHTML = html;
            } catch (error) {
                console.error('Error loading cards:', error);
            }
        }

        function logout() {
            localStorage.removeItem('admin_token');
            token = null;
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('dashboard').style.display = 'none';
            document.getElementById('content').innerHTML = '';
        }
    </script>
</body>
</html>
