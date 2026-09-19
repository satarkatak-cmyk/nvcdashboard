// Filter System for Dashboard Detail Pages
// Provides reusable filtering and search functionality

class FilterSystem {
    constructor(options = {}) {
        this.containerId = options.containerId;
        this.apiMethod = options.apiMethod;
        this.tableBodyId = options.tableBodyId;
        this.chartUpdateMethod = options.chartUpdateMethod;
        this.mapUpdateMethod = options.mapUpdateMethod;
        this.statUpdateMethod = options.statUpdateMethod;
        
        this.filters = {
            district: '',
            startDate: '',
            endDate: '',
            status: '',
            search: '',
            customFilters: {}
        };
        
        this.initializeFilters();
    }

    initializeFilters() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Add event listeners
        this.attachEventListeners();
    }

    createFilterUI(container) {
        const filterHTML = `
            <div class="filter-container" id="${this.containerId}-filters">
                <div class="filter-group">
                    <label>जिल्ला</label>
                    <select id="${this.containerId}-district-filter" class="filter-select">
                        <option value="">सबै जिल्ला</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label>सुरु मिति</label>
                    <input type="date" id="${this.containerId}-start-date" class="filter-input">
                </div>
                
                <div class="filter-group">
                    <label>अन्त्य मिति</label>
                    <input type="date" id="${this.containerId}-end-date" class="filter-input">
                </div>
                
                <div class="filter-group">
                    <label>स्थिति</label>
                    <select id="${this.containerId}-status-filter" class="filter-select">
                        <option value="">सबै स्थिति</option>
                        <option value="pending">पेन्डिङ</option>
                        <option value="in_progress">प्रगति मा</option>
                        <option value="resolved">सम्पन्न</option>
                        <option value="completed">सम्पन्न</option>
                        <option value="ongoing">चालू</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label>खोज्नुहोस्</label>
                    <input type="text" id="${this.containerId}-search" class="filter-input" placeholder="नाम, नम्बर...">
                </div>
                
                <button class="filter-button" id="${this.containerId}-apply-filters">
                    <i class="fas fa-filter"></i> फिल्टर लागू गर्नुहोस्
                </button>
                
                <button class="filter-button" id="${this.containerId}-reset-filters" style="background: #6c757d;">
                    <i class="fas fa-undo"></i> रिसेट
                </button>
                
                <button class="filter-button" id="${this.containerId}-export-data" style="background: #28a745;">
                    <i class="fas fa-download"></i> निर्यात
                </button>
            </div>
        `;

        // Insert filter HTML at the beginning of the container
        container.insertAdjacentHTML('afterbegin', filterHTML);
        
        // Load districts for dropdown
        this.loadDistricts();
    }

    async loadDistricts() {
        try {
            const districtSelect = document.getElementById(`${this.containerId}-district-filter`);
            if (!districtSelect) return;

            // Nepal districts (you can expand this list)
            const districts = [
                "झापा", "मोरङ", "सुनसरी", "इलाम", "पाँचथर", "धनकुटा", "तेह्रथुम", "संखुवासभा", "उदयपुर", "कोशी", "भोजपुर", "ताप्लेजुङ", "सोलुखुम्बु",
                "नुवाकोट", "धादिङ", "रामेछाप", "सिन्धुपाल्चोक", "काभ्रेपलाञ्चोक", "ललितपुर", "भक्तपुर", "नारायणगढ", "मकवानपुर", "सिन्धुली", "रसुवा",
                "बारा", "पर्सा", "रौतहट", "सर्लाही", "महोत्तरी", "रुपन्देही", "चितवन", "नवलपरासी", "धानुषा", "तनहुँ",
                "गोरखा", "लमजुङ", "तनहुँ", "स्याङ्जा", "कास्की", "मनाङ", "मुस्ताङ", "म्याग्दी", "पर्वत", "बागलुङ",
                "डोल्पा", "मुगु", "रुकुम", "रोल्पा", "प्युठान", "अर्घाखाँची", "सल्यान", "दैलेख", "जाजरकोट", "कालिकोट", "जुम्ला",
                "सुर्खेत", "दाङ", "बाँके", "बर्दिया", "कैलाली", "अछाम", "दोलखा", "रुकुम (पूर्व)", "रोल्पा (पूर्व)",
                "बाजुरा", "डोल्पा", "हुम्ला", "जुम्ला", "कालिकोट", "मुगु", "रुकुम (पश्चिम)", "सल्यान",
                "कञ्चनपुर", "सुदूरपश्चिम", "बैतडी", "डडेल्धुरा", "डोटी", "दार्चुला", "अछाम"
            ];

            districts.sort().forEach(district => {
                const option = document.createElement('option');
                option.value = district;
                option.textContent = district;
                districtSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading districts:', error);
        }
    }

    attachEventListeners() {
        // Apply filters button
        const applyButton = document.getElementById(`${this.containerId}-apply-filters`);
        if (applyButton) {
            applyButton.addEventListener('click', () => this.applyFilters());
        }

        // Reset filters button
        const resetButton = document.getElementById(`${this.containerId}-reset-filters`);
        if (resetButton) {
            resetButton.addEventListener('click', () => this.resetFilters());
        }

        // Export button
        const exportButton = document.getElementById(`${this.containerId}-export-data`);
        if (exportButton) {
            exportButton.addEventListener('click', () => this.exportData());
        }

        // Enter key for search
        const searchInput = document.getElementById(`${this.containerId}-search`);
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applyFilters();
                }
            });
        }
    }

    getFilterValues() {
        return {
            district: document.getElementById(`${this.containerId}-district-filter`)?.value || '',
            start_date: document.getElementById(`${this.containerId}-start-date`)?.value || '',
            end_date: document.getElementById(`${this.containerId}-end-date`)?.value || '',
            status: document.getElementById(`${this.containerId}-status-filter`)?.value || '',
            search: document.getElementById(`${this.containerId}-search`)?.value || ''
        };
    }

    async applyFilters() {
        this.filters = this.getFilterValues();
        
        try {
            // Show loading state
            this.showLoading();

            // Fetch filtered data
            const result = await this.apiMethod(this.filters);
            
            if (result.success) {
                // Update table
                this.updateTable(result.data);
                
                // Update charts if callback provided
                if (this.chartUpdateMethod) {
                    this.chartUpdateMethod(result.data);
                }
                
                // Update map if callback provided
                if (this.mapUpdateMethod) {
                    this.mapUpdateMethod(result.data);
                }
                
                // Update statistics if callback provided
                if (this.statUpdateMethod) {
                    this.statUpdateMethod(result.data);
                }
                
                showToast('फिल्टर सफलतापूर्वक लागू भयो', 'success');
            } else {
                showToast('फिल्टर लागू गर्नमा समस्या: ' + result.error, 'error');
            }
        } catch (error) {
            console.error('Error applying filters:', error);
            showToast('फिल्टर लागू गर्नमा समस्या: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    resetFilters() {
        // Reset all filter inputs
        document.getElementById(`${this.containerId}-district-filter`).value = '';
        document.getElementById(`${this.containerId}-start-date`).value = '';
        document.getElementById(`${this.containerId}-end-date`).value = '';
        document.getElementById(`${this.containerId}-status-filter`).value = '';
        document.getElementById(`${this.containerId}-search`).value = '';
        
        // Reset internal filter state
        this.filters = {
            district: '',
            startDate: '',
            endDate: '',
            status: '',
            search: '',
            customFilters: {}
        };
        
        // Reload all data
        this.applyFilters();
        showToast('फिल्टर रिसेट भयो', 'success');
    }

    updateTable(data) {
        const tableBody = document.getElementById(this.tableBodyId);
        if (!tableBody) return;

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="10">कुनै अभिलेख फेला परेन।</td></tr>';
            return;
        }

        // This is a generic table update - should be overridden for specific implementations
        tableBody.innerHTML = data.map(row => this.createTableRow(row)).join('');
    }

    createTableRow(row) {
        // Generic table row creation - should be overridden
        return `
            <tr>
                <td>${row.id || '-'}</td>
                <td>${new Date(row.created_at).toLocaleDateString('ne-NP')}</td>
                <td>विवरण हेर्नुहोस्</td>
            </tr>
        `;
    }

    exportData() {
        try {
            const table = document.querySelector(`#${this.tableBodyId}`).closest('table');
            if (!table) {
                showToast('तालिका फेला परेन', 'error');
                return;
            }

            const rows = Array.from(table.querySelectorAll('tr'));
            const csv = rows.map(row => {
                const cells = Array.from(row.querySelectorAll('td, th'));
                return cells.map(cell => `"${cell.textContent.trim()}"`).join(',');
            }).join('\n');

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', `${this.containerId}_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showToast('डाटा सफलतापूर्वक निर्यात भयो', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            showToast('निर्यात गर्नमा समस्या: ' + error.message, 'error');
        }
    }

    showLoading() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.classList.add('loading');
        }
    }

    hideLoading() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.classList.remove('loading');
        }
    }

    addCustomFilter(name, elementId, getValueCallback) {
        this.filters.customFilters[name] = {
            elementId: elementId,
            getValue: getValueCallback
        };
    }
}

