// Performance optimization: Use a cache for API responses
const responseCache = new Map();

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'optimizePrompt') {
    // Generate a cache key based on prompt, type and model
    const cacheKey = `${request.data.prompt}-${request.data.optimizationType}-${request.data.modelType}`;
    
    // Check if we have a cached result
    if (responseCache.has(cacheKey)) {
      sendResponse({ result: responseCache.get(cacheKey) });
      return true;
    }
    
    // If not cached, make the API call
    optimizePrompt(request.data)
      .then(result => {
        // Cache the result for future use (limited to 50 entries)
        if (responseCache.size >= 50) {
          // Remove oldest entry
          const firstKey = responseCache.keys().next().value;
          responseCache.delete(firstKey);
        }
        responseCache.set(cacheKey, result);
        sendResponse({ result });
      })
      .catch(error => sendResponse({ error: error.message }));
    
    return true; // Return true for async response
  }
});

// Function to optimize prompts using Gemini API
async function optimizePrompt(data) {
  const { prompt, optimizationType, modelType, apiKey } = data;
  
  // Construct system prompt based on optimization type (keeping existing system prompts)
  let systemPrompt = "You are an expert prompt engineer that helps optimize prompts. ";
  
  switch (optimizationType) {
    case 'improve':
      systemPrompt += "Please analyze the given prompt and suggest improvements to enhance its clarity and structure. Identify the domain of the prompt, restructure it for better specificity and effectiveness, add relevant context or constraints, and ensure it adheres to best practices for AI interaction.";
      break;
    case 'enhance':
      systemPrompt += "Thoroughly analyze and enhance the following user prompt to create a highly effective improved prompt. Your enhanced output should include: 1) Analysis of the topic and user intent from the original prompt, 2) Detailed system instructions formatted as clear directives to guide AI responses, 3) Identification and inclusion of necessary contextual information about the topic that was missing from the original prompt, 4) Additional clarifications or constraints that would improve results. Structure your response as a comprehensive prompt that can be used immediately by the user to get superior results from AI systems. Make sure the enhanced prompt maintains the original intent but adds depth, clarity, and technical precision and ensure it adheres to best practices for AI interaction.";
      break;
    case 'shorten':
      systemPrompt += "Please rewrite the following prompt to make it more concise while ensuring the core intent and essential details are preserved. Focus on clarity and brevity, removing any redundant or unnecessary information. Maintain the original prompt's context and domain. Ensure it follows AI interaction best practices";
      break;
    case 'professional':
      systemPrompt += "Please rewrite the following prompt to enhance its professionalism and structure, making it suitable for business or formal contexts. Ensure the tone is respectful and the language is clear and concise. The rewritten prompt should be presented in a format that can be directly used in professional communications.";
      break;
    default:
      systemPrompt += "Analyze and enhance the following user prompt to improve its clarity and effectiveness for AI interaction.";
  }

  systemPrompt += " Additionally, detect and return the primary language of the original prompt without translating any specialized or professional terms.";

  try {
    // Performance optimization: Use AbortController for request timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
    
    // Use the selected model
    const modelEndpoint = modelType || "gemini-2.0-flash";
    
    // Streamline the message format
    const message = `${systemPrompt}\n\nHere is the prompt to optimize:\n\n${prompt}\n\nProvide only the optimized prompt as your response, without any explanations or additional text.`;
    
    // Optimized API request with configurable model
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelEndpoint}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: message
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192
        }
      }),
      signal: controller.signal
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Error calling Gemini API with model ${modelEndpoint}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
    
  } catch (error) {
    console.error('Error optimizing prompt:', error);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again or select a lighter model like "Flash Lite".');
    }
    throw new Error('Failed to optimize prompt: ' + error.message);
  }
}
