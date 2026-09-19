// Dashboard Manager
// Handles updating dashboard UI with statistics, charts, maps, and tables

class DashboardManager {
    constructor() {
        this.charts = {};
        this.maps = {};
    }

    // ============================================
    // UJIRI DASHBOARD UPDATES
    // ============================================
    updateUjiriDashboard(data) {
        // Update stat cards
        this.updateStatCard('ujiriStatTotal', data.total);
        this.updateStatCard('ujiriStatPending', data.pending);
        this.updateStatCard('ujiriStatResolved', data.resolved);
        this.updateStatCard('ujiriStatInProgress', data.in_progress);

        // Update charts
        this.updateUjiriCharts(data);

        // Update map
        this.updateUjiriMap(data.by_district);

        // Update table
        this.updateUjiriTable(data);
    }

    updateUjiriCharts(data) {
        // Status distribution chart
        this.createPieChart('ujiriStatusChart', {
            labels: ['पेन्डिङ', 'सम्पन्न', 'प्रगति मा'],
            data: [data.pending, data.resolved, data.in_progress],
            colors: ['#ffc107', '#28a745', '#17a2b8']
        });

        // Ministry distribution chart
        if (data.by_ministry && data.by_ministry.length > 0) {
            this.createBarChart('ujiriMinistryChart', {
                labels: data.by_ministry.map(m => m.ministry || 'अन्य'),
                data: data.by_ministry.map(m => parseInt(m.count))
            });
        }

        // Monthly trend chart
        if (data.by_month && data.by_month.length > 0) {
            this.createLineChart('ujiriTrendChart', {
                labels: data.by_month.map(m => this.formatMonth(m.month)),
                data: data.by_month.map(m => parseInt(m.count))
            });
        }
    }

    updateUjiriMap(districtData) {
        if (!districtData || districtData.length === 0) return;

        const districtCounts = {};
        districtData.forEach(d => {
            districtCounts[d.district] = parseInt(d.count);
        });

        this.updateNepalMap('ujiriMap', districtCounts, 'ujuri');
    }

