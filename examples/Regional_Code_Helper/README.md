# Sarvam Talk - Code Explainer

A modern web application built with Next.js App Router, React, and Tailwind CSS. It helps users understand code in English or Hindi, both as text and spoken audio using the Sarvam AI API.

## Features

- 🧠 **Code Explanation**: Get clear, structured explanations of code snippets.
- 🗣️ **Voice AI Output**: Listen to the explanation using Sarvam Text-to-Speech (TTS).
- 🌐 **Multilingual Support**: Supports English (`en-IN`) and Hindi (`hi-IN`).
- 🔐 **Secure Key Management**: Validates and uses your own Sarvam API key entirely in memory/session. It is never persisted or logged.
- 📱 **Responsive Design**: Mobile-friendly layout and tactile controls.
- 🧩 **Chrome Extension Companion**: Highlight code anywhere on the web and send it to the explainer.

## Architecture

This project replaces the legacy Streamlit app (now located in `legacy-streamlit/`) with a robust production-ready stack:

- **Frontend**: Next.js 14 App Router, React, Tailwind CSS, Lucide Icons.
- **Backend API Routes**: Secure endpoints for key validation (`/api/validate-key`), code analysis (`/api/explain`), and TTS generation (`/api/tts`).
- **Testing**: Vitest + React Testing Library for unit tests. Playwright for End-to-End browser testing across viewports.

## Local Setup

### Prerequisites
- Node.js 18+
- A [Sarvam AI](https://dashboard.sarvam.ai) API Key

### Installation

1. Navigate to the project directory:
   `cd examples/Regional_Code_Helper`

2. Install dependencies:
   `npm install`

3. Setup environment (optional):
   You can provide your API key in the browser UI. Alternatively, you can add it to a `.env.local` file for local development:
   `SARVAM_API_KEY=your_api_key_here`

### Development

Run the development server:

`npm run dev`

Open http://localhost:3000 in your browser.

### Testing

Run unit and integration tests:
`npm run test`

Run End-to-End Playwright tests:
`npm run test:e2e`

### Production Build

Create an optimized build:
`npm run build`
`npm run start`

## Chrome Extension Companion

The `extension/` directory contains a minimal Manifest V3 Chrome Extension.

### Installation
1. Go to `chrome://extensions` in Google Chrome.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the `examples/Regional_Code_Helper/extension` folder.

**Usage:** Select code on any webpage, right click, and select "Explain selected code with Sarvam". It will open the web application with the code ready for explanation.

## Security & Privacy

- **API Keys**: Keys are input directly into the settings dialog. They are stored in `sessionStorage` strictly during your session, and passed via secure Headers to server-side Next.js route handlers. They are never exposed to the client bundle or sent to third-parties other than Sarvam.
- **Source Code**: Code is sent exclusively to the Sarvam Chat Completion API to generate explanations. It is not logged or persisted by the server.

---
*Legacy Streamlit code is preserved in `legacy-streamlit/` for reference purposes.*
