// ExamPal - Main Application JavaScript
class ExamPal {
    constructor() {
        this.currentSection = 'college-ai';
        this.selectedOption = null;
        this.chatHistory = [];
        this.chatFile = null;
        this.syllabus = null;
        this.apiBaseUrl = 'http://localhost:3000/api';
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.loadTheme();
        this.setupChat();
        this.setupFormValidation();
        await this.loadSyllabus();
        this.setupDynamicDropdowns();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });

        // Dark mode toggle
        document.getElementById('darkModeToggle').addEventListener('click', () => {
            this.toggleDarkMode();
        });

        // College AI form
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleOptionSelection(e.currentTarget);
            });
        });

        // Chat functionality
        document.getElementById('sendMessage').addEventListener('click', () => {
            this.sendChatMessage();
        });

        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendChatMessage();
            }
        });

        // Notes functionality
        document.getElementById('summarizeBtn').addEventListener('click', () => {
            this.summarizeNotes();
        });

        document.getElementById('notesText').addEventListener('input', (e) => {
            this.updateNotesCounter(e.target.value.length);
        });

        document.getElementById('chatInput').addEventListener('input', (e) => {
            this.updateChatCounter(e.target.value.length);
        });

        // File upload
        document.getElementById('fileUpload').addEventListener('change', (e) => {
            this.handleFileUpload(e);
        });

        // Chat file upload
        document.getElementById('chatFileUpload').addEventListener('change', (e) => {
            this.handleChatFileUpload(e);
        });

        document.getElementById('chatFileRemove').addEventListener('click', () => {
            this.removeChatFile();
        });

        // Debug button
        document.getElementById('debugBtn').addEventListener('click', () => {
            this.debugConnection();
        });
    }

    navigateToSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        document.getElementById(sectionId).classList.add('active');

        // Update navigation active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

        this.currentSection = sectionId;
    }

    toggleDarkMode() {
        const body = document.body;
        const isDark = body.getAttribute('data-theme') === 'dark';
        
        if (isDark) {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            document.getElementById('darkModeToggle').innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            document.getElementById('darkModeToggle').innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            document.getElementById('darkModeToggle').innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    handleOptionSelection(button) {
        // Remove active class from all buttons
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to selected button
        button.classList.add('active');
        this.selectedOption = button.getAttribute('data-option');

        // Check if required fields are filled
        const college = document.getElementById('college').value;
        const subject = document.getElementById('subject').value;

        if (college && subject) {
            this.generateCollegeAIResponse();
        } else {
            this.showNotification('Please select both College and Subject first.', 'warning');
        }
    }

    formatAIResponse(aiResponse, college, subject, module, topic, action) {
        // Format college name for display
        const collegeDisplay = college === 'bbd-university' ? 'BBD University' : 
                              college === 'aktu' ? 'AKTU' : college;
        
        // Format subject name for display
        const subjectDisplay = subject.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        // Format action for display
        const actionDisplay = action.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        return `
            <div class="ai-response">
                <div class="response-header">
                    <h4>🤖 AI Response: ${actionDisplay}</h4>
                    <div class="request-details">
                        <p><strong>College:</strong> ${collegeDisplay}</p>
                        <p><strong>Subject:</strong> ${subjectDisplay}</p>
                        ${module ? `<p><strong>Module:</strong> ${module}</p>` : ''}
                        ${topic ? `<p><strong>Topic:</strong> ${topic}</p>` : ''}
                    </div>
                </div>
                <hr>
                <div class="response-content">
                    ${aiResponse.replace(/\n/g, '<br>')}
                </div>
            </div>
        `;
    }

    async generateCollegeAIResponse() {
        const college = document.getElementById('college').value;
        const subject = document.getElementById('subject').value;
        const module = document.getElementById('module').value;
        const topic = document.getElementById('topicInput').value;
        const option = this.selectedOption;

        console.log('Generating AI response with:', { college, subject, module, topic, option });

        // Show loading state
        const outputCard = document.getElementById('collegeOutput');
        const outputContent = document.getElementById('collegeOutputContent');
        
        outputCard.style.display = 'block';
        outputContent.innerHTML = '<div class="loading-placeholder">Generating AI response...</div>';

        try {
            // Call the backend API
            const response = await fetch(`${this.apiBaseUrl}/subject-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    college,
                    subject,
                    module,
                    topic,
                    action: option
                })
            });

            console.log('Backend response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Backend response data:', data);
                
                if (data.success && data.response) {
                    const formattedResponse = this.formatAIResponse(data.response, college, subject, module, topic, option);
                    outputContent.innerHTML = formattedResponse;
                } else {
                    outputContent.innerHTML = `
                        <div class="error-message">
                            <h4>❌ Invalid Response Format</h4>
                            <p><strong>Error:</strong> Backend returned invalid response format</p>
                            <p><em>Response data: ${JSON.stringify(data)}</em></p>
                        </div>
                    `;
                }
            } else {
                let errorMessage = 'Failed to generate response';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                }
                
                outputContent.innerHTML = `
                    <div class="error-message">
                        <h4>❌ Error Generating Response</h4>
                        <p><strong>Error:</strong> ${errorMessage}</p>
                        <p><em>Please try again or check your internet connection.</em></p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error calling API:', error);
            outputContent.innerHTML = `
                <div class="error-message">
                    <h4>❌ Connection Error</h4>
                    <p><strong>Error:</strong> Failed to connect to the server</p>
                    <p><em>Please make sure the backend server is running on port 3000.</em></p>
                    <p><em>Error details: ${error.message}</em></p>
                </div>
            `;
        }
    }

    getPlaceholderResponse(college, subject, module, topic, option) {
        // Format college name for display
        const collegeDisplay = college === 'bbd-university' ? 'BBD University' : 
                              college === 'aktu' ? 'AKTU' : college;
        
        // Format subject name for display
        const subjectDisplay = subject.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        const responses = {
            explanation: `
                <h4>📚 Explanation for ${subjectDisplay}</h4>
                <p><strong>College:</strong> ${collegeDisplay}</p>
                ${module ? `<p><strong>Module:</strong> ${module}</p>` : ''}
                ${topic ? `<p><strong>Topic:</strong> ${topic}</p>` : ''}
                <hr>
                <p>This is a placeholder explanation that would be generated by the AI based on ${collegeDisplay}'s curriculum and the selected subject matter. The AI would analyze:</p>
                <ul>
                    <li>Course syllabus and learning objectives</li>
                    <li>Common misconceptions and learning challenges</li>
                    <li>Real-world applications and examples</li>
                    <li>Step-by-step breakdown of complex concepts</li>
                </ul>
                <p><em>Note: This is placeholder content. In the actual implementation, this would be replaced with AI-generated explanations tailored to your specific college and subject.</em></p>
            `,
            quiz: `
                <h4>🧠 Quiz for ${subjectDisplay}</h4>
                <p><strong>College:</strong> ${collegeDisplay}</p>
                ${module ? `<p><strong>Module:</strong> ${module}</p>` : ''}
                ${topic ? `<p><strong>Topic:</strong> ${topic}</p>` : ''}
                <hr>
                <div class="quiz-placeholder">
                    <p><strong>Sample Questions:</strong></p>
                    <ol>
                        <li>What is the fundamental principle behind [topic]?</li>
                        <li>How does [concept] relate to real-world applications?</li>
                        <li>Which of the following best describes [phenomenon]?</li>
                        <li>Explain the relationship between [concept A] and [concept B].</li>
                    </ol>
                    <p><em>Note: This is placeholder content. The actual quiz would be dynamically generated based on ${collegeDisplay}'s curriculum and would include proper answer options and explanations.</em></p>
                </div>
            `,
            important: `
                <h4>⭐ Important Questions/Topics for ${subjectDisplay}</h4>
                <p><strong>College:</strong> ${collegeDisplay}</p>
                ${module ? `<p><strong>Module:</strong> ${module}</p>` : ''}
                ${topic ? `<p><strong>Topic:</strong> ${topic}</p>` : ''}
                <hr>
                <div class="important-topics">
                    <h5>Key Topics to Focus On:</h5>
                    <ul>
                        <li><strong>Core Concepts:</strong> Fundamental principles that form the foundation</li>
                        <li><strong>Problem-Solving Techniques:</strong> Common approaches and methodologies</li>
                        <li><strong>Critical Thinking:</strong> Analytical skills and logical reasoning</li>
                        <li><strong>Practical Applications:</strong> Real-world examples and case studies</li>
                    </ul>
                    <h5>Frequently Asked Questions:</h5>
                    <ol>
                        <li>How does [concept] apply to [specific scenario]?</li>
                        <li>What are the main differences between [concept A] and [concept B]?</li>
                        <li>Explain the significance of [phenomenon] in [field].</li>
                    </ol>
                </div>
            `,
            previous: `
                <h4>📜 Previous Year Questions for ${subjectDisplay}</h4>
                <p><strong>College:</strong> ${collegeDisplay}</p>
                ${module ? `<p><strong>Module:</strong> ${module}</p>` : ''}
                ${topic ? `<p><strong>Topic:</strong> ${topic}</p>` : ''}
                <hr>
                <div class="previous-questions">
                    <h5>Sample Previous Year Questions:</h5>
                    <div class="question-item">
                        <p><strong>2023:</strong> Explain the concept of [topic] with suitable examples.</p>
                    </div>
                    <div class="question-item">
                        <p><strong>2022:</strong> Discuss the importance of [concept] in modern applications.</p>
                    </div>
                    <div class="question-item">
                        <p><strong>2021:</strong> Compare and contrast [concept A] with [concept B].</p>
                    </div>
                    <p><em>Note: This is placeholder content. The actual questions would be retrieved from ${collegeDisplay}'s previous year question bank.</em></p>
                </div>
            `,
            sample: `
                <h4>📄 Sample Papers for ${subjectDisplay}</h4>
                <p><strong>College:</strong> ${collegeDisplay}</p>
                ${module ? `<p><strong>Module:</strong> ${module}</p>` : ''}
                ${topic ? `<p><strong>Topic:</strong> ${topic}</p>` : ''}
                <hr>
                <div class="sample-papers">
                    <h5>Available Sample Papers:</h5>
                    <ul>
                        <li><strong>Mid-Semester Sample:</strong> Covers topics 1-5 with solutions</li>
                        <li><strong>End-Semester Sample:</strong> Comprehensive coverage with marking scheme</li>
                        <li><strong>Practice Set A:</strong> Focus on problem-solving questions</li>
                        <li><strong>Practice Set B:</strong> Emphasis on theoretical concepts</li>
                    </ul>
                    <p><em>Note: This is placeholder content. The actual sample papers would be dynamically generated based on ${collegeDisplay}'s exam pattern and syllabus.</em></p>
                </div>
            `
        };

        return responses[option] || '<p>Please select a valid option.</p>';
    }

    setupChat() {
        // Initialize chat with welcome message
        this.addChatMessage('bot', 'Hello! I\'m your SmartPrep Assistant. How can I help you with your exam preparation today?');
    }

    sendChatMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();

        if (!message && !this.chatFile) return;

        // Add user message
        let displayMessage = message;
        if (this.chatFile) {
            displayMessage = message ? `${message} (with file: ${this.chatFile.name})` : `File: ${this.chatFile.name}`;
        }
        
        this.addChatMessage('user', displayMessage);

        // Clear input and file
        input.value = '';
        this.updateChatCounter(0);
        this.removeChatFile();

        // Simulate bot response
        setTimeout(() => {
            const botResponse = this.generateBotResponse(message);
            this.addChatMessage('bot', botResponse);
        }, 1000);
    }

    addChatMessage(sender, message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="fas fa-${sender === 'bot' ? 'robot' : 'user'}"></i>
                <p>${message}</p>
            </div>
            <div class="message-time">${time}</div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Store in chat history
        this.chatHistory.push({ sender, message, time });
    }

    generateBotResponse(userMessage) {
        const responses = [
            "That's a great question! Let me help you understand this concept better.",
            "I can see you're working on exam preparation. Here's what I recommend...",
            "This topic is commonly tested. The key points to remember are...",
            "Great question! This concept is fundamental to understanding the subject.",
            "I'd be happy to help! Let me break this down for you step by step.",
            "This is an important area to focus on. Here are the main concepts...",
            "Excellent question! This relates to several key principles in the subject.",
            "I understand your concern. Let me provide some guidance on this topic.",
            "This is a common area where students have questions. Here's what you need to know...",
            "Great thinking! This concept connects to several other important topics."
        ];

        // Simple keyword-based responses
        if (userMessage.toLowerCase().includes('exam') || userMessage.toLowerCase().includes('test')) {
            return "For exam preparation, I recommend focusing on the core concepts first, then practicing with sample questions. Would you like me to help you with a specific topic?";
        } else if (userMessage.toLowerCase().includes('study') || userMessage.toLowerCase().includes('learn')) {
            return "Effective studying involves understanding concepts, regular practice, and periodic review. What specific subject or topic would you like to work on?";
        } else if (userMessage.toLowerCase().includes('question') || userMessage.toLowerCase().includes('problem')) {
            return "I'd be happy to help you with that question! Could you provide more details about the specific problem you're facing?";
        } else {
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }

    updateChatCounter(count) {
        document.getElementById('charCount').textContent = count;
    }

    updateNotesCounter(count) {
        document.getElementById('notesCharCount').textContent = count;
    }

    summarizeNotes() {
        const notesText = document.getElementById('notesText').value.trim();
        
        if (!notesText) {
            this.showNotification('Please enter some notes to summarize.', 'warning');
            return;
        }

        // Show loading state
        const outputCard = document.getElementById('notesOutput');
        const outputContent = document.getElementById('notesOutputContent');
        
        outputCard.style.display = 'block';
        outputContent.innerHTML = '<div class="loading-placeholder">Generating summary...</div>';

        // Simulate API call delay
        setTimeout(() => {
            const summary = this.generateNotesSummary(notesText);
            outputContent.innerHTML = summary;
        }, 2000);
    }

    generateNotesSummary(notes) {
        const wordCount = notes.split(/\s+/).length;
        const charCount = notes.length;
        
        return `
            <h4>📝 AI-Generated Summary</h4>
            <div class="summary-stats">
                <p><strong>Original:</strong> ${wordCount} words, ${charCount} characters</p>
                <p><strong>Summary:</strong> ${Math.ceil(wordCount * 0.3)} words (estimated)</p>
            </div>
            <hr>
            <div class="summary-content">
                <h5>Key Points:</h5>
                <ul>
                    <li>Main concept: [Extracted from your notes]</li>
                    <li>Important definitions: [Key terms identified]</li>
                    <li>Core principles: [Fundamental ideas highlighted]</li>
                    <li>Practical applications: [Real-world connections]</li>
                </ul>
                
                <h5>Summary:</h5>
                <p>This is a placeholder summary that would be generated by AI analyzing your notes. The AI would:</p>
                <ul>
                    <li>Identify key concepts and themes</li>
                    <li>Extract important definitions and formulas</li>
                    <li>Highlight critical points and relationships</li>
                    <li>Provide a concise overview of the material</li>
                </ul>
                
                <p><em>Note: This is placeholder content. The actual summary would be AI-generated based on the specific content of your notes.</em></p>
            </div>
        `;
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            // Show file info
            this.showNotification(`File "${file.name}" selected. You can now click "Summarize Notes" to process it.`, 'success');
            
            // In a real implementation, you would read the file content here
            // For now, we'll just show the filename
            document.querySelector('.file-upload-label span').textContent = `File: ${file.name}`;
        }
    }

    handleChatFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            // Show file info in chat
            const fileName = document.getElementById('chatFileName');
            const fileRemove = document.getElementById('chatFileRemove');
            
            fileName.textContent = file.name;
            fileName.style.display = 'inline';
            fileRemove.style.display = 'inline-block';
            
            // Show notification
            this.showNotification(`File "${file.name}" attached to chat.`, 'success');
            
            // Store file reference for later use
            this.chatFile = file;
        }
    }

    removeChatFile() {
        // Clear file input
        document.getElementById('chatFileUpload').value = '';
        
        // Hide file info
        document.getElementById('chatFileName').style.display = 'none';
        document.getElementById('chatFileRemove').style.display = 'none';
        
        // Clear file reference
        this.chatFile = null;
        
        this.showNotification('File removed from chat.', 'info');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    async loadSyllabus() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/syllabus`);
            if (response.ok) {
                this.syllabus = await response.json();
                console.log('Syllabus loaded successfully');
            } else {
                console.error('Failed to load syllabus');
            }
        } catch (error) {
            console.error('Error loading syllabus:', error);
        }
    }

    setupDynamicDropdowns() {
        const subjectSelect = document.getElementById('subject');
        const moduleSelect = document.getElementById('module');
        const topicInput = document.getElementById('topicInput');
        const topicList = document.getElementById('topicList');
        const topicSuggestions = document.getElementById('topicSuggestions');

        // Subject change handler
        subjectSelect.addEventListener('change', () => {
            const selectedSubject = subjectSelect.value;
            
            // Reset module and topic
            moduleSelect.innerHTML = '<option value="">Select Module</option>';
            topicInput.value = '';
            topicList.innerHTML = '<option value="">Select Topic</option>';
            
            if (selectedSubject && this.syllabus[selectedSubject]) {
                // Enable module dropdown and populate it
                moduleSelect.disabled = false;
                const modules = Object.keys(this.syllabus[selectedSubject]);
                modules.forEach(module => {
                    const option = document.createElement('option');
                    option.value = module;
                    option.textContent = module;
                    moduleSelect.appendChild(option);
                });
            } else {
                moduleSelect.disabled = true;
            }
        });

        // Module change handler
        moduleSelect.addEventListener('change', () => {
            const selectedSubject = subjectSelect.value;
            const selectedModule = moduleSelect.value;
            
            // Reset topic
            topicInput.value = '';
            topicList.innerHTML = '<option value="">Select Topic</option>';
            
            if (selectedModule && this.syllabus[selectedSubject]?.[selectedModule]) {
                // Populate topic datalist
                const topics = this.syllabus[selectedSubject][selectedModule];
                topics.forEach(topic => {
                    const option = document.createElement('option');
                    option.value = topic;
                    option.textContent = topic;
                    topicList.appendChild(option);
                });
            }
        });

        // Topic input handler with suggestions
        topicInput.addEventListener('input', () => {
            const query = topicInput.value.toLowerCase();
            const selectedSubject = subjectSelect.value;
            const selectedModule = moduleSelect.value;
            
            if (query.length < 2) {
                topicSuggestions.style.display = 'none';
                return;
            }

            if (selectedSubject && selectedModule && this.syllabus[selectedSubject]?.[selectedModule]) {
                const topics = this.syllabus[selectedSubject][selectedModule];
                const filteredTopics = topics.filter(topic => 
                    topic.toLowerCase().includes(query)
                );

                if (filteredTopics.length > 0) {
                    topicSuggestions.innerHTML = '';
                    filteredTopics.forEach(topic => {
                        const item = document.createElement('div');
                        item.className = 'topic-suggestion-item';
                        item.textContent = topic;
                        item.addEventListener('click', () => {
                            topicInput.value = topic;
                            topicSuggestions.style.display = 'none';
                        });
                        topicSuggestions.appendChild(item);
                    });
                    topicSuggestions.style.display = 'block';
                } else {
                    topicSuggestions.style.display = 'none';
                }
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!topicInput.contains(e.target) && !topicSuggestions.contains(e.target)) {
                topicSuggestions.style.display = 'none';
            }
        });
    }

    async debugConnection() {
        const debugCard = document.getElementById('debugCard');
        const debugContent = document.getElementById('debugContent');
        
        debugCard.style.display = 'block';
        debugContent.innerHTML = '<div class="loading-placeholder">Testing connection...</div>';

        try {
            // Test backend health
            const healthResponse = await fetch(`${this.apiBaseUrl}/health`);
            const healthData = await healthResponse.json();
            
            // Test Gemini API
            const geminiResponse = await fetch(`${this.apiBaseUrl}/test-gemini`);
            const geminiData = await geminiResponse.json();

            const debugInfo = `
                <div class="debug-info">
                    <h4>🔍 Connection Test Results</h4>
                    
                    <h5>Backend Health:</h5>
                    <ul>
                        <li><strong>Status:</strong> ${healthData.status}</li>
                        <li><strong>Message:</strong> ${healthData.message}</li>
                        <li><strong>Gemini Configured:</strong> ${healthData.gemini?.configured ? '✅ Yes' : '❌ No'}</li>
                        <li><strong>Gemini Initialized:</strong> ${healthData.gemini?.initialized ? '✅ Yes' : '❌ No'}</li>
                    </ul>
                    
                    <h5>Gemini API Test:</h5>
                    <ul>
                        <li><strong>Status:</strong> ${geminiResponse.ok ? '✅ Success' : '❌ Failed'}</li>
                        <li><strong>Response:</strong> ${geminiData.success ? '✅ Working' : '❌ Error'}</li>
                        ${geminiData.response ? `<li><strong>Test Response:</strong> ${geminiData.response}</li>` : ''}
                        ${geminiData.error ? `<li><strong>Error:</strong> ${geminiData.error}</li>` : ''}
                    </ul>
                    
                    <h5>Frontend Configuration:</h5>
                    <ul>
                        <li><strong>API Base URL:</strong> ${this.apiBaseUrl}</li>
                        <li><strong>Syllabus Loaded:</strong> ${this.syllabus ? '✅ Yes' : '❌ No'}</li>
                        <li><strong>Subjects Available:</strong> ${this.syllabus ? Object.keys(this.syllabus).length : 0}</li>
                    </ul>
                </div>
            `;
            
            debugContent.innerHTML = debugInfo;
            
        } catch (error) {
            debugContent.innerHTML = `
                <div class="error-message">
                    <h4>❌ Debug Test Failed</h4>
                    <p><strong>Error:</strong> ${error.message}</p>
                    <p><em>Please check if the backend server is running on port 3000.</em></p>
                </div>
            `;
        }
    }

    setupFormValidation() {
        // Add form validation for required fields
        const collegeSelect = document.getElementById('college');
        const subjectSelect = document.getElementById('subject');

        [collegeSelect, subjectSelect].forEach(select => {
            select.addEventListener('change', () => {
                if (select.value) {
                    select.classList.remove('error');
                } else {
                    select.classList.add('error');
                }
            });
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ExamPal();
});

// Add notification styles dynamically
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 1rem 1.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        z-index: 1000;
        max-width: 400px;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-success {
        border-left: 4px solid #10b981;
        color: #065f46;
    }

    .notification-warning {
        border-left: 4px solid #f59e0b;
        color: #92400e;
    }

    .notification-info {
        border-left: 4px solid #6366f1;
        color: #3730a3;
    }

    .notification i {
        font-size: 1.25rem;
    }

    [data-theme="dark"] .notification {
        background: #1e293b;
        border-color: #334155;
        color: #f8fafc;
    }

    .loading-placeholder {
        text-align: center;
        padding: 2rem;
        color: #64748b;
        font-style: italic;
    }

    .error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
