const fs = require('fs');
const code = fs.readFileSync('c:/Users/acer/Desktop/risk_map1/script.js', 'utf8');

const helpers = `

// ==========================================
// Nepal Data Dynamic Dropdowns (GLOBAL SCOPE)
// ==========================================

function getNepalProvinces() {
    if (window.nepalData && window.nepalData.PROVINCE) {
        return Object.values(window.nepalData.PROVINCE);
    }
    return [
        '\u0915\u094b\u0936\u0940 \u092a\u094d\u0930\u0926\u0947\u0936', '\u092e\u0927\u0947\u0938 \u092a\u094d\u0930\u0926\u0947\u0936', '\u092c\u093e\u0917\u092e\u0924\u0940 \u092a\u094d\u0930\u0926\u0947\u0936',
        '\u0917\u0923\u094d\u0921\u0915\u0940 \u092a\u094d\u0930\u0926\u0947\u0936', '\u0932\u0941\u092e\u094d\u092c\u093f\u0928\u0940 \u092a\u094d\u0930\u0926\u0947\u0936',
        '\u0915\u0930\u094d\u0923\u093e\u0932\u0940 \u092a\u094d\u0930\u0926\u0947\u0936', '\u0938\u0941\u0926\u0942\u0930\u092a\u0936\u094d\u091a\u093f\u092e \u092a\u094d\u0930\u0926\u0947\u0936'
    ];
}

function getNepalMinistries() {
    if (window.nepalData && Array.isArray(window.nepalData.MINISTRIES)) {
        return window.nepalData.MINISTRIES;
    }
    return [
        '\u092a\u094d\u0930\u0927\u093e\u0928\u092e\u0928\u094d\u0924\u094d\u0930\u0940 \u0924\u0925\u093e \u092e\u0928\u094d\u0924\u094d\u0930\u093f\u092a\u0930\u093f\u0937\u0926\u094d\u0915\u094b \u0915\u093e\u0930\u094d\u092f\u093e\u0932\u092f',
        '\u0905\u0930\u094d\u0925 \u092e\u0928\u094d\u0924\u094d\u0930\u093e\u0932\u092f', '\u0917\u0943\u0939 \u092e\u0928\u094d\u0924\u094d\u0930\u093e\u0932\u092f',
        '\u092a\u0930\u0930\u093e\u0937\u094d\u091f\u094d\u0930 \u092e\u0928\u094d\u0924\u094d\u0930\u093e\u0932\u092f',
        '\u0936\u093f\u0915\u094d\u0937\u093e, \u0935\u093f\u091c\u094d\u091e\u093e\u0928 \u0924\u0925\u093e \u092a\u094d\u0930\u0935\u093f\u0927\u093f \u092e\u0928\u094d\u0924\u094d\u0930\u093e\u0932\u092f',
        '\u0938\u094d\u0935\u093e\u0938\u094d\u0925\u094d\u092f \u0924\u0925\u093e \u091c\u0928\u0938\u0902\u0916\u094d\u092f\u093e \u092e\u0928\u094d\u0924\u094d\u0930\u093e\u0932\u092f',
        '\u0915\u0943\u0937\u093f \u0924\u0925\u093e \u092a\u0936\u0941\u092a\u0928\u094d\u091b\u0940 \u0935\u093f\u0915\u093e\u0938 \u092e\u0928\u094d\u0924\u094d\u0930\u093e\u0932\u092f',
        '\u0935\u0928 \u0924\u0925\u093e \u0935\u093e\u0924\u093e\u0935\u0930\u0923 \u092e\u0928\u094d\u0924\u094d\u0930\u093e\u0932\u092f',
        '\u0909\u0926\u094d\u092f\u094b\u0917, \u0935\u093e\u0923\u093f\u091c\u094d\u092f \u0924\u0925\u093e \u0906\u092a\u0942\u0930\u094d\u0924\u093f \u092e\u0928\u094d\u0924\u094d\u0930\u093e\u0932\u092f',
        '\u092d\u094c\u0924\u093f\u0915 \u092a\u0942\u0930\u094d\u0935\u093e\u0927\u093e\u0930 \u0924\u0925\u093e \u092f\u093e\u0924\u093e\u092f\u093e\u0924 \u092e\u0928\u094d\u0924\u094d\u0930\u093e\u0932\u092f',
        '\u090a\u0930\u094d\u091c\u093e, \u091c\u0932\u0938\u094d\u0930\u094b\u0924 \u0924\u0925\u093e \u0938\u093f\u0902\u091a\u093e\u0907 \u092e\u0928\u094d\u0924\u094d\u0930\u093e\u0932\u092f',
        '\u0938\u0939\u0930\u0940 \u0935\u093f\u0915\u093e\u0938 \u092e\u0928\u094d\u0924\u094d\u0930\u093e\u0932\u092f',
        '\u092d\u0942\u092e\u093f \u0935\u094d\u092f\u0935\u0938\u094d\u0925\u093e \u092e\u0928\u094d\u0924\u094d\u0930\u093e\u0932\u092f',
        '\u0938\u0919\u094d\u0918\u0940\u092f \u092e\u093e\u092e\u093f\u0932\u093e \u0924\u0925\u093e \u0938\u093e\u092e\u093e\u0928\u094d\u092f \u092a\u094d\u0930\u0936\u093e\u0938\u0928 \u092e\u0928\u094d\u0924\u094d\u0930\u093e\u0932\u092f',
        '\u0936\u094d\u0930\u092e, \u0930\u094b\u091c\u0917\u093e\u0930 \u0924\u0925\u093e \u0938\u093e\u092e\u093e\u091c\u093f\u0915 \u0938\u0941\u0930\u0915\u094d\u0937\u093e \u092e\u0928\u094d\u0924\u094d\u0930\u093e\u0932\u092f',
        '\u092e\u0939\u093f\u0932\u093e, \u092c\u093e\u0932\u092c\u093e\u0932\u093f\u0915\u093e \u0924\u0925\u093e \u0938\u093e\u092e\u093e\u091c\u093f\u0915 \u0915\u0932\u094d\u092f\u093e\u0923 \u092e\u0928\u094d\u0924\u094d\u0930\u093e\u0932\u092f',
        '\u092f\u0941\u0935\u093e \u0924\u0925\u093e \u0916\u0947\u0932\u0915\u0941\u0926 \u092e\u0928\u094d\u0924\u094d\u0930\u093e\u0932\u092f',
        '\u0930\u0915\u094d\u0937\u093e \u092e\u0928\u094d\u0924\u094d\u0930\u093e\u0932\u092f',
        '\u0915\u093e\u0928\u0941\u0928, \u0928\u094d\u092f\u093e\u092f \u0924\u0925\u093e \u0938\u0902\u0938\u0926\u0940\u092f \u092e\u093e\u092e\u093f\u0932\u093e \u092e\u0928\u094d\u0924\u094d\u0930\u093e\u0932\u092f',
        '\u0938\u091e\u094d\u091a\u093e\u0930 \u0924\u0925\u093e \u0938\u0942\u091a\u0928\u093e \u092a\u094d\u0930\u0935\u093f\u0927\u093f \u092e\u0928\u094d\u0924\u094d\u0930\u093e\u0932\u092f',
        '\u0938\u0902\u0938\u094d\u0915\u0943\u0924\u093f, \u092a\u0930\u094d\u092f\u091f\u0928 \u0924\u0925\u093e \u0928\u093e\u0917\u0930\u093f\u0915 \u0909\u0921\u094d\u0921\u092f\u0928 \u092e\u0928\u094d\u0924\u094d\u0930\u093e\u0932\u092f',
        '\u0916\u093e\u0928\u0947\u092a\u093e\u0928\u0940 \u092e\u0928\u094d\u0924\u094d\u0930\u093e\u0932\u092f',
        '\u0930\u093e\u0937\u094d\u091f\u094d\u0930\u093f\u092f \u092f\u094b\u091c\u0928\u093e \u0906\u092f\u094b\u0917',
        '\u092e\u0939\u093e\u0932\u0947\u0916\u093e \u0928\u093f\u092f\u0928\u094d\u0924\u094d\u0930\u0915 \u0915\u093e\u0930\u094d\u092f\u093e\u0932\u092f',
        '\u0935\u093f\u091c\u094d\u091e\u093e\u0928 \u092a\u094d\u0930\u0935\u093f\u0927\u093f \u0924\u0925\u093e \u0928\u0935\u092a\u094d\u0930\u0935\u0930\u094d\u0924\u0928 \u092e\u0928\u094d\u0924\u094d\u0930\u093e\u0932\u092f',
        '\u0938\u0902\u0935\u0948\u0927\u093e\u0928\u093f\u0915 \u0905\u0919\u094d\u0917\u0939\u0930\u0942'
    ];
}

function getNepalProvinceId(p) {
    if (!p) return null;
    if (/^[1-7]$/.test(String(p).trim())) return parseInt(p, 10);
    var clean = function(s) { return String(s).replace(/\\s+/g, '').replace('\u092e\u0927\u0947\u0936', '\u092e\u0927\u0947\u0938'); };
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
    var provPH = isFilter ? '\u0938\u092c\u0948 \u092a\u094d\u0930\u0926\u0947\u0936' : '\u092a\u094d\u0930\u0926\u0947\u0936 \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d';
    var distPH = isFilter ? '\u0938\u092c\u0948 \u091c\u093f\u0932\u094d\u0932\u093e' : '\u091c\u093f\u0932\u094d\u0932\u093e \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d';
    var distDisPH = '\u092a\u0939\u093f\u0932\u0947 \u092a\u094d\u0930\u0926\u0947\u0936 \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d';
    var muniPH = isFilter ? '\u0938\u092c\u0948 \u0938\u094d\u0925\u093e\u0928\u0940\u092f \u0924\u0939' : '\u0938\u094d\u0925\u093e\u0928\u0940\u092f \u0924\u0939 \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d';
    var muniDisPH = '\u092a\u0939\u093f\u0932\u0947 \u091c\u093f\u0932\u094d\u0932\u093e \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d';
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
});
`;

fs.writeFileSync('c:/Users/acer/Desktop/risk_map1/script.js', code + helpers, 'utf8');
console.log('Appended helpers. New line count:', (code + helpers).split('\n').length);
