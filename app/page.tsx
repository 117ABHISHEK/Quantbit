export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">Smart Factory Maintenance Tracker</h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Professional equipment maintenance management system with real-time alerts, scheduling, and analytics
          </p>
        </div>

        {/* Quick Start Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-blue-400">⚡</span> Quick Start (Local Development)
          </h2>

          <div className="space-y-6">
            {/* Prerequisites */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Prerequisites</h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">•</span> Node.js (v14+)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">•</span> MongoDB (local or Atlas cloud)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">•</span> npm or yarn
                </li>
              </ul>
            </div>

            {/* Setup Steps */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Setup Instructions</h3>
              <div className="space-y-4">
                <Step number={1} title="Start MongoDB">
                  <code className="text-sm bg-slate-900 p-2 rounded text-blue-300 block">mongod</code>
                </Step>

                <Step number={2} title="Setup Backend (Terminal 1)">
                  <div className="space-y-2">
                    <code className="text-sm bg-slate-900 p-2 rounded text-blue-300 block">cd server</code>
                    <code className="text-sm bg-slate-900 p-2 rounded text-blue-300 block">npm install</code>
                    <code className="text-sm bg-slate-900 p-2 rounded text-blue-300 block">cp .env.example .env</code>
                    <code className="text-sm bg-slate-900 p-2 rounded text-blue-300 block">npm run dev</code>
                  </div>
                </Step>

                <Step number={3} title="Setup Frontend (Terminal 2)">
                  <div className="space-y-2">
                    <code className="text-sm bg-slate-900 p-2 rounded text-blue-300 block">cd client</code>
                    <code className="text-sm bg-slate-900 p-2 rounded text-blue-300 block">npm install</code>
                    <code className="text-sm bg-slate-900 p-2 rounded text-blue-300 block">npm run dev</code>
                  </div>
                </Step>

                <Step number={4} title="Access Application">
                  <p className="text-slate-300">
                    Frontend:{" "}
                    <a
                      href="http://localhost:3000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      http://localhost:3000
                    </a>
                  </p>
                  <p className="text-slate-300">
                    Backend:{" "}
                    <a
                      href="http://localhost:5000/api/health"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      http://localhost:5000/api/health
                    </a>
                  </p>
                </Step>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <FeatureCard
            icon="⚙️"
            title="Equipment Management"
            description="Track all factory equipment with detailed specifications, status, and maintenance history"
          />
          <FeatureCard
            icon="🔧"
            title="Maintenance Scheduling"
            description="Plan preventive, corrective, and inspection maintenance with technician assignment"
          />
          <FeatureCard
            icon="🚨"
            title="Real-time Alerts"
            description="Automatic alerts for maintenance deadlines, high operating hours, and anomalies"
          />
          <FeatureCard
            icon="📊"
            title="Dashboard Overview"
            description="Real-time metrics, alert status, and maintenance statistics at a glance"
          />
        </div>

        {/* Tech Stack */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Tech Stack</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <TechBadge label="Frontend" value="React 18 + Vite" />
            <TechBadge label="Backend" value="Express.js" />
            <TechBadge label="Database" value="MongoDB" />
            <TechBadge label="Styling" value="CSS3 (Dark Theme)" />
          </div>
        </div>

        {/* File Structure */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Project Structure</h2>
          <div className="text-slate-300 text-sm font-mono space-y-1">
            <div>factory-maintenance-tracker/</div>
            <div className="ml-4">
              ├── <span className="text-blue-400">server/</span> - Express backend
            </div>
            <div className="ml-8">├── config/ - MongoDB configuration</div>
            <div className="ml-8">├── models/ - Mongoose schemas</div>
            <div className="ml-8">├── routes/ - API endpoints</div>
            <div className="ml-8">└── server.js - Main entry point</div>
            <div className="ml-4">
              ├── <span className="text-blue-400">client/</span> - React frontend
            </div>
            <div className="ml-8">├── src/components/ - UI components</div>
            <div className="ml-8">├── src/pages/ - Main pages</div>
            <div className="ml-8">├── src/styles/ - CSS styling</div>
            <div className="ml-8">└── vite.config.js - Vite configuration</div>
            <div className="ml-4">
              ├── <span className="text-blue-400">README.md</span> - Documentation
            </div>
            <div className="ml-4">
              └── <span className="text-blue-400">DEPLOYMENT.md</span> - Deploy to Vercel
            </div>
          </div>
        </div>

        {/* Deployment Section */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 border border-blue-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Deploy to Vercel</h2>
          <p className="text-slate-200 mb-6">
            When you're ready to deploy, follow the comprehensive guide in{" "}
            <span className="font-mono text-blue-300">DEPLOYMENT.md</span>
          </p>
          <div className="space-y-3">
            <p className="text-slate-300">
              <strong className="text-white">Frontend:</strong> Deploy React app directly to Vercel
            </p>
            <p className="text-slate-300">
              <strong className="text-white">Backend:</strong> Use Render.com, Railway.app, or Fly.io
            </p>
            <p className="text-slate-300">
              <strong className="text-white">Database:</strong> MongoDB Atlas (free tier available)
            </p>
          </div>
        </div>

        {/* Download Instructions */}
        <div className="mt-12 text-center">
          <p className="text-slate-300 mb-4">Download the complete project and run locally with all code included</p>
          <p className="text-sm text-slate-400">Click the "..." menu in the top right and select "Download ZIP"</p>
        </div>
      </div>
    </main>
  )
}

function Step({ number, title, children }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">
          {number}
        </div>
      </div>
      <div className="flex-grow">
        <h4 className="text-white font-semibold mb-2">{title}</h4>
        <div className="text-slate-300">{children}</div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition-colors">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  )
}

function TechBadge({ label, value }) {
  return (
    <div className="bg-slate-700 rounded-lg p-4 text-center">
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className="text-white font-semibold">{value}</p>
    </div>
  )
}
