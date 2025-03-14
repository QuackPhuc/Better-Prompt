document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  const apiKeyInput = document.getElementById('api-key');
  const maskedKeyDisplay = document.getElementById('masked-key');
  const resetApiBtn = document.getElementById('reset-api-btn');
  const saveApiKeyBtn = document.getElementById('save-api-key');
  const originalPromptInput = document.getElementById('original-prompt');
  const optimizationTypeSelect = document.getElementById('optimization-type');
  const modelTypeSelect = document.getElementById('model-type');
  const themeSelect = document.getElementById('theme-select');
  const optimizeBtn = document.getElementById('optimize-btn');
  const optimizedPromptOutput = document.getElementById('optimized-prompt');
  const copyBtn = document.getElementById('copy-btn');
  const saveBtn = document.getElementById('save-btn');
  const statusMessage = document.getElementById('status-message');
  const settingsBtn = document.getElementById('settings-btn');
  const settingsPanel = document.getElementById('settings-panel');
  const historyBtn = document.getElementById('history-btn');
  const historyPanel = document.getElementById('history-panel');
  const historyList = document.getElementById('history-list');
  const clearHistoryBtn = document.getElementById('clear-history');
  const historyEmpty = document.getElementById('history-empty');
  const apiNotification = document.getElementById('api-notification');
  
  // For performance optimization, cache DOM queries
  const elements = {
    apiKeyInput,
    maskedKeyDisplay,
    resetApiBtn,
    saveApiKeyBtn,
    originalPromptInput,
    optimizationTypeSelect,
    modelTypeSelect,
    themeSelect,
    optimizeBtn,
    optimizedPromptOutput,
    copyBtn,
    saveBtn,
    statusMessage,
    settingsBtn,
    settingsPanel,
    historyBtn,
    historyPanel,
    historyList,
    clearHistoryBtn,
    historyEmpty,
    apiNotification
  };
  
  // Store the last selected preferences
  let preferences = {
    optimizationType: 'improve',
    modelType: 'gemini-2.0-flash',
    theme: 'system'
  };
  
  // Store history items
  let promptHistory = [];

  // Theme handling functions
  function setTheme(theme) {
    if (theme === 'system') {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    
    // Save preference
    preferences.theme = theme;
    savePreferences();
  }
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (preferences.theme === 'system') {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });
  
  // Theme selector change handler
  themeSelect.addEventListener('change', () => {
    const selectedTheme = themeSelect.value;
    setTheme(selectedTheme);
  });
  
  // Simple obfuscation functions for API key
  function obfuscateApiKey(apiKey) {
    if (!apiKey) return '';
    // Create a simple obfuscation using a fixed key and Base64
    const key = 'BetterPromptSecurity';
    let obfuscated = '';
    for (let i = 0; i < apiKey.length; i++) {
      obfuscated += String.fromCharCode(apiKey.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(obfuscated);
  }
  
  function deobfuscateApiKey(obfuscatedKey) {
    if (!obfuscatedKey) return '';
    try {
      const key = 'BetterPromptSecurity';
      const decoded = atob(obfuscatedKey);
      let original = '';
      for (let i = 0; i < decoded.length; i++) {
        original += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return original;
    } catch (e) {
      console.error('Error deobfuscating key:', e);
      return '';
    }
  }
  
  // Load saved data using a single storage call for better performance
  chrome.storage.local.get(['geminiApiKey', 'preferences', 'promptHistory'], (data) => {
    if (data.geminiApiKey) {
      const decodedKey = deobfuscateApiKey(data.geminiApiKey);
      apiKeyInput.value = decodedKey;
      updateMaskedDisplay(decodedKey);
      hideApiKeyNotification();
    } else {
      showApiKeyNotification();
    }
    
    if (data.preferences) {
      preferences = {...preferences, ...data.preferences};
      elements.optimizationTypeSelect.value = preferences.optimizationType;
      elements.modelTypeSelect.value = preferences.modelType;
      elements.themeSelect.value = preferences.theme || 'system';
      
      // Apply theme
      setTheme(preferences.theme || 'system');
    } else {
      // Apply default theme (system)
      setTheme('system');
    }
    
    // Load prompt history
    if (data.promptHistory && Array.isArray(data.promptHistory)) {
      promptHistory = data.promptHistory;
      renderHistoryList();
    }
  });
  
  // Settings panel toggle
  settingsBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
    // Hide history panel when settings panel is shown
    if (!settingsPanel.classList.contains('hidden')) {
      historyPanel.classList.add('hidden');
    }
  });
  
  // History panel toggle
  historyBtn.addEventListener('click', () => {
    historyPanel.classList.toggle('hidden');
    // Hide settings panel when history panel is shown
    if (!historyPanel.classList.contains('hidden')) {
      settingsPanel.classList.add('hidden');
    }
  });
  
  // Save API key with warning
  saveApiKeyBtn.addEventListener('click', () => {
    const apiKey = elements.apiKeyInput.value.trim();
    if (apiKey) {
      // Add warning message about API key storage
      const confirmSave = confirm("Warning: Your API key will be stored locally with basic obfuscation but is not securely encrypted. Don't use this extension on shared or public computers. Continue?");
      
      if (confirmSave) {
        chrome.storage.local.set({ geminiApiKey: obfuscateApiKey(apiKey) }, () => {
          showStatus('API key saved successfully!');
          hideApiKeyNotification();
          // Make sure masked display is updated
          updateMaskedDisplay(apiKey);
        });
      }
    } else {
      showStatus('Please enter a valid API key', true);
      showApiKeyNotification();
    }
  });
  
  // Clear history button
  clearHistoryBtn.addEventListener('click', () => {
    if (promptHistory.length === 0) return;
    
    const confirmClear = confirm('This will clear all unpinned prompts from your history. Continue?');
    if (confirmClear) {
      // Keep only pinned items
      promptHistory = promptHistory.filter(item => item.pinned);
      saveHistory();
      renderHistoryList();
      showStatus('Unpinned prompts cleared!');
    }
  });
  
  // Save prompt to history with visual feedback
  saveBtn.addEventListener('click', () => {
    const optimizedPrompt = elements.optimizedPromptOutput.value.trim();
    if (optimizedPrompt) {
      // Visual feedback on save
      const icon = saveBtn.querySelector('.material-icons');
      icon.textContent = 'bookmark';
      setTimeout(() => {
        icon.textContent = 'bookmark_border';
      }, 1500);
      
      addToHistory(optimizedPrompt);
      showStatus('Prompt saved to history!');
    } else {
      showStatus('No prompt to save', true);
    }
  });
  
  // Add to history
  function addToHistory(prompt) {
    // Create a new history item
    const historyItem = {
      id: Date.now().toString(),
      prompt: prompt,
      pinned: false,
      date: new Date().toISOString()
    };
    
    // Add to the beginning of the array (newest first)
    promptHistory.unshift(historyItem);
    
    // Limit history to 50 items
    if (promptHistory.length > 50) {
      promptHistory.pop();
    }
    
    // Save to storage and update UI
    saveHistory();
    renderHistoryList();
  }
  
  // Remove from history
  function removeFromHistory(id) {
    promptHistory = promptHistory.filter(item => item.id !== id);
    saveHistory();
    renderHistoryList();
  }
  
  // Toggle pin status with visual feedback
  function togglePinStatus(id) {
    const item = promptHistory.find(item => item.id === id);
    if (item) {
      item.pinned = !item.pinned;
      saveHistory();
      renderHistoryList();
      showStatus(item.pinned ? 'Prompt pinned!' : 'Prompt unpinned!');
    }
  }
  
  // Save history to storage
  function saveHistory() {
    chrome.storage.local.set({ promptHistory });
  }
  
  // Render history list
  function renderHistoryList() {
    elements.historyList.innerHTML = '';
    
    if (promptHistory.length === 0) {
      elements.historyEmpty.classList.remove('hidden');
      return;
    }
    
    elements.historyEmpty.classList.add('hidden');
    
    // Create element for each history item
    promptHistory.forEach(item => {
      const historyItem = document.createElement('div');
      historyItem.className = `history-item ${item.pinned ? 'pinned' : ''}`;
      
      // Format the content with improved UI
      historyItem.innerHTML = `
        <div class="history-item-content">${item.prompt}</div>
        <div class="history-pin" title="${item.pinned ? 'Unpin' : 'Pin'} this prompt">
          <span class="material-icons history-icon">${item.pinned ? 'push_pin' : 'push_pin'}</span>
        </div>
        <div class="history-item-actions">
          <span class="material-icons history-icon" title="Use this prompt">call_made</span>
          <span class="material-icons history-icon" title="Delete">delete_outline</span>
        </div>
      `;
      
      // Add event listeners
      const pinBtn = historyItem.querySelector('.history-pin');
      const useBtn = historyItem.querySelector('.history-item-actions span:first-child');
      const deleteBtn = historyItem.querySelector('.history-item-actions span:last-child');
      
      pinBtn.addEventListener('click', () => togglePinStatus(item.id));
      
      useBtn.addEventListener('click', () => {
        elements.optimizedPromptOutput.value = item.prompt;
        historyPanel.classList.add('hidden');
      });
      
      deleteBtn.addEventListener('click', () => removeFromHistory(item.id));
      
      elements.historyList.appendChild(historyItem);
    });
  }
  
  // Show notification that API key is missing
  function showApiKeyNotification() {
    elements.apiNotification.classList.remove('hidden');
  }
  
  // Hide API key notification when key is present
  function hideApiKeyNotification() {
    elements.apiNotification.classList.add('hidden');
  }
  
  // Save preferences when changed
  elements.optimizationTypeSelect.addEventListener('change', () => {
    preferences.optimizationType = elements.optimizationTypeSelect.value;
    savePreferences();
  });
  
  elements.modelTypeSelect.addEventListener('change', () => {
    preferences.modelType = elements.modelTypeSelect.value;
    savePreferences();
  });
  
  function savePreferences() {
    chrome.storage.local.set({ preferences });
  }
  
  // Optimize button click handler with performance optimizations
  optimizeBtn.addEventListener('click', () => {
    const originalPrompt = elements.originalPromptInput.value.trim();
    const optimizationType = elements.optimizationTypeSelect.value;
    const modelType = elements.modelTypeSelect.value;
    
    if (!originalPrompt) {
      showStatus('Please enter a prompt to optimize', true);
      return;
    }
    
    // Show loading state with animation for better UX
    elements.optimizeBtn.disabled = true;
    elements.optimizeBtn.textContent = 'Optimizing';
    elements.optimizeBtn.classList.add('loading');
    showStatus('Optimizing your prompt...');
    
    // Use a single storage call for performance
    chrome.storage.local.get('geminiApiKey', (data) => {
      if (!data.geminiApiKey) {
        showStatus('Please save your Gemini API key first', true);
        resetOptimizeButton();
        // Show settings panel if API key is missing
        settingsPanel.classList.remove('hidden');
        showApiKeyNotification();
        return;
      }
      
      const deobfuscatedKey = deobfuscateApiKey(data.geminiApiKey);
      
      // Use a timeout to ensure UI updates are visible before heavy processing
      setTimeout(() => {
        // Send message to background script with model parameter
        chrome.runtime.sendMessage({
          action: 'optimizePrompt',
          data: {
            prompt: originalPrompt,
            optimizationType: optimizationType,
            modelType: modelType,
            apiKey: deobfuscatedKey
          }
        }, (response) => {
          resetOptimizeButton();
          
          if (response.error) {
            showStatus(response.error, true);
          } else {
            elements.optimizedPromptOutput.value = response.result;
            showStatus('Prompt optimized successfully!');
            
            // Auto-save to history if option is enabled
            // For now, we'll leave this commented out as it's not part of the requirement
            // addToHistory(response.result);
          }
        });
      }, 10); // Small timeout for UI updates
    });
  });
  
  function resetOptimizeButton() {
    elements.optimizeBtn.disabled = false;
    elements.optimizeBtn.textContent = 'Optimize';
    elements.optimizeBtn.classList.remove('loading');
  }
  
  // Copy to clipboard with improved icon behavior
  copyBtn.addEventListener('click', () => {
    const optimizedPrompt = elements.optimizedPromptOutput.value;
    if (optimizedPrompt) {
      navigator.clipboard.writeText(optimizedPrompt)
        .then(() => {
          showStatus('Copied to clipboard!');
          // Visual feedback on copy
          const icon = copyBtn.querySelector('.material-icons');
          icon.textContent = 'check';
          setTimeout(() => {
            icon.textContent = 'content_copy';
          }, 1500);
        })
        .catch(err => showStatus('Failed to copy: ' + err, true));
    }
  });
  
  // Helper to show status messages with debouncing for performance
  let statusTimeout;
  function showStatus(message, isError = false) {
    if (statusTimeout) clearTimeout(statusTimeout);
    
    elements.statusMessage.textContent = message;
    elements.statusMessage.className = isError ? 'status-message error' : 'status-message';
    
    // Clear status message after 3 seconds
    statusTimeout = setTimeout(() => {
      elements.statusMessage.textContent = '';
    }, 3000);
  }

  // Secure API key handling - prevent copying and mask display
  apiKeyInput.addEventListener('input', () => {
    const apiKey = apiKeyInput.value.trim();
    updateMaskedDisplay(apiKey);
  });
  
  // Prevent copying API key
  apiKeyInput.addEventListener('copy', (e) => {
    e.preventDefault();
    showStatus('Copying API key is disabled for security', true);
  });
  
  apiKeyInput.addEventListener('cut', (e) => {
    e.preventDefault();
    showStatus('Cutting API key is disabled for security', true);
  });
  
  apiKeyInput.addEventListener('paste', (e) => {
    // Allow paste operation but update the masked display after a short delay
    setTimeout(() => updateMaskedDisplay(apiKeyInput.value), 10);
  });
  
  // Update the masked display of the API key
  function updateMaskedDisplay(apiKey) {
    if (!apiKey) {
      maskedKeyDisplay.textContent = '';
      return;
    }
    
    // Show first 4 and last 4 characters, mask the rest with bullets
    const maskedKey = maskApiKey(apiKey);
    maskedKeyDisplay.textContent = maskedKey;
  }
  
  // Create a masked version of the API key using bullet points
  function maskApiKey(apiKey) {
    if (apiKey.length <= 8) {
      // For very short keys, show the first 2 and last 2
      return apiKey.length <= 4 ? apiKey : 
        apiKey.substring(0, 2) + '•'.repeat(apiKey.length - 4) + apiKey.slice(-2);
    }
    
    // For longer keys, show first 4 and last 4
    return apiKey.substring(0, 4) + '•'.repeat(apiKey.length - 8) + apiKey.slice(-4);
  }
  
  // Reset API key field
  resetApiBtn.addEventListener('click', () => {
    apiKeyInput.value = '';
    maskedKeyDisplay.textContent = '';
    apiKeyInput.focus();
    showStatus('API key field reset', false);
  });
});
