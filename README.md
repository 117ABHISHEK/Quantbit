# Smart Factory Maintenance Tracker

A full-stack web application for managing factory equipment, scheduling maintenance, tracking spare-parts, logging machine readings, and generating reports. Built with React (Vite), Express, and MongoDB.

## What’s new / Key Features

- Equipment Management: register and manage equipment (serial, location, criticality, operating hours).
- Maintenance Scheduling: schedule preventive, corrective, and inspection maintenance; record parts used.
- Machine Readings: log daily readings (temperature, pressure, vibration, runtime hours).
- Auto-calculated Maintenance: server computes `nextMaintenanceDue` and `maintenanceStatus` (OK / Due Soon / Overdue).
- Visual Indicators: dashboard and equipment list highlight overdue machines (red), due-soon (amber), and OK (green).
- PDF Reports: generate downloadable PDF reports that include equipment summary, maintenance history (with parts), and recent readings. Supports date-range and equipment filters.
- Maintenance Calendar: simple calendar view grouping maintenance by scheduled date.

## Tech Stack

- Frontend: React 18, Vite, CSS3
- Backend: Express.js, Node.js
- Database: MongoDB (Mongoose)

## Quick Start (local development)

Prerequisites: Node.js (v14+), MongoDB (local or Atlas), npm or pnpm.

1) Start MongoDB (local) or configure Atlas and set `MONGODB_URI` in `server/.env`.

2) Start the backend:

```powershell
cd D:\Quantbit\server
npm install
# create .env (or copy .env.example) and set MONGODB_URI and PORT if needed
npm run dev
# or: node server.js
```

3) Start the frontend (Vite):

```powershell
cd D:\Quantbit\client
npm install
npm run dev
# open the URL Vite shows (usually http://localhost:5173)
```

Note: if port 5000 is in use, either stop the process using it or start the server with a different PORT, e.g. `powershell $env:PORT=5001; node server.js`.

## App Navigation (client)

- Dashboard — overview metrics and alerts
- Equipment — add/edit/delete equipment, log readings, view maintenance status
- Maintenance — schedule maintenance and record parts used
- Calendar — grouped maintenance view by date
- Reports — generate and download maintenance PDF reports (filter by date and equipment)

## API Endpoints (important additions)

### Equipment
- `GET /api/equipment` — Get all equipment (each item includes `maintenanceStatus` and `nextMaintenanceDue`)
- `GET /api/equipment/:id`
- `POST /api/equipment` — Create equipment (server computes `nextMaintenanceDue` when possible)
- `PUT /api/equipment/:id`
- `DELETE /api/equipment/:id`

### Maintenance
- `GET /api/maintenance` — Get all maintenance records
- `GET /api/maintenance/status/:status` — Get maintenance by status
- `POST /api/maintenance` — Create maintenance record (body can include `partsUsed` array)
- `PUT /api/maintenance/:id` — Update maintenance
- `DELETE /api/maintenance/:id`

### Machine Readings
- `GET /api/machine-readings` — Get readings (supports `?equipmentId=`)
- `POST /api/machine-readings` — Create a new machine reading

### Reports
- `GET /api/reports/pdf` — Generate PDF

Query parameters supported:
- `from=YYYY-MM-DD` (optional)
- `to=YYYY-MM-DD` (optional)
- `equipmentId=<id>` or `equipmentId=id1,id2` (optional)

Example: `/api/reports/pdf?from=2025-11-01&to=2025-11-30&equipmentId=615c...`

## Generating Reports (UI)

Use the Reports page in the app to pick a date range and/or equipment, then click "Generate PDF". The browser will download a file containing:

- Equipment summary and next scheduled maintenance
- Maintenance history (with `partsUsed` details)
- Recent machine readings in the selected date range

## Styling and Theme

The project uses CSS variables defined at `client/src/index.css`. The current color palette uses the following variables (feel free to edit):

```css
/* Primary Colors */
--primary: #2563eb;
--primary-dark: #1e40af;
--primary-light: #3b82f6;

/* Background */
--bg-primary: #0f172a;
--bg-secondary: #1e293b;
--bg-card: #334155;

/* Status Colors */
--success: #10b981;
--warning: #f59e0b;
--danger: #ef4444;
--info: #06b6d4;

/* Text */
--text-primary: #f8fafc;
--text-secondary: #cbd5e1;
--text-muted: #94a3b8;

/* Accent */
--accent: #8b5cf6;
```

The CSS file also provides legacy mappings (`--background`, `--surface`, `--border`, etc.) so existing styles will work immediately.

## Troubleshooting

- Backend not connecting to MongoDB: check `MONGODB_URI` and that MongoDB is reachable.
- PDF generation slow or memory-heavy: for large datasets, generate Reports using smaller date ranges or specific equipment IDs.
- Client routes return blank when directly visiting a URL: the server includes an SPA fallback for production builds; in development use the Vite dev server.

## Next Steps / Roadmap

- Harden server-side validation (enforce max lengths and required fields)
- Add authentication and role-based access control
- Improve calendar with a full calendar grid (FullCalendar) and drag/drop scheduling
- Add export presets and scheduled reports (email)

## License

MIT
