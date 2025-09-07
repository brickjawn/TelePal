// TelePal - PWA Teleprompter with Script Storage
// Progressive Web App with offline capabilities and script management

class TelePalPWA {
    constructor() {
        this.currentView = 'editor';
        this.isPlaying = false;
        this.scrollSpeed = 1.0;
        this.currentPosition = 0;
        this.scrollInterval = null;
        this.settings = this.loadSettings();
        this.scripts = this.loadScripts();
        this.currentScriptId = null;
        this.deferredPrompt = null;
        this.isOnline = navigator.onLine;
        
        this.init();
    }

    async init() {
        this.bindEvents();
        this.updateWordCount();
        this.applySettings();
        this.loadCurrentScript();
        this.setupPWA();
        this.setupOfflineDetection();
        this.renderScriptsList();
        
        // Auto-save current script if enabled
        if (this.settings.autoSave) {
            this.startAutoSave();
        }
    }

    setupPWA() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                    this.updateServiceWorker(registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        }

        // Handle install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPrompt();
        });

        // Handle app installed
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.hideInstallPrompt();
        });
    }

    setupOfflineDetection() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateOnlineStatus();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateOnlineStatus();
        });

        this.updateOnlineStatus();
    }

    updateOnlineStatus() {
        const status = document.createElement('div');
        status.className = `pwa-status ${this.isOnline ? 'online' : 'offline'} show`;
        status.textContent = this.isOnline ? 'Online' : 'Offline';
        
        // Remove existing status
        const existing = document.querySelector('.pwa-status');
        if (existing) existing.remove();
        
        document.body.appendChild(status);
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            status.classList.remove('show');
            setTimeout(() => status.remove(), 300);
        }, 3000);
    }

    showInstallPrompt() {
        const prompt = document.getElementById('installPrompt');
        if (prompt) {
            prompt.classList.add('show');
        }
    }

    hideInstallPrompt() {
        const prompt = document.getElementById('installPrompt');
        if (prompt) {
            prompt.classList.remove('show');
        }
    }

    async installPWA() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            this.deferredPrompt = null;
            this.hideInstallPrompt();
        }
    }

    updateServiceWorker(registration) {
        if (registration.waiting) {
            // New service worker is waiting
            if (confirm('New version available! Reload to update?')) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
            }
        }

        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New content is available
                    if (confirm('New version available! Reload to update?')) {
                        window.location.reload();
                    }
                }
            });
        });
    }

    bindEvents() {
        // View switching
        document.getElementById('playBtn').addEventListener('click', () => this.startTeleprompter());
        document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());
        document.getElementById('scriptsBtn').addEventListener('click', () => this.switchView('scripts'));
        
        // Script management
        document.getElementById('newScriptBtn').addEventListener('click', () => this.newScript());
        document.getElementById('newScriptFromLibraryBtn').addEventListener('click', () => this.newScript());
        document.getElementById('newScriptModalBtn').addEventListener('click', () => this.newScript());
        
        // Settings
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettings());
        document.getElementById('closeSettingsBtn').addEventListener('click', () => this.closeSettings());
        
        // Scripts modal
        document.getElementById('closeScriptsBtn').addEventListener('click', () => this.closeScriptsModal());
        
        // Teleprompter controls
        document.getElementById('playPauseBtn').addEventListener('click', () => this.togglePlayPause());
        document.getElementById('stopBtn').addEventListener('click', () => this.stopTeleprompter());
        
        // Sliders
        document.getElementById('speedSlider').addEventListener('input', (e) => this.updateSpeed(e.target.value));
        document.getElementById('positionSlider').addEventListener('input', (e) => this.updatePosition(e.target.value));
        
        // Settings controls
        this.bindSettingsEvents();
        
        // Content changes
        document.getElementById('scriptContent').addEventListener('input', () => {
            this.updateWordCount();
            if (this.settings.autoSave) {
                this.saveCurrentScript();
            }
        });
        document.getElementById('scriptTitle').addEventListener('input', () => {
            if (this.settings.autoSave) {
                this.saveCurrentScript();
            }
        });
        
        // Save button
        document.getElementById('saveBtn').addEventListener('click', () => this.saveCurrentScript());
        
        // Import/Export
        document.getElementById('importScriptBtn').addEventListener('click', () => this.importScript());
        document.getElementById('exportAllBtn').addEventListener('click', () => this.exportAllScripts());
        
        // Install prompt
        document.getElementById('installBtn').addEventListener('click', () => this.installPWA());
        document.getElementById('dismissInstallBtn').addEventListener('click', () => this.hideInstallPrompt());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Modal click outside to close
        document.getElementById('settingsModal').addEventListener('click', (e) => {
            if (e.target.id === 'settingsModal') {
                this.closeSettings();
            }
        });
        
        document.getElementById('scriptsModal').addEventListener('click', (e) => {
            if (e.target.id === 'scriptsModal') {
                this.closeScriptsModal();
            }
        });
    }

    bindSettingsEvents() {
        const settings = [
            'fontSize', 'textColor', 'backgroundColor', 'lineSpacing', 
            'textAlign', 'mirrorHorizontal', 'highContrast', 'autoSave', 'offlineMode'
        ];
        
        settings.forEach(setting => {
            const element = document.getElementById(setting);
            if (element) {
                element.addEventListener('input', () => this.updateSetting(setting, element));
                element.addEventListener('change', () => this.updateSetting(setting, element));
            }
        });
    }

    newScript() {
        this.currentScriptId = null;
        document.getElementById('scriptTitle').value = '';
        document.getElementById('scriptContent').value = '';
        this.updateWordCount();
        this.updateScriptStatus('New script');
        this.switchView('editor');
        this.closeScriptsModal();
    }

    startTeleprompter() {
        const title = document.getElementById('scriptTitle').value.trim();
        const content = document.getElementById('scriptContent').value.trim();
        
        if (!title || !content) {
            alert('Please enter both a title and content for your script.');
            return;
        }
        
        // Save current script before starting teleprompter
        this.saveCurrentScript();
        
        this.switchView('teleprompter');
        document.getElementById('teleprompterText').textContent = content;
        this.currentPosition = 0;
        this.updatePosition(0);
    }

    switchView(view) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(view + 'View').classList.add('active');
        this.currentView = view;
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pauseTeleprompter();
        } else {
            this.playTeleprompter();
        }
    }

    playTeleprompter() {
        this.isPlaying = true;
        document.getElementById('playPauseBtn').innerHTML = '<span class="btn-icon">⏸</span>';
        
        // Use requestAnimationFrame for smoother scrolling
        this.scrollInterval = setInterval(() => {
            this.currentPosition += this.scrollSpeed * 0.05; // Reduced increment for smoother movement
            if (this.currentPosition >= 100) {
                this.currentPosition = 100;
                this.pauseTeleprompter();
            }
            this.updatePosition(this.currentPosition);
        }, 50); // Increased frequency for smoother animation
    }

    pauseTeleprompter() {
        this.isPlaying = false;
        document.getElementById('playPauseBtn').innerHTML = '<span class="btn-icon">▶</span>';
        clearInterval(this.scrollInterval);
    }

    stopTeleprompter() {
        this.pauseTeleprompter();
        this.currentPosition = 0;
        this.updatePosition(0);
    }

    updateSpeed(speed) {
        this.scrollSpeed = parseFloat(speed);
        document.getElementById('speedValue').textContent = speed + 'x';
    }

    updatePosition(position) {
        this.currentPosition = parseFloat(position);
        const slider = document.getElementById('positionSlider');
        const value = document.getElementById('positionValue');
        const progressBar = document.getElementById('progressBar');
        const textElement = document.getElementById('teleprompterText');
        
        slider.value = position;
        
        // Show whole numbers only for percentage display
        const wholeNumber = Math.round(position);
        value.textContent = wholeNumber + '%';
        progressBar.style.width = position + '%';
        
        // Smooth scrolling with CSS transitions
        if (textElement) {
            const container = textElement.parentElement;
            const maxScroll = textElement.scrollHeight - container.clientHeight;
            const scrollPosition = (position / 100) * maxScroll;
            
            // Use smooth scrolling
            container.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
        }
    }

    openSettings() {
        document.getElementById('settingsModal').classList.add('active');
    }

    closeSettings() {
        document.getElementById('settingsModal').classList.remove('active');
    }

    closeScriptsModal() {
        document.getElementById('scriptsModal').classList.remove('active');
    }

    updateSetting(setting, element) {
        let value;
        
        switch (element.type) {
            case 'range':
                value = parseFloat(element.value);
                // Update display value
                const displayElement = document.getElementById(setting + 'Value');
                if (displayElement) {
                    if (setting === 'fontSize') {
                        displayElement.textContent = value + 'px';
                    } else if (setting === 'lineSpacing') {
                        displayElement.textContent = value + 'x';
                    }
                }
                break;
            case 'checkbox':
                value = element.checked;
                break;
            default:
                value = element.value;
        }
        
        this.settings[setting] = value;
        this.applySettings();
        this.saveSettings();
        
        // Handle special settings
        if (setting === 'autoSave') {
            if (value) {
                this.startAutoSave();
            } else {
                this.stopAutoSave();
            }
        }
    }

    applySettings() {
        const textElement = document.getElementById('teleprompterText');
        if (!textElement) return;
        
        // Apply all settings
        textElement.style.fontSize = this.settings.fontSize + 'px';
        textElement.style.color = this.settings.textColor;
        textElement.style.textAlign = this.settings.textAlign;
        textElement.style.lineHeight = this.settings.lineSpacing;
        
        // Apply background color to body or container
        document.body.style.backgroundColor = this.settings.backgroundColor;
        
        // Apply mirroring
        if (this.settings.mirrorHorizontal) {
            textElement.style.transform = 'scaleX(-1)';
        } else {
            textElement.style.transform = 'none';
        }
        
        // Apply high contrast
        if (this.settings.highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    }

    updateWordCount() {
        const content = document.getElementById('scriptContent').value;
        const words = content.trim().split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;
        const estimatedTime = Math.round(wordCount * 0.5); // 0.5 seconds per word
        
        document.getElementById('wordCount').textContent = wordCount + ' words';
        document.getElementById('estimatedTime').textContent = 
            Math.floor(estimatedTime / 60) + ':' + (estimatedTime % 60).toString().padStart(2, '0');
    }

    updateScriptStatus(status) {
        const statusElement = document.getElementById('scriptStatus');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }

    handleKeyboard(e) {
        // Only handle keyboard shortcuts in teleprompter view
        if (this.currentView !== 'teleprompter') return;
        
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.updateSpeed(Math.min(this.scrollSpeed + 0.1, 5));
                document.getElementById('speedSlider').value = this.scrollSpeed;
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.updateSpeed(Math.max(this.scrollSpeed - 0.1, 0.1));
                document.getElementById('speedSlider').value = this.scrollSpeed;
                break;
            case 'Escape':
                this.toggleFullscreen();
                break;
        }
    }

    toggleFullscreen() {
        const app = document.getElementById('app');
        if (app.classList.contains('fullscreen')) {
            app.classList.remove('fullscreen');
            document.exitFullscreen?.();
        } else {
            app.classList.add('fullscreen');
            document.documentElement.requestFullscreen?.();
        }
    }

    // Script Storage Methods
    saveCurrentScript() {
        const title = document.getElementById('scriptTitle').value.trim();
        const content = document.getElementById('scriptContent').value.trim();
        
        if (!title || !content) return;
        
        const script = {
            id: this.currentScriptId || this.generateId(),
            title: title,
            content: content,
            createdAt: this.currentScriptId ? this.scripts[this.currentScriptId]?.createdAt || Date.now() : Date.now(),
            updatedAt: Date.now(),
            wordCount: content.split(/\s+/).filter(word => word.length > 0).length,
            estimatedDuration: Math.round(content.split(/\s+/).filter(word => word.length > 0).length * 0.5)
        };
        
        this.scripts[script.id] = script;
        this.currentScriptId = script.id;
        this.saveScripts();
        this.updateScriptStatus('Saved');
        this.renderScriptsList();
        
        // Clear status after 2 seconds
        setTimeout(() => this.updateScriptStatus('Ready'), 2000);
    }

    loadCurrentScript() {
        if (this.currentScriptId && this.scripts[this.currentScriptId]) {
            const script = this.scripts[this.currentScriptId];
            document.getElementById('scriptTitle').value = script.title;
            document.getElementById('scriptContent').value = script.content;
            this.updateWordCount();
        }
    }

    loadScript(scriptId) {
        if (this.scripts[scriptId]) {
            const script = this.scripts[scriptId];
            this.currentScriptId = scriptId;
            document.getElementById('scriptTitle').value = script.title;
            document.getElementById('scriptContent').value = script.content;
            this.updateWordCount();
            this.updateScriptStatus('Loaded');
            this.switchView('editor');
            this.closeScriptsModal();
            
            setTimeout(() => this.updateScriptStatus('Ready'), 2000);
        }
    }

    deleteScript(scriptId) {
        if (confirm('Are you sure you want to delete this script?')) {
            delete this.scripts[scriptId];
            this.saveScripts();
            this.renderScriptsList();
            
            if (this.currentScriptId === scriptId) {
                this.newScript();
            }
        }
    }

    duplicateScript(scriptId) {
        if (this.scripts[scriptId]) {
            const original = this.scripts[scriptId];
            const duplicate = {
                ...original,
                id: this.generateId(),
                title: original.title + ' (Copy)',
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            
            this.scripts[duplicate.id] = duplicate;
            this.saveScripts();
            this.renderScriptsList();
        }
    }

    renderScriptsList() {
        const scriptsList = document.getElementById('scriptsList');
        const modalScriptsList = document.getElementById('modalScriptsList');
        
        if (!scriptsList || !modalScriptsList) return;
        
        const scripts = Object.values(this.scripts).sort((a, b) => b.updatedAt - a.updatedAt);
        
        const renderList = (container) => {
            container.innerHTML = '';
            
            if (scripts.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #888; padding: 2rem;">No scripts saved yet</p>';
                return;
            }
            
            scripts.forEach(script => {
                const scriptCard = document.createElement('div');
                scriptCard.className = 'script-card';
                if (this.currentScriptId === script.id) {
                    scriptCard.classList.add('selected');
                }
                
                scriptCard.innerHTML = `
                    <div class="script-actions">
                        <button class="script-action-btn" onclick="app.loadScript('${script.id}')" title="Load">📝</button>
                        <button class="script-action-btn" onclick="app.duplicateScript('${script.id}')" title="Duplicate">📋</button>
                        <button class="script-action-btn delete" onclick="app.deleteScript('${script.id}')" title="Delete">🗑️</button>
                    </div>
                    <div class="script-title">${script.title}</div>
                    <div class="script-preview">${script.content.substring(0, 150)}${script.content.length > 150 ? '...' : ''}</div>
                    <div class="script-meta">
                        <span>${script.wordCount} words</span>
                        <span>${new Date(script.updatedAt).toLocaleDateString()}</span>
                    </div>
                `;
                
                scriptCard.addEventListener('click', (e) => {
                    if (!e.target.closest('.script-actions')) {
                        this.loadScript(script.id);
                    }
                });
                
                container.appendChild(scriptCard);
            });
        };
        
        renderList(scriptsList);
        renderList(modalScriptsList);
    }

    // Import/Export Methods
    importScript() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        if (Array.isArray(data)) {
                            // Import multiple scripts
                            data.forEach(script => {
                                script.id = this.generateId();
                                script.createdAt = Date.now();
                                script.updatedAt = Date.now();
                                this.scripts[script.id] = script;
                            });
                        } else {
                            // Import single script
                            data.id = this.generateId();
                            data.createdAt = Date.now();
                            data.updatedAt = Date.now();
                            this.scripts[data.id] = data;
                        }
                        this.saveScripts();
                        this.renderScriptsList();
                        alert('Scripts imported successfully!');
                    } catch (error) {
                        alert('Error importing scripts: ' + error.message);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    exportAllScripts() {
        const scripts = Object.values(this.scripts);
        if (scripts.length === 0) {
            alert('No scripts to export');
            return;
        }
        
        const dataStr = JSON.stringify(scripts, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `telepal-scripts-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    // Auto-save functionality
    startAutoSave() {
        this.stopAutoSave(); // Clear any existing interval
        this.autoSaveInterval = setInterval(() => {
            this.saveCurrentScript();
        }, 30000); // Auto-save every 30 seconds
    }

    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }

    // Utility methods
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    loadSettings() {
        const defaultSettings = {
            fontSize: 24,
            textColor: '#ffffff',
            backgroundColor: '#000000',
            lineSpacing: 1.2,
            textAlign: 'center',
            mirrorHorizontal: false,
            highContrast: false,
            autoSave: true,
            offlineMode: false
        };
        
        const saved = localStorage.getItem('telepal_settings');
        if (saved) {
            try {
                return { ...defaultSettings, ...JSON.parse(saved) };
            } catch (e) {
                console.error('Error loading settings:', e);
            }
        }
        
        return defaultSettings;
    }

    saveSettings() {
        localStorage.setItem('telepal_settings', JSON.stringify(this.settings));
    }

    loadScripts() {
        const saved = localStorage.getItem('telepal_scripts');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Error loading scripts:', e);
            }
        }
        return {};
    }

    saveScripts() {
        localStorage.setItem('telepal_scripts', JSON.stringify(this.scripts));
    }
}

// Initialize the application when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TelePalPWA();
});