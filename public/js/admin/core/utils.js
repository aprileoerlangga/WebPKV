// Utilities Module
const utils = {
    // Loading indicator
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    },

    // Alert system
    showAlert(message, type = 'info') {
        const alertColors = {
            success: 'bg-green-100 text-green-800 border-green-200',
            error: 'bg-red-100 text-red-800 border-red-200',
            warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            info: 'bg-blue-100 text-blue-800 border-blue-200'
        };

        const alertIcons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        const alertDiv = document.createElement('div');
        alertDiv.className = `p-4 border rounded-md ${alertColors[type]} transition-all duration-300 transform translate-x-full`;
        alertDiv.innerHTML = `
            <div class="flex items-center">
                <i class="${alertIcons[type]} mr-2"></i>
                <span class="flex-1">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-3 text-sm hover:opacity-75">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        const container = document.getElementById('alertContainer');
        container.appendChild(alertDiv);

        // Animate in
        setTimeout(() => {
            alertDiv.classList.remove('translate-x-full');
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            alertDiv.classList.add('translate-x-full');
            setTimeout(() => {
                if (alertDiv.parentElement) {
                    alertDiv.remove();
                }
            }, 300);
        }, 5000);
    },

    // Date formatting
    formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    },

    formatDateTime(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Status badge helpers
    getStatusBadgeClass(status) {
        const statusClasses = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            cancelled: 'bg-gray-100 text-gray-800',
            issued: 'bg-blue-100 text-blue-800',
            returned: 'bg-green-100 text-green-800',
            damaged: 'bg-red-100 text-red-800',
            lost: 'bg-gray-100 text-gray-800'
        };
        return statusClasses[status] || 'bg-gray-100 text-gray-800';
    },

    getStatusText(status) {
        const statusTexts = {
            pending: 'Menunggu',
            approved: 'Disetujui',
            rejected: 'Ditolak',
            cancelled: 'Dibatalkan',
            issued: 'Aktif',
            returned: 'Dikembalikan',
            damaged: 'Rusak',
            lost: 'Hilang'
        };
        return statusTexts[status] || status;
    },

    getConditionBadgeClass(condition) {
        const conditionClasses = {
            good: 'bg-green-100 text-green-800',
            damaged: 'bg-red-100 text-red-800',
            lost: 'bg-gray-100 text-gray-800'
        };
        return conditionClasses[condition] || 'bg-green-100 text-green-800';
    },

    getConditionText(condition) {
        const conditionTexts = {
            good: 'Baik',
            damaged: 'Rusak',
            lost: 'Hilang'
        };
        return conditionTexts[condition] || 'Baik';
    },

    // Form helpers
    getFormData(formElement) {
        const formData = new FormData(formElement);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        return data;
    },

    // Pagination helpers
    createPagination(data, onPageChange) {
        if (!data.links) return '';

        const links = data.links.map(link => {
            if (link.url === null) {
                return `<span class="px-3 py-2 text-gray-500">${link.label}</span>`;
            }

            const isActive = link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50';
            const page = new URL(link.url).searchParams.get('page');

            return `
                <button onclick="${onPageChange}(${page})"
                        class="px-3 py-2 border ${isActive} transition duration-200">
                    ${link.label}
                </button>
            `;
        }).join('');

        return `
            <div class="flex items-center justify-between mt-6">
                <div class="text-sm text-gray-700">
                    Showing ${data.from || 0} to ${data.to || 0} of ${data.total || 0} results
                </div>
                <div class="flex space-x-1">
                    ${links}
                </div>
            </div>
        `;
    },

    // Search and filter helpers
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Table helpers
    createTableHeader(columns) {
        const headers = columns.map(col =>
            `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${col}</th>`
        ).join('');

        return `
            <thead class="bg-gray-50">
                <tr>${headers}</tr>
            </thead>
        `;
    },

    // Export helpers
    async exportReport(endpoint, filename, params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
            await api.downloadFile(fullEndpoint, filename);
        } catch (error) {
            this.showAlert('Error exporting report: ' + error.message, 'error');
        }
    },

    // Confirmation dialog
    confirm(message, onConfirm, onCancel = null) {
        const confirmed = window.confirm(message);
        if (confirmed && onConfirm) {
            onConfirm();
        } else if (!confirmed && onCancel) {
            onCancel();
        }
        return confirmed;
    },

    // Input validation helpers
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    validatePhone(phone) {
        const re = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
        return re.test(phone);
    },

    validateIdCard(idCard) {
        const re = /^[0-9]{16}$/;
        return re.test(idCard);
    },

    // Local storage helpers
    setStorageItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    getStorageItem(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },

    removeStorageItem(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    },

    // Number formatting
    formatNumber(number) {
        return new Intl.NumberFormat('id-ID').format(number);
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    }
};
