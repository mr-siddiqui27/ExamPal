// ===== WELCOME PAGE & NAVBAR FUNCTIONALITY =====
document.addEventListener("DOMContentLoaded", () => {
	const welcomePage = document.getElementById('welcomePage');
	const mainApp = document.getElementById('mainApp');
	const getStartedBtn = document.getElementById('getStartedBtn');
	const hamburgerMenu = document.getElementById('hamburgerMenu');
	const navbarLeft = document.querySelector('.navbar-left');
	const navbarRight = document.querySelector('.navbar-right');
	
	// Brand → same as Home (welcome page when in app)
	const brandHome = document.getElementById('brandHome');
	const navHomeBtn = document.getElementById('navHome');
	if (brandHome && navHomeBtn) {
		brandHome.addEventListener('click', (e) => {
			e.preventDefault();
			navHomeBtn.click();
		});
	}

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
				
				// Empty chat UI (no auto-greeting; suggestions + empty state in chat tab)
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
		
		// Resources dropdown items - show Study Resources page instead of popup
		const resourceItems = resourcesDropdown.querySelectorAll('.dropdown-item');
		resourceItems.forEach(item => {
			item.addEventListener('click', (e) => {
				e.preventDefault();
				resourcesDropdown.classList.remove('active');
				// Show main app and go to Study Resources tab (no alert)
				const welcomePage = document.getElementById('welcomePage');
				const mainApp = document.getElementById('mainApp');
				const getStartedBtn = document.getElementById('getStartedBtn');
				if (mainApp && mainApp.classList.contains('hidden') && getStartedBtn) {
					getStartedBtn.click();
					setTimeout(() => switchTab('resources'), 600);
				} else {
					switchTab('resources');
				}
				// Update navbar active to Study Resources
				document.querySelectorAll('.nav-item[data-section]').forEach(nav => nav.classList.remove('active'));
				const navResources = document.getElementById('navResources');
				if (navResources) navResources.classList.add('active');
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
	
	// On page load: ensure Home is selected when welcome page is visible
	(function setInitialNavState() {
		const welcomeVisible = welcomePage && !welcomePage.classList.contains('hidden');
		document.querySelectorAll('.nav-item[data-section]').forEach(nav => nav.classList.remove('active'));
		const homeBtn = document.getElementById('navHome');
		const chatBtn = document.getElementById('navChat');
		if (welcomeVisible && homeBtn) {
			homeBtn.classList.add('active');
		} else if (chatBtn) {
			chatBtn.classList.add('active');
		}
	})();

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
				// Show Study Resources page (no popup)
				if (welcomePage && !welcomePage.classList.contains('hidden')) {
					getStartedBtn.click();
					setTimeout(() => switchTab('resources'), 600);
				} else {
					switchTab('resources');
				}
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

	if (tabName !== 'chat') {
		const layout = document.getElementById('chatLayout');
		if (layout && layout.classList.contains('chat-sidebar-open')) {
			layout.classList.remove('chat-sidebar-open');
			const backdrop = document.getElementById('chatSidebarBackdrop');
			if (backdrop) backdrop.setAttribute('aria-hidden', 'true');
			const tgl = document.getElementById('chatSidebarToggle');
			if (tgl) tgl.setAttribute('aria-expanded', 'false');
		}
	}
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
	const conversation = [];
	const CHAT_SESSIONS_KEY = 'exampal-chat-sessions-v1';
	const CHAT_MOBILE_BREAKPOINT = 900;
	let chatLoading = false;
	let sessions = [];
	let activeSessionId = null;
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

	function setStatus(text){ if (statusEl) statusEl.textContent = text; }

	function loadSessionsFromStorage() {
		try {
			const raw = localStorage.getItem(CHAT_SESSIONS_KEY);
			const list = raw ? JSON.parse(raw) : [];
			return Array.isArray(list) ? list : [];
		} catch {
			return [];
		}
	}
	function saveSessionsToStorage() {
		try {
			localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions.slice(0, 50)));
		} catch (e) {
			console.warn('Could not save chat sessions', e);
		}
	}
	function generateSessionId() {
		return 's_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
	}
	function ensureActiveSession() {
		if (!activeSessionId) activeSessionId = generateSessionId();
	}
	function upsertSessionFromConversation() {
		if (!conversation.length) return;
		ensureActiveSession();
		const firstUser = conversation.find(m => m.who === 'user');
		const raw = (firstUser?.text || 'New chat').trim();
		const title = raw.length > 40 ? raw.slice(0, 40) + '…' : raw || 'New chat';
		const idx = sessions.findIndex(s => s.id === activeSessionId);
		const entry = {
			id: activeSessionId,
			title,
			updatedAt: Date.now(),
			messages: conversation.map(m => ({ who: m.who, text: m.text }))
		};
		if (idx >= 0) sessions[idx] = entry;
		else sessions.unshift(entry);
		sessions.sort((a, b) => b.updatedAt - a.updatedAt);
		saveSessionsToStorage();
		renderChatSidebar();
	}
	function renderChatSidebar() {
		const todayEl = document.getElementById('chatHistoryToday');
		const yEl = document.getElementById('chatHistoryYesterday');
		const oldEl = document.getElementById('chatHistoryOlder');
		if (!todayEl || !yEl || !oldEl) return;
		const startOfToday = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
		const startOfYesterday = startOfToday - 86400000;
		const buckets = { today: [], yesterday: [], older: [] };
		sessions.forEach(s => {
			if (s.updatedAt >= startOfToday) buckets.today.push(s);
			else if (s.updatedAt >= startOfYesterday) buckets.yesterday.push(s);
			else buckets.older.push(s);
		});
		function fill(ul, list, groupWrap) {
			ul.innerHTML = '';
			list.forEach(s => {
				const li = document.createElement('li');
				const btn = document.createElement('button');
				btn.type = 'button';
				btn.className = 'chat-history-item' + (s.id === activeSessionId ? ' is-active' : '');
				btn.textContent = s.title || 'Chat';
				btn.dataset.sessionId = s.id;
				btn.addEventListener('click', () => selectChatSession(s.id));
				li.appendChild(btn);
				ul.appendChild(li);
			});
			if (groupWrap) groupWrap.style.display = list.length ? '' : 'none';
		}
		fill(todayEl, buckets.today, document.querySelector('.chat-history-group[data-period="today"]'));
		fill(yEl, buckets.yesterday, document.querySelector('.chat-history-group[data-period="yesterday"]'));
		fill(oldEl, buckets.older, document.querySelector('.chat-history-group[data-period="older"]'));
	}
	function selectChatSession(id) {
		upsertSessionFromConversation();
		const sess = sessions.find(s => s.id === id);
		if (!sess || !sess.messages) return;
		activeSessionId = id;
		messagesEl.innerHTML = '';
		conversation.length = 0;
		sess.messages.forEach(m => {
			addMsg(m.text, m.who, undefined, { skipConversation: true, skipSync: true });
			conversation.push({ who: m.who, text: m.text, at: new Date().toISOString() });
		});
		syncChatUI();
		renderChatSidebar();
		closeChatSidebarIfMobile();
	}
	function newChatSession() {
		upsertSessionFromConversation();
		activeSessionId = null;
		messagesEl.innerHTML = '';
		conversation.length = 0;
		syncChatUI();
		renderChatSidebar();
		closeChatSidebarIfMobile();
	}
	function setChatLoading(loading) {
		chatLoading = loading;
		const input = document.getElementById('messageInput');
		const sendBtn = document.getElementById('chatSendBtn');
		const form = document.getElementById('chatForm');
		if (sendBtn) sendBtn.disabled = loading;
		if (input) input.disabled = loading;
		if (form) form.classList.toggle('chat-input--disabled', loading);
	}
	function syncChatUI() {
		const emptyEl = document.getElementById('chatEmptyState');
		const msgEls = messagesEl ? messagesEl.querySelectorAll('.msg') : [];
		const hasMessages = msgEls.length > 0;
		/* Suggestion chips only in empty state (hidden for entire conversation once any message exists) */
		if (emptyEl) emptyEl.classList.toggle('is-hidden', hasMessages);
	}
	function closeChatSidebarIfMobile() {
		const layout = document.getElementById('chatLayout');
		const backdrop = document.getElementById('chatSidebarBackdrop');
		if (!layout || window.innerWidth > CHAT_MOBILE_BREAKPOINT) return;
		layout.classList.remove('chat-sidebar-open');
		const t = document.getElementById('chatSidebarToggle');
		if (t) t.setAttribute('aria-expanded', 'false');
		if (backdrop) backdrop.setAttribute('aria-hidden', 'true');
	}
	function setupChatSidebarToggle() {
		const layout = document.getElementById('chatLayout');
		const toggle = document.getElementById('chatSidebarToggle');
		const closeBtn = document.getElementById('chatSidebarClose');
		const backdrop = document.getElementById('chatSidebarBackdrop');
		if (!layout) return;
		function openSidebar() {
			layout.classList.add('chat-sidebar-open');
			if (toggle) toggle.setAttribute('aria-expanded', 'true');
			if (backdrop) backdrop.setAttribute('aria-hidden', 'false');
		}
		function closeSidebar() {
			layout.classList.remove('chat-sidebar-open');
			if (toggle) toggle.setAttribute('aria-expanded', 'false');
			if (backdrop) backdrop.setAttribute('aria-hidden', 'true');
		}
		toggle?.addEventListener('click', (e) => {
			e.stopPropagation();
			if (layout.classList.contains('chat-sidebar-open')) closeSidebar();
			else openSidebar();
		});
		closeBtn?.addEventListener('click', () => closeSidebar());
		const chatMain = document.querySelector('#tabContentChat .chat-main');
		chatMain?.addEventListener('click', (e) => {
			if (!layout.classList.contains('chat-sidebar-open')) return;
			const sb = document.getElementById('chatSidebar');
			if (sb && sb.contains(e.target)) return;
			closeSidebar();
		});
		window.addEventListener('resize', () => {
			if (window.innerWidth > CHAT_MOBILE_BREAKPOINT) closeSidebar();
		});
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && layout.classList.contains('chat-sidebar-open')) closeSidebar();
		});
	}
	function sendSuggestionPrompt(text) {
		const input = document.getElementById('messageInput');
		const form = document.getElementById('chatForm');
		if (!input || !form || chatLoading) return;
		input.value = text;
		form.requestSubmit();
	}
	
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
	
	function addMsg(text, who, cls, opts = {}){
		const div = document.createElement('div');
		div.className = `msg ${who}` + (cls ? ` ${cls}` : '');
		
		if (who === 'ai') {
			div.innerHTML = markdownToHtml(text);
		} else {
			div.textContent = text;
		}
		
		messagesEl.appendChild(div);
		
		const messagesContainer = document.querySelector('.messages-container');
		if (messagesContainer) {
			requestAnimationFrame(() => {
				messagesContainer.scrollTop = messagesContainer.scrollHeight;
			});
		}
		
		if (!opts.skipConversation) {
			conversation.push({ who, text, at: new Date().toISOString() });
			upsertSessionFromConversation();
		}
		if (!opts.skipSync) syncChatUI();
	}
	
	// Expose addMsg globally for welcome page
	window.addMsg = addMsg;
	function headers(){ return { 'Content-Type':'application/json' }; }

	// Navigation is handled by global function above

	async function fetchProfile(){
		// Profile functionality will be added when authentication is enabled
	}

	function wireEmptyStateChips() {
		const wrap = document.getElementById('chatEmptyChips');
		if (!wrap) return;
		wrap.querySelectorAll('.suggestion-chip').forEach(btn => {
			btn.addEventListener('click', () => {
				const prompt = btn.getAttribute('data-prompt') || btn.textContent;
				sendSuggestionPrompt(prompt);
			});
		});
	}


	async function sendChat(msg){
		setChatLoading(true);
		syncChatUI();
		if (typingEl) typingEl.classList.remove('hidden');
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
				if (typingEl) typingEl.classList.add('hidden');
				setChatLoading(false);
				addMsg(errorData.error || 'AI error. Please try again.', 'ai', 'warning');
				return;
			}
			const data = await res.json();
			if (typingEl) typingEl.classList.add('hidden');
			setChatLoading(false);
			if (!data.success){ addMsg(data.error||'AI error. Please try again.', 'ai', 'warning'); return; }
			const text = data.data?.message || '';
			addMsg(text || 'No response', 'ai');
			await fetchProfile();
		}catch(e){
			if (typingEl) typingEl.classList.add('hidden');
			setChatLoading(false);
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

	// College tools: chat suggestion bar is not updated from here (strict chat-only rules).
	function updateSuggestions(_context) {}
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

	function escapeAttr(s) { return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }
	function escapeHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

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

		// Current question (full text including code blocks)
		const question = quizData.questions[currentQuestion];
		const options = Array.isArray(question.options) ? question.options : [];
		const questionHtml = formatQuestionHtml(question.question || '');
		const questionCard = document.createElement('div');
		questionCard.className = 'quiz-question';
		questionCard.innerHTML = `
			<h4>Q${currentQuestion + 1}.</h4>
			<div class="quiz-question-body">${questionHtml}</div>
			<div class="quiz-options">
				${options.map((option, idx) => `
					<label class="quiz-option">
						<input type="radio" name="currentQuestion" value="${escapeAttr(option)}" ${userAnswers[currentQuestion] === option ? 'checked' : ''}>
						<span class="option-text">${String.fromCharCode(65 + idx)}) ${escapeHtml(option)}</span>
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
			<button id="nextBtn" class="btn primary">
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

			// Parse the quiz data (API returns data: { questions: "..." } or data as string)
			const raw = (data.data && data.data.questions) ?? data.data ?? data.response ?? '';
			const text = typeof raw === 'string' ? raw : (raw && typeof raw.questions === 'string' ? raw.questions : '');
			quizData = parseQuizText(text || '', subject, topic);
			
			if (!quizData || !quizData.questions || quizData.questions.length === 0) {
				setStatus('Could not parse quiz questions');
				return;
			}

			// Initialize quiz state
			currentQuestion = 0;
			userAnswers = new Array(quizData.questions.length).fill(null);
			quizStartTime = Date.now();
			timeRemaining = 0; // elapsed seconds (count up from 0)
			
			// Start timer (count up from 0 until quiz finish)
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
		// Ensure we have a string (API may return object or undefined)
		if (typeof text !== 'string') text = '';
		const questions = [];
		const lines = text.split('\n');
		
		let currentQ = null;
		
		for (let i = 0; i < lines.length; i++) {
			const rawLine = lines[i];
			const line = rawLine.trim();
			if (!line) {
				if (currentQ && currentQ.question) currentQ.question += '\n';
				continue;
			}
			
			// Question detection (number or "Question N")
			if (/^\d+[\.\)]\s/.test(line) || /^Question\s+\d+/i.test(line)) {
				if (currentQ && currentQ.options.length >= 2) {
					questions.push(currentQ);
				}
				const qText = line.replace(/^\d+[\.\)]\s/, '').replace(/^Question\s+\d+[\.\):]\s*/i, '').trim();
				currentQ = {
					question: qText,
					options: [],
					correct: null,
					explanation: ''
				};
			}
			// Options detection (A) B) C) D) or A. B. with optional space)
			else if (currentQ && /^[A-Da-d][\.\)]\s*/.test(line)) {
				currentQ.options.push(line.replace(/^[A-Da-d][\.\)]\s*/i, '').trim());
			}
			// Correct answer detection
			else if (currentQ && (/^Correct\s+Answer/i.test(line) || /^Answer\s*:/i.test(line))) {
				currentQ.correct = line.split(':').slice(1).join(':').trim();
			}
			// Explanation detection
			else if (currentQ && /^Explanation/i.test(line)) {
				currentQ.explanation = line.split(':').slice(1).join(':').trim();
			}
			// Any other line before options: append to question (e.g. code blocks, "following code", etc.)
			else if (currentQ && currentQ.options.length === 0) {
				currentQ.question += (currentQ.question ? '\n' : '') + rawLine;
			}
		}
		
		if (currentQ && currentQ.options.length >= 2) {
			questions.push(currentQ);
		}
		
		return {
			subject,
			topic,
			questions: questions.slice(0, 10) // Limit to 10 questions max
		};
	}

	// Render question text with code blocks (```...```) as <pre><code>
	function formatQuestionHtml(questionText) {
		if (typeof questionText !== 'string') return '';
		const escapeHtml = (str) => {
			const div = document.createElement('div');
			div.textContent = str;
			return div.innerHTML;
		};
		let out = '';
		const parts = questionText.split(/(```[\s\S]*?```)/g);
		for (const part of parts) {
			if (part.startsWith('```') && part.endsWith('```')) {
				const code = part.slice(3, -3).trim();
				out += '<pre class="quiz-code-block"><code>' + escapeHtml(code) + '</code></pre>';
			} else {
				out += escapeHtml(part).replace(/\n/g, '<br>');
			}
		}
		return out;
	}

	function startQuizTimer() {
		quizTimer = setInterval(() => {
			if (!quizStartTime) return;
			timeRemaining = Math.floor((Date.now() - quizStartTime) / 1000);
			const minutes = Math.floor(timeRemaining / 60);
			const seconds = timeRemaining % 60;
			const timerEl = document.getElementById('quizTimer');
			if (timerEl) {
				timerEl.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
			}
		}, 1000);
	}

	async function submitQuiz(){
		if (!quizData || !quizData.questions || quizData.questions.length === 0) return;
		saveCurrentAnswer();
		
		if (quizTimer) {
			clearInterval(quizTimer);
			quizTimer = null;
		}
		
		const timeTaken = quizStartTime ? Math.round((Date.now() - quizStartTime) / 1000) : 0;
		const isCorrect = (answer, q, idx) => {
			const correct = (q.correct || '').trim();
			const opts = Array.isArray(q.options) ? q.options : [];
			const ans = (answer || '').trim();
			const correctNorm = correct.replace(/^[A-Da-d][\.\)]\s*/i, '').trim();
			if (ans === correct || ans === correctNorm) return true;
			const letterMatch = correct.match(/^([A-Da-d])[\.\)]?\s*/i);
			if (letterMatch && opts.length) {
				const letterIdx = letterMatch[1].toUpperCase().charCodeAt(0) - 65;
				if (letterIdx >= 0 && letterIdx < opts.length && opts[letterIdx]) {
					return ans === String(opts[letterIdx]).trim();
				}
			}
			return false;
		};
		const correctAnswers = userAnswers.filter((answer, idx) => isCorrect(answer, quizData.questions[idx], idx)).length;
		const marksPerQuestion = 2;
		const totalMarks = quizData.questions.length * marksPerQuestion;
		const scoreMarks = correctAnswers * marksPerQuestion;
		const scorePercent = Math.round((correctAnswers / quizData.questions.length) * 100);
		const timeStr = `${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, '0')}`;
		
		// Show results in right panel (quizContainer) so user sees it where the quiz was
		const container = document.getElementById('quizContainer');
		const wrongOnly = quizData.questions
			.map((q, idx) => ({ q, idx }))
			.filter(({ q, idx }) => !isCorrect(userAnswers[idx], q, idx));
		container.innerHTML = `
			<div class="quiz-result-content">
				<h3>🎉 Quiz Complete!</h3>
				<div class="quiz-stats">
					<div class="stat">
						<span class="stat-label">Score</span>
						<span class="stat-value ${scorePercent >= 70 ? 'good' : scorePercent >= 50 ? 'average' : 'poor'}">${scoreMarks} / ${totalMarks}</span>
						<span class="stat-note">(${correctAnswers} correct, ${marksPerQuestion} marks each)</span>
					</div>
					<div class="stat">
						<span class="stat-label">Time Taken</span>
						<span class="stat-value">${timeStr}</span>
					</div>
				</div>
				<div class="quiz-answers">
					<h4>Answer Key (wrong answers only)</h4>
					${wrongOnly.length === 0 ? '<p class="quiz-all-correct">All answers correct! 🎉</p>' : wrongOnly.map(({ q, idx }) => `
						<div class="answer-item incorrect">
							<strong>Q${idx + 1}:</strong> ${formatQuestionHtml(q.question || '')}
							<br><strong>Your Answer:</strong> ${escapeHtml(String(userAnswers[idx] || 'Not answered'))}
							<br><strong>Correct Answer:</strong> ${escapeHtml(String(q.correct || '—'))}
							${q.explanation ? `<br><strong>Explanation:</strong> ${escapeHtml(String(q.explanation))}` : ''}
						</div>
					`).join('')}
				</div>
			</div>
		`;
		document.getElementById('quizResult').classList.add('hidden');
		
		// Save to backend
		try {
			await fetch('/api/progress/quiz', { 
				method: 'POST', 
				headers: { 'Content-Type': 'application/json' }, 
				body: JSON.stringify({ 
					answers: userAnswers, 
					score: scorePercent, 
					time: timeTaken, 
					questions: quizData.questions,
					subject: quizData.subject,
					topic: quizData.topic
				}) 
			});
		} catch (e) { 
			console.error('Failed to save quiz:', e); 
		}
		
		setStatus(`Quiz completed! Score: ${scoreMarks}/${totalMarks} (${timeStr})`);
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

	// Events — chat
	const chatForm = document.getElementById('chatForm');
	const messageInput = document.getElementById('messageInput');
	if (chatForm) {
		chatForm.onsubmit = async (e) => {
			e.preventDefault();
			const input = document.getElementById('messageInput');
			const msg = input && input.value.trim();
			if (!msg || chatLoading) return;
			ensureActiveSession();
			addMsg(msg, 'user');
			input.value = '';
			await sendChat(msg);
		};
	}
	if (messageInput) {
		messageInput.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				if (chatForm && !chatLoading) chatForm.requestSubmit();
			}
		});
	}
	const newChatBtn = document.getElementById('newChatBtn');
	if (newChatBtn) newChatBtn.addEventListener('click', () => newChatSession());

	document.getElementById('fileInput').onchange = async (e)=>{ const f = e.target.files[0]; if (f) { ensureActiveSession(); addMsg(`Summarize file: ${f.name}`, 'user'); await summarizeFile(f); } };
	const exportBtnEl = document.getElementById('exportBtn');
	if (exportBtnEl) exportBtnEl.onclick = exportConversation;
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
	sessions = loadSessionsFromStorage();
	setupVoice();
	fetchProfile();
	wireEmptyStateChips();
	setupChatSidebarToggle();
	renderChatSidebar();
	syncChatUI();
	loadColleges().then(loadSubjects);
	setupSubjectSearch();
})();

// Navigation is handled by global function
console.log('Navigation system loaded!');
