# Better Prompt

[![English](https://img.shields.io/badge/Language-English-blue)](README.md)
[![Tiếng Việt](https://img.shields.io/badge/Language-Tiếng%20Việt-green)](README.vi.md)

A browser extension that helps you optimize prompts for AI interactions using the Gemini API. Works with Chrome, Edge, Brave, Opera, and other Chromium-based browsers.

## Features

- Optimize prompts with different styles: improve clarity, enhance detail, make concise, or make professional
- Select from different Gemini models for varying speed and quality needs
- Performance optimized for fast response times
- Simple user interface with easy-to-use controls
- Direct integration with Gemini API
- Copy optimized prompts to clipboard with a single click

## Installation

### Prerequisites

- Any Chromium-based browser (Chrome, Edge, Brave, Opera, etc.)
- Gemini API key (get one at [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation Steps

1. Clone this repository or download the ZIP file and extract it
2. Open your browser and go to the extensions page
3. Enable "Developer mode" using the toggle switch (typically in the top-right corner)
4. Click "Load unpacked" and select the extension directory
5. The Better Prompt extension icon should appear in your browser toolbar

## Usage

1. Click on the Better Prompt icon in your browser toolbar
2. Click the settings icon and enter your Gemini API key, then click "Save"
3. Type or paste the prompt you want to optimize
4. Select the optimization type:
   - Improve Clarity: Makes the prompt clearer and more structured
   - Enhance Detail: Analyzes user intent, adds detailed system instructions, includes important contextual information, and enhances the prompt with topic-specific details
   - Make Concise: Shortens the prompt while preserving intent
   - Make Professional: Rewrites the prompt to sound more formal
5. Choose a model based on your needs:
   - Flash (Balanced): Good balance between speed and quality
   - Flash Lite (Fastest): Optimized for speed, best for short prompts
   - Pro (High Quality): Higher quality results but slower
   - Flash Thinking (Detailed): More detailed analysis, good for complex prompts
   - Flash Exp (Experimental): Latest experimental features
6. Click "Optimize" and wait for the result
7. Use the copy icon in the top-right corner of the result box to copy the optimized prompt to your clipboard

## Security Notice

- This extension stores your API key locally in your browser with basic obfuscation
- This is not secure encryption - the API key is still vulnerable to determined attackers
- Do not use this extension on shared or public computers
- Clear your browser data if you need to remove your stored API key
- Never share your API key with others

## Performance Optimization

This extension is optimized for performance with:
- Response caching to avoid duplicate API calls
- Efficient DOM operations
- Hardware acceleration for smooth animations
- Request timeouts to prevent hanging
- Debounced event handlers

## Development

### Project Structure

- `manifest.json`: Extension configuration
- `popup.html`, `popup.css`, `popup.js`: User interface components
- `background.js`: Handles API communication and caching
- `content.js`: Contains functionality for webpage integration
- `images/`: Icon files for the extension

### Building and Testing

1. Make changes to the code as needed
2. Load the extension in your browser as described in the Installation section
3. Click the extension icon to test your changes

## License

This project is licensed under the MIT License.
