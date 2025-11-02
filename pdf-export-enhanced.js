// Enhanced PDF Export - Captures all current dashboard data with professional styling
// Version 2.0 - Improved Layout with KPI Cards and Real Data

class DashboardPDFExporter {
  constructor() {
    this.dashboardData = {};
    this.alerts = [];
    this.exportTime = new Date();
  }

  /**
   * Capture all current dashboard data from DOM
   */
  async captureDashboardData() {
    try {
      // Capture KPI Metrics with all details
      this.dashboardData.kpi = {
        productionOutput: this.extractKPIData('Production Output'),
        energyEfficiency: this.extractKPIData('Energy Efficiency'),
        qualityScore: this.extractKPIData('Quality Score'),
        activeAlerts: this.extractKPIData('Active Alerts')
      };

      // Capture all production steps
      this.dashboardData.steps = {};
      const stepKeyMap = {
        step1: 'Raw Material Extraction, Crushing & Quarry',
        step2: 'Proportioning, Blending, and Grinding',
        step3: 'Pre-heater Phase',
        step4: 'Kiln Phase',
        step5: 'Cooling and Final Grinding',
        step6: 'Packing & Shipping'
      };

      Object.entries(stepKeyMap).forEach(([stepId, stepName]) => {
        const stepElement = document.getElementById(stepId);
        const metricsContainer = document.getElementById(`${stepId}-metrics`);
        const paramStatus = document.querySelector(`#${stepId} .parameter-status`);
        
        this.dashboardData.steps[stepId] = {
          name: stepName,
          parameterStatus: paramStatus ? paramStatus.textContent : 'N/A',
          metrics: []
        };

        if (metricsContainer) {
          const metricElements = metricsContainer.querySelectorAll('.metric');
          metricElements.forEach(metric => {
            const value = metric.querySelector('.metric-value')?.textContent || '';
            const label = metric.querySelector('.metric-label')?.textContent || '';
            this.dashboardData.steps[stepId].metrics.push({
              label: label,
              value: value
            });
          });
        }
      });

      // Capture all alerts
      const alertsList = document.getElementById('alert-list');
      this.alerts = [];
      if (alertsList) {
        const alertItems = alertsList.querySelectorAll('.alert-item');
        alertItems.forEach(item => {
          const fullText = item.textContent;
          const parts = fullText.split('\n');
          const title = parts[0]?.trim() || '';
          const message = parts[1]?.trim() || '';
          const severity = item.className.match(/alert-(\w+)/)?.[1] || 'info';
          
          if (title && title !== 'No active alerts') {
            this.alerts.push({
              title: title,
              message: message,
              severity: severity
            });
          }
        });
      }

      console.log('✓ Dashboard data captured successfully');
      console.log('KPI Data:', this.dashboardData.kpi);
      console.log('Steps Data:', this.dashboardData.steps);
      console.log('Alerts:', this.alerts);

    } catch (error) {
      console.error('Error capturing dashboard data:', error);
    }
  }

  /**
   * Extract KPI data from DOM
   */
  extractKPIData(kpiName) {
    const kpiCards = document.querySelectorAll('.kpi-card');
    
    for (let card of kpiCards) {
      const text = card.textContent;
      if (text.includes(kpiName)) {
        const valueDiv = card.querySelector('.kpi-value');
        const unitDiv = card.querySelector('.kpi-unit');
        const subDiv = card.querySelector('.kpi-sub');
        
        return {
          value: valueDiv ? valueDiv.textContent.trim() : 'N/A',
          unit: unitDiv ? unitDiv.textContent.trim() : '',
          sub: subDiv ? subDiv.textContent.trim() : ''
        };
      }
    }
    
    return { value: 'N/A', unit: '', sub: '' };
  }

  /**
   * Get severity color for alerts
   */
  getSeverityColor(severity) {
    const colors = {
      critical: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8',
      success: '#28a745'
    };
    return colors[severity] || '#17a2b8';
  }

