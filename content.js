// This file is currently empty as no direct page interactions are needed
// It's included in the manifest.json to enable potential future integrations

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'insertPrompt') {
    // Future functionality: Insert prompt into active text field
    // For now, we'll just acknowledge receipt
    sendResponse({ success: true });
  }
  return true;
});