// Global filter instances
const filterSystems = {};

// Initialize filter systems for different modules
function initializeFilterSystems() {
    // Ujuri Filter System
    if (document.getElementById('ujiriVivaranContent')) {
        filterSystems.ujiri = new FilterSystem({
            containerId: 'ujiriVivaranContent',
            apiMethod: UjuriAPI.getAll,
            tableBodyId: 'ujiriTable',
            chartUpdateMethod: (data) => {
                // Update charts with filtered data
                const districtData = {};
                data.forEach(item => {
                    if (item.district) {
                        districtData[item.district] = (districtData[item.district] || 0) + 1;
                    }
                });
                if (window.dashboardManager) {
                    window.dashboardManager.updateUjiriMap(districtData);
                }
            }
        });
    }

    // Office Monitoring Filter System
    if (document.getElementById('officeMonDetailContainer')) {
        filterSystems.officeMonitoring = new FilterSystem({
            containerId: 'officeMonDetailContainer',
            apiMethod: OfficeMonitoringAPI.getAll,
            tableBodyId: 'officeMonitoringTable',
            chartUpdateMethod: (data) => {
                const districtData = {};
                data.forEach(item => {
                    if (item.district) {
                        districtData[item.district] = (districtData[item.district] || 0) + 1;
                    }
                });
                if (window.dashboardManager) {
                    window.dashboardManager.updateOfficeMonitoringMaps({ by_district: Object.keys(districtData).map(d => ({ district: d, count: districtData[d] })) });
                }
            }
        });
    }

    // Dress Time Filter System
    if (document.getElementById('dressTimeDetailContainer')) {
        filterSystems.dressTime = new FilterSystem({
            containerId: 'dressTimeDetailContainer',
            apiMethod: DressTimeAPI.getAll,
            tableBodyId: 'dressTimeTable',
            chartUpdateMethod: (data) => {
                const districtData = {};
                data.forEach(item => {
                    if (item.district) {
                        districtData[item.district] = (districtData[item.district] || 0) + 1;
                    }
                });
                if (window.dashboardManager) {
                    window.dashboardManager.updateDressTimeMaps({ by_district: Object.keys(districtData).map(d => ({ district: d, count: districtData[d] })) });
                }
            }
        });
    }

    // Survey Filter System
    if (document.getElementById('surveyDashboardContainer')) {
        filterSystems.survey = new FilterSystem({
            containerId: 'surveyDashboardContainer',
            apiMethod: SurveyAPI.getAll,
            tableBodyId: 'surveyTable',
            chartUpdateMethod: (data) => {
                const districtData = {};
                data.forEach(item => {
                    if (item.district) {
                        districtData[item.district] = (districtData[item.district] || 0) + 1;
                    }
                });
                if (window.dashboardManager) {
                    window.dashboardManager.updateSurveyMap({ by_district: Object.keys(districtData).map(d => ({ district: d, count: districtData[d] })) });
                }
            }
        });
    }

    // Investigation Filter System
    if (document.getElementById('chhanbinContent')) {
        filterSystems.investigations = new FilterSystem({
            containerId: 'chhanbinContent',
            apiMethod: InvestigationsAPI.getAll,
            tableBodyId: 'chhanbinTable'
        });
    }

    // Technical Audit Filter System
    if (document.getElementById('technicalAuditContent')) {
        filterSystems.technicalAudit = new FilterSystem({
            containerId: 'technicalAuditContent',
            apiMethod: TechnicalAuditAPI.getAll,
            tableBodyId: 'taTable'
        });
    }

    // Project Monitoring Filter System
    if (document.getElementById('projectMonitoringDashboard')) {
        filterSystems.projectMonitoring = new FilterSystem({
            containerId: 'projectMonitoringDashboard',
            apiMethod: ProjectMonitoringAPI.getAll,
            tableBodyId: 'projectMonitoringTable',
            chartUpdateMethod: (data) => {
                const districtData = {};
                data.forEach(item => {
                    if (item.district) {
                        districtData[item.district] = (districtData[item.district] || 0) + 1;
                    }
                });
                if (window.dashboardManager) {
                    window.dashboardManager.updateProjectMonitoringMap({ by_district: Object.keys(districtData).map(d => ({ district: d, count: districtData[d] })) });
                }
            }
        });
    }
}

// Initialize filter systems when DOM is ready
document.addEventListener('DOMContentLoaded', initializeFilterSystems);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FilterSystem,
        filterSystems,
        initializeFilterSystems
    };
}