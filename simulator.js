// API Configuration
const IS_LOCAL = window.location.hostname === 'localhost' || window.location.hostname === '';
const PREDICTION_API_URL = IS_LOCAL
  ? 'http://localhost:5000/predict'
  : 'https://cement-simulator-user-276474647646.asia-southeast1.run.app/predict';


const paramRanges = {
  FeedSize: { min: 914.00, max: 1200.00 },
  ProductSize: { min: 19.00, max: 22.20 },
  MillPowerConsumption1: { min: 1600.00, max: 1922.00 },
  MillInletTemperature: { min: 96.00, max: 120.00 },
  BlendingEfficiency: { min: 88.40, max: 95.00 },
  C5Temperature: { min: 850.00, max: 891.00 },
  HeatRecoveryEfficiency: { min: 85.00, max: 90.00 },
  FuelFlowRate: { min: 4.00, max: 5.90 },
  PrimaryFuelFlow: { min: 8.00, max: 10.00 },
  SecondaryAirTemp: { min: 908.00, max: 1100.00 },
  KilnDrivePower: { min: 800.00, max: 1200.00 },
  ClinkerInletTemp: { min: 1250.00, max: 1400.00 },
  CoolingAirFlow: { min: 437.00, max: 600.00 },
  MillPowerConsumption2: { min: 2052.00, max: 2500.00 },
  PackingRate: { min: 10.80, max: 15.00 }
};


const paramStep = {
  FeedSize:1, ProductSize:1, MillPowerConsumption1:1, MillInletTemperature:1,
  BlendingEfficiency:2, C5Temperature:2, HeatRecoveryEfficiency:2,
  FuelFlowRate:3, PrimaryFuelFlow:3, SecondaryAirTemp:3,
  KilnDrivePower:4, ClinkerInletTemp:4,
  CoolingAirFlow:5,
  MillPowerConsumption2:6, PackingRate:6
};

const invalidSteps = new Set();

function validateParam(inputEl) {
  const key   = inputEl.dataset.param;
  const value = parseFloat(inputEl.value);
  const range = paramRanges[key];
  const step  = paramStep[key];

  invalidSteps.delete(step);
  inputEl.closest('.param-row').classList.remove('error');

  if (range && !isNaN(value)) {
    if (value < range.min || value > range.max) {
      invalidSteps.add(step);
      inputEl.closest('.param-row').classList.add('error');
    }
  }
  updateStepImage();
  updateAlerts();
}

// Show range tooltip on hover
function showRangeTooltip(event) {
  const input = event.target;
  const paramKey = input.getAttribute('data-param');
  const range = paramRanges[paramKey];

  if (!range) return;

  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'param-tooltip';
  tooltip.textContent = `📊 Range: ${range.min} - ${range.max}`;

  // Position tooltip above the input
  document.body.appendChild(tooltip);

  const rect = input.getBoundingClientRect();
  tooltip.style.position = 'fixed';
  tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
  tooltip.style.top = (rect.top - 40) + 'px';

  // Store tooltip reference on input for removal later
  input.currentTooltip = tooltip;
}

// Hide range tooltip on mouse leave
function hideRangeTooltip(event) {
  const input = event.target;
  if (input.currentTooltip) {
    input.currentTooltip.remove();
    input.currentTooltip = null;
  }
}

function updateStepImage() {
  const img = document.getElementById('stepImage');
  if (invalidSteps.size === 0) {
    img.src = 'images/default.png';
  } else {
    const stepNum = Math.min(...invalidSteps);
    img.src = `images/step${stepNum}.png`;
  }
}

function updateAlerts() {
  const alertDiv = document.getElementById('outOfBoundsMsg');
  if (invalidSteps.size === 0) {
    alertDiv.textContent = '';
    alertDiv.classList.add('hidden');
  } else {
    alertDiv.textContent = 'You are out of bound, please look into the process.';
    alertDiv.classList.remove('hidden');
  }
}

function updateTime() {
  const now = new Date();
  const t   = now.toLocaleTimeString('en-GB', { hour12: false });
  document.getElementById('simTime').textContent = `Time: ${t}`;
}

