const STORE_KEY = 'janseva_setu_complaints';

// Initial Mock Data to ensure the dashboard always has content
if (!localStorage.getItem(STORE_KEY)) {
    localStorage.setItem(STORE_KEY, JSON.stringify([
        { id: 'C-1001', desc: 'Street light near Sector 4 is completely non-functional.', location: 'Sector 4 Main Road', category: 'Electricity Board', officerName: 'Amit Patel', officerPhone: '+91-9988776655', status: 'Pending', date: new Date(Date.now() - 86400000).toISOString() },
        { id: 'C-1002', desc: 'Large pile of garbage has not been collected for a week.', location: 'Block B Market', category: 'Municipal Corporation (Sanitation)', officerName: 'Priya Sharma', officerPhone: '+91-9123456780', status: 'Resolved', date: new Date(Date.now() - 172800000).toISOString() }
    ]));
}

const getComplaints = () => JSON.parse(localStorage.getItem(STORE_KEY)) || [];
const saveComplaints = (data) => localStorage.setItem(STORE_KEY, JSON.stringify(data));

const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// --- Page: Citizen Portal (index.html) ---
const reportForm = document.getElementById('reportForm');
if (reportForm) {
    const citizenFeed = document.getElementById('citizenFeed');
    const submitBtn = document.getElementById('submitBtn');
    const loadingState = document.getElementById('aiProcessing');

    // Render feed
    const renderCitizenFeed = () => {
        const complaints = getComplaints().reverse();
        citizenFeed.innerHTML = complaints.map(c => `
            <div class="feed-item">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                    <span class="badge ai" style="background:var(--primary); color:white; padding:4px 8px; border-radius:4px; font-size:12px;"><ion-icon name="pricetag-outline"></ion-icon> ${c.category}</span>
                    <span class="badge ${c.status === 'Resolved' ? 'resolved' : 'pending'}" style="padding:4px 8px; border-radius:4px; font-size:12px; font-weight:bold; background:${c.status === 'Resolved' ? 'var(--success)' : 'var(--warning)'}; color:white;">${c.status}</span>
                </div>
                <h4 style="margin: 0; color: #111;">${c.id}</h4>
                <p style="font-size: 0.9rem; margin-top: 0.5rem; color: #555;">${c.desc}</p>
                <div style="margin-top: 0.5rem; display:flex; justify-content:space-between; align-items:center;">
                    <small style="color: #888;"><ion-icon name="location-outline"></ion-icon> ${c.location}</small>
                    <small style="color: #888;"><ion-icon name="time-outline"></ion-icon> ${formatDate(c.date)}</small>
                </div>
                <div style="margin-top:0.8rem; text-align:right;">
                    <button class="btn-small btn-secondary" style="color:var(--danger); border-color:var(--danger); background:transparent; padding:4px 8px; cursor:pointer;" onclick="deleteComplaint('${c.id}')"><ion-icon name="trash-outline"></ion-icon> Delete Record</button>
                </div>
            </div>
        `).join('');
    };

    window.deleteComplaint = (id) => {
        if(confirm("Are you sure you want to permanently delete this complaint record to protect your privacy?")) {
            const complaints = getComplaints().filter(c => c.id !== id);
            saveComplaints(complaints);
            renderCitizenFeed();
        }
    };

    renderCitizenFeed();

    // AI Categorization Simulation (Indian Setup)
    const determineCategory = (text) => {
        text = text.toLowerCase();
        if (text.includes('water') || text.includes('pipe') || text.includes('leak')) return { category: 'Jal Board (Water supply)', officer: 'Ramesh Singh', phone: '+91-9876543210' };
        if (text.includes('garbage') || text.includes('waste') || text.includes('smell')) return { category: 'Municipal Corporation (Sanitation)', officer: 'Priya Sharma', phone: '+91-9123456780' };
        if (text.includes('light') || text.includes('electric') || text.includes('wire')) return { category: 'Electricity Board', officer: 'Amit Patel', phone: '+91-9988776655' };
        if (text.includes('road') || text.includes('pothole') || text.includes('street')) return { category: 'PWD (Public Works Dept)', officer: 'Vikram Reddy', phone: '+91-9876543211' };
        return { category: 'General Administration', officer: 'Nodal Officer', phone: '1800-XXX-XXXX' }; // Fallback
    };

    reportForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const desc = document.getElementById('issueDesc').value;
        const location = document.getElementById('location').value;
        
        if(!location || location.trim() === "") {
            alert("Error: Location is mandatory for the registration of a civic complaint.");
            return;
        }

        submitBtn.classList.add('hidden');
        loadingState.classList.remove('hidden');

        // Simulate AI Processing & Network Delay
        setTimeout(() => {
            const aiData = determineCategory(desc);
            const newComplaint = {
                id: 'C-' + Math.floor(1000 + Math.random() * 9000),
                desc,
                location,
                category: aiData.category,
                officerName: aiData.officer,
                officerPhone: aiData.phone,
                status: 'Pending',
                date: new Date().toISOString()
            };

            const complaints = getComplaints();
            complaints.push(newComplaint);
            saveComplaints(complaints);

            // Reset UI
            reportForm.reset();
            submitBtn.classList.remove('hidden');
            loadingState.classList.add('hidden');
            renderCitizenFeed();

            alert(`Success! AI categorized this under [${aiData.category}]. It has been assigned to Officer ${aiData.officer}.`);
        }, 2000);
    });

    // Voice & GPS button simulations
    document.querySelector('.voice-btn').addEventListener('click', () => {
        alert("Simulating Voice Command: 'Microphone permission accessed. Listening for complaint...'");
        document.getElementById('issueDesc').value = "There is a massive pothole in front of my house causing accidents.";
    });
    document.querySelector('.gps-btn').addEventListener('click', () => {
        document.getElementById('location').value = "Retrieving GPS coordinates... (Lat: 28.7041, Lng: 77.1025)";
        setTimeout(() => document.getElementById('location').value = "Downtown Main Street, Block B", 800);
    });
}

