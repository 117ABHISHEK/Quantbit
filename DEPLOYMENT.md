# Deployment Guide

## Local Development

\`\`\`bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Backend
cd server
npm install
npm run dev

# Terminal 3: Start Frontend
cd client
npm install
npm run dev
\`\`\`

Access the app at `http://localhost:3000`

## Vercel Deployment

### Option 1: Frontend Only to Vercel + Separate Backend Hosting

**Frontend to Vercel:**
\`\`\`bash
cd client
npm run build
vercel
\`\`\`

**Backend Options:**
- Render.com (free tier available)
- Railway.app
- Fly.io
- Heroku alternative

### Option 2: Full-Stack on Vercel (Recommended)

1. Create `vercel.json`:
\`\`\`json
{
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/dist",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ]
}
\`\`\`

2. Create `api/index.js` for backend:
\`\`\`javascript
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri);

// Import and use routes
import equipmentRoutes from '../server/routes/equipment.js';
app.use('/api/equipment', equipmentRoutes);

export default app;
\`\`\`

3. Environment Variables in Vercel Dashboard:
- `MONGODB_URI`: Your MongoDB connection string from Atlas

### Step-by-Step Vercel Deployment

1. Push code to GitHub:
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
\`\`\`

2. Go to https://vercel.com and sign up
3. Import your repository
4. Set environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
5. Deploy

## MongoDB Atlas Setup

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Click "Connect" and select "Connect your application"
4. Copy connection string
5. Replace `<password>` with your database password
6. Add to Vercel environment variables as `MONGODB_URI`

## Environment Variables

**Development (.env):**
\`\`\`
MONGODB_URI=mongodb://localhost:27017/factory-maintenance
PORT=5000
VITE_API_URL=http://localhost:5000
\`\`\`

**Production (.env.production):**
\`\`\`
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/factory-maintenance
PORT=5000
VITE_API_URL=https://your-vercel-app.vercel.app
\`\`\`

## Custom Domain

1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## Monitoring and Logs

- View logs in Vercel dashboard
- Monitor MongoDB performance in Atlas dashboard
- Set up alerts for errors and performance issues
