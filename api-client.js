// API Client for Risk Map Dashboard
// Handles all API communication with the backend server

class APIClient {
    constructor() {
        // Handle both browser and Node.js environments
        const configuredBaseURL = (typeof process !== 'undefined' && process.env && process.env.API_BASE_URL)
            ? process.env.API_BASE_URL
            : '';
        
        // Check for deployed environment via window.SUPABASE_URL or custom config
        const supabaseUrl = typeof window !== 'undefined' && window.SUPABASE_URL;
        const customApiUrl = typeof window !== 'undefined' && window.API_BASE_URL;
        
        // Check if we're on Netlify or other deployed environment
        const isDeployed = typeof window !== 'undefined' && 
            window.location.hostname !== 'localhost' && 
            window.location.hostname !== '127.0.0.1' &&
            !window.location.hostname.startsWith('192.168.');
        
        const browserNeedsBackendOrigin = typeof window !== 'undefined' &&
            (window.location.protocol === 'file:' ||
                (['localhost', '127.0.0.1'].includes(window.location.hostname) && window.location.port !== '3000'));
        
        // Priority: custom API URL > deployed detection > Supabase URL > configured base URL > localhost
        if (customApiUrl) {
            this.baseURL = customApiUrl;
        } else if (isDeployed) {
            // On deployed environment, always use relative path which will be redirected by netlify.toml
            this.baseURL = '/api';
        } else if (supabaseUrl) {
            const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
            this.baseURL = projectRef ? `https://${projectRef}.supabase.co/functions/v1/api` : '/api';
        } else if (configuredBaseURL) {
            this.baseURL = configuredBaseURL;
        } else if (browserNeedsBackendOrigin) {
            this.baseURL = 'http://localhost:3000/api';
        } else {
            this.baseURL = '/api';
        }
        
        console.log('API Client initialized with baseURL:', this.baseURL, 'isDeployed:', isDeployed);
        
        this.headers = {
            'Content-Type': 'application/json'
        };
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.headers,
                ...(sessionStorage.getItem('dashboardAuthToken') || localStorage.getItem('dashboardAuthToken')
                    ? { Authorization: `Bearer ${sessionStorage.getItem('dashboardAuthToken') || localStorage.getItem('dashboardAuthToken')}` }
                    : {}),
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);
            const contentType = response.headers.get('content-type') || '';
            const data = contentType.includes('application/json')
                ? await response.json()
                : { success: false, error: `API returned ${response.status} ${response.statusText}` };

            if (!response.ok) {
                if (response.status === 401 && !endpoint.startsWith('/auth/')) {
                    sessionStorage.clear();
                    localStorage.removeItem('dashboardRememberMe');
                    localStorage.removeItem('dashboardUsername');
                    localStorage.removeItem('dashboardAuthToken');
                    localStorage.removeItem('dashboardUser');
                    if (window.location.pathname.split('/').pop() !== 'login.html') {
                        window.location.href = 'login.html';
                    }
                }
                throw new Error(data.error || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    }

    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url, { method: 'GET' });
    }

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

// Initialize API client
const api = new APIClient();

// ============================================
// USER MANAGEMENT API
// ============================================
const UsersAPI = {
    async getAll() {
        return api.get('/users');
    },

    async create(data) {
        return api.post('/users', data);
    },

    async update(id, data) {
        return api.put(`/users/${id}`, data);
    },

    async delete(id) {
        return api.delete(`/users/${id}`);
    }
};

const AuthAPI = {
    async login(username, password) {
        return api.post('/auth/login', { username, password });
    },

    async logout(username) {
        return api.post('/auth/logout', { username });
    },

    async changePassword(username, currentPassword, newPassword) {
        return api.post('/users/change-password', { username, currentPassword, newPassword });
    }
};

const AuditLogsAPI = {
    async getAll(filters = {}) {
        return api.get('/audit-logs', filters);
    }
};

// ============================================
// UJIRI MANAGEMENT API
// ============================================
const UjuriAPI = {
    async getAll(filters = {}) {
        return api.get('/ujuri', filters);
    },

    async getStatistics(filters = {}) {
        return api.get('/ujuri/statistics', filters);
    },

    async create(data) {
        return api.post('/ujuri', data);
    },

    async update(id, data) {
        return api.put(`/ujuri/${id}`, data);
    },

    async delete(id) {
        return api.delete(`/ujuri/${id}`);
    }
};

