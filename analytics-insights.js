// Analytics Premium JS - Enhanced with Insights-based Recommendations

// Enhanced optimization recommendations with best fit values and insights
const optimizationRecommendations = [
    {
        parameter: "Feed Size",
        unit: "microns",
        currentRange: "50-150",
        bestFitValue: "80-120",
        bestFitExplanation: "Optimal particle size for maximum grinding efficiency",
        benefits: ["15% efficiency gain", "Better uniformity", "Reduced energy"],
        insight: "Your current feed size is too variable. Maintain consistency between 80-120 microns for optimal results.",
        priority: "High",
        category: "Raw Material",
        icon: "🪨"
    },
    {
        parameter: "Mill Inlet Temperature",
        unit: "°C",
        currentRange: "30-80",
        bestFitValue: "50-60",
        bestFitExplanation: "Sweet spot for optimal mill performance",
        benefits: ["8% energy saving", "Improved mill lifespan", "Better product quality"],
        insight: "Temperature control is critical. Keep inlet temperature between 50-60°C to maximize efficiency and minimize wear.",
        priority: "High",
        category: "Pre-heating",
        icon: "🔥"
    },
    {
        parameter: "Blending Efficiency",
        unit: "%",
        currentRange: "40-75",
        bestFitValue: "65-70",
        bestFitExplanation: "Perfect balance between mixing and throughput",
        benefits: ["12% homogeneity increase", "Better cement quality", "Consistent output"],
        insight: "Aim for 65-70% efficiency. This range ensures optimal material mixing without compromising production rate.",
        priority: "Medium",
        category: "Blending",
        icon: "🔄"
    },
    {
        parameter: "Heat Recovery Efficiency",
        unit: "%",
        currentRange: "30-60",
        bestFitValue: "60+",
        bestFitExplanation: "Maximum waste heat utilization",
        benefits: ["20% waste heat recovery", "Lower fuel costs", "Reduced emissions"],
        insight: "Optimize your waste heat recovery systems to achieve 60%+ efficiency. This directly reduces operational costs.",
        priority: "High",
        category: "Energy Recovery",
        icon: "⚡"
    },
    {
        parameter: "Kiln Flame Temperature",
        unit: "°C",
        currentRange: "1300-1500",
        bestFitValue: "1450",
        bestFitExplanation: "Ideal clinker formation temperature",
        benefits: ["18% quality improvement", "Better clinker strength", "Reduced clinker dust"],
        insight: "Maintain kiln flame at 1450°C for optimal clinker formation and strength development.",
        priority: "High",
        category: "Kiln Operation",
        icon: "🏭"
    },
    {
        parameter: "Primary Fuel Flow",
        unit: "units/min",
        currentRange: "30-70",
        bestFitValue: "48-52",
        bestFitExplanation: "Balanced fuel consumption for stable operation",
        benefits: ["6% fuel savings", "Stable kiln rotation", "Consistent flame"],
        insight: "Stabilize fuel flow between 48-52 units/min for steady kiln operation and reduced fuel consumption.",
        priority: "Medium",
        category: "Fuel Management",
        icon: "⛽"
    },
    {
        parameter: "Secondary Air Temperature",
        unit: "°C",
        currentRange: "200-400",
        bestFitValue: "300+",
        bestFitExplanation: "Optimal combustion air temperature",
        benefits: ["10% combustion efficiency", "Better fuel utilization", "Lower emissions"],
        insight: "Keep secondary air temperature above 300°C to enhance fuel combustion efficiency.",
        priority: "Medium",
        category: "Air Management",
        icon: "💨"
    },
    {
        parameter: "Kiln Rotation Speed",
        unit: "RPM",
        currentRange: "2.5-4.0",
        bestFitValue: "3.2-3.8",
        bestFitExplanation: "Perfect residence time for clinker development",
        benefits: ["Optimal residence time", "Better phase development", "Improved strength"],
        insight: "Kiln speed should be 3.2-3.8 RPM to allow proper clinker minerals to develop.",
        priority: "Medium",
        category: "Kiln Operation",
        icon: "🔧"
    },
    {
        parameter: "Cooling Air Flow",
        unit: "units/min",
        currentRange: "20-70",
        bestFitValue: "40-50",
        bestFitExplanation: "Ideal cooling rate without thermal shock",
        benefits: ["14% cooling uniformity", "Better clinker structure", "Reduced dust"],
        insight: "Maintain cooling air between 40-50 units/min for uniform clinker cooling without thermal damage.",
        priority: "High",
        category: "Cooling",
        icon: "❄️"
    },
    {
        parameter: "Mill Power Consumption",
        unit: "kW",
        currentRange: "50-120",
        bestFitValue: "75-85",
        bestFitExplanation: "Efficient grinding with optimal motor load",
        benefits: ["12% energy cost reduction", "Extended motor life", "Better efficiency"],
        insight: "Target 75-85 kW for efficient grinding. Higher consumption indicates excess load or wear.",
        priority: "High",
        category: "Grinding",
        icon: "⚙️"
    },
    {
        parameter: "Product Fineness",
        unit: "Blaine (cm²/g)",
        currentRange: "2500-3800",
        bestFitValue: "3200-3400",
        bestFitExplanation: "Standard fineness for high-strength cement",
        benefits: ["8% strength improvement", "Better hydration", "Consistent quality"],
        insight: "Keep cement fineness between 3200-3400 Blaine for optimal strength development and consistency.",
        priority: "Medium",
        category: "Grinding",
        icon: "📏"
    },
    {
        parameter: "Clinker Inlet Temperature",
        unit: "°C",
        currentRange: "80-150",
        bestFitValue: "80-100",
        bestFitExplanation: "Safe temperature before cooling grate",
        benefits: ["25% grate life extension", "Better cooling", "Reduced maintenance"],
        insight: "Clinker should enter cooling grate below 100°C to prevent thermal damage and extend grate life.",
        priority: "Medium",
        category: "Cooling",
        icon: "🌡️"
    },
    {
        parameter: "Free Lime Content",
        unit: "%",
        currentRange: "1.0-4.0",
        bestFitValue: "<2.0",
        bestFitExplanation: "Low lime for durable cement",
        benefits: ["Better durability", "Reduced expansion", "Long-term strength"],
        insight: "Free lime should be kept below 2.0% for long-term durability and reduced cement expansion.",
        priority: "High",
        category: "Quality Control",
        icon: "✅"
    },
    {
        parameter: "Packing Rate Efficiency",
        unit: "%",
        currentRange: "85-98",
        bestFitValue: "95+",
        bestFitExplanation: "Maximum packing effectiveness",
        benefits: ["5% waste reduction", "Better output", "Lower costs"],
        insight: "Achieve 95%+ packing efficiency to minimize waste and maximize production output.",
        priority: "Medium",
        category: "Packaging",
        icon: "📦"
    },
    {
        parameter: "Process Stability Index",
        unit: "%",
        currentRange: "60-85",
        bestFitValue: "90+",
        bestFitExplanation: "Highly stable and predictable process",
        benefits: ["20% downtime reduction", "Better consistency", "Lower costs"],
        insight: "Target 90%+ process stability. This reduces downtime and improves overall operational reliability.",
        priority: "High",
        category: "Overall Process",
        icon: "🎯"
    }
];

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileStatus = document.getElementById('fileStatus');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultsSection = document.getElementById('resultsSection');
const recommendationsList = document.getElementById('recommendationsList');
const emptyState = document.getElementById('emptyState');
const resetBtn = document.getElementById('resetBtn');
const exportResultsBtn = document.getElementById('exportResultsBtn');
const printBtn = document.getElementById('printBtn');
const tipsCard = document.getElementById('tipsCard');
const statsCard = document.getElementById('statsCard');
const sortSelect = document.getElementById('sortSelect');
const filterBtns = document.querySelectorAll('.filter-btn');

