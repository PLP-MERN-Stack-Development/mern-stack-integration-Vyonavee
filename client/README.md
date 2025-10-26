# Client

## Setup
1. Copy `.env.example` to `.env` if you need to override API URL.
2. Install dependencies:
   ```
   cd client
   npm install
   ```
3. Run dev server:
   ```
   npm run dev
   ```
Notes:
- Tailwind is configured with darkMode: 'media' so it auto-switches based on OS preference.
- The client expects the server at VITE_API_URL (default http://localhost:5000).
