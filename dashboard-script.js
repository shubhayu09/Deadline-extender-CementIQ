
const database = firebase.database();

// Map DB keys to HTML IDs
const stepKeyMap = {
  step1_raw_material: 'step1',
  step2_proportioning: 'step2',
  step3_preheater: 'step3',
  step4_kiln: 'step4',
  step5_cooling_grinding: 'step5',
  step6_packing_shipping: 'step6'
};

const charts = {};

// On DOM ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Dashboard script loaded');
  initCharts();
  startRealtime();
  updateTime();
  setInterval(updateTime, 1000);
  setupExportButton();
  setupAlertMonitoring();

});

// Setup export button event listener
function setupExportButton() {
  const exportBtn = document.querySelector('[data-export-btn]') || document.getElementById('export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      console.log('Export button clicked');
      if (typeof exportDashboardToPDF === 'function') {
        exportDashboardToPDF();
      } else {
        console.error('PDF export function not found. Ensure pdf-export.js is loaded.');
      }
    });
  } else {
    console.warn('Export button not found in DOM');
  }
}

// Initialize Chart.js instances with updated styling
function initCharts() {
  Object.values(stepKeyMap).forEach(stepId => {
    const canvas = document.getElementById(`${stepId}-chart`);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    charts[stepId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          data: [],
          borderColor: '#4285f4',
          backgroundColor: 'rgba(66,133,244,0.1)',
          fill: true,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        scales: {
          x: {
            display: true,
            grid: {
              display: true,
              color: 'rgba(200, 200, 200, 0.1)',
              drawBorder: true
            },
            ticks: {
              color: '#666',
              font: {
                size: 11
              },
              maxRotation: 45,
              minRotation: 0
            }
          },
          y: {
            display: false,
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#4285f4',
            borderWidth: 1,
            callbacks: {
              title: function (context) {
                return 'Time: ' + context[0].label;
              },
              label: function (context) {
                return 'Value: ' + context.parsed.y.toFixed(2);
              }
            }
          }
        }
      }
    });
    console.log(`Chart for ${stepId} initialized`);
  });
}

// Listen for Firebase updates
function startRealtime() {
  database.ref('live_data').on('value', snap => {
    const data = snap.val();
    console.log('live_data update:', data);
    if (data) updateDashboard(data);
  }, err => console.error('live_data error', err));

  database.ref('alerts/active').on('value', snap => {
    const alerts = snap.val();
    console.log('alerts update:', alerts);
    renderAlerts(alerts);
  });
}

// Update dashboard for each step
function updateDashboard(dbData) {
  Object.entries(dbData).forEach(([dbKey, node]) => {
    const stepId = stepKeyMap[dbKey];
    if (!stepId) return;

    console.log(`Updating ${dbKey} → ${stepId}`, node);
    updateChart(stepId, node.current);
    updateMetrics(stepId, node.current);
    updateParameterStatus(stepId, node.current);
  });
}

// Chart update with improved styling
function updateChart(stepId, current) {
  console.log(`Raw current data for ${stepId}:`, current);
  if (!current) return;

  const keys = Object.keys(current);
  console.log(`Keys for ${stepId}:`, keys);

  // Skip 'Time' and find numeric field
  const valKey = keys.find(k => k !== 'Time' && !isNaN(parseFloat(current[k])));
  if (!valKey) {
    console.warn(`No numeric field for ${stepId}, skipping chart`);
    return;
  }

  const value = parseFloat(current[valKey]);
  const time = new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  console.log(`Plotting ${stepId}: {${valKey}: ${value}} at ${time}`);

  const chart = charts[stepId];
  chart.data.labels.push(time);
  chart.data.datasets[0].data.push(value);

  // Keep only last 20 points for performance
  if (chart.data.labels.length > 20) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }

  chart.update('none');
}

// Update parameter status indicator
function updateParameterStatus(stepId, current) {
  if (!current) return;

  const statusElement = document.querySelector(`#${stepId} .parameter-status`);
  if (!statusElement) return;

  // Map stepId to descriptive parameter names as per your HTML
  const paramNames = {
    step1: 'LimeStone CaO Content',
    step2: 'LimeStone Proportion',
    step3: 'Heat Recovery Efficiency',
    step4: 'Klin Filling Degree',
    step5: 'Separator Efficiency',
    step6: 'Silo Level'
  };

  // Get the parameter name for this step or fallback to 'Parameter'
  const displayName = paramNames[stepId] || 'Parameter';

  // Find the first numeric value (excluding 'Time')
  const keys = Object.keys(current);
  const valKey = keys.find(k => k !== 'Time' && !isNaN(parseFloat(current[k])));
  if (valKey) {
    const value = parseFloat(current[valKey]);
    // Calculate percentage like before or adjust logic as needed
    const percentage = Math.min(100, Math.max(0, Math.round((value / 100) * 40 + 20)));

    statusElement.textContent = `${displayName}: ${percentage}%`;

    // Update status class based on percentage
    statusElement.classList.remove('warning', 'success', 'critical');
    if (percentage < 30) {
      statusElement.classList.add('critical');
    } else if (percentage < 50) {
      statusElement.classList.add('warning');
    } else {
      statusElement.classList.add('success');
    }
  }
}

// Update top KPIs with better formatting
function updateMetrics(stepId, current) {
  const container = document.getElementById(`${stepId}-metrics`);
  if (!container || !current) return;

  container.innerHTML = '';

  // Show top 3 parameters
  const params = Object.keys(current).slice(1, 4);

  params.forEach(param => {
    const value = current[param];
    const div = document.createElement('div');
    div.className = 'metric';

    // Format parameter name (remove underscores, capitalize)
    const formattedParam = param.replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());

    // Format value (limit decimal places for numbers)
    const formattedValue = isNaN(parseFloat(value))
      ? value
      : parseFloat(value).toFixed(1);

    div.innerHTML = `
      <div class="metric-value">${formattedValue}</div>
      <div class="metric-label">${formattedParam}</div>
    `;
    container.appendChild(div);
  });
}