// --- Page: Official Dashboard (dashboard.html) ---
const dashboardFeed = document.getElementById('dashboardFeed');
if (dashboardFeed) {
    const renderDashboard = () => {
        const complaints = getComplaints().reverse();
        const filterEl = document.getElementById('statusFilter');
        const filter = filterEl ? filterEl.value : 'All';

        // Update Stats
        const totalEl = document.getElementById('totalCount');
        const resolvedEl = document.getElementById('resolvedCount');
        const pendingEl = document.getElementById('pendingCount');
        if(totalEl) totalEl.innerText = complaints.length;
        if(resolvedEl) resolvedEl.innerText = complaints.filter(c => c.status === 'Resolved').length;
        if(pendingEl) pendingEl.innerText = complaints.filter(c => c.status === 'Pending').length;

        // Filter and Render Table
        const filtered = filter === 'All' ? complaints : complaints.filter(c => c.status === filter);

        if (filtered.length === 0) {
            dashboardFeed.innerHTML = `<tr><td colspan="7" style="text-align:center;">No issues found.</td></tr>`;
            return;
        }

        dashboardFeed.innerHTML = filtered.map(c => `
            <tr>
                <td><strong>${c.id}</strong></td>
                <td><span class="badge ai" style="background:#e0f2fe; color:#0369a1; padding:4px 8px; border-radius:4px;"><ion-icon name="hardware-chip-outline"></ion-icon> ${c.category}</span></td>
                <td>${c.desc}</td>
                <td><ion-icon name="location-outline"></ion-icon> ${c.location}</td>
                <td>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <img src="https://ui-avatars.com/api/?name=${c.officerName || 'Officer'}&background=1D4E89&color=fff" style="width:30px; border-radius:50%;">
                        <div>
                            <strong>${c.officerName || 'Nodal Officer'}</strong><br>
                            <small>${c.officerPhone || 'Contact HQ'}</small>
                        </div>
                    </div>
                </td>
                <td><span class="badge" style="padding:4px 8px; border-radius:4px; font-weight:bold; background:${c.status === 'Resolved' ? 'var(--success)' : 'var(--warning)'}; color:white;">${c.status}</span></td>
                <td>
                    ${c.status === 'Pending'
                ? `<button class="btn-success" style="background:var(--success); color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;" onclick="resolveIssue('${c.id}')">Mark Resolved</button>`
                : `<span style="color:#8b949e">Closed</span>`}
                </td>
            </tr>
        `).join('');
    };

    const statusFilter = document.getElementById('statusFilter');
    if(statusFilter) statusFilter.addEventListener('change', renderDashboard);
    
    renderDashboard();

    // Global function so onclick can reach it
    window.resolveIssue = (id) => {
        const complaints = getComplaints();
        const issue = complaints.find(c => c.id === id);
        if (issue) {
            issue.status = 'Resolved';
            saveComplaints(complaints);
            renderDashboard();
            alert(`Issue ${id} marked as resolved. SMS notification sent to the citizen.`);
        }
    };
}

