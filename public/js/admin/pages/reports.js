// Reports Page Module
const reports = {
    data: {
        currentReport: null,
        reportData: null
    },

    render() {
        return `
            <!-- Report Configuration -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- Card Issuance Report -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center mb-4">
                        <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                            <i class="fas fa-hand-holding text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">Laporan Penyerahan Kartu</h3>
                            <p class="text-sm text-gray-600">Laporan kartu yang diserahkan kepada pengunjung</p>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Periode</label>
                            <select id="issuancePeriod" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="daily">Harian</option>
                                <option value="weekly">Mingguan</option>
                                <option value="monthly" selected>Bulanan</option>
                                <option value="yearly">Tahunan</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                            <input type="date" id="issuanceDate" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="reports.generateIssuanceReport()" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
                                <i class="fas fa-chart-line mr-2"></i>Lihat Laporan
                            </button>
                            <button onclick="reports.exportIssuanceReport()" class="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200">
                                <i class="fas fa-download mr-2"></i>Export Excel
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Card Return Report -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center mb-4">
                        <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                            <i class="fas fa-undo text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">Laporan Pengembalian Kartu</h3>
                            <p class="text-sm text-gray-600">Laporan kartu yang dikembalikan oleh pengunjung</p>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Periode</label>
                            <select id="returnPeriod" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="daily">Harian</option>
                                <option value="weekly">Mingguan</option>
                                <option value="monthly" selected>Bulanan</option>
                                <option value="yearly">Tahunan</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                            <input type="date" id="returnDate" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="reports.generateReturnReport()" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
                                <i class="fas fa-chart-line mr-2"></i>Lihat Laporan
                            </button>
                            <button onclick="reports.exportReturnReport()" class="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200">
                                <i class="fas fa-download mr-2"></i>Export Excel
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Stats -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 class="text-lg font-semibold mb-4">Statistik Hari Ini</h3>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="text-center p-4 bg-blue-50 rounded-lg">
                        <i class="fas fa-hand-holding text-2xl text-blue-600 mb-2"></i>
                        <p class="text-sm text-blue-600">Kartu Diserahkan</p>
                        <p id="todayIssued" class="text-2xl font-bold text-blue-700">-</p>
                    </div>
                    <div class="text-center p-4 bg-green-50 rounded-lg">
                        <i class="fas fa-undo text-2xl text-green-600 mb-2"></i>
                        <p class="text-sm text-green-600">Kartu Dikembalikan</p>
                        <p id="todayReturned" class="text-2xl font-bold text-green-700">-</p>
                    </div>
                    <div class="text-center p-4 bg-red-50 rounded-lg">
                        <i class="fas fa-exclamation-triangle text-2xl text-red-600 mb-2"></i>
                        <p class="text-sm text-red-600">Kartu Rusak</p>
                        <p id="todayDamaged" class="text-2xl font-bold text-red-700">-</p>
                    </div>
                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                        <i class="fas fa-search text-2xl text-gray-600 mb-2"></i>
                        <p class="text-sm text-gray-600">Kartu Hilang</p>
                        <p id="todayLost" class="text-2xl font-bold text-gray-700">-</p>
                    </div>
                </div>
            </div>

            <!-- Report Results -->
            <div id="reportResults" class="hidden">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 id="reportTitle" class="text-lg font-semibold">Hasil Laporan</h3>
                        <button onclick="reports.clearReport()" class="text-gray-600 hover:text-gray-800">
                            <i class="fas fa-times"></i> Tutup Laporan
                        </button>
                    </div>

                    <!-- Report Summary -->
                    <div id="reportSummary" class="mb-6">
                        <!-- Summary will be rendered here -->
                    </div>

                    <!-- Report Table -->
                    <div id="reportTable" class="overflow-x-auto">
                        <!-- Table will be rendered here -->
                    </div>
                </div>
            </div>
        `;
    },

    async init() {
        await this.loadTodayStats();
    },

    async loadTodayStats() {
        try {
            const response = await api.get('/admin/dashboard');
            if (response.success) {
                const stats = response.data;
                document.getElementById('todayIssued').textContent = utils.formatNumber(stats.cards_issued_today);
                document.getElementById('todayReturned').textContent = utils.formatNumber(stats.cards_returned_today);
                document.getElementById('todayDamaged').textContent = utils.formatNumber(stats.damaged_cards);
                document.getElementById('todayLost').textContent = utils.formatNumber(stats.lost_cards);
            }
        } catch (error) {
            console.error('Error loading today stats:', error);
        }
    },

    async generateIssuanceReport() {
        const period = document.getElementById('issuancePeriod').value;
        const date = document.getElementById('issuanceDate').value;

        if (!date) {
            utils.showAlert('Silakan pilih tanggal terlebih dahulu', 'warning');
            return;
        }

        try {
            utils.showLoading(true);
            const response = await api.get(`/admin/reports/card-issuance?period=${period}&date=${date}`);

            if (response.success) {
                this.data.currentReport = 'issuance';
                this.data.reportData = response.data;
                this.renderReportResults('Laporan Penyerahan Kartu', response.data, response.summary);
            }
        } catch (error) {
            console.error('Error generating issuance report:', error);
            utils.showAlert('Error generating report: ' + error.message, 'error');
        } finally {
            utils.showLoading(false);
        }
    },

    async generateReturnReport() {
        const period = document.getElementById('returnPeriod').value;
        const date = document.getElementById('returnDate').value;

        if (!date) {
            utils.showAlert('Silakan pilih tanggal terlebih dahulu', 'warning');
            return;
        }

        try {
            utils.showLoading(true);
            const response = await api.get(`/admin/reports/card-return?period=${period}&date=${date}`);

            if (response.success) {
                this.data.currentReport = 'return';
                this.data.reportData = response.data;
                this.renderReportResults('Laporan Pengembalian Kartu', response.data, response.summary);
            }
        } catch (error) {
            console.error('Error generating return report:', error);
            utils.showAlert('Error generating report: ' + error.message, 'error');
        } finally {
            utils.showLoading(false);
        }
    },

    renderReportResults(title, data, summary) {
        document.getElementById('reportTitle').textContent = title;

        // Render summary
        this.renderReportSummary(summary);

        // Render table
        this.renderReportTable(data, summary);

        // Show results
        document.getElementById('reportResults').classList.remove('hidden');

        // Scroll to results
        document.getElementById('reportResults').scrollIntoView({ behavior: 'smooth' });
    },

    renderReportSummary(summary) {
        const summaryContainer = document.getElementById('reportSummary');

        let summaryHtml = `
            <div class="bg-gray-50 p-4 rounded-lg mb-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <p class="text-sm font-medium text-gray-700">Periode</p>
                        <p class="text-lg font-semibold text-gray-900">${this.getPeriodText(summary.period)}</p>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-700">Tanggal</p>
                        <p class="text-lg font-semibold text-gray-900">${utils.formatDate(summary.date_range.start)} - ${utils.formatDate(summary.date_range.end)}</p>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-700">Total Data</p>
                        <p class="text-lg font-semibold text-gray-900">${utils.formatNumber(summary.total_issued || summary.total_returned || 0)}</p>
                    </div>
                </div>
        `;

        if (summary.total_returned !== undefined) {
            // Return report summary
            summaryHtml += `
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="text-center p-3 bg-green-100 rounded-lg">
                        <p class="text-sm text-green-600">Kondisi Baik</p>
                        <p class="text-xl font-bold text-green-700">${utils.formatNumber(summary.good_condition)}</p>
                    </div>
                    <div class="text-center p-3 bg-red-100 rounded-lg">
                        <p class="text-sm text-red-600">Rusak</p>
                        <p class="text-xl font-bold text-red-700">${utils.formatNumber(summary.damaged)}</p>
                    </div>
                    <div class="text-center p-3 bg-gray-100 rounded-lg">
                        <p class="text-sm text-gray-600">Hilang</p>
                        <p class="text-xl font-bold text-gray-700">${utils.formatNumber(summary.lost)}</p>
                    </div>
                    <div class="text-center p-3 bg-blue-100 rounded-lg">
                        <p class="text-sm text-blue-600">Tingkat Kerusakan</p>
                        <p class="text-xl font-bold text-blue-700">${this.calculateDamageRate(summary)}%</p>
                    </div>
                </div>
            `;
        }

        summaryHtml += '</div>';
        summaryContainer.innerHTML = summaryHtml;
    },

    renderReportTable(data, summary) {
        const tableContainer = document.getElementById('reportTable');

        if (!data || data.length === 0) {
            tableContainer.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Tidak ada data</h3>
                    <p class="text-gray-600">Tidak ada data untuk periode yang dipilih</p>
                </div>
            `;
            return;
        }

        const isReturnReport = summary.total_returned !== undefined;

        const columns = isReturnReport ?
            ['No. Kartu', 'Nama Pemohon', 'Instansi', 'Tanggal Diserahkan', 'Tanggal Dikembalikan', 'Kondisi', 'Keterangan'] :
            ['No. Kartu', 'Nama Pemohon', 'Instansi', 'Stasiun', 'Tanggal Diserahkan', 'Diserahkan Oleh'];

        const tableHtml = `
            <table class="min-w-full divide-y divide-gray-200">
                ${utils.createTableHeader(columns)}
                <tbody class="bg-white divide-y divide-gray-200">
                    ${data.map(item => this.renderReportRow(item, isReturnReport)).join('')}
                </tbody>
            </table>
        `;

        tableContainer.innerHTML = tableHtml;
    },

    renderReportRow(item, isReturnReport) {
        if (isReturnReport) {
            return `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.card_number}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.application.full_name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.application.company_institution}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${utils.formatDate(item.issued_at)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${utils.formatDate(item.returned_at)}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${utils.getConditionBadgeClass(item.condition_when_returned)}">
                            ${utils.getConditionText(item.condition_when_returned)}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900">${item.damage_reason || '-'}</td>
                </tr>
            `;
        } else {
            return `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.card_number}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.application.full_name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.application.company_institution}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.application.station.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${utils.formatDateTime(item.issued_at)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.issuer ? item.issuer.name : '-'}</td>
                </tr>
            `;
        }
    },

    async exportIssuanceReport() {
        const period = document.getElementById('issuancePeriod').value;
        const date = document.getElementById('issuanceDate').value;

        if (!date) {
            utils.showAlert('Silakan pilih tanggal terlebih dahulu', 'warning');
            return;
        }

        const filename = `laporan-penyerahan-kartu-${period}-${date}.xlsx`;
        await utils.exportReport('/admin/reports/export/card-issuance', filename, { period, date });
    },

    async exportReturnReport() {
        const period = document.getElementById('returnPeriod').value;
        const date = document.getElementById('returnDate').value;

        if (!date) {
            utils.showAlert('Silakan pilih tanggal terlebih dahulu', 'warning');
            return;
        }

        const filename = `laporan-pengembalian-kartu-${period}-${date}.xlsx`;
        await utils.exportReport('/admin/reports/export/card-return', filename, { period, date });
    },

    clearReport() {
        document.getElementById('reportResults').classList.add('hidden');
        this.data.currentReport = null;
        this.data.reportData = null;
    },

    getPeriodText(period) {
        const periods = {
            daily: 'Harian',
            weekly: 'Mingguan',
            monthly: 'Bulanan',
            yearly: 'Tahunan'
        };
        return periods[period] || period;
    },

    calculateDamageRate(summary) {
        if (!summary.total_returned || summary.total_returned === 0) return 0;
        const damaged = (summary.damaged || 0) + (summary.lost || 0);
        return Math.round((damaged / summary.total_returned) * 100);
    }
};
