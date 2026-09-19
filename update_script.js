// update_script.js - Utility to patch script.js with unified Nepali date dropdown functions
// Run with: node update_script.js

const fs = require('fs');
const path = require('path');

const scriptPath = 'c:/Users/acer/Desktop/risk_map1/script.js';

if (!fs.existsSync(scriptPath)) {
    console.error('ERROR: script.js not found at', scriptPath);
    process.exit(1);
}

let script = fs.readFileSync(scriptPath, 'utf8');

// Check if already patched
if (script.includes('window.setupNepaliDateDropdowns')) {
    console.log('INFO: script.js already has window.setupNepaliDateDropdowns. No changes needed.');
    process.exit(0);
}

// Build the patch using array join (avoids nested backtick issues)
const lines = [
    '',
    '// ==========================================',
    '// Global Nepali Date Dropdown Helpers',
    '// ==========================================',
    'window.setupNepaliDateDropdowns = window.setupNepaliDateDropdowns || function(yId, mId, dId, emptyText, valFormat) {',
    '    emptyText = emptyText || {y: "साल", m: "महिना", d: "गते"};',
    '    valFormat = valFormat || "num";',
    '    var ys = document.getElementById(yId);',
    '    var ms = document.getElementById(mId);',
    '    var ds = document.getElementById(dId);',
    '    var curY = 2083, curM = 5, curD = 6;',
    '    if (window.NepaliCalendar && typeof window.NepaliCalendar.getCurrentDate === "function") {',
    '        var dsStr = window.NepaliCalendar.getCurrentDate();',
    '        if (dsStr) {',
    '            var p = dsStr.split("-");',
    '            curY = parseInt(p[0], 10); curM = parseInt(p[1], 10); curD = parseInt(p[2], 10);',
    '        }',
    '    }',
    '    var nDigits = ["0","1","2","3","4","5","6","7","8","9"];',
    '    var nMonths = ["बैशाख","जेठ","असार","साउन","भदौ","असोज","कार्तिक","मंसिर","पुष","माघ","फागुन","चैत"];',
    '    function toNN(n) { return String(n).split("").map(function(d){ return nDigits[d] || d; }).join(""); }',
    '    if (ys) {',
    '        ys.innerHTML = "<option value=\\"\\">" + emptyText.y + "</option>";',
    '        for (var y = 2075; y <= 2090; y++) {',
    '            var opt = document.createElement("option"); opt.value = y; opt.textContent = toNN(y);',
    '            if (y === curY) opt.selected = true; ys.appendChild(opt);',
    '        }',
    '    }',
    '    if (ms) {',
    '        ms.innerHTML = "<option value=\\"\\">" + emptyText.m + "</option>";',
    '        nMonths.forEach(function(m, i) {',
    '            var opt = document.createElement("option");',
    '            opt.value = (valFormat === "text") ? m : (i + 1);',
    '            opt.textContent = m; if ((i + 1) === curM) opt.selected = true; ms.appendChild(opt);',
    '        });',
    '    }',
    '    if (ds) {',
    '        ds.innerHTML = "<option value=\\"\\">" + emptyText.d + "</option>";',
    '        for (var d = 1; d <= 32; d++) {',
    '            var opt2 = document.createElement("option"); opt2.value = d; opt2.textContent = toNN(d);',
    '            if (d === curD) opt2.selected = true; ds.appendChild(opt2);',
    '        }',
    '    }',
    '};',
    '',
    'window.initializeNepaliDateDropdownsForDressTime = window.initializeNepaliDateDropdownsForDressTime || function() {',
    '    if (window.setupNepaliDateDropdowns) {',
    '        window.setupNepaliDateDropdowns("dtNepaliYear", "dtNepaliMonth", "dtNepaliDay");',
    '    }',
    '};',
    '',
];

const patch = lines.join('\n');
script += patch;
fs.writeFileSync(scriptPath, script, 'utf8');
console.log('SUCCESS: script.js patched successfully.');
console.log('New line count:', script.split('\n').length);