// ============================================
// OFFICE MONITORING API
// ============================================
const OfficeMonitoringAPI = {
    async getAll(filters = {}) {
        return api.get('/office-monitoring', filters);
    },

    async getStatistics() {
        return api.get('/office-monitoring/statistics');
    },

    async create(data) {
        return api.post('/office-monitoring', data);
    },

    async update(id, data) {
        return api.put(`/office-monitoring/${id}`, data);
    },

    async delete(id) {
        return api.delete(`/office-monitoring/${id}`);
    }
};

// ============================================
// DRESS TIME MONITORING API
// ============================================
const DressTimeAPI = {
    async getAll(filters = {}) {
        return api.get('/dress-time', filters);
    },

    async getStatistics() {
        return api.get('/dress-time/statistics');
    },

    async create(data) {
        return api.post('/dress-time', data);
    },

    async update(id, data) {
        return api.put(`/dress-time/${id}`, data);
    },

    async delete(id) {
        return api.delete(`/dress-time/${id}`);
    }
};

// ============================================
// SERVICE SURVEY API
// ============================================
const SurveyAPI = {
    async getAll(filters = {}) {
        return api.get('/survey', filters);
    },

    async getStatistics() {
        return api.get('/survey/statistics');
    },

    async create(data) {
        return api.post('/survey', data);
    }
};

// ============================================
// INVESTIGATIONS API
// ============================================
const InvestigationsAPI = {
    async getAll(filters = {}) {
        return api.get('/investigations', filters);
    },

    async getStatistics() {
        return api.get('/investigations/statistics');
    },

    async create(data) {
        return api.post('/investigations', data);
    }
};

// ============================================
// TECHNICAL AUDIT API
// ============================================
const TechnicalAuditAPI = {
    async getAll(filters = {}) {
        return api.get('/technical-audit', filters);
    },

    async getStatistics() {
        return api.get('/technical-audit/statistics');
    },

    async create(data) {
        return api.post('/technical-audit', data);
    },

    async update(id, data) {
        return api.put(`/technical-audit/${id}`, data);
    }
};

// ============================================
// PROJECT MONITORING API
// ============================================
const ProjectMonitoringAPI = {
    async getAll(filters = {}) {
        return api.get('/project-monitoring', filters);
    },

    async getStatistics() {
        return api.get('/project-monitoring/statistics');
    },

    async create(data) {
        return api.post('/project-monitoring', data);
    },

    async update(id, data) {
        return api.put(`/project-monitoring/${id}`, data);
    },

    async delete(id) {
        return api.delete(`/project-monitoring/${id}`);
    },

    async update(id, data) {
        return api.put(`/project-monitoring/${id}`, data);
    },

    async delete(id) {
        return api.delete(`/project-monitoring/${id}`);
    }
};

// ============================================
// CALENDAR EVENTS API
// ============================================
const CalendarAPI = {
    async getAll() {
        return api.get('/calendar-events');
    },

    async create(data) {
        return api.post('/calendar-events', data);
    },

    async update(id, data) {
        return api.put(`/calendar-events/${id}`, data);
    },

    async delete(id) {
        return api.delete(`/calendar-events/${id}`);
    }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) {
        // Create toast element if it doesn't exist
        const toastDiv = document.createElement('div');
        toastDiv.id = 'toast';
        toastDiv.className = 'toast';
        document.body.appendChild(toastDiv);
    }

    const toastElement = document.getElementById('toast');
    toastElement.textContent = message;
    toastElement.className = `toast toast-${type} show`;

    setTimeout(() => {
        toastElement.classList.remove('show');
    }, 3000);
}

// Convert Nepali date to English date format
function convertNepaliToEnglishDate(year, month, day) {
    // This is a simplified conversion - in production, use a proper library
    // For now, we'll return the Nepali date as-is since the backend expects proper date format
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

// Handle form submission with API
async function handleFormSubmit(formId, apiMethod, formDataExtractor) {
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Form with id ${formId} not found`);
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const formData = formDataExtractor(form);
            const result = await apiMethod(formData);
            
            if (result.success) {
                showToast('Data saved successfully!', 'success');
                form.reset();
                // Optionally redirect or refresh
                return result.data;
            } else {
                showToast('Error saving data: ' + result.error, 'error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showToast('Error saving data: ' + error.message, 'error');
        }
    });
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        api,
        UjuriAPI,
        OfficeMonitoringAPI,
        DressTimeAPI,
        SurveyAPI,
        InvestigationsAPI,
        TechnicalAuditAPI,
        ProjectMonitoringAPI,
        CalendarAPI,
        showToast,
        convertNepaliToEnglishDate,
        handleFormSubmit
    };
}