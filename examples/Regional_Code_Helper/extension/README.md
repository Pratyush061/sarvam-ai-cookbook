# Sarvam Talk - Chrome Extension Companion

This is a minimal Manifest V3 Chrome extension that acts as a bridge to the main Next.js web application.

## Features
- Adds a context menu item "Explain selected code with Sarvam".
- Reads the selected text and opens the Sarvam Talk web application with the code pre-loaded.
- Does not store your API key or perform network requests. The web app securely handles all AI logic.

## How to Install (Developer Mode)
1. Open Google Chrome.
2. Go to `chrome://extensions`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked".
5. Select this `extension` directory.

## Testing
- Highlight some code on any webpage.
- Right-click and select "Explain selected code with Sarvam".
- It will launch `http://localhost:3000` (or the configured production URL) with the code pre-filled.