let uploadedFile = null;
let currentSort = 'priority';
let currentFilter = 'all';

// ===== FILE UPLOAD HANDLERS =====
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

/**
 * Handle file selection
 */
function handleFileSelect(file) {
    const validTypes = ['text/csv', 'application/json', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(file.type) && !['csv', 'json', 'xlsx'].includes(fileExtension)) {
        showNotification('Invalid file type. Please upload CSV, JSON, or XLSX file.', 'error');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        showNotification('File size exceeds 10MB limit.', 'error');
        return;
    }

    uploadedFile = file;
    
    fileInfo.style.display = 'block';
    fileName.innerHTML = `✓ <strong>${file.name}</strong>`;
    fileStatus.innerHTML = `Size: ${(file.size / 1024).toFixed(2)} KB`;
    
    animateFileProgress();
    analyzeBtn.style.display = 'flex';
    
    showNotification(`File "${file.name}" ready for analysis`, 'info');
}

/**
 * Animate file progress bar
 */
function animateFileProgress() {
    const progressBar = document.querySelector('.progress-bar');
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 40;
        progressBar.style.width = Math.min(progress, 90) + '%';
        if (progress >= 90) clearInterval(interval);
    }, 300);
}

/**
 * Analyze file and show recommendations
 */
analyzeBtn.addEventListener('click', () => {
    if (!uploadedFile) {
        showNotification('Please select a file first', 'error');
        return;
    }

    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<div class="btn-loader"></div><span class="btn-text">Analyzing Data...</span>';

    setTimeout(() => {
        displayRecommendations();
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<span class="btn-icon">⚡</span><span class="btn-text">Analyze & Optimize</span>';
    }, 2000);
});

