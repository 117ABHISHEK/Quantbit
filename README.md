# Smart Factory Maintenance Tracker

A full-stack web application for managing factory equipment maintenance, scheduling, and alerts. Built with React, Express, and MongoDB.

## Features

- **Equipment Management**: Register and track factory equipment with detailed specifications
- **Maintenance Scheduling**: Plan preventive, corrective, and inspection maintenance
- **Alert System**: Real-time alerts for maintenance deadlines and equipment issues
- **Dashboard**: Overview of equipment status, active alerts, and maintenance metrics
- **Professional UI**: Dark theme with industrial blue accents for optimal factory floor visibility

## Tech Stack

- **Frontend**: React 18, Vite, CSS3
- **Backend**: Express.js, Node.js
- **Database**: MongoDB
- **Tools**: npm, nodemon

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas cloud)
- npm or yarn

## Local Setup

### 1. MongoDB Setup

**Option A: Local MongoDB**
\`\`\`bash
# Install MongoDB Community Edition
# macOS:
brew install mongodb-community

# Windows: Download from https://www.mongodb.com/try/download/community

# Start MongoDB service
mongod
\`\`\`

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Replace in `.env` file

### 2. Backend Setup

\`\`\`bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/factory-maintenance
# PORT=5000

# Start development server
npm run dev
# Server runs on http://localhost:5000
\`\`\`

### 3. Frontend Setup

\`\`\`bash
# In a new terminal, navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend runs on http://localhost:3000
\`\`\`

## API Endpoints

### Equipment
- `GET /api/equipment` - Get all equipment
- `GET /api/equipment/:id` - Get specific equipment
- `POST /api/equipment` - Create equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment

### Maintenance
- `GET /api/maintenance` - Get all maintenance records
- `GET /api/maintenance/status/:status` - Get maintenance by status
- `POST /api/maintenance` - Create maintenance record
- `PUT /api/maintenance/:id` - Update maintenance
- `DELETE /api/maintenance/:id` - Delete maintenance

### Alerts
- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/unresolved` - Get unresolved alerts
- `POST /api/alerts` - Create alert
- `PUT /api/alerts/:id/resolve` - Resolve alert

## Deployment to Vercel

### Deploy Frontend to Vercel

\`\`\`bash
# Navigate to client directory
cd client

# Build the project
npm run build

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
\`\`\`

### Deploy Backend as Serverless Functions

Create `api/equipment.js` in your Vercel project root:

\`\`\`javascript
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Import routes and attach to app

export default app;
\`\`\`

Or use Vercel's Node.js API routes or consider using a separate hosting for Express (Render.com, Railway.app, Heroku alternatives).

## Project Structure

\`\`\`
factory-maintenance-tracker/
├── server/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── Equipment.js
│   │   ├── Maintenance.js
│   │   ├── Alert.js
│   │   └── User.js
│   ├── routes/
│   │   ├── equipment.js
│   │   ├── maintenance.js
│   │   └── alerts.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Button.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Equipment.jsx
│   │   │   ├── Maintenance.jsx
│   │   │   └── Alerts.jsx
│   │   ├── styles/
│   │   │   ├── Dashboard.css
│   │   │   ├── Equipment.css
│   │   │   ├── Maintenance.css
│   │   │   └── Alerts.css
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
\`\`\`

## Usage

1. **Add Equipment**: Go to Equipment Management, click "Add Equipment", fill in details
2. **Schedule Maintenance**: Navigate to Maintenance, click "Schedule Maintenance"
3. **Monitor Alerts**: Check Alerts page for active maintenance alerts
4. **View Dashboard**: See overview of all systems on the main dashboard

## Troubleshooting

**Backend not connecting to MongoDB:**
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network connectivity

**Frontend can't reach backend:**
- Check if backend server is running on port 5000
- Verify proxy settings in vite.config.js
- Check CORS settings in server.js

**Port already in use:**
\`\`\`bash
# Find process using port
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
\`\`\`

## Future Enhancements

- User authentication and authorization
- PDF report generation
- Email notifications
- Mobile app
- Real-time WebSocket updates
- Advanced analytics and charts
- Integration with IoT sensors

## License

MIT
