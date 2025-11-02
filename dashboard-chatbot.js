// Dashboard Chatbot JS - Q&A System

// Chatbot knowledge base
const chatbotKnowledge = {
    "what is kiln in cement process": {
        answer: "A kiln in a cement plant is a large, cylindrical, high-temperature furnace that heats raw materials to produce cement clinker, the primary component of cement.",
        category: "Process"
    },
    "what is clinker": {
        answer: "Clinker is the primary product of the kiln and the main component of cement. It consists of calcium silicates and aluminates formed by heating limestone and other raw materials.",
        category: "Process"
    },
    "what is blending": {
        answer: "Blending is the process of mixing raw materials in specific proportions to achieve the desired chemical composition before grinding and heating in the kiln.",
        category: "Process"
    },
    "what is grinding": {
        answer: "Grinding is the process of crushing raw materials into fine powder (typically 50-100 microns) before they are fed to the kiln for clinker production.",
        category: "Process"
    },
    "what is heat recovery": {
        answer: "Heat recovery is the process of capturing waste heat from the kiln exhaust and preheating raw materials, improving energy efficiency and reducing fuel consumption.",
        category: "Energy"
    },
    "what is feed size": {
        answer: "Feed size refers to the particle size of raw materials entering the kiln, typically measured in microns. Optimal feed size is around 1013.76 tonnes/hour for your plant.",
        category: "Parameters"
    },
    "what is product fineness": {
        answer: "Product fineness is the fineness of cement powder after grinding, typically measured in Blaine (cm²/g). Higher fineness increases strength but requires more grinding energy.",
        category: "Product"
    },
    "what is kiln rotation speed": {
        answer: "Kiln rotation speed is the speed at which the kiln rotates, typically measured in RPM. Optimal rotation speed ensures proper residence time for clinker formation.",
        category: "Parameters"
    },
    "what causes low efficiency": {
        answer: "Low efficiency can be caused by: suboptimal kiln temperature, poor feed material quality, excessive heat loss, inefficient grinding, or improper blending ratios.",
        category: "Troubleshooting"
    },
    "how to improve cement quality": {
        answer: "To improve cement quality: optimize kiln temperature, maintain proper blending ratios, ensure adequate grinding fineness, monitor raw material composition, and minimize free lime content.",
        category: "Quality"
    }
};

// DOM Elements
const chatContainer = document.getElementById('chatContainer');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

let conversationHistory = [];

// Initialize chat
function initializeChat() {
    if (chatContainer) {
        addBotMessage("👋 Hello! I'm the CementIQ Assistant. Ask me about cement processes, parameters, or troubleshooting.");
        displayQuickQuestions();
    }
}

/**
 * Display quick question buttons
 */
function displayQuickQuestions() {
    const quickContainer = document.createElement('div');
    quickContainer.className = 'quick-questions';
    
    const questions = [
        "What is kiln in cement process?",
        "What is clinker?",
        "How to improve cement quality?",
        "What causes low efficiency?"
    ];
    
    questions.forEach(q => {
        const btn = document.createElement('button');
        btn.className = 'quick-question-btn';
        btn.textContent = q;
        btn.onclick = () => handleQuestionClick(q);
        quickContainer.appendChild(btn);
    });
    
    chatMessages.appendChild(quickContainer);
    scrollToBottom();
}

/**
 * Handle quick question click
 */
function handleQuestionClick(question) {
    chatInput.value = question;
    sendMessage();
}

/**
 * Send message
 */
function sendMessage() {
    const message = chatInput.value.trim();
    
    if (message === '') return;
    
    // Add user message
    addUserMessage(message);
    chatInput.value = '';
    
    // Get bot response
    setTimeout(() => {
        const response = getBotResponse(message);
        addBotMessage(response);
    }, 500);
}

/**
 * Get bot response based on knowledge base
 */
function getBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for exact match
    if (chatbotKnowledge[lowerMessage]) {
        return chatbotKnowledge[lowerMessage].answer;
    }
    
    // Check for partial matches
    for (const [key, value] of Object.entries(chatbotKnowledge)) {
        if (lowerMessage.includes(key.split(" ")[0]) && lowerMessage.includes(key.split(" ").pop())) {
            return value.answer;
        }
    }
    
    // Check keyword matches
    for (const [key, value] of Object.entries(chatbotKnowledge)) {
        const keywords = key.split(" ");
        if (keywords.some(keyword => lowerMessage.includes(keyword))) {
            return value.answer;
        }
    }
    
    // Default response
    return "I'm not sure about that. Try asking about kiln, clinker, efficiency, blending, grinding, or heat recovery in cement processes.";
}

/**
 * Add user message to chat
 */
function addUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user-message';
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${escapeHtml(message)}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

/**
 * Add bot message to chat
 */
function addBotMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message bot-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <p>${escapeHtml(message)}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

/**
 * Scroll chat to bottom
 */
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Event listeners
if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
}

if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initializeChat);

console.log('💬 Chatbot initialized');