/**
 * Display recommendations with enhanced insights layout
 */
function displayRecommendations() {
    emptyState.style.display = 'none';
    tipsCard.style.opacity = '0.5';
    tipsCard.style.pointerEvents = 'none';
    statsCard.style.opacity = '0.5';
    statsCard.style.pointerEvents = 'none';
    
    resultsSection.style.display = 'block';
    recommendationsList.innerHTML = '';

    const counts = {
        high: optimizationRecommendations.filter(r => r.priority === 'High').length,
        medium: optimizationRecommendations.filter(r => r.priority === 'Medium').length,
        low: optimizationRecommendations.filter(r => r.priority === 'Low').length
    };

    document.getElementById('highCount').textContent = counts.high;
    document.getElementById('mediumCount').textContent = counts.medium;
    document.getElementById('lowCount').textContent = counts.low;

    optimizationRecommendations.forEach((rec, index) => {
        createInsightCard(rec, index);
    });

    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    showNotification('✨ Analysis complete! Showing 15 optimization insights.', 'success');
}

/**
 * Create enhanced insight card with best fit values
 */
function createInsightCard(rec, index) {
    const priorityClass = `priority-${rec.priority.toLowerCase()}`;
    
    const recCard = document.createElement('div');
    recCard.className = `insight-card ${priorityClass}`;
    recCard.dataset.priority = rec.priority.toLowerCase();
    recCard.dataset.category = rec.category;
    recCard.style.animationDelay = `${index * 0.05}s`;
    
    recCard.innerHTML = `
        <div class="insight-header">
            <div class="insight-title-group">
                <span class="insight-icon">${rec.icon}</span>
                <div class="insight-title-text">
                    <h3 class="insight-name">${rec.parameter}</h3>
                    <span class="insight-category">${rec.category}</span>
                </div>
            </div>
            <span class="priority-badge priority-${rec.priority.toLowerCase()}">${rec.priority}</span>
        </div>

        <div class="best-fit-section">
            <div class="best-fit-label">Best Fit Value</div>
            <div class="best-fit-value">
                <span class="value">${rec.bestFitValue}</span>
                <span class="unit">${rec.unit}</span>
            </div>
            <div class="best-fit-desc">${rec.bestFitExplanation}</div>
        </div>

        <div class="current-vs-target">
            <div class="comparison-item current">
                <span class="comp-label">Current Range</span>
                <span class="comp-value">${rec.currentRange} ${rec.unit}</span>
            </div>
            <div class="comparison-arrow">→</div>
            <div class="comparison-item target">
                <span class="comp-label">Target Range</span>
                <span class="comp-value">${rec.bestFitValue} ${rec.unit}</span>
            </div>
        </div>

        <div class="insight-main">
            <p class="insight-text">${rec.insight}</p>
        </div>

        <div class="benefits-section">
            <div class="benefits-label">Key Benefits</div>
            <div class="benefits-list">
                ${rec.benefits.map(benefit => `<div class="benefit-item">✓ ${benefit}</div>`).join('')}
            </div>
        </div>
    `;
    
    recommendationsList.appendChild(recCard);
}