// --- JanMitra AI Assistant Logic ---
const janMitraWidget = document.getElementById('janMitraWidget');
if (janMitraWidget) {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatWindow = document.getElementById('chatWindow');
    const closeChat = document.getElementById('closeChat');
    const textInput = document.getElementById('textInput');
    const sendBtn = document.getElementById('sendBtn');
    const voiceInputBtn = document.getElementById('voiceInputBtn');
    const chatBody = document.getElementById('chatBody');
    const avatarRing = document.getElementById('avatarRing');

    // Toggle Chat
    const toggleChat = () => chatWindow.classList.toggle('hidden');
    chatbotToggle.addEventListener('click', toggleChat);
    closeChat.addEventListener('click', toggleChat);

    // TTS & Speech recognition setup
    let synth = window.speechSynthesis;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = SpeechRecognition ? new SpeechRecognition() : null;

    if (recognition) {
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            voiceInputBtn.classList.remove('recording');
            handleUserInput(transcript);
        };
        recognition.onerror = () => voiceInputBtn.classList.remove('recording');
        recognition.onend = () => voiceInputBtn.classList.remove('recording');
    }

    voiceInputBtn.addEventListener('click', () => {
        if (!recognition) {
            alert('Speech recognition not supported in this browser. Please type your message.');
            return;
        }
        voiceInputBtn.classList.add('recording');
        recognition.start();
    });

    const speak = (text) => {
        if (!synth) return;
        synth.cancel(); // Stop current speech
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.onstart = () => avatarRing.classList.add('speaking');
        utterance.onend = () => avatarRing.classList.remove('speaking');
        
        synth.speak(utterance);
    };

    const addMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.innerHTML = text;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    const handleUserInput = (text) => {
        if (!text.trim()) return;
        addMessage(text, 'user');
        textInput.value = '';

        setTimeout(() => {
            processBotReply(text.toLowerCase());
        }, 600);
    };

    let chatState = 'IDLE';

    const processBotReply = (input) => {
        let reply = "I didn't quite catch that. You can say 'report an issue' or 'check status'.";

        if (chatState === 'WAITING_LOCATION') {
            const loc = input;
            chatState = 'IDLE';
            
            const newComplaint = {
                id: 'C-' + Math.floor(1000 + Math.random() * 9000),
                desc: 'Voice/Chat Reported Issue',
                location: loc, // MUST be provided
                category: 'General Administration',
                officerName: 'Voice Assistant',
                officerPhone: '1800-AI-HELP',
                status: 'Pending',
                date: new Date().toISOString()
            };
            const complaints = getComplaints();
            complaints.push(newComplaint);
            saveComplaints(complaints);
            
            if (typeof renderCitizenFeed === 'function') renderCitizenFeed();
            if (typeof renderDashboard === 'function') renderDashboard();
            
            reply = `Thank you. I have registered your complaint at ${loc}. Your ID is ${newComplaint.id}. The concerned department has been notified.`;
        } else if (input.includes('report') || input.includes('pothole') || input.includes('light') || input.includes('water') || input.includes('garbage')) {
            reply = "I understand you want to report an issue. Can you please tell me the exact location or address of the problem?";
            chatState = 'WAITING_LOCATION';
        } else if (input.includes('status') || input.includes('track')) {
            reply = "To check your status, please type or say your Complaint ID.";
        } else if (input.startsWith('c-')) {
            const complaints = getComplaints();
            const found = complaints.find(c => c.id.toLowerCase() === input);
            if (found) {
                reply = `Complaint ${found.id} regarding '${found.category}' is currently **${found.status}**.`;
            } else {
                reply = "I couldn't find a complaint with that ID. Please check and try again.";
            }
        } else if (input.includes('hi') || input.includes('hello') || input.includes('namaste')) {
            reply = "Namaste! I am JanMitra, your AI helper. How can I assist you today? You can say 'report an issue' or 'check status'.";
        }

        addMessage(reply, 'bot');
        speak(reply.replace(/<[^>]*>?/gm, ''));
    };

    sendBtn.addEventListener('click', () => handleUserInput(textInput.value));
    textInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserInput(textInput.value);
    });
}
