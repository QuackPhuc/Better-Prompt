document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  const apiKeyInput = document.getElementById('api-key');
  const saveApiKeyBtn = document.getElementById('save-api-key');
  const originalPromptInput = document.getElementById('original-prompt');
  const optimizationTypeSelect = document.getElementById('optimization-type');
  const modelTypeSelect = document.getElementById('model-type');
  const optimizeBtn = document.getElementById('optimize-btn');
  const optimizedPromptOutput = document.getElementById('optimized-prompt');
  const copyBtn = document.getElementById('copy-btn');
  const statusMessage = document.getElementById('status-message');
  const settingsBtn = document.getElementById('settings-btn');
  const settingsPanel = document.getElementById('settings-panel');
  const apiNotification = document.getElementById('api-notification');
  
  // For performance optimization, cache DOM queries
  const elements = {
    apiKeyInput,
    saveApiKeyBtn,
    originalPromptInput,
    optimizationTypeSelect,
    modelTypeSelect,
    optimizeBtn,
    optimizedPromptOutput,
    copyBtn,
    statusMessage,
    settingsBtn,
    settingsPanel,
    apiNotification
  };
  
  // Store the last selected preferences
  let preferences = {
    optimizationType: 'improve',
    modelType: 'gemini-2.0-flash'
  };
  
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
  chrome.storage.local.get(['geminiApiKey', 'preferences'], (data) => {
    if (data.geminiApiKey) {
      elements.apiKeyInput.value = deobfuscateApiKey(data.geminiApiKey);
      hideApiKeyNotification();
    } else {
      showApiKeyNotification();
    }
    
    if (data.preferences) {
      preferences = {...preferences, ...data.preferences};
      elements.optimizationTypeSelect.value = preferences.optimizationType;
      elements.modelTypeSelect.value = preferences.modelType;
    }
  });
  
  // Settings panel toggle
  settingsBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
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
        });
      }
    } else {
      showStatus('Please enter a valid API key', true);
      showApiKeyNotification();
    }
  });
  
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
});