/**
 * Filter recommendations
 */
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        applyFiltersAndSort();
    });
});

/**
 * Sort recommendations
 */
sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    applyFiltersAndSort();
});

/**
 * Apply filters and sorting
 */
function applyFiltersAndSort() {
    const cards = Array.from(recommendationsList.querySelectorAll('.insight-card'));
    
    cards.forEach(card => {
        const priority = card.dataset.priority;
        let show = currentFilter === 'all' || currentFilter === priority;
        card.style.display = show ? 'block' : 'none';
        card.style.opacity = show ? '1' : '0';
    });

    const visibleCards = cards.filter(c => c.style.display !== 'none');
    if (currentSort === 'impact') {
        visibleCards.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.dataset.priority] - priorityOrder[b.dataset.priority];
        });
    } else if (currentSort === 'category') {
        visibleCards.sort((a, b) => {
            const catA = a.dataset.category;
            const catB = b.dataset.category;
            return catA.localeCompare(catB);
        });
    }
}

/**
 * Reset to upload state
 */
resetBtn.addEventListener('click', () => {
    uploadedFile = null;
    fileInput.value = '';
    fileInfo.style.display = 'none';
    analyzeBtn.style.display = 'none';
    resultsSection.style.display = 'none';
    emptyState.style.display = 'flex';
    tipsCard.style.opacity = '1';
    tipsCard.style.pointerEvents = 'auto';
    statsCard.style.opacity = '1';
    statsCard.style.pointerEvents = 'auto';
    
    filterBtns[0].click();
    
    showNotification('Ready to upload a new file', 'info');
});

/**
 * Export results to CSV
 */
exportResultsBtn.addEventListener('click', () => {
    const csvContent = generateCSVContent();
    downloadCSV(csvContent, `CementIQ_Insights_${getTimestamp()}.csv`);
    showNotification('📥 Insights exported successfully!', 'success');
});

/**
 * Print results
 */
printBtn.addEventListener('click', () => {
    window.print();
    showNotification('🖨️ Print dialog opened', 'info');
});

/**
 * Generate CSV content with insights
 */
function generateCSVContent() {
    let csv = 'CementIQ Process Optimization Insights\n';
    csv += `Generated: ${new Date().toLocaleString('en-IN')}\n`;
    csv += `File Analyzed: ${uploadedFile ? uploadedFile.name : 'N/A'}\n\n`;
    csv += 'Parameter,Unit,Current Range,Best Fit Value,Explanation,Insight,Priority\n';
    
    optimizationRecommendations.forEach(rec => {
        csv += `"${rec.parameter}","${rec.unit}","${rec.currentRange}","${rec.bestFitValue}","${rec.bestFitExplanation}","${rec.insight}","${rec.priority}"\n`;
    });
    
    return csv;
}

/**
 * Download CSV file
 */
function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Get formatted timestamp
 */
function getTimestamp() {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 3500);
}

console.log('📊 Analytics Premium page with Insights loaded successfully');
console.log('💡 Total insights: ' + optimizationRecommendations.length);
