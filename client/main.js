// ===== WELCOME PAGE & NAVBAR FUNCTIONALITY =====
document.addEventListener("DOMContentLoaded", () => {
	const welcomePage = document.getElementById('welcomePage');
	const mainApp = document.getElementById('mainApp');
	const getStartedBtn = document.getElementById('getStartedBtn');
	const hamburgerMenu = document.getElementById('hamburgerMenu');
	const navbarLeft = document.querySelector('.navbar-left');
	const navbarRight = document.querySelector('.navbar-right');
	
	// Get Started Button - Transition to App
	if (getStartedBtn) {
		getStartedBtn.addEventListener('click', () => {
			// Smooth fade-out welcome page
			welcomePage.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
			welcomePage.style.opacity = '0';
			welcomePage.style.transform = 'translateY(-20px)';
			
			setTimeout(() => {
				welcomePage.classList.add('hidden');
				mainApp.classList.remove('hidden');
				mainApp.style.opacity = '0';
				mainApp.style.transition = 'opacity 0.5s ease-in';
				
				// Fade in main app
				setTimeout(() => {
					mainApp.style.opacity = '1';
				}, 50);
				
				// Update navbar active state
				document.getElementById('navChat').classList.add('active');
				document.getElementById('navHome').classList.remove('active');
				
				// Initialize chatbot greeting
				setTimeout(() => {
					const messagesEl = document.getElementById('messages');
					if (messagesEl && messagesEl.children.length === 0) {
						const greeting = "Hello! I'm your ExamPal AI tutor. What would you like help with today?";
						// Wait for addMsg to be available
						const checkAndGreet = setInterval(() => {
							if (window.addMsg && typeof window.addMsg === 'function') {
								window.addMsg(greeting, 'ai');
								clearInterval(checkAndGreet);
							}
						}, 100);
						setTimeout(() => clearInterval(checkAndGreet), 2000);
					}
				}, 500);
			}, 500);
		});
	}
	
	// Hamburger Menu Toggle (Mobile)
	if (hamburgerMenu) {
		hamburgerMenu.addEventListener('click', () => {
			navbarLeft.classList.toggle('active');
			navbarRight.classList.toggle('active');
		});
	}
	
	// Dropdown Functionality
	const profileDropdown = document.getElementById('navProfileDropdown');
	const resourcesDropdown = document.getElementById('navResourcesDropdown');
	
	// Profile Dropdown
	if (profileDropdown) {
		const profileBtn = profileDropdown.querySelector('.nav-item');
		profileBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			// Close resources dropdown if open
			resourcesDropdown?.classList.remove('active');
			// Toggle profile dropdown
			profileDropdown.classList.toggle('active');
		});
		
		// Profile dropdown items
		const profileSignIn = document.getElementById('profileSignIn');
		const profileDashboard = document.getElementById('profileDashboard');
		const profileSettings = document.getElementById('profileSettings');
		const profileLogout = document.getElementById('profileLogout');
		
		if (profileSignIn) {
			profileSignIn.addEventListener('click', (e) => {
				e.preventDefault();
				alert('Sign In functionality coming soon!');
				profileDropdown.classList.remove('active');
			});
		}
		
		if (profileDashboard) {
			profileDashboard.addEventListener('click', (e) => {
				e.preventDefault();
				alert('Performance Dashboard coming soon!');
				profileDropdown.classList.remove('active');
			});
		}
		
		if (profileSettings) {
			profileSettings.addEventListener('click', (e) => {
				e.preventDefault();
				alert('User Settings coming soon!');
				profileDropdown.classList.remove('active');
			});
		}
		
		if (profileLogout) {
			profileLogout.addEventListener('click', (e) => {
				e.preventDefault();
				alert('Logout functionality coming soon!');
				profileDropdown.classList.remove('active');
			});
		}
	}
	
	// Study Resources Dropdown
	if (resourcesDropdown) {
		const resourcesBtn = resourcesDropdown.querySelector('.nav-item');
		resourcesBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			// Close profile dropdown if open
			profileDropdown?.classList.remove('active');
			// Toggle resources dropdown
			resourcesDropdown.classList.toggle('active');
		});
		
		// Resources dropdown items
		const resourceItems = resourcesDropdown.querySelectorAll('.dropdown-item');
		resourceItems.forEach(item => {
			item.addEventListener('click', (e) => {
				e.preventDefault();
				const resource = item.getAttribute('data-resource');
				alert(`${item.textContent} coming soon!`);
				resourcesDropdown.classList.remove('active');
			});
		});
	}
	
	// Close dropdowns when clicking outside
	document.addEventListener('click', (e) => {
		if (!e.target.closest('.nav-item-dropdown')) {
			profileDropdown?.classList.remove('active');
			resourcesDropdown?.classList.remove('active');
		}
		
		// Close mobile menu when clicking outside
		if (window.innerWidth <= 768) {
			if (!e.target.closest('.navbar-container') && 
				!e.target.closest('.hamburger-menu')) {
				navbarLeft.classList.remove('active');
				navbarRight.classList.remove('active');
			}
		}
	});
	
	// Navbar Navigation
	const navItems = document.querySelectorAll('.nav-item[data-section]');
	navItems.forEach(item => {
		item.addEventListener('click', (e) => {
			// Don't trigger if clicking on dropdown arrow
			if (e.target.closest('.dropdown-arrow')) return;
			
			const section = item.getAttribute('data-section');
			
			// Close all dropdowns
			profileDropdown?.classList.remove('active');
			resourcesDropdown?.classList.remove('active');
			
			// Update active state
			document.querySelectorAll('.nav-item[data-section]').forEach(nav => nav.classList.remove('active'));
			item.classList.add('active');
			
			// Close mobile menu
			if (window.innerWidth <= 768) {
				navbarLeft.classList.remove('active');
				navbarRight.classList.remove('active');
			}
			
			// Handle navigation
			if (section === 'home') {
				// Go back to welcome page
				mainApp.style.transition = 'opacity 0.5s ease-out';
				mainApp.style.opacity = '0';
				setTimeout(() => {
					mainApp.classList.add('hidden');
					welcomePage.classList.remove('hidden');
					welcomePage.style.opacity = '0';
					welcomePage.style.transform = 'translateY(20px)';
					welcomePage.style.transition = 'opacity 0.5s ease-in, transform 0.5s ease-in';
					setTimeout(() => {
						welcomePage.style.opacity = '1';
						welcomePage.style.transform = 'translateY(0)';
					}, 50);
				}, 500);
			} else if (section === 'chat') {
				// Show main app and switch to chat
				if (welcomePage && !welcomePage.classList.contains('hidden')) {
					getStartedBtn.click();
				} else {
					switchTab('chat');
				}
			} else if (section === 'college') {
				// Show main app and switch to college-specific AI
				if (welcomePage && !welcomePage.classList.contains('hidden')) {
					getStartedBtn.click();
					setTimeout(() => switchTab('college'), 600);
				} else {
					switchTab('college');
				}
			} else if (section === 'quiz') {
				// Show main app and switch to quiz
				if (welcomePage && !welcomePage.classList.contains('hidden')) {
					getStartedBtn.click();
					setTimeout(() => switchTab('quiz'), 600);
				} else {
					switchTab('quiz');
				}
			} else if (section === 'resources') {
				// Resources dropdown is handled above
				return;
			} else {
				// Other sections (help)
				alert(`${section.charAt(0).toUpperCase() + section.slice(1)} section coming soon!`);
			}
		});
	});
});