    updateUjiriTable(data) {
        const tableBody = document.querySelector('#ujiriTable tbody');
        if (!tableBody) return;

        // Load actual data from API
        UjuriAPI.getAll().then(result => {
            if (result.success && result.data.length > 0) {
                tableBody.innerHTML = result.data.map(row => `
                    <tr>
                        <td>${row.registration_number}</td>
                        <td>${row.registration_date}</td>
                        <td>${row.complainant_name || '-'}</td>
                        <td>${row.opponent_name}</td>
                        <td>${row.district || '-'}</td>
                        <td>${this.getStatusBadge(row.status)}</td>
                        <td>
                            <button class="modern-page-btn" onclick="viewUjiriDetail('${row.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            } else {
                tableBody.innerHTML = '<tr><td colspan="7">कुनै उजुरी अभिलेख छैन।</td></tr>';
            }
        }).catch(error => {
            console.error('Error loading ujiri table:', error);
        });
    }

    // ============================================
    // OFFICE MONITORING DASHBOARD UPDATES
    // ============================================
    updateOfficeMonitoringDashboard(data) {
        // Update stat cards
        this.updateStatCard('officeStatTotal', data.total);
        this.updateStatCard('officeStatAvgPerformance', (data.average_performance * 100).toFixed(1) + '%');
        this.updateStatCard('officeStatMonitored', data.total);
        this.updateStatCard('officeStatIssues', Math.floor(data.total * 0.1)); // Approximate

        // Update charts
        this.updateOfficeMonitoringCharts(data);

        // Update maps
        this.updateOfficeMonitoringMaps(data);

        // Update table
        this.updateOfficeMonitoringTable();
    }

    updateOfficeMonitoringCharts(data) {
        // Performance distribution chart
        this.createPieChart('officePerformanceChart', {
            labels: ['उत्कृष्ट', 'सन्तोषजनक', 'सुधार आवश्यक'],
            data: [
                Math.floor(data.total * 0.4),
                Math.floor(data.total * 0.4),
                Math.floor(data.total * 0.2)
            ],
            colors: ['#28a745', '#17a2b8', '#ffc107']
        });

        // Office type distribution
        if (data.by_office_type && data.by_office_type.length > 0) {
            this.createBarChart('officeTypeChart', {
                labels: data.by_office_type.map(t => t.office_type || 'अन्य'),
                data: data.by_office_type.map(t => parseInt(t.count))
            });
        }
    }

    updateOfficeMonitoringMaps(data) {
        if (!data.by_district || data.by_district.length === 0) return;

        const districtCounts = {};
        data.by_district.forEach(d => {
            districtCounts[d.district] = parseInt(d.count);
        });

        this.updateNepalMap('officeMonitoringMap', districtCounts, 'office');
    }

    updateOfficeMonitoringTable() {
        const tableBody = document.querySelector('#officeMonitoringTable tbody');
        if (!tableBody) return;

        OfficeMonitoringAPI.getAll().then(result => {
            if (result.success && result.data.length > 0) {
                tableBody.innerHTML = result.data.map(row => `
                    <tr>
                        <td>${row.office_name}</td>
                        <td>${row.monitoring_date}</td>
                        <td>${row.district || '-'}</td>
                        <td>${row.overall_performance ? (row.overall_performance * 100).toFixed(1) + '%' : '-'}</td>
                        <td>${row.office_type || '-'}</td>
                        <td>
                            <button class="modern-page-btn" onclick="viewOfficeDetail('${row.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            } else {
                tableBody.innerHTML = '<tr><td colspan="6">कुनै अनुगमन अभिलेख छैन।</td></tr>';
            }
        }).catch(error => {
            console.error('Error loading office monitoring table:', error);
        });
    }

    // ============================================
    // DRESS TIME MONITORING DASHBOARD UPDATES
    // ============================================
    updateDressTimeDashboard(data) {
        // Update stat cards
        this.updateStatCard('dressStatTotal', data.total);
        this.updateStatCard('dressStatTimeViolations', data.time_violations);
        this.updateStatCard('dressStatDressViolations', data.dress_violations);
        this.updateStatCard('dressStatAvgViolations', data.average_violations?.toFixed(1) || '0');

        // Update charts
        this.updateDressTimeCharts(data);

        // Update maps
        this.updateDressTimeMaps(data);

        // Update table
        this.updateDressTimeTable();
    }

    updateDressTimeCharts(data) {
        // Violation distribution chart
        this.createPieChart('dressViolationChart', {
            labels: ['समय उल्लंघन', 'पोशाक उल्लंघन', 'दुवै उल्लंघन'],
            data: [data.time_violations, data.dress_violations, Math.floor(data.total * 0.05)],
            colors: ['#dc3545', '#fd7e14', '#6f42c1']
        });
    }

    updateDressTimeMaps(data) {
        if (!data.by_district || data.by_district.length === 0) return;

        const districtCounts = {};
        data.by_district.forEach(d => {
            districtCounts[d.district] = parseInt(d.count);
        });

        this.updateNepalMap('dressTimeMap', districtCounts, 'dress');
    }

    updateDressTimeTable() {
        const tableBody = document.querySelector('#dressTimeTable tbody');
        if (!tableBody) return;

        DressTimeAPI.getAll().then(result => {
            if (result.success && result.data.length > 0) {
                tableBody.innerHTML = result.data.map(row => `
                    <tr>
                        <td>${row.employee_name}</td>
                        <td>${row.employee_id || '-'}</td>
                        <td>${row.monitoring_date}</td>
                        <td>${row.district || '-'}</td>
                        <td>${row.total_violations}</td>
                        <td>${row.time_violation ? 'हो' : 'होइन'}</td>
                        <td>${row.dress_code_compliant ? 'हो' : 'होइन'}</td>
                    </tr>
                `).join('');
            } else {
                tableBody.innerHTML = '<tr><td colspan="7">कुनै अनुगमन अभिलेख छैन।</td></tr>';
            }
        }).catch(error => {
            console.error('Error loading dress time table:', error);
        });
    }

    // ============================================
    // SURVEY DASHBOARD UPDATES
    // ============================================
    updateSurveyDashboard(data) {
        // Update stat cards
        this.updateStatCard('surveyStatTotal', data.total);
        this.updateStatCard('surveyStatAvgSatisfaction', (data.average_satisfaction * 20).toFixed(1) + '%');
        this.updateStatCard('surveyStatAvgQuality', (data.average_quality * 20).toFixed(1) + '%');
        this.updateStatCard('surveyStatAvgBehavior', (data.average_behavior * 20).toFixed(1) + '%');

        // Update charts
        this.updateSurveyCharts(data);

        // Update map
        this.updateSurveyMap(data);

        // Update table
        this.updateSurveyTable();
    }

    updateSurveyCharts(data) {
        // Satisfaction distribution chart
        this.createPieChart('surveySatisfactionChart', {
            labels: ['धेरै सन्तुष्ट', 'सन्तुष्ट', 'सामान्य', 'असन्तुष्ट', 'धेरै असन्तुष्ट'],
            data: [
                Math.floor(data.total * 0.3),
                Math.floor(data.total * 0.4),
                Math.floor(data.total * 0.2),
                Math.floor(data.total * 0.08),
                Math.floor(data.total * 0.02)
            ],
            colors: ['#28a745', '#17a2b8', '#ffc107', '#fd7e14', '#dc3545']
        });

        // Service type distribution
        if (data.by_service_type && data.by_service_type.length > 0) {
            this.createBarChart('surveyServiceChart', {
                labels: data.by_service_type.map(s => s.service_type || 'अन्य'),
                data: data.by_service_type.map(s => parseInt(s.count))
            });
        }
    }

    updateSurveyMap(data) {
        if (!data.by_district || data.by_district.length === 0) return;

        const districtCounts = {};
        data.by_district.forEach(d => {
            districtCounts[d.district] = parseInt(d.count);
        });

        this.updateNepalMap('surveyMap', districtCounts, 'survey');
    }

    updateSurveyTable() {
        const tableBody = document.querySelector('#surveyTable tbody');
        if (!tableBody) return;

        SurveyAPI.getAll().then(result => {
            if (result.success && result.data.length > 0) {
                tableBody.innerHTML = result.data.map(row => `
                    <tr>
                        <td>${row.survey_date}</td>
                        <td>${row.respondent_name || '-'}</td>
                        <td>${row.service_type || '-'}</td>
                        <td>${row.district || '-'}</td>
                        <td>${row.overall_satisfaction}/5</td>
                        <td>${this.getSatisfactionRating(row.overall_satisfaction)}</td>
                    </tr>
                `).join('');
            } else {
                tableBody.innerHTML = '<tr><td colspan="6">कुनै सर्वेक्षण अभिलेख छैन।</td></tr>';
            }
        }).catch(error => {
            console.error('Error loading survey table:', error);
        });
    }

    // ============================================
    // INVESTIGATION DASHBOARD UPDATES
    // ============================================
    updateInvestigationDashboard(data) {
        // Update stat cards
        this.updateStatCard('chhanbinStatTotal', data.total);
        this.updateStatCard('chhanbinStatChalauAv', Math.floor(data.total * 0.6));
        this.updateStatCard('chhanbinStatGatAv', Math.floor(data.total * 0.3));
        this.updateStatCard('chhanbinStatSampanna', data.completed);
        this.updateStatCard('chhanbinStatChalau', data.ongoing);

        // Update table
        this.updateInvestigationTable();
    }

    updateInvestigationTable() {
        const tableBody = document.querySelector('#chhanbinTable tbody');
        if (!tableBody) return;

        InvestigationsAPI.getAll().then(result => {
            if (result.success && result.data.length > 0) {
                tableBody.innerHTML = result.data.map(row => `
                    <tr>
                        <td>${row.investigation_title}</td>
                        <td>${row.investigation_date}</td>
                        <td>${row.district || '-'}</td>
                        <td>${row.investigator_name || '-'}</td>
                        <td>${row.status || '-'}</td>
                        <td>${row.fiscal_year || '-'}</td>
                        <td>
                            <button class="modern-page-btn" onclick="viewInvestigationDetail('${row.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            } else {
                tableBody.innerHTML = '<tr><td colspan="7">कुनै छानविन/अन्वेषण अभिलेख छैन।</td></tr>';
            }
        }).catch(error => {
            console.error('Error loading investigation table:', error);
        });
    }

    // ============================================
    // TECHNICAL AUDIT DASHBOARD UPDATES
    // ============================================
    updateTechnicalAuditDashboard(data) {
        // Update stat cards
        this.updateStatCard('taStatTotal', data.total);
        this.updateStatCard('taStatInProgress', data.in_progress);
        this.updateStatCard('taStatCompleted', data.completed);
        this.updateStatCard('taStatAvgQuality', (data.average_quality * 100).toFixed(1) + '%');

        this.updateTechnicalAuditDonut(data.total);
        this.updateTechnicalAuditProjectTypes(data.by_project_type);
        this.updateTechnicalAuditSummary();

        // Update table
        this.updateTechnicalAuditTable();
    }

    updateTechnicalAuditProjectTypes(projectTypes) {
        const toNepaliDigits = value => String(value ?? 0).replace(/[0-9]/g, digit => '०१२३४५६७८९'[digit]);
        const typeCounts = { सडक: 0, सिंचाई: 0, विद्युत: 0, खानेपानी: 0, भवन: 0, दूरसञ्चार: 0, अन्य: 0 };
        (projectTypes || []).forEach(item => {
            const type = String(item.project_type || '').trim();
            const count = Number(item.count) || 0;
            if (Object.prototype.hasOwnProperty.call(typeCounts, type) && type !== 'अन्य') typeCounts[type] += count;
            else typeCounts['अन्य'] += count;
        });
        const elementIds = {
            सडक: 'technicalAuditTypeRoad',
            सिंचाई: 'technicalAuditTypeIrrigation',
            विद्युत: 'technicalAuditTypeElectricity',
            खानेपानी: 'technicalAuditTypeWater',
            भवन: 'technicalAuditTypeBuilding',
            दूरसञ्चार: 'technicalAuditTypeTelecom',
            अन्य: 'technicalAuditTypeOther'
        };
        Object.entries(elementIds).forEach(([type, id]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = toNepaliDigits(typeCounts[type]);
        });
    }

    updateTechnicalAuditSummary() {
        TechnicalAuditAPI.getAll().then(result => {
            if (!result.success) return;
            const rows = result.data || [];
            const toNepaliDigits = value => String(value ?? 0).replace(/[0-9]/g, digit => '०१२३४५६७८९'[digit]);
            const normalizeNepaliDate = value => String(value || '').slice(0, 10).replace(/[०१२३४५६७८९]/g, digit => '०१२३४५६७८९'.indexOf(digit));
            const counts = {
                total: rows.length,
                thisYear: rows.filter(row => normalizeNepaliDate(row.audit_date) >= '2083-04-01').length,
                pending: rows.filter(row => row.status === 'in_progress').length,
                completed: rows.filter(row => row.status === 'completed').length,
                nonCompliances: rows.filter(row => row.ncr).length,
                pendingDisposal: rows.filter(row => row.ncr && !row.disposal_info_date).length
            };
            const quarterRanges = [
                ['2083-04-01', '2083-06-32'],
                ['2083-07-01', '2083-09-32'],
                ['2083-10-01', '2083-12-32'],
                ['2084-01-01', '2084-03-32']
            ];
            const quarterCounts = quarterRanges.map(([start, end]) => rows.filter(row => {
                const auditDate = normalizeNepaliDate(row.audit_date);
                return auditDate >= start && auditDate <= end;
            }).length);
            const maxQuarterCount = Math.max(...quarterCounts, 1);
            quarterCounts.forEach((count, index) => {
                const bar = document.getElementById(`technicalAuditQuarter${index + 1}Bar`);
                const countElement = document.getElementById(`technicalAuditQuarter${index + 1}Count`);
                if (bar) bar.style.height = `${count / maxQuarterCount * 70}px`;
                if (countElement) countElement.textContent = toNepaliDigits(count);
            });
            const elementIds = {
                total: 'dashboardTechnicalAuditTotal',
                thisYear: 'dashboardTechnicalAuditThisYear',
                pending: 'dashboardTechnicalAuditPending',
                completed: 'dashboardTechnicalAuditCompleted',
                nonCompliances: 'dashboardTechnicalAuditNonCompliances',
                pendingDisposal: 'dashboardTechnicalAuditPendingDisposal'
            };
            Object.entries(elementIds).forEach(([key, id]) => {
                const element = document.getElementById(id);
                if (element) element.textContent = toNepaliDigits(counts[key]);
            });
        }).catch(error => console.error('Error loading technical audit summary:', error));
    }

    updateTechnicalAuditDonut(total) {
        const donut = document.querySelector('.css-donut');
        const donutTotal = document.getElementById('technicalAuditDonutTotal');
        const toNepaliDigits = value => String(value ?? 0).replace(/[0-9]/g, digit => '०१२३४५६७८९'[digit]);
        const totalValue = Number(total) || 0;
        if (donutTotal) donutTotal.textContent = toNepaliDigits(totalValue);
        if (!donut) return;

        TechnicalAuditAPI.getAll().then(result => {
            if (!result.success) return;
            const counts = [0, 0, 0, 0];
            (result.data || []).forEach(row => {
                const ncrCount = String(row.ncr || '').split(/\r?\n/).map(value => value.trim()).filter(Boolean).length;
                if (ncrCount === 0) counts[0]++;
                else if (ncrCount <= 2) counts[1]++;
                else if (ncrCount <= 6) counts[2]++;
                else counts[3]++;
            });
            const totalRecords = counts.reduce((sum, count) => sum + count, 0);
            if (!totalRecords) {
                donut.style.background = '#e9ecef';
                return;
            }
            const colors = ['#28a745', '#17a2b8', '#ffc107', '#fd7e14'];
            const inner = donutTotal;
            const segmentEnds = [];
            let start = 0;
            const stops = counts.map((count, index) => {
                const end = start + (count / totalRecords * 100);
                segmentEnds.push(end);
                const stop = `${colors[index]} ${start}% ${end}%`;
                start = end;
                return stop;
            });
            donut.style.background = `conic-gradient(${stops.join(', ')})`;

            const showSegmentCount = event => {
                if (!inner) return;
                const bounds = donut.getBoundingClientRect();
                const x = event.clientX - (bounds.left + bounds.width / 2);
                const y = event.clientY - (bounds.top + bounds.height / 2);
                let angle = Math.atan2(y, x) * 180 / Math.PI + 90;
                if (angle < 0) angle += 360;
                const percentage = angle / 360 * 100;
                const segmentIndex = segmentEnds.findIndex(end => percentage <= end);
                if (segmentIndex >= 0) inner.textContent = toNepaliDigits(counts[segmentIndex]);
            };
            const showTotal = () => {
                if (inner) inner.textContent = toNepaliDigits(totalValue);
            };
            donut.onmousemove = showSegmentCount;
            donut.onclick = showSegmentCount;
            donut.onmouseleave = showTotal;
        }).catch(error => console.error('Error loading technical audit donut data:', error));
    }

    updateTechnicalAuditTable() {
        const tableBody = document.querySelector('#taTable tbody');
        if (!tableBody) return;

        TechnicalAuditAPI.getAll().then(result => {
            if (result.success && result.data.length > 0) {
                tableBody.innerHTML = result.data.map(row => `
                    <tr>
                        <td>${row.project_name}</td>
                        <td>${row.audit_date}</td>
                        <td>${row.district || '-'}</td>
                        <td>${row.project_type || '-'}</td>
                        <td>${row.technical_quality_score ? (row.technical_quality_score * 100).toFixed(1) + '%' : '-'}</td>
                        <td>${row.progress_percentage ? row.progress_percentage.toFixed(1) + '%' : '-'}</td>
                        <td>${this.getStatusBadge(row.status)}</td>
                    </tr>
                `).join('');
            } else {
                tableBody.innerHTML = '<tr><td colspan="7">कुनै प्राविधिक परीक्षण अभिलेख छैन।</td></tr>';
            }
        }).catch(error => {
            console.error('Error loading technical audit table:', error);
        });
    }

    // ============================================
    // PROJECT MONITORING DASHBOARD UPDATES
    // ============================================
    updateProjectMonitoringDashboard(data) {
        const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
        const formatNumber = value => Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })
            .replace(/[0-9]/g, digit => nepaliDigits[Number(digit)]);
        const projectTotal = document.getElementById('dashboardProjectTotal');
        const projectBudget = document.getElementById('dashboardProjectBudget');
        const projectProgress = document.getElementById('dashboardProjectProgress');
        const projectSpent = document.getElementById('dashboardProjectSpent');
        if (projectTotal) projectTotal.textContent = formatNumber(data.total);
        if (projectBudget) projectBudget.textContent = formatNumber(data.total_budget_allocated);
        if (projectProgress) projectProgress.textContent = formatNumber(data.average_progress) + '%';
        if (projectSpent) projectSpent.textContent = formatNumber(data.total_budget_spent);

        // Update stat cards
        this.updateStatCard('projectStatTotal', data.total);
        this.updateStatCard('projectStatOngoing', data.ongoing);
        this.updateStatCard('projectStatCompleted', data.completed);
        const averageProgress = Number(data.average_progress);
        this.updateStatCard('projectStatAvgProgress', Number.isFinite(averageProgress) ? averageProgress.toFixed(1) + '%' : '0%');

        // Update charts
        this.updateProjectMonitoringCharts(data);

        // Update map
        this.updateProjectMonitoringMap(data);

        // Update table
        this.updateProjectMonitoringTable();
    }

    updateProjectMonitoringCharts(data) {
        // Status distribution chart
        this.createPieChart('projectStatusChart', {
            labels: ['चालू', 'सम्पन्न', 'निलम्बित'],
            data: [data.ongoing, data.completed, Math.floor(data.total * 0.05)],
            colors: ['#17a2b8', '#28a745', '#dc3545']
        });

        // Sector distribution
        if (data.by_project_sector && data.by_project_sector.length > 0) {
            this.createBarChart('projectSectorChart', {
                labels: data.by_project_sector.map(s => s.project_sector || 'अन्य'),
                data: data.by_project_sector.map(s => parseInt(s.count))
            });
        }
    }

    updateProjectMonitoringMap(data) {
        if (!data.by_district || data.by_district.length === 0) return;

        const districtCounts = {};
        data.by_district.forEach(d => {
            districtCounts[d.district] = parseInt(d.count);
        });

        this.updateNepalMap('projectMonitoringMap', districtCounts, 'project');
    }

    updateProjectMonitoringTable() {
        const tableBody = document.querySelector('#projectMonitoringTable tbody');
        if (!tableBody) return;

        ProjectMonitoringAPI.getAll().then(result => {
            if (result.success && result.data.length > 0) {
                tableBody.innerHTML = result.data.map(row => `
                    <tr>
                        <td>${row.project_name}</td>
                        <td>${row.monitoring_date}</td>
                        <td>${row.district || '-'}</td>
                        <td>${row.project_sector || '-'}</td>
                        <td>${row.progress_percentage ? row.progress_percentage.toFixed(1) + '%' : '-'}</td>
                        <td>${row.quality_score ? (row.quality_score * 100).toFixed(1) + '%' : '-'}</td>
                        <td>${this.getStatusBadge(row.status)}</td>
                    </tr>
                `).join('');
            } else {
                tableBody.innerHTML = '<tr><td colspan="7">कुनै आयोजना अभिलेख छैन।</td></tr>';
            }
        }).catch(error => {
            console.error('Error loading project monitoring table:', error);
        });
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    updateStatCard(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    getStatusBadge(status) {
        const statusMap = {
            'pending': '<span class="badge badge-warning">पेन्डिङ</span>',
            'in_progress': '<span class="badge badge-info">प्रगति मा</span>',
            'resolved': '<span class="badge badge-success">सम्पन्न</span>',
            'completed': '<span class="badge badge-success">सम्पन्न</span>',
            'ongoing': '<span class="badge badge-info">चालू</span>',
            'rejected': '<span class="badge badge-danger">अस्वीकृत</span>'
        };
        return statusMap[status] || `<span class="badge badge-secondary">${status}</span>`;
    }

    getSatisfactionRating(score) {
        if (score >= 4.5) return 'धेरै सन्तुष्ट';
        if (score >= 3.5) return 'सन्तुष्ट';
        if (score >= 2.5) return 'सामान्य';
        if (score >= 1.5) return 'असन्तुष्ट';
        return 'धेरै असन्तुष्ट';
    }

    formatMonth(dateString) {
        const months = ['जनवरी', 'फेब्रुअरी', 'मार्च', 'अप्रिल', 'मे', 'जुन', 
                       'जुलाई', 'अगस्ट', 'सेप्टेम्बर', 'अक्टोबर', 'नोभेम्बर', 'डिसेम्बर'];
        const date = new Date(dateString);
        return months[date.getMonth()];
    }

    // Chart creation functions using Chart.js
    createPieChart(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        this.charts[canvasId] = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.data,
                    backgroundColor: data.colors || ['#28a745', '#17a2b8', '#ffc107', '#fd7e14', '#dc3545'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        });
    }

    createBarChart(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        this.charts[canvasId] = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'गणना',
                    data: data.data,
                    backgroundColor: '#0269d69c',
                    borderColor: '#013a60',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    createLineChart(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        this.charts[canvasId] = new Chart(canvas, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'प्रवृत्ति',
                    data: data.data,
                    borderColor: '#013a60',
                    backgroundColor: 'rgba(1, 58, 96, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    updateNepalMap(mapId, districtData, type) {
        const mapContainer = document.getElementById(mapId);
        if (!mapContainer) return;

        // This would integrate with your existing Leaflet map implementation
        // For now, it's a placeholder that would update the existing map instances
        console.log(`Updating ${type} map with district data:`, districtData);
        
        // You would call your existing map update functions here
        // For example: updateExistingMap(mapId, districtData);
    }
}

// Initialize dashboard manager
const dashboardManager = new DashboardManager();

// Make dashboard update functions available globally
window.updateUjiriDashboard = (data) => dashboardManager.updateUjiriDashboard(data);
window.updateOfficeMonitoringDashboard = (data) => dashboardManager.updateOfficeMonitoringDashboard(data);
window.updateDressTimeDashboard = (data) => dashboardManager.updateDressTimeDashboard(data);
window.updateSurveyDashboard = (data) => dashboardManager.updateSurveyDashboard(data);
window.updateInvestigationDashboard = (data) => dashboardManager.updateInvestigationDashboard(data);
window.updateTechnicalAuditDashboard = (data) => dashboardManager.updateTechnicalAuditDashboard(data);
window.updateProjectMonitoringDashboard = (data) => dashboardManager.updateProjectMonitoringDashboard(data);