// Render alerts with improved styling
// function renderAlerts(alerts) {
//   const alertsList = document.getElementById('alert-list');
//   if (!alertsList) return;

//   alertsList.innerHTML = '';

//   if (!alerts) {
//     alertsList.innerHTML = '<div style="color: #666; text-align: center; padding: 1rem;">No active alerts</div>';
//     return;
//   }

//   Object.entries(alerts).forEach(([alertId, alert]) => {
//     const alertDiv = document.createElement('div');
//     alertDiv.className = `alert-item alert-${alert.severity || 'info'}`;

//     const timeStr = alert.timestamp ?
//       new Date(alert.timestamp).toLocaleTimeString('en-US', {
//         hour12: false,
//         hour: '2-digit',
//         minute: '2-digit'
//       }) : '';

//     alertDiv.innerHTML = `
//       <div style="font-weight: 600; margin-bottom: 0.25rem;">
//         ${alert.title || 'Alert'}
//         ${timeStr ? `<span style="float: right; font-size: 0.75rem; opacity: 0.7;">${timeStr}</span>` : ''}
//       </div>
//       <div style="font-size: 0.8rem; opacity: 0.8;">
//         ${alert.message || 'No message available'}
//       </div>
//     `;

//     alertsList.appendChild(alertDiv);
//   });
// }

// Add to dashboard.js after setupFirebaseListener()

/**
 * Setup alert monitoring
 */
function setupAlertMonitoring() {
  // Listen for alerts
  const alertsRef = database.ref('alerts/triggered');

  alertsRef.limitToLast(10).on('child_added', (snapshot) => {
    const alertEntry = snapshot.val();

    // Each entry has an 'alerts' array
    if (alertEntry && alertEntry.alerts) {
      alertEntry.alerts.forEach(alertData => {
        displayAlert(alertData);
        updateAlertStatus(alertData);
      });
    }
  });
}

/**
 * Display alert on dashboard
 */
// function displayAlert(alertData) {
//   const alertsList = document.getElementById('alertsList');
//   const noAlerts = alertsList.querySelector('.no-alerts');

//   if (noAlerts) {
//     noAlerts.remove();
//   }

//   // Create and display a single alert card
//   const alertCard = document.createElement('div');
//   alertCard.className = 'alert-card';
//   alertCard.innerHTML = `
//       <div class="alert-icon">⚠️</div>
//       <div class="alert-content">
//           <h4>${alertData.parameter.replace(/_/g, ' ')}</h4>
//           <p>${alertData.message}</p>
//           <span class="alert-time">${new Date(alertData.timestamp).toLocaleString()}</span>
//       </div>
//   `;

//   alertsList.prepend(alertCard);

//   // Auto-remove after 5 minutes
//   setTimeout(() => {
//     alertCard.remove();
//     if (alertsList.children.length === 0) {
//       alertsList.innerHTML = '<p class="no-alerts">No active alerts</p>';
//     }
//   }, 5 * 60 * 1000);
// }

function displayAlert(alertData) {
  const alertsList = document.getElementById('alertsList');

  if (!alertsList) {
    console.warn('alertsList container not found');
    return;
  }

  const noAlerts = alertsList.querySelector('.no-alerts');
  if (noAlerts) {
    noAlerts.remove();
  }

  // Create alert card with improved styling
  const alertCard = document.createElement('div');
  alertCard.className = `alert-card alert-${alertData.severity || 'warning'}`;

  // Determine icon based on severity
  let icon = '⚠️';
  if (alertData.severity === 'critical') icon = '🔴';
  if (alertData.severity === 'warning') icon = '🟡';
  if (alertData.severity === 'info') icon = 'ℹ️';

  alertCard.innerHTML = `
      <div class="alert-icon">${icon}</div>
      <div class="alert-content">
          <h4>${alertData.parameter.replace(/_/g, ' ')}</h4>
          <p>${alertData.message}</p>
          <span class="alert-time">${new Date(alertData.timestamp).toLocaleString('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })}</span>
      </div>
  `;

  alertsList.prepend(alertCard);

  // Keep only latest 3 alerts
  const allAlerts = alertsList.querySelectorAll('.alert-card');
  if (allAlerts.length > 3) {
    // Remove alerts beyond the 3rd one
    for (let i = 3; i < allAlerts.length; i++) {
      allAlerts[i].remove();
    }
  }

  // Update badge count
  const badge = document.getElementById('alert-count');
  if (badge) {
    const alertCount = Math.min(alertsList.querySelectorAll('.alert-card').length, 3);
    badge.textContent = alertCount;
    badge.classList.remove('empty');
  }

  // Auto-remove after 5 minutes
  setTimeout(() => {
    if (alertCard.parentNode) {
      alertCard.remove();
    }
    if (alertsList.querySelectorAll('.alert-card').length === 0) {
      alertsList.innerHTML = '<p class="no-alerts">No active alerts</p>';
      if (badge) {
        badge.textContent = '0';
        badge.classList.add('empty');
      }
    }
  }, 5 * 60 * 1000);
}

// Call in DOMContentLoaded


// Update time display
function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const timeElement = document.getElementById('currentTime');
  if (timeElement) {
    timeElement.textContent = `Time: ${timeString}`;
  }
}

// Export for testing/debugging
window.dashboardApp = {
  updateDashboard,
  updateChart,
  charts,
  renderAlerts,
  setupExportButton,
  setupAlertMonitoring
};
