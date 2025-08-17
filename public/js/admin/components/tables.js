// Tables Component Module
const tables = {
    // Create a sortable table
    createSortableTable(data, columns, options = {}) {
        const {
            sortable = true,
            searchable = true,
            paginated = true,
            pageSize = 20,
            onRowClick = null,
            onSort = null,
            customRenderers = {}
        } = options;

        let currentSort = { column: null, direction: 'asc' };
        let currentPage = 1;
        let filteredData = [...data];

        const tableId = 'table_' + Math.random().toString(36).substr(2, 9);

        const renderTable = () => {
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const pageData = paginated ? filteredData.slice(startIndex, endIndex) : filteredData;

            const headerHtml = columns.map(col => {
                const sortIcon = currentSort.column === col.key ?
                    (currentSort.direction === 'asc' ? '↑' : '↓') : '';

                return `
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${sortable ? 'cursor-pointer hover:bg-gray-100' : ''}"
                        ${sortable ? `onclick="tables.sortTable('${tableId}', '${col.key}')"` : ''}>
                        ${col.label} ${sortIcon}
                    </th>
                `;
            }).join('');

            const rowsHtml = pageData.map(row => {
                const cellsHtml = columns.map(col => {
                    let value = this.getNestedValue(row, col.key);

                    // Apply custom renderer if available
                    if (customRenderers[col.key]) {
                        value = customRenderers[col.key](value, row);
                    } else if (col.renderer) {
                        value = col.renderer(value, row);
                    }

                    return `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${value}</td>`;
                }).join('');

                const rowClickHandler = onRowClick ? `onclick="${onRowClick}(${JSON.stringify(row).replace(/"/g, '&quot;')})"` : '';

                return `
                    <tr class="hover:bg-gray-50 transition duration-200 ${onRowClick ? 'cursor-pointer' : ''}" ${rowClickHandler}>
                        ${cellsHtml}
                    </tr>
                `;
            }).join('');

            const paginationHtml = paginated ? this.createPagination(filteredData.length, pageSize, currentPage, tableId) : '';

            return `
                <div class="table-container" id="${tableId}">
                    ${searchable ? `
                        <div class="mb-4">
                            <input type="text"
                                   placeholder="Cari..."
                                   class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   onkeyup="tables.searchTable('${tableId}', this.value)">
                        </div>
                    ` : ''}

                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>${headerHtml}</tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                ${rowsHtml}
                            </tbody>
                        </table>
                    </div>

                    ${paginationHtml}
                </div>
            `;
        };

        // Store table data and options for later use
        this.tables = this.tables || {};
        this.tables[tableId] = {
            data: data,
            columns: columns,
            options: options,
            currentSort: currentSort,
            currentPage: currentPage,
            filteredData: filteredData,
            render: renderTable
        };

        return renderTable();
    },

    // Sort table by column
    sortTable(tableId, columnKey) {
        const table = this.tables[tableId];
        if (!table) return;

        if (table.currentSort.column === columnKey) {
            table.currentSort.direction = table.currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            table.currentSort.column = columnKey;
            table.currentSort.direction = 'asc';
        }

        table.filteredData.sort((a, b) => {
            let aVal = this.getNestedValue(a, columnKey);
            let bVal = this.getNestedValue(b, columnKey);

            // Handle different data types
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (aVal < bVal) return table.currentSort.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return table.currentSort.direction === 'asc' ? 1 : -1;
            return 0;
        });

        table.currentPage = 1; // Reset to first page after sorting
        this.updateTable(tableId);

        // Call custom sort handler if provided
        if (table.options.onSort) {
            table.options.onSort(columnKey, table.currentSort.direction);
        }
    },

    // Search/filter table
    searchTable(tableId, searchTerm) {
        const table = this.tables[tableId];
        if (!table) return;

        if (!searchTerm.trim()) {
            table.filteredData = [...table.data];
        } else {
            const searchLower = searchTerm.toLowerCase();
            table.filteredData = table.data.filter(row => {
                return table.columns.some(col => {
                    const value = this.getNestedValue(row, col.key);
                    return String(value).toLowerCase().includes(searchLower);
                });
            });
        }

        table.currentPage = 1; // Reset to first page after search
        this.updateTable(tableId);
    },

    // Change page
    changePage(tableId, page) {
        const table = this.tables[tableId];
        if (!table) return;

        const totalPages = Math.ceil(table.filteredData.length / table.options.pageSize);
        if (page < 1 || page > totalPages) return;

        table.currentPage = page;
        this.updateTable(tableId);
    },

    // Update table display
    updateTable(tableId) {
        const table = this.tables[tableId];
        if (!table) return;

        const container = document.getElementById(tableId);
        if (container) {
            container.outerHTML = table.render();
        }
    },

    // Create pagination controls
    createPagination(totalItems, pageSize, currentPage, tableId) {
        const totalPages = Math.ceil(totalItems / pageSize);
        if (totalPages <= 1) return '';

        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        let paginationHtml = `
            <div class="flex items-center justify-between mt-6">
                <div class="text-sm text-gray-700">
                    Showing ${((currentPage - 1) * pageSize) + 1} to ${Math.min(currentPage * pageSize, totalItems)} of ${totalItems} results
                </div>
                <div class="flex space-x-1">
        `;

        // Previous button
        if (currentPage > 1) {
            paginationHtml += `
                <button onclick="tables.changePage('${tableId}', ${currentPage - 1})"
                        class="px-3 py-2 border bg-white text-gray-700 hover:bg-gray-50 transition duration-200">
                    Previous
                </button>
            `;
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === currentPage;
            paginationHtml += `
                <button onclick="tables.changePage('${tableId}', ${i})"
                        class="px-3 py-2 border ${isActive ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} transition duration-200">
                    ${i}
                </button>
            `;
        }

        // Next button
        if (currentPage < totalPages) {
            paginationHtml += `
                <button onclick="tables.changePage('${tableId}', ${currentPage + 1})"
                        class="px-3 py-2 border bg-white text-gray-700 hover:bg-gray-50 transition duration-200">
                    Next
                </button>
            `;
        }

        paginationHtml += `
                </div>
            </div>
        `;

        return paginationHtml;
    },

    // Get nested object value by key path (e.g., 'user.name')
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : '';
        }, obj);
    },

    // Export table data to CSV
    exportToCSV(tableId, filename = 'export.csv') {
        const table = this.tables[tableId];
        if (!table) return;

        const headers = table.columns.map(col => col.label);
        const rows = table.filteredData.map(row => {
            return table.columns.map(col => {
                let value = this.getNestedValue(row, col.key);
                // Remove HTML tags and clean value for CSV
                if (typeof value === 'string') {
                    value = value.replace(/<[^>]*>/g, '').replace(/"/g, '""');
                }
                return `"${value}"`;
            });
        });

        const csvContent = [headers.map(h => `"${h}"`), ...rows].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    },

    // Common renderers for typical data types
    renderers: {
        // Date renderer
        date: (value) => {
            if (!value) return '-';
            return utils.formatDate(value);
        },

        // DateTime renderer
        datetime: (value) => {
            if (!value) return '-';
            return utils.formatDateTime(value);
        },

        // Status badge renderer
        status: (value) => {
            if (!value) return '-';
            return `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${utils.getStatusBadgeClass(value)}">
                ${utils.getStatusText(value)}
            </span>`;
        },

        // Condition badge renderer
        condition: (value) => {
            if (!value) return '-';
            return `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${utils.getConditionBadgeClass(value)}">
                ${utils.getConditionText(value)}
            </span>`;
        },

        // Currency renderer
        currency: (value) => {
            if (value === null || value === undefined) return '-';
            return utils.formatCurrency(value);
        },

        // Number renderer
        number: (value) => {
            if (value === null || value === undefined) return '-';
            return utils.formatNumber(value);
        },

        // Boolean renderer
        boolean: (value) => {
            return value ? '<i class="fas fa-check text-green-600"></i>' : '<i class="fas fa-times text-red-600"></i>';
        },

        // Actions renderer (for action buttons)
        actions: (value, row, actions) => {
            if (!actions) return '';

            return actions.map(action => {
                const { label, icon, class: className = 'text-blue-600 hover:text-blue-900', onclick } = action;
                return `
                    <button onclick="${onclick}(${row.id})"
                            class="${className} transition duration-200 mr-2"
                            title="${label}">
                        <i class="${icon}"></i>
                    </button>
                `;
            }).join('');
        },

        // Link renderer
        link: (value, row, options = {}) => {
            if (!value) return '-';
            const { href = '#', target = '_blank', text = value } = options;
            return `<a href="${href}" target="${target}" class="text-blue-600 hover:text-blue-900 underline">${text}</a>`;
        },

        // Truncated text renderer
        truncate: (value, row, maxLength = 50) => {
            if (!value) return '-';
            if (value.length <= maxLength) return value;
            return `<span title="${value}">${value.substring(0, maxLength)}...</span>`;
        }
    },

    // Quick table for simple data display
    createQuickTable(data, columns, containerId) {
        const tableHtml = this.createSortableTable(data, columns, {
            sortable: false,
            searchable: false,
            paginated: false
        });

        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = tableHtml;
        }

        return tableHtml;
    },

    // Refresh table data
    refreshTable(tableId, newData) {
        const table = this.tables[tableId];
        if (!table) return;

        table.data = newData;
        table.filteredData = [...newData];
        table.currentPage = 1;
        this.updateTable(tableId);
    },

    // Get selected rows (for tables with checkboxes)
    getSelectedRows(tableId) {
        const checkboxes = document.querySelectorAll(`#${tableId} input[type="checkbox"]:checked`);
        return Array.from(checkboxes).map(cb => parseInt(cb.value)).filter(id => !isNaN(id));
    },

    // Add row selection capability
    addRowSelection(tableId, onSelectionChange = null) {
        const table = this.tables[tableId];
        if (!table) return;

        // Add selection column to existing columns
        const selectionColumn = {
            key: 'selection',
            label: '<input type="checkbox" onchange="tables.toggleAllRows(this, \'' + tableId + '\')">',
            renderer: (value, row) => `<input type="checkbox" value="${row.id}" onchange="tables.toggleRow(this, '${tableId}')">`
        };

        table.columns.unshift(selectionColumn);
        table.options.onSelectionChange = onSelectionChange;
        this.updateTable(tableId);
    },

    // Toggle single row selection
    toggleRow(checkbox, tableId) {
        const table = this.tables[tableId];
        if (!table) return;

        const allCheckboxes = document.querySelectorAll(`#${tableId} tbody input[type="checkbox"]`);
        const headerCheckbox = document.querySelector(`#${tableId} thead input[type="checkbox"]`);

        const checkedCount = Array.from(allCheckboxes).filter(cb => cb.checked).length;

        if (headerCheckbox) {
            headerCheckbox.indeterminate = checkedCount > 0 && checkedCount < allCheckboxes.length;
            headerCheckbox.checked = checkedCount === allCheckboxes.length;
        }

        if (table.options.onSelectionChange) {
            table.options.onSelectionChange(this.getSelectedRows(tableId));
        }
    },

    // Toggle all rows selection
    toggleAllRows(headerCheckbox, tableId) {
        const table = this.tables[tableId];
        if (!table) return;

        const allCheckboxes = document.querySelectorAll(`#${tableId} tbody input[type="checkbox"]`);

        allCheckboxes.forEach(checkbox => {
            checkbox.checked = headerCheckbox.checked;
        });

        headerCheckbox.indeterminate = false;

        if (table.options.onSelectionChange) {
            table.options.onSelectionChange(this.getSelectedRows(tableId));
        }
    }
};

// Make tables available globally
window.tables = tables;
