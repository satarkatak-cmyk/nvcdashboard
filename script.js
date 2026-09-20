document.addEventListener("DOMContentLoaded", function() {
    const storedUser = sessionStorage.getItem('dashboardUser') || localStorage.getItem('dashboardUser');
    let currentUser = null;
    try {
        currentUser = storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.warn('Invalid stored user session; admin-only controls remain disabled.');
    }
    const isAdmin = currentUser?.role === 'admin';
    if (!isAdmin) {
        document.getElementById('userManagementToggle')?.closest('li')?.remove();
        document.getElementById('auditLogToggle')?.closest('li')?.remove();
    }
    const userLabel = document.querySelector('.top-actions .action-item');
    if (userLabel && currentUser) userLabel.innerHTML = `<i class="fas fa-user-circle"></i>${currentUser.username}`;
    // Sidebar Toggle Functionality
    const sidebarHeader = document.querySelector('.sidebar-header');
    const sidebar = document.querySelector('.sidebar');
    const sidebarFooter = document.querySelector('.sidebar-footer');

    if (sidebarFooter) {
        sidebarFooter.addEventListener('click', async function() {
            if (!confirm('के तपाईं लगआउट गर्न चाहनुहुन्छ?')) return;
            const username = sessionStorage.getItem('dashboardUsername') ||
                localStorage.getItem('dashboardUsername') || 'admin';
            try {
                await AuthAPI.logout(username);
            } catch (error) {
                console.error('Could not record logout:', error);
            }
            sessionStorage.removeItem('dashboardLoggedIn');
            sessionStorage.removeItem('dashboardUsername');
            sessionStorage.removeItem('dashboardAuthToken');
            sessionStorage.removeItem('dashboardUser');
            localStorage.removeItem('dashboardRememberMe');
            localStorage.removeItem('dashboardUsername');
            localStorage.removeItem('dashboardAuthToken');
            localStorage.removeItem('dashboardUser');
            window.location.href = 'login.html';
        });
    }

    if (sidebarHeader && sidebar) {
        sidebarHeader.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }

    // Submenu positioning logic with click behavior
    const hasSubmenuItems = document.querySelectorAll('.has-submenu');
    let activeSubmenu = null;

    function closeActiveSubmenu() {
        if (activeSubmenu) {
            activeSubmenu.classList.remove('show');
            activeSubmenu.closest('.has-submenu').classList.add('submenu-dismissed');
            activeSubmenu = null;
        }
    }

    hasSubmenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.closest('.submenu')) return;
            e.stopPropagation();
            item.classList.remove('submenu-dismissed');
            const submenu = this.querySelector('.submenu');
            
            // Close other submenus
            hasSubmenuItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherSubmenu = otherItem.querySelector('.submenu');
                    if (otherSubmenu) {
                        otherSubmenu.classList.remove('show');
                    }
                }
            });

            // Toggle current submenu
            if (submenu) {
                const rect = this.getBoundingClientRect();
                submenu.style.top = (rect.top + window.scrollY) + 'px';
                submenu.style.left = rect.right + 'px';
                submenu.classList.toggle('show');
                activeSubmenu = submenu.classList.contains('show') ? submenu : null;
            }
        });

        item.addEventListener('mouseleave', function() {
            item.classList.remove('submenu-dismissed');
        });
    });

    // Close submenu when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (activeSubmenu && !e.target.closest('.has-submenu')) {
            closeActiveSubmenu();
        }
    });

    // Global variables for content management
    const dashboardGrid = document.querySelector('.dashboard-grid');
    const ujiriFormContainer = document.getElementById('ujuriFormContainer');
    const ujiriVivaranContent = document.getElementById('ujiriVivaranContent');
    const officeMonFormContainer = document.getElementById('officeMonFormContainer');
    const officeMonDetailContainer = document.getElementById('officeMonDetailContainer');
    const dressTimeFormContainer = document.getElementById('dressTimeFormContainer');
    const dressTimeDetailContainer = document.getElementById('dressTimeDetailContainer');
    const surveyFormContainer = document.getElementById('surveyFormContainer');
    const surveyDashboardContainer = document.getElementById('surveyDashboardContainer');
    const analysisPage = document.getElementById('analysisContent');
    const projectMonitoringFormContainer = document.getElementById('projectMonitoringFormContainer');
    const projectMonitoringDashboard = document.getElementById('projectMonitoringDashboard');
    const projectMonitoringDashboardLink = document.getElementById('projectMonitoringDashboardLink');
    const promotionalProgramsContent = document.getElementById('promotionalProgramsContent');
    const promotionalProgramsToggle = document.getElementById('promotionalProgramsToggle');
    const annualProgramContent = document.getElementById('annualProgramContent');
    const annualProgramToggle = document.getElementById('annualProgramToggle');
    const sectionReportContent = document.getElementById('sectionReportContent');
    const calendarContent = document.getElementById('calendarContent');
    const chhanbinContent = document.getElementById('chhanbinContent');
    const dashboardToggle = document.getElementById('dashboardToggle');
    const sidebarMenuItems = document.querySelectorAll('.sidebar-menu > li');

    function hideAllPrimaryContent() {
        if (dashboardGrid) dashboardGrid.style.display = 'none';
        if (analysisPage) analysisPage.style.display = 'none';
        if (ujiriFormContainer) ujiriFormContainer.style.display = 'none';
        if (ujiriVivaranContent) ujiriVivaranContent.style.display = 'none';
        if (officeMonFormContainer) officeMonFormContainer.style.display = 'none';
        if (officeMonDetailContainer) officeMonDetailContainer.style.display = 'none';
        if (dressTimeFormContainer) dressTimeFormContainer.style.display = 'none';
        if (dressTimeDetailContainer) dressTimeDetailContainer.style.display = 'none';
        if (surveyFormContainer) surveyFormContainer.style.display = 'none';
        if (surveyDashboardContainer) surveyDashboardContainer.style.display = 'none';
        if (projectMonitoringFormContainer) projectMonitoringFormContainer.style.display = 'none';
        if (projectMonitoringDashboard) projectMonitoringDashboard.style.display = 'none';
        if (promotionalProgramsContent) promotionalProgramsContent.style.display = 'none';
        if (annualProgramContent) annualProgramContent.style.display = 'none';
        if (sectionReportContent) sectionReportContent.style.display = 'none';
        if (calendarContent) calendarContent.style.display = 'none';
        if (chhanbinContent) chhanbinContent.style.display = 'none';
        const technicalAuditContent = document.getElementById('technicalAuditContent');
        if (technicalAuditContent) technicalAuditContent.style.display = 'none';
        const passwordChangeContent = document.getElementById('passwordChangeContent');
        if (passwordChangeContent) passwordChangeContent.style.display = 'none';
        const auditLogContent = document.getElementById('auditLogContent');
        if (auditLogContent) auditLogContent.style.display = 'none';
        const userManagementContent = document.getElementById('userManagementContent');
        if (userManagementContent) userManagementContent.style.display = 'none';
    }

    // New Ujiri Form Handler - target first submenu under "उजुरी व्यवस्थापन"
    const ujiriMenu = Array.from(document.querySelectorAll('.has-submenu')).find(item =>
        item.querySelector('span') && item.querySelector('span').textContent.includes('उजुरी व्यवस्थापन')
    );

    const newUjiriLink = ujiriMenu ? ujiriMenu.querySelector('.submenu li:first-child a') : null;

    if (newUjiriLink && ujiriFormContainer) {
        newUjiriLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            hideAllPrimaryContent();

            // Show form
            ujiriFormContainer.style.display = 'block';

            // Initialize Nepali date dropdowns
            initializeNepaliDateDropdowns();

            // Initialize Ujuri form dropdowns (ministry, province, district, municipality)
            initializeUjuriForm();

            // Update sidebar active state
            sidebarMenuItems.forEach(item => item.classList.remove('active'));
            this.closest('.has-submenu').classList.add('active');

            // Close submenu
            closeActiveSubmenu();
        });
    }

    // Ujuri Management Handler - target submenu under "उजुरी व्यवस्थापन"
    const ujuriMenu = document.querySelector('.sidebar-menu li:nth-child(2)');
    const ujuriSubmenu = ujuriMenu ? ujiriMenu.querySelector('.submenu') : null;

    function updateOfficeMonitoringDashboardStats(rows) {
        const toNepaliDigits = value => String(value ?? 0).replace(/[0-9]/g, digit => '०१२३४५६७८९'[digit]);
        const currentNepaliYearMonth = window.NepaliCalendar?.getCurrentDate?.()?.slice(0, 7) || '';
        const normalizeDate = value => String(value || '').slice(0, 10).replace(/[०-९]/g, digit => '०१२३४५६७८९'.indexOf(digit));
        const currentMonthCount = rows.filter(row => normalizeDate(row.monitoring_date).slice(0, 7) === currentNepaliYearMonth).length;
        const dashboardTotal = document.getElementById('dashboardOfficeMonitoringTotal');
        const dashboardCurrentMonth = document.getElementById('dashboardOfficeMonitoringCurrentMonth');
        if (dashboardTotal) dashboardTotal.textContent = toNepaliDigits(rows.length);
        if (dashboardCurrentMonth) dashboardCurrentMonth.textContent = toNepaliDigits(currentMonthCount);
    }

    function updateDressTimeDashboardStats(rows) {
        const toNepaliDigits = value => String(value ?? 0).replace(/[0-9]/g, digit => '०१२३४५६७८९'[digit]);
        const currentNepaliYearMonth = window.NepaliCalendar?.getCurrentDate?.()?.slice(0, 7) || '';
        const normalizeDate = value => String(value || '').slice(0, 10).replace(/[०-९]/g, digit => '०१२३४५६७८९'.indexOf(digit));
        const currentMonthCount = rows.filter(row => normalizeDate(row.monitoring_date).slice(0, 7) === currentNepaliYearMonth).length;
        const timeViolations = rows.reduce((sum, row) => sum + (row.time_violation_count || 0), 0);
        const dressViolations = rows.reduce((sum, row) => sum + (row.dress_violation_count || 0), 0);
        
        const dashboardTotal = document.getElementById('dressTimeStatTotal');
        const dashboardCurrentMonth = document.getElementById('dressTimeStatCurrentMonth');
        const dashboardTimeViolation = document.getElementById('dressTimeStatTimeViolation');
        const dashboardDressViolation = document.getElementById('dressTimeStatDressViolation');
        
        if (dashboardTotal) dashboardTotal.textContent = toNepaliDigits(rows.length);
        if (dashboardCurrentMonth) dashboardCurrentMonth.textContent = toNepaliDigits(currentMonthCount);
        if (dashboardTimeViolation) dashboardTimeViolation.textContent = toNepaliDigits(timeViolations);
        if (dashboardDressViolation) dashboardDressViolation.textContent = toNepaliDigits(dressViolations);

        // Update month-wise chart
        updateDressTimeMonthChart(rows);
        
        // Update district map
        updateDressTimeDistrictMap(rows);
    }

    function updateDressTimeMonthChart(rows) {
        const monthChart = document.getElementById('dressTimeMonthChart');
        if (!monthChart) return;

        const months = ['साउन', 'भदौ', 'असोज', 'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत्र', 'बैशाख', 'जेठ', 'असार'];
        const monthCounts = new Array(12).fill(0);
        
        rows.forEach(row => {
            const date = String(row.monitoring_date || '').slice(0, 10);
            if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
                const month = parseInt(date.split('-')[1]) - 1;
                if (month >= 0 && month < 12) {
                    monthCounts[month]++;
                }
            }
        });

        const maxCount = Math.max(...monthCounts, 1);
        const bars = monthChart.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            const height = (monthCounts[index] / maxCount) * 100;
            bar.style.height = `${Math.max(height, 5)}%`;
        });
    }

    function updateDressTimeDistrictMap(rows) {
        const mapContainer = document.getElementById('dressTimeMapMonitored');
        if (!mapContainer) return;

        // Clean up styling on mapContainer
        mapContainer.style.height = '100%';
        mapContainer.style.width = '100%';
        mapContainer.innerHTML = ''; // Clear the old grid/bars completely

        const monitoredDistricts = new Set(rows.map(r => r.district));

        if (!window.dressTimeDashboardMapInstance) {
            try {
                window.dressTimeDashboardMapInstance = L.map('dressTimeMapMonitored', {
                    zoomControl: false,
                    attributionControl: false,
                    scrollWheelZoom: false
                }).setView([28.3949, 84.1240], 6.3);

                const geoJsonUrl = 'https://raw.githubusercontent.com/Acesmndr/nepal-geojson/master/generated-geojson/nepal-with-districts-acesmndr.geojson';
                fetch(geoJsonUrl)
                    .then(response => response.json())
                    .then(data => {
                        window.dressTimeDashboardGeoJsonLayer = L.geoJSON(data, {
                            style: function(feature) {
                                const name = dtdDistrictNameOf(feature);
                                const isHighlighted = [...monitoredDistricts].some(h => name && name.indexOf(h) !== -1);
                                return {
                                    fillColor: isHighlighted ? '#6cbd78' : '#ccc',
                                    weight: 1,
                                    color: '#ffffff',
                                    fillOpacity: isHighlighted ? 0.9 : 0.7
                                };
                            },
                            onEachFeature: function(feature, layer) {
                                const name = dtdDistrictNameOf(feature);
                                layer.bindTooltip(name, { sticky: true });
                                
                                const districtRecords = rows.filter(record => record.district === name);
                                if (districtRecords.length) {
                                    const timeViolation = districtRecords.reduce((sum, record) => sum + (Number(record.time_violation_count) || 0), 0);
                                    const dressViolation = districtRecords.reduce((sum, record) => sum + (Number(record.dress_violation_count) || 0), 0);
                                    layer.bindPopup(`<strong>${name}</strong><br>अनुगमन संख्या: ${districtRecords.length}<br>समय अपरिपालना: ${timeViolation}<br>पोशाक अपरिपालना: ${dressViolation}`);
                                    layer.on('mouseover', function() { this.openPopup(); });
                                    layer.on('mouseout', function() { this.closePopup(); });
                                }
                            }
                        }).addTo(window.dressTimeDashboardMapInstance);

                        try {
                            window.dressTimeDashboardMapInstance.fitBounds(window.dressTimeDashboardGeoJsonLayer.getBounds(), { padding: [10, 10] });
                            window.dressTimeDashboardMapInstance.invalidateSize();
                        } catch(e) {}
                    })
                    .catch(err => {
                        console.error('Error loading GeoJSON for dress time dashboard map:', err);
                        mapContainer.innerHTML = "<div style='display:flex;align-items:center;justify-content:center;height:100%;color:#999;font-size:12px;'>नक्सा लोड गर्न सकिएन</div>";
                    });
            } catch (error) {
                console.error('Error initializing dress time dashboard map:', error);
            }
        } else {
            // Re-color/update layer if it exists
            if (window.dressTimeDashboardGeoJsonLayer) {
                window.dressTimeDashboardGeoJsonLayer.eachLayer(function(layer) {
                    const feature = layer.feature;
                    if (feature) {
                        const name = dtdDistrictNameOf(feature);
                        const isHighlighted = [...monitoredDistricts].some(h => name && name.indexOf(h) !== -1);
                        layer.setStyle({
                            fillColor: isHighlighted ? '#6cbd78' : '#ccc',
                            fillOpacity: isHighlighted ? 0.9 : 0.7
                        });
                        
                        const districtRecords = rows.filter(record => record.district === name);
                        if (districtRecords.length) {
                            const timeViolation = districtRecords.reduce((sum, record) => sum + (Number(record.time_violation_count) || 0), 0);
                            const dressViolation = districtRecords.reduce((sum, record) => sum + (Number(record.dress_violation_count) || 0), 0);
                            layer.setPopupContent(`<strong>${name}</strong><br>अनुगमन संख्या: ${districtRecords.length}<br>समय अपरिपालना: ${timeViolation}<br>पोशाक अपरिपालना: ${dressViolation}`);
                        }
                    }
                });
            }
            window.dressTimeDashboardMapInstance.invalidateSize();
        }
    }

    function updateDashboardSurveyCard(rows) {
        if (!rows || !rows.length) return;

        const toNepaliDigits = value => String(value ?? 0).replace(/[0-9]/g, digit => '०१२३४५६७८९'[digit]);

        // 1. Calculate stats
        let satisfiedCount = 0;
        let bribeCount = 0;
        let complaintCount = 0;

        rows.forEach(row => {
            let answers = {};
            try { answers = typeof row.answer_data === 'string' ? JSON.parse(row.answer_data) : row.answer_data || {}; } catch (e) {}
            if (!Object.keys(answers).length) {
                try { answers = row.suggestions ? JSON.parse(row.suggestions).answers || {} : {}; } catch (e) {}
            }
            
            const satisfied = answers.q7 ? (answers.q7.includes('सन्तुष्ट') && !answers.q7.includes('असन्तुष्ट')) : (Number(row.overall_satisfaction) >= 4);
            const bribe = String(row.recommendations || '').includes('पर्‍यो');
            const complaint = String(answers['q12'] || '').includes('गरेको छु');

            if (satisfied) satisfiedCount++;
            if (bribe) bribeCount++;
            if (complaint) complaintCount++;
        });

        const total = rows.length;
        const satisfactionRate = Math.round((satisfiedCount / total) * 100);
        const bribeRate = Math.round((bribeCount / total) * 100);
        const complaintRate = Math.round((complaintCount / total) * 100);

        // Update stat elements
        const statTotalEl = document.getElementById('surveyDashStatTotal');
        const statSatisfactionEl = document.getElementById('surveyDashStatSatisfaction');
        const statBribeEl = document.getElementById('surveyDashStatBribe');
        const statComplaintEl = document.getElementById('surveyDashStatComplaint');

        if (statTotalEl) statTotalEl.textContent = toNepaliDigits(total);
        if (statSatisfactionEl) statSatisfactionEl.textContent = toNepaliDigits(satisfactionRate) + '%';
        if (statBribeEl) statBribeEl.textContent = toNepaliDigits(bribeRate) + '%';
        if (statComplaintEl) statComplaintEl.textContent = toNepaliDigits(complaintRate) + '%';

        // 2. Update monthly chart (bar chart / line-chart-sim style)
        const monthChart = document.getElementById('surveyDashboardMonthChart');
        if (monthChart) {
            const monthCounts = new Array(12).fill(0);
            rows.forEach(row => {
                const dateParts = String(row.survey_date || '').slice(0, 10).split('-');
                if (dateParts.length >= 2) {
                    const monthVal = parseInt(dateParts[1], 10);
                    if (monthVal >= 1 && monthVal <= 12) {
                        const monthIdx = (monthVal + 8) % 12;
                        monthCounts[monthIdx]++;
                    }
                }
            });

            const maxCount = Math.max(...monthCounts, 1);
            const bars = monthChart.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
                const count = monthCounts[index];
                const height = (count / maxCount) * 100;
                bar.style.height = `${Math.max(height, 5)}%`;
                bar.setAttribute('data-count', toNepaliDigits(count));
                
                bar.onmouseenter = () => bar.classList.add('is-hovered');
                bar.onmouseleave = () => bar.classList.remove('is-hovered');
            });
        }

        // 3. Update Nepal choropleth map
        updateDashboardSurveyMap(rows);
    }

    function updateDashboardSurveyMap(rows) {
        const mapContainer = document.getElementById('surveyDashboardMap');
        if (!mapContainer) return;

        // Helper to translate province names
        const getProvinceName = name => {
            if (!name) return '';
            const provinceMap = {
                'कोशी': 'कोशी प्रदेश', 'Koshi': 'कोशी प्रदेश', 'Province 1': 'कोशी प्रदेश', '1': 'कोशी प्रदेश',
                'मधेश': 'मधेश प्रदेश', 'Madhesh': 'मधेश प्रदेश', 'Province 2': 'मधेश प्रदेश', '2': 'मधेश प्रदेश',
                'बागमती': 'बागमती प्रदेश', 'Bagmati': 'बागमती प्रदेश', 'Province 3': 'बागमती प्रदेश', '3': 'बागमती प्रदेश',
                'गण्डकी': 'गण्डकी प्रदेश', 'Gandaki': 'गण्डकी प्रदेश', 'Province 4': 'गण्डकी प्रदेश', '4': 'गण्डकी प्रदेश',
                'लुम्बिनी': 'लुम्बिनी प्रदेश', 'Lumbini': 'लुम्बिनी प्रदेश', 'Province 5': 'लुम्बिनी प्रदेश', '5': 'लुम्बिनी प्रदेश',
                'कर्णाली': 'कर्णाली प्रदेश', 'Karnali': 'कर्णाली प्रदेश', 'Province 6': 'कर्णाली प्रदेश', '6': 'कर्णाली प्रदेश',
                'सुदूरपश्चिम': 'सुदूरपश्चिम प्रदेश', 'Sudurpashchim': 'सुदूरपश्चिम प्रदेश', 'Province 7': 'सुदूरपश्चिम प्रदेश', '7': 'सुदूरपश्चिम प्रदेश'
            };
            return provinceMap[name] || (name.includes('प्रदेश') ? name : name + ' प्रदेश');
        };

        // Calculate metrics per province
        const provinceStats = {};
        const provinceNamesList = ['कोशी प्रदेश', 'मधेश प्रदेश', 'बागमती प्रदेश', 'गण्डकी प्रदेश', 'लुम्बिनी प्रदेश', 'कर्णाली प्रदेश', 'सुदूरपश्चिम प्रदेश'];
        
        provinceNamesList.forEach(p => {
            provinceStats[p] = { total: 0, satisfied: 0 };
        });

        rows.forEach(row => {
            const rawProvince = row.province || '';
            const normalizedProv = getProvinceName(rawProvince.replace('मधेस प्रदेश', 'मधेश प्रदेश'));
            if (provinceStats[normalizedProv]) {
                let answers = {};
                try { answers = typeof row.answer_data === 'string' ? JSON.parse(row.answer_data) : row.answer_data || {}; } catch (e) {}
                if (!Object.keys(answers).length) {
                    try { answers = row.suggestions ? JSON.parse(row.suggestions).answers || {} : {}; } catch (e) {}
                }
                const satisfied = answers.q7 ? (answers.q7.includes('सन्तुष्ट') && !answers.q7.includes('असन्तुष्ट')) : (Number(row.overall_satisfaction) >= 4);
                
                provinceStats[normalizedProv].total++;
                if (satisfied) provinceStats[normalizedProv].satisfied++;
            }
        });

        const getMetricValue = provName => {
            const stat = provinceStats[provName];
            if (!stat || stat.total === 0) return null;
            return stat.satisfied / stat.total;
        };

        const metricColor = value => {
            if (value === null) return '#e2e8f0';
            const stops = [
                { p:0, c:[224,82,79] },
                { p:0.5, c:[232,161,58] },
                { p:1, c:[47,158,83] }
            ];
            let lo, hi;
            if (value <= 0.5){ lo = stops[0]; hi = stops[1]; }
            else { lo = stops[1]; hi = stops[2]; }
            const span = hi.p - lo.p;
            const t = span ? (value - lo.p) / span : 0;
            const rgb = lo.c.map((c0,i) => Math.round(c0 + (hi.c[i]-c0)*t));
            return 'rgb('+rgb.join(',')+')';
        };

        const toNepaliDigits = value => String(value ?? 0).replace(/[0-9]/g, digit => '०१२३४५६७८९'[digit]);

        const getPopupContent = provName => {
            const stat = provinceStats[provName];
            if (!stat || stat.total === 0) return '<strong>' + provName + '</strong><br/>डाटा उपलब्ध छैन';
            const pct = Math.round((stat.satisfied / stat.total) * 100);
            return '<strong>' + provName + '</strong><br/>' +
                'उत्तरदाता: ' + toNepaliDigits(stat.total) + '<br/>' +
                'सन्तुष्टि दर: ' + toNepaliDigits(pct) + '%';
        };

        // Initialize Map if not already done
        if (!window.dashboardSurveyMapInstance) {
            try {
                window.dashboardSurveyMapInstance = L.map('surveyDashboardMap', {
                    zoomControl: false,
                    attributionControl: false,
                    scrollWheelZoom: false
                }).setView([28.3949, 84.1240], 6);

                const geoJsonUrl = 'https://raw.githubusercontent.com/Acesmndr/nepal-geojson/master/generated-geojson/nepal-with-districts-acesmndr.geojson';
                fetch(geoJsonUrl)
                    .then(response => response.json())
                    .then(data => {
                        window.dashboardSurveyGeoJsonLayer = L.geoJSON(data, {
                            style: function(feature) {
                                const provName = getProvinceName(feature.properties.Province || feature.properties.PROVINCE || feature.properties.province || feature.properties.NAME || feature.properties.name || '');
                                const metricVal = getMetricValue(provName);
                                return {
                                    fillColor: metricColor(metricVal),
                                    weight: 1,
                                    color: '#fff',
                                    fillOpacity: 0.8
                                };
                            },
                            onEachFeature: function(feature, layer) {
                                const provName = getProvinceName(feature.properties.Province || feature.properties.PROVINCE || feature.properties.province || feature.properties.NAME || feature.properties.name || '');
                                layer.bindPopup(getPopupContent(provName));
                            }
                        }).addTo(window.dashboardSurveyMapInstance);

                        window.dashboardSurveyMapInstance.fitBounds(window.dashboardSurveyGeoJsonLayer.getBounds(), { padding: [5, 5] });
                    })
                    .catch(err => {
                        console.error('Error loading GeoJSON for survey map:', err);
                        renderFallbackPolygons();
                    });
            } catch (error) {
                console.error('Error initializing dashboard survey map:', error);
            }
        } else {
            // Update styles if layer exists
            if (window.dashboardSurveyGeoJsonLayer) {
                window.dashboardSurveyGeoJsonLayer.eachLayer(function(layer) {
                    const feature = layer.feature;
                    if (feature) {
                        const provName = getProvinceName(feature.properties.Province || feature.properties.PROVINCE || feature.properties.province || feature.properties.NAME || feature.properties.name || '');
                        const metricVal = getMetricValue(provName);
                        layer.setStyle({
                            fillColor: metricColor(metricVal)
                        });
                        layer.setPopupContent(getPopupContent(provName));
                    }
                });
            }
            window.dashboardSurveyMapInstance.invalidateSize();
        }

        function renderFallbackPolygons() {
            const provincePolygons = [
                { name: 'कोशी प्रदेश', coords: [[27.5, 87.0], [27.5, 88.5], [28.5, 88.5], [28.5, 87.0]] },
                { name: 'मधेश प्रदेश', coords: [[26.5, 85.0], [26.5, 87.0], [27.5, 87.0], [27.5, 85.0]] },
                { name: 'बागमती प्रदेश', coords: [[27.0, 84.0], [27.0, 85.5], [28.2, 85.5], [28.2, 84.0]] },
                { name: 'गण्डकी प्रदेश', coords: [[27.5, 82.5], [27.5, 84.0], [28.8, 84.0], [28.8, 82.5]] },
                { name: 'लुम्बिनी प्रदेश', coords: [[27.0, 82.0], [27.0, 83.5], [28.0, 83.5], [28.0, 82.0]] },
                { name: 'कर्णाली प्रदेश', coords: [[28.0, 81.0], [28.0, 82.5], [29.5, 82.5], [29.5, 81.0]] },
                { name: 'सुदूरपश्चिम प्रदेश', coords: [[28.5, 80.0], [28.5, 81.5], [30.0, 81.5], [30.0, 80.0]] }
            ];

            const fallbackGroup = L.featureGroup();
            provincePolygons.forEach(prov => {
                const metricVal = getMetricValue(prov.name);
                const polygon = L.polygon(prov.coords, {
                    color: '#fff',
                    weight: 1,
                    fillColor: metricColor(metricVal),
                    fillOpacity: 0.8
                });
                polygon.bindPopup(getPopupContent(prov.name));
                fallbackGroup.addLayer(polygon);
            });
            fallbackGroup.addTo(window.dashboardSurveyMapInstance);
            window.dashboardSurveyMapInstance.fitBounds(fallbackGroup.getBounds(), { padding: [5, 5] });
        }
    }

    async function loadDashboardSurveyCardData() {
        try {
            const result = await SurveyAPI.getAll();
            if (result && result.success && result.data) {
                updateDashboardSurveyCard(result.data);
            }
        } catch (error) {
            console.error('Error loading dashboard survey card data:', error);
        }
    }

    async function loadDressTimeDashboardData() {
        try {
            const result = await DressTimeAPI.getAll();
            
            if (!result.success) throw new Error(result.error || 'डाटा लोड गर्न सकिएन');
            
            const rows = result.data || [];
            updateDressTimeDashboardStats(rows);
        } catch (error) {
            console.error('Error loading dress time dashboard data:', error);
        }
    }

    async function loadOfficeMonitoringDetailData() {
        const result = await OfficeMonitoringAPI.getAll();
        if (!result.success) throw new Error(result.error || 'अनुगमन विवरण लोड गर्न सकिएन');

        const rows = result.data || [];
        const formatOfficeMonitoringDate = value => {
            const date = String(value || '').slice(0, 10);
            return date && /^\d{4}-\d{2}-\d{2}$/.test(date)
                ? date.replace(/[0-9]/g, digit => '०१२३४५६७८९'[digit])
                : '-';
        };
        updateOfficeMonitoringDashboardStats(rows);
        window.omDetailRecords = rows.map(row => ({
            id: row.id,
            date: formatOfficeMonitoringDate(row.monitoring_date),
            province: row.province || '-',
            district: row.district || '-',
            localLevel: row.form_data?.municipality || row.office_type || '-',
            office: row.office_name,
            monitor: row.monitoring_team || '-',
            issue: row.issues_found || '-',
            formData: row.form_data || {},
            status: row.issues_found ? 'pending' : 'done'
        }));

        const toNepaliDigits = value => String(value ?? 0).replace(/[0-9]/g, digit => '०१२३४५६७८९'[digit]);
        const setStat = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.textContent = toNepaliDigits(value);
        };
        setStat('omDetailStatTotal', rows.length);
        setStat('omDetailStatProvince', new Set(rows.map(row => row.province).filter(Boolean)).size);
        setStat('omDetailStatDistrict', new Set(rows.map(row => row.district).filter(Boolean)).size);
        setStat('omDetailStatLocalLevel', new Set(rows.map(row => row.office_type).filter(Boolean)).size);
        setStat('omDetailStatOffice', new Set(rows.map(row => row.office_name).filter(Boolean)).size);

        const tableBody = document.getElementById('omDetailDataTableBody');
        if (tableBody) {
            tableBody.innerHTML = window.omDetailRecords.length
                ? window.omDetailRecords.map((row, idx) => `<tr data-idx="${idx}">
                    <td>${row.date || '-'}</td><td>${row.province}</td><td>${row.district}</td>
                    <td>${row.localLevel}</td><td>${row.office}</td><td>${row.monitor}</td>
                    <td>${row.issue}</td><td>${row.status === 'done' ? 'सम्पन्न' : 'बाँकी'}</td>
                    <td><div class="om-detail-action-group">
                        <button class="om-detail-action-btn view" title="हेर्नुहोस्"><i class="fas fa-eye"></i></button>
                        <button class="om-detail-action-btn edit" title="सम्पादन"><i class="fas fa-pen"></i></button>
                        <button class="om-detail-action-btn delete" title="मेटाउनुहोस्"><i class="fas fa-trash"></i></button>
                    </div></td>
                </tr>`).join('')
                : '<tr class="om-detail-empty-row"><td colspan="9">कुनै डाटा फेला परेन</td></tr>';
        }

        // Table actions for office monitoring detail
        tableBody.addEventListener('click', function(e) {
            const btn = e.target.closest('.om-detail-action-btn');
            if (!btn) return;
            const tr = e.target.closest('tr');
            const idx = tr ? tr.dataset.idx : null;
            const rec = window.omDetailRecords[idx];
            if (!rec) return;
            if (btn.classList.contains('view')) {
                showOfficeMonitoringViewModal(rec);
            } else if (btn.classList.contains('edit')) {
                showOfficeMonitoringEditModal(rec);
            } else if (btn.classList.contains('delete')) {
                if (confirm('के तपाईं यो अनुगमन विवरण मेटाउन चाहनुहुन्छ?')) {
                    deleteOfficeMonitoringRecord(rec.id);
                }
            }
        });

        const chartElement = document.getElementById('omDetailProvinceDonut');
        if (chartElement && typeof Chart !== 'undefined') {
            const counts = {};
            rows.forEach(row => { if (row.province) counts[row.province] = (counts[row.province] || 0) + 1; });
            if (window.omDetailProvinceChart) window.omDetailProvinceChart.destroy();
            const labels = Object.keys(counts);
            const values = Object.values(counts);
            window.omDetailProvinceChart = new Chart(chartElement, {
                type: 'doughnut',
                data: { labels: labels.length ? labels : ['कुनै डाटा छैन'], datasets: [{ data: values.length ? values : [1], backgroundColor: labels.length ? ['#294674', '#259855', '#e1b547', '#b03140', '#7244a0', '#398ca1', '#ca7c23'] : ['#dce2ec'], borderWidth: 3, borderColor: '#fff' }] },
                options: { cutout: '55%', plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false }
            });
            const legend = document.getElementById('omDetailDonutLegend');
            if (legend) legend.innerHTML = Object.keys(counts).map((province, index) =>
                `<li class="legend-item"><span class="legend-dot" style="background:${['#294674', '#259855', '#e1b547', '#b03140', '#7244a0', '#398ca1', '#ca7c23'][index % 7]}"></span>${province}</li>`
            ).join('');
        }

        const filterValues = {
            formData: document.getElementById('omDetailFormFilters'),
            province: document.getElementById('omDetailFProvince'),
            district: document.getElementById('omDetailFDistrict'),
            localLevel: document.getElementById('omDetailFLocalLevel'),
            office: document.getElementById('omDetailFOffice'),
            monitor: document.getElementById('omDetailFMonitor'),
            issue: document.getElementById('omDetailFIssue')
        };
        const serviceFlowOptions = [...new Set(window.omDetailRecords.flatMap(row =>
            Object.entries(row.formData.service_flow || {}).map(([question, value]) => {
                const questionText = /^q\d+$/i.test(question)
                    ? document.querySelector(`#anugamanForm #sec2 input[name="${question}"]`)?.closest('.question-block')?.querySelector('.q-label')?.textContent.trim() || question
                    : question;
                return `${questionText}: ${value}`;
            })
        ))];
        const facilityOptions = [...new Set(window.omDetailRecords.flatMap(row =>
            (row.formData.facilities || []).filter(item => item.value).map(item => `${item.name}: ${item.value}`)
        ))];
        if (filterValues.formData) {
            filterValues.formData.innerHTML = `<label>फारम विवरण</label>
                <select id="omDetailFServiceFlow"><option value="">सेवा प्रवाह (सबै)</option>${serviceFlowOptions.map(value => `<option value="${value}">${value}</option>`).join('')}</select>
                <select id="omDetailFFacility"><option value="">सुविधा (सबै)</option>${facilityOptions.map(value => `<option value="${value}">${value}</option>`).join('')}</select>`;
            filterValues.serviceFlow = document.getElementById('omDetailFServiceFlow');
            filterValues.facility = document.getElementById('omDetailFFacility');
        }
        const serviceFlowLabel = (question, value) => {
            const questionText = /^q\d+$/i.test(question)
                ? document.querySelector(`#anugamanForm #sec2 input[name="${question}"]`)?.closest('.question-block')?.querySelector('.q-label')?.textContent.trim() || question
                : question;
            return `${questionText}: ${value}`;
        };
        const fillFilter = (element, values) => {
            if (!element) return;
            const selected = element.value;
            element.innerHTML = '<option value="">सबै</option>' + values.filter(Boolean).filter((value, index, list) => list.indexOf(value) === index)
                .map(value => `<option value="${value}">${value}</option>`).join('');
            element.value = values.includes(selected) ? selected : '';
        };
        fillFilter(filterValues.province, window.omDetailRecords.map(row => row.province));
        fillFilter(filterValues.district, window.omDetailRecords.map(row => row.district));
        fillFilter(filterValues.localLevel, window.omDetailRecords.map(row => row.localLevel));

        const applyDetailFilters = () => {
            const province = filterValues.province?.value || '';
            const district = filterValues.district?.value || '';
            const localLevel = filterValues.localLevel?.value || '';
            const office = (filterValues.office?.value || '').trim().toLowerCase();
            const monitor = (filterValues.monitor?.value || '').trim().toLowerCase();
            const issue = filterValues.issue?.value || '';
            const filtered = window.omDetailRecords.map((row, originalIndex) => ({row, originalIndex})).filter(({row}) =>
                (!province || row.province === province) &&
                (!district || row.district === district) &&
                (!localLevel || row.localLevel === localLevel) &&
                (!office || row.office.toLowerCase().includes(office)) &&
                (!monitor || row.monitor.toLowerCase().includes(monitor)) &&
                (!issue || (issue === 'yes' ? row.issue !== '-' : row.issue === '-')) &&
                (!filterValues.serviceFlow?.value || Object.entries(row.formData.service_flow || {}).some(([question, value]) => serviceFlowLabel(question, value) === filterValues.serviceFlow.value)) &&
                (!filterValues.facility?.value || (row.formData.facilities || []).some(item => `${item.name}: ${item.value}` === filterValues.facility.value))
            );
            setStat('omDetailStatTotal', filtered.length);
            setStat('omDetailStatProvince', new Set(filtered.map(({row}) => row.province).filter(value => value !== '-')).size);
            setStat('omDetailStatDistrict', new Set(filtered.map(({row}) => row.district).filter(value => value !== '-')).size);
            setStat('omDetailStatLocalLevel', new Set(filtered.map(({row}) => row.localLevel).filter(value => value !== '-')).size);
            setStat('omDetailStatOffice', new Set(filtered.map(({row}) => row.office).filter(Boolean)).size);
            if (tableBody) tableBody.innerHTML = filtered.length
                ? filtered.map(({row, originalIndex}) => `<tr data-idx="${originalIndex}">
                    <td>${row.date || '-'}</td><td>${row.province}</td><td>${row.district}</td>
                    <td>${row.localLevel}</td><td>${row.office}</td><td>${row.monitor}</td>
                    <td>${row.issue}</td><td>${row.status === 'done' ? 'सम्पन्न' : 'बाँकी'}</td>
                    <td><div class="om-detail-action-group">
                        <button class="om-detail-action-btn view" title="हेर्नुहोस्"><i class="fas fa-eye"></i></button>
                        <button class="om-detail-action-btn edit" title="सम्पादन"><i class="fas fa-pen"></i></button>
                        <button class="om-detail-action-btn delete" title="मेटाउनुहोस्"><i class="fas fa-trash"></i></button>
                    </div></td>
                </tr>`).join('')
                : '<tr class="om-detail-empty-row"><td colspan="9">कुनै डाटा फेला परेन</td></tr>';
            if (window.omDetailProvinceChart) {
                const counts = {};
                filtered.forEach(row => { if (row.province && row.province !== '-') counts[row.province] = (counts[row.province] || 0) + 1; });
                window.omDetailProvinceChart.data.labels = Object.keys(counts);
                window.omDetailProvinceChart.data.datasets[0].data = Object.values(counts);
                window.omDetailProvinceChart.update();
                const legend = document.getElementById('omDetailDonutLegend');
                if (legend) legend.innerHTML = Object.keys(counts).map((province, index) =>
                    `<li class="legend-item"><span class="legend-dot" style="background:${['#294674', '#259855', '#e1b547', '#b03140', '#7244a0', '#398ca1', '#ca7c23'][index % 7]}"></span>${province}</li>`
                ).join('');
            }
            window.omDetailMapRecords = filtered.map(({row}) => row);
            ['omDetailMapMonitored', 'omDetailMapProblem'].forEach((mapId, index) => {
                const mapKey = index === 0 ? 'omDetailMonitoredMapInstance' : 'omDetailProblemMapInstance';
                if (window[mapKey]) {
                    window[mapKey].remove();
                    requestAnimationFrame(() => {
                        window[mapKey] = omDetailInitMap(mapId, index === 0 ? 'monitored' : 'problem');
                    });
                }
            });
        };
        Object.values(filterValues).forEach(element => {
            if (element && !element.dataset.liveDataBound) {
                element.addEventListener(element.tagName === 'INPUT' ? 'input' : 'change', applyDetailFilters);
                element.dataset.liveDataBound = 'true';
            }
        });
        const resetDetailFilters = document.getElementById('omDetailResetFilterBtn');
        if (resetDetailFilters && !resetDetailFilters.dataset.liveDataBound) {
            resetDetailFilters.addEventListener('click', () => {
                Object.values(filterValues).forEach(element => {
                    if (element && 'value' in element) element.value = '';
                });
                applyDetailFilters();
            });
            resetDetailFilters.dataset.liveDataBound = 'true';
        }
        window.omDetailMapRecords = window.omDetailRecords;
    }

    OfficeMonitoringAPI.getAll().then(result => {
        if (result.success) updateOfficeMonitoringDashboardStats(result.data || []);
    }).catch(error => {
        console.error('Error loading office monitoring dashboard stats:', error);
    });

    // Office Monitoring Detail Modal Functions
    function showOfficeMonitoringViewModal(record) {
        const modal = document.getElementById('viewModal');
        const modalBody = document.getElementById('viewModalBody');
        
        if (!modal || !modalBody) return;
        
        modalBody.innerHTML = `
            <div class="view-modal-content">
                <div class="view-row"><span class="view-label">मिति:</span><span class="view-value">${record.date}</span></div>
                <div class="view-row"><span class="view-label">प्रदेश:</span><span class="view-value">${record.province}</span></div>
                <div class="view-row"><span class="view-label">जिल्ला:</span><span class="view-value">${record.district}</span></div>
                <div class="view-row"><span class="view-label">स्थानीय तह:</span><span class="view-value">${record.localLevel}</span></div>
                <div class="view-row"><span class="view-label">कार्यालय:</span><span class="view-value">${record.office}</span></div>
                <div class="view-row"><span class="view-label">अनुगमनकर्ता:</span><span class="view-value">${record.monitor}</span></div>
                <div class="view-row"><span class="view-label">समस्या:</span><span class="view-value">${record.issue}</span></div>
                <div class="view-row"><span class="view-label">स्थिति:</span><span class="view-value">${record.status === 'done' ? 'सम्पन्न' : 'बाँकी'}</span></div>
            </div>
        `;
        
        modal.style.display = 'block';
    }

    function showOfficeMonitoringEditModal(record) {
        // Create a simple prompt-based edit for now
        const newDate = prompt('मिति परिवर्तन गर्नुहोस्:', record.date);
        if (newDate === null) return;
        
        const newProvince = prompt('प्रदेश परिवर्तन गर्नुहोस्:', record.province);
        if (newProvince === null) return;
        
        const newDistrict = prompt('जिल्ला परिवर्तन गर्नुहोस्:', record.district);
        if (newDistrict === null) return;
        
        const newLocalLevel = prompt('स्थानीय तह परिवर्तन गर्नुहोस्:', record.localLevel);
        if (newLocalLevel === null) return;
        
        const newOffice = prompt('कार्यालय परिवर्तन गर्नुहोस्:', record.office);
        if (newOffice === null) return;
        
        const newMonitor = prompt('अनुगमनकर्ता परिवर्तन गर्नुहोस्:', record.monitor);
        if (newMonitor === null) return;
        
        const newIssue = prompt('समस्या परिवर्तन गर्नुहोस्:', record.issue);
        if (newIssue === null) return;
        
        const newStatus = prompt('स्थिति परिवर्तन गर्नुहोस् (done/pending):', record.status);
        if (newStatus === null) return;
        
        // Update the record
        const updatedData = {
            date: newDate,
            province: newProvince,
            district: newDistrict,
            localLevel: newLocalLevel,
            office: newOffice,
            monitor: newMonitor,
            issue: newIssue,
            status: newStatus
        };
        
        saveOfficeMonitoringEdit(record.id, updatedData);
    }

    async function deleteOfficeMonitoringRecord(recordId) {
        try {
            const result = await OfficeMonitoringAPI.delete(recordId);
            if (result.success) {
                // Find and remove from local array by ID
                const idx = window.omDetailRecords.findIndex(r => r.id === recordId);
                if (idx !== -1) {
                    window.omDetailRecords.splice(idx, 1);
                }
                // Reload the data
                loadOfficeMonitoringDetailData();
                alert('अनुगमन विवरण सफलतापूर्वक मेटाइयो');
            } else {
                alert('मेटाउनमा समस्या भयो: ' + (result.error || 'अज्ञात त्रुटि'));
            }
        } catch (error) {
            alert('मेटाउनमा समस्या भयो: ' + error.message);
        }
    }

    async function saveOfficeMonitoringEdit(recordId, updatedData) {
        try {
            // Convert Nepali date back to English if needed
            const convertNepaliToEnglish = (nepaliDate) => {
                // Simple conversion - in production, use proper date conversion library
                return nepaliDate.replace(/[०१२३४५६७८९]/g, d => '०१२३४५६७८९'.indexOf(d));
            };
            
            const apiData = {
                monitoring_date: convertNepaliToEnglish(updatedData.date),
                province: updatedData.province,
                district: updatedData.district,
                office_type: updatedData.localLevel,
                office_name: updatedData.office,
                monitoring_team: updatedData.monitor,
                issues_found: updatedData.issue !== '-' ? updatedData.issue : null
            };
            
            const result = await OfficeMonitoringAPI.update(recordId, apiData);
            
            if (result.success) {
                alert('अनुगमन विवरण सफलतापूर्वक अपडेट भयो');
                loadOfficeMonitoringDetailData();
            } else {
                alert('अपडेट गर्नमा समस्या भयो: ' + (result.error || 'अज्ञात त्रुटि'));
            }
        } catch (error) {
            alert('अपडेट गर्नमा समस्या भयो: ' + error.message);
        }
    }



    // Office Monitoring Handler - target second submenu under "कार्यालय अनुगमन"
    const officeMonMenu = document.querySelector('.sidebar-menu li:nth-child(3)');
    const officeMonSubmenu = officeMonMenu ? officeMonMenu.querySelector('.submenu') : null;

    // Dress Time Handler - target submenu under "समय/पोशाक अनुगमन"
    const dressTimeMenu = document.querySelector('.sidebar-menu li:nth-child(4)');
    const dressTimeSubmenu = dressTimeMenu ? dressTimeMenu.querySelector('.submenu') : null;

    if (officeMonMenu && (officeMonFormContainer || officeMonDetailContainer)) {
        // Use event delegation on the submenu
        officeMonSubmenu.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link) return;

            const linkText = link.querySelector('span') ? link.querySelector('span').textContent : '';

            if (linkText.includes('अनुगमन फारम')) {
                e.preventDefault();
                e.stopPropagation();

                hideAllPrimaryContent();

                // Show office monitoring form
                officeMonFormContainer.style.display = 'block';

                // Update sidebar active state
                sidebarMenuItems.forEach(item => item.classList.remove('active'));
                officeMonMenu.classList.add('active');

                // Close submenu
                closeActiveSubmenu();
            } else if (linkText.includes('अनुगमन विवरण')) {
                e.preventDefault();
                e.stopPropagation();

                hideAllPrimaryContent();

                // Show office monitoring detail
                officeMonDetailContainer.style.display = 'block';

                // Update sidebar active state
                sidebarMenuItems.forEach(item => item.classList.remove('active'));
                officeMonMenu.classList.add('active');

                // Close submenu
                closeActiveSubmenu();

                // Load statistics from API
                if (window.loadStatistics && window.loadStatistics.officeMonitoring) {
                    window.loadStatistics.officeMonitoring();
                }

                loadOfficeMonitoringDetailData().then(() => {
                    requestAnimationFrame(() => {
                    if (!window.omDetailMonitoredMapInstance) {
                        window.omDetailMonitoredMapInstance = omDetailInitMap('omDetailMapMonitored', 'monitored');
                    } else {
                        window.omDetailMonitoredMapInstance.invalidateSize();
                    }
                    if (!window.omDetailProblemMapInstance) {
                        window.omDetailProblemMapInstance = omDetailInitMap('omDetailMapProblem', 'problem');
                    } else {
                        window.omDetailProblemMapInstance.invalidateSize();
                    }
                    });
                }).catch(error => console.error('Error loading office monitoring details:', error));
            }
        });
    }

    // Dress Time Submenu Handler
    if (dressTimeMenu && dressTimeSubmenu && (dressTimeFormContainer || dressTimeDetailContainer)) {
        dressTimeSubmenu.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link) return;

            const linkText = link.querySelector('span') ? link.querySelector('span').textContent : '';

            if (linkText.includes('अनुगमन फारम')) {
                e.preventDefault();
                e.stopPropagation();

                hideAllPrimaryContent();

                // Show dress time form
                dressTimeFormContainer.style.display = 'block';

                // Initialize Nepali date dropdowns
                initializeNepaliDateDropdownsForDressTime();

                // Initialize dress time staff table functionality
                window.initializeDressTimeStaffTable();

                // Initialize dress time form submission
                window.initializeDressTimeFormSubmission();

                // Update sidebar active state
                sidebarMenuItems.forEach(item => item.classList.remove('active'));
                dressTimeMenu.classList.add('active');

                // Close submenu
                closeActiveSubmenu();
            } else if (linkText.includes('अनुगमन विवरण')) {
                e.preventDefault();
                e.stopPropagation();

                hideAllPrimaryContent();

                // Show dress time detail
                dressTimeDetailContainer.style.display = 'block';

                // Update sidebar active state
                sidebarMenuItems.forEach(item => item.classList.remove('active'));
                dressTimeMenu.classList.add('active');

                // Close submenu
                closeActiveSubmenu();

                // Load dress time detail data
                window.loadDressTimeDetailData();
            }
        });
    }

    // Ujiri Vivaran Handler - target second submenu under "उजुरी व्यवस्थापन"
    const ujiriVivaranLink = ujiriMenu ? ujiriMenu.querySelector('.submenu li:nth-child(2) a') : null;

    if (ujiriVivaranLink && ujiriVivaranContent) {
        ujiriVivaranLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            hideAllPrimaryContent();

            // Show ujiri vivaran
            ujiriVivaranContent.style.display = 'block';

            // Update sidebar active state
            sidebarMenuItems.forEach(item => item.classList.remove('active'));
            this.closest('.has-submenu').classList.add('active');

            // Close submenu
            closeActiveSubmenu();

            // Load statistics from API
            if (window.loadStatistics && window.loadStatistics.ujiri) {
                window.loadStatistics.ujiri();
            }

            // Initialize map if not already done
            setTimeout(() => {
                if (!window.ujiriMapInstance) {
                    const ujiriMapContainer = document.getElementById('ujiri-nepal-map');
                    if (ujiriMapContainer) {
                        try {
                            window.ujiriMapInstance = L.map('ujiri-nepal-map', {
                                zoomControl: false,
                                zoomSnap: 0.1
                            }).setView([28.3949, 84.1240], 5.1);

                            const riskColors = {
                                low: '#6cbd78',
                                medium: '#f9e075',
                                high: '#f07f74',
                                unknown: '#e0e0e0'
                            };

                            const geoJsonUrl = 'https://raw.githubusercontent.com/Acesmndr/nepal-geojson/master/generated-geojson/nepal-with-districts-acesmndr.geojson';

                            fetch(geoJsonUrl)
                                .then(response => response.json())
                                .then(data => {
                                    const features = data.features.map(feature => {
                                        const rand = Math.random();
                                        let color = riskColors.unknown;
                                        if (rand > 0.6) color = riskColors.low;
                                        else if (rand > 0.3) color = riskColors.medium;
                                        else if (rand > 0.1) color = riskColors.high;
                                        
                                        feature.properties.riskColor = color;
                                        return feature;
                                    });

                                    const geojsonLayer = L.geoJSON(features, {
                                        style: function(feature) {
                                            return {
                                                color: '#fff',
                                                weight: 1,
                                                opacity: 1,
                                                fillColor: feature.properties.riskColor || riskColors.unknown,
                                                fillOpacity: 0.7
                                            };
                                        },
                                        onEachFeature: function(feature, layer) {
                                            if (feature.properties) {
                                                const englishName = feature.properties.NAME_1 || feature.properties.DISTRICT || feature.properties.District || feature.properties.district || feature.properties.NAME || feature.properties.name || '';
                                                if (englishName) {
                                                    const nepaliName = window.DISTRICT_NAME_MAP && window.DISTRICT_NAME_MAP[englishName.toUpperCase()] ? window.DISTRICT_NAME_MAP[englishName.toUpperCase()] : englishName;
                                                    layer.bindPopup(`<strong>${nepaliName}</strong>`);
                                                }
                                            }
                                        }
                                    }).addTo(window.ujiriMapInstance);

                                    window.ujiriMapInstance.fitBounds(geojsonLayer.getBounds(), { padding: [100, 100] });
                                })
                                .catch(err => {
                                    console.error("Error loading GeoJSON:", err);
                                });
                        } catch (error) {
                            console.error('Error initializing map:', error);
                        }
                    }
                } else {
                    // Invalidate size to ensure proper rendering
                    requestAnimationFrame(function() {
                        setTimeout(function() {
                            window.ujiriMapInstance.invalidateSize();
                        }, 300);
                    });
                }
            }, 100);
        });
    }

    // Survey Form Handler - target submenu items under "सेवाग्राही सर्वेक्षण"
    const surveyMenu = Array.from(document.querySelectorAll('.has-submenu')).find(item =>
        item.querySelector('span') && item.querySelector('span').textContent.includes('सेवाग्राही सर्वेक्षण')
    );

    const surveyFormLink = surveyMenu ? surveyMenu.querySelector('.submenu li:nth-child(1) a') : null;
    const surveyVivaranLink = surveyMenu ? surveyMenu.querySelector('.submenu li:nth-child(2) a') : null;

    function showSurveyForm() {
        hideAllPrimaryContent();

        // Show survey form
        surveyFormContainer.style.display = 'block';

        // Initialize survey form
        initializeSurveyForm();

        // Update sidebar active state
        sidebarMenuItems.forEach(item => item.classList.remove('active'));
        surveyMenu.classList.add('active');

        // Close submenu
        closeActiveSubmenu();
    }

    if (surveyFormLink && surveyFormContainer) {
        surveyFormLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showSurveyForm();
        });
    }

    if (surveyVivaranLink && surveyFormContainer) {
        surveyVivaranLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            hideAllPrimaryContent();

            // Show survey dashboard
            if (surveyDashboardContainer) {
                surveyDashboardContainer.style.display = 'block';

                // Load statistics from API
                if (window.loadStatistics && window.loadStatistics.survey) {
                    window.loadStatistics.survey();
                }

                // Initialize survey dashboard if not already done
                if (!window.surveyDashboardInitialized) {
                    initializeSurveyDashboard();
                    window.surveyDashboardInitialized = true;
                }
            }

            // Update sidebar active state
            sidebarMenuItems.forEach(item => item.classList.remove('active'));
            this.closest('.has-submenu').classList.add('active');

            // Close submenu
            closeActiveSubmenu();
        });
    }

    // Project Monitoring Dashboard Handler
    const projectMonitoringFormLink = document.getElementById('projectMonitoringForm');
    
    if (projectMonitoringFormLink && projectMonitoringFormContainer) {
        projectMonitoringFormLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            hideAllPrimaryContent();

            // Show form
            projectMonitoringFormContainer.style.display = 'block';

            // Update sidebar active state
            sidebarMenuItems.forEach(item => item.classList.remove('active'));
            this.closest('.has-submenu').classList.add('active');

            // Close submenu
            closeActiveSubmenu();

            // Initialize team blocks if not already done
            if (!window.teamBlocksInitialized) {
                initializeTeamBlocks();
                window.teamBlocksInitialized = true;
            }
        });
    }

    if (projectMonitoringDashboardLink && projectMonitoringDashboard) {
        projectMonitoringDashboardLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            hideAllPrimaryContent();

            // Show dashboard
            projectMonitoringDashboard.style.display = 'block';

            // Update sidebar active state
            sidebarMenuItems.forEach(item => item.classList.remove('active'));
            this.closest('.has-submenu').classList.add('active');

            // Close submenu
            closeActiveSubmenu();

            // Load statistics from API
            if (window.loadStatistics && window.loadStatistics.projectMonitoring) {
                window.loadStatistics.projectMonitoring();
            }

            // Initialize project monitoring dashboard if not already done
            if (!window.projectMonitoringInitialized) {
                initializeProjectMonitoringDashboard();
                window.projectMonitoringInitialized = true;
            }
        });
    }

    if (promotionalProgramsToggle && promotionalProgramsContent) {
        promotionalProgramsToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            hideAllPrimaryContent();
            promotionalProgramsContent.style.display = 'block';

            sidebarMenuItems.forEach(item => item.classList.remove('active'));
            this.closest('li').classList.add('active');
            closeActiveSubmenu();

            if (!window.promotionalProgramsSectionReady) {
                initializePromotionalProgramsPage();
                window.promotionalProgramsSectionReady = true;
            }
        });
    }

    if (annualProgramToggle && annualProgramContent) {
        annualProgramToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            hideAllPrimaryContent();
            annualProgramContent.style.display = 'block';

            sidebarMenuItems.forEach(item => item.classList.remove('active'));
            this.closest('li').classList.add('active');
            closeActiveSubmenu();

            initializeAnnualProgramPage();
        });
    }

    const annualProgramMonths = ['श्रावण', 'भदौ', 'असोज', 'कार्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत', 'वैशाख', 'जेठ', 'असार'];
    const annualProgramShortMonths = ['श्रा', 'भदौ', 'असो', 'कार्', 'मंसि', 'पुस', 'माघ', 'फा', 'चैत', 'वै', 'जेठ', 'असा'];
    const annualProgramQuarters = ['प्रथम त्रैमासिक', 'दोस्रो त्रैमासिक', 'तेस्रो त्रैमासिक', 'चौथो त्रैमासिक'];
    let annualProgramMonth = 0;
    let annualProgramView = 'month';
    let annualProgramInitialized = false;
    let annualProgramData = [];
    const annualProgramSeedData = [{"sn": 1, "act": "11.3.22.53", "head": "31122", "prog": "सीसीटिभि, स्क्रिन, स्पाई डिभाइस खरिद तथा जडान / सञ्‍चालन", "activity": "सीसीटिभि, स्क्रिन, स्पाई डिभाइस खरिद तथा जडान / सञ्‍चालन गर्ने", "budget": 2.7, "lead": "प्रहरी व्यवस्थापन, सूचना संकलन, निगरानी तथा अनुगमन महाशाखा", "support": "प्रशासन तथा अनुगमन महाशाखा / प्रशासन तथा योजना शाखा / आर्थिक प्रशासन शाखा", "target": 3, "months": [2, 5, 8]}, {"sn": 2, "act": "11.6.4.15", "head": "31134", "prog": "सम्पत्ति विवरण अनुगमन सम्बन्धी सफ्टवेयर अद्यावधिक गर्ने", "activity": "सम्पत्ति विवरण अनुगमन सम्बन्धी सफ्टवेयर अद्यावधिकरण तथा सञ्‍चालन गर्ने", "budget": 4.0, "lead": "नीति निर्माण तथा कानूनी राय परामर्श महाशाखा", "support": "प्रशासन तथा अनुगमन महाशाखा / सम्पत्ति विवरण तथा अनुगमन शाखा / आर्थिक प्रशासन शाखा", "target": 1, "months": [2]}, {"sn": 3, "act": "11.6.15.30", "head": "31134", "prog": "प्राप्त उजुरी अद्यावधिक गरी उजुरी फर्छ्यौट तथा प्रतिवेदन प्रणालीलाई प्रभावकारी बनाउन उजुरी व्यवस्थापन प्रणाली निर्माण तथा सञ्‍चालन गर्ने", "activity": "उजुरी व्यवस्थापन प्रणाली निर्माण तथा सञ्‍चालन गर्ने", "budget": 4.0, "lead": "नीति निर्माण तथा कानूनी राय परामर्श महाशाखा", "support": "अन्य सबै महाशाखा/शाखा हरु", "target": 1, "months": [5]}, {"sn": 4, "act": "2.5.2.54", "head": "22411", "prog": "प्राविधिक परीक्षणका लागि तथ्याङ्क आधार तयार गर्ने", "activity": "आयोजनाहरुको छनौट गर्ने", "budget": 1.2, "lead": "प्राविधिक परीक्षण तथा अनुगमन महाशाखा", "support": "आर्थिक प्रशासन शाखा", "target": 1, "months": [2]}, {"sn": 5, "act": "2.5.3.45", "head": "22411", "prog": "प्राविधिक परीक्षण", "activity": "प्राविधिक परीक्षण सम्पन्न गर्ने", "budget": 94.54, "lead": "प्राविधिक परीक्षण तथा अनुगमन महाशाखा", "support": "आर्थिक प्रशासन शाखा", "target": 15, "months": [10]}, {"sn": 6, "act": "2.5.3.101", "head": "22411", "prog": "NCR को फिल्डस्तरमा सुक्ष्म अनुगमन (प्राविधिक परीक्षणमा औंल्याइएका NCR हरुको फिल्डमा अनुगमन", "activity": "NCR हरुको फिल्डमा गै सुक्ष्मस्तरमा अनुगमन गर्ने", "budget": 13.26, "lead": "प्राविधिक परीक्षण तथा अनुगमन महाशाखा", "support": "आर्थिक प्रशासन शाखा", "target": 10, "months": [5, 8, 9]}, {"sn": 7, "act": "2.5.3.117", "head": "22411", "prog": "गत आ.व. को क्रमागत प्राविधिक परीक्षण", "activity": "गत आ.व. को क्रमागत प्राविधिक परीक्षण गर्ने", "budget": 40.0, "lead": "प्राविधिक परीक्षण तथा अनुगमन महाशाखा", "support": "आर्थिक प्रशासन शाखा", "target": 10, "months": [2, 5]}, {"sn": 8, "act": "2.6.3.4", "head": "22511", "prog": "कर्मचारी क्षमता विकास", "activity": "कर्मचारी क्षमता विकास तालिस सञ्‍चालन गर्ने", "budget": 5.0, "lead": "प्रशासन तथा अनुगमन महाशाखा/शाखा", "support": "अन्य सबै महाशाखा/शाखा हरु", "target": 2, "months": [2, 8]}, {"sn": 9, "act": "2.6.4.5", "head": "22512", "prog": "भ्रष्टाचार विरुद्ध / प्राविधिक परीक्षण अनुतर निकाय समन्वय गोष्ठी", "activity": "गोष्ठी/कार्यक्रम सञ्‍चालन गर्ने", "budget": 12.92, "lead": "प्राविधिक परीक्षण तथा अनुगमन महाशाखा", "support": "आर्थिक प्रशासन शाखा", "target": 7, "months": [5, 8, 9]}, {"sn": 10, "act": "2.6.4.30", "head": "22512", "prog": "प्राविधिक परीक्षक तालिम", "activity": "प्राविधिक परीक्षक तालिम सञ्‍चालन गर्ने", "budget": 15.08, "lead": "प्राविधिक परीक्षण तथा अनुगमन महाशाखा", "support": "आर्थिक प्रशासन शाखा", "target": 1, "months": [8]}, {"sn": 11, "act": "2.7.5.2", "head": "22522", "prog": "प्रदेश/स्थानीय तहमा सचेतनामूलक कार्यक्रम", "activity": "गोष्ठी/कार्यक्रम सञ्‍चालन गर्ने", "budget": 19.92, "lead": "प्रशासन तथा अनुगमन महाशाखा/शाखा", "support": "अन्य सबै महाशाखा/शाखा हरु", "target": 14, "months": [4, 5, 6, 7, 8, 9, 10]}, {"sn": 12, "act": "2.7.5.69", "head": "22522", "prog": "प्रचार-प्रसार सामाग्री उत्पादन तथा प्रसारण", "activity": "सामग्री निर्माण तथा प्रचार प्रसार गर्ने", "budget": 3.29, "lead": "प्रहरी व्यवस्थापन, सूचना संकलन, निगरानी तथा अनुगमन महाशाखा", "support": "प्रशासन शाखा / आर्थिक प्रशासन शाखा", "target": 2, "months": [2, 8]}, {"sn": 13, "act": "2.7.5.77", "head": "22522", "prog": "भ्रष्टाचार विरुद्ध डिजिटल प्रकाशन प्रशारण मार्फत डिजिटल सचेतना कार्यक्रम", "activity": "कार्यक्रम सञ्‍चालन गर्ने", "budget": 3.3, "lead": "प्रहरी व्यवस्थापन, सूचना संकलन, निगरानी तथा अनुगमन महाशाखा", "support": "अन्य सबै महाशाखा/शाखा हरु", "target": 4, "months": [2, 5, 8, 10]}, {"sn": 14, "act": "2.7.5.78", "head": "22522", "prog": "सम्पत्ति विवरण पेश गर्ने तथा सदाचार सम्बन्धमा विज्ञापन तथा सूचना प्रकाशन गर्ने", "activity": "सूचना प्रकाशन गर्ने", "budget": 3.15, "lead": "नीति निर्माण तथा कानूनी राय परामर्श महाशाखा", "support": "सम्पत्ति विवरण तथा अनुगमन शाखा", "target": 2, "months": [0]}, {"sn": 15, "act": "2.7.24.4", "head": "22522", "prog": "केन्द्रमा कार्यरत उत्कृष्ठ कार्यसम्पादन गर्ने कर्मचारीहरुलाई पुरस्कार तथा प्रमाणपत्र प्रदान गर्ने", "activity": "पुरस्कार तथा प्रमाणपत्र प्रदान गर्ने", "budget": 0.7, "lead": "प्रशासन तथा अनुगमन महाशाखा / प्रशासन तथा योजना शाखा", "support": "अन्य सबै महाशाखा/शाखा हरु", "target": 10, "months": [0]}, {"sn": 16, "act": "2.7.25.11", "head": "22522", "prog": "कर्मचारी/स्थानीय तहमा पदाधिकारीलाई सदाचार शिक्षा", "activity": "गोष्ठी/कार्यक्रम सञ्‍चालन गर्ने", "budget": 25.45, "lead": "प्रशासन तथा अनुगमन महाशाखा/शाखा", "support": "अन्य सबै महाशाखा/शाखा हरु", "target": 18, "months": [4, 5, 6, 7, 8, 9]}, {"sn": 17, "act": "2.7.25.1006", "head": "22522", "prog": "आवधिक प्रगति समिक्षा", "activity": "बैठक/गोष्ठी सञ्‍चालन गर्ने", "budget": 1.41, "lead": "प्रशासन तथा अनुगमन महाशाखा/शाखा", "support": "अन्य सबै महाशाखा/शाखा हरु", "target": 1, "months": [2, 5, 8]}, {"sn": 18, "act": "2.7.25.1194", "head": "22522", "prog": "उजुरीको अभिलेख प्रणालीलाई प्रभावकारी बनाउन प्राप्त उजुरी तथा सोसँग सम्बन्धित कागजातहरुको डिजिटाइजेशन गर्ने", "activity": "उजुरी अभिलेख प्रणाली प्रभावकारी बनाउने", "budget": 4.2, "lead": "नीति निर्माण तथा कानूनी राय परामर्श महाशाखा / उजुरी व्यवस्थापन, अन्वेषण तथा अनुगमन शाखा", "support": "अन्य सबै महाशाखा/शाखा हरु", "target": 1, "months": [2, 5, 8]}, {"sn": 19, "act": "2.7.25.1193", "head": "22522", "prog": "सुझाव निर्देशन कार्यान्वयन अनुगमन", "activity": "सुझाव निर्देशन कार्यान्वयन अनुगमन गर्ने", "budget": 2.45, "lead": "नीति निर्माण तथा कानूनी राय परामर्श महाशाखा / नीति निर्माण तथा अनुगमन शाखा", "support": "अन्य सबै महाशाखा/शाखा हरु", "target": 7, "months": [2, 5, 8]}, {"sn": 20, "act": "2.7.25.1190", "head": "22522", "prog": "राष्ट्रिय सतर्कता केन्द्र नियमावली तयारी", "activity": "राष्ट्रिय सतर्कता केन्द्र नियमावली तयार गर्ने", "budget": 2.1, "lead": "नीति निर्माण तथा कानूनी राय परामर्श महाशाखा / नीति निर्माण तथा अनुगमन शाखा", "support": "अन्य सबै महाशाखा/शाखा हरु", "target": 1, "months": [2]}, {"sn": 21, "act": "2.7.25.942", "head": "22522", "prog": "सबै किसिमका सार्वजनिक सेवा प्रवाहको स्थलगतरुपमा सुक्ष्म अनुगमन तथा निगरानी", "activity": "स्थलगतरुपमा सुक्ष्म अनुगमन तथा निगरानी गर्ने", "budget": 13.3, "lead": "प्रशासन तथा अनुगमन महाशाखा / प्रशासन तथा योजना शाखा", "support": "अन्य सबै महाशाखा/शाखा हरु", "target": 20, "months": [2, 5, 8, 10]}, {"sn": 22, "act": "2.7.25.943", "head": "22522", "prog": "राष्ट्रिय सतर्कता केन्द्र दिवस", "activity": "स्थापना दिवस मनाउने", "budget": 2.66, "lead": "प्रहरी व्यवस्थापन, सूचना संकलन, निगरानी तथा अनुगमन महाशाखा", "support": "अन्य सबै महाशाखा/शाखा हरु", "target": 1, "months": [0]}, {"sn": 23, "act": "2.7.25.944", "head": "22522", "prog": "बार्षिक प्रतिवेदन तयारी तथा प्रकाशन", "activity": "प्रतिवेदन तयार गरी प्रकाशन गर्ने", "budget": 1.89, "lead": "प्रशासन तथा अनुगमन महाशाखा/शाखा", "support": "अन्य सबै महाशाखा/शाखा हरु", "target": 1, "months": [0]}, {"sn": 24, "act": "2.7.25.945", "head": "22522", "prog": "विद्यालय, विश्वविद्यालय तथा समुदायस्तरमा सचेतना कार्यक्रम", "activity": "कार्यक्रम सञ्‍चालन गर्ने", "budget": 5.6, "lead": "नीति निर्माण तथा कानूनी राय परामर्श महाशाखा", "support": "अन्य सबै महाशाखा/शाखा हरु", "target": 4, "months": [4, 5, 7, 8]}, {"sn": 25, "act": "2.7.25.946", "head": "22522", "prog": "आचरण तथा आचारसंहिता अनुगमन अनुसन्धान", "activity": "अनुगमन तथा अनुसन्धान गर्ने", "budget": 2.52, "lead": "प्रशासन तथा अनुगमन महाशाखा", "support": "अन्य सबै महाशाखा/शाखा हरु", "target": 1, "months": [5]}, {"sn": 26, "act": "2.7.25.947", "head": "22522", "prog": "उजुरी छानविन तथा अद्यावधिकरण", "activity": "उजुरी छानविन तथा अद्यावधिकिकरण गर्ने", "budget": 2.52, "lead": "नीति निर्माण तथा कानूनी राय परामर्श महाशाखा", "support": "अन्य सबै महाशाखा/शाखा हरु", "target": 1, "months": [2, 5, 8, 10]}, {"sn": 27, "act": "2.7.25962", "head": "22522", "prog": "केन्द्रको कार्यसञ्‍चालन मापदण्ड तयारी, स्वीकृति तथा कार्यान्वयन", "activity": "SOP निर्माण गर्ने", "budget": 1.54, "lead": "नीति निर्माण तथा कानूनी राय परामर्श महाशाखा", "support": "अन्य सबै महाशाखा/शाखा हरु", "target": 1, "months": [5]}];

    function annualProgramDigits(value) {
        return String(value ?? '').replace(/[0-9]/g, digit => '०१२३४५६७८९'[digit]);
    }

    function annualProgramEscape(value) {
        return String(value ?? '').replace(/[&<>"']/g, character => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[character]));
    }

    function annualProgramLoadData() {
        return annualProgramData;
    }

    async function annualProgramLoadFromApi() {
        const fiscalYear = document.getElementById('annualFiscalYear').value;
        try {
            const response = await fetch(`/api/annual-programs?fiscal_year=${encodeURIComponent(fiscalYear)}`);
            if (!response.ok) throw new Error('वार्षिक कार्यक्रम लोड गर्न सकिएन');
            const result = await response.json();
            annualProgramData = result.data || [];
            if (fiscalYear === '2083/84' && annualProgramSeedData.length) {
                const existingSerialNumbers = new Set(annualProgramData.map(item => Number(item.sn)));
                const missingSeedData = annualProgramSeedData.filter(item => !existingSerialNumbers.has(Number(item.sn)));
                for (const item of missingSeedData) {
                    const seedResponse = await fetch('/api/annual-programs', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...item, fiscal_year: fiscalYear })
                    });
                    if (!seedResponse.ok) throw new Error('२०८३/८४ का कार्यक्रम database मा राख्न सकिएन');
                }
                const seededResponse = await fetch(`/api/annual-programs?fiscal_year=${encodeURIComponent(fiscalYear)}`);
                annualProgramData = (await seededResponse.json()).data || [];
            }
        } catch (error) {
            console.error('Annual program API error:', error);
            annualProgramData = fiscalYear === '2083/84' ? annualProgramSeedData.map(item => ({ ...item })) : [];
        }
    }

    async function annualProgramRefreshFromApi() {
        await annualProgramLoadFromApi();
        renderAnnualProgram();
    }

    async function annualProgramEdit(id) {
        const item = annualProgramData.find(program => Number(program.id) === Number(id));
        if (!item) return;
        const program = window.prompt('कार्यक्रम', item.prog);
        if (program === null || !program.trim()) return;
        const activity = window.prompt('क्रियाकलाप', item.activity || program);
        if (activity === null) return;
        const activityNumber = window.prompt('क्रियाकलाप नं.', item.act || '');
        if (activityNumber === null) return;
        const expenditureHead = window.prompt('खर्च शीर्षक', item.head || '');
        if (expenditureHead === null) return;
        const leadDepartment = window.prompt('कार्यान्वयन गर्ने महाशाखा/शाखा', item.lead || '');
        if (leadDepartment === null) return;
        const supportingDepartment = window.prompt('सहयोगी शाखा', item.support || '');
        if (supportingDepartment === null) return;
        const budget = window.prompt('बजेट (लाख)', item.budget);
        if (budget === null) return;
        const target = window.prompt('वार्षिक लक्ष्य', item.target);
        if (target === null) return;
        const months = window.prompt('महिना नम्बर (0-11), comma separated', (item.months || []).join(','));
        if (months === null) return;
        const response = await fetch(`/api/annual-programs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...item, prog: program.trim(), activity, act: activityNumber, head: expenditureHead, lead: leadDepartment, support: supportingDepartment, budget: Number(budget || 0), target: Number(target || 0), months: months.split(',').map(value => Number(value.trim())).filter(value => Number.isInteger(value) && value >= 0 && value < 12) })
        });
        if (!response.ok) return alert('कार्यक्रम अद्यावधिक गर्न सकिएन।');
        await annualProgramRefreshFromApi();
    }

    async function annualProgramDelete(id) {
        if (!window.confirm('यो कार्यक्रम हटाउने?')) return;
        const response = await fetch(`/api/annual-programs/${id}`, { method: 'DELETE' });
        if (!response.ok) return alert('कार्यक्रम हटाउन सकिएन।');
        await annualProgramRefreshFromApi();
    }

    function annualProgramFilteredData() {
        const data = annualProgramLoadData();
        const query = document.getElementById('annualProgramSearch').value.trim().toLowerCase();
        const division = document.getElementById('annualProgramDivision').value;
        return data.filter(item => {
            if (division && !String(item.lead || '').startsWith(division)) return false;
            if (!query) return true;
            return [item.prog, item.activity, item.act, item.lead, item.support, item.head].join(' ').toLowerCase().includes(query);
        });
    }

    function renderAnnualProgramRail(data) {
        const rail = document.getElementById('annualProgramRail');
        const counts = annualProgramMonths.map((_, index) => data.filter(item => (item.months || []).includes(index)).length);
        rail.innerHTML = annualProgramMonths.map((month, index) => `${index % 3 === 0 ? `<p class="qtr">${annualProgramQuarters[index / 3]}</p>` : ''}<button type="button" class="${counts[index] ? '' : 'empty'}" data-annual-month="${index}" aria-current="${index === annualProgramMonth}"><span>${month}</span><span class="n">${annualProgramDigits(counts[index])}</span></button>`).join('');
        rail.querySelectorAll('[data-annual-month]').forEach(button => button.onclick = () => {
            annualProgramMonth = Number(button.dataset.annualMonth);
            renderAnnualProgram();
        });
    }

    function renderAnnualProgramMonth(data) {
        const items = data.filter(item => (item.months || []).includes(annualProgramMonth));
        const budget = items.reduce((sum, item) => sum + Number(item.budget || 0), 0);
        const divisions = new Set(items.map(item => String(item.lead || '').split('/')[0].trim()));
        let html = `<div class="annual-program-panelhead"><h2>${annualProgramMonths[annualProgramMonth]}</h2><span class="annual-program-stat">कार्यक्रम <b>${annualProgramDigits(items.length)}</b></span><span class="annual-program-stat">वार्षिक बजेट <b>रु. ${annualProgramDigits(budget.toFixed(2))} लाख</b></span><span class="annual-program-stat">महाशाखा <b>${annualProgramDigits(divisions.size)}</b></span></div>`;
        html += items.length ? items.map(item => `<article class="annual-program-card"><h3><span class="sn">${annualProgramDigits(item.sn)}.</span>${annualProgramEscape(item.prog)}</h3><p class="act">${annualProgramEscape(item.activity)}</p><div class="annual-program-meta"><div><span class="k">बजेट (लाख)</span><span class="v">रु. ${annualProgramDigits(item.budget)}</span></div><div><span class="k">वार्षिक लक्ष्य</span><span class="v">${annualProgramDigits(item.target)}</span></div><div><span class="k">क्रियाकलाप नं.</span><span class="v">${annualProgramDigits(item.act)}</span></div><div><span class="k">खर्च शीर्षक</span><span class="v">${annualProgramDigits(item.head)}</span></div><div style="grid-column:1/-1"><span class="k">कार्यान्वयन गर्ने महाशाखा/शाखा</span><span class="v">${annualProgramEscape(item.lead)}</span></div><div style="grid-column:1/-1"><span class="k">सहयोगी शाखा</span><span class="v">${annualProgramEscape(item.support)}</span></div></div><div class="annual-program-strip"><span class="annual-program-striplabel">कार्यान्वयन महिना</span>${annualProgramShortMonths.map((month, index) => `<span class="cell ${item.months.includes(index) ? 'on' : ''} ${index === annualProgramMonth ? 'now' : ''}" title="${annualProgramMonths[index]}">${month}</span>`).join('')}</div></article>`).join('') : '<div class="annual-program-empty-state">यस महिनामा कुनै कार्यक्रम तोकिएको छैन। अर्को महिना छान्नुहोस् वा खोज हटाउनुहोस्।</div>';
        document.getElementById('annualMonthView').innerHTML = html;
    }

    function renderAnnualProgramYear(data) {
        const heads = annualProgramMonths.map((_, index) => `<th class="m ${index % 3 === 0 ? 'qsep' : ''}" scope="col">${annualProgramShortMonths[index]}</th>`).join('');
        const rows = data.map(item => `<tr><td class="num">${annualProgramDigits(item.sn)}</td><td>${annualProgramEscape(item.prog)}</td><td class="num">रु. ${annualProgramDigits(item.budget)}</td><td class="num">${annualProgramDigits(item.target)}</td>${annualProgramMonths.map((_, index) => {
            const separator = index % 3 === 0 ? 'qsep' : '';
            if (!(item.months || []).includes(index)) return `<td class="m ${separator}"></td>`;
            const key = `annualProgramColor-${item.sn}-${index}`;
            const color = localStorage.getItem(key) || '#9e2a4a';
            return `<td class="m ${separator} on" data-color-key="${key}"><input class="annual-program-cell-color" type="color" value="${color}" aria-label="महिना ${annualProgramShortMonths[index]} को रंग"></td>`;
        }).join('')}<td class="annual-program-actions"><button class="annual-program-edit-button" type="button" data-annual-edit="${item.id}" title="सम्पादन" aria-label="सम्पादन"><i class="fas fa-edit" aria-hidden="true"></i></button><button class="annual-program-delete-button" type="button" data-annual-delete="${item.id}" title="हटाउनुहोस्" aria-label="हटाउनुहोस्"><i class="fas fa-trash" aria-hidden="true"></i></button></td></tr>`).join('');
        const totals = annualProgramMonths.map((_, index) => data.filter(item => (item.months || []).includes(index)).length);
        document.getElementById('annualYearView').innerHTML = `<div class="annual-program-matrix"><div class="annual-program-matrix-color-control"><label for="annualMarkColor">सक्रिय महिनाको रंग</label><input id="annualMarkColor" type="color" aria-label="सक्रिय महिनाको रंग"><button class="annual-program-matrix-add-btn" id="annualAddProgramButton" type="button">नयाँ कार्यक्रम थप्नुहोस्</button></div><div class="annual-program-add-form" id="annualAddProgramForm" hidden><input id="annualNewProgram" type="text" placeholder="कार्यक्रम" aria-label="कार्यक्रम" required><input id="annualNewActivity" type="text" placeholder="क्रियाकलाप" aria-label="क्रियाकलाप"><input id="annualNewAct" type="text" placeholder="क्रियाकलाप नं." aria-label="क्रियाकलाप नं."><input id="annualNewHead" type="text" placeholder="खर्च शीर्षक" aria-label="खर्च शीर्षक"><input id="annualNewLead" type="text" placeholder="कार्यान्वयन गर्ने महाशाखा/शाखा" aria-label="कार्यान्वयन गर्ने महाशाखा/शाखा"><input id="annualNewSupport" type="text" placeholder="सहयोगी शाखा" aria-label="सहयोगी शाखा"><input id="annualNewBudget" type="number" min="0" step=".01" placeholder="बजेट" aria-label="बजेट"><input id="annualNewTarget" type="number" min="0" step="1" placeholder="लक्ष्य" aria-label="लक्ष्य"><span>महिना:</span>${annualProgramShortMonths.map((month, index) => `<label><input class="annual-new-month" type="checkbox" value="${index}">${month}</label>`).join('')}<button class="save" id="annualSaveProgram" type="button">थप्नुहोस्</button><button id="annualCancelProgram" type="button">रद्द</button></div><table><thead><tr><th scope="col">सि.नं.</th><th scope="col">कार्यक्रम</th><th scope="col">बजेट</th><th scope="col">लक्ष्य</th>${heads}<th scope="col" class="annual-program-actions">कार्य</th></tr></thead><tbody>${rows || '<tr><td colspan="17">कुनै कार्यक्रम भेटिएन।</td></tr>'}</tbody><tfoot><tr><td colspan="4">महिनागत कार्यक्रम संख्या</td>${totals.map((total, index) => `<td class="m num ${index % 3 === 0 ? 'qsep' : ''}">${annualProgramDigits(total)}</td>`).join('')}<td></td></tr></tfoot></table></div>`;
        const matrix = document.getElementById('annualYearView');
        const annualAddForm = document.getElementById('annualAddProgramForm');
        matrix.querySelectorAll('th:not(.annual-program-actions), td:not(.annual-program-actions)').forEach(cell => { cell.contentEditable = 'true'; cell.spellcheck = false; });
        const markColor = document.getElementById('annualMarkColor');
        markColor.value = localStorage.getItem('annualProgramMarkColor') || '#9e2a4a';
        markColor.oninput = () => { document.querySelector('.annual-program-view').style.setProperty('--annual-mark', markColor.value); localStorage.setItem('annualProgramMarkColor', markColor.value); };
        matrix.querySelectorAll('.annual-program-cell-color').forEach(input => input.oninput = () => {
            const cell = input.closest('td');
            cell.style.backgroundColor = input.value;
            localStorage.setItem(cell.dataset.colorKey, input.value);
        });
        document.getElementById('annualAddProgramButton').onclick = () => { document.getElementById('annualAddProgramForm').hidden = !document.getElementById('annualAddProgramForm').hidden; };
        document.getElementById('annualCancelProgram').onclick = () => { annualAddForm.hidden = true; };
        matrix.querySelectorAll('[data-annual-edit]').forEach(button => button.onclick = () => annualProgramEdit(button.dataset.annualEdit));
        matrix.querySelectorAll('[data-annual-delete]').forEach(button => button.onclick = () => annualProgramDelete(button.dataset.annualDelete));
        document.getElementById('annualSaveProgram').onclick = async () => {
            const name = document.getElementById('annualNewProgram').value.trim();
            if (!name) return document.getElementById('annualNewProgram').focus();
            const response = await fetch('/api/annual-programs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fiscal_year: document.getElementById('annualFiscalYear').value, sn: annualProgramData.length ? Math.max(...annualProgramData.map(item => Number(item.sn) || 0)) + 1 : 1, act: document.getElementById('annualNewAct').value, head: document.getElementById('annualNewHead').value, prog: name, activity: document.getElementById('annualNewActivity').value || name, budget: Number(document.getElementById('annualNewBudget').value || 0), target: Number(document.getElementById('annualNewTarget').value || 0), lead: document.getElementById('annualNewLead').value, support: document.getElementById('annualNewSupport').value, months: [...matrix.querySelectorAll('.annual-new-month:checked')].map(input => Number(input.value)) }) });
            if (!response.ok) return alert('कार्यक्रम सेभ गर्न सकिएन।');
            await annualProgramRefreshFromApi();
        };
    }

    function renderAnnualProgram() {
        const data = annualProgramFilteredData();
        renderAnnualProgramRail(data);
        document.getElementById('annualMonthView').hidden = annualProgramView !== 'month';
        document.getElementById('annualYearView').hidden = annualProgramView === 'month';
        if (annualProgramView === 'month') renderAnnualProgramMonth(data); else renderAnnualProgramYear(data);
    }

    async function initializeAnnualProgramPage() {
        if (annualProgramInitialized) {
            renderAnnualProgram();
            return;
        }
        annualProgramInitialized = true;
        await annualProgramLoadFromApi();
        const divisions = [...new Set(annualProgramLoadData().map(item => String(item.lead || '').split('/')[0].trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ne'));
        document.getElementById('annualProgramDivision').innerHTML = '<option value="">सबै महाशाखा</option>' + divisions.map(division => `<option value="${annualProgramEscape(division)}">${annualProgramEscape(division)}</option>`).join('');
        document.getElementById('annualProgramSearch').oninput = renderAnnualProgram;
        document.getElementById('annualProgramDivision').onchange = renderAnnualProgram;
        document.getElementById('annualMonthViewBtn').onclick = () => { annualProgramView = 'month'; document.getElementById('annualMonthViewBtn').setAttribute('aria-pressed', 'true'); document.getElementById('annualYearViewBtn').setAttribute('aria-pressed', 'false'); renderAnnualProgram(); };
        document.getElementById('annualYearViewBtn').onclick = () => { annualProgramView = 'year'; document.getElementById('annualYearViewBtn').setAttribute('aria-pressed', 'true'); document.getElementById('annualMonthViewBtn').setAttribute('aria-pressed', 'false'); renderAnnualProgram(); };
        document.getElementById('annualFiscalYear').onchange = annualProgramRefreshFromApi;
        renderAnnualProgram();
    }

    function initializePromotionalProgramsPage() {
        (function () {
          /* ===================== Nepali digit helper ===================== */
          const npDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
          function toNepDigits(num) {
            return String(num).split('').map(c => (c >= '0' && c <= '9') ? npDigits[+c] : c).join('');
          }

          /* ===================== Calendar ===================== */
          const nepMonths = ['बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत'];
          const daysInMonthDemo = [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30];
          
          // Get current Nepali date from NepaliCalendar API
          const currentDateStr = window.NepaliCalendar ? window.NepaliCalendar.getCurrentDate() : '2083-05-21';
          const currentDateParts = currentDateStr.split('-').map(Number);
          const todayYear = currentDateParts[0];
          const todayMonthIndex = currentDateParts[1] - 1; // Convert to 0-based index
          const todayDate = currentDateParts[2];
          
          let calYear = todayYear;
          let calMonthIndex = todayMonthIndex;
          const eventDays = {
            1: [{ day: 26, type: 'done' }, { day: 27, type: 'done' }, { day: 28, type: 'ongoing' }, { day: 29, type: 'done' }, { day: 30, type: 'upcoming' }, { day: 16, type: 'ongoing' }, { day: 23, type: 'upcoming' }]
          };
          const typeColor = { upcoming: '#2f6fdb', ongoing: '#e0a72c', done: '#27ae60', cancelled: '#e85148' };

          function renderCalendar() {
            document.getElementById('calTitle').textContent = nepMonths[calMonthIndex] + ' ' + toNepDigits(calYear);
            const calBody = document.getElementById('calBody');
            calBody.innerHTML = '';

            const totalDays = daysInMonthDemo[calMonthIndex];
            const startOffset = (calMonthIndex * 2) % 7;
            const prevMonthDays = daysInMonthDemo[(calMonthIndex + 11) % 12];

            let cells = [];
            for (let i = 0; i < startOffset; i++) {
              cells.push({ day: prevMonthDays - startOffset + i + 1, muted: true });
            }
            for (let d = 1; d <= totalDays; d++) {
              cells.push({ day: d, muted: false });
            }
            while (cells.length % 7 !== 0) {
              cells.push({ day: cells.length - startOffset - totalDays + 1, muted: true });
            }

            const evMap = {};
            (eventDays[calMonthIndex] || []).forEach(e => { evMap[e.day] = e.type; });

            let rowHtml = '';
            for (let i = 0; i < cells.length; i++) {
              if (i % 7 === 0) rowHtml += '<tr>';
              const c = cells[i];
              const isToday = !c.muted && c.day === todayDate && calMonthIndex === todayMonthIndex && calYear === todayYear;
              const ev = !c.muted ? evMap[c.day] : null;
              rowHtml += `<td>
        <div class="cal-day ${c.muted ? 'muted' : ''} ${isToday ? 'today' : ''}" title="${!c.muted && ev ? 'कार्यक्रम' : ''}">
          <span>${toNepDigits(c.day)}</span>
          ${ev ? `<span class="dot" style="background:${typeColor[ev]}"></span>` : (!c.muted ? '<span class="dot" style="background:transparent"></span>' : '')}
        </div>
      </td>`;
              if (i % 7 === 6) rowHtml += '</tr>';
            }
            calBody.innerHTML = rowHtml;
          }
          renderCalendar();

          document.getElementById('calPrev').addEventListener('click', function () {
            calMonthIndex--;
            if (calMonthIndex < 0) { calMonthIndex = 11; calYear--; }
            renderCalendar();
          });
          document.getElementById('calNext').addEventListener('click', function () {
            calMonthIndex++;
            if (calMonthIndex > 11) { calMonthIndex = 0; calYear++; }
            renderCalendar();
          });
          document.getElementById('calToday').addEventListener('click', function () {
            calYear = todayYear; calMonthIndex = todayMonthIndex;
            renderCalendar();
          });

          // Auto-update calendar date daily
          function updateCurrentDate() {
            if (window.NepaliCalendar) {
              const newDateStr = window.NepaliCalendar.getCurrentDate();
              const newDateParts = newDateStr.split('-').map(Number);
              const newYear = newDateParts[0];
              const newMonthIndex = newDateParts[1] - 1;
              const newDate = newDateParts[2];
              
              // Check if date has changed
              if (newYear !== todayYear || newMonthIndex !== todayMonthIndex || newDate !== todayDate) {
                // Update today's date variables
                todayYear = newYear;
                todayMonthIndex = newMonthIndex;
                todayDate = newDate;
                
                // Update calendar to show current month if user hasn't navigated away
                calYear = todayYear;
                calMonthIndex = todayMonthIndex;
                renderCalendar();
              }
            }
          }
          
          // Check for date changes every minute
          setInterval(updateCurrentDate, 60000);

          /* ===================== Program list table ===================== */
                    const programs = [];
          const statusLabel = { upcoming: { text: 'आगामी', cls: 'upcoming' }, ongoing: { text: 'चलिरहेको', cls: 'ongoing' }, done: { text: 'सम्पन्न', cls: 'done' } };

                    /* ===================== District program map ===================== */
                    let promotionalMapLayer = null;
                    let promotionalMapGeoData = null;
                    const promotionalMap = L.map('map1', { zoomControl: true, attributionControl: false, scrollWheelZoom: false });
                    promotionalMap.setView([28.3949, 84.1240], 5.8);

                    function normalizeDistrictName(value) {
                        return String(value || '').toLowerCase().replace(/[\s()\-_/.,]/g, '');
                    }

                    function getProgramDistrictName(place) {
                        return String(place || '').split(',')[0].trim();
                    }

                    function getGeoDistrictName(feature) {
                        const properties = feature.properties || {};
                        return properties.DISTRICT || properties.District || properties.district || properties.NAME_2 || properties.NAME || properties.name || '';
                    }

                    // English to Nepali district name mapping
                    const englishToNepaliDistrictMap = {
                        'JHAPA': 'झापा',
                        'ILAM': 'इलाम',
                        'PANCHTHAR': 'पाँचथर',
                        'TAPLEJUNG': 'ताप्लेजुङ',
                        'MORANG': 'मोरङ',
                        'SUNSARI': 'सुनसरी',
                        'BHOJPUR': 'भोजपुर',
                        'DHANKUTA': 'धनकुटा',
                        'TEHRATHUM': 'तेह्रथुम',
                        'SANKHUWASABHA': 'संखुवासभा',
                        'SAPTARI': 'सप्तरी',
                        'SIRAHA': 'सिराहा',
                        'UDAYAPUR': 'उदयपुर',
                        'KHOTANG': 'खोटाङ',
                        'OKHALDHUNGA': 'ओखलढुङ्गा',
                        'SOLUKHUMBU': 'सोलुखुम्बु',
                        'DHANUSA': 'धनुषा',
                        'MAHOTTARI': 'महोत्तरी',
                        'SARLAHI': 'सर्लाही',
                        'SINDHULI': 'सिन्धुली',
                        'RAMECHHAP': 'रामेछाप',
                        'DOLAKHA': 'दोलखा',
                        'BHAKTAPUR': 'भक्तपुर',
                        'DHADING': 'धादिङ',
                        'KATHMANDU': 'काठमाडौं',
                        'KAVREPALANCHOWK': 'काभ्रेपलाञ्चोक',
                        'LALITPUR': 'ललितपुर',
                        'NUWAKOT': 'नुवाकोट',
                        'RASUWA': 'रसुवा',
                        'SINDHUPALCHOK': 'सिन्धुपाल्चोक',
                        'BARA': 'बारा',
                        'PARSA': 'पर्सा',
                        'RAUTAHAT': 'रौतहट',
                        'CHITWAN': 'चितवन',
                        'MAKWANPUR': 'मकवानपुर',
                        'GORKHA': 'गोरखा',
                        'KASKI': 'कास्की',
                        'LAMJUNG': 'लमजुङ',
                        'SYANGJA': 'स्याङ्जा',
                        'TANAHU': 'तनहुँ',
                        'MANANG': 'मनाङ',
                        'KAPILVASTU': 'कपिलवस्तु',
                        'NAWALPUR': 'नवलपुर',
                        'PARASI': 'पर्सी',
                        'RUPANDEHI': 'रूपन्देही',
                        'ARGHAKHANCHI': 'अर्घाखाँची',
                        'GULMI': 'गुल्मी',
                        'PALPA': 'पाल्पा',
                        'BAGLUNG': 'बाग्लुङ',
                        'MYAGDI': 'म्याग्दी',
                        'PARBAT': 'पर्वत',
                        'MUSTANG': 'मुस्ताङ',
                        'DANG': 'दाङ',
                        'PYUTHAN': 'प्युठान',
                        'ROLPA': 'रोल्पा',
                        'EASTERN RUKUM': 'पूर्वी रुकुम',
                        'WESTERN RUKUM': 'पश्चिम रुकुम',
                        'SALYAN': 'सल्यान',
                        'DOLPA': 'डोल्पा',
                        'HUMLA': 'हुम्ला',
                        'JUMLA': 'जुम्ला',
                        'KALIKOT': 'कालिकोट',
                        'MUGU': 'मुगु',
                        'BANKE': 'बाँके',
                        'BARDIYA': 'बर्दिया',
                        'SURKHET': 'सुर्खेत',
                        'DAILEKH': 'दैलेख',
                        'JAJARKOT': 'जाजरकोट',
                        'KAILALI': 'कैलाली',
                        'ACHHAM': 'अछाम',
                        'DOTI': 'डोटी',
                        'BAJHANG': 'बाजुरा',
                        'BAJURA': 'बाजुरा',
                        'KANCHANPUR': 'कञ्चनपुर',
                        'DADELDHURA': 'डडेलधुरा',
                        'BAITADI': 'बैतडी',
                        'DARCHULA': 'दार्चुला'
                    };

                    // District name mapping for variations
                    const districtNameMap = {
                        'काठमाडौं': ['काठमाडौ', 'काठमाण्डौ'],
                        'ललितपुर': ['ललितपुर'],
                        'भक्तपुर': ['भक्तपुर'],
                        'नुवाकोट': ['नुवाकोट'],
                        'धादिङ': ['धादिङ'],
                        'कास्की': ['कास्की'],
                        'स्याङ्जा': ['स्याङ्जा'],
                        'तनहुँ': ['तनहुँ', 'तनहु'],
                        'लमजुङ': ['लमजुङ'],
                        'गोरखा': ['गोरखा'],
                        'मकवानपुर': ['मकवानपुर'],
                        'चितवन': ['चितवन'],
                        'नवलपरासी': ['नवलपरासी', 'नवलपरासी (बर्दघाट सुस्ता पूर्व)', 'नवलपरासी (बर्दघाट सुस्ता पश्चिम)'],
                        'रौतहट': ['रौतहट'],
                        'बारा': ['बारा'],
                        'पर्सा': ['पर्सा'],
                        'मोरङ': ['मोरङ'],
                        'धनकुटा': ['धनकुटा'],
                        'तेह्रथुम': ['तेह्रथुम'],
                        'संखुवासभा': ['संखुवासभा'],
                        'भोजपुर': ['भोजपुर'],
                        'इलाम': ['इलाम'],
                        'पाँचथर': ['पाँचथर'],
                        'झापा': ['झापा'],
                        'सुनसरी': ['सुनसरी'],
                        'उदयपुर': ['उदयपुर'],
                        'सप्तरी': ['सप्तरी'],
                        'पाल्पा': ['पाल्पा'],
                        'रूपन्देही': ['रूपन्देही'],
                        'कपिलवस्तु': ['कपिलवस्तु'],
                        'दाङ': ['दाङ'],
                        'प्युठान': ['प्युठान'],
                        'रोल्पा': ['रोल्पा'],
                        'गुल्मी': ['गुल्मी'],
                        'अर्घाखाँची': ['अर्घाखाँची'],
                        'धनगढी': ['धनगढी'],
                        'कैलाली': ['कैलाली'],
                        'कञ्चनपुर': ['कञ्चनपुर'],
                        'बैतडी': ['बैतडी'],
                        'डडेलधुरा': ['डडेलधुरा'],
                        'डोटी': ['डोटी'],
                        'अछाम': ['अछाम'],
                        'बाजुरा': ['बाजुरा'],
                        'दार्चुला': ['दार्चुला'],
                        'सुर्खेत': ['सुर्खेत'],
                        'दैलेख': ['दैलेख'],
                        'जाजरकोट': ['जाजरकोट'],
                        'कालिकोट': ['कालिकोट'],
                        'जुम्ला': ['जुम्ला'],
                        'मुगु': ['मुगु'],
                        'हुम्ला': ['हुम्ला'],
                        'डोल्पा': ['डोल्पा'],
                        'पोखरा': ['पोखरा'],
                        'मनाङ': ['मनाङ'],
                        'मुस्ताङ': ['मुस्ताङ'],
                        'पर्वत': ['पर्वत'],
                        'म्याग्दी': ['म्याग्दी'],
                        'बाग्लुङ': ['बाग्लुङ'],
                        'बाँके': ['बाँके'],
                        'बर्दिया': ['बर्दिया'],
                        'गौरीगञ्ज': ['गौरीगञ्ज'],
                        'नवलपुर': ['नवलपुर'],
                        'राप्ती': ['राप्ती'],
                        'रुकुम': ['रुकुम', 'पश्चिम रुकुम', 'पूर्वी रुकुम', 'रुकुम (पूर्व)'],
                        'सल्यान': ['सल्यान'],
                        'सिराहा': ['सिराहा'],
                        'धनुषा': ['धनुषा'],
                        'महोत्तरी': ['महोत्तरी'],
                        'सर्लाही': ['सर्लाही'],
                        'जनकपुर': ['जनकपुर'],
                        'सिन्धुली': ['सिन्धुली'],
                        'रामेछाप': ['रामेछाप'],
                        'दोलखा': ['दोलखा'],
                        'सिन्धुपाल्चोक': ['सिन्धुपाल्चोक'],
                        'काभ्रेपलाञ्चोक': ['काभ्रेपलाञ्चोक'],
                        'रसुवा': ['रसुवा'],
                        'ताप्लेजुङ': ['ताप्लेजुङ'],
                        'पाँचथर': ['पाँचथर'],
                        'ओखलढुङ्गा': ['ओखलढुङ्गा'],
                        'सोलुखुम्बु': ['सोलुखुम्बु'],
                        'खोटाङ': ['खोटाङ'],
                        'उदयपुर': ['उदयपुर'],
                        'सप्तरी': ['सप्तरी'],
                        'सुनसरी': ['सुनसरी'],
                        'भोजपुर': ['भोजपुर'],
                        'संखुवासभा': ['संखुवासभा'],
                        'तेह्रथुम': ['तेह्रथुम'],
                        'इलाम': ['इलाम'],
                        'झापा': ['झापा'],
                        'मोरङ': ['मोरङ']
                    };

                    function matchDistrictName(programDistrict, geoDistrict) {
                        // Convert English geoDistrict to Nepali for matching
                        const nepaliGeoDistrict = englishToNepaliDistrictMap[geoDistrict.toUpperCase()] || geoDistrict;
                        
                        const normalizedProgram = normalizeDistrictName(programDistrict);
                        const normalizedGeo = normalizeDistrictName(nepaliGeoDistrict);
                        
                        // Direct match
                        if (normalizedProgram === normalizedGeo) return true;
                        
                        // Very lenient partial match - if one is contained in the other
                        if (normalizedProgram.length > 3 && normalizedGeo.includes(normalizedProgram)) return true;
                        if (normalizedGeo.length > 3 && normalizedProgram.includes(normalizedGeo)) return true;
                        
                        // Check if geoDistrict is in the program's variation list
                        if (districtNameMap[programDistrict] && districtNameMap[programDistrict].includes(nepaliGeoDistrict)) return true;
                        
                        // Check if programDistrict is in the geoDistrict's variation list
                        if (districtNameMap[nepaliGeoDistrict] && districtNameMap[nepaliGeoDistrict].includes(programDistrict)) return true;
                        
                        return false;
                    }

                    function getProgramDistrictStatus(districtName) {
                        const districtPrograms = programs.filter(program => {
                            const programDistrict = getProgramDistrictName(program.place);
                            const isMatch = matchDistrictName(programDistrict, districtName);
                            return isMatch;
                        });
                        if (districtPrograms.some(program => program.status === 'done')) return 'done';
                        if (districtPrograms.length) return 'proposed';
                        return 'none';
                    }

                    function renderPromotionalMap(geoData) {
                        promotionalMapGeoData = geoData;
                        if (promotionalMapLayer) promotionalMap.removeLayer(promotionalMapLayer);
                        promotionalMapLayer = L.geoJSON(geoData, {
                            style: function (feature) {
                                const districtName = getGeoDistrictName(feature);
                                const status = getProgramDistrictStatus(districtName);
                                return {
                                    color: '#ffffff',
                                    weight: 1,
                                    fillColor: status === 'done' ? '#27ae60' : status === 'proposed' ? '#e67e22' : '#cbd0d6',
                                    fillOpacity: status === 'none' ? 0.45 : 0.82
                                };
                            },
                            onEachFeature: function (feature, layer) {
                                const districtName = getGeoDistrictName(feature);
                                const status = getProgramDistrictStatus(districtName);
                                const statusText = status === 'done' ? 'सम्पन्न कार्यक्रम' : status === 'proposed' ? 'प्रस्तावित कार्यक्रम' : 'कार्यक्रम नभएको';
                                layer.bindTooltip(`${districtName}<br>${statusText}`, { sticky: true });
                            }
                        }).addTo(promotionalMap);
                        promotionalMap.fitBounds(promotionalMapLayer.getBounds(), { padding: [10, 10], maxZoom: 7 });
                        promotionalMap.invalidateSize();
                    }

                    function updatePromotionalMap() {
                        if (promotionalMapGeoData) {
                            renderPromotionalMap(promotionalMapGeoData);
                        }
                    }

                    fetch('https://raw.githubusercontent.com/Acesmndr/nepal-geojson/master/generated-geojson/nepal-with-districts-acesmndr.geojson')
                        .then(response => response.json())
                        .then(renderPromotionalMap)
                        .catch(error => console.error('Error loading promotional programs map:', error));

          function renderProgramTable() {
            const programsToShow = programs.slice(0, 3);
            document.getElementById('progTableBody').innerHTML = programsToShow.map(p => {
              const st = statusLabel[p.status];
              return `<tr>
      <td>${p.name}</td>
      <td>${p.date}</td>
      <td>${p.place}</td>
      <td>${p.target}</td>
      <td>${p.participants}</td>
      <td><span class="status-pill ${st.cls}">${st.text}</span></td>
    </tr>`;
            }).join('');
          }
          renderProgramTable();

          /* ===================== Upcoming programs (right column) ===================== */
          const upcoming = []; // Will be populated from database
          document.getElementById('upcomingList').innerHTML = '<div style="text-align: center; color: #999; font-size: 12px; padding: 20px;">आगामी कार्यक्रमहरू यहाँ देखिनेछ</div>';

          /* ===================== Photo grid ===================== */
          const photoQueries = []; // Will be populated from database
          document.getElementById('photoGrid').innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #999; font-size: 12px; padding: 20px;">कार्यक्रमका तस्वीरहरू यहाँ देखिनेछ</div>';

          function renderDonut(canvasId, data, cutoutPct) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;
            if (typeof Chart !== 'undefined') {
              try {
                                const chartInstanceKey = `${canvasId}ChartInstance`;
                                if (window[chartInstanceKey]) {
                                    window[chartInstanceKey].destroy();
                                }

                                window[chartInstanceKey] = new Chart(canvas, {
                  type: 'doughnut',
                  data: {
                    labels: data.map(c => c.label),
                    datasets: [{ data: data.map(c => c.value), backgroundColor: data.map(c => c.color), borderWidth: 2, borderColor: '#fff' }]
                  },
                  options: { cutout: cutoutPct, plugins: { legend: { display: false } }, responsive: false }
                });
                return;
              } catch (e) {
                console.warn('Chart render failed, using fallback:', e);
              }
            }
            let acc = 0;
            const stops = data.map(c => {
              const start = acc;
              acc += c.value;
              return `${c.color} ${start}% ${acc}%`;
            }).join(', ');
            const fallback = document.createElement('div');
            fallback.style.width = canvas.width + 'px';
            fallback.style.height = canvas.height + 'px';
            fallback.style.borderRadius = '50%';
            fallback.style.background = `conic-gradient(${stops})`;
            fallback.style.position = 'relative';
            const hole = document.createElement('div');
            hole.style.position = 'absolute';
            hole.style.inset = '0';
            hole.style.margin = 'auto';
            hole.style.width = (canvas.width * (parseInt(cutoutPct) / 100)) + 'px';
            hole.style.height = (canvas.height * (parseInt(cutoutPct) / 100)) + 'px';
            hole.style.borderRadius = '50%';
            hole.style.background = '#fff';
            fallback.appendChild(hole);
            canvas.replaceWith(fallback);
          }

          /* ===================== Program Category Donut Chart ===================== */
          function updateCategoryDonut() {
            // Aggregate programs by name
            const programCounts = {};
            programs.forEach(prog => {
              if (prog.name) {
                programCounts[prog.name] = (programCounts[prog.name] || 0) + 1;
              }
            });

            // Convert to array and calculate percentages
            const totalPrograms = programs.length;
            const colors = ['#2f6fdb', '#e0a72c', '#27ae60', '#8b6fd8', '#e85148', '#f39c12', '#9b59b6', '#1abc9c'];
            const categoryData = Object.keys(programCounts).map((name, index) => ({
              label: name,
              value: totalPrograms > 0 ? Math.round((programCounts[name] / totalPrograms) * 100) : 0,
              count: programCounts[name],
              color: colors[index % colors.length]
            }));

            // Sort by count descending
            categoryData.sort((a, b) => b.count - a.count);

            // Render donut chart
            renderDonut('categoryDonut', categoryData, '54%');

            // Render legend with counts
            document.getElementById('categoryLegend').innerHTML = categoryData.map(c => `
    <div class="row"><span class="left"><span class="dot" style="background:${c.color}"></span>${c.label}</span><span class="val">${toNepDigits(c.count)}</span></div>
  `).join('');
          }

          // Initialize with empty data
          updateCategoryDonut();

          /* ===================== Quarterly Progress Bar Chart ===================== */
                    function openQuarterlyProgramDetails(quarter, type, programList) {
                        let modal = document.getElementById('quarterlyProgramDetailsModal');
                        if (!modal) {
                            modal = document.createElement('div');
                            modal.id = 'quarterlyProgramDetailsModal';
                            modal.className = 'modal-overlay hidden quarterly-program-details-overlay';
                            modal.innerHTML = `
                                <div class="modal-box">
                                    <div class="modal-header">
                                        <h3></h3>
                                        <button class="modal-close" type="button">✕</button>
                                    </div>
                                    <div class="modal-body view-all-modal-content"></div>
                                </div>`;
                            modal.querySelector('.modal-close').addEventListener('click', () => modal.classList.add('hidden'));
                            modal.addEventListener('click', event => {
                                if (event.target === modal) modal.classList.add('hidden');
                            });
                            const chartPanel = document.getElementById('quarterlyBarChart')?.closest('.panel');
                            if (chartPanel) {
                                chartPanel.classList.add('quarterly-chart-panel');
                                chartPanel.appendChild(modal);
                            } else {
                                document.getElementById('promotionalProgramsContent').appendChild(modal);
                            }
                        }

                        const typeLabel = type === 'target' ? 'लक्ष्य' : 'प्रगति';
                        modal.querySelector('.modal-header h3').textContent = `${quarter.quarter} - ${typeLabel}`;
                        modal.querySelector('.modal-body').innerHTML = `
                            <div style="margin-bottom:12px;font-weight:600;">कूल संख्या: ${toNepDigits(programList.length)}</div>
                            ${programList.length ? `<ol style="margin:0;padding-left:24px;">${programList.map(program => `<li style="margin-bottom:6px;">${program.name}</li>`).join('')}</ol>` : '<div style="color:#999;">कार्यक्रमहरू छैनन्</div>'}`;
                        modal.classList.remove('hidden');
                    }

          function renderQuarterlyBarChart() {
            const canvas = document.getElementById('quarterlyBarChart');
            if (!canvas) return;

            // Calculate quarterly data from actual programs
            const quarterlyCounts = {
                1: { name: 'पहिलो त्रैमासिक', target: 0, progress: 0, color: '#2f6fdb' },
                2: { name: 'दोस्रो त्रैमासिक', target: 0, progress: 0, color: '#e0a72c' },
                3: { name: 'तेस्रो त्रैमासिक', target: 0, progress: 0, color: '#27ae60' },
                4: { name: 'चौथो त्रैमासिक', target: 0, progress: 0, color: '#8b6fd8' }
            };
            const quarterlyPrograms = {
                1: { target: [], progress: [] },
                2: { target: [], progress: [] },
                3: { target: [], progress: [] },
                4: { target: [], progress: [] }
            };

            const getQuarterFromDate = date => {
                if (!date) return null;
                const dateParts = String(date)
                    .replace(/[०१२३४५६७८९]/g, digit => '०१२३४५६७८९'.indexOf(digit))
                    .split(/[/-]/);
                const month = parseInt(dateParts[1], 10);
                if (month >= 4 && month <= 6) return 1;
                if (month >= 7 && month <= 9) return 2;
                if (month >= 10 && month <= 12) return 3;
                if (month >= 1 && month <= 3) return 4;
                return null;
            };

            programs.forEach(prog => {
                const targetQuarter = {
                    पहिलो: 1,
                    दोस्रो: 2,
                    तेस्रो: 3,
                    चौथो: 4
                }[prog.quarter];
                if (targetQuarter && quarterlyCounts[targetQuarter]) {
                    quarterlyCounts[targetQuarter].target++;
                    quarterlyPrograms[targetQuarter].target.push(prog);
                }

                if (prog.status === 'done') {
                    const completedQuarter = getQuarterFromDate(prog.date);
                    if (completedQuarter && quarterlyCounts[completedQuarter]) {
                        quarterlyCounts[completedQuarter].progress++;
                        quarterlyPrograms[completedQuarter].progress.push(prog);
                    }
                }
            });

            const quarterlyData = Object.keys(quarterlyCounts).map(q => ({
                quarter: quarterlyCounts[q].name,
                progress: quarterlyCounts[q].progress,
                target: quarterlyCounts[q].target,
                targetPrograms: quarterlyPrograms[q].target,
                progressPrograms: quarterlyPrograms[q].progress,
                color: quarterlyCounts[q].color
            }));

            if (typeof Chart !== 'undefined') {
              try {
                if (window.quarterlyBarChartInstance) {
                    window.quarterlyBarChartInstance.destroy();
                }
                
                window.quarterlyBarChartInstance = new Chart(canvas, {
                  type: 'bar',
                  data: {
                    labels: quarterlyData.map(q => q.quarter),
                    datasets: [
                      { label: 'लक्ष्य', data: quarterlyData.map(q => q.target), backgroundColor: 'rgba(180, 180, 180, 0.8)', borderColor: 'rgba(100, 100, 100, 1)', borderWidth: 2, barPercentage: 0.6, categoryPercentage: 0.7 },
                      { label: 'प्रगति', data: quarterlyData.map(q => q.progress), backgroundColor: quarterlyData.map(q => q.color), borderColor: quarterlyData.map(q => q.color), borderWidth: 2, barPercentage: 0.6, categoryPercentage: 0.7 }
                    ]
                  },
                  options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                        labels: { font: { size: 11 }, boxWidth: 12 }
                                            }
                                        },
                                        onClick: (event, elements) => {
                                            if (!elements.length) return;
                                            const element = elements[0];
                                            const quarter = quarterlyData[element.index];
                                            const type = element.datasetIndex === 0 ? 'target' : 'progress';
                                            openQuarterlyProgramDetails(quarter, type, quarter[`${type}Programs`]);
                    },
                    scales: {
                      y: { beginAtZero: true, ticks: { font: { size: 10 } }, min: 0, max: Math.max(...quarterlyData.map(q => Math.max(q.target, q.progress)), 5) + 2 },
                      x: { ticks: { font: { size: 10 } } }
                    }
                  }
                });
                return;
              } catch (e) {
                console.warn('Bar chart render failed:', e);
              }
            }

            const fallback = document.createElement('div');
            fallback.style.width = '100%';
            fallback.style.height = '100%';
            fallback.style.padding = '8px';
            fallback.style.display = 'flex';
            fallback.style.flexDirection = 'column';
            fallback.style.gap = '8px';
            const maxVal = Math.max(...quarterlyData.map(q => Math.max(q.target, q.progress)), 10);
            fallback.innerHTML = quarterlyData.map(q => {
              const progressWidth = (q.progress / maxVal) * 100;
              const targetWidth = (q.target / maxVal) * 100;
              return `
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
              <div style="display: flex; align-items: center; gap: 8px; font-size: 10px; color: #333;">
                <span style="font-weight: 600; min-width: 80px;">${q.quarter}</span>
                <span style="color: #666;">${toNepDigits(q.progress)}/${toNepDigits(q.target)}</span>
              </div>
              <div style="position: relative; height: 24px; background: rgba(200,200,200,0.15); border-radius: 4px; overflow: hidden; padding: 2px;">
                <div style="position: absolute; left: 2px; top: 2px; height: 20px; width: ${targetWidth}%; background: rgba(180,180,180,0.7); border-radius: 3px; z-index: 1;"></div>
                <div style="position: absolute; left: 2px; top: 2px; height: 20px; width: ${progressWidth}%; background: ${q.color}; opacity: 0.75; border-radius: 3px; z-index: 2;"></div>
              </div>
            </div>
          `;
            }).join('') + `
          <div style="display: flex; gap: 15px; font-size: 10px; color: #666; margin-top: 4px;">
            <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 12px; height: 12px; background: rgba(180,180,180,0.7); border-radius: 2px;"></span>लक्ष्य</span>
            <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 12px; height: 12px; background: #2f6fdb; border-radius: 2px;"></span>प्रगति</span>
          </div>`;
            canvas.replaceWith(fallback);
          }
          renderQuarterlyBarChart();

          function showToast(msg, isError) {
            const toast = document.getElementById('npToast');
            toast.textContent = msg;
            toast.classList.toggle('error', !!isError);
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2600);
          }

          /* ===================== नयाँ कार्यक्रम Modal ===================== */
          const newProgramModal = document.getElementById('newProgramModal');

          function populateDropdowns() {
            const yearSelect = document.getElementById('npYear');
            const monthSelect = document.getElementById('npMonth');
            const daySelect = document.getElementById('npDay');
            const provinceSelect = document.getElementById('npProvince');
            const districtSelect = document.getElementById('npDistrict');
            const localLevelSelect = document.getElementById('npLocalLevel');

            for (let y = 2080; y <= 2090; y++) {
              const opt = document.createElement('option');
              opt.value = toNepDigits(y);
              opt.textContent = toNepDigits(y);
              yearSelect.appendChild(opt);
            }
            yearSelect.value = toNepDigits(2083);

            nepMonths.forEach((m, i) => {
              const opt = document.createElement('option');
              opt.value = toNepDigits(i + 1);
              opt.textContent = m;
              monthSelect.appendChild(opt);
            });

            for (let d = 1; d <= 32; d++) {
              const opt = document.createElement('option');
              opt.value = toNepDigits(d);
              opt.textContent = toNepDigits(d);
              daySelect.appendChild(opt);
            }

            // Populate provinces from nepalData
            if (window.nepalData && window.nepalData.PROVINCE) {
              Object.values(window.nepalData.PROVINCE).forEach(province => {
                const opt = document.createElement('option');
                opt.value = province;
                opt.textContent = province;
                provinceSelect.appendChild(opt);
              });
            }

            districtSelect.innerHTML = '<option value="">जिल्ला छान्नुहोस्</option>';
            localLevelSelect.innerHTML = '<option value="">स्थानीय तह छान्नुहोस्</option>';

            // Province change handler - populate districts
            provinceSelect.addEventListener('change', function () {
              const selectedProvince = this.value;
              districtSelect.innerHTML = '<option value="">जिल्ला छान्नुहोस्</option>';
              localLevelSelect.innerHTML = '<option value="">स्थानीय तह छान्नुहोस्</option>';

              if (window.nepalData && window.nepalData.DISTRICTS) {
                // Find province ID from name
                let provinceId = null;
                for (const [id, name] of Object.entries(window.nepalData.PROVINCE)) {
                  if (name === selectedProvince) {
                    provinceId = parseInt(id);
                    break;
                  }
                }

                if (provinceId && window.nepalData.DISTRICTS[provinceId]) {
                  window.nepalData.DISTRICTS[provinceId].forEach(district => {
                    const opt = document.createElement('option');
                    opt.value = district;
                    opt.textContent = district;
                    districtSelect.appendChild(opt);
                  });
                }
              }
            });

            // District change handler - populate local levels (municipalities)
            districtSelect.addEventListener('change', function () {
              const selectedDistrict = this.value;
              localLevelSelect.innerHTML = '<option value="">स्थानीय तह छान्नुहोस्</option>';

              if (window.nepalData && window.nepalData.MUNICIPALITIES) {
                // Find province ID first
                const selectedProvince = provinceSelect.value;
                let provinceId = null;
                for (const [id, name] of Object.entries(window.nepalData.PROVINCE)) {
                  if (name === selectedProvince) {
                    provinceId = parseInt(id);
                    break;
                  }
                }

                if (provinceId && window.nepalData.MUNICIPALITIES[provinceId] && window.nepalData.MUNICIPALITIES[provinceId][selectedDistrict]) {
                  window.nepalData.MUNICIPALITIES[provinceId][selectedDistrict].forEach(municipality => {
                    const opt = document.createElement('option');
                    opt.value = municipality;
                    opt.textContent = municipality;
                    localLevelSelect.appendChild(opt);
                  });
                }
              }
            });
          }
          populateDropdowns();

          function openNewProgramModal() {
            const fields = ['npName', 'npQuarter', 'npTarget', 'npParticipants'];
            fields.forEach(id => {
              const el = document.getElementById(id);
              if (el) el.value = '';
            });
            const statusEl = document.getElementById('npStatus');
            if (statusEl) statusEl.value = 'upcoming';
            const year = document.getElementById('npYear');
            if (year) year.value = toNepDigits(2083);
            const month = document.getElementById('npMonth');
            if (month) month.value = toNepDigits(1);
            const day = document.getElementById('npDay');
            if (day) day.value = toNepDigits(1);
            
            // Reset province/district/local level dropdowns
            const provinceSelect = document.getElementById('npProvince');
            const districtSelect = document.getElementById('npDistrict');
            const localLevelSelect = document.getElementById('npLocalLevel');
            if (provinceSelect) provinceSelect.value = '';
            if (districtSelect) districtSelect.innerHTML = '<option value="">जिल्ला छान्नुहोस्</option>';
            if (localLevelSelect) localLevelSelect.innerHTML = '<option value="">स्थानीय तह छान्नुहोस्</option>';
            
            // Change modal title to "नयाँ कार्यक्रम प्रविष्टि"
            const modalTitle = newProgramModal.querySelector('.modal-header h3');
            if (modalTitle) modalTitle.textContent = 'नयाँ कार्यक्रम प्रविष्टि';
            
            // Change save button text
            const saveBtn = document.getElementById('modalSaveBtn');
            if (saveBtn) saveBtn.textContent = 'कार्यक्रम सुरक्षित गर्नुहोस्';
            
            // Remove edit mode flag
            if (newProgramModal) newProgramModal.dataset.editMode = 'false';
            if (newProgramModal) newProgramModal.dataset.editIndex = '-1';
            
            if (newProgramModal) newProgramModal.classList.remove('hidden');
          }

          window.openEditProgramModal = function(index) {
            const program = programs[index];
            if (!program) return;

            // Populate fields with existing data
            document.getElementById('npName').value = program.name || '';
            document.getElementById('npQuarter').value = program.quarter || '';
            document.getElementById('npTarget').value = program.target || '';
            document.getElementById('npParticipants').value = program.participants || '';
            document.getElementById('npStatus').value = program.status || 'upcoming';

            // Parse and populate date fields
            if (program.date) {
              const dateParts = program.date.split('/');
              if (dateParts.length === 3) {
                document.getElementById('npYear').value = dateParts[0];
                document.getElementById('npMonth').value = dateParts[1];
                document.getElementById('npDay').value = dateParts[2];
              }
            }

            // Parse and populate location fields
            if (program.place) {
              const placeParts = program.place.split(', ');
              if (placeParts.length >= 2) {
                const district = placeParts[0];
                const province = placeParts[1];
                
                // Set province
                const provinceSelect = document.getElementById('npProvince');
                provinceSelect.value = province;
                
                // Trigger province change to populate districts
                provinceSelect.dispatchEvent(new Event('change'));
                
                // After districts are populated, set district
                setTimeout(() => {
                  const districtSelect = document.getElementById('npDistrict');
                  districtSelect.value = district;
                  districtSelect.dispatchEvent(new Event('change'));
                }, 100);
              }
            }

            // Change modal title to "कार्यक्रम सम्पादन गर्नुहोस्"
            const modalTitle = newProgramModal.querySelector('.modal-header h3');
            if (modalTitle) modalTitle.textContent = 'कार्यक्रम सम्पादन गर्नुहोस्';

            // Change save button text
            const saveBtn = document.getElementById('modalSaveBtn');
            if (saveBtn) saveBtn.textContent = 'कार्यक्रम अपडेट गर्नुहोस्';

            // Set edit mode flag
            if (newProgramModal) newProgramModal.dataset.editMode = 'true';
            if (newProgramModal) newProgramModal.dataset.editIndex = index;

            // Close program list modal
            closeModal('programListModal');

            // Open edit modal
            if (newProgramModal) newProgramModal.classList.remove('hidden');
          };

          function closeNewProgramModal() {
            if (newProgramModal) newProgramModal.classList.add('hidden');
          }

          document.getElementById('newProgramBtn').addEventListener('click', openNewProgramModal);
          document.getElementById('modalCloseBtn').addEventListener('click', closeNewProgramModal);
          document.getElementById('modalCancelBtn').addEventListener('click', closeNewProgramModal);
          newProgramModal.addEventListener('click', function (e) {
            if (e.target === newProgramModal) closeNewProgramModal();
          });

          document.getElementById('modalSaveBtn').addEventListener('click', async function () {
            const isEditMode = newProgramModal.dataset.editMode === 'true';
            const editIndex = parseInt(newProgramModal.dataset.editIndex || '-1');
            
            const name = document.getElementById('npName').value.trim();
            const quarter = document.getElementById('npQuarter').value;
            const year = document.getElementById('npYear').value;
            const month = document.getElementById('npMonth').value;
            const day = document.getElementById('npDay').value;
            const province = document.getElementById('npProvince').value;
            const district = document.getElementById('npDistrict').value;
            const localLevel = document.getElementById('npLocalLevel').value;
            const target = document.getElementById('npTarget').value.trim();
            const participants = document.getElementById('npParticipants').value.trim();
            const status = document.getElementById('npStatus').value;

            // Always required fields
            if (!name || !quarter || !target) {
              showToast('कृपया कार्यक्रमको नाम, प्रस्तावित त्रैमासिक, र लक्षित समूह भर्नुहोस्।', true);
              return;
            }

            // Conditionally required fields based on status
            if (status === 'ongoing' || status === 'done') {
              if (!year || !month || !day || !province || !district || !localLevel || !participants) {
                showToast('कृपया मिति, स्थान, र सहभागी संख्या भर्नुहोस्।', true);
                return;
              }
            }

            const nepaliDate = year + '/' + month + '/' + day;
            const place = district + ', ' + province;
            
            // Convert Nepali date to approximate English date for database
            const convertNepaliToEnglishDate = (nepaliDate) => {
                // Simple conversion - in production, use proper date conversion library
                const dateParts = nepaliDate.replace(/[०१२३४५६७८९]/g, d => '०१२३४५६७८९'.indexOf(d)).split('/');
                const nepaliYear = parseInt(dateParts[0], 10);
                const nepaliMonth = parseInt(dateParts[1], 10);
                const nepaliDay = parseInt(dateParts[2], 10);
                
                // Approximate conversion (Nepali year is about 56-57 years ahead of English)
                const englishYear = nepaliYear - 57;
                const englishMonth = nepaliMonth - 3; // Approximate month difference
                const englishDay = nepaliDay;
                
                return `${englishYear}-${String(englishMonth).padStart(2, '0')}-${String(englishDay).padStart(2, '0')}`;
            };

            const programData = {
                program_name: name,
                program_date: convertNepaliToEnglishDate(nepaliDate),
                nepali_date: nepaliDate,
                province: province,
                district: district,
                local_level: localLevel,
                target_group: target,
                expected_participants: parseInt(participants.replace(/[०१२३४५६७८९]/g, d => '०१२३४५६७८९'.indexOf(d))) || 0,
                actual_participants: null,
                status: status,
                program_category: 'general',
                description: null,
                proposed_quarter: quarter
            };

            try {
                let response, result;
                
                if (isEditMode && editIndex >= 0) {
                    // Update existing program
                    const programId = programs[editIndex].id;
                    response = await fetch(`/api/promotional-programs/${programId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(programData)
                    });
                    result = await response.json();
                    
                    if (result.success) {
                        // Update local data
                        programs[editIndex] = {
                            ...programs[editIndex],
                            name,
                            date: nepaliDate,
                            place,
                            target,
                            participants,
                            status,
                            quarter: quarter
                        };
                        
                        showToast('कार्यक्रम सफलतापूर्वक अपडेट भयो।');
                    }
                } else {
                    // Create new program
                    response = await fetch('/api/promotional-programs', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(programData)
                    });
                    result = await response.json();
                    
                    if (result.success) {
                        // Update local data with the saved program
                        programs.unshift({ 
                            id: result.data.id,
                            name, 
                            date: nepaliDate, 
                            place, 
                            target, 
                            participants, 
                            status,
                            quarter: quarter,
                            fiscal_year: result.data.fiscal_year
                        });
                        
                        showToast('नयाँ कार्यक्रम सफलतापूर्वक सेभ भयो।');
                    }
                }
                
                if (result.success) {
                    renderProgramTable();
                    
                    if (promotionalMapLayer) promotionalMapLayer.eachLayer(layer => layer.setStyle({
                        fillColor: getProgramDistrictStatus(getGeoDistrictName(layer.feature)) === 'done' ? '#27ae60' : getProgramDistrictStatus(getGeoDistrictName(layer.feature)) === 'proposed' ? '#e67e22' : '#cbd0d6',
                        fillOpacity: getProgramDistrictStatus(getGeoDistrictName(layer.feature)) === 'none' ? 0.45 : 0.82
                    }));

                    if (status === 'upcoming') {
                        upcoming.push({ 
                            title: name, 
                            loc: place, 
                            date: nepaliDate + ' गते', 
                            icon: 'fa-calendar-check', 
                            color: '#2f6fdb', 
                            days: Math.floor(Math.random() * 30) + 1, 
                            hours: Math.floor(Math.random() * 24), 
                            mins: Math.floor(Math.random() * 60) 
                        });
                        document.getElementById('upcomingList').innerHTML = upcoming.map(u => `
                            <div class="upcoming-card">
                            <div class="upcoming-icon" style="background:${u.color}"><i class="fa-solid ${u.icon}"></i></div>
                            <div class="upcoming-info">
                                <div class="u-title">${u.title}</div>
                                <div class="u-loc"><i class="fa-solid fa-location-dot"></i> ${u.loc}</div>
                                <div class="u-date">${u.date}</div>
                            </div>
                            <div class="countdown">
                                <div class="c-item"><div class="c-num">${toNepDigits(u.days)}</div><div class="c-label">दिन</div></div>
                                <div class="c-item"><div class="c-num">${toNepDigits(u.hours)}</div><div class="c-label">घण्टा</div></div>
                                <div class="c-item"><div class="c-num">${toNepDigits(u.mins)}</div><div class="c-label">मिनेट</div></div>
                            </div>
                            </div>
                        `).join('');
                    }

                    closeNewProgramModal();
                    showToast('नयाँ कार्यक्रम सफलतापूर्वक सेभ भयो।');
                    
                    // Reload programs from database to ensure consistency
                    loadPromotionalProgramsFromDatabase();
                    
                    // Update donut chart with new data
                    updateCategoryDonut();
                    
                    // Update quarterly progress chart with new data
                    updateQuarterlyProgress();
                    
                    // Update map to show new program location
                    updatePromotionalMap();
                } else {
                    showToast('कार्यक्रम सेभ गर्नमा समस्या भयो: ' + (result.error || 'अज्ञात त्रुटि'), true);
                }
            } catch (error) {
                console.error('Error saving program:', error);
                showToast('कार्यक्रम सेभ गर्नमा समस्या भयो: ' + error.message, true);
            }
          });

          const photoUploadBtn = document.getElementById('photoUploadBtn');
          const photoInput = document.getElementById('photoInput');
          if (photoUploadBtn && photoInput) {
            photoUploadBtn.addEventListener('click', function () {
              photoInput.click();
            });
            photoInput.addEventListener('change', async function (e) {
              const files = e.target.files;
              if (files.length === 0) return;
              
              // Get the most recent program or prompt user to select a program
              if (programs.length === 0) {
                showToast('कृपया पहिले कार्यक्रम सिर्जना गर्नुहोस्।', true);
                e.target.value = '';
                return;
              }
              
              // Use the most recent program (first in array)
              const currentProgram = programs[0];
              const photosToUpload = [];
              
              for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();
                
                await new Promise((resolve) => {
                  reader.onload = function (event) {
                    const photoData = event.target.result; // Base64 data
                    photosToUpload.push({
                      photo_data: photoData,
                      photo_name: file.name
                    });
                    
                    // Display immediately in UI
                    const photoDiv = document.createElement('div');
                    photoDiv.className = 'ph';
                    photoDiv.innerHTML = `<img src="${photoData}" alt="कार्यक्रम तस्बिर" loading="lazy">`;
                    document.getElementById('photoGrid').appendChild(photoDiv);
                    resolve();
                  };
                  reader.readAsDataURL(file);
                });
              }
              
              // Save photos to database
              try {
                const response = await fetch(`/api/promotional-programs/${currentProgram.id}/photos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ photos: photosToUpload })
                });

                const result = await response.json();
                
                if (result.success) {
                    showToast(`${toNepDigits(files.length)} तस्वीर सफलतापूर्वक सेभ भयो।`);
                } else {
                    showToast('तस्वीर सेभ गर्नमा समस्या भयो: ' + (result.error || 'अज्ञात त्रुटि'), true);
                }
              } catch (error) {
                console.error('Error uploading photos:', error);
                showToast('तस्वीर सेभ गर्नमा समस्या भयो: ' + error.message, true);
              }
              
              e.target.value = '';
            });
          }

          /* ===================== Global Modal Functions ===================== */
          window.openModal = function(modalId) {
            document.getElementById(modalId).classList.remove('hidden');
          };

          window.closeModal = function(modalId) {
            document.getElementById(modalId).classList.add('hidden');
          };

          /* ===================== View All Modal Functions ===================== */
          window.openProgramListModal = function() {
            const modalBody = document.getElementById('programListModalBody');
            modalBody.innerHTML = programs.map((p, index) => {
              const st = statusLabel[p.status];
              return `<tr>
      <td>${p.name}</td>
      <td>${p.date}</td>
      <td>${p.place}</td>
      <td>${p.target}</td>
      <td>${p.participants}</td>
      <td><span class="status-pill ${st.cls}" style="cursor: pointer;" onclick="openEditProgramModal(${index})">${st.text}</span></td>
    </tr>`;
            }).join('');
            window.openModal('programListModal');
          };

          window.openUpcomingModal = function() {
            const modalBody = document.getElementById('upcomingModalBody');
            modalBody.innerHTML = upcoming.map(u => `
    <div class="upcoming-card">
      <div class="upcoming-icon" style="background:${u.color}"><i class="fa-solid ${u.icon}"></i></div>
      <div class="upcoming-info">
        <div class="u-title">${u.title}</div>
        <div class="u-loc"><i class="fa-solid fa-location-dot"></i> ${u.loc}</div>
        <div class="u-date">${u.date}</div>
      </div>
      <div class="countdown">
        <div class="c-item"><div class="c-num">${toNepDigits(u.days)}</div><div class="c-label">दिन</div></div>
        <div class="c-item"><div class="c-num">${toNepDigits(u.hours)}</div><div class="c-label">घण्टा</div></div>
        <div class="c-item"><div class="c-num">${toNepDigits(u.mins)}</div><div class="c-label">मिनेट</div></div>
      </div>
    </div>
  `).join('');
            window.openModal('upcomingModal');
          };

          window.openPhotosModal = async function() {
            const modalBody = document.getElementById('photosModalBody');
            
            if (programs.length === 0) {
              modalBody.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #999; font-size: 12px; padding: 20px;">कार्यक्रमका तस्वीरहरू छैन</div>';
              window.openModal('photosModal');
              return;
            }
            
            try {
              const response = await fetch(`/api/promotional-programs/${programs[0].id}/photos`);
              const result = await response.json();
              
              if (result.success && result.data.length > 0) {
                modalBody.innerHTML = result.data.map(photo => `
                  <div class="ph"><img src="${photo.photo_data}" alt="कार्यक्रम तस्बिर" loading="lazy"></div>
                `).join('');
              } else {
                modalBody.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #999; font-size: 12px; padding: 20px;">कार्यक्रमका तस्वीरहरू छैन</div>';
              }
            } catch (error) {
              console.error('Error loading photos for modal:', error);
              modalBody.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #999; font-size: 12px; padding: 20px;">तस्वीर लोड गर्नमा समस्या भयो</div>';
            }
            
            window.openModal('photosModal');
          };

          document.querySelectorAll('#promotionalProgramsContent .link-more').forEach(a => {
            a.addEventListener('click', function (e) {
              e.preventDefault();
              const panel = this.closest('.panel');
              if (!panel) return;
              const panelTitle = panel.querySelector('h2')?.textContent || panel.querySelector('.panel-head h2')?.textContent;

              if (panelTitle === 'कार्यक्रम सूची') {
                window.openProgramListModal();
              } else if (panelTitle === 'आगामी कार्यक्रम') {
                window.openUpcomingModal();
              } else if (panelTitle === 'हालैका कार्यक्रमका तस्वीरहरू') {
                window.openPhotosModal();
              } else if (panelTitle === 'सम्पन्न कार्यक्रमको झलक' || panelTitle === 'कार्यक्रम प्रकार') {
                window.openModal('statsModal');
              }
            });
          });

          // Load promotional programs from database
          async function loadPromotionalProgramsFromDatabase() {
            try {
                const response = await fetch('/api/promotional-programs');
                const result = await response.json();
                
                if (result.success) {
                    // Convert database records to local format
                    programs.length = 0; // Clear existing programs
                    result.data.forEach(prog => {
                        programs.push({
                            id: prog.id,
                            name: prog.program_name,
                            date: prog.nepali_date,
                            place: prog.district + ', ' + prog.province,
                            target: prog.target_group,
                            participants: prog.expected_participants ? toNepDigits(prog.expected_participants) : '०',
                            status: prog.status,
                            quarter: {
                                1: 'पहिलो',
                                2: 'दोस्रो',
                                3: 'तेस्रो',
                                4: 'चौथो'
                            }[prog.quarter] || prog.proposed_quarter,
                            fiscal_year: prog.fiscal_year
                        });
                    });
                    
                    // Update upcoming programs
                    upcoming.length = 0;
                    const upcomingPrograms = programs.filter(p => p.status === 'upcoming');
                    if (upcomingPrograms.length > 0) {
                        upcomingPrograms.forEach(prog => {
                            upcoming.push({
                                title: prog.name,
                                loc: prog.place,
                                date: prog.date + ' गते',
                                icon: 'fa-calendar-check',
                                color: '#2f6fdb',
                                days: Math.floor(Math.random() * 30) + 1,
                                hours: Math.floor(Math.random() * 24),
                                mins: Math.floor(Math.random() * 60)
                            });
                        });
                        
                        const upcomingToShow = upcoming.slice(0, 2);
                        document.getElementById('upcomingList').innerHTML = upcomingToShow.map(u => `
                            <div class="upcoming-card">
                            <div class="upcoming-icon" style="background:${u.color}"><i class="fa-solid ${u.icon}"></i></div>
                            <div class="upcoming-info">
                                <div class="u-title">${u.title}</div>
                                <div class="u-loc"><i class="fa-solid fa-location-dot"></i> ${u.loc}</div>
                                <div class="u-date">${u.date}</div>
                            </div>
                            <div class="countdown">
                                <div class="c-item"><div class="c-num">${toNepDigits(u.days)}</div><div class="c-label">दिन</div></div>
                                <div class="c-item"><div class="c-num">${toNepDigits(u.hours)}</div><div class="c-label">घण्टा</div></div>
                                <div class="c-item"><div class="c-num">${toNepDigits(u.mins)}</div><div class="c-label">मिनेट</div></div>
                            </div>
                            </div>
                        `).join('');
                    } else {
                        document.getElementById('upcomingList').innerHTML = '<div style="text-align: center; color: #999; font-size: 12px; padding: 20px;">आगामी कार्यक्रमहरू छैन</div>';
                    }
                    
                    renderProgramTable();
                    updateCategoryDonut();
                    updateQuarterlyProgress();
                    updatePromotionalMap();
                    loadPhotosFromDatabase();
                }
            } catch (error) {
                console.error('Error loading programs from database:', error);
            }
          }

          // Load photos from database
          async function loadPhotosFromDatabase() {
            try {
                if (programs.length === 0) {
                    document.getElementById('photoGrid').innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #999; font-size: 12px; padding: 20px;">कार्यक्रमका तस्वीरहरू यहाँ देखिनेछ</div>';
                    return;
                }
                
                const response = await fetch(`/api/promotional-programs/${programs[0].id}/photos`);
                const result = await response.json();
                
                const photoGrid = document.getElementById('photoGrid');
                if (photoGrid) {
                    if (result.success && result.data.length > 0) {
                        photoGrid.innerHTML = '';
                        photoQueries.length = 0;
                        result.data.forEach(photo => {
                            photoQueries.push(photo.photo_data);
                        });
                        const photosToShow = photoQueries.slice(0, 3);
                        photosToShow.forEach(photo => {
                            const photoDiv = document.createElement('div');
                            photoDiv.className = 'ph';
                            photoDiv.innerHTML = `<img src="${photo}" alt="कार्यक्रम तस्बिर" loading="lazy">`;
                            photoGrid.appendChild(photoDiv);
                        });
                    } else {
                        photoGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #999; font-size: 12px; padding: 20px;">कार्यक्रमका तस्वीरहरू यहाँ देखिनेछ</div>';
                    }
                }
            } catch (error) {
                console.error('Error loading photos from database:', error);
                const photoGrid = document.getElementById('photoGrid');
                if (photoGrid) {
                    photoGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #999; font-size: 12px; padding: 20px;">तस्वीर लोड गर्नमा समस्या भयो</div>';
                }
            }
          }

          // Update quarterly progress
          function updateQuarterlyProgress() {
            renderQuarterlyBarChart();
          }

          // Load data when page initializes
          loadPromotionalProgramsFromDatabase();
        })();
      }

    // Chhanbin Anbeshan Handler
    const chhanbinToggle = document.getElementById('chhanbinToggle');

    if (chhanbinToggle && chhanbinContent) {
        chhanbinToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            hideAllPrimaryContent();

            // Show chhanbin content
            chhanbinContent.style.display = 'block';

            // Update sidebar active state
            sidebarMenuItems.forEach(item => item.classList.remove('active'));
            this.closest('li').classList.add('active');

            // Load statistics from API
            if (window.loadStatistics && window.loadStatistics.investigations) {
                window.loadStatistics.investigations();
            }

            // Initialize chhanbin functionality if not already done
            if (!window.chhanbinInitialized) {
                initializeChhanbinFunctionality();
                window.chhanbinInitialized = true;
            }
        });
    }

    // Password Change Toggle Handler
    const passwordChangeToggle = document.getElementById('passwordChangeToggle');
    const passwordChangeContent = document.getElementById('passwordChangeContent');

    // Password Change Functionality
    function initializePasswordChangeFunctionality() {
        const passwordChangeForm = document.getElementById('passwordChangeForm');
        const passwordCancelBtn = document.getElementById('passwordCancelBtn');
        const newPasswordInput = document.getElementById('newPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');

        // Password toggle visibility
        document.querySelectorAll('.password-toggle').forEach(button => {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const input = document.getElementById(targetId);
                const icon = this.querySelector('i');

                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });

        // Password strength checker
        if (newPasswordInput) {
            newPasswordInput.addEventListener('input', function() {
                const password = this.value;
                let strength = 0;

                // Check length
                if (password.length >= 8) strength++;
                // Check uppercase
                if (/[A-Z]/.test(password)) strength++;
                // Check lowercase
                if (/[a-z]/.test(password)) strength++;
                // Check numbers
                if (/[0-9]/.test(password)) strength++;
                // Check special characters
                if (/[!@#$%^&*]/.test(password)) strength++;

                // Update strength bar
                strengthFill.className = 'strength-fill';
                if (strength <= 1) {
                    strengthFill.classList.add('weak');
                    strengthText.textContent = 'कमजोर';
                } else if (strength <= 2) {
                    strengthFill.classList.add('fair');
                    strengthText.textContent = 'मध्यम';
                } else if (strength <= 3) {
                    strengthFill.classList.add('good');
                    strengthText.textContent = 'राम्रो';
                } else if (strength >= 4) {
                    strengthFill.classList.add('strong');
                    strengthText.textContent = 'बलियो';
                } else {
                    strengthText.textContent = 'पासवर्ड शक्ति';
                }

                // Update requirements list
                updatePasswordRequirements(password);
            });
        }

        function updatePasswordRequirements(password) {
            const reqLength = document.getElementById('req-length');
            const reqUppercase = document.getElementById('req-uppercase');
            const reqLowercase = document.getElementById('req-lowercase');
            const reqNumber = document.getElementById('req-number');
            const reqSpecial = document.getElementById('req-special');

            if (password.length >= 8) {
                reqLength.classList.add('valid');
            } else {
                reqLength.classList.remove('valid');
            }

            if (/[A-Z]/.test(password)) {
                reqUppercase.classList.add('valid');
            } else {
                reqUppercase.classList.remove('valid');
            }

            if (/[a-z]/.test(password)) {
                reqLowercase.classList.add('valid');
            } else {
                reqLowercase.classList.remove('valid');
            }

            if (/[0-9]/.test(password)) {
                reqNumber.classList.add('valid');
            } else {
                reqNumber.classList.remove('valid');
            }

            if (/[!@#$%^&*]/.test(password)) {
                reqSpecial.classList.add('valid');
            } else {
                reqSpecial.classList.remove('valid');
            }
        }

        // Password change form submission
        if (passwordChangeForm) {
            passwordChangeForm.addEventListener('submit', async function(e) {
                e.preventDefault();

                const currentPassword = document.getElementById('currentPassword').value;
                const newPassword = newPasswordInput.value;
                const confirmPassword = confirmPasswordInput.value;

                // Validate passwords
                if (!currentPassword) {
                    alert('कृपया हालको पासवर्ड भर्नुहोस्।');
                    return;
                }

                if (newPassword.length < 8) {
                    alert('नयाँ पासवर्ड कम्तिमा ८ अक्षर हुनुपर्छ।');
                    return;
                }

                if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
                    alert('नयाँ पासवर्डमा ठूलो अक्षर, सानो अक्षर र अंक समावेश हुनुपर्छ।');
                    return;
                }

                if (newPassword !== confirmPassword) {
                    alert('नयाँ पासवर्ड र पुष्टि पासवर्ड मिल्दैन।');
                    return;
                }

                if (currentPassword === newPassword) {
                    alert('नयाँ पासवर्ड हालको पासवर्ड भन्दा फरक हुनुपर्छ।');
                    return;
                }

                const username = sessionStorage.getItem('dashboardUsername') ||
                    localStorage.getItem('dashboardUsername') || 'admin';

                try {
                    await AuthAPI.changePassword(username, currentPassword, newPassword);
                } catch (error) {
                    alert(error.message || 'पासवर्ड परिवर्तन गर्न सकिएन।');
                    return;
                }

                alert('पासवर्ड सफलतापूर्वक परिवर्तन भयो!');

                // Clear form
                passwordChangeForm.reset();
                strengthFill.className = 'strength-fill';
                strengthText.textContent = 'पासवर्ड शक्ति';
                updatePasswordRequirements('');

                // Return to dashboard
                hideAllPrimaryContent();
                if (dashboardGrid) dashboardGrid.style.display = 'block';
                sidebarMenuItems.forEach(item => item.classList.remove('active'));
                if (dashboardToggle) dashboardToggle.closest('li').classList.add('active');
            });
        }

        // Cancel button
        if (passwordCancelBtn) {
            passwordCancelBtn.addEventListener('click', function() {
                passwordChangeForm.reset();
                strengthFill.className = 'strength-fill';
                strengthText.textContent = 'पासवर्ड शक्ति';
                updatePasswordRequirements('');

                // Return to dashboard
                hideAllPrimaryContent();
                if (dashboardGrid) dashboardGrid.style.display = 'block';
                sidebarMenuItems.forEach(item => item.classList.remove('active'));
                if (dashboardToggle) dashboardToggle.closest('li').classList.add('active');
            });
        }
    }

    if (passwordChangeToggle && passwordChangeContent) {
        passwordChangeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            hideAllPrimaryContent();

            // Show password change content
            passwordChangeContent.style.display = 'block';

            // Update sidebar active state
            sidebarMenuItems.forEach(item => item.classList.remove('active'));
            this.closest('li').classList.add('active');

            // Close any active submenu
            closeActiveSubmenu();

            // Initialize password change functionality if not already done
            if (!window.passwordChangeInitialized) {
                initializePasswordChangeFunctionality();
                window.passwordChangeInitialized = true;
            }
        });
    }

    // Audit Log Toggle Handler
    const auditLogToggle = document.getElementById('auditLogToggle');
    const auditLogContent = document.getElementById('auditLogContent');

    if (auditLogToggle && auditLogContent && isAdmin) {
        auditLogToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            hideAllPrimaryContent();

            // Show audit log content
            auditLogContent.style.display = 'block';

            // Update sidebar active state
            sidebarMenuItems.forEach(item => item.classList.remove('active'));
            this.closest('li').classList.add('active');

            // Close any active submenu
            closeActiveSubmenu();

            // Initialize audit log functionality if not already done
            if (!window.auditLogInitialized) {
                initializeAuditLogFunctionality();
                window.auditLogInitialized = true;
            }
        });
    }

    // User Management Toggle Handler
    const userManagementToggle = document.getElementById('userManagementToggle');
    const userManagementContent = document.getElementById('userManagementContent');

    if (userManagementToggle && userManagementContent) {
        userManagementToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            hideAllPrimaryContent();

            // Show user management content
            userManagementContent.style.display = 'block';

            // Update sidebar active state
            sidebarMenuItems.forEach(item => item.classList.remove('active'));
            this.closest('li').classList.add('active');

            // Close any active submenu
            closeActiveSubmenu();

            // Initialize user management functionality if not already done
            if (!window.userManagementInitialized) {
                initializeUserManagementFunctionality();
                window.userManagementInitialized = true;
            }
        });
    }

    // Initialize Filters (only if filter elements exist)
    if (document.getElementById('ministryFilter')) {
        initializeFilters();
    }

    // Initialize team blocks for project monitoring form
    function initializeTeamBlocks() {
        var teamContainer = document.getElementById('teamContainer');
        if (!teamContainer) return;

        // Section collapse/expand for project monitoring form
        document.querySelectorAll('.project-monitoring-form [data-toggle]').forEach(function(header){
            header.addEventListener('click', function(){
                header.closest('[data-section]').classList.toggle('collapsed');
            });
        });

        // Nepali digit helper
        var bsDigits = ['०','१','२','३','४','५','६','७','८','९'];
        function toDevanagari(num){
            return String(num).split('').map(function(ch){
                return /[0-9]/.test(ch) ? bsDigits[+ch] : ch;
            }).join('');
        }

        // BS date helper
        var bsMonths = ["बैशाख","जेठ","असार","साउन","भदौ","असोज","कार्तिक","मंसिर","पुष","माघ","फागुन","चैत"];
        
        // Get current Nepali date from NepaliCalendar API, fallback to 2083 भदौ ७
        var today = { year: 2083, month: 5, day: 7 };
        if (window.NepaliCalendar && typeof window.NepaliCalendar.getCurrentDate === 'function') {
            const currentDateStr = window.NepaliCalendar.getCurrentDate();
            if (currentDateStr) {
                const parts = currentDateStr.split('-');
                if (parts.length === 3) {
                    today.year = parseInt(parts[0], 10);
                    today.month = parseInt(parts[1], 10);
                    today.day = parseInt(parts[2], 10);
                }
            }
        }

        function buildDateGroup(container, defaults){
            defaults = defaults || {};
            var yearSel = document.createElement('select');
            var startYear = 2075, endYear = 2090;
            var yOpts = '';
            for(var y = endYear; y >= startYear; y--){
                yOpts += '<option value="'+y+'"'+(y===defaults.year?' selected':'')+'>'+toDevanagari(y)+'</option>';
            }
            yearSel.innerHTML = yOpts;

            var monthSel = document.createElement('select');
            monthSel.innerHTML = bsMonths.map(function(m,i){
                return '<option value="'+(i+1)+'"'+((i+1)===defaults.month?' selected':'')+'>'+m+'</option>';
            }).join('');

            var daySel = document.createElement('select');
            var dOpts = '';
            for(var d=1; d<=32; d++){
                dOpts += '<option value="'+d+'"'+(d===defaults.day?' selected':'')+'>'+toDevanagari(d)+'</option>';
            }
            daySel.innerHTML = dOpts;

            container.appendChild(yearSel);
            container.appendChild(monthSel);
            container.appendChild(daySel);
        }

        function buildProjectDateGroups() {
            document.querySelectorAll('.project-monitoring-form .date-group[data-date]').forEach(function(container){
                var yearSel = document.createElement('select');
                yearSel.innerHTML = '<option value="">वर्ष</option>';
                for (var year = 2080; year <= 2090; year++) {
                    yearSel.innerHTML += '<option value="' + year + '">' + toDevanagari(year) + '</option>';
                }

                var monthSel = document.createElement('select');
                monthSel.innerHTML = '<option value="">महिना</option>' + bsMonths.map(function(month, index){
                    return '<option value="' + (index + 1) + '">' + month + '</option>';
                }).join('');

                var daySel = document.createElement('select');
                daySel.innerHTML = '<option value="">गते</option>';
                for (var day = 1; day <= 32; day++) {
                    daySel.innerHTML += '<option value="' + day + '">' + toDevanagari(day) + '</option>';
                }

                container.innerHTML = '';
                container.appendChild(yearSel);
                container.appendChild(monthSel);
                container.appendChild(daySel);
            });
        }

        function addTeamBlock(index){
            var block = document.createElement('div');
            block.className = 'team-block';
            block.innerHTML =
                '<span class="team-index">सदस्य '+toDevanagari(index)+'</span>' +
                '<div class="field">' +
                    '<label>नाम, थर:</label>' +
                    '<div class="input-row">' +
                        '<div class="control"><input type="text" placeholder="नाम थर" data-team-name></div>' +
                        '<button type="button" class="icon-btn mic" data-mic-inline title="बोलेर लेख्नुहोस्">🎤</button>' +
                        '<button type="button" class="icon-btn trash" data-clear-inline title="मेट्नुहोस्">🗑</button>' +
                    '</div>' +
                '</div>' +
                '<div class="field">' +
                    '<label>पद:</label>' +
                    '<div class="input-row">' +
                        '<div class="control"><input type="text" placeholder="पद" data-team-role></div>' +
                        '<button type="button" class="icon-btn mic" data-mic-inline title="बोलेर लेख्नुहोस्">🎤</button>' +
                        '<button type="button" class="icon-btn trash" data-clear-inline title="मेट्नुहोस्">🗑</button>' +
                    '</div>' +
                '</div>' +
                '<div class="field">' +
                    '<label>मिति:</label>' +
                    '<div class="date-group" data-date-inline></div>' +
                '</div>';
            teamContainer.appendChild(block);

            buildDateGroup(block.querySelector('[data-date-inline]'), today);

            // Helper function for toast
            function showToast(msg){
                var toast = document.getElementById('toast');
                if(!toast) return;
                toast.textContent = msg;
                toast.classList.add('show');
                setTimeout(function(){ toast.classList.remove('show'); }, 2600);
            }

            // Speech recognition for inline mic buttons
            var SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
            block.querySelectorAll('[data-mic-inline]').forEach(function(btn){
                var row = btn.closest('.input-row');
                var input = row.querySelector('input[type="text"]');
                if(!SpeechRecognitionCtor){
                    btn.addEventListener('click', function(){ showToast('यो ब्राउजरमा आवाज पहिचान उपलब्ध छैन।'); });
                    return;
                }
                var recognizing = false;
                var recognition = new SpeechRecognitionCtor();
                recognition.lang = 'ne-NP';
                recognition.interimResults = false;
                recognition.addEventListener('result', function(e){
                    input.value = e.results[0][0].transcript;
                    input.dispatchEvent(new Event('input'));
                });
                recognition.addEventListener('end', function(){ recognizing = false; btn.classList.remove('recording'); });
                recognition.addEventListener('error', function(){ recognizing = false; btn.classList.remove('recording'); });
                btn.addEventListener('click', function(){
                    if(recognizing){ recognition.stop(); return; }
                    try{ recognition.start(); recognizing = true; btn.classList.add('recording'); }
                    catch(err){ showToast('माइक्रोफोन सुरु गर्न सकिएन।'); }
                });
            });

            // Clear buttons
            block.querySelectorAll('[data-clear-inline]').forEach(function(btn){
                btn.addEventListener('click', function(){
                    var input = btn.closest('.input-row').querySelector('input[type="text"]');
                    input.value = '';
                    input.focus();
                });
            });
        }

        // Add 3 initial team blocks
        buildProjectDateGroups();
        for(var i=1;i<=3;i++){ addTeamBlock(i); }
    }


    // Analysis Toggle Functionality
    const analysisToggle = document.getElementById('analysisToggle');

    if (analysisToggle && dashboardGrid && analysisPage) {
        analysisToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            hideAllPrimaryContent();

            // Show analysis
            analysisPage.style.display = 'block';

            // Update sidebar active state
            sidebarMenuItems.forEach(item => item.classList.remove('active'));
            this.parentElement.classList.add('active');

            // Close submenu
            closeActiveSubmenu();

            // Initialize charts after a short delay
            setTimeout(function() {
                initializeCharts();
            }, 100);

            // Initialize map after container is visible with longer delay
            setTimeout(function() {
                if (!window.nepalMapInstance) {
                    initializeAnalysisMap();
                } else {
                    // Invalidate size to ensure proper rendering
                    window.nepalMapInstance.invalidateSize();
                }
            }, 500);
        });
    }

    // Section Report Toggle Functionality
    const sectionReportToggle = document.getElementById('sectionReportToggle');

    if (sectionReportToggle && sectionReportContent) {
        sectionReportToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            hideAllPrimaryContent();

            // Show section report
            sectionReportContent.style.display = 'block';

            // Update sidebar active state
            sidebarMenuItems.forEach(item => item.classList.remove('active'));
            this.parentElement.classList.add('active');

            // Close submenu
            closeActiveSubmenu();
        });
    }

    // Calendar Toggle Functionality
    const calendarToggle = document.getElementById('calendarToggle');

    if (calendarToggle && calendarContent) {
        calendarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            hideAllPrimaryContent();

            // Show calendar
            calendarContent.style.display = 'block';

            // Update sidebar active state
            sidebarMenuItems.forEach(item => item.classList.remove('active'));
            this.parentElement.classList.add('active');

            // Close submenu
            closeActiveSubmenu();

            // Initialize calendar
            initializeCalendar();
        });
    }

    // Dashboard Toggle Functionality (for home menu)
    if (dashboardToggle && dashboardGrid && analysisPage) {
        dashboardToggle.addEventListener('click', function(e) {
            e.preventDefault();

            hideAllPrimaryContent();
            if (dashboardGrid) dashboardGrid.style.display = 'grid';

            // Update sidebar active state
            sidebarMenuItems.forEach(item => item.classList.remove('active'));
            this.parentElement.classList.add('active');

            // Load dashboard data
            loadDressTimeDashboardData();
            loadDashboardSurveyCardData();

            // Initialize dashboard map if not already done
            setTimeout(function() {
                if (!window.dashboardMapInstance) {
                    initializeDashboardMap();
                } else {
                    window.dashboardMapInstance.invalidateSize();
                }
                if (window.dashboardSurveyMapInstance) {
                    window.dashboardSurveyMapInstance.invalidateSize();
                }
                if (window.dressTimeDashboardMapInstance) {
                    window.dressTimeDashboardMapInstance.invalidateSize();
                }
            }, 100);
        });
    }

    // Load dress time dashboard data on initial page load
    setTimeout(function() {
        loadDressTimeDashboardData();
        loadDashboardSurveyCardData();
    }, 500);

    // Section Report CSV Export Function
    function exportToCSV(tableId, filename) {
        const table = document.getElementById(tableId);
        const rows = table.querySelectorAll('tr');
        let csvContent = '\uFEFF';
        rows.forEach(row => {
            const cols = row.querySelectorAll('th, td');
            const rowData = [];
            cols.forEach((col, idx) => {
                // skip the last "कार्य" action column
                if (idx === cols.length - 1) return;
                rowData.push('"' + col.innerText.replace(/"/g, '""') + '"');
            });
            csvContent += rowData.join(',') + '\n';
        });
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename + '.csv';
        link.click();
    }

    window.exportSelectedUjiriToPdf = async function exportSelectedUjiriToPdf() {
        const tableBody = document.getElementById('cmTableBody');
        const selectedRows = tableBody
            ? Array.from(tableBody.querySelectorAll('tr')).filter(row => row.querySelector('td:first-child input[type="checkbox"]')?.checked)
            : [];
        if (!selectedRows.length) {
            showToast('पहिले उजुरी चयन गर्नुहोस्', true);
            return;
        }
        if (typeof html2canvas !== 'function' || !window.jspdf?.jsPDF) {
            showToast('PDF सेवा उपलब्ध भएन', true);
            return;
        }

        const nepaliMonths = ['बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत'];
        const nepaliWeekdays = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];
        const toNepaliDigits = value => String(value).replace(/[0-9]/g, digit => '०१२३४५६७८९'[digit]);
        const bsDate = window.NepaliCalendar?.getCurrentDate?.() || '';
        const bsParts = bsDate.split('-').map(Number);
        const today = new Date();
        const dateText = bsParts.length === 3 && bsParts.every(Number.isFinite)
            ? `${toNepaliDigits(bsParts[0])} ${nepaliMonths[bsParts[1] - 1] || ''} ${toNepaliDigits(bsParts[2])}, ${nepaliWeekdays[today.getDay()]}`
            : toNepaliDigits(today.toLocaleDateString('en-CA'));

        let coaImage = '';
        try {
            const coaResponse = await fetch('coa_base64.txt');
            const coaBase64 = (await coaResponse.text()).trim().replace(/^data:image\/[^;]+;base64,/, '');
            coaImage = `data:image/png;base64,${coaBase64}`;
        } catch (error) {
            console.warn('Coat of arms could not be loaded:', error);
        }

        const escapePdfText = value => String(value || '-').replace(/[&<>"']/g, character => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[character]));
        const getCellText = (row, index) => escapePdfText(row.cells[index]?.innerText.trim() || '-');
        const reportRows = selectedRows.map((row, index) => `
            <tr>
                <td class="center">${toNepaliDigits(index + 1)}</td>
                <td class="center">${getCellText(row, 1)}</td>
                <td class="center">${getCellText(row, 2)}</td>
                <td>${getCellText(row, 3)}</td>
                <td>${getCellText(row, 4)}</td>
                <td class="wide">${getCellText(row, 6)}</td>
                <td class="wide">${getCellText(row, 7)}</td>
                <td class="wide">${getCellText(row, 9)}</td>
            </tr>`).join('');
        const report = document.createElement('div');
        report.dataset.pdfReport = 'true';
        report.style.cssText = 'position: absolute; left: -10000px; top: 0; z-index: 0; width: 1300px; background: #fff; color: #111; pointer-events: none;';
        report.innerHTML = `
            <style>
                .committee-pdf { width: 1300px; background: #fff; padding: 28px 34px 40px; font-family: 'Noto Sans Devanagari', sans-serif; }
                .committee-pdf .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111; padding-bottom: 8px; margin-bottom: 4px; }
                .committee-pdf .header-left { display: flex; align-items: center; gap: 12px; }
                .committee-pdf .coa { width: 62px; height: 62px; object-fit: contain; flex-shrink: 0; }
                .committee-pdf .header-titles p { margin: 0; line-height: 1.35; }
                .committee-pdf .header-titles .org { font-weight: 700; font-size: 17px; }
                .committee-pdf .header-titles .sub { font-weight: 600; font-size: 15px; }
                .committee-pdf .header-right { text-align: right; font-size: 13px; line-height: 1.5; white-space: nowrap; }
                .committee-pdf .doc-title { text-align: left; font-weight: 700; font-size: 15px; margin: 14px 0 10px; }
                .committee-pdf table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 12.5px; }
                .committee-pdf th, .committee-pdf td { border: 1px solid #333; padding: 6px 8px; vertical-align: top; text-align: left; white-space: normal; max-width: 0; overflow-wrap: anywhere; word-break: break-word; }
                .committee-pdf th { background: #f2f2f2; font-weight: 700; text-align: center; }
                .committee-pdf td.center { text-align: center; white-space: nowrap; }
                .committee-pdf td.wide { text-align: justify; line-height: 1.5; }
                .committee-pdf col.sn { width: 3%; } .committee-pdf col.darta { width: 7%; } .committee-pdf col.miti { width: 7%; }
                .committee-pdf col.ujurikarta { width: 10%; } .committee-pdf col.bipakshi { width: 11%; } .committee-pdf col.bibaran { width: 39%; }
                .committee-pdf col.nirnaya { width: 18%; } .committee-pdf col.kaifiyat { width: 5%; }
            </style>
            <div class="committee-pdf">
                <div class="header">
                    <div class="header-left">
                        ${coaImage ? `<img class="coa" src="${coaImage}" alt="नेपालको coat of arms">` : '<div class="coa"></div>'}
                        <div class="header-titles"><p class="org">राष्ट्रिय सतर्कता केन्द्र</p><p class="sub">उजुरी व्यवस्थापन समितिको बैठक</p></div>
                    </div>
                    <div class="header-right">बैठक संख्या : -<br>मिति : ${dateText}</div>
                </div>
                <div class="doc-title">उजुरी सूची</div>
                <table><colgroup><col class="sn"><col class="darta"><col class="miti"><col class="ujurikarta"><col class="bipakshi"><col class="bibaran"><col class="nirnaya"><col class="kaifiyat"></colgroup>
                    <thead><tr><th>क्र.सं.</th><th>दर्ता नं</th><th>मिति</th><th>उजुरकर्ता</th><th>विपक्षी</th><th>उजुरीको विवरण</th><th>समितिको निर्णय</th><th>कैफियत</th></tr></thead>
                    <tbody>${reportRows}</tbody>
                </table>
            </div>`;
        document.body.appendChild(report);
        try {
            await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            if (document.fonts?.ready) await document.fonts.ready;
            const canvas = await html2canvas(report, {
                scale: 1,
                useCORS: true,
                backgroundColor: '#ffffff',
                willReadFrequently: true,
                logging: false,
                onclone: clonedDocument => {
                    const clonedReport = clonedDocument.querySelector('[data-pdf-report]');
                    if (clonedReport) {
                        clonedReport.style.left = '0px';
                        clonedReport.style.top = '0px';
                        clonedReport.style.position = 'absolute';
                    }
                }
            });
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ unit: 'mm', format: 'a3', orientation: 'landscape' });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const reportRect = report.getBoundingClientRect();
            const canvasScale = canvas.width / reportRect.width;
            const pageHeightPixels = pageHeight * canvasScale / pageWidth * canvas.width;
            const rowBoundaries = Array.from(report.querySelectorAll('tbody tr')).map(row => {
                const rowRect = row.getBoundingClientRect();
                return {
                    top: Math.max(0, (rowRect.top - reportRect.top) * canvasScale),
                    bottom: Math.min(canvas.height, (rowRect.bottom - reportRect.top) * canvasScale)
                };
            });
            const segments = [];
            let segmentStart = 0;
            rowBoundaries.forEach(row => {
                if (row.bottom - segmentStart > pageHeightPixels && row.top > segmentStart) {
                    segments.push([segmentStart, row.top]);
                    segmentStart = row.top;
                }
            });
            segments.push([segmentStart, canvas.height]);
            segments.forEach(([start, end], index) => {
                if (index > 0) pdf.addPage();
                const sliceHeight = Math.max(1, Math.ceil(end - start));
                const slice = document.createElement('canvas');
                slice.width = canvas.width;
                slice.height = sliceHeight;
                slice.getContext('2d').drawImage(canvas, 0, start, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
                const sliceHeightMm = sliceHeight * pageWidth / canvas.width;
                pdf.addImage(slice.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, pageWidth, sliceHeightMm, undefined, 'FAST');
            });
            pdf.save(`ujuri_suchi_${bsDate || 'report'}.pdf`);
            selectedRows.forEach(row => {
                const checkbox = row.querySelector('td:first-child input[type="checkbox"]');
                if (checkbox) checkbox.checked = false;
            });
            const selectAll = document.getElementById('cmSelectAll');
            if (selectAll) selectAll.checked = false;
            const exportButton = document.getElementById('cmPdfExportBtn');
            if (exportButton) exportButton.innerHTML = '<i class="fas fa-file-pdf" style="color: red;"></i> PDF Export (0)';
        } finally {
            report.remove();
        }
    }

    // Initialize Charts (only if chart elements exist)
    if (document.getElementById('trendChart') || document.getElementById('barChart')) {
        initializeCharts();
    }

    // Initialize Ujiri Form
    if (document.getElementById('ujuriForm')) {
        initializeUjuriForm();
    }

    // Initialize Nepali Date Dropdowns
    
    // Unified Nepali Date Dropdown Setup
    // Also expose as global so global-scope functions can call it
    window.setupNepaliDateDropdowns = function(yId, mId, dId, emptyText, valFormat) {
        return setupNepaliDateDropdowns(yId, mId, dId, emptyText, valFormat);
    };

    function setupNepaliDateDropdowns(yId, mId, dId, emptyText = {y: 'साल', m: 'महिना', d: 'गते'}, valFormat = 'num') {
        const ys = document.getElementById(yId);
        const ms = document.getElementById(mId);
        const ds = document.getElementById(dId);

        let curY = 2083, curM = 5, curD = 6;
        if (window.NepaliCalendar && typeof window.NepaliCalendar.getCurrentDate === 'function') {
            const dsStr = window.NepaliCalendar.getCurrentDate();
            if (dsStr) {
                const p = dsStr.split('-');
                curY = parseInt(p[0], 10);
                curM = parseInt(p[1], 10);
                curD = parseInt(p[2], 10);
            }
        }

        const nDigits = ['०','१','२','३','४','५','६','७','८','९'];
        const nMonths = ['बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत'];
        function toNN(n) { return String(n).split('').map(d => nDigits[d] || d).join(''); }

        if (ys) {
            ys.innerHTML = '<option value="">' + emptyText.y + '</option>';
            for (let y = 2075; y <= 2090; y++) {
                const opt = document.createElement('option');
                opt.value = y;
                opt.textContent = toNN(y);
                if (y === curY) opt.selected = true;
                ys.appendChild(opt);
            }
        }

        if (ms) {
            ms.innerHTML = '<option value="">' + emptyText.m + '</option>';
            nMonths.forEach((m, i) => {
                const opt = document.createElement('option');
                opt.value = (valFormat === 'text') ? m : (i + 1);
                opt.textContent = m;
                if ((i + 1) === curM) opt.selected = true;
                ms.appendChild(opt);
            });
        }

        if (ds) {
            ds.innerHTML = '<option value="">' + emptyText.d + '</option>';
            for (let d = 1; d <= 32; d++) {
                const opt = document.createElement('option');
                opt.value = d;
                opt.textContent = toNN(d);
                if (d === curD) opt.selected = true;
                ds.appendChild(opt);
            }
        }
    }

    // Initialize Calendar
    function initializeCalendar() {
        const nepaliDigits = ['०','१','२','३','४','५','६','७','८','९'];
        const nepaliMonthNames = ['बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत'];

        // Days in each Nepali month by year
        const nepaliMonthDays = {
            2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
            2081: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
            2082: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            2083: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            2084: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
            2085: [31, 32, 31, 32, 30, 31, 30, 30, 29, 30, 30, 30],
            2086: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
            2087: [31, 31, 32, 31, 31, 31, 30, 30, 30, 30, 30, 30],
            2088: [30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30],
            2089: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
            2090: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
        };

        function toNepaliNum(n) {
            return String(n).split('').map(d => nepaliDigits[d] || d).join('');
        }

        function getDaysInMonth(year, month) {
            if (nepaliMonthDays[year]) return nepaliMonthDays[year][month - 1] || 30;
            return 30;
        }

        // Calculate first day-of-week for BS month's 1st day
        // Anchor: 2083 Bhadra (month 5), 1st = Monday (1, 0=आइत...6=शनि)
        // Verified: 2083 Bhadra 6 = Saturday(6), so Bhadra 1 = 6-5 = 1 (सोम)
        function getFirstWeekday(year, month) {
            const anchorYear = 2083, anchorMonth = 5, anchorWeekday = 1;
            let totalDiff = 0;
            if (year > anchorYear || (year === anchorYear && month > anchorMonth)) {
                for (let y = anchorYear; y <= year; y++) {
                    const startM = (y === anchorYear) ? anchorMonth : 1;
                    const endM = (y === year) ? month - 1 : 12;
                    for (let m = startM; m <= endM; m++) {
                        totalDiff += getDaysInMonth(y, m);
                    }
                }
            } else {
                for (let y = year; y <= anchorYear; y++) {
                    const startM = (y === year) ? month : 1;
                    const endM = (y === anchorYear) ? anchorMonth - 1 : 12;
                    for (let m = startM; m <= endM; m++) {
                        totalDiff -= getDaysInMonth(y, m);
                    }
                }
            }
            return ((anchorWeekday + totalDiff) % 7 + 7) % 7;
        }

        // Get current BS date from NepaliCalendar API, fallback to 2083-05-06 (Bhadra 6, Saturday)
        let todayY = 2083, todayM = 5, todayD = 6;
        if (window.NepaliCalendar && typeof window.NepaliCalendar.getCurrentDate === 'function') {
            const dsStr = window.NepaliCalendar.getCurrentDate();
            if (dsStr) {
                const p = dsStr.split('-');
                todayY = parseInt(p[0], 10);
                todayM = parseInt(p[1], 10);
                todayD = parseInt(p[2], 10);
            }
        }

        let viewYear = todayY;
        let viewMonth = todayM;

        let calendarEvents = [];
        const eventTypes = ['उजुरी व्यवस्थापन समिति बैठक', 'मासिक समीक्षा बैठक', 'अन्य बैठक/कार्यक्रम'];

        function getCalendarEvents() {
            return calendarEvents;
        }

        async function loadCalendarEvents() {
            try {
                const result = await CalendarAPI.getAll();
                calendarEvents = result.data || [];

                const storedEvents = JSON.parse(localStorage.getItem('riskMapCalendarEvents') || '[]');
                if (!calendarEvents.length && storedEvents.length) {
                    calendarEvents = [];
                    for (const event of storedEvents) {
                        const saved = await CalendarAPI.create({ date: event.date, time: event.time, title: event.title });
                        if (saved.data) calendarEvents.push(saved.data);
                    }
                }
                localStorage.removeItem('riskMapCalendarEvents');
                renderCalendarGrid();
                renderCalendarEvents();
            } catch (error) {
                console.error('Error loading calendar events:', error);
                showToast('क्यालेण्डर event लोड हुन सकेन।', true);
            }
        }

        function formatCalendarDate(date) {
            const [year, month, day] = date.split('-');
            return `${nepaliMonthNames[parseInt(month, 10) - 1]} ${toNepaliNum(parseInt(day, 10))}, ${toNepaliNum(parseInt(year, 10))}`;
        }

        function getCalendarEventColorClass(title) {
            if (title === eventTypes[0]) return 'event-light-red';
            if (title === eventTypes[1]) return 'event-light-green';
            return 'event-light-blue';
        }

        function closeCalendarEventModal() {
            const modal = document.querySelector('.calendar-event-modal');
            if (modal) modal.remove();
        }

        function showCalendarEventDetails(event) {
            closeCalendarEventModal();
            const modal = document.createElement('div');
            modal.className = 'calendar-event-modal';
            modal.innerHTML = `
                <div class="calendar-event-modal-card" role="dialog" aria-modal="true">
                    <div class="calendar-event-modal-header">
                        <h3>कार्यक्रमको विवरण</h3>
                        <button type="button" class="calendar-event-close" aria-label="बन्द गर्नुहोस्">&times;</button>
                    </div>
                    <div class="calendar-event-details">
                        <div><span>कार्यक्रम</span><strong>${event.title}</strong></div>
                        <div><span>मिति</span><strong>${formatCalendarDate(event.date)}</strong></div>
                        <div><span>समय</span><strong>${toNepaliNum(parseInt(event.time, 10))}:०० - ${toNepaliNum(parseInt(event.time, 10) + 1)}:००</strong></div>
                        <div class="calendar-event-detail-actions">
                            <button type="button" class="calendar-event-edit">सम्पादन</button>
                            <button type="button" class="calendar-event-delete">मेटाउनुहोस्</button>
                        </div>
                    </div>
                </div>`;
            document.body.appendChild(modal);
            modal.querySelector('.calendar-event-close').addEventListener('click', closeCalendarEventModal);
            modal.querySelector('.calendar-event-edit').addEventListener('click', () => showCalendarEventForm(event.date, event));
            modal.querySelector('.calendar-event-delete').addEventListener('click', async () => {
                try {
                    await CalendarAPI.delete(event.id);
                } catch (error) {
                    showToast('बैठक/कार्यक्रम मेटाउन सकिएन।', true);
                    return;
                }
                calendarEvents = getCalendarEvents().filter(item => String(item.id) !== String(event.id));
                closeCalendarEventModal();
                renderCalendarGrid();
                renderCalendarEvents();
                showToast('बैठक/कार्यक्रम मेटाइयो।', false);
            });
            modal.addEventListener('click', e => {
                if (e.target === modal) closeCalendarEventModal();
            });
        }

        function renderCalendarEvents() {
            const eventsList = document.getElementById('calendarEventsList');
            if (!eventsList) return;
            const events = getCalendarEvents().sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
            eventsList.innerHTML = events.length ? events.map(event => `
                <div class="event-row" data-event-id="${event.id}">
                    <div>
                        <div class="event-name">${event.title}</div>
                        <div class="calendar-event-summary">${formatCalendarDate(event.date)} | ${toNepaliNum(parseInt(event.time, 10))}:०० - ${toNepaliNum(parseInt(event.time, 10) + 1)}:००</div>
                    </div>
                    <button type="button" class="modern-page-btn calendar-event-detail-btn">विवरण</button>
                </div>`).join('') : '<div class="calendar-event-empty">हाल कुनै बैठक वा कार्यक्रम थपिएको छैन।</div>';

            eventsList.querySelectorAll('.calendar-event-detail-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const event = getCalendarEvents().find(item => String(item.id) === button.closest('.event-row').dataset.eventId);
                    if (event) showCalendarEventDetails(event);
                });
            });
        }

        function showCalendarEventForm(date, eventToEdit) {
            closeCalendarEventModal();
            const modal = document.createElement('div');
            modal.className = 'calendar-event-modal';
            const timeOptions = Array.from({ length: 8 }, (_, index) => {
                const hour = index + 9;
                return `<option value="${String(hour).padStart(2, '0')}:00">${toNepaliNum(hour)}:०० - ${toNepaliNum(hour + 1)}:००</option>`;
            }).join('');
            modal.innerHTML = `
                <div class="calendar-event-modal-card" role="dialog" aria-modal="true">
                    <div class="calendar-event-modal-header">
                        <h3>बैठक/कार्यक्रम थप्नुहोस्</h3>
                        <button type="button" class="calendar-event-close" aria-label="बन्द गर्नुहोस्">&times;</button>
                    </div>
                    <form class="calendar-event-form">
                        <label>मिति<input type="text" value="${formatCalendarDate(date)}" readonly></label>
                        <label>कार्यक्रमको प्रकार<select name="title" required><option value="">छान्नुहोस्</option>${eventTypes.map(type => `<option value="${type}"${eventToEdit?.title === type ? ' selected' : ''}>${type}</option>`).join('')}</select></label>
                        <label>समय<select name="time" required>${timeOptions.replace(`value="${eventToEdit?.time || ''}"`, `value="${eventToEdit?.time || ''}" selected`)}</select></label>
                        <div class="calendar-event-form-actions"><button type="button" class="calendar-event-cancel">रद्द गर्नुहोस्</button><button type="submit" class="modern-page-btn">सेभ गर्नुहोस्</button></div>
                    </form>
                </div>`;
            document.body.appendChild(modal);
            modal.querySelector('.calendar-event-close').addEventListener('click', closeCalendarEventModal);
            modal.querySelector('.calendar-event-cancel').addEventListener('click', closeCalendarEventModal);
            modal.addEventListener('click', e => {
                if (e.target === modal) closeCalendarEventModal();
            });
            modal.querySelector('form').addEventListener('submit', async e => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const eventData = { date, title: formData.get('title'), time: formData.get('time') };
                let result;
                try {
                    result = eventToEdit
                        ? await CalendarAPI.update(eventToEdit.id, eventData)
                        : await CalendarAPI.create(eventData);
                } catch (error) {
                    showToast('बैठक/कार्यक्रम सेभ हुन सकेन।', true);
                    return;
                }
                if (eventToEdit) {
                    calendarEvents = getCalendarEvents().map(event => String(event.id) === String(eventToEdit.id) ? result.data : event);
                } else if (result.data) {
                    calendarEvents = [...getCalendarEvents(), result.data];
                }
                renderCalendarGrid();
                renderCalendarEvents();
                closeCalendarEventModal();
                showToast(eventToEdit ? 'बैठक/कार्यक्रम संशोधन भयो।' : 'बैठक/कार्यक्रम सेभ भयो।', false);
            });
        }

        function renderCalendarGrid() {
            const grid = document.getElementById('daysGrid');
            const label = document.getElementById('calMonthYearLabel');
            if (!grid) return;

            const totalDays = getDaysInMonth(viewYear, viewMonth);
            const startWeekday = getFirstWeekday(viewYear, viewMonth);
            const isCurrentMonth = (viewYear === todayY && viewMonth === todayM);

            if (label) {
                label.textContent = nepaliMonthNames[viewMonth - 1] + ' ' + toNepaliNum(viewYear);
            }

            grid.innerHTML = '';

            for (let i = 0; i < startWeekday; i++) {
                const empty = document.createElement('div');
                empty.className = 'day-cell empty';
                grid.appendChild(empty);
            }

            for (let d = 1; d <= totalDays; d++) {
                const cell = document.createElement('div');
                cell.className = 'day-cell';
                const date = `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const dayEvents = getCalendarEvents().filter(event => event.date === date);
                if (isCurrentMonth && d === todayD) cell.classList.add('today');
                if (dayEvents.length) cell.classList.add(getCalendarEventColorClass(dayEvents[0].title));
                cell.textContent = toNepaliNum(d);
                cell.addEventListener('click', () => {
                    document.querySelectorAll('.day-cell').forEach(c => c.classList.remove('today'));
                    cell.classList.add('today');
                    const currentEvents = getCalendarEvents().filter(event => event.date === date);
                    if (currentEvents.length) showCalendarEventDetails(currentEvents[0]);
                    else showCalendarEventForm(date);
                });
                grid.appendChild(cell);
            }
        }

        renderCalendarGrid();
        renderCalendarEvents();
        loadCalendarEvents();

        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn) {
            const newPrev = prevBtn.cloneNode(true);
            prevBtn.parentNode.replaceChild(newPrev, prevBtn);
            newPrev.addEventListener('click', () => {
                viewMonth--;
                if (viewMonth < 1) { viewMonth = 12; viewYear--; }
                renderCalendarGrid();
            });
        }

        if (nextBtn) {
            const newNext = nextBtn.cloneNode(true);
            nextBtn.parentNode.replaceChild(newNext, nextBtn);
            newNext.addEventListener('click', () => {
                viewMonth++;
                if (viewMonth > 12) { viewMonth = 1; viewYear++; }
                renderCalendarGrid();
            });
        }
    }

        function initializeNepaliDateDropdowns() {
        setupNepaliDateDropdowns('nepaliYear', 'nepaliMonth', 'nepaliDay');
    }

    // Dress-time date dropdowns (global so the click handler can call it)
    window.initializeNepaliDateDropdownsForDressTime = function() {
        setupNepaliDateDropdowns('dtNepaliYear', 'dtNepaliMonth', 'dtNepaliDay');
    };

    // Dress time staff table functionality (global so the click handler can call it)
    window.initializeDressTimeStaffTable = function() {
        const addRowBtn = document.getElementById('dtAddRowBtn');
        const tableBody = document.getElementById('dtStaffTableBody');
        
        if (!addRowBtn || !tableBody) return;
        if (addRowBtn.dataset.listenerAttached === 'true') return;
        addRowBtn.dataset.listenerAttached = 'true';
        
        // Add row button click handler
        addRowBtn.addEventListener('click', function() {
            addDressTimeStaffRow();
        });
        
        // Table body click handler for delete buttons
        tableBody.addEventListener('click', function(e) {
            const deleteBtn = e.target.closest('.dt-delete-btn');
            if (!deleteBtn) return;
            
            const row = deleteBtn.closest('tr');
            if (row) {
                if (confirm('के तपाईं यो कर्मचारी विवरण मेटाउन चाहनुहुन्छ?')) {
                    row.remove();
                }
            }
        });
    };
    
    window.addDressTimeStaffRow = function() {
        const tableBody = document.getElementById('dtStaffTableBody');
        if (!tableBody) return;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <select class="dt-input-select">
                    <option value="">छान्नुहोस्</option>
                    <option value="अनुपस्थिति">अनुपस्थिति</option>
                    <option value="पोशाक पालना नगरेका">पोशाक पालना नगरेका</option>
                </select>
            </td>
            <td><input type="text" class="dt-input-field" placeholder="पद"></td>
            <td><input type="text" class="dt-input-field" placeholder="संकेत नं."></td>
            <td><input type="text" class="dt-input-field" placeholder="कर्मचारीको नाम"></td>
            <td><input type="text" class="dt-input-field" placeholder="कैफियत/थप मिति"></td>
            <td>
                <button class="dt-delete-btn" title="हटाउनुहोस्">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    };

    // Dress Time Form Submission
    window.initializeDressTimeFormSubmission = function() {
        const submitBtn = document.getElementById('dtSubmitBtn');
        if (!submitBtn) return;
        if (submitBtn.dataset.listenerAttached === 'true') return;
        submitBtn.dataset.listenerAttached = 'true';

        submitBtn.addEventListener('click', async function() {
            if (submitBtn.dataset.submitting === 'true') return;
            submitBtn.dataset.submitting = 'true';
            try {
                // Collect staff details from table
                const staffDetails = [];
                const staffTableBody = document.getElementById('dtStaffTableBody');
                if (staffTableBody) {
                    const rows = staffTableBody.querySelectorAll('tr');
                    rows.forEach(row => {
                        const cells = row.querySelectorAll('td');
                        if (cells.length >= 5) {
                            const category = cells[0].querySelector('select')?.value || '';
                            const position = cells[1].querySelector('input')?.value || '';
                            const symbolNo = cells[2].querySelector('input')?.value || '';
                            const employeeName = cells[3].querySelector('input')?.value || '';
                            const remarks = cells[4].querySelector('input')?.value || '';
                            
                            if (employeeName) {
                                staffDetails.push({
                                    category, position, symbol_no: symbolNo, employee_name: employeeName, remarks
                                });
                            }
                        }
                    });
                }

                // Count violations
                let timeViolationCount = 0;
                let dressViolationCount = 0;
                staffDetails.forEach(staff => {
                    if (staff.category === 'अनुपस्थिति') timeViolationCount++;
                    if (staff.category === 'पोशाक पालना नगरेका') dressViolationCount++;
                });

                // Convert Nepali date to English
                const convertNepaliToEnglish = (nepaliDate) => {
                    const year = document.getElementById('dtNepaliYear')?.value || '';
                    const month = document.getElementById('dtNepaliMonth')?.value || '';
                    const day = document.getElementById('dtNepaliDay')?.value || '';
                    if (year && month && day) {
                        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                    }
                    return '';
                };

                const formData = {
                    province: document.getElementById('dtProvince')?.value || '',
                    district: document.getElementById('dtDistrict')?.value || '',
                    local_level: document.getElementById('dtLocalLevel')?.value || '',
                    office_name: document.getElementById('dtOffice')?.value || '',
                    office_phone: document.getElementById('dtPhone')?.value || '',
                    monitoring_date: convertNepaliToEnglish(),
                    monitoring_time: document.getElementById('dtTime')?.value || '',
                    total_staff: parseInt(document.getElementById('dtTotalStaff')?.value) || 0,
                    active_staff: parseInt(document.getElementById('dtActiveStaff')?.value) || 0,
                    vacant_staff: parseInt(document.getElementById('dtVacantStaff')?.value) || 0,
                    staff_details: JSON.stringify(staffDetails),
                    team_leader_name: document.getElementById('dtTeamLeader')?.value || '',
                    team_leader_post: document.getElementById('dtTeamLeaderPost')?.value || '',
                    official_name: document.getElementById('dtOfficialName')?.value || '',
                    official_post: document.getElementById('dtOfficialPost')?.value || '',
                    time_violation_count: timeViolationCount,
                    dress_violation_count: dressViolationCount,
                    total_violations: timeViolationCount + dressViolationCount,
                    action_recommended: timeViolationCount + dressViolationCount > 0 ? 1 : 0,
                    remarks: ''
                };

                const result = await DressTimeAPI.create(formData);
                
                if (result.success) {
                    alert('अनुगमन फारम सफलतापूर्वक सुरक्षित भयो!');
                    // Reset form
                    document.querySelectorAll('#dressTimeFormContainer input, #dressTimeFormContainer select').forEach(element => {
                        if (element.type === 'radio' || element.type === 'checkbox') element.checked = false;
                        else element.value = '';
                    });
                    // Clear staff table
                    if (staffTableBody) staffTableBody.innerHTML = '';
                } else {
                    alert('सुरक्षित गर्नमा समस्या भयो: ' + (result.error || 'अज्ञात त्रुटि'));
                }
            } catch (error) {
                alert('सुरक्षित गर्नमा समस्या भयो: ' + error.message);
            } finally {
                submitBtn.dataset.submitting = 'false';
            }
        });
    };

    function renderDressTimeDetailTable(records) {
        const tableBody = document.getElementById('dtdDataTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = records.length
            ? records.map(row => `<tr data-id="${row.id}">
                <td>${row.date}</td><td>${row.province}</td><td>${row.district}</td>
                <td>${row.localLevel}</td><td>${row.office}</td><td>${row.totalViolations}</td>
                <td>${row.timeViolations}</td><td>${row.dressViolations}</td><td>${row.monitor}</td>
                <td><div class="dtd-row-actions">
                    <button type="button" class="dtd-act-btn view" title="हेर्नुहोस्" aria-label="हेर्नुहोस्"><i class="fa-solid fa-eye"></i></button>
                    <button type="button" class="dtd-act-btn edit" title="सम्पादन गर्नुहोस्" aria-label="सम्पादन गर्नुहोस्"><i class="fa-solid fa-pen"></i></button>
                </div></td>
            </tr>`).join('')
            : '<tr class="dtd-empty-row"><td colspan="10">कुनै डाटा फेला परेन</td></tr>';
    }

    const escapeDressTimeModalHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[character]));

    function getDressTimeStaffDetails(record) {
        try {
            const details = typeof record.staff_details === 'string'
                ? JSON.parse(record.staff_details || '[]')
                : record.staff_details;
            return Array.isArray(details) ? details : [];
        } catch (error) {
            return [];
        }
    }

    function closeDressTimeModal() {
        document.querySelector('.dtd-detail-modal')?.remove();
    }

    function showDressTimeDetail(record) {
        openDressTimeDetailModal(record, false);
    }

    function editDressTimeDetail(record) {
        openDressTimeDetailModal(record, true);
    }

    function openDressTimeDetailModal(record, editMode) {
        closeDressTimeModal();
        const staffDetails = getDressTimeStaffDetails(record);
        const modal = document.createElement('div');
        modal.className = 'dtd-detail-modal';
        modal.innerHTML = `
            <div class="dtd-detail-modal-box" role="dialog" aria-modal="true">
                <div class="dtd-detail-modal-header">
                    <h3>${editMode ? 'अनुगमन विवरण सम्पादन' : 'अनुगमन विवरण'}</h3>
                    <button type="button" class="dtd-detail-modal-close" aria-label="बन्द गर्नुहोस्">&times;</button>
                </div>
                <form class="dtd-detail-modal-form">
                    <div class="dtd-detail-form-grid">
                        ${[
                            ['date', 'मिति', record.date],
                            ['province', 'प्रदेश', record.province],
                            ['district', 'जिल्ला', record.district],
                            ['localLevel', 'स्थानीय तह', record.localLevel],
                            ['office', 'कार्यालयको नाम', record.office],
                            ['office_phone', 'कार्यालय फोन', record.office_phone],
                            ['monitoring_time', 'अनुगमन समय', record.monitoring_time],
                            ['monitor', 'अनुगमनकर्ता', record.monitor],
                            ['team_leader_post', 'अनुगमनकर्ता पद', record.team_leader_post],
                            ['total_staff', 'कुल कर्मचारी', record.total_staff],
                            ['active_staff', 'कार्यरत कर्मचारी', record.active_staff],
                            ['vacant_staff', 'रिक्त कर्मचारी', record.vacant_staff],
                            ['official_name', 'जिम्मेवार अधिकारी', record.official_name],
                            ['official_post', 'अधिकारी पद', record.official_post]
                        ].map(([name, label, value]) => `<label>${label}<input name="${name}" value="${escapeDressTimeModalHtml(value)}" ${editMode ? '' : 'readonly'}></label>`).join('')}
                    </div>
                    <div class="dtd-detail-staff-section">
                        <div class="dtd-detail-staff-heading"><strong>कर्मचारी विवरण</strong>${editMode ? '<button type="button" class="dtd-detail-add-staff">+ कर्मचारी थप्नुहोस्</button>' : ''}</div>
                        <div class="dtd-detail-staff-list">
                            ${staffDetails.map(staff => renderDressTimeStaffModalRow(staff, editMode)).join('')}
                        </div>
                    </div>
                    ${editMode ? `<label class="dtd-detail-remarks">कैफियत<textarea name="remarks">${escapeDressTimeModalHtml(record.remarks)}</textarea></label>` : `<div class="dtd-detail-readonly-remarks"><strong>कैफियत:</strong> ${escapeDressTimeModalHtml(record.remarks || '-')}</div>`}
                    <div class="dtd-detail-modal-actions">
                        <button type="button" class="dtd-detail-modal-cancel">बन्द गर्नुहोस्</button>
                        ${editMode ? '<button type="submit" class="dtd-detail-modal-save">परिवर्तन सुरक्षित गर्नुहोस्</button>' : ''}
                    </div>
                </form>
            </div>`;

        document.body.appendChild(modal);
        modal.querySelector('.dtd-detail-modal-close').addEventListener('click', closeDressTimeModal);
        modal.querySelector('.dtd-detail-modal-cancel').addEventListener('click', closeDressTimeModal);
        modal.addEventListener('click', event => {
            if (event.target === modal) closeDressTimeModal();
        });

        if (editMode) {
            const staffList = modal.querySelector('.dtd-detail-staff-list');
            modal.querySelector('.dtd-detail-add-staff').addEventListener('click', () => {
                staffList.insertAdjacentHTML('beforeend', renderDressTimeStaffModalRow({}, true));
            });
            modal.querySelector('.dtd-detail-staff-list').addEventListener('click', event => {
                if (event.target.closest('.dtd-detail-remove-staff')) event.target.closest('.dtd-detail-staff-row').remove();
            });
            modal.querySelector('form').addEventListener('submit', event => saveDressTimeDetailModal(event, record, modal));
        }
    }

    function renderDressTimeStaffModalRow(staff, editMode) {
        const category = escapeDressTimeModalHtml(staff.category);
        const position = escapeDressTimeModalHtml(staff.position);
        const symbolNo = escapeDressTimeModalHtml(staff.symbol_no);
        const employeeName = escapeDressTimeModalHtml(staff.employee_name);
        const remarks = escapeDressTimeModalHtml(staff.remarks);
        const field = (name, value, label) => editMode
            ? `<label>${label}<input data-staff-field="${name}" value="${value}"></label>`
            : `<div><span>${label}</span><strong>${value || '-'}</strong></div>`;
        return `<div class="dtd-detail-staff-row">
            ${editMode ? `<label>प्रकार<select data-staff-field="category"><option value="">छान्नुहोस्</option><option value="अनुपस्थिति" ${category === 'अनुपस्थिति' ? 'selected' : ''}>अनुपस्थिति</option><option value="पोशाक पालना नगरेका" ${category === 'पोशाक पालना नगरेका' ? 'selected' : ''}>पोशाक पालना नगरेका</option></select></label>` : `<div><span>प्रकार</span><strong>${category || '-'}</strong></div>`}
            ${field('employee_name', employeeName, 'कर्मचारीको नाम')}
            ${field('position', position, 'पद')}
            ${field('symbol_no', symbolNo, 'संकेत नं.')}
            ${field('remarks', remarks, 'कैफियत')}
            ${editMode ? '<button type="button" class="dtd-detail-remove-staff" title="हटाउनुहोस्">&times;</button>' : ''}
        </div>`;
    }

    async function saveDressTimeDetailModal(event, record, modal) {
        event.preventDefault();
        const form = event.target;
        const value = name => form.elements[name]?.value || '';
        const staffDetails = Array.from(modal.querySelectorAll('.dtd-detail-staff-row')).map(row => {
            const get = name => row.querySelector(`[data-staff-field="${name}"]`)?.value || '';
            return { category: get('category'), employee_name: get('employee_name'), position: get('position'), symbol_no: get('symbol_no'), remarks: get('remarks') };
        }).filter(staff => staff.employee_name);
        const timeViolationCount = staffDetails.filter(staff => staff.category === 'अनुपस्थिति').length;
        const dressViolationCount = staffDetails.filter(staff => staff.category === 'पोशाक पालना नगरेका').length;
        const apiData = {
            province: value('province'), district: value('district'), local_level: value('localLevel'), office_name: value('office'),
            office_phone: value('office_phone'), monitoring_date: value('date').replace(/[०१२३४५६७८९]/g, digit => '०१२३४५६७८९'.indexOf(digit)),
            monitoring_time: value('monitoring_time'), total_staff: Number(value('total_staff')) || 0, active_staff: Number(value('active_staff')) || 0,
            vacant_staff: Number(value('vacant_staff')) || 0, staff_details: JSON.stringify(staffDetails), team_leader_name: value('monitor'),
            team_leader_post: value('team_leader_post'), official_name: value('official_name'), official_post: value('official_post'),
            time_violation_count: timeViolationCount, dress_violation_count: dressViolationCount,
            total_violations: timeViolationCount + dressViolationCount, action_recommended: timeViolationCount + dressViolationCount > 0 ? 1 : 0,
            remarks: value('remarks')
        };
        const saveButton = modal.querySelector('.dtd-detail-modal-save');
        saveButton.disabled = true;
        try {
            const result = await DressTimeAPI.update(record.id, apiData);
            if (!result.success) throw new Error(result.error || 'अनुगमन विवरण अपडेट गर्न सकिएन');
            closeDressTimeModal();
            await loadDressTimeDetailData();
            alert('अनुगमन विवरण सफलतापूर्वक अपडेट भयो।');
        } catch (error) {
            saveButton.disabled = false;
            alert('अनुगमन विवरण अपडेट गर्न सकिएन: ' + error.message);
        }
    }

    const dressTimeDetailTableBody = document.getElementById('dtdDataTableBody');
    if (dressTimeDetailTableBody && !dressTimeDetailTableBody.dataset.actionsBound) {
        dressTimeDetailTableBody.addEventListener('click', event => {
            const button = event.target.closest('.dtd-act-btn');
            if (!button) return;
            const row = window.dtdRecords.find(record => String(record.id) === String(button.closest('tr')?.dataset.id));
            if (!row) return;
            if (button.classList.contains('view')) showDressTimeDetail(row);
            if (button.classList.contains('edit')) editDressTimeDetail(row);
        });
        dressTimeDetailTableBody.dataset.actionsBound = 'true';
    }

    // Load Dress Time Detail Data
    window.loadDressTimeDetailData = async function() {
        try {
            const result = await DressTimeAPI.getAll();
            if (!result.success) throw new Error(result.error || 'डाटा लोड गर्न सकिएन');

            const rows = result.data || [];
            const formatDressTimeDate = value => {
                const date = String(value || '').slice(0, 10);
                return date && /^\d{4}-\d{2}-\d{2}$/.test(date)
                    ? date.replace(/[0-9]/g, digit => '०१२३४५६७८९'[digit])
                    : '-';
            };

            window.dtdRecords = rows.map(row => ({
                id: row.id,
                date: formatDressTimeDate(row.monitoring_date),
                province: row.province || '-',
                district: row.district || '-',
                localLevel: row.local_level || '-',
                office: row.office_name || '-',
                totalViolations: row.total_violations || 0,
                timeViolations: row.time_violation_count || 0,
                dressViolations: row.dress_violation_count || 0,
                monitor: row.team_leader_name || '-',
                office_phone: row.office_phone || '',
                monitoring_time: row.monitoring_time || '',
                total_staff: row.total_staff || 0,
                active_staff: row.active_staff || 0,
                vacant_staff: row.vacant_staff || 0,
                staff_details: row.staff_details || '[]',
                team_leader_post: row.team_leader_post || '',
                official_name: row.official_name || '',
                official_post: row.official_post || '',
                action_recommended: row.action_recommended || 0,
                remarks: row.remarks || ''
            }));

            // Update stat cards
            document.getElementById('dtdStatTotal').textContent = rows.length;
            document.getElementById('dtdStatTimeViolation').textContent = rows.filter(r => r.time_violation_count > 0).length;
            document.getElementById('dtdStatDressViolation').textContent = rows.filter(r => r.dress_violation_count > 0).length;
            document.getElementById('dtdStatActionRecommended').textContent = rows.reduce((sum, r) => sum + (r.action_recommended || 0), 0);

            // Render table
            renderDressTimeDetailTable(window.dtdRecords);

            // Update province donut chart
            const provinceCounts = {};
            rows.forEach(row => { if (row.province) provinceCounts[row.province] = (provinceCounts[row.province] || 0) + 1; });
            
            const dtdProvinceColors = {
                "बागमती प्रदेश":"#294674",
                "गण्डकी प्रदेश":"#259855",
                "कोशी प्रदेश":"#e1b547",
                "कर्णाली प्रदेश":"#b03140",
                "सुदूरपश्चिम प्रदेश":"#7244a0",
                "मधेश प्रदेश":"#398ca1",
                "लुम्बिनी प्रदेश":"#ca7c23"
            };

            const chartElement = document.getElementById('dtdProvinceDonut');
            if (chartElement && typeof Chart !== 'undefined') {
                if (window.dtdProvinceChart) window.dtdProvinceChart.destroy();
                const labels = Object.keys(provinceCounts);
                const values = Object.values(provinceCounts);
                const colors = labels.map(p => dtdProvinceColors[p] || '#ddd');
                
                window.dtdProvinceChart = new Chart(chartElement, {
                    type: 'doughnut',
                    data: { 
                        labels: labels.length ? labels : ['कुनै डाटा छैन'], 
                        datasets: [{ 
                            data: values.length ? values : [1], 
                            backgroundColor: colors.length ? colors : ['#dce2ec'], 
                            borderWidth: 3, 
                            borderColor: '#fff' 
                        }] 
                    },
                    options: { 
                        cutout: '55%', 
                        plugins: { legend: { display: false } }, 
                        responsive: true, 
                        maintainAspectRatio: false 
                    }
                });

                const legend = document.getElementById('dtdDonutLegend');
                if (legend) legend.innerHTML = Object.keys(provinceCounts).map((province, index) =>
                    `<li class="legend-item"><span class="legend-dot" style="background:${colors[index % colors.length]}"></span>${province}</li>`
                ).join('');
            }

            // Update maps after data is loaded
            const monitoredDistricts = new Set(window.dtdRecords.map(r => r.district));
            const violationDistricts = new Set(window.dtdRecords.filter(r => (r.timeViolations + r.dressViolations) >= 4).map(r => r.district));
            
            if (!window.dtdMonitoredMapInstance) {
                window.dtdMonitoredMapInstance = dtdInitHighlightMap('dtdMapMonitored', monitoredDistricts, '#6cbd78', '#ccc', 0.7);
            } else {
                dtdUpdateHighlightMap(window.dtdMonitoredMapInstance, monitoredDistricts, '#6cbd78', '#ccc', 0.7);
                window.dtdMonitoredMapInstance.invalidateSize();
            }
            if (!window.dtdViolationMapInstance) {
                window.dtdViolationMapInstance = dtdInitHighlightMap('dtdMapViolation', violationDistricts, '#f07f74', '#6cbd78', 0.55);
            } else {
                dtdUpdateHighlightMap(window.dtdViolationMapInstance, violationDistricts, '#f07f74', '#6cbd78', 0.55);
                window.dtdViolationMapInstance.invalidateSize();
            }



            // Initialize filters
            initializeDressTimeFilters();

        } catch (error) {
            console.error('Error loading dress time detail data:', error);
        }
    };

    // Initialize Dress Time Filters
    window.initializeDressTimeFilters = function() {
        const filterValues = {
            province: document.getElementById('dtdFProvince'),
            district: document.getElementById('dtdFDistrict'),
            localLevel: document.getElementById('dtdFLocalLevel'),
            office: document.getElementById('dtdFOffice'),
            violationType: document.getElementById('dtdFViolationType'),
            employee: document.getElementById('dtdFEmployee')
        };

        // Fill filter options
        const fillFilter = (element, values) => {
            if (!element) return;
            const selected = element.value;
            element.innerHTML = '<option value="">सबै</option>' + values.filter(Boolean).filter((value, index, list) => list.indexOf(value) === index)
                .map(value => `<option value="${value}">${value}</option>`).join('');
            element.value = values.includes(selected) ? selected : '';
        };

        fillFilter(filterValues.province, window.dtdRecords.map(row => row.province));
        fillFilter(filterValues.district, window.dtdRecords.map(row => row.district));
        fillFilter(filterValues.localLevel, window.dtdRecords.map(row => row.localLevel));

        // Apply filter function
        const applyDressTimeFilters = async () => {
            const province = filterValues.province?.value || '';
            const district = filterValues.district?.value || '';
            const localLevel = filterValues.localLevel?.value || '';
            const office = (filterValues.office?.value || '').trim().toLowerCase();
            const violationType = filterValues.violationType?.value || '';
            const employee = (filterValues.employee?.value || '').trim().toLowerCase();

            const filters = {};
            if (province) filters.province = province;
            if (district) filters.district = district;
            if (localLevel) filters.local_level = localLevel;
            if (office) filters.office_name = office;
            if (violationType) filters.violation_type = violationType;

            try {
                const result = await DressTimeAPI.getAll(filters);
                if (result.success) {
                    const filteredRows = result.data || [];
                    
                    // Update records
                    window.dtdRecords = filteredRows.map(row => ({
                        id: row.id,
                        date: row.monitoring_date ? String(row.monitoring_date).slice(0, 10).replace(/[0-9]/g, digit => '०१२३४५६७८९'[digit]) : '-',
                        province: row.province || '-',
                        district: row.district || '-',
                        localLevel: row.local_level || '-',
                        office: row.office_name || '-',
                        totalViolations: row.total_violations || 0,
                        timeViolations: row.time_violation_count || 0,
                        dressViolations: row.dress_violation_count || 0,
                        monitor: row.team_leader_name || '-',
                        office_phone: row.office_phone || '',
                        monitoring_time: row.monitoring_time || '',
                        total_staff: row.total_staff || 0,
                        active_staff: row.active_staff || 0,
                        vacant_staff: row.vacant_staff || 0,
                        staff_details: row.staff_details || '[]',
                        team_leader_post: row.team_leader_post || '',
                        official_name: row.official_name || '',
                        official_post: row.official_post || '',
                        action_recommended: row.action_recommended || 0,
                        remarks: row.remarks || ''
                    }));

                    // Update table
                    renderDressTimeDetailTable(window.dtdRecords);

                    // Update stats
                    document.getElementById('dtdStatTotal').textContent = filteredRows.length;
                    document.getElementById('dtdStatTimeViolation').textContent = filteredRows.filter(r => r.time_violation_count > 0).length;
                    document.getElementById('dtdStatDressViolation').textContent = filteredRows.filter(r => r.dress_violation_count > 0).length;
                    document.getElementById('dtdStatActionRecommended').textContent = filteredRows.reduce((sum, r) => sum + (r.action_recommended || 0), 0);

                    // Update maps
                    const monitoredDistricts = new Set(filteredRows.map(r => r.district));
                    const violationDistricts = new Set(filteredRows.filter(r => (r.time_violation_count + r.dress_violation_count) >= 4).map(r => r.district));
                    
                    if (!window.dtdMonitoredMapInstance) {
                        window.dtdMonitoredMapInstance = dtdInitHighlightMap('dtdMapMonitored', monitoredDistricts, '#6cbd78', '#ccc', 0.7);
                    } else {
                        dtdUpdateHighlightMap(window.dtdMonitoredMapInstance, monitoredDistricts, '#6cbd78', '#ccc', 0.7);
                        window.dtdMonitoredMapInstance.invalidateSize();
                    }
                    if (!window.dtdViolationMapInstance) {
                        window.dtdViolationMapInstance = dtdInitHighlightMap('dtdMapViolation', violationDistricts, '#f07f74', '#6cbd78', 0.55);
                    } else {
                        dtdUpdateHighlightMap(window.dtdViolationMapInstance, violationDistricts, '#f07f74', '#6cbd78', 0.55);
                        window.dtdViolationMapInstance.invalidateSize();
                    }
                }
            } catch (error) {
                console.error('Error applying dress time filters:', error);
            }
        };

        // Add event listeners
        Object.values(filterValues).forEach(element => {
            if (element && !element.dataset.liveDataBound) {
                element.addEventListener(element.tagName === 'INPUT' ? 'input' : 'change', applyDressTimeFilters);
                element.dataset.liveDataBound = 'true';
            }
        });

        // Reset filter button
        const resetBtn = document.getElementById('dtdResetFilterBtn');
        if (resetBtn && !resetBtn.dataset.liveDataBound) {
            resetBtn.addEventListener('click', () => {
                Object.values(filterValues).forEach(element => {
                    if (element && 'value' in element) element.value = '';
                });
                loadDressTimeDetailData();
            });
            resetBtn.dataset.liveDataBound = 'true';
        }

        // Apply filter button
        const applyBtn = document.getElementById('dtdApplyFilterBtn');
        if (applyBtn && !applyBtn.dataset.liveDataBound) {
            applyBtn.addEventListener('click', applyDressTimeFilters);
            applyBtn.dataset.liveDataBound = 'true';
        }

        // Refresh button
        const refreshBtn = document.getElementById('dtdRefreshBtn');
        if (refreshBtn && !refreshBtn.dataset.liveDataBound) {
            refreshBtn.addEventListener('click', loadDressTimeDetailData);
            refreshBtn.dataset.liveDataBound = 'true';
        }
    };

    // Initialize Ujiri Vivaran Page
    initializeUjiriVivaran();

    // Initialize Office Monitoring Form
    initializeOfficeMonitoringForm();

    // Initialize Dashboard Map (only if map container exists and is visible)
    const dashboardMapContainer = document.getElementById('map');
    if (dashboardMapContainer && dashboardGrid && dashboardGrid.style.display !== 'none') {
        initializeDashboardMap();
    }
});

// Initialize Dashboard Map
function initializeDashboardMap() {
    if (window.dashboardMapInstance) {
        return; // Already initialized
    }

    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.error('Dashboard map container not found');
        return;
    }

    try {
        window.dashboardMapInstance = L.map('map', {
            zoomControl: true
        }).setView([28.3949, 84.1240], 7);

        const colors = {
            green: '#6cbd78',
            yellow: '#f9e075',
            red: '#f07f74',
            grey: '#e0e0e0'
        };

        const geoJsonUrl = 'https://raw.githubusercontent.com/Acesmndr/nepal-geojson/master/generated-geojson/nepal-with-districts-acesmndr.geojson';

        fetch(geoJsonUrl)
            .then(response => response.json())
            .then(data => {
                const features = data.features.map(feature => {
                    const rand = Math.random();
                    let color = colors.grey;
                    if (rand > 0.7) color = colors.green;
                    else if (rand > 0.4) color = colors.yellow;
                    else if (rand > 0.2) color = colors.red;
                    
                    feature.properties.color = color;
                    return feature;
                });

                const geojsonLayer = L.geoJSON(features, {
                    style: function(feature) {
                        return {
                            color: '#fff',
                            weight: 1,
                            opacity: 1,
                            fillColor: feature.properties.color || colors.grey,
                            fillOpacity: 0.8
                        };
                    },
                    onEachFeature: function(feature, layer) {
                        if (feature.properties && feature.properties.NAME_1) {
                            layer.bindPopup(feature.properties.NAME_1);
                        }
                    }
                }).addTo(window.dashboardMapInstance);

                window.dashboardMapInstance.fitBounds(geojsonLayer.getBounds());
            })
            .catch(err => {
                console.error("Error loading GeoJSON:", err);
                mapContainer.innerHTML = "<div style='padding:20px; text-align:center;'>Failed to load map data. Please check console for errors.</div>";
            });
    } catch (error) {
        console.error('Error initializing dashboard map:', error);
    }
}

// Initialize Office Monitoring Form
function initializeOfficeMonitoringForm() {
    /* ===== Province → District → Local via nepalData.js ===== */
    setupNepalGeoDropdowns('anugamanProvinceSelect', 'anugamanDistrictSelect', 'anugamanMunicipalitySelect');

    /* ===== Nepali digits ===== */
    const np = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    function toNep(num) {
        return String(num).split('').map(c => (c >= '0' && c <= '9') ? np[+c] : c).join('');
    }

    /* ===== Nepali Date ===== */
    const monthNames = ['बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत'];
    const yearSel = document.getElementById('anugamanDateYear');
    const monthSel = document.getElementById('anugamanDateMonth');
    const daySel = document.getElementById('anugamanDateDay');

    if (yearSel && monthSel && daySel) {
        // Get current Nepali date from NepaliCalendar API
        let currentBsYear = 2083;
        let currentBsMonth = 1;
        let currentBsDay = 1;

        if (window.NepaliCalendar && window.NepaliCalendar.getCurrentDate) {
            const currentDateStr = window.NepaliCalendar.getCurrentDate();
            if (currentDateStr) {
                const parts = currentDateStr.split('-');
                if (parts.length === 3) {
                    currentBsYear = parseInt(parts[0]);
                    currentBsMonth = parseInt(parts[1]);
                    currentBsDay = parseInt(parts[2]);
                }
            }
        }

        for (let y = currentBsYear - 10; y <= currentBsYear + 2; y++) {
            const opt = document.createElement('option');
            opt.value = y;
            opt.textContent = toNep(y);
            if (y === currentBsYear) opt.selected = true;
            yearSel.appendChild(opt);
        }
        monthNames.forEach((m, i) => {
            const opt = document.createElement('option');
            opt.value = i + 1;
            opt.textContent = m;
            if (i + 1 === currentBsMonth) opt.selected = true;
            monthSel.appendChild(opt);
        });
        for (let d = 1; d <= 32; d++) {
            const opt = document.createElement('option');
            opt.value = d;
            opt.textContent = toNep(d);
            if (d === currentBsDay) opt.selected = true;
            daySel.appendChild(opt);
        }
    }

    /* ===== Location ===== */
    const locationTrackBtn = document.getElementById('locationTrackBtn');
    if (locationTrackBtn) {
        locationTrackBtn.addEventListener('click', function () {
            const inp = document.getElementById('anugamanAddressInput');
            if (!navigator.geolocation) {
                alert('लोकेसन सुविधा उपलब्ध छैन।');
                return;
            }
            inp.placeholder = 'स्थान पत्ता लगाउँदै...';
            navigator.geolocation.getCurrentPosition(
                pos => {
                    inp.value = 'अक्षांश: ' + pos.coords.latitude.toFixed(5) + ', देशान्तर: ' + pos.coords.longitude.toFixed(5);
                },
                () => {
                    inp.placeholder = 'ठेगाना ट्र्याक गर्नुहोस् वा म्यानुअली भर्नुहोस्';
                    alert('स्थान पत्ता लगाउन सकिएन। कृपया म्यानुअली भर्नुहोस्।');
                }
            );
        });
    }

    /* ===== Collapse ===== */
    document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', function () {
            const target = document.getElementById(this.getAttribute('data-target'));
            if (!target) return;
            target.classList.toggle('hidden');
            this.classList.toggle('collapsed');
        });
    });

    /* ===== Char count ===== */
    window.updateCount = function (el, id) {
        const span = document.getElementById(id);
        if (!span) return;
        const len = el.value.length;
        const max = el.getAttribute('maxlength') || '';
        span.textContent = toNep(len) + ' / ' + toNep(max) + ' शब्द';
    };

    /* ===== Voice ===== */
    document.querySelectorAll('.btn-voice[data-voice-target]').forEach(btn => {
        btn.addEventListener('click', function () {
            const target = document.getElementById(this.getAttribute('data-voice-target'));
            if (!target) return;
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SR) {
                alert('भ्वाइस इनपुट समर्थित छैन।');
                return;
            }
            const rec = new SR();
            rec.lang = 'ne-NP';
            rec.interimResults = false;
            this.classList.add('recording');
            rec.start();
            rec.onresult = e => {
                const txt = e.results[0][0].transcript;
                target.value = target.value ? target.value + ' ' + txt : txt;
                target.dispatchEvent(new Event('input'));
            };
            rec.onerror = () => this.classList.remove('recording');
            rec.onend = () => this.classList.remove('recording');
        });
    });

    /* ===== Clear ===== */
    document.querySelectorAll('.btn-clear[data-clear-target]').forEach(btn => {
        btn.addEventListener('click', function () {
            const target = document.getElementById(this.getAttribute('data-clear-target'));
            if (target) {
                target.value = '';
                target.dispatchEvent(new Event('input'));
            }
        });
    });

    /* ===== Facilities ===== */
    const facilities = [
        "सेवाग्राही सहायता कक्ष (Help Desk)",
        "अपाङ्गमैत्री कार्यस्थल",
        "प्रतिक्षालय",
        "शौचालय (महिला/पुरुष)",
        "खानेपानीको उचित व्यवस्था",
        "स्तनपान कक्ष/स्थान",
        "धुम्रपान निषेध संकेत",
        "चमेना गृह",
        "उजुरी पेटिका",
        "वेबसाइट, सामाजिक सञ्जाल"
    ];
    const tbody = document.getElementById('facilityTableBody');
    if (tbody) {
        facilities.forEach((label, i) => {
            const id = 'fac' + i;
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${label}</td>
            <td><input type="radio" name="${id}" value="cha"></td>
            <td><input type="radio" name="${id}" value="chaina"></td>
            <td><input type="radio" name="${id}" value="samanya"></td>
        `;
            tbody.appendChild(tr);
        });
    }

    /* ===== Toast ===== */
    function showToast(msg, isError) {
        const toast = document.getElementById('formToast');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.toggle('error', !!isError);
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
    }

    /* ===== Submit ===== */
    const submitBtn = document.getElementById('submitAnugamanBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', async function () {
            const required = [
                { id: 'anugamanProvinceSelect', label: 'प्रदेश' },
                { id: 'anugamanDistrictSelect', label: 'जिल्ला' },
                { id: 'anugamanMunicipalitySelect', label: 'स्थानीय तह' },
                { id: 'anugamanOfficeName', label: 'कार्यालयको नाम' },
                { id: 'anugamanMonitorName', label: 'अनुगमनकर्ताको नाम' },
                { id: 'anugamanMonitorPosition', label: 'अनुगमनकर्ताको पद' }
            ];
            for (const f of required) {
                const el = document.getElementById(f.id);
                if (!el.value) {
                    showToast('कृपया "' + f.label + '" भर्नुहोस्।', true);
                    el.focus();
                    return;
                }
            }
            if (!yearSel.value || !monthSel.value || !daySel.value) {
                showToast('कृपया अनुगमन मिति पूरा गर्नुहोस्।', true);
                return;
            }

            const selectedRadioValues = {};
            document.querySelectorAll('#anugamanForm #sec2 input[type="radio"]:checked').forEach(input => {
                const question = input.closest('.question-block')?.querySelector('.q-label')?.textContent.trim() || input.name;
                selectedRadioValues[question] = input.parentElement.textContent.trim();
            });
            const selectedFacilities = Array.from(document.querySelectorAll('#facilityTableBody tr')).map(row => ({
                name: row.querySelector('td')?.textContent.trim() || '',
                value: row.querySelector('input[type="radio"]:checked')?.parentElement.textContent.trim() || ''
            }));
            const formData = {
                service_flow: selectedRadioValues,
                facilities: selectedFacilities,
                municipality: document.getElementById('anugamanMunicipalitySelect').value,
                darbandi: {
                    total: document.getElementById('darbandiTotal').value,
                    working: document.getElementById('darbandiWorking').value,
                    vacant: document.getElementById('darbandiVacant').value,
                    ramana: document.getElementById('darbandiRamana').value,
                    extra: document.getElementById('darbandiExtra').value
                },
                address: document.getElementById('anugamanAddressInput').value,
                remarks: document.getElementById('anugamanRemarks').value,
                footer: {
                    name: document.getElementById('anugamanFooterName').value,
                    position: document.getElementById('anugamanFooterPosition').value
                }
            };

            const data = {
                office_name: document.getElementById('anugamanOfficeName').value.trim(),
                office_type: document.getElementById('anugamanMunicipalitySelect').value,
                province: document.getElementById('anugamanProvinceSelect').value,
                district: document.getElementById('anugamanDistrictSelect').value,
                monitoring_date: yearSel.value + '-' + monthSel.value + '-' + daySel.value,
                monitoring_team: document.getElementById('anugamanMonitorName').value.trim() + ' - ' + document.getElementById('anugamanMonitorPosition').value.trim(),
                issues_found: document.getElementById('anugamanProblems').value.trim(),
                recommendations: document.getElementById('anugamanRecommendations').value.trim(),
                form_data: formData,
                overall_performance: null
            };

            try {
                const result = await OfficeMonitoringAPI.create(data);
                if (!result.success) throw new Error(result.error || 'अनुगमन सुरक्षित हुन सकेन');
                showToast('✅ अनुगमन फारम सफलतापूर्वक सुरक्षित भयो।');
                document.querySelectorAll('#anugamanForm input, #anugamanForm select, #anugamanForm textarea').forEach(element => {
                    if (element.type === 'radio' || element.type === 'checkbox') element.checked = false;
                    else element.value = '';
                });
                document.getElementById('anugamanDistrictSelect').disabled = true;
                document.getElementById('anugamanMunicipalitySelect').disabled = true;
                if (window.loadStatistics && window.loadStatistics.officeMonitoring) {
                    window.loadStatistics.officeMonitoring();
                }
            } catch (error) {
                console.error('Office monitoring form submission error:', error);
                showToast('अनुगमन सुरक्षित गर्नमा समस्या भयो: ' + error.message, true);
            }
        });
    }
}

// Initialize Filters
function initializeFilters() {
    const provinceFilter = document.getElementById('provinceFilter');
    const districtFilter = document.getElementById('districtFilter');
    const ministryFilter = document.getElementById('ministryFilter');
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    const resetFilterBtn = document.getElementById('resetFilterBtn');

    if (provinceFilter && districtFilter) {
        setupNepalGeoDropdowns('provinceFilter', 'districtFilter', 'municipalityFilter', { isFilter: true });

        // Populate ministries from nepalData.js
        if (ministryFilter) {
            ministryFilter.innerHTML = '<option value="">सबै मन्त्रालय</option>';
            getNepalMinistries().forEach(ministry => {
                const option = document.createElement('option');
                option.value = ministry;
                option.textContent = ministry;
                ministryFilter.appendChild(option);
            });
        }
    }

    // Initialize cm-filters-body dropdowns
    const cmFilterProvince = document.getElementById('cmFilterProvince');
    const cmFilterDistrict = document.getElementById('cmFilterDistrict');
    const cmFilterMunicipality = document.getElementById('cmFilterMunicipality');

    if (cmFilterProvince && cmFilterDistrict) {
        setupNepalGeoDropdowns('cmFilterProvince', 'cmFilterDistrict', 'cmFilterMunicipality', { isFilter: true });
    }

    // Apply filter
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', function() {
            const selectedProvince = provinceFilter.value;
            const selectedDistrict = districtFilter.value;
            const selectedMinistry = ministryFilter.value;
            
            // Here you would implement the actual filtering logic
            alert('फिल्टर लागू गरियो: ' + 
                  (selectedProvince ? selectedProvince : 'सबै प्रदेश') + ', ' + 
                  (selectedDistrict ? selectedDistrict : 'सबै जिल्ला') + ', ' + 
                  (selectedMinistry ? selectedMinistry : 'सबै मन्त्रालय'));
        });
    }

    // Reset filter
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', function() {
            provinceFilter.value = '';
            districtFilter.innerHTML = '<option value="">सबै जिल्ला</option>';
            districtFilter.disabled = true;
            ministryFilter.value = '';
        });
    }
}

// Initialize Analysis Map
function initializeAnalysisMap() {
    if (window.nepalMapInstance) {
        return; // Already initialized
    }

    const mapContainer = document.getElementById('nepal-map');
    if (!mapContainer) {
        console.error('Map container not found');
        return;
    }

    try {
        window.nepalMapInstance = L.map('nepal-map', {
            zoomControl: false // Disable zoom controls for cleaner look
        }).setView([28.3949, 84.1240], 6);

        // Remove background tiles to keep area outside Nepal empty
        // No tile layer added - map will show only the GeoJSON data

        // Colors for different risk levels
        const riskColors = {
            low: '#6cbd78',      // Green - Low risk
            medium: '#f9e075',   // Yellow - Medium risk
            high: '#f07f74',     // Red - High risk
            unknown: '#e0e0e0'    // Grey - Unknown
        };

        // Fetch GeoJSON data
        const geoJsonUrl = 'https://raw.githubusercontent.com/Acesmndr/nepal-geojson/master/generated-geojson/nepal-with-districts-acesmndr.geojson';

        fetch(geoJsonUrl)
            .then(response => response.json())
            .then(data => {
                // Generate random risk levels for districts
                const features = data.features.map(feature => {
                    const rand = Math.random();
                    let color = riskColors.unknown;
                    if (rand > 0.6) color = riskColors.low;
                    else if (rand > 0.3) color = riskColors.medium;
                    else if (rand > 0.1) color = riskColors.high;
                    
                    feature.properties.riskColor = color;
                    return feature;
                });

                const geojsonLayer = L.geoJSON(features, {
                    style: function(feature) {
                        return {
                            color: '#fff',
                            weight: 1,
                            opacity: 1,
                            fillColor: feature.properties.riskColor || riskColors.unknown,
                            fillOpacity: 0.7
                        };
                    },
                    onEachFeature: function(feature, layer) {
                        if (feature.properties && feature.properties.NAME_1) {
                            layer.bindPopup(`<strong>${feature.properties.NAME_1}</strong>`);
                        }
                    }
                }).addTo(window.nepalMapInstance);

                // Zoom to layer extent
                window.nepalMapInstance.fitBounds(geojsonLayer.getBounds());
            })
            .catch(err => {
                console.error("Error loading GeoJSON:", err);
                mapContainer.innerHTML = "<div style='padding:20px; text-align:center; color:#666;'>म्याप डाटा लोड गर्न सकिएन। कन्सोल जाँच गर्नुहोस्।</div>";
            });
    } catch (error) {
        console.error('Error initializing map:', error);
        mapContainer.innerHTML = "<div style='padding:20px; text-align:center; color:#666;'>म्याप सुरु गर्न सकिएन। कन्सोल जाँच गर्नुहोस्।</div>";
    }
}

// Initialize Charts
function initializeCharts() {
    // Destroy existing charts if they exist
    if (window.trendChartInstance) {
        window.trendChartInstance.destroy();
    }
    if (window.barChartInstance) {
        window.barChartInstance.destroy();
    }

    // Trend Chart
    const ctxTrend = document.getElementById('trendChart');
    if (ctxTrend) {
        window.trendChartInstance = new Chart(ctxTrend.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['साउन','भदौ','असोज','कात्तिक','मंसिर','पुस','माघ','फागुन','चैत','वैशाख','जेठ','असार'],
                datasets: [{
                    label: 'Integrity Score',
                    data: [74, 76, 72, 78, 75, 73, 77, 80, 76, 78, 75, 78.4],
                    borderColor: '#1a3675',
                    backgroundColor: 'rgba(26, 54, 117, 0.08)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false } 
                },
                scales: {
                    y: { 
                        beginAtZero: true, 
                        max: 100, 
                        ticks: { font: { size: 8 } } 
                    },
                    x: { 
                        grid: { display: false }, 
                        ticks: { font: { size: 7 } } 
                    }
                }
            }
        });
    }

    // Bar Chart: Province-wise Integrity Score
    const ctxBar = document.getElementById('barChart');
    if (ctxBar) {
        window.barChartInstance = new Chart(ctxBar.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['कोशी प्रदेश','मधेश प्रदेश','बागमती प्रदेश','गण्डकी प्रदेश','लुम्बिनी प्रदेश','कर्णाली प्रदेश','सुदूरपश्चिम प्रदेश'],
                datasets: [{
                    label: 'Integrity Score',
                    data: [82.4, 71.2, 79.8, 76.5, 74.9, 68.3, 65.7],
                    backgroundColor: ['#1a3675','#3b5a9a','#5b7aba','#7b9ada','#9bbafa','#bbdafa','#dbeafa'],
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false } 
                },
                scales: {
                    y: { 
                        beginAtZero: true, 
                        max: 100, 
                        ticks: { font: { size: 8 } } 
                    },
                    x: { 
                        grid: { display: false }, 
                        ticks: { font: { size: 7 } } 
                    }
                }
            }
        });
    }
}

/* ============ Ujuri Form JavaScript ============ */

// Char counters
function updateCount(el, countId) {
    document.getElementById(countId).textContent = el.value.length;
}

// Ministries from nepalData.js
const ministries = (window.nepalData && window.nepalData.MINISTRIES) ? window.nepalData.MINISTRIES : [
    "प्रधानमन्त्री तथा मन्त्रिपरिषद्को कार्यालय", "अर्थ मन्त्रालय", "उद्योग, वाणिज्य तथा आपूर्ति मन्त्रालय",
    "ऊर्जा, जलस्रोत तथा सिंचाइ मन्त्रालय", "कानून, न्याय तथा संसदीय मामिला मन्त्रालय", "कृषि, वन तथा पर्यावरण मन्त्रालय",
    "गृह मन्त्रालय", "परराष्ट्र मन्त्रालय", "पूर्वाधार विकास मन्त्रालय",
    "भूमि व्यवस्था, सहकारी, सङ्घीय मामिला तथा सामान्य प्रशासन मन्त्रालय",
    "महिला, बालबालिका, लैङ्गिक तथा यौनिक अल्पसङ्ख्यक र सामाजिक सुरक्षा मन्त्रालय", "युवा, श्रम तथा रोजगार मन्त्रालय",
    "रक्षा मन्त्रालय", "विज्ञान प्रविधि तथा नवप्रवर्तन मन्त्रालय", "शिक्षा तथा खेलकुद मन्त्रालय", "सूचना तथा सञ्चार मन्त्रालय",
    "संस्कृति, पर्यटन तथा नागरिक उड्डयन मन्त्रालय", "स्वास्थ्य तथा खाद्य स्वच्छता मन्त्रालय", "संवैधानिक अङ्ग"
];

// Province / District / Municipality cascade
const geo = {
    "कोशी प्रदेश": {
        "मोरङ": ["विराटनगर महानगरपालिका","रंगेली नगरपालिका"],
        "झापा": ["भद्रपुर नगरपालिका","दमक नगरपालिका"],
        "सुनसरी": ["इटहरी उपमहानगरपालिका","धरान उपमहानगरपालिका"]
    },
    "मधेश प्रदेश": {
        "धनुषा": ["जनकपुरधाम उपमहानगरपालिका"],
        "सर्लाही": ["मलंगवा नगरपालिका"],
        "बारा": ["कलैया उपमहानगरपालिका"]
    },
    "बागमती प्रदेश": {
        "काठमाडौं": ["काठमाडौं महानगरपालिका","कीर्तिपुर नगरपालिका"],
        "ललितपुर": ["ललितपुर महानगरपालिका"],
        "भक्तपुर": ["भक्तपुर नगरपालिका"]
    },
    "गण्डकी प्रदेश": {
        "कास्की": ["पोखरा महानगरपालिका"],
        "स्याङ्जा": ["पुतलीबजार नगरपालिका"]
    },
    "लुम्बिनी प्रदेश": {
        "रुपन्देही": ["बुटवल उपमहानगरपालिका","सिद्धार्थनगर नगरपालिका"],
        "बाँके": ["नेपालगञ्ज उपमहानगरपालिका"]
    },
    "कर्णाली प्रदेश": {
        "सुर्खेत": ["वीरेन्द्रनगर नगरपालिका"],
        "जुम्ला": ["चन्दननाथ नगरपालिका"]
    },
    "सुदूरपश्चिम प्रदेश": {
        "कैलाली": ["धनगढी उपमहानगरपालिका"],
        "कञ्चनपुर": ["भीमदत्त नगरपालिका"]
    }
};

// Priority / Status colour dots
const priorityColors = {"उच्च":"var(--danger)","मध्यम":"var(--warning)","सामान्य":"var(--navy)","न्यून":"var(--ink-faint)"};
const statusColors = {"pending":"var(--warning)","in_progress":"var(--navy)","resolved":"var(--success)","closed":"var(--ink-faint)"};

// Nepali (BS) date popup
const bsMonths = ["वैशाख","जेठ","असार","श्रावण","भदौ","असोज","कार्तिक","मंसिर","पुष","माघ","फागुन","चैत"];
const devDigits = ['०','१','२','३','४','५','६','७','८','९'];

function toDev(n) { return String(n).split('').map(d=>devDigits[+d]).join(''); }

function paintDot(dotEl, color) { dotEl.style.background = color || 'var(--ink-faint)'; }

// Initialize Ujuri Form
function initializeUjuriForm() {
    // Variables that will be used in cancel handler
    let attachedFiles = [];
    window.ujuriAttachedFileNames = [];
    window.ujuriAttachedFiles = [];
    let renderFiles;
    let regDateText;
    let priorityDot;
    let statusDot;
    let districtSelect;
    let municipalitySelect;
    let ujiriFormContainer;
    let dashboardToggle;
    let sidebarMenuItems;

    // Populate ministry select
    const ministrySelect = document.getElementById('newEntryMinistrySelect');
    if (ministrySelect) {
        ministries.forEach(m => {
            const o = document.createElement('option');
            o.value = m;
            o.textContent = m;
            ministrySelect.appendChild(o);
        });
    }

    // Province / District / Municipality cascade via nepalData.js
    setupNepalGeoDropdowns('newEntryProvinceSelect', 'newEntryDistrictSelect', 'newEntryMunicipalitySelect');
    const provinceSelect = document.getElementById('newEntryProvinceSelect');
    districtSelect = document.getElementById('newEntryDistrictSelect');
    municipalitySelect = document.getElementById('newEntryMunicipalitySelect');

    // Priority / Status colour dots
    priorityDot = document.getElementById('priorityDot');
    statusDot = document.getElementById('statusDot');
    const prioritySelect = document.getElementById('newEntryPriority');
    const statusSelect = document.getElementById('newEntryStatus');

    if (prioritySelect && priorityDot) {
        prioritySelect.addEventListener('change', e => {
            paintDot(priorityDot, priorityColors[e.target.value]);
        });
    }

    if (statusSelect && statusDot) {
        statusSelect.addEventListener('change', e => {
            paintDot(statusDot, statusColors[e.target.value]);
        });
        paintDot(statusDot, statusColors['pending']);
    }

    // Calendar
    let calState = { year: 2082, monthIdx: 4, daysInMonth: 32 };
    const calPop = document.getElementById('calPop');
    const dateFieldWrap = document.getElementById('newEntryRegDate');
    regDateText = document.getElementById('regDateText');
    const calMonthLabel = document.getElementById('calMonthLabel');
    const calGrid = document.getElementById('calGrid');
    const dowShort = ["आ","सो","मं","बु","बि","शु","श"];

    function buildCalendar() {
        calMonthLabel.textContent = `${bsMonths[calState.monthIdx]} ${toDev(calState.year)}`;
        calGrid.innerHTML = '';
        dowShort.forEach(d => {
            const el = document.createElement('div');
            el.className = 'dow';
            el.textContent = d;
            calGrid.appendChild(el);
        });
        const leadingBlanks = 2;
        for (let i = 0; i < leadingBlanks; i++) {
            const el = document.createElement('div');
            el.className = 'day empty';
            calGrid.appendChild(el);
        }
        for (let d = 1; d <= calState.daysInMonth; d++) {
            const el = document.createElement('div');
            el.className = 'day';
            el.textContent = toDev(d);
            el.addEventListener('click', () => {
                document.querySelectorAll('.cal-grid .day').forEach(x => x.classList.remove('sel'));
                el.classList.add('sel');
                document.getElementById('nepaliYear').value = String(calState.year);
                document.getElementById('nepaliMonth').value = String(calState.monthIdx + 1);
                document.getElementById('nepaliDay').value = String(d);
                regDateText.innerHTML = `${toDev(d)} ${bsMonths[calState.monthIdx]} ${toDev(calState.year)}<span class="bs">BS</span>`;
                calPop.classList.remove('open');
            });
            calGrid.appendChild(el);
        }
    }

    if (calPop && calMonthLabel && calGrid) {
        buildCalendar();

        document.getElementById('calPrev').addEventListener('click', (e) => {
            e.stopPropagation();
            calState.monthIdx = (calState.monthIdx + 11) % 12;
            if (calState.monthIdx === 11) calState.year--;
            buildCalendar();
        });

        document.getElementById('calNext').addEventListener('click', (e) => {
            e.stopPropagation();
            calState.monthIdx = (calState.monthIdx + 1) % 12;
            if (calState.monthIdx === 0) calState.year++;
            buildCalendar();
        });

        dateFieldWrap.addEventListener('click', (e) => {
            if (e.target.closest('.cal-pop')) return;
            calPop.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!dateFieldWrap.contains(e.target)) calPop.classList.remove('open');
        });
    }

    // Voice input
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    document.querySelectorAll('.voice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.target);
            if (!SpeechRec) {
                showToast('यो ब्राउजरमा आवाज पहिचान उपलब्ध छैन', true);
                return;
            }
            if (btn.classList.contains('on')) return;
            const rec = new SpeechRec();
            rec.lang = 'ne-NP';
            rec.interimResults = false;
            btn.classList.add('on');
            rec.start();
            rec.onresult = (e) => {
                const text = e.results[0][0].transcript;
                target.value += (target.value ? ' ' : '') + text;
                target.dispatchEvent(new Event('input'));
            };
            rec.onerror = () => showToast('आवाज पहिचान गर्न सकिएन', true);
            rec.onend = () => btn.classList.remove('on');
        });
    });

    // Attachments
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('complaintAttachment');
    const fileList = document.getElementById('fileList');

    if (dropZone && fileInput && fileList) {
        ['dragenter', 'dragover'].forEach(evt => {
            dropZone.addEventListener(evt, e => { e.preventDefault(); dropZone.classList.add('drag'); });
        });
        ['dragleave', 'drop'].forEach(evt => {
            dropZone.addEventListener(evt, e => { e.preventDefault(); dropZone.classList.remove('drag'); });
        });
        dropZone.addEventListener('drop', e => {
            addFiles(e.dataTransfer.files);
        });
        fileInput.addEventListener('change', e => {
            addFiles(e.target.files);
        });

        function addFiles(list) {
            Array.from(list).forEach(f => attachedFiles.push(f));
            window.ujuriAttachedFileNames = attachedFiles.map(file => file.name);
            window.ujuriAttachedFiles = attachedFiles;
            renderFiles();
        }

        renderFiles = function() {
            fileList.innerHTML = '';
            attachedFiles.forEach((f, i) => {
                const chip = document.createElement('div');
                chip.className = 'file-chip';
                chip.innerHTML = `<i class="fas fa-file"></i><span class="fname">${f.name}</span><span class="fsize">${(f.size/1024).toFixed(0)} KB</span>`;
                const rm = document.createElement('button');
                rm.type = 'button';
                rm.innerHTML = '<i class="fas fa-trash"></i>';
                rm.addEventListener('click', () => {
                    attachedFiles.splice(i, 1);
                    window.ujuriAttachedFileNames = attachedFiles.map(file => file.name);
                    window.ujuriAttachedFiles = attachedFiles;
                    renderFiles();
                });
                chip.appendChild(rm);
                fileList.appendChild(chip);
            });
        }

        window.clearUjuriAttachments = function() {
            attachedFiles = [];
            window.ujuriAttachedFileNames = [];
            window.ujuriAttachedFiles = [];
            fileInput.value = '';
            renderFiles();
        };
    }

    // Footer actions
    const saveBtn = document.getElementById('newEntrySaveBtn');
    const cancelBtn = document.getElementById('newEntryCancelBtn');
    const ujiriForm = document.getElementById('ujuriForm');

    if (ujiriForm && !ujiriForm.dataset.apiSubmitAttached) {
        ujiriForm.dataset.apiSubmitAttached = 'true';
        ujiriForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            try {
                const year = Number(document.getElementById('nepaliYear').value);
                const month = Number(document.getElementById('nepaliMonth').value);
                const day = Number(document.getElementById('nepaliDay').value);
                if (!year || !month || !day) {
                    showToast('कृपया दर्ता मिति पूरा गर्नुहोस्', true);
                    return;
                }

                const result = await UjuriAPI.create({
                    registration_number: document.getElementById('newEntryComplaintNumber').value.trim(),
                    registration_date: convertNepaliToEnglishDate(year, month, day),
                    complainant_name: document.getElementById('newEntryComplainantName').value.trim(),
                    opponent_name: document.getElementById('newEntryOpponentName').value.trim(),
                    ministry: document.getElementById('newEntryMinistrySelect').value,
                    province: document.getElementById('newEntryProvinceSelect').value,
                    district: document.getElementById('newEntryDistrictSelect').value,
                    municipality: document.getElementById('newEntryMunicipalitySelect').value,
                    complaint_type: document.getElementById('newEntryComplaintType').value,
                    complaint_description: document.getElementById('newEntryDescription').value.trim(),
                    committee_decision: document.getElementById('newEntryDecision').value.trim(),
                    remarks: document.getElementById('newEntryNotes').value.trim(),
                    attachment_files: attachedFiles.map(file => file.name).join(', '),
                    status: document.getElementById('newEntryStatus').value || 'pending',
                    priority: document.getElementById('newEntryPriority').value || 'medium'
                });

                if (!result.success) throw new Error(result.error || 'उजुरी सुरक्षित हुन सकेन');
                showToast('उजुरी सफलतापूर्वक दर्ता भयो');
                ujiriForm.reset();
            } catch (error) {
                console.error('Ujiri form submission error:', error);
                showToast('उजुरी दर्ता गर्नमा समस्या भयो: ' + error.message, true);
            }
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', (event) => {
            const required = [
                ['newEntryComplaintNumber', 'दर्ता नं'],
                ['newEntryOpponentName', 'विपक्षी'],
                ['newEntryDescription', 'उजुरीको विवरण']
            ];
            const missing = required.find(([id]) => !document.getElementById(id).value.trim());
            if (missing) {
                event.preventDefault();
                showToast(`कृपया "${missing[1]}" भर्नुहोस्`, true);
                document.getElementById(missing[0]).focus();
                return;
            }
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            // Get DOM elements
            ujiriFormContainer = document.getElementById('ujuriFormContainer');
            const dashboardGrid = document.querySelector('.dashboard-grid');
            dashboardToggle = document.getElementById('dashboardToggle');
            sidebarMenuItems = document.querySelectorAll('.sidebar-menu li');
            
            // Hide form and show dashboard
            ujiriFormContainer.style.display = 'none';
            if (dashboardGrid) dashboardGrid.style.display = 'grid';
            
            // Reset form
            document.getElementById('ujuriForm').reset();
            if (window.clearUjuriAttachments) window.clearUjuriAttachments();
            document.getElementById('nepCount1').textContent = '0';
            document.getElementById('nepCount2').textContent = '0';
            regDateText.innerHTML = 'मिति छान्नुहोस्<span class="bs">BS</span>';
            paintDot(priorityDot, null);
            paintDot(statusDot, statusColors['pending']);
            districtSelect.innerHTML = '<option value="">पहिले प्रदेश छान्नुहोस्</option>';
            districtSelect.disabled = true;
            municipalitySelect.innerHTML = '<option value="">पहिले जिल्ला छान्नुहोस्</option>';
            municipalitySelect.disabled = true;
            
            // Update sidebar active state
            sidebarMenuItems.forEach(item => item.classList.remove('active'));
            if (dashboardToggle) dashboardToggle.parentElement.classList.add('active');
            
            showToast('फारम खाली गरियो');
        });
    }

    // Technical Audit Toggle Functionality (using global function approach)
    const technicalAuditToggle = document.getElementById('technicalAuditToggle');
    const technicalAuditContent = document.getElementById('technicalAuditContent');

}

// Toast notification
function showToast(msg, isErr) {
    const toastEl = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    let toastTimer;
    
    if (toastEl && toastMsg) {
        clearTimeout(toastTimer);
        toastEl.classList.toggle('err', !!isErr);
        toastEl.querySelector('i').className = isErr ? 'fas fa-circle-exclamation' : 'fas fa-circle-check';
        toastMsg.textContent = msg;
        toastEl.classList.add('show');
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3200);
    }
}

// Global function to show technical audit
function showTechnicalAudit() {
    const technicalAuditContent = document.getElementById('technicalAuditContent');
    const dashboardGrid = document.querySelector('.dashboard-grid');
    const analysisPage = document.getElementById('analysisContent');
    const sectionReportContent = document.getElementById('sectionReportContent');
    const calendarContent = document.getElementById('calendarContent');
    const chhanbinContent = document.getElementById('chhanbinContent');
    const ujiriFormContainer = document.getElementById('ujiriFormContainer');
    const ujiriVivaranContent = document.getElementById('ujiriVivaranContent');
    const officeMonFormContainer = document.getElementById('officeMonFormContainer');
    const officeMonDetailContainer = document.getElementById('officeMonDetailContainer');
    const dressTimeFormContainer = document.getElementById('dressTimeFormContainer');
    const dressTimeDetailContainer = document.getElementById('dressTimeDetailContainer');
    const surveyFormContainer = document.getElementById('surveyFormContainer');
    const surveyDashboardContainer = document.getElementById('surveyDashboardContainer');
    const projectMonitoringFormContainer = document.getElementById('projectMonitoringFormContainer');
    const projectMonitoringDashboard = document.getElementById('projectMonitoringDashboard');

    // Hide all content
    if (dashboardGrid) dashboardGrid.style.display = 'none';
    if (analysisPage) analysisPage.style.display = 'none';
    if (ujiriFormContainer) ujiriFormContainer.style.display = 'none';
    if (ujiriVivaranContent) ujiriVivaranContent.style.display = 'none';
    if (officeMonFormContainer) officeMonFormContainer.style.display = 'none';
    if (officeMonDetailContainer) officeMonDetailContainer.style.display = 'none';
    if (dressTimeFormContainer) dressTimeFormContainer.style.display = 'none';
    if (dressTimeDetailContainer) dressTimeDetailContainer.style.display = 'none';
    if (surveyFormContainer) surveyFormContainer.style.display = 'none';
    if (surveyDashboardContainer) surveyDashboardContainer.style.display = 'none';
    if (projectMonitoringFormContainer) projectMonitoringFormContainer.style.display = 'none';
    if (projectMonitoringDashboard) projectMonitoringDashboard.style.display = 'none';
    if (sectionReportContent) sectionReportContent.style.display = 'none';
    if (calendarContent) calendarContent.style.display = 'none';
    if (chhanbinContent) chhanbinContent.style.display = 'none';

    // Show technical audit content
    if (technicalAuditContent) {
        technicalAuditContent.style.display = 'block';
    } else {
        console.error('Technical audit content not found');
    }

    // Update sidebar active state
    document.querySelectorAll('.sidebar-menu > li').forEach(item => item.classList.remove('active'));
    const techAuditItem = document.querySelector('a[onclick="showTechnicalAudit(); return false;"]');
    if (techAuditItem) {
        techAuditItem.parentElement.classList.add('active');
    }

    // Load statistics from API
    if (window.loadStatistics && window.loadStatistics.technicalAudit) {
        window.loadStatistics.technicalAudit();
    }

    // Initialize technical audit functionality
    try {
        initializeTechnicalAudit();
    } catch (error) {
        console.error('Error in initializeTechnicalAudit:', error);
    }
}

// Technical Audit Functionality
function formatTechnicalAuditDate(value) {
    return String(value || '').slice(0, 10).replace(/[0-9]/g, digit => '०१२३४५६७८९'[digit]);
}

function getTechnicalAuditAttachment(entryId, fileIndex) {
    return (window.technicalAuditAttachmentData?.[entryId] || [])[fileIndex] || null;
}

function viewTechnicalAuditAttachment(entryId, fileIndex) {
    const file = getTechnicalAuditAttachment(entryId, fileIndex);
    if (!file?.dataUrl) return alert('यो फाइलको सामग्री उपलब्ध छैन।');
    window.open(file.dataUrl, '_blank', 'noopener');
}

function downloadTechnicalAuditAttachment(entryId, fileIndex) {
    const file = getTechnicalAuditAttachment(entryId, fileIndex);
    if (!file?.dataUrl) return alert('यो फाइलको सामग्री उपलब्ध छैन।');
    const link = document.createElement('a');
    link.href = file.dataUrl;
    link.download = file.name || 'technical-audit-attachment';
    document.body.appendChild(link);
    link.click();
    link.remove();
}

function initializeTechnicalAudit() {
    // Sample in-memory data store
    let taRecords = [];
    let taCounter = 0;

    const taTableBody = document.getElementById('taTableBody');
    if (taTableBody?.dataset.initialized === 'true') return;
    if (taTableBody) taTableBody.dataset.initialized = 'true';
    const taSearchInput = document.getElementById('taSearchInput');
    const taStatusSelect = document.getElementById('taStatusSelect');
    const taSearchBtn = document.getElementById('taSearchBtn');
    const taExcelBtn = document.getElementById('taExcelBtn');
    const taNewBtn = document.getElementById('taNewBtn');
    
    // Modal elements
    const taModalOverlay = document.getElementById('taModalOverlay');
    const taCloseModalBtn = document.getElementById('taCloseModalBtn');
    const taCancelBtn = document.getElementById('taCancelBtn');
    const taSaveBtn = document.getElementById('taSaveBtn');
    const taAddNcrBtn = document.getElementById('taAddNcrBtn');
    const taNcrList = document.getElementById('taNcrList');
    let taNcrItems = [];
    let taEditingId = null;

    function renderTaTable(data) {
        taTableBody.innerHTML = '';

        if (!data || data.length === 0) {
            const row = document.createElement('tr');
            row.className = 'ta-empty-row';
            row.innerHTML = '<td colspan="11">कुनै आयोजना अभिलेख छैन।</td>';
            taTableBody.appendChild(row);
            updateTaStatCards([]);
            return;
        }

        data.forEach((item, index) => {
            const row = document.createElement('tr');
            const fileDisplay = item.files && item.files.length > 0 
                ? item.files.map((file, fileIndex) => `<span class="ta-file-actions"><button type="button" class="ta-file-btn" title="फाइल हेर्नुहोस्" onclick="viewTechnicalAuditAttachment('${item.id}', ${fileIndex})"><i class="fas fa-eye"></i></button><button type="button" class="ta-file-btn" title="फाइल डाउनलोड गर्नुहोस्" onclick="downloadTechnicalAuditAttachment('${item.id}', ${fileIndex})"><i class="fas fa-download"></i></button></span>`).join(' ') 
                : '-';
            
            row.innerHTML = `
                <td>${item.sn}</td>
                <td>${escapeHtml(item.name || '')}</td>
                <td>${escapeHtml(item.agency || '')}</td>
                <td>${escapeHtml(item.projectType || '')}</td>
                <td>${escapeHtml(formatTechnicalAuditDate(item.testDate))}</td>
                <td>${escapeHtml(item.ncr || '')}</td>
                <td>${escapeHtml(formatTechnicalAuditDate(item.disposalDate))}</td>
                <td>${escapeHtml(formatTechnicalAuditDate(item.disposalInfoDate))}</td>
                <td>${escapeHtml(item.remarks || '')}</td>
                <td>${fileDisplay}</td>
                <td>
                    <button type="button" class="ta-btn ta-btn-new ta-edit-btn ta-icon-action" data-id="${item.id}" title="सम्पादन" aria-label="सम्पादन"><i class="fas fa-edit"></i></button>
                    <button type="button" class="ta-btn ta-btn-new ta-delete-btn ta-icon-action" data-id="${item.id}" title="मेटाउने" aria-label="मेटाउने"><i class="fas fa-trash"></i></button>
                </td>
            `;
            taTableBody.appendChild(row);
        });

        updateTaStatCards(data);
    }

    function updateTaStatCards(data) {
        const toNepaliDigits = value => String(value ?? 0).replace(/[0-9]/g, digit => '०१२३४५६७८९'[digit]);
        const normalizeNepaliDate = value => String(value || '').slice(0, 10).replace(/[०१२३४५६७८९]/g, digit => '०१२३४५६७८९'.indexOf(digit));
        const totalTests = data.length;
        const pendingTests = data.filter(r => r.status === 'pending' || r.status === 'in_progress').length;
        const completedTests = data.filter(r => r.status === 'completed').length;
        const nonCompliances = data.filter(r => r.ncr).length;
        const pendingDisposal = data.filter(r => r.ncr && !r.disposalInfoDate).length;
        
        const thisYearTests = data.filter(r => normalizeNepaliDate(r.testDate) >= '2083-04-01').length;

        document.getElementById('taTotalTests').textContent = toNepaliDigits(totalTests);
        document.getElementById('taThisYearTests').textContent = toNepaliDigits(thisYearTests);
        document.getElementById('taPendingTests').textContent = toNepaliDigits(pendingTests);
        document.getElementById('taCompletedTests').textContent = toNepaliDigits(completedTests);
        document.getElementById('taNonCompliances').textContent = toNepaliDigits(nonCompliances);
        document.getElementById('taPendingDisposal').textContent = toNepaliDigits(pendingDisposal);
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function filterTaRecords() {
        const query = taSearchInput.value.trim().toLowerCase();
        const status = taStatusSelect.value;

        let filtered = taRecords.filter(r => {
            const matchesQuery = !query || (r.name || '').toLowerCase().includes(query);
            const matchesStatus = status === 'all' || r.status === status;
            return matchesQuery && matchesStatus;
        });

        renderTaTable(filtered);
        updateTaStatCards(filtered);
    }

    // Modal functions
    function openTaModal() {
        taModalOverlay.classList.add('active');
    }

    function closeTaModal() {
        taModalOverlay.classList.remove('active');
        clearTaFormFields();
    }

    function clearTaFormFields() {
        document.getElementById('taProjectName').value = '';
        document.getElementById('taRelatedAgency').value = '';
        document.getElementById('taProjectType').value = '';
        document.getElementById('taTestDate').value = '';
        document.getElementById('taStatus').value = 'pending';
        document.getElementById('taDisposalDate').value = '';
        document.getElementById('taDisposalInfoDate').value = '';
        taNcrItems = [];
        document.getElementById('taNcr').value = '';
        renderTaNcrList();
        document.getElementById('taRemarks').value = '';
        document.getElementById('taFileAttachment').value = '';
    }

    function renderTaNcrList() {
        taNcrList.innerHTML = taNcrItems.map((item, index) =>
            '<div class="ta-ncr-item"><span>' + escapeHtml(item) + '</span><button type="button" class="ta-ncr-remove" data-index="' + index + '" title="हटाउनुहोस्">&times;</button></div>'
        ).join('');
    }

    taAddNcrBtn.addEventListener('click', () => {
        const ncrInput = document.getElementById('taNcr');
        const ncr = ncrInput.value.trim();
        if (!ncr) return;
        taNcrItems.push(ncr);
        ncrInput.value = '';
        renderTaNcrList();
    });

    taNcrList.addEventListener('click', (e) => {
        const removeButton = e.target.closest('.ta-ncr-remove');
        if (!removeButton) return;
        taNcrItems.splice(Number(removeButton.dataset.index), 1);
        renderTaNcrList();
    });

    // Event listeners
    taSearchBtn.addEventListener('click', filterTaRecords);
    taSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') filterTaRecords();
    });
    taStatusSelect.addEventListener('change', filterTaRecords);

    taExcelBtn.addEventListener('click', () => {
        alert('Excel निर्यात सुविधा यहाँ थप्नुहोस्।');
    });

    taNewBtn.addEventListener('click', () => {
        taEditingId = null;
        openTaModal();
    });
    taCloseModalBtn.addEventListener('click', closeTaModal);
    taCancelBtn.addEventListener('click', closeTaModal);
    taModalOverlay.addEventListener('click', (e) => {
        if (e.target === taModalOverlay) closeTaModal();
    });

    taSaveBtn.addEventListener('click', async () => {
        const projectName = document.getElementById('taProjectName').value.trim();
        const relatedAgency = document.getElementById('taRelatedAgency').value.trim();
        const projectType = document.getElementById('taProjectType').value;
        const testDate = document.getElementById('taTestDate').value.trim();
        const status = document.getElementById('taStatus').value;
        const disposalDate = document.getElementById('taDisposalDate').value.trim();
        const disposalInfoDate = document.getElementById('taDisposalInfoDate').value.trim();
        const ncrInput = document.getElementById('taNcr');
        const ncr = taNcrItems.concat(ncrInput.value.trim() ? [ncrInput.value.trim()] : []).join('\n');
        const remarks = document.getElementById('taRemarks').value.trim();
        const fileInput = document.getElementById('taFileAttachment');
        
        if (!projectName) {
            alert('कृपया आयोजनाको नाम भर्नुहोस्।');
            return;
        }

        try {
            const attachments = await Promise.all(Array.from(fileInput.files).map(file => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve({ name: file.name, type: file.type, dataUrl: reader.result });
                reader.onerror = () => reject(new Error(file.name + ' पढ्न सकिएन'));
                reader.readAsDataURL(file);
            })));
            const auditData = {
                project_name: projectName,
                related_agency: relatedAgency,
                project_type: projectType,
                ncr,
                disposal_date: disposalDate,
                disposal_info_date: disposalInfoDate,
                remarks,
                attachment_data: attachments,
                audit_date: testDate || new Date().toISOString().slice(0, 10),
                status: status === 'pending' ? 'in_progress' : status,
                technical_findings: ncr,
                recommendations: remarks
            };
            if (!attachments.length && taEditingId) auditData.attachment_data = taRecords.find(record => record.id === taEditingId)?.files || [];
            const result = taEditingId
                ? await TechnicalAuditAPI.update(taEditingId, auditData)
                : await TechnicalAuditAPI.create(auditData);
            if (!result.success) throw new Error(result.error || 'अभिलेख सुरक्षित हुन सकेन');
            closeTaModal();
            await loadTaRecords();
            if (window.loadStatistics && window.loadStatistics.technicalAudit) window.loadStatistics.technicalAudit();
        } catch (error) {
            console.error('Technical audit save error:', error);
            alert('प्राविधिक परीक्षण सुरक्षित हुन सकेन: ' + error.message);
        }
    });

    async function loadTaRecords() {
        try {
            const result = await TechnicalAuditAPI.getAll();
            if (!result.success) throw new Error(result.error || 'अभिलेख लोड हुन सकेन');
            taRecords = (result.data || []).map((row, index) => ({
                id: row.id,
                sn: index + 1,
                name: row.project_name || '',
                agency: row.related_agency || '',
                projectType: row.project_type || '',
                testDate: row.audit_date || '',
                disposalDate: row.disposal_date || '',
                disposalInfoDate: row.disposal_info_date || '',
                ncr: row.ncr || row.technical_findings || '',
                remarks: row.remarks || row.recommendations || '',
                files: Array.isArray(row.attachment_data) ? row.attachment_data : [],
                status: row.status === 'in_progress' ? 'pending' : (row.status || 'pending')
            }));
            window.technicalAuditAttachmentData = Object.fromEntries(taRecords.map(row => [row.id, row.files]));
            taCounter = taRecords.length;
            renderTaTable(taRecords);
        } catch (error) {
            console.error('Technical audit load error:', error);
        }
    }

    loadTaRecords();

    // Global functions for edit/delete
    window.deleteTaRecord = function(id) {
        if (confirm('के तपाईं यो अभिलेख मेटाउन निश्चित हुनुहुन्छ?')) {
            taRecords = taRecords.filter(r => String(r.id) !== String(id));
            renderTaTable(taRecords);
            updateTaStatCards(taRecords);
        }
    };

    window.editTaRecord = function(id) {
        const rec = taRecords.find(r => String(r.id) === String(id));
        if (!rec) return;
        
        document.getElementById('taProjectName').value = rec.name || '';
        document.getElementById('taRelatedAgency').value = rec.agency || '';
        document.getElementById('taProjectType').value = rec.projectType || '';
        document.getElementById('taTestDate').value = rec.testDate || '';
        document.getElementById('taStatus').value = rec.status || 'pending';
        document.getElementById('taDisposalDate').value = rec.disposalDate || '';
        document.getElementById('taDisposalInfoDate').value = rec.disposalInfoDate || '';
        taNcrItems = (rec.ncr || '').split('\n').map(item => item.trim()).filter(Boolean);
        document.getElementById('taNcr').value = '';
        renderTaNcrList();
        document.getElementById('taRemarks').value = rec.remarks || '';
        document.getElementById('taFileAttachment').value = '';

        taEditingId = rec.id;
        openTaModal();
    };

    // Event delegation for edit/delete buttons
    taTableBody.addEventListener('click', function(e) {
        const actionButton = e.target.closest('.ta-edit-btn, .ta-delete-btn');
        if (!actionButton) return;
        const id = actionButton.getAttribute('data-id');
        if (actionButton.classList.contains('ta-edit-btn')) {
            editTaRecord(id);
        } else if (actionButton.classList.contains('ta-delete-btn')) {
            deleteTaRecord(id);
        }
    });

    // Initial render
    renderTaTable(taRecords);
    updateTaStatCards(taRecords);
}

// Initialize Ujiri Vivaran Page
function initializeUjiriVivaran() {
    // Draw donut charts
    function drawDonut(svgEl, legendEl, data, radius, strokeWidth) {
        if (!svgEl) return;
        const cx = 100, cy = 100;
        const circumference = 2 * Math.PI * radius;
        let cumulative = 0;
        const ns = 'http://www.w3.org/2000/svg';
        const g = document.createElementNS(ns, 'g');
        g.setAttribute('transform', `rotate(-90 ${cx} ${cy})`);
        let tooltip = document.getElementById('ujiriDonutTooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'ujiriDonutTooltip';
            tooltip.className = 'ujiri-donut-tooltip';
            document.body.appendChild(tooltip);
        }
        const showTooltip = (event, item) => {
            tooltip.textContent = `${item.label}: ${ujiriNumber(item.count ?? item.value)}`;
            tooltip.style.left = `${event.clientX + 12}px`;
            tooltip.style.top = `${event.clientY + 12}px`;
            tooltip.classList.add('show');
        };
        const hideTooltip = () => tooltip.classList.remove('show');
        data.forEach(d => {
            const arcLen = (d.value / 100) * circumference;
            const circle = document.createElementNS(ns, 'circle');
            circle.setAttribute('cx', cx);
            circle.setAttribute('cy', cy);
            circle.setAttribute('r', radius);
            circle.setAttribute('fill', 'none');
            circle.setAttribute('stroke', d.color);
            circle.setAttribute('stroke-width', strokeWidth);
            circle.setAttribute('stroke-dasharray', `${arcLen} ${circumference - arcLen}`);
            circle.setAttribute('stroke-dashoffset', -cumulative);
            const title = document.createElementNS(ns, 'title');
            title.textContent = `${d.label}: ${d.count ?? d.value}`;
            circle.appendChild(title);
            circle.addEventListener('mouseenter', event => showTooltip(event, d));
            circle.addEventListener('mousemove', event => showTooltip(event, d));
            circle.addEventListener('mouseleave', hideTooltip);
            circle.addEventListener('click', event => showTooltip(event, d));
            g.appendChild(circle);
            cumulative += arcLen;
        });
        svgEl.innerHTML = '';
        svgEl.appendChild(g);
        if (legendEl) {
            legendEl.innerHTML = '';
            data.forEach(d => {
                const li = document.createElement('li');
                li.className = 'legend-item';
                li.innerHTML = `<span class="legend-dot" style="background:${d.color}"></span>${d.label}`;
                legendEl.appendChild(li);
            });
        }
    }

    let liveUjiriRows = [];
    let liveUjiriDistrictCounts = {};
    window.ujuriAttachmentData = {};

    function getUjiriDistrictCount(feature) {
        const properties = feature.properties || {};
        const rawName = properties.DISTRICT || properties.District || properties.district || properties.NAME || properties.name || '';
        const mappedName = window.DISTRICT_NAME_MAP?.[String(rawName).toUpperCase()] || rawName;
        return liveUjiriDistrictCounts[mappedName] || 0;
    }

    function getUjiriDistrictLabel(feature) {
        const properties = feature.properties || {};
        const rawName = properties.DISTRICT || properties.District || properties.district || properties.NAME || properties.name || '';
        return window.DISTRICT_NAME_MAP?.[String(rawName).toUpperCase()] || rawName;
    }

    function getComplaintBucketColor(value) {
        if (!value) return '#E4E4E7';
        if (value >= 25) return '#c96852';
        if (value >= 11) return '#d6b84c';
        if (value >= 1) return '#5aa469';
        return '#E4E4E7';
    }

    function getUjiriDistrictColor(count) {
        return getComplaintBucketColor(count);
    }

    function refreshUjiriMapStyles() {
        if (!window.ujiriGeojsonLayer) return;

        window.ujiriGeojsonLayer.eachLayer(layer => {
            const count = getUjiriDistrictCount(layer.feature);
            const districtLabel = getUjiriDistrictLabel(layer.feature);
            layer.setStyle({
                fillColor: getUjiriDistrictColor(count),
                fillOpacity: count ? 0.85 : 0.7
            });
            layer.setTooltipContent(`${districtLabel}<br>उजुरी संख्या: ${ujiriNumber(count)}`);
            layer.setPopupContent(`<strong>${districtLabel}</strong><br>उजुरी संख्या: ${ujiriNumber(count)}`);
        });
    }

    function ujiriNumber(value) {
        return String(value || 0).replace(/[0-9]/g, digit => '०१२३४५६७८९'[digit]);
    }

    function formatBsDate(value) {
        const parts = String(value || '').slice(0, 10).split('-');
        if (parts.length !== 3 || parts.some(part => !/^\d+$/.test(part))) return '-';
        return parts.join('-').replace(/[0-9]/g, digit => '०१२३४५६७८९'[digit]);
    }

    let cmCurrentPage = 1;
    let cmPageSize = 10;

    function updateUjiriPagination(rows, resetPage = false) {
        const body = document.getElementById('cmTableBody');
        const pageInfo = document.getElementById('cmPageInfo');
        const previous = document.getElementById('cmPrevPage');
        const next = document.getElementById('cmNextPage');
        if (!body) return;
        if (resetPage) cmCurrentPage = 1;
        const totalPages = Math.max(1, Math.ceil(rows.length / cmPageSize));
        cmCurrentPage = Math.min(cmCurrentPage, totalPages);
        const start = (cmCurrentPage - 1) * cmPageSize;
        Array.from(body.querySelectorAll('tr')).forEach(row => {
            row.style.display = rows.slice(start, start + cmPageSize).includes(row) ? '' : 'none';
        });
        if (pageInfo) {
            pageInfo.textContent = rows.length
                ? `पृष्ठ ${ujiriNumber(cmCurrentPage)} / ${ujiriNumber(totalPages)} — कुल ${ujiriNumber(rows.length)}`
                : 'कुनै नतिजा छैन';
        }
        if (previous) previous.disabled = cmCurrentPage <= 1;
        if (next) next.disabled = cmCurrentPage >= totalPages || !rows.length;
    }

    function updateUjiriMonthlyTrend(rows) {
        const chartBars = document.querySelectorAll('.lower-column-complaints .line-chart-sim .bar');
        if (!chartBars.length) return;
        const normalizeDigits = value => String(value || '').replace(/[०१२३४५६७८९]/g, digit => '०१२३४५६७८९'.indexOf(digit));
        const chartPeriods = [[2083, 4], [2083, 5], [2083, 6], [2083, 7], [2083, 8], [2083, 9],
            [2083, 10], [2083, 11], [2083, 12], [2084, 1], [2084, 2], [2084, 3]];
        const periodCounts = chartPeriods.map(([year, month]) => rows.filter(row => {
            const dateParts = normalizeDigits(String(row.registration_date || '').slice(0, 10)).split('-').map(Number);
            return dateParts[0] === year && dateParts[1] === month;
        }).length);
        const maxCount = Math.max(...periodCounts, 1);
        chartBars.forEach((bar, index) => {
            const count = periodCounts[index] || 0;
            bar.style.height = count ? `${Math.max(8, count / maxCount * 70)}%` : '4%';
            bar.dataset.count = ujiriNumber(count);
            bar.title = `उजुरी संख्या: ${ujiriNumber(count)}`;
            bar.onclick = () => bar.classList.toggle('is-selected');
            bar.onmouseenter = () => bar.classList.add('is-hovered');
            bar.onmouseleave = () => bar.classList.remove('is-hovered');
        });
    }

    function updateLiveUjiriDonut(svgId, legendId, counts, colors) {
        const entries = Object.entries(counts);
        const total = entries.reduce((sum, [, value]) => sum + value, 0);
        const data = entries.map(([label, value], index) => ({
            label,
            count: value,
            value: total ? (value / total) * 100 : (index === 0 ? 100 : 0),
            color: colors[index % colors.length]
        }));
        drawDonut(document.getElementById(svgId), document.getElementById(legendId), data, 70, 34);
    }

    function renderLiveUjiriTable(rows) {
        const body = document.getElementById('cmTableBody');
        const empty = document.getElementById('cmEmpty');
        const count = document.getElementById('cmRowCount');
        if (!body) return;
        body.innerHTML = rows.map(row => {
            const searchable = [row.registration_number, row.complainant_name, row.opponent_name,
                row.ministry, row.district, row.municipality, row.complaint_type, row.complaint_source,
                row.complaint_description, row.committee_decision, row.final_decision, row.remarks,
                row.assigned_department, row.attachment_files].join(' ').toLowerCase();
            const statusKey = {
                pending: 'pending',
                'काम बाँकी': 'pending',
                in_progress: 'in_progress',
                'चालु': 'in_progress',
                resolved: 'resolved',
                'फछ्रयौट': 'resolved',
                closed: 'closed',
                'बन्द': 'closed'
            }[row.status] || row.status || '';
            const statusClass = statusKey === 'resolved' || statusKey === 'closed' ? 'resolved' : 'active';
            const statusLabel = { pending: 'काम बाँकी', in_progress: 'चालु', resolved: 'फछ्रयौट', closed: 'बन्द' }[statusKey] || row.status || '-';
            const committeeDecision = row.committee_decision || '-';
            const finalDecisionType = row.final_decision_type || '-';
            const finalDecisionKey = {
                'सुझाव/निर्देशन': 'सुझाव/निर्देशन',
                'अ.दु.अ.आ.मा पठाइएको': 'अ.दु.अ.आ.मा पठाइएको',
                'सतर्क': 'सतर्क',
                'छानविन तथा कारबाही गरी जानकारी दिन लेखी पठाइएको': 'छानविन तथा कारबाही गरी जानकारी दिन लेखी पठाइएको',
                'तामेली': 'तामेली',
                'अन्य': 'अन्य'
            }[String(row.final_decision_type || '').trim()] || String(row.final_decision_type || '').trim();
            const finalDecision = row.final_decision || '-';
            const registrationDate = formatBsDate(row.registration_date);
            const decisionDate = formatBsDate(row.decision_date);
            const remarks = row.remarks || '-';
            const attachmentFiles = row.attachment_files || '-';
            window.ujuriAttachmentData[row.id] = Array.isArray(row.attachment_data) ? row.attachment_data : [];
            const attachmentActions = window.ujuriAttachmentData[row.id].map((file, index) => `
                <button type="button" class="ujuri-file-action" onclick="viewUjuriAttachment('${row.id}', ${index})" title="हेर्नुहोस्"><i class="fas fa-eye"></i></button>
                <button type="button" class="ujuri-file-action" onclick="downloadUjuriAttachment('${row.id}', ${index})" title="डाउनलोड"><i class="fas fa-download"></i></button>`).join('');
            return `<tr data-id="${row.id || ''}" data-name="${searchable}" data-registration-date="${row.registration_date || ''}" data-created-at="${row.created_at || ''}" data-province="${row.province || ''}" data-district="${row.district || ''}" data-municipality="${row.municipality || ''}" data-status="${statusKey.toLowerCase()}" data-ministry="${row.ministry || ''}" data-type="${row.complaint_type || ''}" data-source="${row.complaint_source || ''}" data-priority="${row.priority || ''}" data-committee-decision="${(committeeDecision === '-' ? '' : committeeDecision).replace(/"/g, '&quot;')}" data-final-decision-type="${(finalDecisionKey || '').replace(/"/g, '&quot;')}" data-final-decision="${(finalDecision === '-' ? '' : finalDecision).replace(/"/g, '&quot;')}" data-decision-date="${decisionDate === '-' ? '' : decisionDate}" data-remarks="${(remarks === '-' ? '' : remarks).replace(/"/g, '&quot;')}" data-assigned-department="${(row.assigned_department || '').replace(/"/g, '&quot;')}" data-attachment-files="${(attachmentFiles === '-' ? '' : attachmentFiles).replace(/"/g, '&quot;')}">
                <td><input type="checkbox"></td>
                <td class="mono">${row.registration_number || '-'}</td>
                <td class="mono">${registrationDate}</td>
                <td class="cm-td-name">${row.complainant_name || '-'}</td>
                <td>${row.opponent_name || '-'}</td>
                <td>${row.ministry || '-'}</td>
                <td class="cm-td-desc">${row.complaint_description || '-'}</td>
                <td>${committeeDecision}</td>
                <td>${finalDecision}</td>
                <td>${remarks}</td>
                <td>${row.assigned_department || '-'}</td>
                <td><span class="cm-status cm-status--${statusClass}">${statusLabel}</span></td>
                <td><div class="ujuri-file-actions">${attachmentActions}</div></td>
                <td class="cm-actions"><button class="icon-action icon-action--view" title="हेर्नुहोस्"><i class="fas fa-eye"></i></button><button class="icon-action icon-action--edit" title="सम्पादन"><i class="fas fa-edit"></i></button><button class="icon-action icon-action--delete" title="मेटाउनुहोस्"><i class="fas fa-trash"></i></button></td>
            </tr>`;
        }).join('');
        if (empty) empty.style.display = rows.length ? 'none' : 'block';
        if (count) count.textContent = ujiriNumber(rows.length);
        updateUjiriPagination(Array.from(body.querySelectorAll('tr')));
        initializeUjuriActionButtons();
    }

    let ujiriDataRequestId = 0;

    async function loadLiveUjiriData() {
        const requestId = ++ujiriDataRequestId;
        try {
            const fiscalYear = document.getElementById('dashboardFiscalYearSelect')?.value || 'all';
            const currentDate = window.NepaliCalendar?.getCurrentDate?.() || '';
            const fiscalFilters = { current_date: currentDate };
            if (fiscalYear !== 'all') fiscalFilters.fiscal_year = fiscalYear;
            const [entries, statistics] = await Promise.all([
                UjuriAPI.getAll(fiscalFilters),
                UjuriAPI.getStatistics(fiscalFilters)
            ]);
            if (requestId !== ujiriDataRequestId) return;
            liveUjiriRows = entries.success ? entries.data : [];
            updateUjiriMonthlyTrend(liveUjiriRows);
            liveUjiriDistrictCounts = {};
            liveUjiriRows.forEach(row => {
                if (row.district) liveUjiriDistrictCounts[row.district] = (liveUjiriDistrictCounts[row.district] || 0) + 1;
            });
            refreshUjiriMapStyles();
            const stats = statistics.success ? statistics.data : {};
            const totalUjuri = ujiriNumber(stats.total || liveUjiriRows.length);
            const previousYearUjuri = ujiriNumber(stats.previous_year_total);
            const currentYearUjuri = ujiriNumber(stats.current_year_total);
            const resolvedUjuri = ujiriNumber(stats.resolved);
            const pendingUjuri = ujiriNumber(stats.pending);
            const inProgressUjuri = ujiriNumber(stats.in_progress);
            document.getElementById('statKulUjuri').textContent = totalUjuri;
            document.getElementById('statChalauAv').textContent = currentYearUjuri;
            document.getElementById('statGatAv').textContent = previousYearUjuri;
            document.getElementById('statFachryot').textContent = resolvedUjuri;
            document.getElementById('statBaki').textContent = pendingUjuri;
            document.getElementById('statChalauUjuri').textContent = inProgressUjuri;
            document.getElementById('ujiriStatTotal').textContent = totalUjuri;
            document.getElementById('ujiriStatInProgress').textContent = inProgressUjuri;
            document.getElementById('ujiriStatResolved').textContent = resolvedUjuri;
            document.getElementById('ujiriStatPending').textContent = pendingUjuri;
            
            const totalNum = Number(stats.total) || liveUjiriRows.length || 1;
            const resolvedPerc = Math.round((Number(stats.resolved) || 0) / totalNum * 100);
            const pendingPerc = Math.round((Number(stats.pending) || 0) / totalNum * 100);
            const inProgressPerc = Math.round((Number(stats.in_progress) || 0) / totalNum * 100);
            
            const resolvedBadge = document.querySelector('.ujuri-stat-resolved .ujuri-stat-badge');
            if (resolvedBadge) resolvedBadge.textContent = ujiriNumber(resolvedPerc) + '%';
            
            const pendingBadge = document.querySelector('.ujuri-stat-pending .ujuri-stat-badge');
            if (pendingBadge) pendingBadge.textContent = ujiriNumber(pendingPerc) + '%';
            
            const activeBadge = document.querySelector('.ujuri-stat-active .ujuri-stat-badge');
            if (activeBadge) activeBadge.textContent = ujiriNumber(inProgressPerc) + '%';

            const statusTotal = Number(stats.total) || liveUjiriRows.length;
            const statusResolved = Number(stats.resolved) || 0;
            const statusPending = Number(stats.pending) || 0;
            const statusInProgress = Number(stats.in_progress) || 0;
            const inProgressEnd = statusTotal ? (statusInProgress / statusTotal) * 100 : 0;
            const resolvedEnd = statusTotal ? inProgressEnd + (statusResolved / statusTotal) * 100 : 0;
            const statusDonut = document.getElementById('ujiriStatusDonut');
            const statusDonutTotal = document.getElementById('ujiriStatusDonutTotal');
            if (statusDonut) {
                statusDonut.style.background = `conic-gradient(#28a745 0% ${inProgressEnd}%, #ffc107 ${inProgressEnd}% ${resolvedEnd}%, #fd7e14 ${resolvedEnd}% 100%)`;
                const statusCounts = [statusInProgress, statusResolved, statusPending];
                const statusSegmentEnds = [inProgressEnd, resolvedEnd, 100];
                const showStatusCount = event => {
                    if (!statusDonutTotal) return;
                    const bounds = statusDonut.getBoundingClientRect();
                    const x = event.clientX - (bounds.left + bounds.width / 2);
                    const y = event.clientY - (bounds.top + bounds.height / 2);
                    let angle = Math.atan2(y, x) * 180 / Math.PI + 90;
                    if (angle < 0) angle += 360;
                    const percentage = angle / 360 * 100;
                    const segmentIndex = statusSegmentEnds.findIndex(end => percentage <= end);
                    if (segmentIndex >= 0) statusDonutTotal.textContent = ujiriNumber(statusCounts[segmentIndex]);
                };
                statusDonut.onmousemove = showStatusCount;
                statusDonut.onclick = showStatusCount;
                statusDonut.onmouseleave = () => statusDonutTotal.textContent = ujiriNumber(statusTotal);
            }
            if (statusDonutTotal) statusDonutTotal.textContent = ujiriNumber(statusTotal);

            const decisionCounts = {
                tameli: 0,
                suggestion: 0,
                alert: 0,
                ciaa: 0,
                other: 0
            };
            liveUjiriRows.forEach(row => {
                const decisionType = String(row.final_decision_type || '').trim();
                if (decisionType === 'तामेली') decisionCounts.tameli++;
                else if (decisionType === 'सुझाव/निर्देशन') decisionCounts.suggestion++;
                else if (decisionType === 'सतर्क') decisionCounts.alert++;
                else if (decisionType === 'अ.दु.अ.आ.मा पठाइएको' || decisionType === 'अ.दु.अ.आ. पठाइएको') decisionCounts.ciaa++;
                else if (decisionType) decisionCounts.other++;
            });
            const decisionCountElements = {};
            document.querySelectorAll('.compact-row').forEach(row => {
                const label = row.querySelector('span:first-child')?.textContent.trim();
                if (label) decisionCountElements[label] = row.querySelector('span:last-child');
            });
            decisionCountElements['तामेली'].textContent = ujiriNumber(decisionCounts.tameli);
            decisionCountElements['सुझाव/निर्देशन'].textContent = ujiriNumber(decisionCounts.suggestion);
            decisionCountElements['सतर्क'].textContent = ujiriNumber(decisionCounts.alert);
            decisionCountElements['अ.दु.अ.आ. पठाइएको'].textContent = ujiriNumber(decisionCounts.ciaa);
            decisionCountElements['अन्य'].textContent = ujiriNumber(decisionCounts.other);

            const provinceCounts = {};
            const ministryCounts = {};
            liveUjiriRows.forEach(row => {
                if (row.province) provinceCounts[row.province] = (provinceCounts[row.province] || 0) + 1;
                if (row.ministry) ministryCounts[row.ministry] = (ministryCounts[row.ministry] || 0) + 1;
            });
            const ministryFilter = document.getElementById('cmFilterMinistry');
            if (ministryFilter) {
                ministryFilter.innerHTML = '<option value="">मन्त्रालय/निकाय (सबै)</option>';
                getNepalMinistries().forEach(ministry => {
                    const option = document.createElement('option');
                    option.value = ministry;
                    option.textContent = ministry;
                    ministryFilter.appendChild(option);
                });
            }
            updateLiveUjiriDonut('donutProvince', 'legendProvince', provinceCounts, ['rgb(47, 111, 219)', 'rgb(253, 126, 20)', 'rgb(224, 167, 44)', 'rgb(39, 174, 96)', 'rgb(40, 167, 69)', '#7C3AED', '#E94E77']);
            updateLiveUjiriDonut('donutMinistry', 'legendMinistry', ministryCounts, ['#7C3AED', '#EA8C1E', '#E94E77', '#D9A404', '#0E9488', '#2563EB', '#F43F5E']);
            renderLiveUjiriTable(liveUjiriRows);
        } catch (error) {
            console.error('Error loading ujiri details:', error);
            renderLiveUjiriTable([]);
        }
    }

    window.loadLiveUjiriData = loadLiveUjiriData;
    const fiscalYearSelect = document.getElementById('dashboardFiscalYearSelect');
    if (fiscalYearSelect) {
        fiscalYearSelect.addEventListener('change', loadLiveUjiriData);
    }
    loadLiveUjiriData();

    drawDonut(document.getElementById('donutProvince'), document.getElementById('legendProvince'), [
        { label: 'बागमती प्रदेश', value: 38, color: '#1D4ED8' },
        { label: 'मधेश प्रदेश', value: 28, color: '#DC2626' },
        { label: 'गण्डकी प्रदेश', value: 20, color: '#D9A404' },
        { label: 'सुदूरपश्चिम प्रदेश', value: 14, color: '#2F7B4F' }
    ], 70, 34);

    drawDonut(document.getElementById('donutMinistry'), document.getElementById('legendMinistry'), [
        { label: 'परराष्ट्र मन्त्रालय', value: 26, color: '#7C3AED' },
        { label: 'ऊर्जा, जलस्रोत तथा सिँचाइ मन्त्रालय', value: 20, color: '#EA8C1E' },
        { label: 'स्वास्थ्य तथा खाद्य सुरक्षा मन्त्रालय', value: 16, color: '#E94E77' },
        { label: 'अर्थ मन्त्रालय', value: 12, color: '#D9A404' },
        { label: 'गृह मन्त्रालय', value: 10, color: '#0E9488' },
        { label: 'पूर्वाधार विकास मन्त्रालय', value: 9, color: '#2563EB' },
        { label: 'युवा, श्रम तथा रोजगार मन्त्रालय', value: 7, color: '#F43F5E' }
    ], 70, 34);

    // Toggle map panel
    const cmToggleMapBtn = document.getElementById('cmToggleMapBtn');
    const cmPanels = document.getElementById('cmPanels');
    const cmToggleMapLabel = document.getElementById('cmToggleMapLabel');
    if (cmToggleMapBtn) {
        cmToggleMapBtn.addEventListener('click', () => {
            const hidden = cmPanels.classList.toggle('is-collapsed');
            cmToggleMapLabel.textContent = hidden ? 'नक्सा देखाउनुहोस्' : 'नक्सा लुकाउनुहोस्';
        });
    }

    // Office Monitoring Detail: toggle map + chart
    const omDetailToggleMapBtn = document.getElementById('omDetailToggleMapBtn');
    const omDetailPanels = document.getElementById('omDetailPanels');
    if (omDetailToggleMapBtn && omDetailPanels) {
        omDetailToggleMapBtn.addEventListener('click', function() {
            const hidden = omDetailPanels.classList.toggle('is-collapsed');
            this.innerHTML = hidden
                ? '<i class="fas fa-eye"></i> नक्सा देखाउनुहोस्'
                : '<i class="fas fa-eye-slash"></i> नक्सा लुकाउनुहोस्';
            if (!hidden) {
                setTimeout(function() {
                    if (window.omDetailMonitoredMapInstance) window.omDetailMonitoredMapInstance.invalidateSize();
                    if (window.omDetailProblemMapInstance) window.omDetailProblemMapInstance.invalidateSize();
                }, 200);
            }
        });
    }

    // Dress Time Detail: toggle map + chart
    const dtdSaveMapBtn = document.getElementById('dtdSaveMapBtn');
    const dtdPanels = document.getElementById('dtdPanels');
    if (dtdSaveMapBtn && dtdPanels) {
        dtdSaveMapBtn.addEventListener('click', function() {
            const hidden = dtdPanels.classList.toggle('is-collapsed');
            this.innerHTML = hidden
                ? '<i class="fa-solid fa-eye"></i> नक्सा देखाउनुहोस्'
                : '<i class="fa-solid fa-eye-slash"></i> नक्सा लुकाउनुहोस्';
            if (!hidden) {
                setTimeout(function() {
                    if (window.dtdMonitoredMapInstance) window.dtdMonitoredMapInstance.invalidateSize();
                    if (window.dtdViolationMapInstance) window.dtdViolationMapInstance.invalidateSize();
                }, 200);
            }
        });
    }

    (function fillOmAndDtdDateFilters() {
        const nDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
        const toNN = function(n) {
            return String(n).split('').map(function(d) { return nDigits[d] || d; }).join('');
        };
        const months = ['बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत'];
        function fill(yId, mId, dId) {
            const ys = document.getElementById(yId);
            const ms = document.getElementById(mId);
            const ds = document.getElementById(dId);
            if (ys) {
                ys.innerHTML = '<option value="">साल</option>';
                for (let y = 2080; y <= 2090; y++) {
                    const opt = document.createElement('option');
                    opt.value = toNN(y);
                    opt.textContent = toNN(y);
                    ys.appendChild(opt);
                }
            }
            if (ms) {
                ms.innerHTML = '<option value="">महिना</option>';
                months.forEach(function(m) {
                    const opt = document.createElement('option');
                    opt.value = m;
                    opt.textContent = m;
                    ms.appendChild(opt);
                });
            }
            if (ds) {
                ds.innerHTML = '<option value="">गते</option>';
                for (let d = 1; d <= 32; d++) {
                    const opt = document.createElement('option');
                    opt.value = toNN(d);
                    opt.textContent = toNN(d);
                    ds.appendChild(opt);
                }
            }
        }
        fill('omDetailFDateFromYear', 'omDetailFDateFromMonth', 'omDetailFDateFromDay');
        fill('omDetailFDateToYear', 'omDetailFDateToMonth', 'omDetailFDateToDay');
        fill('dtdFDateFromYear', 'dtdFDateFromMonth', 'dtdFDateFromDay');
        fill('dtdFDateToYear', 'dtdFDateToMonth', 'dtdFDateToDay');
    })();

    const omDetailFiltersToggle = document.getElementById('omDetailFiltersToggle');
    const omDetailFiltersBody = document.getElementById('omDetailFiltersBody');
    if (omDetailFiltersToggle && omDetailFiltersBody) {
        omDetailFiltersToggle.addEventListener('click', function() {
            omDetailFiltersBody.classList.toggle('hidden');
            this.classList.toggle('collapsed');
            const chevron = document.getElementById('omDetailFilterChevron');
            if (chevron) {
                chevron.style.transform = omDetailFiltersBody.classList.contains('hidden') ? 'rotate(-90deg)' : '';
            }
        });
    }

    const dtdFiltersToggle = document.getElementById('dtdFiltersToggle');
    const dtdFiltersBody = document.getElementById('dtdFiltersBody');
    if (dtdFiltersToggle && dtdFiltersBody) {
        dtdFiltersToggle.addEventListener('click', function() {
            dtdFiltersBody.classList.toggle('hidden');
            this.classList.toggle('collapsed');
            const chevron = this.querySelector('.dtd-chev');
            if (chevron) {
                chevron.style.transform = dtdFiltersBody.classList.contains('hidden') ? 'rotate(-90deg)' : '';
            }
        });
    }

    // Toggle filter panel
    const cmFilterToggle = document.getElementById('cmFilterToggle');
    const cmFiltersBody = document.getElementById('cmFiltersBody');
    if (cmFilterToggle) {
        cmFilterToggle.addEventListener('click', () => {
            cmFilterToggle.classList.toggle('is-collapsed');
            cmFiltersBody.classList.toggle('is-collapsed');
        });
    }

    // Remove filter chips
    document.querySelectorAll('#cmChips [data-remove]').forEach(btn => {
        btn.addEventListener('click', () => btn.closest('.chip-removable').remove());
    });

    // Table filtering
    const cmTableBody = document.getElementById('cmTableBody');
    const cmEmpty = document.getElementById('cmEmpty');
    const cmRowCount = document.getElementById('cmRowCount');
    const cmMainSearch = document.getElementById('cmMainSearch');
    const cmFilterSearch = document.getElementById('cmFilterSearch');
    const cmFilterDateField = document.getElementById('cmFilterDateField');
    const cmFilterSortOrder = document.getElementById('cmFilterSortOrder');
    const cmPageSizeSelect = document.getElementById('cmPageSize');
    const cmPrevPage = document.getElementById('cmPrevPage');
    const cmNextPage = document.getElementById('cmNextPage');
    const valueOf = id => (document.getElementById(id)?.value || '').trim();

    function cmApplyFilters(resetPage = true) {
        if (!cmTableBody) return;
        const q1 = (cmMainSearch?.value || '').trim();
        const q2 = (cmFilterSearch?.value || '').trim();
        const q = (q1 || q2).toLowerCase();
        const dateField = cmFilterDateField?.value || 'registration_date';
        const sortOrder = cmFilterSortOrder?.value || 'desc';
        const province = valueOf('cmFilterProvince').replace(/\s*प्रदेश$/, '').toLowerCase();
        const district = valueOf('cmFilterDistrict').toLowerCase();
        const municipality = valueOf('cmFilterMunicipality').toLowerCase();
        const status = valueOf('cmFilterStatus').toLowerCase();
        const finalDecision = valueOf('cmFilterFinalDecision').toLowerCase();
        const department = valueOf('cmFilterDepartment').toLowerCase();
        const ministry = valueOf('cmFilterMinistry').toLowerCase();
        const type = valueOf('cmFilterComplaintType').toLowerCase();
        const source = valueOf('cmFilterComplaintSource').toLowerCase();
        const priority = valueOf('cmFilterPriority').toLowerCase();
        const fromDate = buildBsFilterDate('cmFDateFromYear', 'cmFDateFromMonth', 'cmFDateFromDay');
        const toDate = buildBsFilterDate('cmFDateToYear', 'cmFDateToMonth', 'cmFDateToDay');
        const fromChip = document.querySelector('#cmChips [data-chip="from"]');
        const toChip = document.querySelector('#cmChips [data-chip="to"]');
        const formatSelectedDate = (yearId, monthId, dayId) => {
            const year = valueOf(yearId);
            const month = valueOf(monthId);
            const day = valueOf(dayId);
            return year && month && day ? `${year}-${month}-${day}` : '-';
        };
        if (fromChip) fromChip.firstChild.textContent = `देखि: ${formatSelectedDate('cmFDateFromYear', 'cmFDateFromMonth', 'cmFDateFromDay')} `;
        if (toChip) toChip.firstChild.textContent = `सम्म: ${formatSelectedDate('cmFDateToYear', 'cmFDateToMonth', 'cmFDateToDay')} `;
        let visible = 0;
        const rows = Array.from(cmTableBody.querySelectorAll('tr'));
        const matchingRows = [];
        rows.forEach(row => {
            const rowDate = row.dataset.registrationDate || '';
            const selectedDate = dateField === 'created_at'
                ? (row.dataset.createdAt || '').slice(0, 10)
                : rowDate;
            const show = (!q || row.dataset.name.indexOf(q) !== -1) &&
                (!fromDate || selectedDate >= fromDate) &&
                (!toDate || selectedDate <= toDate) &&
                (!province || row.dataset.province.toLowerCase() === province) &&
                (!district || row.dataset.district.toLowerCase() === district) &&
                (!municipality || row.dataset.municipality.toLowerCase() === municipality) &&
                (!status || row.dataset.status.toLowerCase() === status) &&
                (!finalDecision || row.dataset.finalDecisionType.toLowerCase() === finalDecision) &&
                (!department || row.dataset.assignedDepartment.toLowerCase() === department) &&
                (!ministry || row.dataset.ministry.toLowerCase() === ministry) &&
                (!type || row.dataset.type.toLowerCase() === type) &&
                (!source || row.dataset.source.toLowerCase() === source) &&
                (!priority || row.dataset.priority.toLowerCase() === priority);
            row.style.display = show ? '' : 'none';
            if (show) matchingRows.push(row);
        });
        matchingRows.sort((a, b) => {
            const aDate = dateField === 'created_at' ? (a.dataset.createdAt || '') : (a.dataset.registrationDate || '');
            const bDate = dateField === 'created_at' ? (b.dataset.createdAt || '') : (b.dataset.registrationDate || '');
            return (aDate.localeCompare(bDate) || a.dataset.id.localeCompare(b.dataset.id)) * (sortOrder === 'asc' ? 1 : -1);
        });
        matchingRows.forEach(row => cmTableBody.appendChild(row));
        visible = matchingRows.length;
        cmEmpty.style.display = visible === 0 ? 'block' : 'none';
        cmRowCount.textContent = visible;
        updateUjiriPagination(matchingRows, resetPage);
    }

    function buildBsFilterDate(yearId, monthId, dayId) {
        const year = convertNepaliToEnglishDigits(valueOf(yearId));
        const monthValue = valueOf(monthId);
        const month = /^\d+$/.test(monthValue) ? Number(monthValue) : convertNepaliMonthToNumber(monthValue);
        const day = convertNepaliToEnglishDigits(valueOf(dayId));
        return year && month && day ? `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
    }

    if (cmMainSearch) cmMainSearch.addEventListener('input', cmApplyFilters);
    if (cmFilterSearch) cmFilterSearch.addEventListener('input', cmApplyFilters);
    [ 'cmFilterDateField', 'cmFilterSortOrder', 'cmFilterProvince', 'cmFilterDistrict', 'cmFilterMunicipality', 'cmFilterStatus', 'cmFilterFinalDecision', 'cmFilterDepartment', 'cmFilterMinistry', 'cmFilterComplaintType', 'cmFilterComplaintSource', 'cmFilterPriority', 'cmFDateFromYear', 'cmFDateFromMonth', 'cmFDateFromDay', 'cmFDateToYear', 'cmFDateToMonth', 'cmFDateToDay'].forEach(id => {
        const filter = document.getElementById(id);
        if (filter) filter.addEventListener('change', cmApplyFilters);
    });
    const cmMainSearchBtn = document.getElementById('cmMainSearchBtn');
    const cmSearchBtn = document.getElementById('cmSearchBtn');
    if (cmMainSearchBtn) cmMainSearchBtn.addEventListener('click', cmApplyFilters);
    if (cmSearchBtn) cmSearchBtn.addEventListener('click', cmApplyFilters);

    if (cmPageSizeSelect) {
        cmPageSizeSelect.addEventListener('change', () => {
            cmPageSize = Number(cmPageSizeSelect.value) || 10;
            cmApplyFilters();
        });
    }
    if (cmPrevPage) {
        cmPrevPage.addEventListener('click', () => {
            if (cmCurrentPage > 1) {
                cmCurrentPage--;
                cmApplyFilters(false);
            }
        });
    }
    if (cmNextPage) {
        cmNextPage.addEventListener('click', () => {
            cmCurrentPage++;
            cmApplyFilters(false);
        });
    }

    // Reset filters
    const cmResetBtn = document.getElementById('cmResetBtn');
    if (cmResetBtn) {
        cmResetBtn.addEventListener('click', () => {
            if (cmMainSearch) cmMainSearch.value = '';
            if (cmFilterSearch) cmFilterSearch.value = '';
            if (cmFilterDateField) cmFilterDateField.value = 'registration_date';
            if (cmFilterSortOrder) cmFilterSortOrder.value = 'desc';
            ['cmFilterProvince', 'cmFilterDistrict', 'cmFilterMunicipality', 'cmFilterStatus', 'cmFilterFinalDecision', 'cmFilterDepartment', 'cmFilterMinistry', 'cmFilterComplaintType', 'cmFilterComplaintSource', 'cmFilterPriority', 'cmFDateFromYear', 'cmFDateFromMonth', 'cmFDateFromDay', 'cmFDateToYear', 'cmFDateToMonth', 'cmFDateToDay'].forEach(id => {
                const filter = document.getElementById(id);
                if (filter) filter.value = '';
            });
            cmApplyFilters();
        });
    }

    // Select all checkbox
    const cmSelectAll = document.getElementById('cmSelectAll');
    const cmPdfExportBtn = document.getElementById('cmPdfExportBtn');
    const updateCmPdfCount = () => {
        if (!cmPdfExportBtn || !cmTableBody) return;
        const count = cmTableBody.querySelectorAll('tr td:first-child input[type="checkbox"]:checked').length;
        cmPdfExportBtn.innerHTML = `<i class="fas fa-file-pdf" style="color: red;"></i> PDF Export (${count})`;
    };
    if (cmPdfExportBtn) cmPdfExportBtn.addEventListener('click', window.exportSelectedUjiriToPdf);
    if (cmTableBody) {
        cmTableBody.addEventListener('change', event => {
            if (event.target.matches('td:first-child input[type="checkbox"]')) updateCmPdfCount();
        });
    }
    if (cmSelectAll) {
        cmSelectAll.addEventListener('change', () => {
            cmTableBody.querySelectorAll('tr td:first-child input[type="checkbox"]').forEach(cb => {
                const row = cb.closest('tr');
                if (row && row.style.display !== 'none') {
                    cb.checked = cmSelectAll.checked;
                }
            });
            updateCmPdfCount();
        });
    }
    updateCmPdfCount();

    // Initialize Ujiri Nepal Map
    const ujiriMapContainer = document.getElementById('ujiri-nepal-map');
    if (ujiriMapContainer && !window.ujiriMapInstance) {
        window.ujiriMapInstance = L.map('ujiri-nepal-map', {
            zoomControl: true,
            attributionControl: true,
            scrollWheelZoom: true,
            zoomSnap: 0.1
        }).setView([28.3949, 84.1240], 5.1);

        const geoJsonUrl = 'https://raw.githubusercontent.com/Acesmndr/nepal-geojson/master/generated-geojson/nepal-with-districts-acesmndr.geojson';

        fetch(geoJsonUrl)
            .then(response => response.json())
            .then(data => {
                const geojsonLayer = L.geoJSON(data, {
                    style: function(feature) {
                        const count = getUjiriDistrictCount(feature);
                        return {
                            color: '#fff',
                            weight: 1,
                            opacity: 1,
                            fillColor: getUjiriDistrictColor(count),
                            fillOpacity: count ? 0.85 : 0.7
                        };
                    },
                    onEachFeature: function(feature, layer) {
                        const districtLabel = getUjiriDistrictLabel(feature);
                        if (districtLabel) {
                            const count = getUjiriDistrictCount(feature);
                            layer.bindTooltip(`${districtLabel}<br>उजुरी संख्या: ${ujiriNumber(count)}`, { sticky: true });
                            layer.bindPopup(`<strong>${districtLabel}</strong><br>उजुरी संख्या: ${ujiriNumber(count)}`);
                        }
                    }
                }).addTo(window.ujiriMapInstance);
                window.ujiriGeojsonLayer = geojsonLayer;
                refreshUjiriMapStyles();

                try {
                    window.ujiriMapInstance.fitBounds(geojsonLayer.getBounds(), { padding: [100, 100], maxZoom: 6 });
                    window.ujiriMapInstance.invalidateSize();
                } catch(e) {}
            })
            .catch(err => {
                console.error("Error loading Ujiri Nepal map:", err);
            });
    }

    // Office Monitoring Detail Page Functionality
    function initializeOfficeMonitoringDetail() {
        // Sample data
        window.omDetailRecords = [
            { date:"२०८३-०४-२३", province:"बागमती प्रदेश", district:"सिन्धुपाल्चोक", localLevel:"इन्द्रावती", office:"झिं", monitor:"-", issue:"-", status:"planned" },
            { date:"२०८३-०४-२२", province:"गण्डकी प्रदेश", district:"तनहुँ", localLevel:"आँबुखैरेनी", office:"धम", monitor:"-", issue:"-", status:"planned" },
            { date:"२०८३-०४-२२", province:"कोशी प्रदेश", district:"झापा", localLevel:"दमक", office:"त्रत्र", monitor:"-", issue:"-", status:"planned" },
            { date:"२०८३-०४-२२", province:"कर्णाली प्रदेश", district:"जुम्ला", localLevel:"हिमा", office:"date", monitor:"-", issue:"-", status:"planned" },
            { date:"२०८३-०४-२२", province:"बागमती प्रदेश", district:"रामेछाप", localLevel:"दोरम्बा", office:"ययय", monitor:"-", issue:"-", status:"planned" },
            { date:"२०८३-०४-२२", province:"सुदूरपश्चिम प्रदेश", district:"अछाम", localLevel:"दकारी", office:"चचच", monitor:"-", issue:"-", status:"planned" }
        ];

        const omDetailProvinceColors = {
            "बागमती प्रदेश":"#294674",
            "गण्डकी प्रदेश":"#259855ab",
            "कोशी प्रदेश":"#e1b547bd",
            "कर्णाली प्रदेश":"#b03140c1",
            "सुदूरपश्चिम प्रदेश":"#7244a0b0",
            "मधेश प्रदेश":"#398ca1b5",
            "लुम्बिनी प्रदेश":"#ca7c23b3"
        };
        const omDetailProvinceOrder = Object.keys(omDetailProvinceColors);

        // Stats computation
        function omDetailComputeStats(rows) {
            const toNepaliDigits = value => String(value ?? 0).replace(/[0-9]/g, digit => '०१२३४५६७८९'[digit]);
            const provinces = new Set(rows.map(r => r.province));
            const districts = new Set(rows.map(r => r.district));
            const locals = new Set(rows.map(r => r.localLevel).filter(Boolean));
            const offices = new Set(rows.map(r => r.office).filter(Boolean));
            document.getElementById('omDetailStatTotal').textContent = toNepaliDigits(rows.length);
            document.getElementById('omDetailStatProvince').textContent = toNepaliDigits(provinces.size);
            document.getElementById('omDetailStatDistrict').textContent = toNepaliDigits(districts.size);
            document.getElementById('omDetailStatLocalLevel').textContent = toNepaliDigits(locals.size);
            document.getElementById('omDetailStatOffice').textContent = toNepaliDigits(rows.length);
        }

        // Status label
        function omDetailStatusLabel(s) {
            if (s === 'done') return { text: 'सम्पन्न', cls: 'done' };
            if (s === 'pending') return { text: 'बाँकी', cls: 'pending' };
            return { text: 'योजना', cls: 'planned' };
        }

        // Render table
        const omDetailTbody = document.getElementById('omDetailDataTableBody');
        function omDetailRenderTable(rows) {
            if (!rows.length) {
                omDetailTbody.innerHTML = '<tr class="om-detail-empty-row"><td colspan="9">कुनै डाटा फेला परेन</td></tr>';
                return;
            }
            omDetailTbody.innerHTML = rows.map((r, idx) => {
                const st = omDetailStatusLabel(r.status);
                return `<tr data-idx="${idx}">
                    <td>${r.date}</td><td>${r.province}</td><td>${r.district}</td>
                    <td>${r.localLevel}</td><td>${r.office}</td><td>${r.monitor}</td>
                    <td>${r.issue}</td>
                    <td><span class="om-detail-status-badge ${st.cls}">${st.text}</span></td>
                    <td><div class="om-detail-action-group">
                        <button class="om-detail-action-btn view" title="हेर्नुहोस्"><i class="fas fa-eye"></i></button>
                        <button class="om-detail-action-btn edit" title="सम्पादन"><i class="fas fa-pen"></i></button>
                        <button class="om-detail-action-btn delete" title="मेटाउनुहोस्"><i class="fas fa-trash"></i></button>
                    </div></td>
                </tr>`;
            }).join('');
        }

        // Table actions
        omDetailTbody.addEventListener('click', function(e) {
            const btn = e.target.closest('.om-detail-action-btn');
            if (!btn) return;
            const tr = e.target.closest('tr');
            const idx = tr ? tr.dataset.idx : null;
            const rec = window.omDetailRecords[idx];
            if (!rec) return;
            if (btn.classList.contains('view')) {
                alert(`अनुगमन विवरण:\nमिति: ${rec.date}\nप्रदेश: ${rec.province}\nजिल्ला: ${rec.district}\nस्थानीय तह: ${rec.localLevel}\nकार्यालय: ${rec.office}`);
            } else if (btn.classList.contains('edit')) {
                alert(`"${rec.office}" सम्पादन फारम खुल्नेछ।`);
            } else if (btn.classList.contains('delete')) {
                if (confirm('के तपाईं यो विवरण मेटाउन चाहनुहुन्छ?')) {
                    window.omDetailRecords.splice(idx, 1);
                    omDetailRenderTable(window.omDetailRecords);
                    omDetailComputeStats(window.omDetailRecords);
                }
            }
        });

        // Donut chart
        const omDetailCounts = {};
        omDetailProvinceOrder.forEach(p => omDetailCounts[p] = 0);
        window.omDetailRecords.forEach(r => { if (omDetailCounts[r.province] !== undefined) omDetailCounts[r.province]++; });
        const omDetailLabels = omDetailProvinceOrder.filter(p => omDetailCounts[p] > 0);
        const omDetailData = omDetailLabels.map(p => omDetailCounts[p]);
        const omDetailColors = omDetailLabels.map(p => omDetailProvinceColors[p]);

        new Chart(document.getElementById('omDetailProvinceDonut'), {
            type: 'doughnut',
            data: { labels: omDetailLabels, datasets: [{ data: omDetailData.length ? omDetailData : [1], backgroundColor: omDetailColors.length ? omDetailColors : ['#dce2ec'], borderWidth: 3, borderColor: '#fff' }] },
            options: { cutout: '55%', plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: true }
        });

        const omDetailLegendEl = document.getElementById('omDetailDonutLegend');
        omDetailLegendEl.innerHTML = omDetailProvinceOrder.map(p =>
            `<li class="legend-item"><span class="legend-dot" style="background:${omDetailProvinceColors[p]}"></span>${p}</li>`
        ).join('');

        // Don't initialize maps here - they will be initialized when page is shown

        // Filter dropdowns
        const omDetailFProvince = document.getElementById('omDetailFProvince');
        const omDetailFDistrict = document.getElementById('omDetailFDistrict');
        const omDetailFLocal = document.getElementById('omDetailFLocalLevel');

        [...new Set(window.omDetailRecords.map(r => r.province))].forEach(p => { const o = document.createElement('option'); o.value = p; o.textContent = p; omDetailFProvince.appendChild(o); });
        [...new Set(window.omDetailRecords.map(r => r.district))].forEach(d => { const o = document.createElement('option'); o.value = d; o.textContent = d; omDetailFDistrict.appendChild(o); });
        [...new Set(window.omDetailRecords.map(r => r.localLevel))].forEach(l => { const o = document.createElement('option'); o.value = l; o.textContent = l; omDetailFLocal.appendChild(o); });

        // Populate Nepali date dropdowns using global wrapper
        if (window.setupNepaliDateDropdowns) {
            window.setupNepaliDateDropdowns('omDetailFDateFromYear', 'omDetailFDateFromMonth', 'omDetailFDateFromDay', {y: 'वर्ष', m: 'महिना', d: 'दिन'});
            window.setupNepaliDateDropdowns('omDetailFDateToYear', 'omDetailFDateToMonth', 'omDetailFDateToDay', {y: 'वर्ष', m: 'महिना', d: 'दिन'});
            window.setupNepaliDateDropdowns('dtdFDateFromYear', 'dtdFDateFromMonth', 'dtdFDateFromDay', {y: 'वर्ष', m: 'महिना', d: 'दिन'});
            window.setupNepaliDateDropdowns('dtdFDateToYear', 'dtdFDateToMonth', 'dtdFDateToDay', {y: 'वर्ष', m: 'महिना', d: 'दिन'});
            // Populate complaint management filter date dropdowns
            window.setupNepaliDateDropdowns('cmFDateFromYear', 'cmFDateFromMonth', 'cmFDateFromDay', {y: 'वर्ष', m: 'महिना', d: 'दिन'});
            window.setupNepaliDateDropdowns('cmFDateToYear', 'cmFDateToMonth', 'cmFDateToDay', {y: 'वर्ष', m: 'महिना', d: 'दिन'});
            ['cmFDateFromYear', 'cmFDateFromMonth', 'cmFDateFromDay', 'cmFDateToYear', 'cmFDateToMonth', 'cmFDateToDay'].forEach(function(id) {
                const filter = document.getElementById(id);
                if (filter) filter.value = '';
            });
        }

        // Filters toggle
        const dtdFiltersToggle = document.getElementById('dtdFiltersToggle');
        const dtdFiltersBody = document.getElementById('dtdFiltersBody');
        dtdFiltersToggle.addEventListener('click', function(){
            dtdFiltersBody.classList.toggle('hidden');
            this.classList.toggle('collapsed');
        });

        // Apply filters
        function dtdApplyFilters(){
            const dateFromYear = document.getElementById('dtdFDateFromYear').value;
            const dateFromMonth = document.getElementById('dtdFDateFromMonth').value;
            const dateFromDay = document.getElementById('dtdFDateFromDay').value;
            const dateToYear = document.getElementById('dtdFDateToYear').value;
            const dateToMonth = document.getElementById('dtdFDateToMonth').value;
            const dateToDay = document.getElementById('dtdFDateToDay').value;
            const province = dtdFProvince.value;
            const district = dtdFDistrict.value;
            const localLevel = dtdFLocalLevel.value;
            const office = document.getElementById('dtdFOffice').value.trim().toLowerCase();
            const violationType = document.getElementById('dtdFViolationType').value;
            const employee = document.getElementById('dtdFEmployee').value.trim().toLowerCase();

            const filtered = window.dtdRecords.filter(r => {
                // Parse record date (assuming format: YYYY-MM-DD)
                const recordDateParts = r.date.split('-');
                if(recordDateParts.length === 3) {
                    const recordYear = recordDateParts[0];
                    const recordMonth = recordDateParts[1];
                    const recordDay = recordDateParts[2];

                    // Filter by date from
                    if(dateFromYear && recordYear < dateFromYear) return false;
                    if(dateFromYear && recordYear === dateFromYear && dateFromMonth && recordMonth < dateFromMonth) return false;
                    if(dateFromYear && recordYear === dateFromYear && dateFromMonth && recordMonth === dateFromMonth && dateFromDay && recordDay < dateFromDay) return false;

                    // Filter by date to
                    if(dateToYear && recordYear > dateToYear) return false;
                    if(dateToYear && recordYear === dateToYear && dateToMonth && recordMonth > dateToMonth) return false;
                    if(dateToYear && recordYear === dateToYear && dateToMonth && recordMonth === dateToMonth && dateToDay && recordDay > dateToDay) return false;
                }

                if(province && r.province !== province) return false;
                if(district && r.district !== district) return false;
                if(localLevel && r.localLevel !== localLevel) return false;
                if(office && !r.office.toLowerCase().includes(office)) return false;
                if(violationType === 'time' && !(r.timeViol > 0)) return false;
                if(violationType === 'dress' && !(r.dressViol > 0)) return false;
                if(employee && !(r.monitor || '').toLowerCase().includes(employee)) return false;
                return true;
            });
            dtdRenderTable(filtered);
        }

        document.getElementById('dtdApplyFilterBtn').addEventListener('click', dtdApplyFilters);
        document.getElementById('dtdResetFilterBtn').addEventListener('click', function(){
            document.getElementById('dtdFDateFromYear').value = '';
            document.getElementById('dtdFDateFromMonth').value = '';
            document.getElementById('dtdFDateFromDay').value = '';
            document.getElementById('dtdFDateToYear').value = '';
            document.getElementById('dtdFDateToMonth').value = '';
            document.getElementById('dtdFDateToDay').value = '';
            dtdFProvince.value = ''; dtdFDistrict.value = ''; dtdFLocalLevel.value = '';
            document.getElementById('dtdFOffice').value = '';
            document.getElementById('dtdFViolationType').value = '';
            document.getElementById('dtdFEmployee').value = '';
            dtdRenderTable(window.dtdRecords);
        });
        document.getElementById('dtdRefreshBtn').addEventListener('click', function(){
            dtdRenderTable(window.dtdRecords);
            dtdComputeStats(window.dtdRecords);
        });

        // Top search
        document.getElementById('dtdSearchBtn').addEventListener('click', function(){
            const q = document.getElementById('dtdTopSearchInput').value.trim().toLowerCase();
            if(!q){ dtdRenderTable(window.dtdRecords); return; }
            const filtered = window.dtdRecords.filter(r =>
                Object.values(r).some(v => String(v).toLowerCase().includes(q))
            );
            dtdRenderTable(filtered);
        });
        document.getElementById('dtdMicBtn').addEventListener('click', function(){
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            if(!SR){ alert('यो ब्राउजरमा भ्वाइस खोज उपलब्ध छैन।'); return; }
            const recognition = new SR();
            recognition.lang = 'ne-NP';
            recognition.start();
            recognition.onresult = (e) => {
                document.getElementById('dtdTopSearchInput').value = e.results[0][0].transcript;
            };
        });

    }
};

// Office Monitoring Detail Map Functions (global scope - outside DOMContentLoaded)
async function omDetailLoadNepalGeo() {
    const omDetailGeojsonUrls = [
        'https://raw.githubusercontent.com/Acesmndr/nepal-geojson/master/generated-geojson/nepal-with-districts-acesmndr.geojson',
        'https://raw.githubusercontent.com/Code4Nepal/nepalmap/master/data/districts.geojson'
    ];
    for (const url of omDetailGeojsonUrls) {
        try { const resp = await fetch(url); if (!resp.ok) continue; const data = await resp.json(); if (data?.features?.length) return data; } catch (e) {}
    }
    return null;
}

function omDetailDistrictName(feature) {
    const p = feature.properties || {};
    const raw = p.DISTRICT || p.District || p.district || p.NAME || p.name || p.NAME_1 || p.name_1 || '';
    const name = String(raw || '').trim();
    if (!name) return '';

    const mapName = window.DISTRICT_NAME_MAP && (window.DISTRICT_NAME_MAP[name] || window.DISTRICT_NAME_MAP[name.toUpperCase()]);
    if (mapName) return mapName;

    if (window.nepalData && window.nepalData.DISTRICTS) {
        const districtNames = Object.values(window.nepalData.DISTRICTS).flat();
        const normalized = name.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
        const matches = districtNames.find(d => {
            const district = String(d || '').trim();
            return district === normalized || district === name || district.toLowerCase() === normalized.toLowerCase();
        });
        if (matches) return matches;
    }

    return name;
}

function omDetailInitMap(containerId, mapType) {
    const map = L.map(containerId, { zoomControl: false, attributionControl: false, scrollWheelZoom: false }).setView([28.0, 84.0], 6.2);
    map.setMaxBounds([[26.2, 80.0], [30.5, 88.5]]);
    map.options.maxBoundsViscosity = 1.0;
    const mapCanvas = map.getContainer();
    if (mapCanvas) {
        mapCanvas.style.background = '#929762';
    }

    omDetailLoadNepalGeo().then(geo => {
        if (!geo) return;

        const districtNames = new Set(
            Object.values(window.nepalData?.DISTRICTS || {}).flat().filter(Boolean).map(d => String(d).trim())
        );

        const districtFeatures = (geo.features || []).filter(feature => {
            const name = omDetailDistrictName(feature);
            return name && districtNames.has(name);
        });

        if (!districtFeatures.length) return;

        const normalizeDistrictName = value => String(value || '')
            .replace(/[_-]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();

        // Calculate district data based on map type
        const districtData = {};
        (window.omDetailMapRecords || window.omDetailRecords || []).forEach(r => {
            const district = r.district;
            const districtKey = normalizeDistrictName(district);
            if (!districtKey || districtKey === '-') return;
            if (!districtData[districtKey]) {
                districtData[districtKey] = { count: 0, hasProblem: false };
            }
            districtData[districtKey].count++;
            if (r.issue && r.issue !== '-') {
                districtData[districtKey].hasProblem = true;
            }
        });

        const layer = L.geoJSON({ type: 'FeatureCollection', features: districtFeatures }, {
            style: function(feature) {
                const name = omDetailDistrictName(feature);
                const data = districtData[normalizeDistrictName(name)];
                let fillColor = '#edf2f7'; // light neutral, high contrast against pale canvas

                if (mapType === 'monitored') {
                    // Color based on monitoring count
                    if (data && data.count > 0) {
                        if (data.count >= 3) fillColor = '#d93025'; // strong red for high count
                        else if (data.count >= 2) fillColor = '#f59e0b'; // amber for medium count
                        else fillColor = '#1f9d55'; // green for low count
                    }
                } else if (mapType === 'problem') {
                    // Color based on problem status
                    if (data && data.hasProblem) {
                        fillColor = '#d93025'; // strong red for districts with problems
                    } else if (data && data.count > 0) {
                        fillColor = '#1f9d55'; // green for monitored without problems
                    }
                }

                return {
                    fillColor: fillColor,
                    weight: 1.5,
                    color: '#ffffff',
                    opacity: 1,
                    fillOpacity: 0.9
                };
            },
            onEachFeature: function(feature, lyr) {
                const name = omDetailDistrictName(feature);
                const data = districtData[normalizeDistrictName(name)];
                let tooltipText = name;
                if (data) {
                    if (mapType === 'monitored') {
                        tooltipText += ` (${data.count} अनुगमन)`;
                    } else if (mapType === 'problem') {
                        tooltipText += data.hasProblem ? ' (समस्या देखिएको)' : ' (समस्या नदेखिएको)';
                    }
                }
                lyr.bindTooltip(tooltipText, { sticky: true });
            }
        }).addTo(map);
        try {
            const bounds = layer.getBounds();
            map.fitBounds(bounds, { padding: [20, 20], maxZoom: 7 });
            map.invalidateSize();
        } catch(e) {}
    });
    return map;
}

// Dress Time Detail Functions (global scope)
const dtdProvinceColors = {
    "गण्डकी प्रदेश":"#e8577a",
    "लुम्बिनी प्रदेश":"#2f9fe0",
    "बागमती प्रदेश":"#f2b705",
    "कोशी प्रदेश":"#27ae60",
    "मधेश प्रदेश":"#2b8ca3",
    "कर्णाली प्रदेश":"#7a5bc9",
    "सुदूरपश्चिम प्रदेश":"#e85148"
};
const dtdProvinceOrder = ["गण्डकी प्रदेश","लुम्बिनी प्रदेश","बागमती प्रदेश","कोशी प्रदेश","मधेश प्रदेश","कर्णाली प्रदेश","सुदूरपश्चिम प्रदेश"];

// Sample data for dress time detail
window.dtdRecords = [
    { date:"२०८३-०४-०६", province:"गण्डकी प्रदेश", district:"तनहुँ", localLevel:"भानु", office:"मालपोत कार्यालय", total:3, timeViol:2, dressViol:1, monitor:"मामा" },
    { date:"२०८३-०४-०६", province:"लुम्बिनी प्रदेश", district:"कपिलवस्तु", localLevel:"विजयनगर", office:"सडक कार्यालय", total:5, timeViol:3, dressViol:1, monitor:"शेर बहादुर" },
    { date:"२०८३-०४-०५", province:"बागमती प्रदेश", district:"काठमाडौं", localLevel:"कीर्तिपुर", office:"मालपोत कार्यालय", total:4, timeViol:3, dressViol:1, monitor:"कृष्ण प्रसाद" }
];

function dtdComputeStats(rows) {
    document.getElementById('dtdStatTotal').textContent = rows.length;
    document.getElementById('dtdStatThisMonth').textContent = 0;
    document.getElementById('dtdStatTimeViolation').textContent = rows.reduce((s,r)=>s+(r.timeViol>0?1:0),0);
    document.getElementById('dtdStatDressViolation').textContent = rows.reduce((s,r)=>s+(r.dressViol>0?1:0),0);
    document.getElementById('dtdStatActionRecommended').textContent = 0;
}

function dtdRenderTable(rows) {
    const tableBody = document.getElementById('dtdDataTableBody');
    if(!rows.length){
        tableBody.innerHTML = '<tr class="dtd-empty-row"><td colspan="10">कुनै डाटा फेला परेन</td></tr>';
        return;
    }
    tableBody.innerHTML = rows.map((r, idx) => `
        <tr data-idx="${idx}">
            <td>${r.date}</td>
            <td>${r.province}</td>
            <td>${r.district}</td>
            <td>${r.localLevel}</td>
            <td>${r.office}</td>
            <td>${r.total}</td>
            <td><span class="dtd-badge ${r.timeViol>0 ? 'dtd-badge-warn':'dtd-badge-ok'}">${r.timeViol}</span></td>
            <td><span class="dtd-badge ${r.dressViol>0 ? 'dtd-badge-danger':'dtd-badge-ok'}">${r.dressViol}</span></td>
            <td>${r.monitor}</td>
            <td>
                <div class="dtd-row-actions">
                    <button class="dtd-act-btn view" title="हेर्नुहोस्"><i class="fa-solid fa-eye"></i></button>
                    <button class="dtd-act-btn edit" title="सम्पादन गर्नुहोस्"><i class="fa-solid fa-pen"></i></button>
                    <button class="dtd-act-btn delete" title="मेटाउनुहोस्"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        </tr>`).join('');
}

function dtdLoadNepalGeojson() {
    const geojsonSources = [
        'https://raw.githubusercontent.com/Acesmndr/nepal-geojson/master/generated-geojson/nepal-with-districts-acesmndr.geojson',
        'https://raw.githubusercontent.com/Code4Nepal/nepalmap/master/data/districts.geojson',
        'https://raw.githubusercontent.com/simtok/nepal_geojson/master/nepal_districts.geojson'
    ];
    return (async () => {
        for(const url of geojsonSources){
            try{
                const res = await fetch(url);
                if(!res.ok) continue;
                const data = await res.json();
                if(data && data.features && data.features.length) return data;
            }catch(e){ console.warn('geojson load failed', url, e); }
        }
        return null;
    })();
}

function dtdDistrictNameOf(feature) {
    const p = feature.properties || {};
    const englishName = p.DISTRICT || p.District || p.district || p.NAME || p.name || '';
    const nepaliName = window.DISTRICT_NAME_MAP && window.DISTRICT_NAME_MAP[englishName.toUpperCase()] ? window.DISTRICT_NAME_MAP[englishName.toUpperCase()] : englishName;
    return nepaliName;
}

function dtdInitHighlightMap(containerId, highlightSet, highlightColor, baseFillColor, baseFillOpacity) {
    // Check if map is already initialized for this container
    if (window.dtdHighlightMaps && window.dtdHighlightMaps[containerId]) {
        const existingMap = window.dtdHighlightMaps[containerId];
        dtdUpdateHighlightMap(existingMap, highlightSet, highlightColor, baseFillColor, baseFillOpacity);
        return existingMap;
    }

    const map = L.map(containerId, { zoomControl:true, attributionControl:false, scrollWheelZoom:false }).setView([28.3949, 84.1240], 6.3);

    // Store the map instance
    if (!window.dtdHighlightMaps) {
        window.dtdHighlightMaps = {};
    }
    window.dtdHighlightMaps[containerId] = map;

    dtdLoadNepalGeojson().then(geo => {
        if(!geo) return;
        const layer = L.geoJSON(geo, {
            style: function(feature){
                const name = dtdDistrictNameOf(feature);
                const isHighlighted = [...highlightSet].some(h => name && name.indexOf(h) !== -1);
                return {
                    fillColor: isHighlighted ? highlightColor : baseFillColor,
                    weight: 1,
                    color: '#ffffff',
                    fillOpacity: isHighlighted ? 0.9 : (baseFillOpacity || 0.7)
                };
            },
            onEachFeature: function(feature, lyr){
                const name = dtdDistrictNameOf(feature);
                lyr.bindTooltip(name, {sticky:true});
                const districtRecords = (window.dtdRecords || []).filter(record => record.district === name);
                if (districtRecords.length) {
                    const violationCount = districtRecords.reduce((sum, record) => sum + (Number(record.totalViolations) || 0), 0);
                    lyr.bindPopup(`<strong>${name}</strong><br>अनुगमन संख्या: ${districtRecords.length}<br>अपरिपालना संख्या: ${violationCount}`);
                    lyr.on('mouseover', function(){ this.openPopup(); });
                    lyr.on('mouseout', function(){ this.closePopup(); });
                }
            }
        }).addTo(map);
        map._dtdGeoJsonLayer = layer;
        try{ map.fitBounds(layer.getBounds(), {padding:[20,20], maxZoom: 7}); map.invalidateSize(); }catch(e){}
    });

    return map;
}

function dtdUpdateHighlightMap(map, highlightSet, highlightColor, baseFillColor, baseFillOpacity) {
    if (!map?._dtdGeoJsonLayer) return;

    map._dtdGeoJsonLayer.eachLayer(function(layer) {
        const name = dtdDistrictNameOf(layer.feature);
        const isHighlighted = [...highlightSet].some(h => name && name.indexOf(h) !== -1);
        layer.setStyle({
            fillColor: isHighlighted ? highlightColor : baseFillColor,
            fillOpacity: isHighlighted ? 0.9 : (baseFillOpacity || 0.7)
        });

        const districtRecords = (window.dtdRecords || []).filter(record => record.district === name);
        const violationCount = districtRecords.reduce((sum, record) => sum + (Number(record.totalViolations) || 0), 0);
        layer.setPopupContent(`<strong>${name}</strong><br>अनुगमन संख्या: ${districtRecords.length}<br>अपरिपालना संख्या: ${violationCount}`);
    });
}

// ---------- Survey Form Initialization ----------
function initializeSurveyForm() {
    const surveyFormContainer = document.getElementById('surveyFormContainer');
    if (!surveyFormContainer) return;

    // Wrap each section-body's content in an inner div so the accordion can
    // animate smoothly with a CSS grid-rows transition.
    document.querySelectorAll('.survey-form-content .section-body').forEach(function(body){
        var inner = document.createElement('div');
        inner.className = 'section-body-inner';
        while (body.firstChild){ inner.appendChild(body.firstChild); }
        body.appendChild(inner);
    });

    // Accordion toggle (smooth, via CSS grid-template-rows transition)
    document.querySelectorAll('.survey-form-content .section-header').forEach(function(header){
        header.addEventListener('click', function(){
            var targetId = header.getAttribute('data-target');
            var body = document.getElementById(targetId);
            body.classList.toggle('collapsed');
            header.classList.toggle('is-collapsed', body.classList.contains('collapsed'));
        });
    });

    // Expand all / collapse all toolbar buttons
    const expandAllBtn = document.getElementById('expandAllBtn');
    const collapseAllBtn = document.getElementById('collapseAllBtn');
    
    if (expandAllBtn) {
        expandAllBtn.addEventListener('click', function(){
            document.querySelectorAll('.survey-form-content .section-body').forEach(function(body){ body.classList.remove('collapsed'); });
            document.querySelectorAll('.survey-form-content .section-header').forEach(function(h){ h.classList.remove('is-collapsed'); });
        });
    }
    
    if (collapseAllBtn) {
        collapseAllBtn.addEventListener('click', function(){
            document.querySelectorAll('.survey-form-content .section-body').forEach(function(body){ body.classList.add('collapsed'); });
            document.querySelectorAll('.survey-form-content .section-header').forEach(function(h){ h.classList.add('is-collapsed'); });
        });
    }

    // Populate Nepali year/month/day dropdowns with current Nepali date defaults
    var yearSelect = document.getElementById('surveyYear');
    var monthSelect = document.getElementById('surveyMonth');
    var daySelect = document.getElementById('surveyDay');

    var currentNy = 2083;
    var currentNm = 5;
    var currentNd = 7;
    var nepaliDigitMap = {
        '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
        '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'
    };

    if (window.NepaliCalendar && typeof window.NepaliCalendar.getCurrentDate === 'function') {
        var currentDateStr = window.NepaliCalendar.getCurrentDate();
        if (currentDateStr) {
            var parts = currentDateStr.split('-');
            currentNy = parseInt(parts[0], 10);
            currentNm = parseInt(parts[1], 10);
            currentNd = parseInt(parts[2], 10);
        }
    }

    var nepaliMonthDays = {
        2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
        2081: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
        2082: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
        2083: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
        2084: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
        2085: [31, 32, 31, 32, 30, 31, 30, 30, 29, 30, 30, 30],
        2086: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
        2087: [31, 31, 32, 31, 31, 31, 30, 30, 30, 30, 30, 30],
        2088: [30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30],
        2089: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
        2090: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30]
    };

    function toNepaliNumber(num){
        return String(num).replace(/[0-9]/g, function(ch){
            return nepaliDigitMap[ch] || ch;
        });
    }

    function getNepaliMonthDayCount(year, month) {
        if (nepaliMonthDays[year]) {
            return nepaliMonthDays[year][month - 1] || 30;
        }
        return 30;
    }

    function populateSurveyDayOptions(yearValue, monthValue, selectedValue) {
        if (!daySelect) return;

        var safeYear = parseInt(yearValue, 10) || currentNy;
        var safeMonth = parseInt(monthValue, 10) || currentNm;
        var maxDay = getNepaliMonthDayCount(safeYear, safeMonth);
        var safeSelected = parseInt(selectedValue, 10) || currentNd;

        daySelect.innerHTML = '<option value="">गते</option>';

        for (var d = 1; d <= 32; d++) {
            if (d > maxDay) continue;

            var opt2 = document.createElement('option');
            opt2.value = d;
            opt2.textContent = toNepaliNumber(d);
            if (d === safeSelected) opt2.selected = true;
            daySelect.appendChild(opt2);
        }

        if (!daySelect.value || parseInt(daySelect.value, 10) > maxDay) {
            daySelect.value = String(Math.min(safeSelected, maxDay));
        }
    }

    if (yearSelect) {
        yearSelect.innerHTML = '<option value="">वर्ष</option>';
        for (var y = 2080; y <= 2090; y++){
            var opt = document.createElement('option');
            opt.value = y;
            opt.textContent = toNepaliNumber(y);
            if (y === currentNy) opt.selected = true;
            yearSelect.appendChild(opt);
        }
        yearSelect.value = String(currentNy);
    }

    if (monthSelect) {
        monthSelect.innerHTML = '<option value="">महिना</option>';
        var monthNames = ['बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत'];
        monthNames.forEach(function(m, i) {
            var opt = document.createElement('option');
            opt.value = i + 1;
            opt.textContent = m;
            if (i + 1 === currentNm) opt.selected = true;
            monthSelect.appendChild(opt);
        });
        monthSelect.value = String(currentNm);
    }

    if (daySelect) {
        populateSurveyDayOptions(currentNy, currentNm, currentNd);
    }

    if (yearSelect) {
        yearSelect.addEventListener('change', function() {
            var selectedYear = parseInt(this.value, 10) || currentNy;
            var monthValue = monthSelect ? (parseInt(monthSelect.value, 10) || currentNm) : currentNm;
            populateSurveyDayOptions(selectedYear, monthValue, currentNd);
        });
    }

    if (monthSelect) {
        monthSelect.addEventListener('change', function() {
            var selectedMonth = parseInt(this.value, 10) || currentNm;
            var yearValue = yearSelect ? (parseInt(yearSelect.value, 10) || currentNy) : currentNy;
            populateSurveyDayOptions(yearValue, selectedMonth, currentNd);
        });
    }

    // Word counter for suggestion textarea (max 100 words)
    var suggestionText = document.getElementById('suggestionText');
    var wordCountEl = document.getElementById('wordCount');
    
    function updateWordCount(){
        var text = suggestionText.value.trim();
        var words = text.length === 0 ? 0 : text.split(/\s+/).length;
        if (words > 100){
            var trimmed = text.split(/\s+/).slice(0,100).join(' ');
            suggestionText.value = trimmed;
            words = 100;
        }
        wordCountEl.textContent = toNepaliNumber(words) + ' / ' + toNepaliNumber(100) + ' शब्द';
    }
    
    if (suggestionText) {
        suggestionText.addEventListener('input', updateWordCount);
        updateWordCount();
    }

    // Simple geolocation for पूर्ण ठेगाना button
    const locationBtn = document.querySelector('.survey-form-content .icon-btn.location');
    if (locationBtn) {
        locationBtn.addEventListener('click', function(){
            var input = this.parentElement.querySelector('input[type="text"]');
            if (navigator.geolocation){
                navigator.geolocation.getCurrentPosition(function(pos){
                    input.value = pos.coords.latitude.toFixed(6) + ', ' + pos.coords.longitude.toFixed(6);
                }, function(){
                    alert('स्थान पत्ता लगाउन सकिएन। कृपया म्यानुअली ठेगाना भर्नुहोस्।');
                });
            } else {
                alert('यो ब्राउजरले स्थान पत्ता लगाउने सुविधा समर्थन गर्दैन।');
            }
        });
    }

    // Delete buttons clear their associated input
    document.querySelectorAll('.survey-form-content .icon-btn.del').forEach(function(btn){
        if (btn.closest('.suggestion-wrap')) return; // handled separately above
        btn.addEventListener('click', function(){
            var input = btn.parentElement.parentElement.querySelector('input[type="text"], textarea');
            if (input) input.value = '';
        });
    });

    // Mic buttons: use Web Speech API if available
    document.querySelectorAll('.survey-form-content .icon-btn.mic').forEach(function(btn){
        btn.addEventListener('click', function(){
            var container = btn.closest('.field-control') || btn.closest('.suggestion-wrap');
            var input = container ? container.querySelector('input[type="text"], textarea') : null;
            if (!input) return;
            var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition){
                alert('यो ब्राउजरले आवाजबाट टाइप गर्ने सुविधा समर्थन गर्दैन।');
                return;
            }
            var recognition = new SpeechRecognition();
            recognition.lang = 'ne-NP';
            recognition.onstart = function(){
                btn.classList.add('recording');
            };
            recognition.onend = function(){
                btn.classList.remove('recording');
            };
            recognition.onresult = function(event){
                input.value += (input.value ? ' ' : '') + event.results[0][0].transcript;
                if (input.id === 'suggestionText') updateWordCount();
            };
            recognition.onerror = function(){
                btn.classList.remove('recording');
                alert('आवाज पहिचान गर्न सकिएन।');
            };
            recognition.start();
        });
    });

    // Form submit
    const surveyForm = document.getElementById('surveyForm');
    if (surveyForm) {
        surveyForm.dataset.alertSubmitRemoved = 'true';
    }

    // ---- फारम पूर्णता प्रगति पट्टी ----
    var progressFill = document.getElementById('progressFill');
    var progressLabel = document.getElementById('progressLabel');

    function collectUnits(){
        var units = [];
        document.querySelectorAll('#surveyForm select, #surveyForm input[type="text"], #surveyForm textarea')
            .forEach(function(el){ units.push({ type:'value', el: el }); });
        var radioNames = [];
        document.querySelectorAll('#surveyForm input[type="radio"]').forEach(function(r){
            if (r.name && radioNames.indexOf(r.name) === -1) radioNames.push(r.name);
        });
        radioNames.forEach(function(name){ units.push({ type:'radio', name: name }); });
        document.querySelectorAll('#surveyForm input[type="checkbox"]').forEach(function(c){
            units.push({ type:'checkbox', el: c });
        });
        return units;
    }

    function updateProgress(){
        var units = collectUnits();
        var answered = 0;
        units.forEach(function(u){
            if (u.type === 'value'){
                if (u.el.value && u.el.value.trim() !== '') answered++;
            } else if (u.type === 'radio'){
                if (document.querySelector('#surveyForm input[name="' + u.name + '"]:checked')) answered++;
            } else if (u.type === 'checkbox'){
                if (u.el.checked) answered++;
            }
        });
        var pct = units.length ? Math.round((answered / units.length) * 100) : 0;
        progressFill.style.width = pct + '%';
        progressLabel.textContent = toNepaliNumber(pct) + '% पूरा भयो';
    }

    if (surveyForm) {
        surveyForm.addEventListener('input', updateProgress);
        updateProgress();
    }
}

// Initialize Survey Dashboard
function initializeSurveyDashboard() {
    /* ===================== सहायक फङ्सन ===================== */
    var nepaliDigits = ['०','१','२','३','४','५','६','७','८','९'];
    function toNepaliNumber(num){
        return String(num).split('').map(function(ch){
            return /[0-9]/.test(ch) ? nepaliDigits[parseInt(ch,10)] : ch;
        }).join('');
    }

    var months = ['साउन','भदौ','असोज','कार्तिक','मंसिर','पुष','माघ','फाल्गुन','चैत','बैशाख','जेठ','असार'];

    var provinces = [
        { name:'कोशी प्रदेश', short:'कोशी', districts:['झापा','मोरङ','सुनसरी'] },
        { name:'मधेश प्रदेश', short:'मधेश', districts:['सर्लाही','धनुषा','पर्सा'] },
        { name:'बागमती प्रदेश', short:'बागमती', districts:['काठमाडौं','ललितपुर','चितवन'] },
        { name:'गण्डकी प्रदेश', short:'गण्डकी', districts:['कास्की','स्याङ्जा','तनहुँ'] },
        { name:'लुम्बिनी प्रदेश', short:'लुम्बिनी', districts:['रुपन्देही','दाङ','बाँके'] },
        { name:'कर्णाली प्रदेश', short:'कर्णाली', districts:['सुर्खेत','जुम्ला','दैलेख'] },
        { name:'सुदूरपश्चिम प्रदेश', short:'सुदूरपश्चिम', districts:['कैलाली','कञ्चनपुर','डोटी'] }
    ];

    var dissatisfactionReasons = ['समयमै काम नभएको','सेवा शुल्क बढी भएको','सेवा गुणस्तरीय नभएको','प्रक्रिया झन्झटिलो भएको','कर्मचारीको व्यवहार राम्रो नभएको','अतिरिक्त रकम दिनुपरेकोले','अन्य'];
    var bribeRecipients = ['सम्बन्धित कर्मचारीलाई सोझै','लेखापढी व्यवसायी मार्फत','अन्य मध्यस्थकर्ता मार्फत'];

    var allData = [];
    var currentProvinceFilter = null;
    var currentMonthFilter = '';
    var currentGenderFilter = '';
    var currentMapMetric = 'satisfaction';

    /* ===================== फिल्टर UI सेटअप ===================== */
    var monthSelect = document.getElementById('monthFilter');
    months.forEach(function(m){
        var opt = document.createElement('option');
        opt.value = m; opt.textContent = m;
        monthSelect.appendChild(opt);
    });
    monthSelect.addEventListener('change', function(){ currentMonthFilter = this.value; renderAll(); });
    document.getElementById('metricGenderFilter').addEventListener('change', function(){ currentGenderFilter = this.value; renderAll(); });
    document.getElementById('clearFilterBtn').addEventListener('click', function(){ currentProvinceFilter = null; renderAll(); });

    document.querySelectorAll('.metric-btn').forEach(function(btn){
        btn.addEventListener('click', function(){
            document.querySelectorAll('.metric-btn').forEach(function(b){ b.classList.remove('active'); });
            btn.classList.add('active');
            currentMapMetric = btn.getAttribute('data-metric');
            
            var legendBar = document.querySelector('#provinceMap .legend-bar');
            if (legendBar) {
                if (currentMapMetric === 'bribe') {
                    legendBar.classList.add('reverse');
                } else {
                    legendBar.classList.remove('reverse');
                }
            }
            
            renderMap();
        });
    });

    function getFilteredData(){
        return allData.filter(function(r){
            if (currentProvinceFilter && r.province !== currentProvinceFilter) return false;
            if (currentMonthFilter && r.month !== currentMonthFilter) return false;
            if (currentGenderFilter && r.gender !== currentGenderFilter) return false;
            return true;
        });
    }

    function normalizeSurveyRow(row){
        var answers = {};
        try { answers = typeof row.answer_data === 'string' ? JSON.parse(row.answer_data) : row.answer_data || {}; } catch (e) {}
        if (!Object.keys(answers).length) {
            try { answers = row.suggestions ? JSON.parse(row.suggestions).answers || {} : {}; } catch (e) {}
        }
        Object.keys(answers).forEach(function(key){
            if (typeof answers[key] === 'string') answers[key] = answers[key].replace(/\s+/g, ' ').trim();
            if (Array.isArray(answers[key])) answers[key] = answers[key].map(function(value){ return String(value).replace(/\s+/g, ' ').trim(); });
        });
        var dateParts = String(row.survey_date || '').slice(0, 10).split('-');
        var monthNames = { '1':'बैशाख', '2':'जेठ', '3':'असार', '4':'साउन', '5':'भदौ', '6':'असोज', '7':'कार्तिक', '8':'मंसिर', '9':'पुष', '10':'माघ', '11':'फाल्गुन', '12':'चैत' };
        var provinceName = String(row.province || '').replace('मधेश प्रदेश', 'मधेश प्रदेश');
        var displayDate = [dateParts[0], String(dateParts[1] || '').padStart(2, '0'), String(dateParts[2] || '').padStart(2, '0')].join('-');
        var gender = String(row.respondent_type || '');
        var quality = Number(row.service_quality) >= 4 ? 'राम्रो' : Number(row.service_quality) >= 3 ? 'मध्यम' : 'कमजोर';
        var answerValues = Object.values(answers).flat().map(function(value){ return String(value).replace(/\s+/g, ' ').trim(); });
        var reasonValues = Array.isArray(answers['q7.2']) ? answers['q7.2'] : answerValues;
        var reasons = reasonValues.filter(function(value){
            return dissatisfactionReasons.some(function(category){ return value.includes(category); });
        }).map(function(value){
            return dissatisfactionReasons.find(function(category){ return value.includes(category); });
        });
        return {
            province: provinceName,
            provinceShort: provinceName.replace(' प्रदेश', ''),
            district: row.district || '',
            gender: gender.includes('महिला') ? 'महिला' : gender.includes('अन्य') ? 'अन्य' : 'पुरुष',
            office: row.office_visited || row.service_type || '',
            officeNames: [row.office_visited, row.office_2, row.office_3].filter(Boolean),
            goodOfficeNames: [row.good_service_office || answers['राम्रो सेवा प्रवाह गर्ने कार्यालय:']].filter(Boolean),
            weakOfficeNames: [row.weak_service_office || answers['सेवा प्रवाह कमजोर/अनियमित रहेका कार्यालय:']].filter(Boolean),
            satisfied: answers.q7 ? answers.q7.includes('सन्तुष्ट') && !answers.q7.includes('असन्तुष्ट') : Number(row.overall_satisfaction) >= 4,
            quality: quality,
            bribe: String(row.recommendations || '').includes('पर्‍यो'),
            bribeTo: bribeRecipients.find(function(recipient){ return answerValues.some(function(value){ return value.includes(recipient); }); }) || '',
            charterAware: Number(row.accessibility) >= 4,
            complaint: String(answers['q12'] || '').includes('गरेको छु'),
            reason: reasons[0] || '',
            reasons: reasons,
            date: toNepaliNumber(displayDate),
            month: monthNames[dateParts[1]] || '',
            monthIdx: (Number(dateParts[1]) + 8) % 12,
            day: Number(dateParts[2]) || 0
        };
    }

    async function loadSurveyDashboardData(){
        try {
            var result = await SurveyAPI.getAll();
            if (!result.success) throw new Error(result.error || 'Survey data could not be loaded');
            allData = (result.data || []).map(normalizeSurveyRow);
            renderAll();
        } catch (error) {
            console.error('Error loading survey dashboard data:', error);
        }
    }
    window.loadSurveyDashboardData = loadSurveyDashboardData;

    /* ===================== तथ्याङ्क कार्ड ===================== */
    function renderStatCards(){
        var d = getFilteredData();
        var n = d.length || 1;
        var satisfiedPct = Math.round(d.filter(function(r){return r.satisfied;}).length / n * 100);
        var bribePct = Math.round(d.filter(function(r){return r.bribe;}).length / n * 100);
        var charterPct = Math.round(d.filter(function(r){return r.charterAware;}).length / n * 100);
        var complaintPct = Math.round(d.filter(function(r){return r.complaint;}).length / n * 100);
        var qualityGoodPct = Math.round(d.filter(function(r){return r.quality==='राम्रो';}).length / n * 100);

        var cards = [
            { icon:'<i class="fas fa-file-alt"></i>', gradient:'linear-gradient(135deg,#1a3a6b 0%,#1e5799 100%)', num:toNepaliNumber(d.length), label:'कुल सर्वेक्षण संख्या', sub:'फिल्टर अनुसार' },
            { icon:'<i class="fas fa-thumbs-up"></i>', gradient:'linear-gradient(135deg,#065f5f 0%,#0d9488 100%)', num:toNepaliNumber(satisfiedPct)+'%', label:'समग्र सन्तुष्टि दर', sub:d.filter(function(r){return r.satisfied;}).length+' / '+d.length+' सन्तुष्ट' },
            { icon:'<i class="fas fa-trophy"></i>', gradient:'linear-gradient(135deg,#3730a3 0%,#6366f1 100%)', num:toNepaliNumber(qualityGoodPct)+'%', label:'राम्रो गुणस्तर दर', sub:'सेवाग्राहीको मूल्यांकनमा' },
            { icon:'<i class="fas fa-exclamation-triangle"></i>', gradient:'linear-gradient(135deg,#7f1d1d 0%,#dc2626 100%)', num:toNepaliNumber(bribePct)+'%', label:'अतिरिक्त रकम मागिएको दर', sub:'अतिरिक्त रकम दिनुपरेको' },
            { icon:'<i class="fas fa-book"></i>', gradient:'linear-gradient(135deg,#4c1d95 0%,#7c3aed 100%)', num:toNepaliNumber(charterPct)+'%', label:'नागरिक बडापत्र जानकारी दर', sub:'जानकारी भएका सेवाग्राही' },
            { icon:'<i class="fas fa-volume-up"></i>', gradient:'linear-gradient(135deg,#92400e 0%,#d97706 100%)', num:toNepaliNumber(complaintPct)+'%', label:'गुनासो दर्ता दर', sub:'गुनासो/उजुरी गरेका' }
        ];
        document.getElementById('statGrid').innerHTML = cards.map(function(c){
            return '<div class="stat-card" style="background:'+c.gradient+'">'
                + '<div class="stat-icon">'+c.icon+'</div>'
                + '<div class="stat-card-body">'
                + '<div class="stat-num">'+c.num+'</div>'
                + '<div class="stat-label">'+c.label+'</div>'
                + '<div class="stat-sub">'+c.sub+'</div>'
                + '</div>'
                + '</div>';
        }).join('');
    }

    /* ===================== प्रदेश कार्टोग्राम नक्सा ===================== */
    var mapInstance = null;
    var geoJsonLayer = null;

    function metricColor(value){
        if (value === null) return '#e2e8f0';
        var stops = [
            { p:0, c:[224,82,79] },
            { p:0.5, c:[232,161,58] },
            { p:1, c:[47,158,83] }
        ];
        var lo, hi;
        if (value <= 0.5){ lo = stops[0]; hi = stops[1]; }
        else { lo = stops[1]; hi = stops[2]; }
        var span = hi.p - lo.p;
        var t = span ? (value - lo.p) / span : 0;
        var rgb = lo.c.map(function(c0,i){ return Math.round(c0 + (hi.c[i]-c0)*t); });
        return 'rgb('+rgb.join(',')+')';
    }

    function initMap(){
        if (mapInstance) return;
        
        mapInstance = L.map('provinceMap', {
            zoomControl: true,
            attributionControl: false,
            scrollWheelZoom: false
        }).setView([28.3949, 84.1240], 6);
        
        var geojsonUrl = 'https://raw.githubusercontent.com/Acesmndr/nepal-geojson/master/generated-geojson/nepal-with-districts-acesmndr.geojson';
        
        fetch(geojsonUrl)
            .then(function(res){
                if (!res.ok) throw new Error('Failed to load');
                return res.text();
            })
            .then(function(txt){
                var s = txt.replace(/^\uFEFF/, '').trim();
                s = s.replace(/^[^\{\[]+/, '');
                var data = JSON.parse(s);
                renderChoropleth(data);
            })
            .catch(function(err){
                renderFallbackMap();
            });
    }

    function renderFallbackMap(){
        var provincePolygons = [
            { name: 'कोशी प्रदेश', coords: [[27.5, 87.0], [27.5, 88.5], [28.5, 88.5], [28.5, 87.0]] },
            { name: 'मधेश प्रदेश', coords: [[26.5, 85.0], [26.5, 87.0], [27.5, 87.0], [27.5, 85.0]] },
            { name: 'बागमती प्रदेश', coords: [[27.0, 84.0], [27.0, 85.5], [28.2, 85.5], [28.2, 84.0]] },
            { name: 'गण्डकी प्रदेश', coords: [[27.5, 82.5], [27.5, 84.0], [28.8, 84.0], [28.8, 82.5]] },
            { name: 'लुम्बिनी प्रदेश', coords: [[27.0, 82.0], [27.0, 83.5], [28.0, 83.5], [28.0, 82.0]] },
            { name: 'कर्णाली प्रदेश', coords: [[28.0, 81.0], [28.0, 82.5], [29.5, 82.5], [29.5, 81.0]] },
            { name: 'सुदूरपश्चिम प्रदेश', coords: [[28.5, 80.0], [28.5, 81.5], [30.0, 81.5], [30.0, 80.0]] }
        ];
        
        provincePolygons.forEach(function(prov){
            var metricVal = getProvinceMetricValue(prov.name, currentMapMetric);
            var polygon = L.polygon(prov.coords, {
                color: '#fff',
                weight: 2,
                fillColor: metricColor(metricVal),
                fillOpacity: 0.7
            }).addTo(mapInstance);
            
            polygon.bindPopup(getProvincePopupContent(prov.name));
            
            polygon.on('click', function(){
                currentProvinceFilter = (currentProvinceFilter === prov.name) ? null : prov.name;
                renderAll();
            });
            
            polygon._provinceName = prov.name;
            
            if (!geoJsonLayer) {
                geoJsonLayer = L.featureGroup().addTo(mapInstance);
            }
            geoJsonLayer.addLayer(polygon);
        });
        
        try{
            mapInstance.fitBounds(geoJsonLayer.getBounds(), {padding:[5,5], maxZoom: 8});
            mapInstance.invalidateSize();
        }catch(e){
            console.warn('Error setting bounds:', e);
        }
    }

    function getProvinceName(feature){
        var props = feature.properties || {};
        var name = props.Province || props.PROVINCE || props.province || props.NAME || props.name || props.DISTRICT || props.district || '';
        
        if (typeof name !== 'string') {
            name = String(name);
        }
        
        var provinceMap = {
            'कोशी': 'कोशी प्रदेश', 'Koshi': 'कोशी प्रदेश', 'Province 1': 'कोशी प्रदेश', '1': 'कोशी प्रदेश',
            'मधेश': 'मधेश प्रदेश', 'Madhesh': 'मधेश प्रदेश', 'Province 2': 'मधेश प्रदेश', '2': 'मधेश प्रदेश',
            'बागमती': 'बागमती प्रदेश', 'Bagmati': 'बागमती प्रदेश', 'Province 3': 'बागमती प्रदेश', '3': 'बागमती प्रदेश',
            'गण्डकी': 'गण्डकी प्रदेश', 'Gandaki': 'गण्डकी प्रदेश', 'Province 4': 'गण्डकी प्रदेश', '4': 'गण्डकी प्रदेश',
            'लुम्बिनी': 'लुम्बिनी प्रदेश', 'Lumbini': 'लुम्बिनी प्रदेश', 'Province 5': 'लुम्बिनी प्रदेश', '5': 'लुम्बिनी प्रदेश',
            'कर्णाली': 'कर्णाली प्रदेश', 'Karnali': 'कर्णाली प्रदेश', 'Province 6': 'कर्णाली प्रदेश', '6': 'कर्णाली प्रदेश',
            'सुदूरपश्चिम': 'सुदूरपश्चिम प्रदेश', 'Sudurpashchim': 'सुदूरपश्चिम प्रदेश', 'Province 7': 'सुदूरपश्चिम प्रदेश', '7': 'सुदूरपश्चिम प्रदेश'
        };
        
        if (provinceMap[name]) {
            return provinceMap[name];
        }
        
        if (name.includes('प्रदेश')) {
            return name;
        }
        
        return name;
    }

    function getProvinceMetricValue(provName, metric){
        var rows = allData.filter(function(r){ return r.province === provName; });
        if (!rows.length) return null;
        if (metric === 'satisfaction'){
            return rows.filter(function(r){return r.satisfied;}).length / rows.length;
        } else if (metric === 'bribe'){
            return 1 - (rows.filter(function(r){return r.bribe;}).length / rows.length);
        } else {
            return rows.filter(function(r){return r.quality==='राम्रो';}).length / rows.length;
        }
    }

    function getProvincePopupContent(provName){
        var rows = allData.filter(function(r){ return r.province === provName; });
        if (!rows.length) return '<strong>' + provName + '</strong><br/>डाटा उपलब्ध छैन';
        var metricVal = getProvinceMetricValue(provName, currentMapMetric);
        var displayPct = currentMapMetric === 'bribe' ? (1 - metricVal) : metricVal;
        return '<strong>' + provName + '</strong><br/>' +
            'सर्वेक्षण संख्या: ' + toNepaliNumber(rows.length) + '<br/>' +
            'दर: ' + toNepaliNumber(Math.round(displayPct * 100)) + '%';
    }

    function renderChoropleth(geoData){
        if (!mapInstance) return;
        
        if (geoJsonLayer){
            mapInstance.removeLayer(geoJsonLayer);
        }
        
        geoJsonLayer = L.geoJSON(geoData, {
            style: function(feature){
                var provName = getProvinceName(feature);
                var metricVal = getProvinceMetricValue(provName, currentMapMetric);
                return {
                    fillColor: metricColor(metricVal),
                    weight: 2,
                    color: '#fff',
                    fillOpacity: 0.7
                };
            },
            onEachFeature: function(feature, layer){
                var provName = getProvinceName(feature);
                layer.bindPopup(getProvincePopupContent(provName));
                
                layer.on('click', function(){
                    if (!allData.some(function(row){ return row.province === provName; })) return;
                    currentProvinceFilter = (currentProvinceFilter === provName) ? null : provName;
                    renderAll();
                });
                
                if (currentProvinceFilter === provName){
                    layer.setStyle({
                        weight: 2,
                        color: '#fff',
                        fillOpacity: 0.95
                    });
                }
            }
        }).addTo(mapInstance);
        
        try{
            mapInstance.fitBounds(geoJsonLayer.getBounds(), {padding:[10,10], maxZoom: 8});
            mapInstance.invalidateSize();
        }catch(e){}
    }

    function renderMap(){
        if (!mapInstance){
            initMap();
        } else if (geoJsonLayer){
            geoJsonLayer.eachLayer(function(layer){
                var provName = layer.feature ? getProvinceName(layer.feature) : layer._provinceName || '';
                var metricVal = getProvinceMetricValue(provName, currentMapMetric);
                var isFiltered = currentProvinceFilter === provName;
                
                layer.setStyle({
                    fillColor: metricColor(metricVal),
                    weight: 2,
                    color: '#fff',
                    fillOpacity: isFiltered ? 0.95 : 0.7
                });
                layer.setPopupContent(getProvincePopupContent(provName));
            });
        }
        
        var chip = document.getElementById('clearFilterBtn');
        var label = document.getElementById('clearFilterLabel');
        if (currentProvinceFilter){
            chip.classList.add('show');
            var matchedProv = provinces.filter(function(p){return p.name===currentProvinceFilter;})[0];
            label.textContent = matchedProv ? matchedProv.short : currentProvinceFilter;
        } else {
            chip.classList.remove('show');
        }
    }

    /* ===================== चार्टहरू (Chart.js) ===================== */
    var charts = {};
    var palette = { blue:'#0a3d91', crimson:'#c8102e', amber:'#e8a13a', teal:'#1f9a8f', purple:'#6b5fd8', green:'#2f9e53', red:'#ff5252' };

    Chart.defaults.font.family = "'Noto Sans Devanagari','Segoe UI',Arial,sans-serif";
    Chart.defaults.color = '#697180';

    function makeOrUpdate(id, config){
        if (charts[id]){
            charts[id].data = config.data;
            if (config.options) charts[id].options = config.options;
            charts[id].update();
        } else {
            var ctx = document.getElementById(id).getContext('2d');
            charts[id] = new Chart(ctx, config);
        }
    }

    function renderDonut(d){
        var satisfied = d.filter(function(r){return r.satisfied;}).length;
        var dissatisfied = d.length - satisfied;
        makeOrUpdate('satisfactionDonut', {
            type:'doughnut',
            data:{
                labels:['सन्तुष्ट','असन्तुष्ट'],
                datasets:[{ data:[satisfied,dissatisfied], backgroundColor:['rgb(40, 167, 69)','rgb(253, 126, 20)'], borderWidth:0 }]
            },
            options:{ responsive:true, maintainAspectRatio:false, cutout:'55%',
                plugins:{ legend:{ position:'bottom' } } }
        });
    }

    function renderGenderBar(d){
        var genders = ['पुरुष','महिला','अन्य'];
        var counts = genders.map(function(g){ return d.filter(function(r){return r.gender===g;}).length; });
        makeOrUpdate('genderBar', {
            type:'bar',
            data:{ labels:genders, datasets:[{ data:counts, backgroundColor:['rgb(23, 162, 184)','rgb(253, 126, 20)','rgb(40, 167, 69)'], borderRadius:6, maxBarThickness:46 }] },
            options:{ responsive:true, maintainAspectRatio:false,
                plugins:{ legend:{ display:false } },
                scales:{ y:{ beginAtZero:true, ticks:{ precision:0 } } } }
        });
    }

    function renderReasonBar(d){
        var counts = dissatisfactionReasons.map(function(reason){
            return d.reduce(function(total, row){
                return total + ((row.reasons || []).indexOf(reason) !== -1 ? 1 : 0);
            }, 0);
        });
        var shortLabels = dissatisfactionReasons;
        makeOrUpdate('reasonBar', {
            type:'bar',
            data:{ labels:shortLabels, datasets:[{ data:counts, backgroundColor:'rgb(253, 126, 20)', borderRadius:6, maxBarThickness:34 }] },
            options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false,
                plugins:{ legend:{ display:false } },
                scales:{ x:{ beginAtZero:true, ticks:{ precision:0 } } } }
        });
    }

    function renderBribeBar(d){
        var bribed = d.filter(function(r){ return r.bribe && r.bribeTo; });
        var shortLabels = ['सम्बन्धित कर्मचारीलाई','लेखापढी व्यवसायी मार्फत','अन्य मध्यस्थकर्ता मार्फत'];
        var counts = bribeRecipients.map(function(rec){
            return bribed.filter(function(r){ return r.bribeTo === rec; }).length;
        });
        makeOrUpdate('bribeBar', {
            type:'bar',
            data:{ labels:shortLabels, datasets:[{ data:counts, backgroundColor:palette.amber, borderRadius:6, maxBarThickness:34 }] },
            options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false,
                plugins:{ legend:{ display:false } },
                scales:{ x:{ beginAtZero:true, ticks:{ precision:0 } } } }
        });
    }

    function renderTrendLine(d){
        var pct = months.map(function(m, idx){
            var rows = d.filter(function(r){ return r.monthIdx === idx; });
            if (!rows.length) return null;
            return Math.round(rows.filter(function(r){return r.satisfied;}).length / rows.length * 100);
        });
        makeOrUpdate('trendLine', {
            type:'line',
            data:{ labels:months, datasets:[{
                data:pct, borderColor:palette.blue, backgroundColor:'rgba(10,61,145,0.12)',
                fill:true, tension:0.35, spanGaps:true, pointRadius:3, pointBackgroundColor:palette.blue
            }] },
            options:{ responsive:true, maintainAspectRatio:false,
                plugins:{ legend:{ display:false } },
                scales:{ y:{ beginAtZero:true, max:100, ticks:{ callback:function(v){ return v+'%'; } } } } }
        });
    }

    function renderOfficeRanking(d){
        function officeStats(field){
            var officeNames = Array.from(new Set(d.reduce(function(names, row){
                return names.concat(row[field] || []);
            }, []).filter(Boolean)));
            return officeNames.map(function(officeName){
                var rows = d.filter(function(r){ return (r[field] || []).indexOf(officeName) !== -1; });
            var pct = rows.length ? Math.round(rows.filter(function(r){return r.satisfied;}).length / rows.length * 100) : 0;
            return { name:officeName, pct:pct, n:rows.length };
            }).filter(function(s){ return s.n > 0; });
        }

        var top = officeStats('goodOfficeNames').sort(function(a,b){ return b.pct - a.pct || b.n - a.n; }).slice(0,5);
        var bottom = officeStats('weakOfficeNames').sort(function(a,b){ return a.pct - b.pct || b.n - a.n; }).slice(0,5);

        document.getElementById('topOffices').innerHTML = top.map(function(s){
            return '<div class="rank-item"><div class="rank-item-top"><span class="rname">'+s.name+'</span><span class="rval">'+toNepaliNumber(s.pct)+'%</span></div>'
                + '<div class="rank-track"><div class="rank-fill good" style="width:'+s.pct+'%;"></div></div></div>';
        }).join('') || '<p class="panel-sub">पर्याप्त डेटा छैन।</p>';

        document.getElementById('bottomOffices').innerHTML = bottom.map(function(s){
            return '<div class="rank-item"><div class="rank-item-top"><span class="rname">'+s.name+'</span><span class="rval" style="color:var(--crimson);">'+toNepaliNumber(s.pct)+'%</span></div>'
                + '<div class="rank-track"><div class="rank-fill bad" style="width:'+s.pct+'%;"></div></div></div>';
        }).join('') || '<p class="panel-sub">पर्याप्त डेटा छैन।</p>';
    }

    function renderTable(d){
        var latest = d.slice(-10).reverse();
        document.getElementById('recentTableBody').innerHTML = latest.map(function(r){
            return '<tr>'
                + '<td>'+r.date+'</td>'
                + '<td>'+r.provinceShort+'</td>'
                + '<td>'+r.district+'</td>'
                + '<td>'+r.gender+'</td>'
                + '<td>'+r.office+'</td>'
                + '<td><span class="pill '+(r.satisfied?'good':'bad')+'">'+(r.satisfied?'सन्तुष्ट':'असन्तुष्ट')+'</span></td>'
                + '<td><span class="pill '+(r.bribe?'bad':'good')+'">'+(r.bribe?'भयो':'भएन')+'</span></td>'
                + '</tr>';
        }).join('');
    }

    function renderAll(){
        var d = getFilteredData();
        renderStatCards();
        renderMap();
        renderDonut(d);
        renderGenderBar(d);
        renderReasonBar(d);
        renderBribeBar(d);
        renderTrendLine(d);
        renderOfficeRanking(d);
        renderTable(d);
        document.getElementById('footerCount').textContent = toNepaliNumber(allData.length);
    }

    renderAll();
    loadSurveyDashboardData();
}


    function initializeProjectMonitoringDashboard() {
        // Nepali digit helper
        var bsDigits=['०','१','२','३','४','५','६','७','८','९'];
        function nd(num){ return String(num).split('').map(function(c){ return /[0-9]/.test(c)?bsDigits[+c]:c; }).join(''); }
        function fmtInt(n){ n=Math.round(n||0); var s=String(Math.abs(n)); var last3=s.slice(-3), rest=s.slice(0,-3);
          if(rest!==''){ rest=rest.replace(/\B(?=(\d{2})+(?!\d)$)/g,','); last3=','+last3; }
          return (n<0?'-':'')+nd(rest+last3); }
        function fmtMoney(n){
          n=Math.max(0,n||0);
          if(n>=10000000) return 'रु. '+nd((n/10000000).toFixed(2))+' करोड';
          if(n>=100000) return 'रु. '+nd((n/100000).toFixed(2))+' लाख';
          return 'रु. '+fmtInt(n);
        }
        function fmtPct(n){ return nd(Math.round(n))+'%'; }

        // Seeded PRNG
        function mulberry32(seed){ return function(){ seed|=0; seed=seed+0x6D2B79F5|0; var t=Math.imul(seed^seed>>>15,1|seed);
          t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
        var rand = mulberry32(20830408);
        function ri(a,b){ return Math.floor(rand()*(b-a+1))+a; }
        function rf(a,b){ return rand()*(b-a)+a; }
        function pick(arr){ return arr[Math.floor(rand()*arr.length)]; }

        // Provinces & districts
        var PROVINCES=[
          {key:'sudur', name:'सुदूरपश्चिम प्रदेश', short:'सुदूरपश्चिम', districts:['दार्चुला','बझाङ','बाजुरा','अछाम','डोटी','बैतडी','दादेलधुरा','कैलाली','कञ्चनपुर']},
          {key:'karnali', name:'कर्णाली प्रदेश', short:'कर्णाली', districts:['हुम्ला','मुगु','जुम्ला','कालिकोट','डोल्पा','जाजरकोट','पश्चिम रुकुम','दैलेख','सल्यान','सुर्खेत']},
          {key:'lumbini', name:'लुम्बिनी प्रदेश', short:'लुम्बिनी', districts:['पूर्वी रुकुम','रोल्पा','प्युठान','अर्घाखाँची','गुल्मी','पाल्पा','दाङ','नवलपरासी (प.)','कपिलवस्तु','रुपन्देही','बाँके','बर्दिया']},
          {key:'gandaki', name:'गण्डकी प्रदेश', short:'गण्डकी', districts:['मनाङ','मुस्ताङ','म्याग्दी','बाग्लुङ','कास्की','लमजुङ','गोरखा','पर्वत','स्याङ्जा','तनहुँ','नवलपुर']},
          {key:'bagmati', name:'बागमती प्रदेश', short:'बागमती', districts:['रसुवा','सिन्धुपाल्चोक','दोलखा','नुवाकोट','काठमाडौं','भक्तपुर','ललितपुर','काभ्रेपलाञ्चोक','रामेछाप','धादिङ','मकवानपुर','सिन्धुली','चितवन']},
          {key:'madhesh', name:'मधेश प्रदेश', short:'मधेश', districts:['सर्लाही','महोत्तरी','धनुषा','सिराहा','सप्तरी','रौतहट','बारा','पर्सा']},
          {key:'koshi', name:'कोशी प्रदेश', short:'कोशी', districts:['ताप्लेजुङ','संखुवासभा','सोलुखुम्बु','पाँचथर','तेह्रथुम','भोजपुर','ओखलढुंगा','खोटाङ','इलाम','धनकुटा','उदयपुर','मोरङ','सुनसरी','झापा']}
        ];
        var DISTRICTS=[]; 
        PROVINCES.forEach(function(p){ p.districts.forEach(function(d){ DISTRICTS.push({name:d, province:p.name, provKey:p.key}); }); });

        var SECTORS=['सडक','खानेपानी','सिँचाइ','विद्यालय भवन','स्वास्थ्य संस्था','पुल','सामुदायिक भवन','विद्युतीकरण','ढल निकास','पर्यटन पूर्वाधार'];
        var VERB=['निर्माण','स्तरोन्नति','मर्मत सम्भार','विस्तार'];
        var FIRMS=['सुदर्शन निर्माण सेवा','हिमालय कन्स्ट्रक्सन प्रा.लि.','जनकल्याण बिल्डर्स','सगरमाथा इन्जिनियरिङ','अनमोल निर्माण कम्पनी','त्रिवेणी कन्स्ट्रक्सन','शुभम् बिल्डर्स प्रा.लि.','सरस्वती निर्माण सेवा','नवदुर्गा इन्जिनियरिङ','पञ्चकन्या कन्स्ट्रक्सन','मैत्री निर्माण सेवा','उज्यालो बिल्डर्स प्रा.लि.'];
        var LOCALTYPE=['गाउँपालिका','नगरपालिका'];
        var CHECKLIST_CATS=[
          {key:'obj', label:'उद्देश्य तथा लक्ष्य', n:4},
          {key:'qual', label:'गुणस्तर तथा प्राविधिक पक्ष', n:5},
          {key:'fin', label:'आर्थिक तथा समय व्यवस्थापन', n:4},
          {key:'proc', label:'खरिद प्रक्रिया', n:3},
          {key:'sus', label:'दिगोपन तथा उपलब्धि', n:4}
        ];
        var BS_MONTHS=["बैशाख","जेठ","असार","साउन","भदौ","असोज","कार्तिक","मंसिर","पुष","माघ","फागुन","चैत"];

        // Generate synthetic project dataset
        var PROJECTS=[];
        var databaseStats=null;
        var pid=1;
        DISTRICTS.forEach(function(d){
          var count=ri(2,6);
          for(var i=0;i<count;i++){
            var sector=pick(SECTORS);
            var ward=ri(1,12);
            var localName=pick(LOCALTYPE);
            var quality=rf(0.55,0.97);
            var progress=Math.pow(rand(),0.75)*100;
            progress=Math.max(0, Math.min(100, progress*0.6 + quality*45));
            var cost=Math.round(Math.exp(rf(Math.log(700000),Math.log(75000000)))/5000)*5000;
            var spendRatio=Math.max(0, Math.min(1.18, progress/100 + rf(-0.16,0.2) + (1-quality)*0.12));
            var expenditure=Math.round(cost*spendRatio/1000)*1000;
            if(expenditure>cost*1.2) expenditure=Math.round(cost*1.2);

            var checklist=[]; var issueCount=0;
            CHECKLIST_CATS.forEach(function(cat){
              var catAns=[];
              for(var q=0;q<cat.n;q++){
                var yes = rand() < (quality*0.9+0.05);
                if(!yes) issueCount++;
                catAns.push(yes);
              }
              checklist.push({cat:cat.key, label:cat.label, answers:catAns});
            });

            var status = progress>=95 ? 'done' : (progress<6 ? 'notstarted' : (progress<40 ? 'slow' : 'progress'));
            var risk = (issueCount>=4) || ((spendRatio - progress/100) > 0.18);

            var monYear = 2082 + (rand()<0.4?1:0);
            var monMonth = ri(1,12), monDay = ri(1,30);

            PROJECTS.push({
              id:'PRJ-'+String(pid).padStart(4,'0'),
              name: sector+' '+pick(VERB)+' - वडा नं. '+nd(ward)+', '+d.name,
              province:d.province, provKey:d.provKey, district:d.name, sector:sector,
              ward:ward, implementingBody: localName+' कार्यालय, वडा नं. '+nd(ward)+', '+d.name,
              contractor: pick(FIRMS), agreementNo:'सम्झौता-'+nd(ri(100,999))+'/'+nd(monYear),
              approvedCost:cost, expenditure:expenditure, progress:Math.round(progress*10)/10,
              status:status, risk:risk, issueCount:issueCount, checklist:checklist,
              monitorDate: BS_MONTHS[monMonth-1]+' '+nd(monDay)+', '+nd(monYear)
            });
            pid++;
          }
        });

                function normalizeProjectMonitoringRow(row){
                    var form=row.form_data||{};
                    var fields=form.fields||{};
                    var answers=form.answers||{};
                    var checklist=CHECKLIST_CATS.map(function(cat, catIndex){
                        var answersForCategory=[];
                        for(var i=0;i<cat.n;i++) answersForCategory.push(answers['q'+(catIndex*4+i+1)] !== 'no');
                        return {cat:cat.key,label:cat.label,answers:answersForCategory};
                    });
                    var issueCount=checklist.reduce(function(total,cat){ return total+cat.answers.filter(function(answer){return !answer;}).length; },0);
                    var progress=Number(row.progress_percentage)||0;
                    var approvedCost=Number(row.budget_allocated)||0;
                    var expenditure=Number(row.budget_spent)||0;
                    var status=row.status==='completed'?'done':progress<6?'notstarted':progress<40?'slow':'progress';
                    var date=form.monitoring_date||{};
                    return {
                        id:row.id,name:row.project_name||'',province:row.province||'',provKey:'',district:row.district||'',
                        sector:row.project_sector||'',ward:fields.wardNo||'',implementingBody:fields.implementingBody||'',
                        contractor:fields.contractorName||'',agreementNo:fields.agreementNo||'',approvedCost:approvedCost,
                        expenditure:expenditure,progress:progress,status:status,risk:issueCount>0,issueCount:issueCount,
                        checklist:checklist,monitorDate:[date.year,date.month,date.day].filter(Boolean).join('-'),
                        attachments:Array.isArray(row.attachment_data)?row.attachment_data:[]
                    };
                }

                PROJECTS.length = 0;

        // Filter state
        var state={province:'', district:'', sector:'', status:'', search:''};

        var fProvince=document.getElementById('fProvince');
        PROVINCES.forEach(function(p){ var o=document.createElement('option'); o.value=p.name; o.textContent=p.name; fProvince.appendChild(o); });
        var fDistrict=document.getElementById('fDistrict');
        function refreshDistrictOptions(){
          var list = state.province ? DISTRICTS.filter(function(d){return d.province===state.province;}) : DISTRICTS;
          fDistrict.innerHTML='<option value="">सबै जिल्ला</option>'+list.map(function(d){return '<option value="'+d.name+'">'+d.name+'</option>';}).join('');
          fDistrict.value = state.district && list.some(function(d){return d.name===state.district;}) ? state.district : '';
          if(fDistrict.value==='') state.district='';
        }
        refreshDistrictOptions();
        var fSector=document.getElementById('fSector');
        SECTORS.forEach(function(s){ var o=document.createElement('option'); o.value=s; o.textContent=s; fSector.appendChild(o); });
        var fStatus=document.getElementById('fStatus');
        var fSearch=document.getElementById('fSearch');

        fProvince.addEventListener('change', function(){ state.province=fProvince.value; refreshDistrictOptions(); renderAll(); });
        fDistrict.addEventListener('change', function(){ state.district=fDistrict.value; renderAll(); });
        fSector.addEventListener('change', function(){ state.sector=fSector.value; renderAll(); });
        fStatus.addEventListener('change', function(){ state.status=fStatus.value; renderAll(); });
        fSearch.addEventListener('input', function(){ state.search=fSearch.value.trim(); renderAll(); });
        document.getElementById('btnReset').addEventListener('click', function(){
          state={province:'',district:'',sector:'',status:'',search:''};
          fProvince.value=''; refreshDistrictOptions(); fSector.value=''; fStatus.value=''; fSearch.value='';
          renderAll();
        });

        function getFiltered(){
          return PROJECTS.filter(function(p){
            if(state.province && p.province!==state.province) return false;
            if(state.district && p.district!==state.district) return false;
            if(state.sector && p.sector!==state.sector) return false;
            if(state.status){
              if(state.status==='risk'){ if(!p.risk) return false; }
              else if(p.status!==state.status) return false;
            }
            if(state.search){
              var s=state.search.toLowerCase();
              if(p.name.toLowerCase().indexOf(s)===-1 && p.contractor.toLowerCase().indexOf(s)===-1 && p.district.toLowerCase().indexOf(s)===-1) return false;
            }
            return true;
          });
        }

        // Color helpers
        function hexToRgb(h){ h=h.replace('#',''); return [parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)]; }
        function lerpColor(a,b,t){ var A=hexToRgb(a),B=hexToRgb(b); var r=Math.round(A[0]+(B[0]-A[0])*t),g=Math.round(A[1]+(B[1]-A[1])*t),bl=Math.round(A[2]+(B[2]-A[2])*t); return 'rgb('+r+','+g+','+bl+')'; }
        function scaleColor(t,kind){
          t=Math.max(0,Math.min(1,t));
          if(kind==='progress'){ return t<0.5 ? lerpColor('#c23b32','#dd8f2c',t/0.5) : lerpColor('#dd8f2c','#237a4b',(t-0.5)/0.5); }
          if(kind==='issues'){ return t<0.5 ? lerpColor('#237a4b','#dd8f2c',t/0.5) : lerpColor('#dd8f2c','#c23b32',(t-0.5)/0.5); }
          if(kind==='count'){ return t<0.5 ? lerpColor('#eaf1fa','#3f7cb0',t/0.5) : lerpColor('#3f7cb0','#122844',(t-0.5)/0.5); }
          return lerpColor('#eaf1fa','#122844',t);
        }
        var LEGEND_GRADIENTS={ progress:['#c23b32','#dd8f2c','#237a4b'], issues:['#237a4b','#dd8f2c','#c23b32'], budget:['#eaf1fa','#3f7cb0','#122844'], count:['#eaf1fa','#3f7cb0','#122844'] };
        var LEGEND_LABELS={ progress:'कम प्रगति → उच्च प्रगति', issues:'कम समस्या → धेरै समस्या', budget:'कम प्रगति → उच्च प्रगति', count:'कम आयोजना → धेरै आयोजना' };

        // District aggregation
        function aggregateByDistrict(list){
          var map={};
          list.forEach(function(p){
            if(!map[p.district]) map[p.district]={district:p.district, province:p.province, count:0, progressSum:0, cost:0, spent:0, issues:0, risk:0};
            var m=map[p.district];
            m.count++; m.progressSum+=p.progress; m.cost+=p.approvedCost; m.spent+=p.expenditure; m.issues+=p.issueCount; if(p.risk) m.risk++;
          });
          Object.keys(map).forEach(function(k){ map[k].avgProgress = map[k].count? map[k].progressSum/map[k].count : 0; map[k].issueRate = map[k].count? map[k].issues/(map[k].count*20)*100 : 0; });
          return map;
        }

        // Choropleth map
        var mapMetric='progress';
        document.getElementById('mapMetricSeg').addEventListener('click', function(e){
          var b=e.target.closest('button'); if(!b) return;
          document.querySelectorAll('#mapMetricSeg button').forEach(function(x){x.classList.remove('active');});
          b.classList.add('active'); mapMetric=b.dataset.m; renderMap();
        });

        var tooltipEl=document.getElementById('tooltip');
        var lastAgg=null;
        function showTooltip(e,dn){
          var m = lastAgg && lastAgg[dn];
          var html='<b>'+dn+'</b><br>';
          if(m && m.count){
            html+='<div class="tt-row"><span>आयोजना संख्या</span><span class="num">'+nd(m.count)+'</span></div>'+
                  '<div class="tt-row"><span>औसत प्रगति</span><span class="num">'+fmtPct(m.avgProgress)+'</span></div>'+
                  '<div class="tt-row"><span>स्वीकृत लागत</span><span class="num">'+fmtMoney(m.cost)+'</span></div>'+
                  '<div class="tt-row"><span>खर्च</span><span class="num">'+fmtMoney(m.spent)+'</span></div>'+
                  '<div class="tt-row"><span>समस्या दर</span><span class="num">'+fmtPct(m.issueRate)+'</span></div>'+
                  '<div class="tt-row"><span>जोखिमपूर्ण</span><span class="num">'+nd(m.risk)+'</span></div>';
          } else { html+='<span style="color:#c9d3e0;">हालको फिल्टरमा कुनै आयोजना छैन</span>'; }
          tooltipEl.innerHTML=html; tooltipEl.classList.add('show'); moveTooltip(e);
        }
        function moveTooltip(e){ var x=e.clientX+16,y=e.clientY+16; var vw=window.innerWidth,vh=window.innerHeight;
          if(x+240>vw) x=e.clientX-250; if(y+160>vh) y=e.clientY-170;
          tooltipEl.style.left=x+'px'; tooltipEl.style.top=y+'px'; }
        function hideTooltip(){ tooltipEl.classList.remove('show'); }

        function renderMap(){
          var filtered=getFiltered();
          lastAgg=aggregateByDistrict(filtered);
          var vals=Object.keys(lastAgg).map(function(k){
            var m=lastAgg[k];
            return mapMetric==='progress'? m.avgProgress : mapMetric==='issues'? m.issueRate : mapMetric==='count'? m.count : m.cost;
          });
          var min=vals.length?Math.min.apply(null,vals):0, max=vals.length?Math.max.apply(null,vals):1;
          if(min===max) max=min+1;

          var mapContainer = document.getElementById('choroplethMap');
          if (!mapContainer) return;

          function getColor(value) {
            var ratio = (max - min) ? (value - min) / (max - min) : 0;
            return scaleColor(ratio, mapMetric);
          }

          function getDistrictNameFromFeature(feature) {
            var props = feature.properties || {};
            var nameProps = ['NAME', 'name', 'DISTRICT', 'District', 'DISTRICT_NA', 'NAME_2', 'DISTRICT_NAME', 'DISTRICT_N'];
            var englishName = '';
            for (var i = 0; i < nameProps.length; i++) {
              if (props[nameProps[i]]) {
                englishName = String(props[nameProps[i]]);
                break;
              }
            }
            var upper = englishName.toUpperCase().trim();
            if (window.DISTRICT_NAME_MAP) {
              if (window.DISTRICT_NAME_MAP[englishName]) return window.DISTRICT_NAME_MAP[englishName];
              if (window.DISTRICT_NAME_MAP[upper]) return window.DISTRICT_NAME_MAP[upper];
            }
            return englishName;
          }

          function loadGeoJSON() {
            var geojsonUrl = 'https://raw.githubusercontent.com/Acesmndr/nepal-geojson/master/generated-geojson/nepal-with-districts-acesmndr.geojson';
            fetch(geojsonUrl)
              .then(function(response) { return response.json(); })
              .then(function(geojson) {
                function style(feature) {
                  var districtName = getDistrictNameFromFeature(feature);
                  var m = lastAgg[districtName];
                  var value = 0;
                  if (m && m.count) {
                    value = mapMetric === 'progress' ? m.avgProgress : mapMetric === 'issues' ? m.issueRate : mapMetric === 'count' ? m.count : m.cost;
                  }
                  return {
                    fillColor: getColor(value),
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                  };
                }
                function highlightFeature(e) {
                  var layer = e.target;
                  layer.setStyle({ weight: 3, color: '#666', dashArray: '', fillOpacity: 0.9 });
                  layer.bringToFront();
                }
                function resetHighlight(e) {
                  if (window.pmGeojsonLayer) window.pmGeojsonLayer.resetStyle(e.target);
                }
                function onEachFeature(feature, layer) {
                  var districtName = getDistrictNameFromFeature(feature);
                  var m = lastAgg[districtName];
                  if (m && m.count) {
                    var popupContent = '<strong>' + districtName + '</strong><br>' +
                      'आयोजना संख्या: ' + nd(m.count) + '<br>' +
                      'औसत प्रगति: ' + fmtPct(m.avgProgress) + '<br>' +
                      'समस्या दर: ' + fmtPct(m.issueRate) + '<br>' +
                      'जोखिमपूर्ण: ' + nd(m.risk) + '<br>' +
                      'स्वीकृत लागत: ' + fmtMoney(m.cost) + '<br>' +
                      'खर्च: ' + fmtMoney(m.spent);
                    layer.bindPopup(popupContent);
                  }
                  layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                    click: function() {
                      window.pmPendingPopupDistrict = districtName;
                    }
                  });
                }
                if (window.pmGeojsonLayer) {
                  window.pmChoroplethMap.removeLayer(window.pmGeojsonLayer);
                  window.pmGeojsonLayer = null;
                }
                window.pmGeojsonLayer = L.geoJSON(geojson, { style: style, onEachFeature: onEachFeature }).addTo(window.pmChoroplethMap);
                window.pmChoroplethMap.fitBounds(window.pmGeojsonLayer.getBounds(), { padding: [20, 20], maxZoom: 7 });

                if (window.pmPendingPopupDistrict) {
                  var popupLayer = window.pmGeojsonLayer.getLayers().find(function(layer){
                    return getDistrictNameFromFeature(layer.feature) === window.pmPendingPopupDistrict;
                  });
                  if (popupLayer) {
                    popupLayer.openPopup();
                  }
                  window.pmPendingPopupDistrict = null;
                }
              })
              .catch(function(error) {
                console.error('Error loading GeoJSON:', error);
              });
          }

          if (!window.pmChoroplethMap) {
            window.pmChoroplethMap = L.map(mapContainer, {
              center: [28.3949, 84.1240],
              zoom: 6,
              preferCanvas: true,
              scrollWheelZoom: true,
              maxBounds: [[26.0, 80.0], [30.5, 88.5]],
              maxBoundsViscosity: 1.0
            });

            if (!window.pmMapTileLayer) {
              window.pmMapTileLayer = L.tileLayer('', {
                attribution: ''
              });
            }
            window.pmMapTileLayer.addTo(window.pmChoroplethMap);
            mapContainer.style.backgroundColor = '#f8f9fa';
          }

          setTimeout(function(){
            if (window.pmChoroplethMap) {
              window.pmChoroplethMap.invalidateSize();
            }
            loadGeoJSON();
          }, 150);

          var g=LEGEND_GRADIENTS[mapMetric];
          document.getElementById('legendScale').style.setProperty('--lg1',g[0]);
          document.getElementById('legendScale').style.setProperty('--lg2',g[1]);
          document.getElementById('legendScale').style.setProperty('--lg3',g[2]);
          document.getElementById('legendLabel').textContent=LEGEND_LABELS[mapMetric];
        }

        // Stat cards
        function renderStats(list){
          var count=list.length;
          var cost=0,spent=0,progSum=0,issues=0,risk=0;
          list.forEach(function(p){ cost+=p.approvedCost; spent+=p.expenditure; progSum+=p.progress; issues+=p.issueCount; if(p.risk) risk++; });
          var avgProgress = count? progSum/count : 0;
                    if(databaseStats && !state.province && !state.district && !state.sector && !state.status && !state.search){
                        count=Number(databaseStats.total)||0;
                        cost=Number(databaseStats.total_budget_allocated)||0;
                        spent=Number(databaseStats.total_budget_spent)||0;
                        avgProgress=Number(databaseStats.average_progress)||0;
                        issues=Number(databaseStats.issues_count)||0;
                        risk=Number(databaseStats.risk_count)||0;
                    }
          var spentPct = cost? (spent/cost*100) : 0;

          document.getElementById('statCount').textContent = nd(count);
          document.getElementById('statCountSub').textContent = count ? (nd((new Set(list.map(function(p){return p.district;}))).size)+' जिल्लामा फैलिएको') : '—';
          document.getElementById('statCost').textContent = fmtMoney(cost);
          document.getElementById('statCostSub').textContent = 'औसत '+fmtMoney(count?cost/count:0)+' प्रति आयोजना';
          document.getElementById('statSpent').textContent = fmtMoney(spent);
          var spendSub=document.getElementById('statSpentSub');
          spendSub.textContent = fmtPct(spentPct)+' खर्च भएको';
          spendSub.className='stat-sub '+(spentPct>85?'up':(spentPct<30?'down':''));
          document.getElementById('statProgress').textContent = fmtPct(avgProgress);
          var doneCt=list.filter(function(p){return p.status==='done';}).length;
          document.getElementById('statProgressSub').textContent = nd(doneCt)+' वटा सम्पन्न';
          document.getElementById('statIssues').textContent = nd(issues);
          document.getElementById('statIssuesSub').textContent = count? fmtPct(issues/(count*20)*100)+' औसत समस्या दर' : '—';
          var riskEl=document.getElementById('statRisk');
          riskEl.textContent = nd(risk);
          document.getElementById('statRiskSub').textContent = count? fmtPct(risk/count*100)+' आयोजना जोखिममा' : '—';

          document.getElementById('metaProjects').textContent = nd(PROJECTS.length);
          document.getElementById('metaDistricts').textContent = nd(DISTRICTS.length);
          var totalAvg = PROJECTS.reduce(function(a,p){return a+p.progress;},0)/PROJECTS.length;
          document.getElementById('metaProgress').textContent = fmtPct(totalAvg);

          document.getElementById('filterCount').textContent = nd(count);
          document.getElementById('filterTotal').textContent = nd(PROJECTS.length);
        }

        // Charts
        var chartProvince, chartStatus, chartChecklist, chartScatter;
        function buildCharts(list){
          var canvasProvince = document.getElementById('chartProvince');
          var canvasStatus = document.getElementById('chartStatus');
          var canvasChecklist = document.getElementById('chartChecklist');
          var canvasScatter = document.getElementById('chartScatter');
          
          if (!canvasProvince || !canvasStatus || !canvasChecklist || !canvasScatter) return;

          var byProv = PROVINCES.map(function(p){
            var sub=list.filter(function(x){return x.province===p.name;});
            var avg = sub.length? sub.reduce(function(a,x){return a+x.progress;},0)/sub.length : 0;
            return {name:p.short, full:p.name, count:sub.length, avg:avg};
          });

          var ctx1=canvasProvince.getContext('2d');
          var data1={
            labels: byProv.map(function(p){return p.name;}),
            datasets:[
              {type:'bar', label:'आयोजना संख्या', data:byProv.map(function(p){return p.count;}), backgroundColor:'#3f7cb0', borderRadius:5, yAxisID:'y', order:2},
              {type:'line', label:'औसत प्रगति %', data:byProv.map(function(p){return Math.round(p.avg*10)/10;}), borderColor:'#dd8f2c', backgroundColor:'#dd8f2c', pointRadius:4, pointBackgroundColor:'#dd8f2c', tension:.35, yAxisID:'y1', order:1}
            ]
          };
          if(chartProvince){ chartProvince.data=data1; chartProvince.update(); }
          else chartProvince=new Chart(ctx1,{data:data1, options:{
            responsive:true, maintainAspectRatio:false,
            interaction:{mode:'index',intersect:false},
            plugins:{legend:{position:'bottom', labels:{boxWidth:12,padding:14}}},
            scales:{
              y:{position:'left', title:{display:true,text:'आयोजना संख्या'}, grid:{color:'#eef1f6'}},
              y1:{position:'right', min:0, max:100, title:{display:true,text:'प्रगति %'}, grid:{drawOnChartArea:false}}
            }
          }});

          var statusCounts={done:0, progress:0, slow:0, notstarted:0};
          list.forEach(function(p){ statusCounts[p.status]++; });
          var ctx2=document.getElementById('chartStatus').getContext('2d');
          var data2={
            labels:['सम्पन्न','प्रगतिमा','सुस्त प्रगति','सुरु हुन बाँकी'],
            datasets:[{ data:[statusCounts.done,statusCounts.progress,statusCounts.slow,statusCounts.notstarted],
              backgroundColor:['#237a4b','#3f7cb0','#dd8f2c','#c23b32'], borderWidth:2, borderColor:'#fff' }]
          };
          if(chartStatus){ chartStatus.data=data2; chartStatus.update(); }
          else chartStatus=new Chart(ctx2,{type:'doughnut', data:data2, options:{
            responsive:true, maintainAspectRatio:false, cutout:'62%',
            plugins:{legend:{position:'bottom', labels:{boxWidth:12,padding:14}}}
          }});

          var catRates = CHECKLIST_CATS.map(function(cat){
            var total=0, no=0;
            list.forEach(function(p){
              var block=p.checklist.find(function(c){return c.cat===cat.key;});
              block.answers.forEach(function(a){ total++; if(!a) no++; });
            });
            return {label:cat.label, rate: total? no/total*100 : 0};
          });
          var ctx3=document.getElementById('chartChecklist').getContext('2d');
          var data3={ labels:catRates.map(function(c){return c.label;}),
            datasets:[{ label:'समस्या दर %', data:catRates.map(function(c){return Math.round(c.rate*10)/10;}),
              backgroundColor:catRates.map(function(c){return c.rate>25?'#c23b32':c.rate>15?'#dd8f2c':'#237a4b';}), borderRadius:5 }] };
          if(chartChecklist){ chartChecklist.data=data3; chartChecklist.update(); }
          else chartChecklist=new Chart(ctx3,{type:'bar', data:data3, options:{
            indexAxis:'y', responsive:true, maintainAspectRatio:false,
            plugins:{legend:{display:false}},
            scales:{ x:{min:0,max:100,title:{display:true,text:'समस्या दर %'}, grid:{color:'#eef1f6'}}, y:{grid:{display:false}} }
          }});

          var ctx4=document.getElementById('chartScatter').getContext('2d');
          var statusColor={done:'#237a4b', progress:'#3f7cb0', slow:'#dd8f2c', notstarted:'#c23b32'};
          var pts=list.map(function(p){ return {x:Math.round((p.expenditure/(p.approvedCost||1))*1000)/10, y:p.progress, bg:p.risk?'#c23b32':statusColor[p.status], r: p.risk?5.5:3.8}; });
          var data4={ datasets:[{ label:'आयोजना', data:pts,
            backgroundColor:pts.map(function(p){return p.bg;}), pointRadius:pts.map(function(p){return p.r;}), pointHoverRadius:7 }] };
          if(chartScatter){ chartScatter.data=data4; chartScatter.update(); }
          else chartScatter=new Chart(ctx4,{type:'scatter', data:data4, options:{
            responsive:true, maintainAspectRatio:false,
            plugins:{legend:{display:false}, tooltip:{callbacks:{label:function(c){return 'खर्च '+nd(c.raw.x)+'% • प्रगति '+nd(c.raw.y.toFixed(0))+'%';}}}},
            scales:{ x:{min:0,max:130,title:{display:true,text:'खर्च भएको (लागतको % मा)'}, grid:{color:'#eef1f6'}},
                     y:{min:0,max:100,title:{display:true,text:'भौतिक प्रगति %'}, grid:{color:'#eef1f6'}} }
          }});
        }

        // Table
        var sortKey='progress', sortDir=-1, page=1, pageSize=10;
        var statusLabel={done:'सम्पन्न', progress:'प्रगतिमा', slow:'सुस्त प्रगति', notstarted:'सुरु हुन बाँकी'};
        var statusBadge={done:'ok', progress:'gray', slow:'mid', notstarted:'low'};

        document.querySelectorAll('table.dtb thead th').forEach(function(th){
          th.addEventListener('click', function(){
            var k=th.dataset.k;
                        if (!k) return;
            if(sortKey===k) sortDir*=-1; else { sortKey=k; sortDir = (k==='name'||k==='province'||k==='district'||k==='sector')?1:-1; }
            page=1; renderTable(getFiltered());
          });
        });
        var pgPrev = document.getElementById('pgPrev');
        var pgNext = document.getElementById('pgNext');
        if (pgPrev) pgPrev.addEventListener('click', function(){ if(page>1){page--; renderTable(getFiltered());} });
        if (pgNext) pgNext.addEventListener('click', function(){ page++; renderTable(getFiltered()); });

        function renderTable(list){
          var tbody=document.getElementById('tblBody');
          if (!tbody) return;
          
                    document.querySelectorAll('table.dtb thead th').forEach(function(th){
                        th.classList.toggle('active-sort', th.dataset.k===sortKey);
                        var arrow = th.querySelector('.arrow');
                        if (arrow) arrow.textContent = (th.dataset.k===sortKey && sortDir===1) ? '▴':'▾';
                    });
          var sorted=list.slice().sort(function(a,b){
            var av=a[sortKey], bv=b[sortKey];
            if(typeof av==='string') return av.localeCompare(bv,'ne')*sortDir;
            return (av-bv)*sortDir;
          });
          var totalPages=Math.max(1,Math.ceil(sorted.length/pageSize));
          if(page>totalPages) page=totalPages;
          var startIdx=(page-1)*pageSize;
          var pageItems=sorted.slice(startIdx,startIdx+pageSize);

          if(!pageItems.length){ tbody.innerHTML='<tr class="empty-row"><td colspan="11">फिल्टर मापदण्ड अनुसार कुनै आयोजना फेला परेन।</td></tr>'; }
          else{
            tbody.innerHTML = pageItems.map(function(p){
              var barColor = p.progress>=95?'#237a4b':p.progress>=40?'#3f7cb0':p.progress>=6?'#dd8f2c':'#c23b32';
              window.pmAttachmentData = window.pmAttachmentData || {};
              window.pmAttachmentData[p.id] = p.attachments || [];
              var photoActions=(p.attachments||[]).length ? (p.attachments||[]).map(function(file,index){ return '<button type="button" class="pm-icon-btn" title="फोटो हेर्नुहोस्" onclick="event.stopPropagation();viewProjectPhoto(\''+p.id+'\','+index+')"><i class="fas fa-eye"></i></button><button type="button" class="pm-icon-btn" title="फोटो डाउनलोड गर्नुहोस्" onclick="event.stopPropagation();downloadProjectPhoto(\''+p.id+'\','+index+')"><i class="fas fa-download"></i></button>'; }).join('') : '-';
              return '<tr data-id="'+p.id+'">'+
                '<td class="cell-name" title="'+p.name+'">'+p.name+'</td>'+
                '<td>'+p.province.replace(' प्रदेश','')+'</td>'+
                '<td>'+p.district+'</td>'+
                '<td>'+p.sector+'</td>'+
                '<td class="num">'+fmtMoney(p.approvedCost)+'</td>'+
                '<td class="num">'+fmtMoney(p.expenditure)+'</td>'+
                '<td class="num">'+fmtPct(p.progress)+'<span class="mini-bar"><i style="width:'+p.progress+'%;background:'+barColor+';"></i></span></td>'+
                '<td><span class="badge '+statusBadge[p.status]+'">'+statusLabel[p.status]+'</span></td>'+
                                '<td>'+(p.issueCount>0? '<span class="badge '+(p.risk?'risk':'mid')+'">'+nd(p.issueCount)+(p.risk?' ⚠':'')+'</span>' : '<span class="badge ok">० ✓</span>')+'</td>'+ 
                                '<td><div class="pm-photo-actions">'+photoActions+'</div></td>'+ 
                                '<td><button type="button" class="pm-icon-btn" title="हेर्नुहोस्" onclick="event.stopPropagation();viewProjectMonitoring(\''+p.id+'\')"><i class="fas fa-eye"></i></button><button type="button" class="pm-icon-btn" title="सम्पादन" onclick="event.stopPropagation();editProjectMonitoring(\''+p.id+'\')"><i class="fas fa-edit"></i></button><button type="button" class="pm-icon-btn pm-delete" title="मेटाउनुहोस्" onclick="event.stopPropagation();deleteProjectMonitoring(\''+p.id+'\')"><i class="fas fa-trash"></i></button></td>'+ 
              '</tr>';
            }).join('');
            tbody.querySelectorAll('tr').forEach(function(tr){ tr.addEventListener('click', function(){ openModal(tr.dataset.id); }); });
          }
          var pagerInfo = document.getElementById('pagerInfo');
          if (pagerInfo) pagerInfo.textContent = sorted.length? ('पृष्ठ '+nd(page)+' / '+nd(totalPages)+' — कुल '+nd(sorted.length)+' मध्ये '+nd(startIdx+1)+'–'+nd(Math.min(startIdx+pageSize,sorted.length))) : 'कुनै नतिजा छैन';
          if (pgPrev) pgPrev.disabled = page<=1;
          if (pgNext) pgNext.disabled = page>=totalPages;
        }

        // Modal
        function openModal(id){
          var p=PROJECTS.find(function(x){return x.id===id;});
          if(!p) return;
          document.getElementById('mTitle').textContent=p.name;
          var html='';
          html+='<div class="mrow"><span class="k">प्रदेश / जिल्ला</span><span class="v">'+p.province+' • '+p.district+'</span></div>';
          html+='<div class="mrow"><span class="k">क्षेत्र</span><span class="v">'+p.sector+'</span></div>';
          html+='<div class="mrow"><span class="k">कार्यान्वयन गर्ने निकाय</span><span class="v">'+p.implementingBody+'</span></div>';
          html+='<div class="mrow"><span class="k">ठेकेदार</span><span class="v">'+p.contractor+'</span></div>';
          html+='<div class="mrow"><span class="k">सम्झौता नं.</span><span class="v">'+p.agreementNo+'</span></div>';
          html+='<div class="mrow"><span class="k">स्वीकृत लागत</span><span class="v">'+fmtMoney(p.approvedCost)+'</span></div>';
          html+='<div class="mrow"><span class="k">हालसम्म खर्च</span><span class="v">'+fmtMoney(p.expenditure)+' ('+fmtPct(p.expenditure/p.approvedCost*100)+')</span></div>';
          html+='<div class="mrow"><span class="k">भौतिक प्रगति</span><span class="v">'+fmtPct(p.progress)+'</span></div>';
          html+='<div class="mrow"><span class="k">स्थिति</span><span class="v"><span class="badge '+statusBadge[p.status]+'">'+statusLabel[p.status]+'</span>'+(p.risk?' <span class="badge risk">⚠ जोखिमपूर्ण</span>':'')+'</span></div>';
          html+='<div class="mrow"><span class="k">अनुगमन मिति</span><span class="v">'+p.monitorDate+'</span></div>';
          html+='<div class="cat-block"><h4>चेकलिस्ट श्रेणीगत अवस्था (२० बुँदा)</h4>';
          p.checklist.forEach(function(c){
            var yesCt=c.answers.filter(Boolean).length, pct=Math.round(yesCt/c.answers.length*100);
            var col = pct>=80?'#237a4b':pct>=50?'#dd8f2c':'#c23b32';
            html+='<div class="cat-bar-row"><span class="lbl">'+c.label+'</span><div class="cat-bar-track"><div class="cat-bar-fill" style="width:'+pct+'%;background:'+col+';"></div></div><span class="cat-bar-pct num">'+nd(pct)+'%</span></div>';
          });
          html+='</div>';
          document.getElementById('mBody').innerHTML=html;
          document.getElementById('modalBg').classList.add('show');
        }
        window.closeModal=function(){ document.getElementById('modalBg').classList.remove('show'); };
        document.getElementById('modalBg').addEventListener('click', function(e){ if(e.target===this) closeModal(); });

                window.viewProjectMonitoring=function(id){ openModal(id); };
                window.editProjectMonitoring=function(id){
                    var p=PROJECTS.find(function(item){return item.id===id;});
                    if(!p) return;
                    document.getElementById('projectMonitoringForm').click();
                    document.getElementById('projectName').value=p.name||'';
                    document.getElementById('province').value=p.province||'';
                    document.getElementById('district').value=p.district||'';
                    document.getElementById('implementingBody').value=p.implementingBody||'';
                    document.getElementById('contractorName').value=p.contractor||'';
                    document.getElementById('agreementNo').value=p.agreementNo||'';
                    document.getElementById('approvedCost').value=p.approvedCost||'';
                    document.getElementById('expenditureSoFar').value=p.expenditure||'';
                    document.getElementById('physicalProgress').value=p.progress||'';
                };
                window.deleteProjectMonitoring=async function(id){
                    if(!confirm('के तपाईं यो आयोजना अभिलेख मेटाउन निश्चित हुनुहुन्छ?')) return;
                    try { var result=await ProjectMonitoringAPI.delete(id); if(!result.success) throw new Error(result.error||'मेटाउन सकिएन'); PROJECTS=PROJECTS.filter(function(item){return item.id!==id;}); renderAll(); }
                    catch(error){ alert('अभिलेख मेटाउन सकिएन: '+error.message); }
                };
                window.viewProjectPhoto=function(id,index){ var file=(window.pmAttachmentData?.[id]||[])[index]; if(!file?.dataUrl) return alert('यो फोटोको सामग्री उपलब्ध छैन।'); window.open(file.dataUrl,'_blank','noopener'); };
                window.downloadProjectPhoto=function(id,index){ var file=(window.pmAttachmentData?.[id]||[])[index]; if(!file?.dataUrl) return alert('यो फोटोको सामग्री उपलब्ध छैन।'); var link=document.createElement('a'); link.href=file.dataUrl; link.download=file.name||'project-photo'; document.body.appendChild(link); link.click(); link.remove(); };

        // Master render
        function renderAll(){
            const filtered = getFiltered();
            renderStats(filtered);
            renderTable(filtered);
            renderMap();
            if (typeof Chart !== 'undefined') {
                buildCharts(filtered);
            } else {
            }
        }

        // Initialize with persisted project monitoring data
        PROJECTS=[];
        renderAll();
        Promise.all([ProjectMonitoringAPI.getAll(), ProjectMonitoringAPI.getStatistics()]).then(function(results){
            var entriesResult=results[0], statsResult=results[1];
            if (!entriesResult.success) throw new Error(entriesResult.error || 'आयोजना अनुगमन डाटा लोड हुन सकेन');
            PROJECTS.push.apply(PROJECTS, (entriesResult.data || []).map(normalizeProjectMonitoringRow));
            if (statsResult.success) databaseStats=statsResult.data;
            renderAll();
        }).catch(function(error){ console.error('Error loading project monitoring dashboard data:', error); });
    }

    // ---------- Chhanbin Anbeshan Functionality ----------
    function initializeChhanbinFunctionality() {
        let chhanbinRecords = [];
        let chhanbinCounter = 0;
        window.chhanbinAttachmentData = window.chhanbinAttachmentData || {};

        const chhanbinModalOverlay = document.getElementById('chhanbinModalOverlay');
        const chhanbinOpenModalBtn = document.getElementById('openModalBtn');
        const chhanbinCloseModalBtn = document.getElementById('chhanbinCloseModalBtn');
        const chhanbinCancelBtn = document.getElementById('chhanbinCancelBtn');
        const chhanbinSaveBtn = document.getElementById('chhanbinSaveBtn');
        const chhanbinRecordsBody = document.getElementById('chhanbinRecordsBody');
        const chhanbinEmptyRow = document.getElementById('chhanbinEmptyRow');

        function chhanbinOpenModal() {
            chhanbinModalOverlay.classList.add('active');
        }

        function chhanbinCloseModal() {
            chhanbinModalOverlay.classList.remove('active');
            chhanbinClearFormFields();
        }

        function chhanbinClearFormFields() {
            document.getElementById('chhanbinFRegNo').value = '';
            document.getElementById('chhanbinFRegDate').value = '';
            document.getElementById('chhanbinFComplainant').value = '';
            document.getElementById('chhanbinFRespondent').value = '';
            document.getElementById('chhanbinFOffice').value = '';
            document.getElementById('chhanbinFDetails').value = '';
            document.getElementById('chhanbinFInvestigationDate').value = '';
            document.getElementById('chhanbinFReportDate').value = '';
            document.getElementById('chhanbinFReportSummary').value = '';
            document.getElementById('chhanbinFFile').value = '';
        }

        if (chhanbinOpenModalBtn) {
            chhanbinOpenModalBtn.addEventListener('click', chhanbinOpenModal);
        }
        if (chhanbinCloseModalBtn) {
            chhanbinCloseModalBtn.addEventListener('click', chhanbinCloseModal);
        }
        if (chhanbinCancelBtn) {
            chhanbinCancelBtn.addEventListener('click', chhanbinCloseModal);
        }
        if (chhanbinModalOverlay) {
            chhanbinModalOverlay.addEventListener('click', (e) => {
                if (e.target === chhanbinModalOverlay) chhanbinCloseModal();
            });
        }

        if (chhanbinSaveBtn) {
            chhanbinSaveBtn.addEventListener('click', async () => {
                const regNo = document.getElementById('chhanbinFRegNo').value.trim();
                const regDate = document.getElementById('chhanbinFRegDate').value.trim();
                const complainant = document.getElementById('chhanbinFComplainant').value.trim();
                const respondent = document.getElementById('chhanbinFRespondent').value.trim();
                const office = document.getElementById('chhanbinFOffice').value.trim();
                const details = document.getElementById('chhanbinFDetails').value.trim();
                const investigationDate = document.getElementById('chhanbinFInvestigationDate').value.trim();
                const reportDate = document.getElementById('chhanbinFReportDate').value.trim();
                const reportSummary = document.getElementById('chhanbinFReportSummary').value.trim();
                const fileInput = document.getElementById('chhanbinFFile');
                
                // Handle file attachments
                let fileNames = [];
                if (fileInput.files.length > 0) {
                    for (let i = 0; i < fileInput.files.length; i++) {
                        fileNames.push({ name: fileInput.files[i].name, type: fileInput.files[i].type });
                    }
                }

                if (!regNo || !complainant) {
                    alert('कृपया उजुरी दर्ता नं र उजुरकर्ताको नाम भर्नुहोस्।');
                    return;
                }

                try {
                    const result = await InvestigationsAPI.create({
                        complaint_registration_number: regNo,
                        investigation_title: details || regNo,
                        investigation_type: 'छानविन/अन्वेषण',
                        investigation_date: investigationDate || regDate || new Date().toISOString().slice(0, 10),
                        investigator_name: '',
                        investigation_team: '',
                        location: office,
                        province: '',
                        district: '',
                        status: reportDate ? 'completed' : 'ongoing',
                        findings: details,
                        recommendations: reportSummary,
                        action_taken: '',
                        completion_date: reportDate || null,
                        fiscal_year: '',
                        registration_date: regDate,
                        complainant_name: complainant,
                        respondent_name: respondent,
                        office,
                        complaint_details: details,
                        report_date: reportDate,
                        report_summary: reportSummary,
                        attachment_data: await Promise.all(Array.from(fileInput.files).map(file => new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = () => resolve({ name: file.name, type: file.type, dataUrl: reader.result });
                            reader.onerror = () => reject(new Error(file.name + ' पढ्न सकिएन'));
                            reader.readAsDataURL(file);
                        })))
                    });
                    if (!result.success) throw new Error(result.error || 'अभिलेख सुरक्षित हुन सकेन');
                    chhanbinCloseModal();
                    await chhanbinLoadRecords();
                    if (window.loadStatistics && window.loadStatistics.investigations) {
                        window.loadStatistics.investigations();
                    }
                } catch (error) {
                    console.error('Chhanbin save error:', error);
                    alert('अभिलेख सुरक्षित हुन सकेन: ' + error.message);
                }
            });
        }

        async function chhanbinLoadRecords() {
            try {
                const result = await InvestigationsAPI.getAll();
                if (!result.success) throw new Error(result.error || 'अभिलेख लोड हुन सकेन');
                chhanbinRecords = (result.data || []).map((row, index) => ({
                    id: row.id,
                    sn: index + 1,
                    regNo: row.complaint_registration_number || '',
                    regDate: row.registration_date || '',
                    complainant: row.complainant_name || '',
                    respondent: row.respondent_name || '',
                    office: row.office || row.location || '',
                    details: row.complaint_details || row.findings || row.investigation_title || '',
                    investigationDate: row.investigation_date || '',
                    reportDate: row.report_date || row.completion_date || '',
                    reportSummary: row.report_summary || row.recommendations || '',
                    files: Array.isArray(row.attachment_data) ? row.attachment_data : []
                }));
                window.chhanbinAttachmentData = Object.fromEntries(chhanbinRecords.map(row => [row.id, row.files]));
                chhanbinCounter = chhanbinRecords.length;
                chhanbinRenderTable();
            } catch (error) {
                console.error('Chhanbin load error:', error);
            }
        }

        function chhanbinUpdateStats() {
            const now = new Date();
            // Nepali fiscal year starts ~July 16; use July 1 as safe boundary
            const fyStartYear = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
            const fyStart    = new Date(fyStartYear,     6, 1);   // 1 July  (current FY start)
            const fyEnd      = new Date(fyStartYear + 1, 5, 30);  // 30 June (current FY end)
            const prevFyStart = new Date(fyStartYear - 1, 6, 1);
            const prevFyEnd   = new Date(fyStartYear,     5, 30);

            function inRange(dateStr, from, to) {
                if (!dateStr) return false;
                const d = new Date(dateStr);
                return !isNaN(d) && d >= from && d <= to;
            }

            const total     = chhanbinRecords.length;
            const chalauAv  = chhanbinRecords.filter(r => inRange(r.regDate, fyStart, fyEnd)).length;
            const gatAvJari = chhanbinRecords.filter(r =>
                inRange(r.regDate, prevFyStart, prevFyEnd) && !(r.reportDate && r.reportDate.trim())
            ).length;
            const sampanna  = chhanbinRecords.filter(r => r.reportDate && r.reportDate.trim()).length;
            const chalau    = chhanbinRecords.filter(r => !(r.reportDate && r.reportDate.trim())).length;

            function toNep(n) {
                return String(n).replace(/[0-9]/g, d => '०१२३४५६७८९'[d]);
            }
            const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = toNep(val); };
            set('chhanbinStatTotal',    total);
            set('chhanbinStatChalauAv', chalauAv);
            set('chhanbinStatGatAv',    gatAvJari);
            set('chhanbinStatSampanna', sampanna);
            set('chhanbinStatChalau',   chalau);
        }

        function chhanbinRenderTable() {
            if (!chhanbinRecordsBody) return;
            chhanbinUpdateStats();
            if (chhanbinRecords.length === 0) {
                chhanbinRecordsBody.innerHTML = '<tr class="chhanbin-empty-row" id="chhanbinEmptyRow"><td colspan="12">कुनै छानविन/अन्वेषण अभिलेख छैन।</td></tr>';
                return;
            }
            chhanbinRecordsBody.innerHTML = chhanbinRecords.map(r => `
                <tr>
                    <td>${r.sn}</td>
                    <td>${chhanbinEscapeHtml(r.regNo)}</td>
                    <td>${chhanbinEscapeHtml(formatChhanbinDate(r.regDate))}</td>
                    <td>${chhanbinEscapeHtml(r.complainant)}</td>
                    <td>${chhanbinEscapeHtml(r.respondent)}</td>
                    <td>${chhanbinEscapeHtml(r.office)}</td>
                    <td>${chhanbinEscapeHtml(r.details)}</td>
                    <td>${chhanbinEscapeHtml(formatChhanbinDate(r.investigationDate))}</td>
                    <td>${chhanbinEscapeHtml(formatChhanbinDate(r.reportDate))}</td>
                    <td>${chhanbinEscapeHtml(r.reportSummary)}</td>
                    <td>${r.files && r.files.length > 0 ? r.files.map((file, index) => `<span class="chhanbin-file-actions"><button type="button" title="फाइल हेर्नुहोस्" onclick="viewChhanbinAttachment('${r.id}', ${index})"><i class="fas fa-eye"></i></button><button type="button" title="फाइल डाउनलोड गर्नुहोस्" onclick="downloadChhanbinAttachment('${r.id}', ${index})"><i class="fas fa-download"></i></button></span>`).join(' ') : '-'}</td>
                    <td>
                        <div class="chhanbin-action-btns">
                            <button type="button" class="chhanbin-action-btn edit chhanbin-icon-action" title="सम्पादन" aria-label="सम्पादन" onclick="chhanbinEditRecord(${r.sn})"><i class="fas fa-edit"></i></button>
                            <button type="button" class="chhanbin-action-btn delete chhanbin-icon-action" title="मेटाउने" aria-label="मेटाउने" onclick="chhanbinDeleteRecord(${r.sn})"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }


        function chhanbinEscapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }

        function formatChhanbinDate(value) {
            return String(value || '').slice(0, 10).replace(/[0-9]/g, d => '०१२३४५६७८९'[d]);
        }

        window.viewChhanbinAttachment = function(entryId, fileIndex) {
            const file = (window.chhanbinAttachmentData[entryId] || [])[fileIndex];
            if (!file?.dataUrl) return alert('यो फाइलको सामग्री उपलब्ध छैन।');
            window.open(file.dataUrl, '_blank', 'noopener');
        };

        window.downloadChhanbinAttachment = function(entryId, fileIndex) {
            const file = (window.chhanbinAttachmentData[entryId] || [])[fileIndex];
            if (!file?.dataUrl) return alert('यो फाइलको सामग्री उपलब्ध छैन।');
            const link = document.createElement('a');
            link.href = file.dataUrl;
            link.download = file.name || 'investigation-attachment';
            document.body.appendChild(link);
            link.click();
            link.remove();
        };

        // Make functions globally accessible
        window.chhanbinDeleteRecord = function(sn) {
            if (confirm('के तपाईं यो अभिलेख मेटाउन निश्चित हुनुहुन्छ?')) {
                chhanbinRecords = chhanbinRecords.filter(r => r.sn !== sn);
                chhanbinRenderTable();
            }
        };

        window.chhanbinEditRecord = function(sn) {
            const rec = chhanbinRecords.find(r => r.sn === sn);
            if (!rec) return;
            document.getElementById('chhanbinFRegNo').value = rec.regNo;
            document.getElementById('chhanbinFRegDate').value = rec.regDate;
            document.getElementById('chhanbinFComplainant').value = rec.complainant;
            document.getElementById('chhanbinFRespondent').value = rec.respondent;
            document.getElementById('chhanbinFOffice').value = rec.office;
            document.getElementById('chhanbinFDetails').value = rec.details;
            document.getElementById('chhanbinFInvestigationDate').value = rec.investigationDate;
            document.getElementById('chhanbinFReportDate').value = rec.reportDate;
            document.getElementById('chhanbinFReportSummary').value = rec.reportSummary;
            document.getElementById('chhanbinFFile').value = ''; // Reset file input on edit

            // Remove old record; new save will re-add with same sn ordering
            chhanbinRecords = chhanbinRecords.filter(r => r.sn !== sn);
            chhanbinRenderTable();
            chhanbinOpenModal();
        };

        chhanbinLoadRecords();
    }

    // Audit Log Functionality
    function initializeAuditLogFunctionality() {
        const storedAuditUser = sessionStorage.getItem('dashboardUser') || localStorage.getItem('dashboardUser');
        let auditUser = null;
        try {
            auditUser = storedAuditUser ? JSON.parse(storedAuditUser) : null;
        } catch (error) {
            auditUser = null;
        }
        const auditUserIsAdmin = auditUser?.role === 'admin';
        let auditLogs = [];
        let currentPage = 1;
        const itemsPerPage = 10;

        const auditLogTableBody = document.getElementById('auditLogTableBody');
        const auditLogSearch = document.getElementById('auditLogSearch');
        const auditLogFilter = document.getElementById('auditLogFilter');
        const auditLogRefresh = document.getElementById('auditLogRefresh');
        const auditLogPrevBtn = document.getElementById('auditLogPrevBtn');
        const auditLogNextBtn = document.getElementById('auditLogNextBtn');
        const auditLogCurrentPage = document.getElementById('auditLogCurrentPage');
        const auditLogTotalPages = document.getElementById('auditLogTotalPages');

        // Stats elements
        const totalInstancesEl = document.getElementById('totalInstances');
        const activeInstancesEl = document.getElementById('activeInstances');
        const todayActivityEl = document.getElementById('todayActivity');
        const errorCountEl = document.getElementById('errorCount');

        function updateStats() {
            const uniqueInstances = [...new Set(auditLogs.map(log => log.instanceId))];
            const activeCount = uniqueInstances.length;
            const today = new Date().toISOString().split('T')[0];
            const todayLogs = auditLogs.filter(log => log.timestamp.startsWith(today));
            const errors = auditLogs.filter(log => log.status === 'error').length;

            totalInstancesEl.textContent = uniqueInstances.length;
            activeInstancesEl.textContent = activeCount;
            todayActivityEl.textContent = todayLogs.length;
            errorCountEl.textContent = errors;
        }

        function getActivityLabel(activity) {
            const labels = {
                'create': 'सिर्जना',
                'update': 'अद्यावधिक',
                'delete': 'मेटाइएको',
                'login': 'लगइन',
                'logout': 'लगआउट'
            };
            return labels[activity] || activity;
        }

        function getStatusBadge(status) {
            const badges = {
                'success': '<span class="audit-status-badge audit-status-success">सफल</span>',
                'error': '<span class="audit-status-badge audit-status-error">त्रुटि</span>',
                'warning': '<span class="audit-status-badge audit-status-warning">चेतावनी</span>'
            };
            return badges[status] || status;
        }

        function renderTable() {
            if (!auditLogTableBody) return;

            const searchTerm = auditLogSearch ? auditLogSearch.value.toLowerCase() : '';
            const filterValue = auditLogFilter ? auditLogFilter.value : 'all';

            let filteredLogs = auditLogs.filter(log => {
                const matchesSearch = log.instanceId.toLowerCase().includes(searchTerm) ||
                                     log.instanceName.toLowerCase().includes(searchTerm) ||
                                     (log.user || '').toLowerCase().includes(searchTerm);
                const matchesFilter = filterValue === 'all' || log.activity === filterValue;
                return matchesSearch && matchesFilter;
            });

            // Pagination
            const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
            currentPage = Math.min(currentPage, totalPages || 1);
            const startIndex = (currentPage - 1) * itemsPerPage;
            const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

            if (paginatedLogs.length === 0) {
                auditLogTableBody.innerHTML = '<tr class="audit-log-empty-row"><td colspan="7">कुनै अडिट लग छैन।</td></tr>';
            } else {
                auditLogTableBody.innerHTML = paginatedLogs.map((log, index) => `
                    <tr>
                        <td>${startIndex + index + 1}</td>
                        <td>${log.instanceId}</td>
                        <td>${log.instanceName}</td>
                        <td><span class="audit-status-badge audit-status-${log.activity}">${getActivityLabel(log.activity)}</span></td>
                        <td>${log.user}</td>
                        <td>${log.timestamp}</td>
                        <td>${getStatusBadge(log.status)}</td>
                    </tr>
                `).join('');
            }

            // Update pagination
            if (auditLogCurrentPage) auditLogCurrentPage.textContent = currentPage;
            if (auditLogTotalPages) auditLogTotalPages.textContent = totalPages || 1;
            if (auditLogPrevBtn) auditLogPrevBtn.disabled = currentPage === 1;
            if (auditLogNextBtn) auditLogNextBtn.disabled = currentPage === totalPages || totalPages === 0;
        }

        // Event listeners
        if (auditLogSearch) {
            auditLogSearch.addEventListener('input', function() {
                currentPage = 1;
                renderTable();
            });
        }

        if (auditLogFilter) {
            auditLogFilter.addEventListener('change', function() {
                currentPage = 1;
                renderTable();
            });
        }

        if (auditLogRefresh) {
            auditLogRefresh.addEventListener('click', function() {
                const icon = this.querySelector('i');
                icon.classList.add('fa-spin');
                loadAuditLogs().finally(() => {
                    icon.classList.remove('fa-spin');
                });
            });
        }

        if (auditLogPrevBtn) {
            auditLogPrevBtn.addEventListener('click', function() {
                if (currentPage > 1) {
                    currentPage--;
                    renderTable();
                }
            });
        }

        if (auditLogNextBtn) {
            auditLogNextBtn.addEventListener('click', function() {
                const searchTerm = auditLogSearch ? auditLogSearch.value.toLowerCase() : '';
                const filterValue = auditLogFilter ? auditLogFilter.value : 'all';
                const filteredCount = auditLogs.filter(log => {
                    return (log.instanceId.toLowerCase().includes(searchTerm) ||
                        log.instanceName.toLowerCase().includes(searchTerm) ||
                        (log.user || '').toLowerCase().includes(searchTerm)) &&
                        (filterValue === 'all' || log.activity === filterValue);
                }).length;
                const totalPages = Math.ceil(filteredCount / itemsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    renderTable();
                }
            });
        }

        async function loadAuditLogs() {
            if (!auditUserIsAdmin) return;
            try {
                const response = await AuditLogsAPI.getAll();
                auditLogs = response.data || [];
                updateStats();
                renderTable();
            } catch (error) {
                console.error('Error loading audit logs:', error);
                auditLogs = [];
                updateStats();
                renderTable();
            }
        }

        // Initial render
        updateStats();
        renderTable();
        loadAuditLogs();
    }

    // User Management Functionality
    function initializeUserManagementFunctionality() {
        let users = [];
        let currentPage = 1;
        const itemsPerPage = 10;

        const userManagementTableBody = document.getElementById('userManagementTableBody');
        const userManagementSearch = document.getElementById('userManagementSearch');
        const userManagementFilter = document.getElementById('userManagementFilter');
        const userManagementAddBtn = document.getElementById('userManagementAddBtn');
        const userManagementPrevBtn = document.getElementById('userManagementPrevBtn');
        const userManagementNextBtn = document.getElementById('userManagementNextBtn');
        const userManagementCurrentPage = document.getElementById('userManagementCurrentPage');
        const userManagementTotalPages = document.getElementById('userManagementTotalPages');
        const userModal = document.getElementById('userModal');
        const userForm = document.getElementById('userForm');
        const userModalCloseBtn = document.getElementById('userModalCloseBtn');
        const userModalCancelBtn = document.getElementById('userModalCancelBtn');
        const userUsername = document.getElementById('userUsername');
        const userMahashakha = document.getElementById('userMahashakha');
        const userShakha = document.getElementById('userShakha');
        const userPassword = document.getElementById('userPassword');
        const userRole = document.getElementById('userRole');
        const userStatus = document.getElementById('userStatus');
        const userModalTitle = document.getElementById('userModalTitle');
        const userModalSubmitBtn = document.getElementById('userModalSubmitBtn');
        let editingUserId = null;

        const shakhaOptions = {
            'प्रशासन तथा सूचना सङ्कलन महाशाखा': [
                'प्रशासन, योजना तथा अनुगमन शाखा',
                'सूचना सङ्‍कलन तथा उजुरी व्यवस्थापन शाखा',
                'आर्थिक प्रशासन शाखा',
                'उजुरी छानविन तथा अन्वेषण शाखा',
                'कानूनी राय तथा परामर्श शाखा',
                'सम्पत्ति विवरण तथा आय अनुगमन शाखा',
                'निर्णय कार्यान्वयन तथा अभिलेख व्यवस्थापन शाखा'
            ],
            'प्राविधिक परीक्षण तथा अनुगमन महाशाखा': [
                'प्राविधिक परीक्षण शाखा',
                'प्राविधिक छानविन तथा अनुगमन शाखा',
                'प्रयोगशाला/परीक्षण शाखा',
                'प्राविधिक परीक्षण तालिम तथा क्षमता विकास शाखा',
                'सूचना प्रविधि शाखा'
            ],
            'प्रहरी महाशाखा': ['प्रहरी शाखा']
        };

        // Stats elements
        const totalUsersEl = document.getElementById('totalUsers');
        const activeUsersEl = document.getElementById('activeUsers');
        const adminUsersEl = document.getElementById('adminUsers');
        const inactiveUsersEl = document.getElementById('inactiveUsers');

        function updateStats() {
            const total = users.length;
            const active = users.filter(u => u.status === 'active').length;
            const admins = users.filter(u => u.role === 'admin').length;
            const inactive = users.filter(u => u.status === 'inactive').length;

            totalUsersEl.textContent = total;
            activeUsersEl.textContent = active;
            adminUsersEl.textContent = admins;
            inactiveUsersEl.textContent = inactive;
        }

        function getRoleLabel(role) {
            const labels = {
                'admin': 'एडमिन',
                'mahashakha': 'महाशाखा',
                'shakha': 'शाखा'
            };
            return labels[role] || role;
        }

        function getStatusLabel(status) {
            const labels = {
                'active': 'सक्रिय',
                'inactive': 'निष्क्रिय',
                'pending': 'प्रक्रियामा'
            };
            return labels[status] || status;
        }

        function renderTable() {
            if (!userManagementTableBody) return;

            const searchTerm = userManagementSearch ? userManagementSearch.value.toLowerCase() : '';
            const filterValue = userManagementFilter ? userManagementFilter.value : 'all';

            let filteredUsers = users.filter(user => {
                const matchesSearch = user.username.toLowerCase().includes(searchTerm) ||
                                     user.email.toLowerCase().includes(searchTerm);
                const matchesFilter = filterValue === 'all' || user.role === filterValue;
                return matchesSearch && matchesFilter;
            });

            // Pagination
            const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
            currentPage = Math.min(currentPage, totalPages || 1);
            const startIndex = (currentPage - 1) * itemsPerPage;
            const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

            if (paginatedUsers.length === 0) {
                userManagementTableBody.innerHTML = '<tr class="user-management-empty-row"><td colspan="7">कुनै प्रयोगकर्ता छैन।</td></tr>';
            } else {
                userManagementTableBody.innerHTML = paginatedUsers.map((user, index) => `
                    <tr>
                        <td>${startIndex + index + 1}</td>
                        <td>${user.username}</td>
                        <td>${user.email || '-'}</td>
                        <td><span class="user-role-badge user-role-${user.role}">${getRoleLabel(user.role)}</span></td>
                        <td><span class="user-status-badge user-status-${user.status}">${getStatusLabel(user.status)}</span></td>
                        <td>${user.createdAt}</td>
                        <td>
                            <div class="user-action-btns">
                                <button class="user-action-btn view" onclick="viewUser(${user.id})">
                                    <i class="fas fa-eye"></i> हेर्नुहोस्
                                </button>
                                <button class="user-action-btn edit" onclick="editUser(${user.id})">
                                    <i class="fas fa-edit"></i> सम्पादन
                                </button>
                                <button class="user-action-btn delete" onclick="deleteUser(${user.id})">
                                    <i class="fas fa-trash"></i> मेटाउनुहोस्
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            }

            // Update pagination
            if (userManagementCurrentPage) userManagementCurrentPage.textContent = currentPage;
            if (userManagementTotalPages) userManagementTotalPages.textContent = totalPages || 1;
            if (userManagementPrevBtn) userManagementPrevBtn.disabled = currentPage === 1;
            if (userManagementNextBtn) userManagementNextBtn.disabled = currentPage === totalPages || totalPages === 0;
        }

        // Event listeners
        if (userManagementSearch) {
            userManagementSearch.addEventListener('input', function() {
                currentPage = 1;
                renderTable();
            });
        }

        if (userManagementFilter) {
            userManagementFilter.addEventListener('change', function() {
                currentPage = 1;
                renderTable();
            });
        }

        if (userManagementAddBtn) {
            userManagementAddBtn.addEventListener('click', function() {
                if (!userModal || !userForm) return;
                editingUserId = null;
                userForm.reset();
                if (userModalTitle) userModalTitle.textContent = 'नयाँ प्रयोगकर्ता थप्नुहोस्';
                if (userModalSubmitBtn) userModalSubmitBtn.textContent = 'प्रयोगकर्ता थप्नुहोस्';
                if (userPassword) userPassword.required = true;
                if (userShakha) {
                    userShakha.innerHTML = '<option value="">पहिले महाशाखा छान्नुहोस्</option>';
                    userShakha.disabled = true;
                }
                userModal.classList.add('active');
                if (userUsername) userUsername.focus();
            });
        }

        if (userMahashakha && userShakha) {
            userMahashakha.addEventListener('change', function() {
                const options = shakhaOptions[this.value] || [];
                userShakha.innerHTML = '<option value="">शाखा छान्नुहोस्</option>' +
                    options.map(option => `<option value="${option}">${option}</option>`).join('');
                userShakha.disabled = options.length === 0;
            });
        }

        function closeUserModal() {
            if (userModal) userModal.classList.remove('active');
            if (userForm) userForm.reset();
            editingUserId = null;
            if (userPassword) userPassword.required = true;
        }

        if (userModalCloseBtn) userModalCloseBtn.addEventListener('click', closeUserModal);
        if (userModalCancelBtn) userModalCancelBtn.addEventListener('click', closeUserModal);
        if (userModal) {
            userModal.addEventListener('click', function(event) {
                if (event.target === userModal) closeUserModal();
            });
        }

        if (userForm) {
            userForm.addEventListener('submit', async function(event) {
                event.preventDefault();

                const formData = new FormData(userForm);
                const trimmedUsername = formData.get('username').trim();
                const password = formData.get('password');
                const mahashakha = formData.get('mahashakha');
                const shakha = formData.get('shakha');
                const role = formData.get('role');
                const status = formData.get('status');

                if (!trimmedUsername || (!editingUserId && !password) || !mahashakha || !shakha) {
                    alert('कृपया प्रयोगकर्ता नाम, पासवर्ड, महाशाखा र शाखा प्रविष्ट गर्नुहोस्।');
                    return;
                }

                const duplicateUser = users.some(user =>
                    user.id !== editingUserId && user.username.toLowerCase() === trimmedUsername.toLowerCase()
                );
                if (duplicateUser) {
                    alert('यो प्रयोगकर्ता नाम पहिले नै प्रयोग भएको छ।');
                    return;
                }

                const userData = { username: trimmedUsername, mahashakha, shakha, role, status };
                if (password) userData.password = password;

                try {
                    const response = editingUserId
                        ? await UsersAPI.update(editingUserId, userData)
                        : await UsersAPI.create(userData);
                    if (editingUserId) {
                        users = users.map(user => user.id === editingUserId ? response.data : user);
                    } else {
                        users.push(response.data);
                        currentPage = Math.ceil(users.length / itemsPerPage);
                    }
                    updateStats();
                    renderTable();
                    closeUserModal();
                } catch (error) {
                    alert(error.message || 'प्रयोगकर्ता सुरक्षित गर्न सकिएन।');
                }
            });
        }

        if (userManagementPrevBtn) {
            userManagementPrevBtn.addEventListener('click', function() {
                if (currentPage > 1) {
                    currentPage--;
                    renderTable();
                }
            });
        }

        if (userManagementNextBtn) {
            userManagementNextBtn.addEventListener('click', function() {
                const totalPages = Math.ceil(users.length / itemsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    renderTable();
                }
            });
        }

        // Global functions for user actions
        window.viewUser = function(id) {
            const user = users.find(u => u.id === id);
            if (user) {
                alert(`प्रयोगकर्ता विवरण:\n\nनाम: ${user.username}\nमहाशाखा: ${user.mahashakha}\nशाखा: ${user.shakha}\nभूमिका: ${getRoleLabel(user.role)}\nस्थिति: ${getStatusLabel(user.status)}\nसिर्जना मिति: ${user.createdAt}`);
            }
        };

        window.editUser = function(id) {
            const user = users.find(u => u.id === id);
            if (!user || !userModal || !userForm) return;
            editingUserId = id;
            userUsername.value = user.username || '';
            userPassword.value = '';
            userPassword.required = false;
            userMahashakha.value = user.mahashakha || '';
            userMahashakha.dispatchEvent(new Event('change'));
            userShakha.value = user.shakha || '';
            userRole.value = user.role || 'admin';
            userStatus.value = user.status || 'active';
            if (userModalTitle) userModalTitle.textContent = 'प्रयोगकर्ता सम्पादन गर्नुहोस्';
            if (userModalSubmitBtn) userModalSubmitBtn.textContent = 'परिवर्तन सुरक्षित गर्नुहोस्';
            userModal.classList.add('active');
            userUsername.focus();
        };

        window.deleteUser = async function(id) {
            if (!confirm('के तपाईं यो प्रयोगकर्ता मेटाउन निश्चित हुनुहुन्छ?')) return;
            try {
                await UsersAPI.delete(id);
                users = users.filter(user => user.id !== id);
                updateStats();
                renderTable();
            } catch (error) {
                alert(error.message || 'प्रयोगकर्ता मेटाउन सकिएन।');
            }
        };

        async function loadUsers() {
            try {
                const response = await UsersAPI.getAll();
                users = response.data || [];
                updateStats();
                renderTable();
            } catch (error) {
                console.error('Error loading users:', error);
                alert(error.message || 'प्रयोगकर्ता विवरण लोड गर्न सकिएन।');
            }
        }

        // Initial render
        updateStats();
        renderTable();
        loadUsers();
    }

// --- TA Choropleth Map Integration ---
(function() {
    function initTaMapLogic() {
        let taChoroplethMap = null;
        let taGeojsonLayer = null;
        let currentTaMetric = 'taTotalTests';
        
        const metricProperties = {
            'taTotalTests': { label: 'कुल प्राविधिक परीक्षण', colors: ['#e3f2fd', '#1e88e5', '#0d47a1'], min: 5, max: 50 },
            'taThisYearTests': { label: 'यो आ.व.को प्राविधिक परीक्षण', colors: ['#e8f5e9', '#43a047', '#1b5e20'], min: 0, max: 20 },
            'taPendingTests': { label: 'चालु प्राविधिक परीक्षण', colors: ['#fff3e0', '#fb8c00', '#e65100'], min: 0, max: 15 },
            'taCompletedTests': { label: 'सम्पन्न प्राविधिक परीक्षण', colors: ['#fce4ec', '#d81b60', '#880e4f'], min: 0, max: 30 },
            'taNonCompliances': { label: 'अपरिपालनाहरु', colors: ['#f3e5f5', '#8e24aa', '#4a148c'], min: 0, max: 25 },
            'taPendingDisposal': { label: 'डिसपोजल हुन बाँकी अपरिपालनाहरु', colors: ['#ffebee', '#e53935', '#b71c1c'], min: 0, max: 10 }
        };

        function seededRandom(seedStr) {
            let h = 0;
            for(let i = 0; i < seedStr.length; i++) h = Math.imul(31, h) + seedStr.charCodeAt(i) | 0;
            let t = h += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }

        function getColorForTa(value, min, max, colors) {
            if (value === 0) return '#f4f7f6';
            let ratio = (value - min) / (max - min);
            if (ratio < 0) ratio = 0;
            if (ratio > 1) ratio = 1;
            if (ratio < 0.33) return colors[0];
            if (ratio < 0.66) return colors[1];
            return colors[2];
        }

        function renderTaMap() {
            if (!taChoroplethMap) return;
            
            fetch('https://raw.githubusercontent.com/Acesmndr/nepal-geojson/master/generated-geojson/nepal-with-districts-acesmndr.geojson')
                .then(res => res.json())
                .then(geojson => {
                    if (taGeojsonLayer) taChoroplethMap.removeLayer(taGeojsonLayer);
                    
                    const prop = metricProperties[currentTaMetric] || metricProperties['taTotalTests'];
                    
                    taGeojsonLayer = L.geoJSON(geojson, {
                        style: function(feature) {
                            let rawDist = feature.properties.DISTRICT || feature.properties.name || feature.properties.NAME || 'Unknown';
                            let distName = (window.DISTRICT_NAME_MAP && (window.DISTRICT_NAME_MAP[rawDist] || window.DISTRICT_NAME_MAP[rawDist.toUpperCase()])) || rawDist;
                            let rand = seededRandom(distName + currentTaMetric);
                            let val = Math.floor(prop.min + rand * (prop.max - prop.min));
                            return {
                                fillColor: getColorForTa(val, prop.min, prop.max, prop.colors),
                                weight: 1,
                                opacity: 1,
                                color: '#ffffff',
                                fillOpacity: 0.8
                            };
                        },
                        onEachFeature: function(feature, layer) {
                            let rawDist = feature.properties.DISTRICT || feature.properties.name || feature.properties.NAME || 'Unknown';
                            let nepaliDistName = (window.DISTRICT_NAME_MAP && (window.DISTRICT_NAME_MAP[rawDist] || window.DISTRICT_NAME_MAP[rawDist.toUpperCase()])) || rawDist;
                            let rand = seededRandom(rawDist + currentTaMetric);
                            let val = Math.floor(prop.min + rand * (prop.max - prop.min));
                            layer.bindPopup('<b>' + nepaliDistName + '</b><br/>' + prop.label + ': ' + val);
                        }
                    }).addTo(taChoroplethMap);
                    
                    taChoroplethMap.fitBounds(taGeojsonLayer.getBounds(), { padding: [20, 20] });
                })
                .catch(err => console.error('Error loading GeoJSON for TA:', err));
        }

        const toggleBtn = document.getElementById('taToggleMapBtn');
        const mapSection = document.getElementById('taMapSection');
        const metricLabel = document.getElementById('taMapMetricLabel');
        
        if (toggleBtn && mapSection) {
            toggleBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (mapSection.style.display === 'none' || mapSection.style.display === '') {
                    mapSection.style.display = 'block';
                    toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i> नक्सा लुकाउनुहोस्';
                    
                    if (!taChoroplethMap) {
                        taChoroplethMap = L.map('taChoroplethMap', {
                            center: [28.3949, 84.1240],
                            zoom: 6,
                            preferCanvas: true,
                            scrollWheelZoom: true
                        });
                        L.tileLayer('', { attribution: '' }).addTo(taChoroplethMap);
                        renderTaMap();
                    } else {
                        taChoroplethMap.invalidateSize();
                    }
                } else {
                    mapSection.style.display = 'none';
                    toggleBtn.innerHTML = '<i class="fas fa-map-marked-alt"></i> नक्सामा हेर्नुहोस्';
                }
            });
        }

        const statCards = document.querySelectorAll('#technicalAuditContent .ta-stat-card');
        if (statCards.length > 0) {
            statCards[0].style.transform = 'scale(1.05)';
            statCards[0].style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
            
            statCards.forEach(card => {
                card.style.cursor = 'pointer';
                card.style.transition = 'all 0.2s ease';
                
                card.addEventListener('click', function() {
                    statCards.forEach(c => {
                        c.style.transform = 'scale(1)';
                        c.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
                    });
                    
                    this.style.transform = 'scale(1.05)';
                    this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                    
                    const valueEl = this.querySelector('.ta-value');
                    if (valueEl && valueEl.id) {
                        currentTaMetric = valueEl.id;
                        if (metricProperties[currentTaMetric]) {
                            if (metricLabel) metricLabel.textContent = metricProperties[currentTaMetric].label;
                            if (mapSection.style.display !== 'none') {
                                renderTaMap();
                            }
                        }
                    }
                });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTaMapLogic);
    } else {
        initTaMapLogic();
    }
})();


// ==========================================
// Nepal Data Dynamic Dropdowns (GLOBAL SCOPE)
// ==========================================

function getNepalProvinces() {
    if (window.nepalData && window.nepalData.PROVINCE) {
        return Object.values(window.nepalData.PROVINCE);
    }
    return [
        'कोशी प्रदेश', 'मधेश प्रदेश', 'बागमती प्रदेश',
        'गण्डकी प्रदेश', 'लुम्बिनी प्रदेश',
        'कर्णाली प्रदेश', 'सुदूरपश्चिम प्रदेश'
    ];
}

function getNepalMinistries() {
    if (window.nepalData && Array.isArray(window.nepalData.MINISTRIES)) {
        return window.nepalData.MINISTRIES;
    }
    return [
        "प्रधानमन्त्री तथा मन्त्रिपरिषद्को कार्यालय", "अर्थ मन्त्रालय", "उद्योग, वाणिज्य तथा आपूर्ति मन्त्रालय",
        "ऊर्जा, जलस्रोत तथा सिंचाइ मन्त्रालय", "कानून, न्याय तथा संसदीय मामिला मन्त्रालय", "कृषि, वन तथा पर्यावरण मन्त्रालय",
        "गृह मन्त्रालय", "परराष्ट्र मन्त्रालय", "पूर्वाधार विकास मन्त्रालय",
        "भूमि व्यवस्था, सहकारी, सङ्घीय मामिला तथा सामान्य प्रशासन मन्त्रालय",
        "महिला, बालबालिका, लैङ्गिक तथा यौनिक अल्पसङ्ख्यक र सामाजिक सुरक्षा मन्त्रालय", "युवा, श्रम तथा रोजगार मन्त्रालय",
        "रक्षा मन्त्रालय", "विज्ञान प्रविधि तथा नवप्रवर्तन मन्त्रालय", "शिक्षा तथा खेलकुद मन्त्रालय", "सूचना तथा सञ्चार मन्त्रालय",
        "संस्कृति, पर्यटन तथा नागरिक उड्डयन मन्त्रालय", "स्वास्थ्य तथा खाद्य स्वच्छता मन्त्रालय", "संवैधानिक अङ्ग", "कोशी प्रदेश", "मधेश प्रदेश", "बागमती प्रदेश", "गण्डकी प्रदेश", "लुम्बिनी प्रदेश", "कर्णाली प्रदेश", "सुदूर पश्चिम प्रदेश"
    ];
}

function getNepalProvinceId(p) {
    if (!p) return null;
    if (/^[1-7]$/.test(String(p).trim())) return parseInt(p, 10);
    var clean = function(s) { return String(s).replace(/\s+/g, '').replace('मधेश', 'मधेश'); };
    if (window.nepalData && window.nepalData.PROVINCE) {
        for (var id in window.nepalData.PROVINCE) {
            if (clean(window.nepalData.PROVINCE[id]) === clean(p)) return parseInt(id, 10);
        }
    }
    return null;
}

function getNepalDistricts(prov) {
    if (!window.nepalData || !window.nepalData.DISTRICTS) return [];
    if (!prov) return Object.values(window.nepalData.DISTRICTS).flat();
    var pId = getNepalProvinceId(prov);
    return (pId && window.nepalData.DISTRICTS[pId]) ? window.nepalData.DISTRICTS[pId] : [];
}

function getNepalMunicipalities(dist, prov) {
    if (!window.nepalData || !window.nepalData.MUNICIPALITIES || !dist) return [];
    var pId = getNepalProvinceId(prov);
    if (pId && window.nepalData.MUNICIPALITIES[pId] && window.nepalData.MUNICIPALITIES[pId][dist]) {
        return window.nepalData.MUNICIPALITIES[pId][dist];
    }
    for (var id in window.nepalData.MUNICIPALITIES) {
        if (window.nepalData.MUNICIPALITIES[id][dist]) return window.nepalData.MUNICIPALITIES[id][dist];
    }
    return [];
}

function setupNepalGeoDropdowns(provEl, distEl, muniEl, opts) {
    opts = opts || {};
    var provSelect = typeof provEl === 'string' ? document.getElementById(provEl) : provEl;
    var distSelect = typeof distEl === 'string' ? document.getElementById(distEl) : distEl;
    var muniSelect = muniEl ? (typeof muniEl === 'string' ? document.getElementById(muniEl) : muniEl) : null;
    var isFilter = !!opts.isFilter;
    var provPH = isFilter ? 'सबै प्रदेश' : 'प्रदेश छान्नुहोस्';
    var distPH = isFilter ? 'सबै जिल्ला' : 'जिल्ला छान्नुहोस्';
    var distDisPH = 'पहिले प्रदेश छान्नुहोस्';
    var muniPH = isFilter ? 'सबै स्थानीय तह' : 'स्थानीय तह छान्नुहोस्';
    var muniDisPH = 'पहिले जिल्ला छान्नुहोस्';
    if (!provSelect) return;
    provSelect.innerHTML = '<option value="">' + provPH + '</option>';
    getNepalProvinces().forEach(function(p) {
        var o = document.createElement('option'); o.value = p; o.textContent = p; provSelect.appendChild(o);
    });
    if (distSelect) {
        distSelect.innerHTML = '<option value="">' + (isFilter ? distPH : distDisPH) + '</option>';
        if (!isFilter) distSelect.disabled = true;
    }
    if (muniSelect) {
        muniSelect.innerHTML = '<option value="">' + (isFilter ? muniPH : muniDisPH) + '</option>';
        if (!isFilter) muniSelect.disabled = true;
    }
    provSelect.addEventListener('change', function() {
        var selProv = this.value;
        if (distSelect) {
            if (selProv) {
                distSelect.disabled = false;
                distSelect.innerHTML = '<option value="">' + distPH + '</option>';
                getNepalDistricts(selProv).forEach(function(d) {
                    var o = document.createElement('option'); o.value = d; o.textContent = d; distSelect.appendChild(o);
                });
            } else {
                distSelect.innerHTML = '<option value="">' + (isFilter ? distPH : distDisPH) + '</option>';
                if (!isFilter) distSelect.disabled = true;
            }
        }
        if (muniSelect) {
            muniSelect.innerHTML = '<option value="">' + (isFilter ? muniPH : muniDisPH) + '</option>';
            if (!isFilter) muniSelect.disabled = true;
        }
    });
    if (distSelect && muniSelect) {
        distSelect.addEventListener('change', function() {
            var selDist = this.value;
            var selProv = provSelect ? provSelect.value : '';
            if (selDist) {
                muniSelect.disabled = false;
                muniSelect.innerHTML = '<option value="">' + muniPH + '</option>';
                getNepalMunicipalities(selDist, selProv).forEach(function(m) {
                    var o = document.createElement('option'); o.value = m; o.textContent = m; muniSelect.appendChild(o);
                });
            } else {
                muniSelect.innerHTML = '<option value="">' + (isFilter ? muniPH : muniDisPH) + '</option>';
                if (!isFilter) muniSelect.disabled = true;
            }
        });
    }
}

// Initialize additional geo dropdowns on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    setupNepalGeoDropdowns('dtProvince', 'dtDistrict', 'dtLocalLevel');
    setupNepalGeoDropdowns('dtdFProvince', 'dtdFDistrict', 'dtdFLocalLevel', { isFilter: true });
    setupNepalGeoDropdowns('surveyProvince', 'surveyDistrict', 'surveyLocalLevel');
    setupNepalGeoDropdowns('province', 'district', 'localLevel');
    setupNepalGeoDropdowns('omDetailFProvince', 'omDetailFDistrict', 'omDetailFLocalLevel', { isFilter: true });
    setupNepalGeoDropdowns('fProvince', 'fDistrict', null, { isFilter: true });
    setupNepalGeoDropdowns('cmFilterProvince', 'cmFilterDistrict', 'cmFilterMunicipality', { isFilter: true });
    
    // Populate cmFilterMinistry dropdown
    const cmFilterMinistry = document.getElementById('cmFilterMinistry');
    if (cmFilterMinistry) {
        cmFilterMinistry.innerHTML = '<option value="">मन्त्रालय/निकाय (सबै)</option>';
        getNepalMinistries().forEach(ministry => {
            const option = document.createElement('option');
            option.value = ministry;
            option.textContent = ministry;
            cmFilterMinistry.appendChild(option);
        });
    }

    // Initialize action buttons for ujuri vivaran table
    initializeUjuriActionButtons();

    if (window.loadStatistics && window.loadStatistics.technicalAudit) {
        window.loadStatistics.technicalAudit();
    }
});

// Ujuri Action Buttons Functionality
function initializeUjuriActionButtons() {
    const viewButtons = document.querySelectorAll('.icon-action--view');
    const editButtons = document.querySelectorAll('.icon-action--edit');
    const deleteButtons = document.querySelectorAll('.icon-action--delete');

    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const row = this.closest('tr');
            showViewModal(row);
        });
    });

    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const row = this.closest('tr');
            showEditModal(row);
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const row = this.closest('tr');
            showDeleteConfirmation(row);
        });
    });
}

function getUjuriAttachment(entryId, fileIndex) {
    const files = window.ujuriAttachmentData?.[entryId] || [];
    return files[fileIndex] || null;
}

function viewUjuriAttachment(entryId, fileIndex) {
    const file = getUjuriAttachment(entryId, fileIndex);
    if (!file?.dataUrl) {
        alert('यो फाइलको सामग्री उपलब्ध छैन।');
        return;
    }
    window.open(file.dataUrl, '_blank', 'noopener');
}

function downloadUjuriAttachment(entryId, fileIndex) {
    const file = getUjuriAttachment(entryId, fileIndex);
    if (!file?.dataUrl) {
        alert('यो फाइलको सामग्री उपलब्ध छैन।');
        return;
    }
    const link = document.createElement('a');
    link.href = file.dataUrl;
    link.download = file.name || 'ujuri-attachment';
    document.body.appendChild(link);
    link.click();
    link.remove();
}

// View Modal Function
function showViewModal(row) {
    const modal = document.getElementById('viewModal');
    const modalBody = document.getElementById('viewModalBody');
    
    const cells = row.querySelectorAll('td');
    const regNo = cells[1].textContent.trim();
    const date = cells[2].textContent.trim();
    const complainant = cells[3].textContent.trim();
    const opponent = cells[4].textContent.trim();
    const ministry = cells[5].textContent.trim();
    const description = cells[6].textContent.trim();
    const committeeDecision = row.dataset.committeeDecision || cells[7].textContent.trim();
    const finalDecisionType = row.dataset.finalDecisionType || cells[8].textContent.trim();
    const finalDecision = row.dataset.finalDecision || '';
    const decisionDate = row.dataset.decisionDate || '';
    const remarks = row.dataset.remarks || cells[9].textContent.trim();
    const department = row.dataset.assignedDepartment || cells[10].textContent.trim();
    const status = cells[11].textContent.trim();
    
    modalBody.innerHTML = `
        <div class="f-section">
            <div class="f-section-head">
                <div class="f-num"><i class="fas fa-id-card"></i></div>
                <h3>उजुरकर्ताको विवरण</h3>
            </div>
            <div class="f-grid">
                <div class="f-field">
                    <label><i class="fas fa-hashtag"></i> दर्ता नं</label>
                    <input type="text" value="${regNo}" readonly style="background: #f5f5f5;">
                </div>
                <div class="f-field">
                    <label><i class="far fa-calendar-alt"></i> दर्ता मिति</label>
                    <input type="text" value="${date}" readonly style="background: #f5f5f5;">
                </div>
                <div class="f-field">
                    <label><i class="fas fa-user"></i> उजुरकर्ताको नाम</label>
                    <input type="text" value="${complainant}" readonly style="background: #f5f5f5;">
                </div>
                <div class="f-field">
                    <label><i class="fas fa-user-tie"></i> विपक्षी</label>
                    <input type="text" value="${opponent}" readonly style="background: #f5f5f5;">
                </div>
                <div class="f-field">
                    <label><i class="fas fa-building"></i> मन्त्रालय/निकाय</label>
                    <input type="text" value="${ministry}" readonly style="background: #f5f5f5;">
                </div>
            </div>
        </div>
        
        <div class="f-section">
            <div class="f-section-head">
                <div class="f-num"><i class="fas fa-file-alt"></i></div>
                <h3>उजुरीको विवरण</h3>
            </div>
            <div class="f-grid">
                <div class="f-field" style="grid-column: span 2;">
                    <label><i class="fas fa-info-circle"></i> उजुरीको विवरण</label>
                    <textarea readonly style="background: #f5f5f5; min-height: 100px;">${description}</textarea>
                </div>
            </div>
        </div>
        
        <div class="f-section">
            <div class="f-section-head">
                <div class="f-num"><i class="fas fa-gavel"></i></div>
                <h3>निर्णय विवरण</h3>
            </div>
            <div class="f-grid">
                <div class="f-field" style="grid-column: span 2;">
                    <label><i class="fas fa-users"></i> समितिको निर्णय</label>
                    <textarea readonly style="background: #f5f5f5; min-height: 80px;">${committeeDecision}</textarea>
                </div>
                <div class="f-field">
                    <label><i class="fas fa-balance-scale"></i> अन्तिम निर्णय प्रकार</label>
                    <input type="text" value="${finalDecisionType}" readonly style="background: #f5f5f5;">
                </div>
                <div class="f-field" style="grid-column: span 2;">
                    <label><i class="fas fa-gavel"></i> अन्तिम निर्णय</label>
                    <textarea readonly style="background: #f5f5f5; min-height: 80px;">${finalDecision}</textarea>
                </div>
                <div class="f-field">
                    <label><i class="far fa-calendar-alt"></i> निर्णय मिति</label>
                    <input type="text" value="${decisionDate}" readonly style="background: #f5f5f5;">
                </div>
                <div class="f-field">
                    <label><i class="fas fa-comment"></i> कैफियत</label>
                    <input type="text" value="${remarks}" readonly style="background: #f5f5f5;">
                </div>
                <div class="f-field">
                    <label><i class="fas fa-building"></i> शाखा</label>
                    <input type="text" value="${department}" readonly style="background: #f5f5f5;">
                </div>
                <div class="f-field">
                    <label><i class="fas fa-flag"></i> स्थिति</label>
                    <input type="text" value="${status}" readonly style="background: #f5f5f5;">
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function closeViewModal() {
    const modal = document.getElementById('viewModal');
    modal.style.display = 'none';
}

// Edit Modal Function
let currentEditRow = null;

function showEditModal(row) {
    currentEditRow = row;
    const modal = document.getElementById('editModal');
    const modalBody = document.getElementById('editModalBody');
    
    const cells = row.querySelectorAll('td');
    const regNo = cells[1].textContent.trim();
    const date = cells[2].textContent.trim();
    const complainant = cells[3].textContent.trim();
    const opponent = cells[4].textContent.trim();
    const ministry = cells[5].textContent.trim();
    const description = cells[6].textContent.trim();
    const committeeDecision = row.dataset.committeeDecision || cells[7].textContent.trim();
    const finalDecisionType = row.dataset.finalDecisionType || cells[8].textContent.trim();
    const finalDecision = row.dataset.finalDecision || '';
    const decisionDate = row.dataset.decisionDate || '';
    const remarks = row.dataset.remarks || cells[9].textContent.trim();
    const department = row.dataset.assignedDepartment || cells[10].textContent.trim();
    const status = cells[11].textContent.trim();
    const departmentOptionsSource = document.getElementById('cmFilterDepartment');
    const departmentOptionsHtml = departmentOptionsSource ? Array.from(departmentOptionsSource.options).map(option => {
        const selected = department === option.value ? 'selected' : '';
        return `<option value="${option.value}" ${selected}>${option.text}</option>`;
    }).join('') : `<option value="${department}">${department || 'शाखा छान्नुहोस्'}</option>`;
    
    // Generate year options for decision date (2080-2090)
    let yearOptions = '';
    for (let year = 2080; year <= 2090; year++) {
        const nepaliYear = convertToNepaliDigits(year);
        yearOptions += `<option value="${nepaliYear}">${nepaliYear}</option>`;
    }
    
    // Generate month options
    const months = ['बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फागुन', 'चैत'];
    let monthOptions = '';
    months.forEach(month => {
        monthOptions += `<option value="${month}">${month}</option>`;
    });
    
    // Generate day options
    let dayOptions = '';
    for (let day = 1; day <= 32; day++) {
        const nepaliDay = convertToNepaliDigits(day);
        dayOptions += `<option value="${nepaliDay}">${nepaliDay}</option>`;
    }
    
    // Build modal content
    modalBody.innerHTML = `
        <div class="f-section">
            <div class="f-section-head">
                <div class="f-num"><i class="fas fa-id-card"></i></div>
                <h3>उजुरकर्ताको विवरण</h3>
            </div>
            <div class="f-grid">
                <div class="f-field">
                    <label><i class="fas fa-hashtag"></i> दर्ता नं</label>
                    <input type="text" id="editRegNo" value="${regNo}" readonly style="background: #f5f5f5;">
                </div>
                <div class="f-field">
                    <label><i class="far fa-calendar-alt"></i> दर्ता मिति</label>
                    <input type="text" id="editDate" value="${date}" readonly style="background: #f5f5f5;">
                </div>
                <div class="f-field">
                    <label><i class="fas fa-user"></i> उजुरकर्ताको नाम</label>
                    <input type="text" id="editComplainant" value="${complainant}">
                </div>
                <div class="f-field">
                    <label><i class="fas fa-user-tie"></i> विपक्षी</label>
                    <input type="text" id="editOpponent" value="${opponent}">
                </div>
                <div class="f-field">
                    <label><i class="fas fa-building"></i> मन्त्रालय/निकाय</label>
                    <input type="text" id="editMinistry" value="${ministry}">
                </div>
            </div>
        </div>
        
        <div class="f-section">
            <div class="f-section-head">
                <div class="f-num"><i class="fas fa-file-alt"></i></div>
                <h3>उजुरीको विवरण</h3>
            </div>
            <div class="f-grid">
                <div class="f-field" style="grid-column: span 2;">
                    <label><i class="fas fa-info-circle"></i> उजुरीको विवरण</label>
                    <textarea id="editDescription" style="min-height: 100px;">${description}</textarea>
                </div>
            </div>
        </div>
        
        <div class="f-section">
            <div class="f-section-head">
                <div class="f-num"><i class="fas fa-gavel"></i></div>
                <h3>निर्णय विवरण</h3>
            </div>
            <div class="f-grid">
                <div class="f-field" style="grid-column: span 2;">
                    <label><i class="fas fa-users"></i> समितिको निर्णय</label>
                    <textarea id="editCommitteeDecision" style="min-height: 80px;">${committeeDecision}</textarea>
                </div>
                <div class="f-field">
                    <label><i class="fas fa-balance-scale"></i> अन्तिम निर्णय प्रकार</label>
                    <select id="editFinalDecision">
                        <option value="" ${finalDecisionType === '' ? 'selected' : ''}>-- छान्नुहोस् --</option>
                        <option value="सुझाव/निर्देशन" ${finalDecisionType === 'सुझाव/निर्देशन' ? 'selected' : ''}>सुझाव/निर्देशन</option>
                        <option value="अ.दु.अ.आ.मा पठाइएको" ${finalDecisionType === 'अ.दु.अ.आ.मा पठाइएको' ? 'selected' : ''}>अ.दु.अ.आ.मा पठाइएको</option>
                        <option value="सतर्क" ${finalDecisionType === 'सतर्क' ? 'selected' : ''}>सतर्क</option>
                        <option value="छानविन तथा कारबाही गरी जानकारी दिन लेखी पठाइएको" ${finalDecisionType === 'छानविन तथा कारबाही गरी जानकारी दिन लेखी पठाइएको' ? 'selected' : ''}>छानविन तथा कारबाही गरी जानकारी दिन लेखी पठाइएको</option>
                        <option value="तामेली" ${finalDecisionType === 'तामेली' ? 'selected' : ''}>तामेली</option>
                        <option value="अन्य" ${finalDecisionType === 'अन्य' ? 'selected' : ''}>अन्य</option>
                    </select>
                </div>
                <div class="f-field">
                    <label><i class="fas fa-comment"></i> कैफियत</label>
                    <input type="text" id="editRemarks" value="${remarks}">
                </div>
                <div class="f-field">
                    <label><i class="fas fa-building"></i> शाखा</label>
                    <select id="editDepartment">
                        <option value="">शाखा छान्नुहोस्</option>
                        ${departmentOptionsHtml}
                    </select>
                </div>
                <div class="f-field">
                    <label><i class="fas fa-flag"></i> स्थिति</label>
                    <select id="editStatus">
                        <option value="चालु" ${status === 'चालु' ? 'selected' : ''}>चालु</option>
                        <option value="फछ्रयौट" ${status === 'फछ्रयौट' ? 'selected' : ''}>फछ्रयौट</option>
                        <option value="काम बाँकी" ${status === 'काम बाँकी' ? 'selected' : ''}>काम बाँकी</option>
                        <option value="बन्द" ${status === 'बन्द' ? 'selected' : ''}>बन्द</option>
                    </select>
                </div>
            </div>
        </div>
        
        <div class="f-section">
            <div class="f-section-head">
                <div class="f-num"><i class="fas fa-calendar-check"></i></div>
                <h3>अन्तिम निर्णय र निर्णय मिति</h3>
            </div>
            <div class="f-grid">
                <div class="f-field" style="grid-column: span 2;">
                    <label><i class="fas fa-gavel"></i> अन्तिम निर्णय</label>
                    <textarea id="editCenterDecision" style="min-height: 80px;" placeholder="केन्द्रको निर्णय राख्नुहोस्...">${finalDecision}</textarea>
                </div>
                <div class="f-field">
                    <label><i class="far fa-calendar-alt"></i> निर्णय मिति</label>
                    <div class="nepali-date-field">
                        <div class="nepali-date-grid">
                            <div class="nepali-date-group">
                                <select id="editDecisionYear" class="nepali-date-select">
                                    <option value="">साल</option>
                                    ${yearOptions}
                                </select>
                            </div>
                            <div class="nepali-date-group">
                                <select id="editDecisionMonth" class="nepali-date-select">
                                    <option value="">महिना</option>
                                    ${monthOptions}
                                </select>
                            </div>
                            <div class="nepali-date-group">
                                <select id="editDecisionDay" class="nepali-date-select">
                                    <option value="">गते</option>
                                    ${dayOptions}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'none';
    currentEditRow = null;
}

async function saveEdit() {
    if (!currentEditRow) return;
    
    const cells = currentEditRow.querySelectorAll('td');
    const entryId = currentEditRow.dataset.id;
    
    const complainant = document.getElementById('editComplainant').value;
    const opponent = document.getElementById('editOpponent').value;
    const ministry = document.getElementById('editMinistry').value;
    const description = document.getElementById('editDescription').value;
    const committeeDecision = document.getElementById('editCommitteeDecision').value;
    const finalDecisionType = document.getElementById('editFinalDecision').value;
    const remarks = document.getElementById('editRemarks').value;
    const department = document.getElementById('editDepartment').value;
    const status = document.getElementById('editStatus').value;
    const centerDecision = document.getElementById('editCenterDecision').value;
    
    const decisionYear = document.getElementById('editDecisionYear').value;
    const decisionMonth = document.getElementById('editDecisionMonth').value;
    const decisionDay = document.getElementById('editDecisionDay').value;
    const decisionDate = convertNepaliDateToIso(decisionYear, decisionMonth, decisionDay);

    const statusMap = { 'चालु': 'in_progress', 'फछ्रयौट': 'resolved', 'काम बाँकी': 'pending', 'बन्द': 'closed' };
    const payload = {
        registration_number: currentEditRow.querySelector('td:nth-child(2)')?.textContent.trim() || '',
        registration_date: currentEditRow.dataset.registrationDate || currentEditRow.querySelector('td:nth-child(3)')?.textContent.trim() || '',
        complainant_name: complainant,
        opponent_name: opponent,
        ministry,
        province: currentEditRow.dataset.province || '',
        district: currentEditRow.dataset.district || '',
        municipality: currentEditRow.dataset.municipality || '',
        complaint_type: currentEditRow.dataset.type || '',
        complaint_source: currentEditRow.dataset.source || '',
        complaint_description: description,
        committee_decision: committeeDecision,
        final_decision_type: finalDecisionType,
        final_decision: centerDecision,
        decision_date: decisionDate,
        remarks,
        attachment_files: currentEditRow.dataset.attachmentFiles || '',
        attachment_data: window.ujuriAttachmentData?.[entryId] || [],
        assigned_department: department,
        status: statusMap[status] || status,
        priority: currentEditRow.dataset.priority || 'medium'
    };

    try {
        if (entryId) {
            const result = await UjuriAPI.update(entryId, payload);
            if (!result || !result.success) {
                throw new Error(result?.error || 'उजुरी अपडेट गर्न सकिएन');
            }
        }
    } catch (error) {
        console.error('Failed to update ujiri entry:', error);
        showToast('उजुरी अपडेट गर्न सकिएन: ' + error.message, true);
        return;
    }
    
    cells[3].textContent = complainant;
    cells[4].textContent = opponent;
    cells[5].textContent = ministry;
    cells[6].textContent = description;
    cells[7].textContent = committeeDecision;
    cells[8].textContent = finalDecisionType;
    cells[9].textContent = remarks;
    cells[10].innerHTML = department + '<div class="cm-td-sub">शाखा</div>';
    currentEditRow.dataset.committeeDecision = committeeDecision;
    currentEditRow.dataset.finalDecisionType = finalDecisionType;
    currentEditRow.dataset.finalDecision = centerDecision;
    currentEditRow.dataset.decisionDate = decisionDate || '';
    currentEditRow.dataset.remarks = remarks;
    currentEditRow.dataset.assignedDepartment = department;
    currentEditRow.dataset.attachmentFiles = currentEditRow.dataset.attachmentFiles || '';
    
    const statusCell = cells[11];
    statusCell.innerHTML = `<span class="cm-status cm-status--${status === 'फछ्रयौट' ? 'resolved' : 'active'}">${status}</span>`;
    
    alert('उजुरी विवरण सफलतापूर्वक अपडेट गरियो!');
    
    closeEditModal();
}

// Delete Function
async function showDeleteConfirmation(row) {
    const regNo = row.querySelector('td:nth-child(2)').textContent.trim();
    const entryId = row.dataset.id;
    
    if (confirm(`के तपाईं निश्चित रूपमा दर्ता नं ${regNo} को उजुरी मेटाउन चाहनुहुन्छ?`)) {
        if (!entryId) {
            alert('उजुरी मेटाउन सकिएन: अभिलेखको ID भेटिएन।');
            return;
        }

        try {
            const result = await UjuriAPI.delete(entryId);
            if (!result || !result.success) {
                throw new Error(result?.error || 'उजुरी मेटाउन सकिएन');
            }

            await loadLiveUjiriData();
            alert('उजुरी सफलतापूर्वक मेटाइयो!');
        } catch (error) {
            console.error('Failed to delete ujiri entry:', error);
            alert('उजुरी मेटाउन सकिएन: ' + error.message);
        }
    }
}

// Helper function to convert digits to Nepali
function convertToNepaliDigits(num) {
    const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return num.toString().split('').map(digit => nepaliDigits[parseInt(digit)]).join('');
}

function convertNepaliToEnglishDigits(value) {
    if (value === null || value === undefined || value === '') return '';
    const map = { '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9' };
    return String(value).split('').map(ch => map[ch] ?? ch).join('');
}

function convertNepaliMonthToNumber(monthValue) {
    const monthMap = {
        'बैशाख': 1,
        'जेठ': 2,
        'असार': 3,
        'साउन': 4,
        'श्रावण': 5,
        'भदौ': 6,
        'भाद्र': 6,
        'असोज': 7,
        'कार्तिक': 8,
        'मंसिर': 9,
        'पौष': 10,
        'माघ': 11,
        'पुष': 10,
        'फागुन': 12,
        'चैत': 12
    };

    const normalized = String(monthValue || '').trim();
    if (!normalized) return null;
    return monthMap[normalized] || null;
}

function convertNepaliDateToIso(yearValue, monthValue, dayValue) {
    const year = Number(convertNepaliToEnglishDigits(yearValue));
    const month = convertNepaliMonthToNumber(monthValue);
    const day = Number(convertNepaliToEnglishDigits(dayValue));

    if (!year || !month || !day) return null;

    const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const date = new Date(`${iso}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : iso;
}
