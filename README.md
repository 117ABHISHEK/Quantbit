```markdown
# Quantbit — Smart Factory Maintenance Tracker

This repository contains a small web application to track factory machine maintenance: a React frontend (Vite) and an Express backend. The app ships with an in-memory storage implementation for development and a MongoDB-backed storage implementation that will be used automatically when a local MongoDB is available.

## Quick start (local development)

Prerequisites
- Node.js 18+ and npm
- A running MongoDB server (local or remote) if you want persistent storage

Install dependencies

```powershell
npm install
```

Start MongoDB (Windows)
- If you installed MongoDB as a Windows service (default from the MSI):

```powershell
net start MongoDB
```

- Or run it manually (example):

```powershell
# Change the --dbpath to your data directory if needed
mongod --dbpath "C:\data\db"
```

Environment variables
- MONGO_URL: optional. Default: `mongodb://localhost:27017`
- MONGO_DB_NAME: optional. Default: `quantbit`
- PORT: optional. Default: `5000`


Run the app

```powershell
npm run dev
```

This runs the Express server in development mode (uses `tsx` to run TypeScript server code). The frontend is served by Vite during development.

Build & Production

```powershell
npm run build
npm run start
```

Notes
- If you want to force a particular MongoDB connection, set `MONGO_URL` before running the server.
- The server will use `MONGO_DB_NAME` (default `quantbit`) as the database name when connecting to MongoDB.
The project is configured to run locally. See below for setup and MongoDB instructions.

Useful scripts
- `npm run dev` — Run server (development) and serve frontend via Vite
- `npm run build` — Build frontend and bundle server into `dist`
- `npm run start` — Start the built production server from `dist`
- `npm run convert:tsx` — (Optional) run a local converter script that transpiles `.tsx` files to `.jsx` files and creates a backup. Use with caution; review changes before deleting originals.

Troubleshooting
- If the server can't connect to MongoDB and you expect it to, verify `MONGO_URL` and that `mongod` is running. Check the server logs for connection errors.
- If you see TypeScript type errors in your editor, run `npm install` so that dependencies (including `mongodb`) are available for your editor's type-checker.

License: MIT

```
# Quantbit