// ===== BRAND NEW NAVIGATION SYSTEM =====
let currentTab = 'chat';

function switchTab(tabName) {
	// Hide all panels
	document.querySelectorAll('.tab-panel').forEach(panel => {
		panel.classList.remove('active');
	});
	
	// Remove active from all tabs
	document.querySelectorAll('.nav-tab').forEach(tab => {
		tab.classList.remove('active');
	});
	
	// Show selected panel
	const panel = document.getElementById(`tabContent${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
	if (panel) {
		panel.classList.add('active');
	}
	
	// Activate selected tab
	const tab = document.getElementById(`tab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
	if (tab) {
		tab.classList.add('active');
	}
	
	currentTab = tabName;
}

// navigation button event listener
document.addEventListener("DOMContentLoaded", () => {
	const tabChat = document.getElementById("tabChat");
	const tabCollege = document.getElementById("tabCollege");
	const tabQuiz = document.getElementById("tabQuiz");
	
	if (tabChat) tabChat.addEventListener("click", () => switchTab("chat"));
	if (tabCollege) tabCollege.addEventListener("click", () => switchTab("college"));
	if (tabQuiz) tabQuiz.addEventListener("click", () => switchTab("quiz"));
});
  

(function(){
	const API = '';
	let token = null; // not used while AUTH_DISABLED=true
	let typingEl = document.getElementById('typing');
	let statusEl = document.getElementById('statusText');
	let messagesEl = document.getElementById('messages');
	let followupsEl = document.getElementById('followups');
	let suggestionsEl = document.getElementById('suggestions');
	const conversation = [];
	let quizState = { questions: [], answers: {} };
	let currentTab = 'chat';

	// College-Specific state and elements
	const cs = {
		collegeSel: document.getElementById('csCollege'),
		subjectInput: document.getElementById('csSubject'),
		subjectSug: document.getElementById('csSubjectSug'),
		moduleSelect: document.getElementById('csModule'),
		topicSelect: document.getElementById('csTopic'),
		levelSelect: document.getElementById('csLevel'),
		output: document.getElementById('csOutput'),
		explainBtn: document.getElementById('csExplainBtn'),
		pyqBtn: document.getElementById('csPyqBtn'),
		cheatBtn: document.getElementById('csCheatBtn'),
		state: {
			collegeId: '', collegeName: '',
			subjectId: '', subjectName: '',
			moduleId: '', moduleName: '',
			topicId: '', topicName: ''
		},
		cache: { colleges: [], subjects: [], modules: [], topics: [] }
	};

	function setStatus(text){ statusEl.textContent = text; }
	
	// Convert markdown to HTML for AI messages
	function markdownToHtml(text) {
		if (!text) return '';
		
		// Escape HTML helper
		const escapeHtml = (str) => {
			const div = document.createElement('div');
			div.textContent = str;
			return div.innerHTML;
		};
		
		// Process code blocks first (before other processing) - preserve them
		const codeBlocks = [];
		let codeBlockIndex = 0;
		text = text.replace(/```([\s\S]*?)```/g, (match, code) => {
			const placeholder = `__CODE_BLOCK_${codeBlockIndex}__`;
			codeBlocks[codeBlockIndex] = escapeHtml(code.trim());
			codeBlockIndex++;
			return placeholder;
		});
		
		// Process inline code - preserve them
		const inlineCodes = [];
		let inlineCodeIndex = 0;
		text = text.replace(/`([^`\n]+)`/g, (match, code) => {
			const placeholder = `__INLINE_CODE_${inlineCodeIndex}__`;
			inlineCodes[inlineCodeIndex] = escapeHtml(code);
			inlineCodeIndex++;
			return placeholder;
		});
		
		// Split into lines for processing (BEFORE escaping)
		const lines = text.split('\n');
		const result = [];
		let inList = false;
		let listType = null; // 'ul' or 'ol'
		
		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];
			const originalLine = line;
			const trimmedLine = line.trim();
			
			// Headers (check from most # to least #) - process BEFORE escaping
			if (trimmedLine.match(/^######\s+(.+)$/)) {
				if (inList) { result.push(`</${listType}>`); inList = false; }
				const content = trimmedLine.replace(/^######\s+/, '');
				result.push(`<h6>${escapeHtml(content)}</h6>`);
			} else if (trimmedLine.match(/^#####\s+(.+)$/)) {
				if (inList) { result.push(`</${listType}>`); inList = false; }
				const content = trimmedLine.replace(/^#####\s+/, '');
				result.push(`<h5>${escapeHtml(content)}</h5>`);
			} else if (trimmedLine.match(/^####\s+(.+)$/)) {
				if (inList) { result.push(`</${listType}>`); inList = false; }
				const content = trimmedLine.replace(/^####\s+/, '');
				result.push(`<h4>${escapeHtml(content)}</h4>`);
			} else if (trimmedLine.match(/^###\s+(.+)$/)) {
				if (inList) { result.push(`</${listType}>`); inList = false; }
				const content = trimmedLine.replace(/^###\s+/, '');
				result.push(`<h3>${escapeHtml(content)}</h3>`);
			} else if (trimmedLine.match(/^##\s+(.+)$/)) {
				if (inList) { result.push(`</${listType}>`); inList = false; }
				const content = trimmedLine.replace(/^##\s+/, '');
				result.push(`<h2>${escapeHtml(content)}</h2>`);
			} else if (trimmedLine.match(/^#\s+(.+)$/)) {
				if (inList) { result.push(`</${listType}>`); inList = false; }
				const content = trimmedLine.replace(/^#\s+/, '');
				result.push(`<h1>${escapeHtml(content)}</h1>`);
			}
			// Horizontal rules
			else if (trimmedLine.match(/^---+$/) || trimmedLine.match(/^===+$/)) {
				if (inList) { result.push(`</${listType}>`); inList = false; }
				result.push('<hr>');
			}
			// Unordered lists
			else if (trimmedLine.match(/^[\*\-]\s+(.+)$/)) {
				const content = trimmedLine.replace(/^[\*\-]\s+/, '');
				if (!inList || listType !== 'ul') {
					if (inList) result.push(`</${listType}>`);
					result.push('<ul>');
					inList = true;
					listType = 'ul';
				}
				// Process bold/italic in list items
				let processedContent = escapeHtml(content);
				processedContent = processedContent.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
				processedContent = processedContent.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
				processedContent = processedContent.replace(/\*(.+?)\*/g, '<em>$1</em>');
				result.push(`<li>${processedContent}</li>`);
			}
			// Ordered lists
			else if (trimmedLine.match(/^\d+\.\s+(.+)$/)) {
				const content = trimmedLine.replace(/^\d+\.\s+/, '');
				if (!inList || listType !== 'ol') {
					if (inList) result.push(`</${listType}>`);
					result.push('<ol>');
					inList = true;
					listType = 'ol';
				}
				// Process bold/italic in list items
				let processedContent = escapeHtml(content);
				processedContent = processedContent.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
				processedContent = processedContent.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
				processedContent = processedContent.replace(/\*(.+?)\*/g, '<em>$1</em>');
				result.push(`<li>${processedContent}</li>`);
			}
			// Empty line
			else if (trimmedLine === '') {
				if (inList) {
					result.push(`</${listType}>`);
					inList = false;
					listType = null;
				}
				result.push('<br>');
			}
			// Regular paragraph
			else {
				if (inList) {
					result.push(`</${listType}>`);
					inList = false;
					listType = null;
				}
				// Escape HTML first, then process bold and italic
				let processedLine = escapeHtml(trimmedLine);
				processedLine = processedLine.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
				processedLine = processedLine.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
				processedLine = processedLine.replace(/\*(.+?)\*/g, '<em>$1</em>');
				result.push(`<p>${processedLine}</p>`);
			}
		}
		
		// Close any open list
		if (inList) {
			result.push(`</${listType}>`);
		}
		
		let html = result.join('');
		
		// Restore code blocks and inline code
		codeBlocks.forEach((code, idx) => {
			html = html.replace(`__CODE_BLOCK_${idx}__`, `<pre><code>${code}</code></pre>`);
		});
		inlineCodes.forEach((code, idx) => {
			html = html.replace(`__INLINE_CODE_${idx}__`, `<code>${code}</code>`);
		});
		
		return html;
	}
	
	function addMsg(text, who, cls){
		const div = document.createElement('div');
		div.className = `msg ${who}` + (cls?` ${cls}`:'');
		
		// For AI messages, render as HTML with formatting
		// For user messages, use plain text for security
		if (who === 'ai') {
			div.innerHTML = markdownToHtml(text);
		} else {
			div.textContent = text;
		}
		
		messagesEl.appendChild(div);
		
		// Scroll to bottom of messages container
		const messagesContainer = document.querySelector('.messages-container');
		if (messagesContainer) {
			setTimeout(() => {
				messagesContainer.scrollTop = messagesContainer.scrollHeight;
			}, 50);
		}
		
		conversation.push({ who, text, at: new Date().toISOString() });
	}
	
	// Expose addMsg globally for welcome page
	window.addMsg = addMsg;
	function headers(){ return { 'Content-Type':'application/json' }; }

	// Navigation is handled by global function above

	async function fetchProfile(){
		// Profile functionality will be added when authentication is enabled
	}

	async function loadSuggestions(){
		const defaults = [
			"Explain time management for exams",
			"Give a short quiz on linked lists",
			"Summarize Newton's laws for revision",
			"Create a cheat-sheet for derivatives",
			"How to avoid common mistakes in exams?"
		];
		suggestionsEl.innerHTML='';
		defaults.forEach(s=>{
			const li=document.createElement('li');
			li.textContent = s;
			li.onclick=()=>{ 
				document.getElementById('messageInput').value = s; 
				document.getElementById('messageInput').focus();
			};
			suggestionsEl.appendChild(li);
		});
		
		// Show/hide suggestions bar
		const suggestionsBar = document.getElementById('suggestionsBar');
		if (suggestionsBar) {
			if (defaults.length > 0) {
				suggestionsBar.style.display = 'block';
			} else {
				suggestionsBar.style.display = 'none';
			}
		}
	}


	async function genFollowups(){
		try {
			const topic = conversation.slice().reverse().find(m=>m.who==='user')?.text?.slice(0,60) || '';
			const url = `/api/ai/suggestions?${new URLSearchParams({ topic }).toString()}`;
			const res = await fetch(url, { headers: headers() });
			if (!res.ok) {
				console.warn('Suggestions endpoint returned:', res.status);
				return;
			}
			const data = await res.json();
			followupsEl.textContent = '';
			if (data.success){ followupsEl.textContent = (data.data.suggestions||'').toString(); }
		} catch (e) {
			console.warn('Failed to load suggestions:', e);
			// Silently fail - suggestions are optional
		}
	}

	async function sendChat(msg){
		typingEl.classList.remove('hidden');
		const generalMsg = `As an exam preparation assistant, answer generally (not college/subject specific) unless explicitly asked: ${msg}`;
		const body = { message: generalMsg };
		try{
			const res = await fetch('/api/ai/chat', { method:'POST', headers: headers(), body: JSON.stringify(body) });
			if (!res.ok) {
				const errorText = await res.text();
				let errorData;
				try {
					errorData = JSON.parse(errorText);
				} catch {
					errorData = { error: `Server error (${res.status})` };
				}
				typingEl.classList.add('hidden');
				addMsg(errorData.error || 'AI error. Please try again.', 'ai', 'warning');
				return;
			}
			const data = await res.json();
			typingEl.classList.add('hidden');
			if (!data.success){ addMsg(data.error||'AI error. Please try again.', 'ai', 'warning'); return; }
			const text = data.data?.message || '';
			addMsg(text || 'No response', 'ai');
			await fetchProfile();
			// genFollowups() removed - suggestions are shown in suggestions bar instead
		}catch(e){
			typingEl.classList.add('hidden');
			console.error('Chat error:', e);
			addMsg('Network error. Please retry.', 'ai', 'warning');
		}
	}

	async function summarizeFile(file){
		const form = new FormData();
		form.append('file', file);
		try{
			const res = await fetch('/api/ai/summarize-file', { method:'POST', body: form });
			const data = await res.json();
			if (data.success){ addMsg(data.data.summary, 'ai'); }
			else addMsg(data.error||'Failed to summarize', 'ai', 'warning');
		}catch(e){ addMsg('Upload failed. Please try again.', 'ai', 'warning'); }
	}

	// ===== College-Specific Prep helpers =====
	function setCsOutput(text){ 
		cs.output.innerHTML = markdownToHtml(text); 
	}
	function getCsLevel(){ return cs.levelSelect?.value || 'intermediate'; }
	function mapLevelToDifficulty(level){ if(level==='beginner') return 'easy'; if(level==='advanced') return 'hard'; return 'medium'; }

	// Format AI response for better readability
	function formatAIResponse(text, context) {
		// Add context header
		let formatted = `📚 ${context.college} - ${context.subject}\n`;
		if (context.module) formatted += `📖 Module: ${context.module}\n`;
		if (context.topic) formatted += `🎯 Topic: ${context.topic}\n`;
		formatted += `\n${'='.repeat(50)}\n\n`;
		
		// Format the main content
		formatted += text;
		
		return formatted;
	}

	// Update suggestions based on AI response and context
	function updateSuggestions(context) {
		const suggestions = [
			`Explain more about ${context.topic || context.subject}`,
			`Create a cheat sheet for ${context.subject}`,
			`Generate PYQ for ${context.topic || context.subject}`,
			`Give examples related to ${context.topic || context.subject}`,
			`What are the key concepts in ${context.subject}?`
		];
		
		// Update suggestions in AI Chatbot tab
		const suggestionsList = document.getElementById('suggestions');
		if (suggestionsList) {
			suggestionsList.innerHTML = '';
			suggestions.forEach(suggestion => {
				const li = document.createElement('li');
				li.textContent = suggestion;
				li.onclick = () => {
					// Switch to AI Chatbot tab and send suggestion
					switchTab('chat');
					document.getElementById('messageInput').value = suggestion;
					document.getElementById('messageInput').focus();
				};
				suggestionsList.appendChild(li);
			});
		}
		
		// Show/hide suggestions bar
		const suggestionsBar = document.getElementById('suggestionsBar');
		if (suggestionsBar) {
			if (suggestions.length > 0) {
				suggestionsBar.style.display = 'block';
			} else {
				suggestionsBar.style.display = 'none';
			}
		}
	}
	function debounce(fn, ms){ let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args), ms); }; }

	async function loadColleges(){
		try{
			// Restrict to BBD and AKTU
			const res = await fetch('/api/colleges');
			const data = await res.json();
			const list = (data.data||data.colleges||[]).filter(c=>/^(BBD University|AKTU)$/i.test(c.name));
			cs.cache.colleges = list;
			cs.collegeSel.innerHTML = '<option value="">Select College</option>' + list.map(c=>`<option value="${c._id}">${c.name}</option>`).join('');
			console.log('Colleges loaded:', list.length);
			if(list.length){ 
				cs.state.collegeId=list[0]._id; 
				cs.state.collegeName=list[0].name; 
				cs.collegeSel.value = list[0]._id;
				await loadSubjects();
			}
		}catch(e){ 
			console.error('Failed to load colleges:', e);
			cs.collegeSel.innerHTML = '<option>Loading failed</option>'; 
		}
	}

	async function loadSubjects(){
		if(!cs.state.collegeId) { 
			cs.cache.subjects = [];
			cs.subjectInput.value = '';
			cs.subjectSug.classList.add('hidden');
			return; 
		}
		try{
			const res = await fetch(`/api/subjects/${cs.state.collegeId}`);
			const data = await res.json();
			cs.cache.subjects = data.data||[];
			console.log('Loaded subjects:', cs.cache.subjects.length);
		}catch(e){
			console.error('Failed to load subjects:', e);
			cs.cache.subjects = [];
		}
	}

	async function loadModules(){
		if(!cs.state.subjectId) { 
			cs.cache.modules = [];
			cs.moduleSelect.innerHTML = '<option value="">Select Module</option>';
			return; 
		}
		try{
			const res = await fetch(`/api/modules/${cs.state.subjectId}`);
			const data = await res.json();
			cs.cache.modules = data.data||[];
			
			// Populate module dropdown
			cs.moduleSelect.innerHTML = '<option value="">Select Module</option>' + 
				cs.cache.modules.map(m => `<option value="${m._id}">${m.name}</option>`).join('');
		}catch(e){ 
			console.error('Failed to load modules:', e);
			cs.cache.modules = [];
			cs.moduleSelect.innerHTML = '<option value="">Select Module</option>';
		}
	}

	async function loadTopics(){
		if(!cs.state.moduleId){ 
			cs.cache.topics = [];
			cs.topicSelect.innerHTML = '<option value="">Select Topic</option>';
			return; 
		}
		try{
			const res = await fetch(`/api/topics/${cs.state.moduleId}`);
			const data = await res.json();
			cs.cache.topics = data.data||[];
			
			// Populate topic dropdown
			cs.topicSelect.innerHTML = '<option value="">Select Topic</option>' + 
				cs.cache.topics.map(t => `<option value="${t._id}">${t.name}</option>`).join('');
		}catch(e){ 
			console.error('Failed to load topics:', e);
			cs.cache.topics = [];
			cs.topicSelect.innerHTML = '<option value="">Select Topic</option>';
		}
	}

	function bindTypeahead(inputEl, sugEl, getItems, onSelect){
		function render(list){
			sugEl.innerHTML = '';
			if(!list.length){ 
				sugEl.classList.add('hidden'); 
				return; 
			}
			console.log('Rendering suggestions:', list.length);
			list.slice(0,8).forEach(item=>{
				const li=document.createElement('li');
				li.textContent = item.name || item.title || item;
				li.onclick = (e)=>{
					e.preventDefault();
					e.stopPropagation();
					sugEl.classList.add('hidden'); 
					onSelect(item); 
				};
				sugEl.appendChild(li);
			});
			sugEl.classList.remove('hidden');
		}
		const onInput = debounce(()=>{
			const q = inputEl.value.trim().toLowerCase();
			const items = getItems();
			console.log('Filtering items:', items.length, 'query:', q);
			const filtered = items.filter(x=> (x.name||x.title||'').toLowerCase().includes(q));
			render(filtered);
		}, 300);
		inputEl.addEventListener('input', onInput);
		inputEl.addEventListener('focus', onInput);
		inputEl.addEventListener('blur', (e)=>{
			// Delay hiding to allow click on suggestion
			setTimeout(()=>{
				if(!sugEl.contains(document.activeElement)) {
					sugEl.classList.add('hidden');
				}
			}, 200);
		});
		document.addEventListener('click', (e)=>{ 
			if(!sugEl.contains(e.target) && e.target!==inputEl) {
				sugEl.classList.add('hidden'); 
			}
		});
	}

	async function csExplain(){
		// Validate subject selection
		if (!cs.state.subjectId) {
			setCsOutput('Please select a subject first.');
			return;
		}

		const level = getCsLevel();
		const context = {
			college: cs.state.collegeName,
			subject: cs.state.subjectName,
			module: cs.state.moduleName || '',
			topic: cs.state.topicName || ''
		};

		const body = { 
			subject: cs.state.subjectName, 
			topic: cs.state.topicName || cs.state.moduleName || cs.state.subjectName, 
			level,
			context
		};
		
		setCsOutput('Generating explanation...');

		try{
			let res = await fetch('/api/ai/explain', { method:'POST', headers: headers(), body: JSON.stringify(body) });
			if(res.status===404){ // fallback
				const msg = `Explain ${body.topic} for ${cs.state.collegeName} ${cs.state.subjectName} at ${level} level.`;
				res = await fetch('/api/ai/chat', { method:'POST', headers: headers(), body: JSON.stringify({ message: msg }) });
			}
			const data = await res.json();
			if(!data.success) throw new Error(data.error||'Failed');
			const text = data.data?.explanation || data.data?.message || '';
			
			// Format response
			const formattedResponse = formatAIResponse(text, context);
			setCsOutput(formattedResponse);
			
			// Update suggestions based on response
			updateSuggestions(context);
		}catch(e){ setCsOutput('Failed to generate explanation. Please try again.'); }
	}


	async function csPyq(){
		const body = { college: cs.state.collegeName, subject: cs.state.subjectName, topic: cs.state.topicName||'' };
		setCsOutput('Fetching PYQs and solutions...');
		try{
			const res = await fetch('/api/ai/pyq', { method:'POST', headers: headers(), body: JSON.stringify(body) });
			const data = await res.json();
			if(!data.success) throw new Error(data.error||'Failed');
			const text = data.data?.solutions || data.data?.pyq || data.data?.message || '';
			setCsOutput(text||'No content.');
		}catch(e){ setCsOutput('Failed to fetch PYQs. Please try again.'); }
	}

	async function csCheat(){
		const body = { subject: cs.state.subjectName, topic: cs.state.topicName||cs.state.moduleName||cs.state.subjectName };
		setCsOutput('Generating cheat sheet...');
		try{
			const res = await fetch('/api/ai/cheat-sheet', { method:'POST', headers: headers(), body: JSON.stringify(body) });
			const data = await res.json();
			if(!data.success) throw new Error(data.error||'Failed');
			const text = data.data?.cheatSheet || data.data?.message || '';
			setCsOutput(text||'No content.');
			// Offer download as Markdown
			const blob = new Blob([text], { type:'text/markdown' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a'); a.href=url; a.download=`cheat-sheet-${Date.now()}.md`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
		}catch(e){ setCsOutput('Failed to generate cheat sheet. Please try again.'); }
	}

	// Quiz state
	let quizData = null;
	let currentQuestion = 0;
	let userAnswers = [];
	let quizStartTime = null;
	let quizTimer = null;
	let timeRemaining = 0;

	// Quiz logic
	function renderQuiz(){
		const container = document.getElementById('quizContainer');
		container.innerHTML = '';
		
		if (!quizData || !quizData.questions || quizData.questions.length === 0) {
			container.innerHTML = '<div class="quiz-empty">No quiz data available</div>';
			return;
		}

		// Quiz header with timer
		const header = document.createElement('div');
		header.className = 'quiz-header';
		header.innerHTML = `
			<div class="quiz-info">
				<h3>Quiz: ${quizData.subject || 'General'}</h3>
				<div class="quiz-timer" id="quizTimer">Time: 00:00</div>
			</div>
			<div class="quiz-progress">
				Question ${currentQuestion + 1} of ${quizData.questions.length}
			</div>
		`;
		container.appendChild(header);

		// Current question
		const question = quizData.questions[currentQuestion];
		const questionCard = document.createElement('div');
		questionCard.className = 'quiz-question';
		questionCard.innerHTML = `
			<h4>Q${currentQuestion + 1}. ${question.question}</h4>
			<div class="quiz-options">
				${question.options.map((option, idx) => `
					<label class="quiz-option">
						<input type="radio" name="currentQuestion" value="${option}" ${userAnswers[currentQuestion] === option ? 'checked' : ''}>
						<span class="option-text">${String.fromCharCode(65 + idx)}) ${option}</span>
					</label>
				`).join('')}
			</div>
		`;
		container.appendChild(questionCard);

		// Navigation buttons
		const nav = document.createElement('div');
		nav.className = 'quiz-navigation';
		nav.innerHTML = `
			<button id="prevBtn" class="btn" ${currentQuestion === 0 ? 'disabled' : ''}>Previous</button>
			<button id="nextBtn" class="btn primary" ${currentQuestion === quizData.questions.length - 1 ? 'disabled' : ''}>
				${currentQuestion === quizData.questions.length - 1 ? 'Submit Quiz' : 'Next'}
			</button>
		`;
		container.appendChild(nav);

		// Event listeners
		document.getElementById('prevBtn').onclick = () => {
			saveCurrentAnswer();
			if (currentQuestion > 0) {
				currentQuestion--;
				renderQuiz();
			}
		};

		document.getElementById('nextBtn').onclick = () => {
			saveCurrentAnswer();
			if (currentQuestion < quizData.questions.length - 1) {
				currentQuestion++;
				renderQuiz();
			} else {
				submitQuiz();
			}
		};

		// Show reset button only
		document.getElementById('quizActions').classList.remove('hidden');
	}

	function saveCurrentAnswer() {
		const selected = document.querySelector('input[name="currentQuestion"]:checked');
		userAnswers[currentQuestion] = selected ? selected.value : null;
	}

	async function startQuiz(){
		const subject = document.getElementById('quizSubject').value.trim() || 'General';
		const topic = document.getElementById('quizTopic').value.trim();
		const difficulty = document.getElementById('quizDifficulty').value;
		const count = parseInt(document.getElementById('quizCount').value, 10);
		
		setStatus('Generating quiz...');
		
		const body = { subject, topic, difficulty, count };
		try {
			const res = await fetch('/api/ai/quiz', { 
				method: 'POST', 
				headers: { 'Content-Type': 'application/json' }, 
				body: JSON.stringify(body) 
			});
			const data = await res.json();
			
			if (!data.success) {
				setStatus('Failed to generate quiz: ' + (data.error || 'Unknown error'));
				return;
			}

			// Parse the quiz data
			const text = data.data || data.response || '';
			quizData = parseQuizText(text, subject, topic);
			
			if (!quizData || !quizData.questions || quizData.questions.length === 0) {
				setStatus('Could not parse quiz questions');
				return;
			}

			// Initialize quiz state
			currentQuestion = 0;
			userAnswers = new Array(quizData.questions.length).fill(null);
			quizStartTime = Date.now();
			timeRemaining = 30 * 60; // 30 minutes default
			
			// Start timer
			startQuizTimer();
			
			// Render quiz
			renderQuiz();
			setStatus(`Quiz started with ${quizData.questions.length} questions`);
			
		} catch (error) {
			console.error('Quiz generation error:', error);
			setStatus('Failed to generate quiz');
		}
	}

	function parseQuizText(text, subject, topic) {
		// Enhanced parser for better quiz parsing
		const questions = [];
		const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
		
		let currentQ = null;
		let inOptions = false;
		
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			
			// Question detection
			if (/^\d+[\.\)]\s/.test(line) || /^Question\s+\d+/i.test(line)) {
				if (currentQ && currentQ.options.length >= 2) {
					questions.push(currentQ);
				}
				currentQ = {
					question: line.replace(/^\d+[\.\)]\s/, '').replace(/^Question\s+\d+[\.\):]\s*/i, ''),
					options: [],
					correct: null,
					explanation: ''
				};
				inOptions = true;
			}
			// Options detection
			else if (inOptions && /^[A-D][\.\)]\s/.test(line)) {
				if (currentQ) {
					currentQ.options.push(line.replace(/^[A-D][\.\)]\s/, ''));
				}
			}
			// Correct answer detection
			else if (/^Correct\s+Answer/i.test(line) || /^Answer/i.test(line)) {
				if (currentQ) {
					currentQ.correct = line.split(':').slice(1).join(':').trim();
				}
			}
			// Explanation detection
			else if (/^Explanation/i.test(line)) {
				if (currentQ) {
					currentQ.explanation = line.split(':').slice(1).join(':').trim();
				}
			}
		}
		
		// Add last question
		if (currentQ && currentQ.options.length >= 2) {
			questions.push(currentQ);
		}
		
		return {
			subject,
			topic,
			questions: questions.slice(0, 10) // Limit to 10 questions max
		};
	}

	function startQuizTimer() {
		quizTimer = setInterval(() => {
			timeRemaining--;
			const minutes = Math.floor(timeRemaining / 60);
			const seconds = timeRemaining % 60;
			const timerEl = document.getElementById('quizTimer');
			if (timerEl) {
				timerEl.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
			}
			
			if (timeRemaining <= 0) {
				clearInterval(quizTimer);
				submitQuiz();
			}
		}, 1000);
	}

	async function submitQuiz(){
		saveCurrentAnswer();
		
		if (quizTimer) {
			clearInterval(quizTimer);
		}
		
		const timeTaken = Math.round((Date.now() - quizStartTime) / 1000);
		const correctAnswers = userAnswers.filter((answer, idx) => 
			answer === quizData.questions[idx].correct
		).length;
		const score = Math.round((correctAnswers / quizData.questions.length) * 100);
		
		// Show results
		const result = document.getElementById('quizResult');
		result.innerHTML = `
			<div class="quiz-result-content">
				<h3>🎉 Quiz Complete!</h3>
				<div class="quiz-stats">
					<div class="stat">
						<span class="stat-label">Score</span>
						<span class="stat-value ${score >= 70 ? 'good' : score >= 50 ? 'average' : 'poor'}">${score}%</span>
					</div>
					<div class="stat">
						<span class="stat-label">Correct</span>
						<span class="stat-value">${correctAnswers}/${quizData.questions.length}</span>
					</div>
					<div class="stat">
						<span class="stat-label">Time Taken</span>
						<span class="stat-value">${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, '0')}</span>
					</div>
				</div>
				<div class="quiz-answers">
					<h4>Answer Review:</h4>
					${quizData.questions.map((q, idx) => `
						<div class="answer-item ${userAnswers[idx] === q.correct ? 'correct' : 'incorrect'}">
							<strong>Q${idx + 1}:</strong> ${q.question}
							<br><strong>Your Answer:</strong> ${userAnswers[idx] || 'Not answered'}
							<br><strong>Correct Answer:</strong> ${q.correct}
							${q.explanation ? `<br><strong>Explanation:</strong> ${q.explanation}` : ''}
						</div>
					`).join('')}
				</div>
			</div>
		`;
		result.classList.remove('hidden');
		
		// Save to backend
		try {
			await fetch('/api/progress/quiz', { 
				method: 'POST', 
				headers: { 'Content-Type': 'application/json' }, 
				body: JSON.stringify({ 
					answers: userAnswers, 
					score, 
					time: timeTaken, 
					questions: quizData.questions,
					subject: quizData.subject,
					topic: quizData.topic
				}) 
			});
		} catch (e) { 
			console.error('Failed to save quiz:', e); 
		}
		
		setStatus(`Quiz completed! Score: ${score}%`);
	}

	function resetQuiz(){
		if (quizTimer) {
			clearInterval(quizTimer);
		}
		quizData = null;
		currentQuestion = 0;
		userAnswers = [];
		quizStartTime = null;
		timeRemaining = 0;
		
		document.getElementById('quizContainer').innerHTML = '';
		document.getElementById('quizActions').classList.add('hidden');
		document.getElementById('quizResult').classList.add('hidden');
		setStatus('Quiz reset');
	}

	// Voice
	function setupVoice(){
		const btn = document.getElementById('voiceBtn');
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		if (!SpeechRecognition){ btn.disabled = true; btn.title='Voice not supported'; return; }
		const rec = new SpeechRecognition();
		rec.lang = 'en-US';
		rec.onresult = (e)=>{ const text = e.results[0][0].transcript; document.getElementById('messageInput').value = text; };
		btn.onclick=()=> rec.start();
	}

	function exportConversation(){
		const blob = new Blob([JSON.stringify(conversation, null, 2)], { type:'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url; a.download = `exampal-conversation-${Date.now()}.json`;
		document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
	}

	// Events
	document.getElementById('chatForm').onsubmit = async (e)=>{ e.preventDefault(); const input = document.getElementById('messageInput'); const msg = input.value.trim(); if (!msg) return; addMsg(msg, 'user'); input.value = ''; await sendChat(msg); };
	document.getElementById('fileInput').onchange = async (e)=>{ const f = e.target.files[0]; if (f) { addMsg(`Summarize file: ${f.name}`, 'user'); await summarizeFile(f); } };
	document.getElementById('exportBtn').onclick = exportConversation;
	document.getElementById('startQuizBtn').onclick = startQuiz;
	// document.getElementById('submitQuizBtn').onclick = submitQuiz;

	const submitBtn = document.getElementById('submitQuizBtn');
	if (submitBtn) {
	submitBtn.onclick = submitQuiz;
	}

	document.getElementById('resetQuizBtn').onclick = resetQuiz;

	// College-Specific events
	if (cs.collegeSel) {
		cs.collegeSel.onchange = async ()=>{
			const selected = cs.cache.colleges.find(c=>c._id===cs.collegeSel.value);
			cs.state.collegeId = selected?._id||''; 
			cs.state.collegeName = selected?.name||'';
			cs.state.subjectId = cs.state.moduleId = ''; 
			cs.state.subjectName = cs.state.moduleName = ''; 
			cs.state.topicName='';
			cs.subjectInput.value=''; 
			if (cs.moduleSelect) {
				cs.moduleSelect.value = '';
				cs.moduleSelect.innerHTML = '<option value="">Select Module</option>';
			}
			if (cs.topicSelect) {
				cs.topicSelect.value = '';
				cs.topicSelect.innerHTML = '<option value="">Select Topic</option>';
			}
			await loadSubjects();
			console.log('College changed to:', cs.state.collegeName, 'Subjects loaded:', cs.cache.subjects.length);
		};
	}

	// Subject search with spelling mistake handling
	function setupSubjectSearch() {
		cs.subjectInput.addEventListener('input', debounce(() => {
			const query = cs.subjectInput.value.trim().toLowerCase();
			if (!query) {
				cs.subjectSug.classList.add('hidden');
				return;
			}

			// Find matching subjects with fuzzy matching
			const matches = cs.cache.subjects.filter(subject => {
				const name = subject.name.toLowerCase();
				return name.includes(query) || 
					   name.includes(query.replace(/\s+/g, '')) ||
					   query.includes(name.replace(/\s+/g, ''));
			});

			if (matches.length === 0) {
				cs.subjectSug.classList.add('hidden');
				return;
			}

			// Render suggestions
			cs.subjectSug.innerHTML = '';
			matches.slice(0, 5).forEach(subject => {
				const li = document.createElement('li');
				li.textContent = subject.name;
				li.onclick = () => {
					cs.subjectInput.value = subject.name;
					cs.state.subjectId = subject._id;
					cs.state.subjectName = subject.name;
					cs.state.moduleId = '';
					cs.state.moduleName = '';
					cs.state.topicId = '';
					cs.state.topicName = '';
					cs.moduleSelect.innerHTML = '<option value="">Select Module</option>';
					cs.topicSelect.innerHTML = '<option value="">Select Topic</option>';
					cs.subjectSug.classList.add('hidden');
					loadModules();
					setStatus(`Selected subject: ${subject.name}`);
				};
				cs.subjectSug.appendChild(li);
			});
			cs.subjectSug.classList.remove('hidden');
		}, 300));

		// Hide suggestions when clicking outside
		document.addEventListener('click', (e) => {
			if (!cs.subjectInput.contains(e.target) && !cs.subjectSug.contains(e.target)) {
				cs.subjectSug.classList.add('hidden');
			}
		});
	}

	// Module dropdown event
	cs.moduleSelect.addEventListener('change', () => {
		const selectedModule = cs.cache.modules.find(m => m._id === cs.moduleSelect.value);
		if (selectedModule) {
			cs.state.moduleId = selectedModule._id;
			cs.state.moduleName = selectedModule.name;
			cs.state.topicId = '';
			cs.state.topicName = '';
			cs.topicSelect.innerHTML = '<option value="">Select Topic</option>';
			loadTopics();
			setStatus(`Selected module: ${selectedModule.name}`);
		} else {
			cs.state.moduleId = '';
			cs.state.moduleName = '';
			cs.state.topicId = '';
			cs.state.topicName = '';
			cs.topicSelect.innerHTML = '<option value="">Select Topic</option>';
		}
	});

	// Topic dropdown event
	cs.topicSelect.addEventListener('change', () => {
		const selectedTopic = cs.cache.topics.find(t => t._id === cs.topicSelect.value);
		if (selectedTopic) {
			cs.state.topicId = selectedTopic._id;
			cs.state.topicName = selectedTopic.name;
			setStatus(`Selected topic: ${selectedTopic.name}`);
		} else {
			cs.state.topicId = '';
			cs.state.topicName = '';
		}
	});

	if (cs.explainBtn) cs.explainBtn.onclick = csExplain;
	if (cs.pyqBtn) cs.pyqBtn.onclick = csPyq;
	if (cs.cheatBtn) cs.cheatBtn.onclick = csCheat;

	// ===== INITIALIZE APP =====
	setupVoice();
	fetchProfile();
	loadSuggestions();
	loadColleges().then(loadSubjects);
	setupSubjectSearch();
})();

// Navigation is handled by global function
console.log('Navigation system loaded!');