  /**
   * Generate professional PDF HTML
   */
  generatePDFHTML() {
    const timestamp = this.exportTime.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    // Generate KPI cards HTML
    const kpiHTML = `
      <div class="kpi-cards-grid">
        <div class="kpi-card-pdf">
          <div class="kpi-label-pdf">Production Output</div>
          <div class="kpi-value-pdf">${this.dashboardData.kpi.productionOutput.value}</div>
          <div class="kpi-unit-pdf">${this.dashboardData.kpi.productionOutput.unit}</div>
          <div class="kpi-sub-pdf">${this.dashboardData.kpi.productionOutput.sub}</div>
        </div>
        <div class="kpi-card-pdf">
          <div class="kpi-label-pdf">Energy Efficiency</div>
          <div class="kpi-value-pdf">${this.dashboardData.kpi.energyEfficiency.value}</div>
          <div class="kpi-unit-pdf">${this.dashboardData.kpi.energyEfficiency.unit}</div>
          <div class="kpi-sub-pdf">${this.dashboardData.kpi.energyEfficiency.sub}</div>
        </div>
        <div class="kpi-card-pdf">
          <div class="kpi-label-pdf">Quality Score</div>
          <div class="kpi-value-pdf">${this.dashboardData.kpi.qualityScore.value}</div>
          <div class="kpi-unit-pdf">${this.dashboardData.kpi.qualityScore.unit}</div>
          <div class="kpi-sub-pdf">${this.dashboardData.kpi.qualityScore.sub}</div>
        </div>
        <div class="kpi-card-pdf">
          <div class="kpi-label-pdf">Active Alerts</div>
          <div class="kpi-value-pdf">${this.dashboardData.kpi.activeAlerts.value}</div>
          <div class="kpi-unit-pdf">${this.dashboardData.kpi.activeAlerts.unit}</div>
          <div class="kpi-sub-pdf">${this.dashboardData.kpi.activeAlerts.sub}</div>
        </div>
      </div>
    `;

    // Generate production steps HTML
    const stepsHTML = Object.entries(this.dashboardData.steps).map(([stepId, step]) => `
      <div class="step-section">
        <div class="step-header-pdf">
          <div class="step-title-pdf">${step.name}</div>
          <div class="step-status-pdf">${step.parameterStatus}</div>
        </div>
        <div class="step-metrics-grid">
          ${step.metrics.map(metric => `
            <div class="step-metric-card">
              <div class="metric-value-pdf">${metric.value}</div>
              <div class="metric-label-pdf">${metric.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    // Generate alerts HTML
    const alertsHTML = this.alerts.length > 0 
      ? this.alerts.map(alert => `
          <div class="alert-box" style="border-left: 4px solid ${this.getSeverityColor(alert.severity)}; background: ${this.getSeverityColor(alert.severity)}15; padding: 12px; margin-bottom: 10px; border-radius: 4px;">
            <div style="font-weight: 600; font-size: 12px; color: #333; margin-bottom: 4px;">${alert.title}</div>
            <div style="font-size: 11px; color: #555;">${alert.message}</div>
          </div>
        `).join('')
      : '<div style="color: #999; text-align: center; padding: 15px; font-size: 12px;">No active alerts</div>';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CementIQ Dashboard Report</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.5;
            color: #333;
            background: #fff;
          }
          
          .page {
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
            background: white;
            page-break-after: always;
          }
          
          /* Header */
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 3px solid #254797;
          }
          
          .header-left h1 {
            font-size: 28px;
            color: #254797;
            margin: 0 0 4px 0;
            font-weight: 800;
          }
          
          .header-left .subtitle {
            font-size: 13px;
            color: #666;
            margin: 0;
          }
          
          .header-right {
            text-align: right;
            font-size: 11px;
            color: #666;
          }
          
          .header-right strong {
            display: block;
            color: #254797;
            font-weight: 700;
            margin-bottom: 4px;
          }
          
          /* KPI Cards Section */
          .kpi-section-title {
            font-size: 14px;
            font-weight: 700;
            color: #254797;
            margin: 20px 0 12px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .kpi-cards-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 24px;
            page-break-inside: avoid;
          }
          
          .kpi-card-pdf {
            background: linear-gradient(135deg, #254797 0%, #2e5cb8 100%);
            color: white;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(37, 71, 151, 0.2);
          }
          
          .kpi-label-pdf {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            opacity: 0.9;
            margin-bottom: 6px;
            font-weight: 600;
          }
          
          .kpi-value-pdf {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 2px;
            line-height: 1;
          }
          
          .kpi-unit-pdf {
            font-size: 12px;
            opacity: 0.85;
            margin-bottom: 8px;
          }
          
          .kpi-sub-pdf {
            font-size: 10px;
            opacity: 0.8;
            border-top: 1px solid rgba(255, 255, 255, 0.3);
            padding-top: 6px;
          }
          
          /* Steps Section */
          .steps-section-title {
            font-size: 14px;
            font-weight: 700;
            color: #254797;
            margin: 24px 0 12px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .step-section {
            margin-bottom: 16px;
            padding: 14px;
            background: #f8f9fa;
            border-left: 4px solid #254797;
            border-radius: 4px;
            page-break-inside: avoid;
          }
          
          .step-header-pdf {
            margin-bottom: 12px;
          }
          
          .step-title-pdf {
            font-size: 12px;
            font-weight: 700;
            color: #254797;
            margin-bottom: 4px;
          }
          
          .step-status-pdf {
            font-size: 11px;
            color: #666;
            background: white;
            padding: 6px 10px;
            border-radius: 3px;
            display: inline-block;
          }
          
          .step-metrics-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }
          
          .step-metric-card {
            background: white;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
            text-align: center;
          }
          
          .metric-value-pdf {
            font-size: 16px;
            font-weight: 700;
            color: #254797;
            margin-bottom: 4px;
          }
          
          .metric-label-pdf {
            font-size: 9px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          
          /* Alerts Section */
          .alerts-section-title {
            font-size: 14px;
            font-weight: 700;
            color: #254797;
            margin: 24px 0 12px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .alerts-container {
            background: #f8f9fa;
            padding: 14px;
            border-radius: 4px;
            margin-bottom: 24px;
            page-break-inside: avoid;
          }
          
          /* Footer */
          .footer {
            margin-top: 24px;
            padding-top: 12px;
            border-top: 1px solid #e0e0e0;
            font-size: 9px;
            color: #999;
            text-align: center;
            page-break-inside: avoid;
          }
          
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .page {
              margin: 0;
              padding: 15mm;
              page-break-after: always;
            }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <!-- Header -->
          <div class="header">
            <div class="header-left">
              <h1>CementIQ</h1>
              <p class="subtitle">Real-Time Cement Plant Dashboard</p>
            </div>
            <div class="header-right">
              <strong>Report Generated</strong>
              <div>${timestamp}</div>
            </div>
          </div>

          <!-- KPI Cards Section -->
          <div class="kpi-section-title">Key Performance Indicators</div>
          ${kpiHTML}

          <!-- Production Steps Section -->
          <div class="steps-section-title">Production Steps & Parameters</div>
          ${stepsHTML}

          <!-- Alerts Section -->
          <div class="alerts-section-title">Active Alerts</div>
          <div class="alerts-container">
            ${alertsHTML}
          </div>

          <!-- Footer -->
          <div class="footer">
            <p style="margin: 0 0 4px 0;">This is an automated report generated from CementIQ Dashboard.</p>
            <p style="margin: 0;">© 2025 CementIQ. All rights reserved. | For questions, contact operations team.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return html;
  }

  /**
   * Generate and download PDF
   */
  async exportToPDF() {
    try {
      this.showLoadingIndicator(true);

      // Capture all dashboard data
      await this.captureDashboardData();

      // Generate PDF HTML
      const pdfHTML = this.generatePDFHTML();

      // Create temporary container
      const container = document.createElement('div');
      container.innerHTML = pdfHTML;
      document.body.appendChild(container);

      // Configure pdf options
      const element = container.querySelector('.page');
      const options = {
        margin: 0,
        filename: `CementIQ_Report_${this.getFormattedTimestamp()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Generate PDF
      await html2pdf().set(options).from(element).save();

      // Clean up
      document.body.removeChild(container);
      this.showLoadingIndicator(false);

      // Show success message
      this.showNotification('✓ PDF exported successfully!', 'success');

    } catch (error) {
      console.error('Error generating PDF:', error);
      this.showLoadingIndicator(false);
      this.showNotification('✗ Error generating PDF. Please try again.', 'error');
    }
  }

  /**
   * Format timestamp for filename
   */
  getFormattedTimestamp() {
    const year = this.exportTime.getFullYear();
    const month = String(this.exportTime.getMonth() + 1).padStart(2, '0');
    const day = String(this.exportTime.getDate()).padStart(2, '0');
    const hours = String(this.exportTime.getHours()).padStart(2, '0');
    const minutes = String(this.exportTime.getMinutes()).padStart(2, '0');
    return `${year}${month}${day}_${hours}${minutes}`;
  }

  /**
   * Show loading indicator
   */
  showLoadingIndicator(show) {
    let loader = document.getElementById('pdf-loader');
    if (!loader && show) {
      loader = document.createElement('div');
      loader.id = 'pdf-loader';
      loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      `;
      loader.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 8px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
          <div style="width: 40px; height: 40px; border: 4px solid #f0f0f0; border-top: 4px solid #254797; border-radius: 50%; margin: 0 auto 15px; animation: spin 1s linear infinite;"></div>
          <p style="color: #333; font-weight: 600; margin: 0; font-size: 14px;">Generating PDF Report...</p>
          <p style="color: #999; font-size: 12px; margin-top: 8px;">Please wait, capturing dashboard data...</p>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;
      document.body.appendChild(loader);
    } else if (loader && !show) {
      document.body.removeChild(loader);
    }
  }

  /**
   * Show notification message
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background: ${type === 'success' ? '#28a745' : '#dc3545'};
      color: white;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      font-weight: 500;
      font-size: 14px;
      animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);

    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideIn 0.3s ease-in reverse';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }
}

// Create global instance
const pdfExporter = new DashboardPDFExporter();

// Export function for HTML button
function exportDashboardToPDF() {
  pdfExporter.exportToPDF();
}
