# Multiplayer Tic-Tac-Toe

A real-time, two-player Tic-Tac-Toe web app with a playful Saturday-morning-cartoon aesthetic.

## Features
- Real-time multiplayer via Socket.io
- Invite code system
- Live chat with "sticky note" style
- Confetti on win
- Rematch functionality
- Responsive design

## Tech Stack
- Frontend: React + Vite + TypeScript + CSS
- Backend: Node.js + Express + Socket.io + TypeScript

## Local Development

### Prerequisites
- Node.js (v16+)
- npm

### Installation
```bash
npm install
cd server && npm install
cd ../client && npm install
```

### Running the App
From the root directory:
```bash
npm run dev
```
This will start the server on port 3001 and the client on port 5173.
- Client: http://localhost:5173
- Server: http://localhost:3001

## Deployment

### Backend (Render)
1. Create a new Web Service on [Render](https://render.com/).
2. Connect your GitHub repository.
3. Set the **Root Directory** to `server`.
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`
6. Add an environment variable `PORT` (e.g., `3001`).

### Frontend (Vercel)
1. Create a new project on [Vercel](https://vercel.com/).
2. Connect your GitHub repository.
3. Set the **Root Directory** to `client`.
4. Framework Preset: `Vite`.
5. Build Command: `npm run build`
6. Output Directory: `dist`.
7. Add an environment variable `VITE_SERVER_URL` pointing to your Render backend URL (e.g., `https://tictactoe-server.onrender.com`).

## How to Play
1. Click "CREATE GAME" to get an invite code.
2. Share the code with a friend.
3. Your friend enters the code on the home screen and clicks "JOIN GAME".
4. Play Tic-Tac-Toe and chat!