function collectParameters() {
  console.log('[DEBUG] collectParameters() called');
  const params = {};
  const keys = Object.keys(paramRanges);

  console.log('[DEBUG] Available parameter keys:', keys);

  keys.forEach(key => {
    const element = document.getElementById(key);
    if (!element) {
      console.warn(`[WARNING] Input element not found: ${key}`);
      params[key] = 0;
    } else {
      const value = parseFloat(element.value) || 0;
      params[key] = value;
      console.log(`[DEBUG] ${key}: ${value}`);
    }
  });

  console.log('[DEBUG] ✅ All parameters collected:');
  console.table(params);  // Shows nice table in console
  console.log('[DEBUG] JSON to be sent:', JSON.stringify(params, null, 2));

  return params;
}


async function sendToPredictionAPI(params) {
  console.log('[DEBUG] sendToPredictionAPI() called');
  console.log('[DEBUG] API URL:', PREDICTION_API_URL);
  console.log('[DEBUG] Parameters being sent:', params);

  try {
    console.log('[DEBUG] 📤 Sending POST request...');

    const response = await fetch(PREDICTION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params),
      mode: 'cors'
    });

    console.log('[DEBUG] 📥 Response received, status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ERROR] HTTP Error', response.status, ':', errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('[DEBUG] ✅ JSON parsed successfully:');
    console.table(result);
    console.log('[DEBUG] Prediction value:', result.prediction);

    return result;

  } catch (error) {
    console.error('[ERROR] Fetch error:', error);
    console.error('[ERROR] Message:', error.message);
    return null;
  }
}


// function handleSubmit() {
//   const efficiencyMsg = document.getElementById('efficiencyMsg');
//   efficiencyMsg.textContent = 'Your current efficiency of the plant is 77%.';
//   efficiencyMsg.classList.remove('hidden');
// }

async function handleSubmit() {
  // 1. Check if any parameters are out of bounds
  if (invalidSteps.size > 0) {
    alert('⚠️ Please fix out-of-bounds parameters before predicting');
    return;
  }

  // 2. Show loading state
  const calculateBtn = document.getElementById('calculateBtn');
  const efficiencyMsg = document.getElementById('efficiencyMsg');
  calculateBtn.disabled = true;
  calculateBtn.textContent = '🔄 Processing...';

  // 3. Collect all 15 parameters
  const params = collectParameters();
  //print('params')
  // 4. Send to ML API and wait for prediction
  const prediction = await sendToPredictionAPI(params);

  // 5. Display the prediction result
  if (prediction && prediction.prediction !== undefined) {
    const predictionValue = prediction.prediction.toFixed(2);
    efficiencyMsg.textContent = `🔮 Model Prediction: ${predictionValue}% efficiency`;
    efficiencyMsg.classList.remove('hidden');
  } else {
    efficiencyMsg.textContent = '❌ Prediction failed. Try again.';
    efficiencyMsg.classList.remove('hidden');
  }

  // 6. Reset button
  calculateBtn.disabled = false;
  calculateBtn.textContent = '🔮 Get Prediction';
}


document.addEventListener('DOMContentLoaded', () => {
  const controls = document.getElementById('simControls');
  const labels = [
    'Feed Size','Product Size','Mill Power Consumption','Mill Inlet Temperature',
    'Blending Efficiency','C5 Temperature','Heat Recovery Efficiency',
    'Fuel Flow Rate','Primary Fuel Flow','Secondary Air Temperature',
    'Kiln Drive Power','Clinker Inlet Temperature','Cooling Air Flow',
    'Mill Power Consumption','Packing Rate'
  ];
  const keys = Object.keys(paramRanges);

  // Render parameter rows
  keys.forEach((key, idx) => {
    const div = document.createElement('div');
    div.className = 'param-row';
    div.innerHTML = `
    <label for="${key}">${labels[idx]}</label>
    <input type="number"
           id="${key}"
           data-param="${key}"
           step="0.01"
           placeholder="Enter value"
           oninput="validateParam(this)" />`;
    controls.appendChild(div);

    // Add hover listeners for tooltip
    const input = div.querySelector('input');
    input.addEventListener('mouseenter', showRangeTooltip);
    input.addEventListener('mouseleave', hideRangeTooltip);
  

  });

  // Submit button listener
  document.getElementById('calculateBtn').addEventListener('click', handleSubmit);

  // Start clock
  updateTime();
  setInterval(updateTime, 1000);

  // Initial validation & alerts
  keys.forEach(key => validateParam(document.getElementById(key)));

  // Firebase listener
  const db = firebase.database();
  db.ref('live_data/step1_raw_material/current').on('value', snap => {
    const data = snap.val();
    document.getElementById('simulatorFrame').textContent =
      data ? JSON.stringify(data, null, 2) : 'No data';
  });
});



