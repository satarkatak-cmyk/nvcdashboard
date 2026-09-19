// Form Integration Script
// Integrates existing forms with the backend API

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // UJIRI FORM INTEGRATION
    // ============================================
    function integrateUjiriForm() {
        const ujiriForm = document.getElementById('ujuriForm');
        if (!ujiriForm) return;
        if (ujiriForm.dataset.apiSubmitAttached) return;
        ujiriForm.dataset.apiSubmitAttached = 'true';

        function notifySave(message, isError) {
            if (typeof showToast === 'function') {
                showToast(message, isError);
            } else {
                alert(message);
            }
        }

        function readAttachmentData(files) {
            return Promise.all(files.map(file => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve({ name: file.name, type: file.type, dataUrl: reader.result });
                reader.onerror = () => reject(new Error(file.name + ' पढ्न सकिएन'));
                reader.readAsDataURL(file);
            })));
        }

        ujiriForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            try {
                // Extract form data
                const nepaliYear = document.getElementById('nepaliYear').value;
                const nepaliMonth = document.getElementById('nepaliMonth').value;
                const nepaliDay = document.getElementById('nepaliDay').value;

                const registrationDate = convertNepaliToEnglishDate(
                    parseInt(nepaliYear),
                    parseInt(nepaliMonth),
                    parseInt(nepaliDay)
                );

                const files = window.ujuriAttachedFiles || Array.from(document.getElementById('complaintAttachment')?.files || []);
                const attachmentData = await readAttachmentData(files);
                const formData = {
                    registration_number: document.getElementById('newEntryComplaintNumber').value,
                    registration_date: registrationDate,
                    complainant_name: document.getElementById('newEntryComplainantName').value,
                    opponent_name: document.getElementById('newEntryOpponentName').value,
                    ministry: document.getElementById('newEntryMinistrySelect').value,
                    province: document.getElementById('newEntryProvinceSelect').value,
                    district: document.getElementById('newEntryDistrictSelect').value,
                    municipality: document.getElementById('newEntryMunicipalitySelect').value,
                    complaint_type: document.getElementById('newEntryComplaintType')?.value || '',
                    complaint_source: document.getElementById('newEntryComplaintSource')?.value || '',
                    complaint_description: document.getElementById('newEntryDescription')?.value || '',
                    committee_decision: document.getElementById('newEntryDecision')?.value.trim() || '',
                    remarks: document.getElementById('newEntryNotes')?.value.trim() || '',
                    attachment_files: attachmentData
                        .map(file => file.name)
                        .join(', '),
                    attachment_data: attachmentData,
                    status: document.getElementById('newEntryStatus')?.value || 'pending',
                    priority: document.getElementById('newEntryPriority')?.value || 'medium',
                    assigned_department: ''
                };

                const result = await UjuriAPI.create(formData);
                
                if (result.success) {
                    notifySave('उजुरी सेभ भयो।', false);
                    ujiriForm.reset();
                    if (window.clearUjuriAttachments) window.clearUjuriAttachments();
                    // Reload statistics if dashboard is visible
                    loadUjiriStatistics();
                    if (window.loadLiveUjiriData) window.loadLiveUjiriData();
                } else {
                    notifySave('उजुरी सेभ हुन सकेन, पुनः प्रयास गर्नुहोस्।', true);
                }
            } catch (error) {
                console.error('Ujuri form submission error:', error);
                notifySave('उजुरी सेभ हुन सकेन, पुनः प्रयास गर्नुहोस्।', true);
            }
        });
    }

    // ============================================
    // OFFICE MONITORING FORM INTEGRATION
    // ============================================
    function integrateOfficeMonitoringForm() {
        const officeMonForm = document.querySelector('#officeMonFormContainer form');
        if (!officeMonForm) return;

        officeMonForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            try {
                const formData = {
                    office_name: document.getElementById('officeName')?.value || '',
                    office_type: document.getElementById('officeType')?.value || '',
                    province: document.getElementById('officeProvince')?.value || '',
                    district: document.getElementById('officeDistrict')?.value || '',
                    monitoring_date: document.getElementById('monitoringDate')?.value || new Date().toISOString().split('T')[0],
                    monitoring_team: document.getElementById('monitoringTeam')?.value || '',
                    staff_attendance: parseInt(document.getElementById('staffAttendance')?.value) || 0,
                    staff_punctuality_score: parseFloat(document.getElementById('punctualityScore')?.value) || 0,
                    office_cleanliness_score: parseFloat(document.getElementById('cleanlinessScore')?.value) || 0,
                    service_delivery_score: parseFloat(document.getElementById('serviceScore')?.value) || 0,
                    overall_performance: parseFloat(document.getElementById('overallScore')?.value) || 0,
                    issues_found: document.getElementById('issuesFound')?.value || '',
                    recommendations: document.getElementById('recommendations')?.value || '',
                    follow_up_required: document.getElementById('followUpRequired')?.checked || false,
                    follow_up_date: document.getElementById('followUpDate')?.value || null
                };

                const result = await OfficeMonitoringAPI.create(formData);
                
                if (result.success) {
                    showToast('कार्यालय अनुगमन सफलतापूर्वक दर्ता भयो!', 'success');
                    officeMonForm.reset();
                    loadOfficeMonitoringStatistics();
                } else {
                    showToast('अनुगमन दर्ता गर्नमा समस्या भयो: ' + result.error, 'error');
                }
            } catch (error) {
                console.error('Office monitoring form submission error:', error);
                showToast('अनुगमन दर्ता गर्नमा समस्या भयो: ' + error.message, 'error');
            }
        });
    }

    // ============================================
    // DRESS TIME MONITORING FORM INTEGRATION
    // ============================================
    function integrateDressTimeForm() {
        const dressTimeForm = document.querySelector('#dressTimeFormContainer form');
        if (!dressTimeForm) return;

        dressTimeForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            try {
                const formData = {
                    employee_name: document.getElementById('employeeName')?.value || '',
                    employee_id: document.getElementById('employeeId')?.value || '',
                    office_name: document.getElementById('officeName')?.value || '',
                    department: document.getElementById('department')?.value || '',
                    province: document.getElementById('province')?.value || '',
                    district: document.getElementById('district')?.value || '',
                    monitoring_date: document.getElementById('monitoringDate')?.value || new Date().toISOString().split('T')[0],
                    scheduled_time: document.getElementById('scheduledTime')?.value || '',
                    actual_time: document.getElementById('actualTime')?.value || '',
                    time_violation: document.getElementById('timeViolation')?.checked || false,
                    dress_code_compliant: document.getElementById('dressCompliant')?.checked !== false,
                    dress_violation_count: parseInt(document.getElementById('dressViolationCount')?.value) || 0,
                    time_violation_count: parseInt(document.getElementById('timeViolationCount')?.value) || 0,
                    total_violations: parseInt(document.getElementById('totalViolations')?.value) || 0,
                    remarks: document.getElementById('remarks')?.value || ''
                };

                const result = await DressTimeAPI.create(formData);
                
                if (result.success) {
                    showToast('समय/पोशाक अनुगमन सफलतापूर्वक दर्ता भयो!', 'success');
                    dressTimeForm.reset();
                    loadDressTimeStatistics();
                } else {
                    showToast('अनुगमन दर्ता गर्नमा समस्या भयो: ' + result.error, 'error');
                }
            } catch (error) {
                console.error('Dress time form submission error:', error);
                showToast('अनुगमन दर्ता गर्नमा समस्या भयो: ' + error.message, 'error');
            }
        });
    }

    // ============================================
    // SURVEY FORM INTEGRATION
    // ============================================
    function integrateSurveyForm() {
        const surveyForm = document.getElementById('surveyForm');
        if (!surveyForm) return;
        if (surveyForm.dataset.apiSubmitAttached) return;
        surveyForm.dataset.apiSubmitAttached = 'true';

        surveyForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            try {
                const selectedAnswer = name => {
                    const input = surveyForm.querySelector(`input[name="${name}"]:checked`);
                    return input ? input.closest('label')?.textContent.trim() || input.value : '';
                };
                const checkedAnswers = name => Array.from(surveyForm.querySelectorAll(`input[name="${name}"]:checked`))
                    .map(input => input.closest('label')?.textContent.trim() || input.value);
                const fieldValue = labelText => Array.from(surveyForm.querySelectorAll('.field-row')).find(row =>
                    row.querySelector('.field-label')?.textContent.trim().startsWith(labelText)
                )?.querySelector('input, textarea')?.value || '';
                const answers = {};
                surveyForm.querySelectorAll('input[type="radio"]:checked').forEach(input => {
                    answers[input.name] = input.closest('label')?.textContent.trim() || input.value;
                });
                surveyForm.querySelectorAll('input[type="checkbox"]:checked').forEach(input => {
                    const sectionKey = input.name || input.closest('.section-body')?.id || `checkbox_${Object.keys(answers).length}`;
                    const answer = input.closest('label')?.textContent.trim() || input.value;
                    if (!answers[sectionKey]) answers[sectionKey] = [];
                    if (!Array.isArray(answers[sectionKey])) answers[sectionKey] = [answers[sectionKey]];
                    answers[sectionKey].push(answer.replace(/\s+/g, ' ').trim());
                });
                surveyForm.querySelectorAll('select, input[type="text"], textarea').forEach(input => {
                    const label = input.closest('.field-row')?.querySelector('.field-label')?.textContent.trim();
                    if (label && input.value) answers[label] = input.value;
                });

                const satisfaction = selectedAnswer('q7').includes('सन्तुष्ट') ? 5 : 1;
                const qualityAnswer = selectedAnswer('q16');
                const quality = qualityAnswer.includes('राम्रो') ? 5 : qualityAnswer.includes('मध्यम') ? 3 : 1;
                const timely = selectedAnswer('q4.3').includes('भयो');
                const hasCitizenCharter = selectedAnswer('q4.1').includes('छ');
                const knowsFee = selectedAnswer('q4.2').includes('छ');
                const paidExtra = selectedAnswer('q6').includes('पर्‍यो');
                const suggestion = document.getElementById('suggestionText')?.value || '';
                const formData = {
                    survey_date: [document.getElementById('surveyYear')?.value, document.getElementById('surveyMonth')?.value, document.getElementById('surveyDay')?.value].join('-'),
                    respondent_name: fieldValue('पूर्ण ठेगाना'),
                    respondent_type: selectedAnswer('ling'),
                    service_type: fieldValue('विवरण दिन चाहेको कार्यालयको नाम'),
                    office_visited: fieldValue('कार्यालय १'),
                    province: document.getElementById('surveyProvince')?.value || '',
                    district: document.getElementById('surveyDistrict')?.value || '',
                    local_level: document.getElementById('surveyLocalLevel')?.value || '',
                    full_address: fieldValue('पूर्ण ठेगाना'),
                    office_2: fieldValue('कार्यालय २'),
                    office_3: fieldValue('कार्यालय ३'),
                    good_service_office: fieldValue('राम्रो सेवा प्रवाह गर्ने कार्यालय'),
                    weak_service_office: fieldValue('सेवा प्रवाह कमजोर/अनियमित रहेका कार्यालय'),
                    overall_satisfaction: satisfaction,
                    service_quality: quality,
                    staff_behavior: 3,
                    timeliness: timely ? 5 : 1,
                    transparency: knowsFee ? 5 : 1,
                    accessibility: hasCitizenCharter ? 5 : 1,
                    recommendations: paidExtra ? selectedAnswer('q6') : '',
                    suggestions: suggestion,
                    answer_data: answers
                };

                const result = await SurveyAPI.create(formData);
                
                if (result.success) {
                    showToast('सर्वेक्षण सफलतापूर्वक दर्ता भयो!', 'success');
                    surveyForm.reset();
                    loadSurveyStatistics();
                    if (window.surveyDashboardInitialized && window.loadSurveyDashboardData) {
                        window.loadSurveyDashboardData();
                    }
                } else {
                    showToast('सर्वेक्षण दर्ता गर्नमा समस्या भयो: ' + result.error, 'error');
                }
            } catch (error) {
                console.error('Survey form submission error:', error);
                showToast('सर्वेक्षण दर्ता गर्नमा समस्या भयो: ' + error.message, 'error');
            }
        });
    }

    // ============================================
    // INVESTIGATION FORM INTEGRATION
    // ============================================
    function integrateInvestigationForm() {
        const chhanbinForm = document.querySelector('.chhanbin-modal-box form');
        if (!chhanbinForm) return;

        chhanbinForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            try {
                const formData = {
                    complaint_registration_number: document.getElementById('chhanbinFRegNo')?.value || '',
                    investigation_title: document.getElementById('chhanbinFTitle')?.value || '',
                    investigation_type: document.getElementById('chhanbinFType')?.value || '',
                    investigation_date: document.getElementById('chhanbinFDate')?.value || new Date().toISOString().split('T')[0],
                    investigator_name: document.getElementById('chhanbinFInvestigator')?.value || '',
                    investigation_team: document.getElementById('chhanbinFTeam')?.value || '',
                    location: document.getElementById('chhanbinFLocation')?.value || '',
                    province: document.getElementById('chhanbinFProvince')?.value || '',
                    district: document.getElementById('chhanbinFDistrict')?.value || '',
                    status: 'ongoing',
                    findings: document.getElementById('chhanbinFFindings')?.value || '',
                    recommendations: document.getElementById('chhanbinFRecommendations')?.value || '',
                    action_taken: document.getElementById('chhanbinFAction')?.value || '',
                    fiscal_year: document.getElementById('chhanbinFFiscalYear')?.value || ''
                };

                const result = await InvestigationsAPI.create(formData);
                
                if (result.success) {
                    showToast('छानविन/अन्वेषण सफलतापूर्वक दर्ता भयो!', 'success');
                    chhanbinForm.reset();
                    // Close modal
                    document.getElementById('chhanbinModalOverlay').style.display = 'none';
                    loadInvestigationStatistics();
                } else {
                    showToast('छानविन/अन्वेषण दर्ता गर्नमा समस्या भयो: ' + result.error, 'error');
                }
            } catch (error) {
                console.error('Investigation form submission error:', error);
                showToast('छानविन/अन्वेषण दर्ता गर्नमा समस्या भयो: ' + error.message, 'error');
            }
        });
    }

    // ============================================
    // TECHNICAL AUDIT FORM INTEGRATION
    // ============================================
    function integrateTechnicalAuditForm() {
        const taForm = document.querySelector('.ta-modal-box form');
        if (!taForm) return;

        taForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            try {
                const formData = {
                    project_name: document.getElementById('taProjectName')?.value || '',
                    project_id: document.getElementById('taProjectId')?.value || '',
                    audit_date: document.getElementById('taAuditDate')?.value || new Date().toISOString().split('T')[0],
                    audit_team: document.getElementById('taAuditTeam')?.value || '',
                    project_location: document.getElementById('taProjectLocation')?.value || '',
                    province: document.getElementById('taProvince')?.value || '',
                    district: document.getElementById('taDistrict')?.value || '',
                    project_type: document.getElementById('taProjectType')?.value || '',
                    technical_quality_score: parseFloat(document.getElementById('taQualityScore')?.value) || 0,
                    safety_compliance_score: parseFloat(document.getElementById('taSafetyScore')?.value) || 0,
                    progress_percentage: parseFloat(document.getElementById('taProgress')?.value) || 0,
                    budget_status: document.getElementById('taBudgetStatus')?.value || '',
                    technical_findings: document.getElementById('taFindings')?.value || '',
                    recommendations: document.getElementById('taRecommendations')?.value || '',
                    status: 'in_progress'
                };

                const result = await TechnicalAuditAPI.create(formData);
                
                if (result.success) {
                    showToast('प्राविधिक परीक्षण सफलतापूर्वक दर्ता भयो!', 'success');
                    taForm.reset();
                    // Close modal
                    document.getElementById('taModalOverlay').style.display = 'none';
                    loadTechnicalAuditStatistics();
                } else {
                    showToast('प्राविधिक परीक्षण दर्ता गर्नमा समस्या भयो: ' + result.error, 'error');
                }
            } catch (error) {
                console.error('Technical audit form submission error:', error);
                showToast('प्राविधिक परीक्षण दर्ता गर्नमा समस्या भयो: ' + error.message, 'error');
            }
        });
    }

    // ============================================
    // PROJECT MONITORING FORM INTEGRATION
    // ============================================
    function integrateProjectMonitoringForm() {
        const projectForm = document.querySelector('#projectMonitoringFormContainer form');
        if (!projectForm) return;

        projectForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            try {
                const photoInput = document.getElementById('projectPhotoAttachment');
                const photoAttachments = await Promise.all(Array.from(photoInput?.files || []).map(file => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve({ name: file.name, type: file.type, dataUrl: reader.result });
                    reader.onerror = () => reject(new Error(file.name + ' पढ्न सकिएन'));
                    reader.readAsDataURL(file);
                })));
                const getProjectDate = key => {
                    const group = projectForm.querySelector(`[data-date="${key}"]`);
                    return group ? {
                        year: group.querySelector('select:nth-child(1)')?.value || '',
                        month: group.querySelector('select:nth-child(2)')?.value || '',
                        day: group.querySelector('select:nth-child(3)')?.value || ''
                    } : null;
                };
                const formFields = {};
                projectForm.querySelectorAll('input, select, textarea').forEach(input => {
                    if (input.type === 'file' || input.type === 'radio' || input.type === 'checkbox') return;
                    const key = input.id || input.name || input.closest('tr')?.querySelector('.topic')?.textContent.trim() || input.placeholder || `field_${Object.keys(formFields).length + 1}`;
                    formFields[key] = input.value;
                });
                // Extract team members
                const teamMembers = [];
                document.querySelectorAll('.team-block').forEach(block => {
                    const name = block.querySelector('[data-team-name]')?.value || '';
                    const role = block.querySelector('[data-team-role]')?.value || '';
                    const dateSelect = block.querySelector('[data-date-inline]');
                    const date = dateSelect ? {
                        year: dateSelect.querySelector('select:nth-child(1)')?.value,
                        month: dateSelect.querySelector('select:nth-child(2)')?.value,
                        day: dateSelect.querySelector('select:nth-child(3)')?.value
                    } : null;

                    if (name) {
                        teamMembers.push({ name, role, date });
                    }
                });

                const formData = {
                    project_name: document.getElementById('projectName')?.value || '',
                    project_code: document.getElementById('agreementNo')?.value || '',
                    monitoring_date: new Date().toISOString().slice(0, 10),
                    monitoring_team: teamMembers.map(member => member.name).join(', '),
                    project_location: document.getElementById('fullAddress')?.value || '',
                    province: document.getElementById('province')?.value || '',
                    district: document.getElementById('district')?.value || '',
                    project_sector: document.getElementById('implementingBody')?.value || '',
                    project_type: document.getElementById('localLevel')?.value || '',
                    budget_allocated: parseFloat(document.getElementById('approvedCost')?.value) || 0,
                    budget_spent: parseFloat(document.getElementById('expenditureSoFar')?.value) || 0,
                    progress_percentage: parseFloat(document.getElementById('physicalProgress')?.value) || 0,
                    quality_score: 0,
                    timeline_status: '',
                    issues_identified: '',
                    team_members: teamMembers,
                    monitoring_findings: document.getElementById('monitoringFindings')?.value || '',
                    recommendations: document.getElementById('recommendations')?.value || '',
                    attachment_data: photoAttachments,
                    form_data: {
                        agreement_date: getProjectDate('agreementDate'),
                        start_date: getProjectDate('startDate'),
                        expected_end_date: getProjectDate('expectedEndDate'),
                        monitoring_date: getProjectDate('monitoringDate'),
                        fields: formFields,
                        answers: Object.fromEntries(Array.from(projectForm.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked')).map(input => [input.name || input.closest('td')?.previousElementSibling?.textContent.trim() || input.type, input.closest('label')?.textContent.trim() || input.value])),
                        team_members: teamMembers
                    },
                    status: 'ongoing'
                };

                const result = await ProjectMonitoringAPI.create(formData);
                
                if (result.success) {
                    showToast('आयोजना अनुगमन सफलतापूर्वक दर्ता भयो!', 'success');
                    projectForm.reset();
                    loadProjectMonitoringStatistics();
                } else {
                    showToast('आयोजना अनुगमन दर्ता गर्नमा समस्या भयो: ' + result.error, 'error');
                }
            } catch (error) {
                console.error('Project monitoring form submission error:', error);
                showToast('आयोजना अनुगमन दर्ता गर्नमा समस्या भयो: ' + error.message, 'error');
            }
        });
    }

    // ============================================
    // STATISTICS LOADING FUNCTIONS
    // ============================================
    async function loadUjiriStatistics() {
        try {
            const fiscalYear = document.getElementById('dashboardFiscalYearSelect')?.value || 'all';
            const currentDate = window.NepaliCalendar?.getCurrentDate?.() || '';
            const fiscalFilters = { current_date: currentDate };
            if (fiscalYear !== 'all') fiscalFilters.fiscal_year = fiscalYear;
            const result = await UjuriAPI.getStatistics(fiscalFilters);
            if (result.success) {
                if (window.updateUjiriDashboard) {
                    window.updateUjiriDashboard(result.data);
                }
            }
        } catch (error) {
            console.error('Error loading ujiri statistics:', error);
        }
    }

    async function loadOfficeMonitoringStatistics() {
        try {
            const result = await OfficeMonitoringAPI.getStatistics();
            if (result.success) {
                if (window.updateOfficeMonitoringDashboard) {
                    window.updateOfficeMonitoringDashboard(result.data);
                }
            }
        } catch (error) {
            console.error('Error loading office monitoring statistics:', error);
        }
    }

    async function loadDressTimeStatistics() {
        try {
            const result = await DressTimeAPI.getStatistics();
            if (result.success) {
                if (window.updateDressTimeDashboard) {
                    window.updateDressTimeDashboard(result.data);
                }
            }
        } catch (error) {
            console.error('Error loading dress time statistics:', error);
        }
    }

    async function loadSurveyStatistics() {
        try {
            const result = await SurveyAPI.getStatistics();
            if (result.success) {
                if (window.updateSurveyDashboard) {
                    window.updateSurveyDashboard(result.data);
                }
            }
        } catch (error) {
            console.error('Error loading survey statistics:', error);
        }
    }

    async function loadInvestigationStatistics() {
        try {
            const result = await InvestigationsAPI.getStatistics();
            if (result.success) {
                if (window.updateInvestigationDashboard) {
                    window.updateInvestigationDashboard(result.data);
                }
            }
        } catch (error) {
            console.error('Error loading investigation statistics:', error);
        }
    }

    async function loadTechnicalAuditStatistics() {
        try {
            const result = await TechnicalAuditAPI.getStatistics();
            if (result.success) {
                if (window.updateTechnicalAuditDashboard) {
                    window.updateTechnicalAuditDashboard(result.data);
                }
            }
        } catch (error) {
            console.error('Error loading technical audit statistics:', error);
        }
    }

    async function loadProjectMonitoringStatistics() {
        try {
            const result = await ProjectMonitoringAPI.getStatistics();
            if (result.success) {
                if (window.updateProjectMonitoringDashboard) {
                    window.updateProjectMonitoringDashboard(result.data);
                }
            }
        } catch (error) {
            console.error('Error loading project monitoring statistics:', error);
        }
    }

    // Initialize all form integrations
    integrateUjiriForm();
    integrateOfficeMonitoringForm();
    integrateDressTimeForm();
    integrateSurveyForm();
    integrateInvestigationForm();
    integrateTechnicalAuditForm();
    integrateProjectMonitoringForm();

    // Load initial statistics when pages are shown
    // This will be called from the main navigation logic
    window.loadStatistics = {
        ujiri: loadUjiriStatistics,
        officeMonitoring: loadOfficeMonitoringStatistics,
        dressTime: loadDressTimeStatistics,
        survey: loadSurveyStatistics,
        investigations: loadInvestigationStatistics,
        technicalAudit: loadTechnicalAuditStatistics,
        projectMonitoring: loadProjectMonitoringStatistics
    };

    loadProjectMonitoringStatistics();
});