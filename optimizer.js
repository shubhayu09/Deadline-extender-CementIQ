// API Configuration
const IS_LOCAL = window.location.hostname === 'localhost';
const OPTIMIZER_API_URL = IS_LOCAL
    ? 'http://localhost:5001/get-optimal-solution'
    : 'https://cement-optimizer-xxx.asia-southeast1.run.app/get-optimal-solution';

// Map F1, F2... to readable names
const FEATURE_LABELS = {
    'F1': 'Feed Size',
    'F2': 'Product Size',
    'F3': 'Mill Power Consumption 1',
    'F4': 'Mill Inlet Temperature',
    'F5': 'Blending Efficiency',
    'F6': 'C5 Temperature',
    'F7': 'Heat Recovery Efficiency',
    'F8': 'Fuel Flow Rate',
    'F9': 'Primary Fuel Flow',
    'F10': 'Secondary Air Temperature',
    'F11': 'Kiln Drive Power',
    'F12': 'Clinker Inlet Temperature',
    'F13': 'Cooling Air Flow',
    'F14': 'Mill Power Consumption 2',
    'F15': 'Packing Rate'
};

let lastOptimalSolution = null;

// Get optimal solution from backend
async function getOptimalSolution() {
    console.log('[DEBUG] getOptimalSolution() called');

    // Show loading
    document.getElementById('loadingSpinner').classList.remove('hidden');
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('errorMessage').classList.add('hidden');

    const btn = document.getElementById('getOptimalBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Loading...';

    try {
        console.log('[DEBUG] Fetching from:', OPTIMIZER_API_URL);

        const response = await fetch(OPTIMIZER_API_URL, {
            method: 'GET',
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        console.log('[DEBUG] Result:', result);

        if (result.success) {
            lastOptimalSolution = result.solution;
            displaySolution(result);
        } else {
            throw new Error(result.error || 'Failed to get solution');
        }

    } catch (error) {
        console.error('[ERROR]', error);
        showError(`Failed to load solution: ${error.message}`);
    } finally {
        document.getElementById('loadingSpinner').classList.add('hidden');
        btn.disabled = false;
        btn.textContent = '⚡ Get Optimal Solution';
    }
}

// Display the optimal solution
// Display the optimal solution
// Display the optimal solution
function displaySolution(result) {
    console.log('[DEBUG] displaySolution() called');

    // Show results section
    document.getElementById('resultsSection').classList.remove('hidden');

    const solution = result.solution;
    console.log('[DEBUG] Full solution object:', solution);

    // Display efficiency
    const efficiency = solution.efficiency || solution.predicted_efficiency || 'N/A';
    document.getElementById('resultEfficiency').textContent =
        (typeof efficiency === 'number' ? efficiency.toFixed(2) : efficiency) + '%';

    // Populate table with all features
    const tableBody = document.getElementById('featuresTableBody');
    tableBody.innerHTML = '';

    let index = 1;

    // FIX: Features are inside solution.parameters object
    const features = solution.parameters || solution;
    console.log('[DEBUG] Features object:', features);
    console.log('[DEBUG] Features keys:', Object.keys(features));

    // Iterate through all feature keys (F1, F2, ..., F15)
    for (const [key, value] of Object.entries(features)) {
        console.log(`[DEBUG] Processing key: ${key}, value: ${value}, type: ${typeof value}`);

        // Only add rows for F1-F15 (numeric features)
        if (!key.startsWith('F')) {
            console.log(`[DEBUG] Skipping non-F key: ${key}`);
            continue;
        }

        if (typeof value !== 'number') {
            console.log(`[DEBUG] Skipping non-numeric value for ${key}`);
            continue;
        }

        // Get readable label
        const label = FEATURE_LABELS[key] || key;

        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${index}</td>
      <td>${label}</td>
      <td class="value-cell">${value.toFixed(2)}</td>
    `;
        tableBody.appendChild(row);
        console.log(`[DEBUG] Added row ${index}: ${label} = ${value.toFixed(2)}`);
        index++;
    }

    console.log('[SUCCESS] Solution displayed with', index - 1, 'features');
}


// Show error
function showError(message) {
    console.error('[ERROR]', message);
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = '❌ ' + message;
    errorDiv.classList.remove('hidden');
}

// Copy to simulator
function copyToSimulator() {
    if (!lastOptimalSolution) {
        showError('No solution loaded');
        return;
    }

    console.log('[DEBUG] copyToSimulator() called');

    // Convert F1...F15 to original parameter names for simulator
    const originalParamNames = {
        'F1': 'FeedSize',
        'F2': 'ProductSize',
        'F3': 'MillPowerConsumption1',
        'F4': 'MillInletTemperature',
        'F5': 'BlendingEfficiency',
        'F6': 'C5Temperature',
        'F7': 'HeatRecoveryEfficiency',
        'F8': 'FuelFlowRate',
        'F9': 'PrimaryFuelFlow',
        'F10': 'SecondaryAirTemp',
        'F11': 'KilnDrivePower',
        'F12': 'ClinkerInletTemp',
        'F13': 'CoolingAirFlow',
        'F14': 'MillPowerConsumption2',
        'F15': 'PackingRate'
    };

    // Convert solution from F1...F15 format to original parameter names
    const convertedSolution = {};
    for (const [key, value] of Object.entries(lastOptimalSolution)) {
        const originalKey = originalParamNames[key] || key;
        convertedSolution[originalKey] = value;
    }

    console.log('[DEBUG] Converted solution:', convertedSolution);

    // Store in sessionStorage
    sessionStorage.setItem('optimizedFeatures', JSON.stringify(convertedSolution));

    // Redirect
    window.location.href = 'simulator.html?fromOptimizer=true';
}

// Download results as CSV
function downloadResults() {
    if (!lastOptimalSolution) {
        showError('No solution to download');
        return;
    }

    console.log('[DEBUG] downloadResults() called');

    let csv = 'Feature,Optimal Value\n';

    for (const [key, value] of Object.entries(lastOptimalSolution)) {
        if (key !== 'efficiency' && key !== 'predicted_efficiency' && key !== 'rank') {
            const label = FEATURE_LABELS[key] || key;
            csv += `${label},${typeof value === 'number' ? value.toFixed(2) : value}\n`;
        }
    }

    const efficiency = lastOptimalSolution.efficiency || lastOptimalSolution.predicted_efficiency || 'N/A';
    csv += `\nMaximum Efficiency,${efficiency.toFixed(2)}%\n`;

    // Download
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `cement_optimal_solution.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
