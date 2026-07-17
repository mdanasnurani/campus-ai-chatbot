/**
 * AI Student Support Assistant - Main JavaScript v11.0 (Clean Blue/White/Black Theme)
 * Fully synchronized with chat.html and style.css for zero-error performance.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements (Synchronized exactly with chat.html IDs)
    const messagesContainer = document.getElementById('chat-messages');
    const welcomeScreen = document.getElementById('welcome-screen');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const newChatBtn = document.getElementById('new-chat-btn');
    const clearChatBtn = document.getElementById('clear-chat');
    const toggleSidebarBtn = document.getElementById('toggle-sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    // API Key Panel Elements
    const apiToggleBtn = document.getElementById('api-toggle');
    const apiConfigPanel = document.getElementById('api-config-panel');
    const geminiInput = document.getElementById('gemini-api-key');
    const saveApiBtn = document.getElementById('save-api-key');
    const clearApiBtn = document.getElementById('clear-api-key');
    const apiStatusBadge = document.querySelector('.api-status-badge');

    const STORAGE_KEY = 'campus_chatbot_history_v11';
    const THEME_KEY = 'campus_chatbot_theme_v11';

    // ================= 1. Theme Management (Dark / Light Mode) =================
    function initTheme() {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme === 'light') {
            document.body.classList.remove('dark-mode');
        } else {
            document.body.classList.add('dark-mode');
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
        });
    }

    // ================= 2. API Key Configuration & Status =================
    function updateApiStatusDisplay() {
        if (!apiStatusBadge) return;
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey && (savedKey.startsWith('AIza') || savedKey.startsWith('AQ.') || savedKey.length > 20)) {
            apiStatusBadge.textContent = "⚡ Gemini API Ready";
            apiStatusBadge.style.color = "#38BDF8";
        } else {
            apiStatusBadge.textContent = "⚡ Hybrid Active";
            apiStatusBadge.style.color = "#38BDF8";
        }
    }

    if (apiToggleBtn && apiConfigPanel) {
        apiToggleBtn.addEventListener('click', () => {
            const isHidden = apiConfigPanel.style.display === 'none' || !apiConfigPanel.style.display;
            if (isHidden) {
                apiConfigPanel.style.display = 'flex';
                if (geminiInput) {
                    geminiInput.value = localStorage.getItem('gemini_api_key') || '';
                    geminiInput.focus();
                }
            } else {
                apiConfigPanel.style.display = 'none';
            }
        });
    }

    if (saveApiBtn && geminiInput) {
        saveApiBtn.addEventListener('click', () => {
            const val = geminiInput.value.trim();
            if (val) {
                localStorage.setItem('gemini_api_key', val);
            } else {
                localStorage.removeItem('gemini_api_key');
            }
            updateApiStatusDisplay();
            if (apiConfigPanel) apiConfigPanel.style.display = 'none';
        });
    }

    if (clearApiBtn && geminiInput) {
        clearApiBtn.addEventListener('click', () => {
            geminiInput.value = '';
            localStorage.removeItem('gemini_api_key');
            updateApiStatusDisplay();
            if (apiConfigPanel) apiConfigPanel.style.display = 'none';
        });
    }

    updateApiStatusDisplay();

    // ================= 3. Chat History & Storage Management (Multi-Session Recents v18.0) =================
    const SESSIONS_LIST_KEY = 'campus_ai_sessions_v18';
    const CURRENT_SESSION_ID_KEY = 'campus_ai_active_id_v18';

    function scrollToBottom() {
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    function formatCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours}:${minutes} ${ampm}`;
    }

    function initDefaultSessionsIfEmpty() {
        let sessions = JSON.parse(localStorage.getItem(SESSIONS_LIST_KEY) || 'null');
        if (!sessions || sessions.length === 0) {
            const sample1Id = 'sess_sample_1';
            const sample2Id = 'sess_sample_2';
            const sample3Id = 'sess_sample_3';
            sessions = [
                { id: sample1Id, title: 'Explain Python OOP & Code', timestamp: Date.now() - 3600000 },
                { id: sample2Id, title: 'Semester Fee Breakdown', timestamp: Date.now() - 7200000 },
                { id: sample3Id, title: 'Calculus Derivative Step-by-Step', timestamp: Date.now() - 10800000 }
            ];
            localStorage.setItem(SESSIONS_LIST_KEY, JSON.stringify(sessions));

            // Pre-seed sample session messages
            localStorage.setItem('campus_ai_msgs_' + sample1Id, JSON.stringify([
                { sender: 'user', text: 'Explain Object-Oriented Programming (OOP) in Python with clean examples.', timestamp: '10:15 AM' },
                { sender: 'bot', text: '### Object-Oriented Programming (OOP) in Python\n\nOOP organizes code into **Classes** and **Objects**.\n\n#### 1. Core Concepts:\n* **Class**: A blueprint or template.\n* **Object**: An instance of a class.\n* **Encapsulation**: Hiding internal details using attributes.\n* **Inheritance**: Creating child classes that inherit behaviors.\n\n```python\nclass Student:\n    def __init__(self, name, branch):\n        self.name = name\n        self.branch = branch\n\n    def get_info(self):\n        return f"{self.name} ({self.branch})"\n\ns1 = Student("Rohit Kumar", "Computer Science")\nprint(s1.get_info())\n```', timestamp: '10:15 AM' }
            ]));

            localStorage.setItem('campus_ai_msgs_' + sample2Id, JSON.stringify([
                { sender: 'user', text: 'What is the semester examination schedule and B.Tech fee structure?', timestamp: '09:30 AM' },
                { sender: 'bot', text: '### B.Tech Semester Fee & Examination Schedule\n\n#### 📅 Academic Schedule:\n* **Mid-Semester Exams**: October 12 – October 18\n* **End-Semester Exams**: December 04 – December 20\n\n#### 💳 Fee Structure Summary:\n| Category | Amount (INR) | Due Date |\n| :--- | :--- | :--- |\n| Academic Tuition | ₹65,000 | Nov 15 |\n| Laboratory & Library | ₹8,500 | Nov 15 |\n| Campus Development | ₹4,000 | Nov 15 |\n\n*Note: Scholarships are automatically credited to student profile accounts before the deadline.*', timestamp: '09:31 AM' }
            ]));

            localStorage.setItem('campus_ai_msgs_' + sample3Id, JSON.stringify([
                { sender: 'user', text: 'How do I solve the derivative of x^2 * sin(x) step-by-step?', timestamp: '08:10 AM' },
                { sender: 'bot', text: '### Step-by-Step Derivative Solution\n\nTo differentiate $f(x) = x^2 \\sin(x)$, we use the **Product Rule**:\n$$\\frac{d}{dx}[u \\cdot v] = u\'v + uv\'$$\n\n#### Steps:\n1. Let $u = x^2 \\implies u\' = 2x$\n2. Let $v = \\sin(x) \\implies v\' = \\cos(x)$\n3. Substitute into formula:\n$$f\'(x) = (2x)\\sin(x) + x^2\\cos(x)$$\n\n**Final Result:** `2x*sin(x) + x^2*cos(x)`', timestamp: '08:11 AM' }
            ]));

            if (!localStorage.getItem(CURRENT_SESSION_ID_KEY)) {
                localStorage.setItem(CURRENT_SESSION_ID_KEY, sample1Id);
            }
        }
    }

    function renderRecentsList() {
        const listContainer = document.querySelector('.chat-sessions-list');
        if (!listContainer) return;

        initDefaultSessionsIfEmpty();
        const sessions = JSON.parse(localStorage.getItem(SESSIONS_LIST_KEY) || '[]');
        const activeId = localStorage.getItem(CURRENT_SESSION_ID_KEY);

        listContainer.innerHTML = '';
        sessions.forEach(sess => {
            const item = document.createElement('div');
            item.className = `chat-session-item ${sess.id === activeId ? 'active' : ''}`;
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.alignItems = 'center';
            item.title = sess.title;
            item.innerHTML = `
                <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;">${sess.title}</span>
                <button class="delete-session-btn" title="Delete conversation" style="background: none; border: none; color: #6B7280; cursor: pointer; padding: 2px 4px; display: flex; align-items: center; border-radius: 4px; transition: color 0.2s;" type="button">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            `;
            item.addEventListener('click', (e) => {
                if (e.target.closest('.delete-session-btn')) return;
                switchChatSession(sess.id);
            });

            const delBtn = item.querySelector('.delete-session-btn');
            if (delBtn) {
                delBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteChatSession(sess.id);
                });
                delBtn.addEventListener('mouseover', () => delBtn.style.color = '#EF4444');
                delBtn.addEventListener('mouseout', () => delBtn.style.color = '#6B7280');
            }

            listContainer.appendChild(item);
        });
    }

    function deleteChatSession(sessionId) {
        if (!confirm("Delete this conversation?")) return;
        let sessions = JSON.parse(localStorage.getItem(SESSIONS_LIST_KEY) || '[]');
        sessions = sessions.filter(s => s.id !== sessionId);
        localStorage.setItem(SESSIONS_LIST_KEY, JSON.stringify(sessions));
        localStorage.removeItem('campus_ai_msgs_' + sessionId);

        const activeId = localStorage.getItem(CURRENT_SESSION_ID_KEY);
        if (activeId === sessionId) {
            if (sessions.length > 0) {
                switchChatSession(sessions[0].id);
            } else {
                startNewChatSession();
            }
        } else {
            renderRecentsList();
        }
    }

    function clearAllChatSessions() {
        if (confirm("Are you sure you want to delete ALL saved chat history?")) {
            let sessions = JSON.parse(localStorage.getItem(SESSIONS_LIST_KEY) || '[]');
            sessions.forEach(s => localStorage.removeItem('campus_ai_msgs_' + s.id));
            localStorage.removeItem(SESSIONS_LIST_KEY);
            localStorage.removeItem(CURRENT_SESSION_ID_KEY);
            startNewChatSession();
        }
    }

    function switchChatSession(sessionId) {
        localStorage.setItem(CURRENT_SESSION_ID_KEY, sessionId);
        renderRecentsList();
        loadSessionMessages(sessionId);
        if (window.innerWidth <= 800 && sidebar) {
            sidebar.classList.remove('open');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        }
    }

    function loadSessionMessages(sessionId) {
        if (!messagesContainer) return;
        let innerContainer = messagesContainer.querySelector('.chat-messages-inner-container');
        if (innerContainer) innerContainer.innerHTML = '';

        const msgsJson = localStorage.getItem('campus_ai_msgs_' + sessionId);
        if (!msgsJson || JSON.parse(msgsJson).length === 0) {
            if (welcomeScreen) welcomeScreen.style.display = 'block';
            return;
        }

        if (welcomeScreen) welcomeScreen.style.display = 'none';
        const msgs = JSON.parse(msgsJson);
        msgs.forEach(item => {
            appendMessageToDOM(item.sender, item.text, item.timestamp, item.intent, false, false);
        });
        scrollToBottom();
    }

    function loadChatHistory() {
        initDefaultSessionsIfEmpty();
        renderRecentsList();
        const activeId = localStorage.getItem(CURRENT_SESSION_ID_KEY);
        if (activeId) {
            loadSessionMessages(activeId);
        } else {
            if (welcomeScreen) welcomeScreen.style.display = 'block';
        }
    }

    function saveToHistory(sender, text, timestamp, intent = null) {
        try {
            let activeId = localStorage.getItem(CURRENT_SESSION_ID_KEY);
            let sessions = JSON.parse(localStorage.getItem(SESSIONS_LIST_KEY) || '[]');

            // If no active session exists when user types, create a new session
            if (!activeId) {
                activeId = 'sess_' + Date.now();
                const cleanWords = text.replace(/[^a-zA-Z0-9 ?]/g, '').trim().split(/\s+/).slice(0, 5).join(' ');
                const newTitle = cleanWords ? cleanWords + (cleanWords.length < text.length ? '...' : '') : 'New Chat Session';
                sessions.unshift({ id: activeId, title: newTitle, timestamp: Date.now() });
                localStorage.setItem(SESSIONS_LIST_KEY, JSON.stringify(sessions));
                localStorage.setItem(CURRENT_SESSION_ID_KEY, activeId);
                renderRecentsList();
            }

            let msgs = JSON.parse(localStorage.getItem('campus_ai_msgs_' + activeId) || '[]');
            msgs.push({ sender, text, timestamp, intent });
            if (msgs.length > 200) msgs = msgs.slice(-200);
            localStorage.setItem('campus_ai_msgs_' + activeId, JSON.stringify(msgs));

            // Move this session to top of Recents list if it isn't already
            const sessIdx = sessions.findIndex(s => s.id === activeId);
            if (sessIdx > 0) {
                const [moved] = sessions.splice(sessIdx, 1);
                moved.timestamp = Date.now();
                sessions.unshift(moved);
                localStorage.setItem(SESSIONS_LIST_KEY, JSON.stringify(sessions));
                renderRecentsList();
            } else if (sessIdx === -1 && activeId) {
                const cleanWords = text.replace(/[^a-zA-Z0-9 ?]/g, '').trim().split(/\s+/).slice(0, 5).join(' ');
                const newTitle = cleanWords ? cleanWords + (cleanWords.length < text.length ? '...' : '') : 'New Chat Session';
                sessions.unshift({ id: activeId, title: newTitle, timestamp: Date.now() });
                localStorage.setItem(SESSIONS_LIST_KEY, JSON.stringify(sessions));
                renderRecentsList();
            }
        } catch (e) {
            console.error("Failed to save chat history to Recents:", e);
        }
    }

    function startNewChatSession() {
        localStorage.removeItem(CURRENT_SESSION_ID_KEY);
        if (messagesContainer) {
            let innerContainer = messagesContainer.querySelector('.chat-messages-inner-container');
            if (innerContainer) innerContainer.innerHTML = '';
        }
        if (welcomeScreen) welcomeScreen.style.display = 'block';
        renderRecentsList();
        if (userInput) userInput.focus();
        if (window.innerWidth <= 800 && sidebar) {
            sidebar.classList.remove('open');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        }
    }

    if (newChatBtn) newChatBtn.addEventListener('click', startNewChatSession);
    if (clearChatBtn) clearChatBtn.addEventListener('click', clearAllChatSessions);
    const deleteAllBtn = document.getElementById('delete-all-sessions-btn');
    if (deleteAllBtn) deleteAllBtn.addEventListener('click', clearAllChatSessions);

    // ================= 4. DOM Message Appender (Matches style.css EXACTLY) =================
    function appendMessageToDOM(sender, text, timestamp, intent = null, animate = true, saveToStorage = false) {
        if (!messagesContainer) return;
        if (welcomeScreen) welcomeScreen.style.display = 'none';

        const row = document.createElement('div');
        row.className = `message-row ${sender}`;
        if (!animate) {
            row.style.animation = 'none';
        }

        const aiDPHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"/><path d="M19 2L19.8 4.2L22 5L19.8 5.8L19 8L18.2 5.8L16 5L18.2 4.2L19 2Z" opacity="0.65"/><path d="M5 16L5.6 17.4L7 18L5.6 18.6L5 20L4.4 18.6L3 18L4.4 17.4L5 16Z" opacity="0.65"/></svg>';

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'user' ? '👤' : aiDPHTML;

        const content = document.createElement('div');
        content.className = 'message-content';

        if (sender === 'user') {
            window.lastUserMessageText = text;
        }

        let formattedText = text;
        if (sender === 'bot' && window.marked && typeof window.marked.parse === 'function') {
            try {
                formattedText = window.marked.parse(text);
            } catch (e) {
                formattedText = text.replace(/\n/g, '<br>');
            }
        } else {
            formattedText = text.replace(/\n/g, '<br>');
        }
        
        let headerHtml = '';
        if (sender === 'bot' && intent && intent !== 'error') {
            headerHtml = `<div class="message-header-info">Campus AI Assistant &bull; ${timestamp}</div>`;
        } else if (sender === 'user') {
            headerHtml = `<div class="message-header-info">You &bull; ${timestamp}</div>`;
        }

        let actionBarHtml = '';
        if (sender === 'bot') {
            actionBarHtml = `
                <div class="message-actions-bar">
                    <button class="action-icon-btn copy-msg-btn" title="Copy response" type="button">
                        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                    <button class="action-icon-btn like-msg-btn" title="Good response" type="button">
                        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                    </button>
                    <button class="action-icon-btn dislike-msg-btn" title="Bad response" type="button">
                        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>
                    </button>
                    <button class="action-icon-btn share-msg-btn" title="Share response" type="button">
                        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                    </button>
                    <button class="action-icon-btn regenerate-msg-btn" title="Regenerate response" type="button">
                        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                    </button>
                    <button class="action-icon-btn more-msg-btn" title="More options" type="button">
                        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                    </button>
                </div>
            `;
        }

        content.innerHTML = `<div class="message-body">${formattedText}</div>` + actionBarHtml;

        if (sender === 'bot') {
            const copyBtn = content.querySelector('.copy-msg-btn');
            if (copyBtn) {
                copyBtn.addEventListener('click', () => {
                    navigator.clipboard.writeText(text);
                    copyBtn.classList.add('copied');
                    setTimeout(() => copyBtn.classList.remove('copied'), 2000);
                });
            }
            const likeBtn = content.querySelector('.like-msg-btn');
            const dislikeBtn = content.querySelector('.dislike-msg-btn');
            if (likeBtn) likeBtn.addEventListener('click', () => { likeBtn.style.color = '#10B981'; });
            if (dislikeBtn) dislikeBtn.addEventListener('click', () => { dislikeBtn.style.color = '#EF4444'; });
            const regenBtn = content.querySelector('.regenerate-msg-btn');
            if (regenBtn && window.lastUserMessageText) {
                regenBtn.addEventListener('click', () => sendMessage(window.lastUserMessageText));
            }
        }

        row.appendChild(avatar);
        row.appendChild(content);

        let innerContainer = messagesContainer.querySelector('.chat-messages-inner-container');
        if (!innerContainer) {
            innerContainer = document.createElement('div');
            innerContainer.className = 'chat-messages-inner-container';
            while (messagesContainer.firstChild) {
                innerContainer.appendChild(messagesContainer.firstChild);
            }
            messagesContainer.appendChild(innerContainer);
        }

        innerContainer.appendChild(row);
        scrollToBottom();
    }

    // ================= 5. Typing Indicator =================
    function showTypingIndicator() {
        if (!messagesContainer) return;
        if (welcomeScreen) welcomeScreen.style.display = 'none';

        const aiDPHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"/><path d="M19 2L19.8 4.2L22 5L19.8 5.8L19 8L18.2 5.8L16 5L18.2 4.2L19 2Z" opacity="0.65"/><path d="M5 16L5.6 17.4L7 18L5.6 18.6L5 20L4.4 18.6L3 18L4.4 17.4L5 16Z" opacity="0.65"/></svg>';
        const row = document.createElement('div');
        row.className = 'message-row bot';
        row.id = 'typing-indicator-row';

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = aiDPHTML;

        const content = document.createElement('div');
        content.className = 'message-content';
        content.style.padding = '1rem 1.4rem';
        content.innerHTML = `
            <div style="display: flex; gap: 6px; align-items: center; height: 20px;">
                <span style="width: 8px; height: 8px; background: #38BDF8; border-radius: 50%; animation: typingDot 1.4s infinite ease-in-out both;"></span>
                <span style="width: 8px; height: 8px; background: #38BDF8; border-radius: 50%; animation: typingDot 1.4s infinite ease-in-out both; animation-delay: 0.2s;"></span>
                <span style="width: 8px; height: 8px; background: #38BDF8; border-radius: 50%; animation: typingDot 1.4s infinite ease-in-out both; animation-delay: 0.4s;"></span>
            </div>
            <style>
            @keyframes typingDot {
                0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
                40% { transform: scale(1.1); opacity: 1; }
            }
            </style>
        `;

        row.appendChild(avatar);
        row.appendChild(content);

        let innerContainer = messagesContainer.querySelector('.chat-messages-inner-container');
        if (!innerContainer) {
            innerContainer = document.createElement('div');
            innerContainer.className = 'chat-messages-inner-container';
            while (messagesContainer.firstChild) {
                innerContainer.appendChild(messagesContainer.firstChild);
            }
            messagesContainer.appendChild(innerContainer);
        }

        innerContainer.appendChild(row);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typingRow = document.getElementById('typing-indicator-row');
        if (typingRow) {
            typingRow.remove();
        }
    }

    // ================= 6. Message Sending & API Integration =================
    async function sendMessage(queryText = null) {
        if (!userInput) return;
        const text = queryText || userInput.value.trim();
        if (!text) return;

        userInput.value = '';
        userInput.style.height = 'auto';
        if (sendBtn) sendBtn.disabled = true;

        const timestamp = formatCurrentTime();
        appendMessageToDOM('user', text, timestamp);
        saveToHistory('user', text, timestamp);

        showTypingIndicator();

        try {
            const storedGeminiKey = localStorage.getItem('gemini_api_key') || '';
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: text, mode: 'hybrid', api_key: storedGeminiKey })
            });

            const data = await response.json();

            setTimeout(() => {
                removeTypingIndicator();
                if (sendBtn) sendBtn.disabled = false;

                if (response.ok && data.status === 'success') {
                    const botReply = data.response;
                    const botIntent = data.intent || 'education_inquiry';
                    const botTime = data.timestamp || formatCurrentTime();

                    appendMessageToDOM('bot', botReply, botTime, botIntent);
                    saveToHistory('bot', botReply, botTime, botIntent);
                } else {
                    const errorMsg = data.message || "I encountered an issue generating a response. Please try again.";
                    appendMessageToDOM('bot', errorMsg, formatCurrentTime(), 'error');
                }
                userInput.focus();
            }, 300);

        } catch (error) {
            console.error("API request failed:", error);
            removeTypingIndicator();
            if (sendBtn) sendBtn.disabled = false;
            appendMessageToDOM('bot', "Network error: Could not connect to the local server (`app.py`). Please ensure the backend is running.", formatCurrentTime(), 'error');
            userInput.focus();
        }
    }

    // Input Event Listeners
    if (sendBtn) sendBtn.addEventListener('click', () => sendMessage());

    const attachmentBtn = document.getElementById('attachment-btn');
    const voiceBtn = document.getElementById('voice-btn');
    if (attachmentBtn) attachmentBtn.addEventListener('click', () => {
        const userInputBox = document.getElementById('user-input');
        if (userInputBox) userInputBox.placeholder = "📎 [File Attachment Simulation Ready] Type your message...";
    });
    if (voiceBtn) voiceBtn.addEventListener('click', () => {
        const userInputBox = document.getElementById('user-input');
        if (userInputBox) userInputBox.placeholder = "🎙️ [Voice Input Simulation Active] Listening to query...";
    });

    if (userInput) {
        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        userInput.addEventListener('input', () => {
            if (sendBtn) sendBtn.disabled = userInput.value.trim() === '';
            userInput.style.height = 'auto';
            userInput.style.height = `${Math.min(userInput.scrollHeight, 160)}px`;
        });
    }

    // ================= 7. Welcome Screen Quick Topic Cards (`.topic-card`) =================
    function setupTopicCardListeners() {
        const topicCards = document.querySelectorAll('.topic-card');
        topicCards.forEach(card => {
            card.addEventListener('click', () => {
                const query = card.getAttribute('data-query');
                if (query) {
                    if (window.innerWidth <= 768) {
                        closeMobileSidebar();
                    }
                    sendMessage(query);
                }
            });
        });
    }

    // ================= 8. Mobile Sidebar Navigation =================
    function openMobileSidebar() {
        if (sidebar) sidebar.classList.add('open');
        if (sidebarOverlay) sidebarOverlay.classList.add('active');
    }

    function closeMobileSidebar() {
        if (sidebar) sidebar.classList.remove('open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    }

    if (toggleSidebarBtn) toggleSidebarBtn.addEventListener('click', openMobileSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeMobileSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeMobileSidebar);

    // Initialize Application
    initTheme();
    loadChatHistory();
    setupTopicCardListeners();
    if (userInput) userInput.focus();
});
