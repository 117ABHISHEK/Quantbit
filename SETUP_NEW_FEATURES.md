# Installation & Setup Guide for New Features

## 📦 Prerequisites

- Node.js v14+ 
- MongoDB (local or Atlas)
- npm or yarn

## 🔧 Installation Steps

### Step 1: Backend Setup

Navigate to the server directory and install new dependencies:

```bash
cd server
npm install
```

This installs:
- `pdfkit` - For PDF report generation

### Step 2: Frontend Setup

Navigate to the client directory and ensure dependencies are installed:

```bash
cd client
npm install
```

This includes:
- `react-datepicker` - For date selection
- `date-fns` - For date formatting

### Step 3: Database Migration (Optional)

The new features are backward compatible. No migration needed, but you can initialize new fields:

```bash
# Start MongoDB
mongod

# In another terminal, start the server
cd server
npm run dev
```

The application will automatically:
- Add `maintenanceIntervalDays` (default: 30) to existing equipment
- Add `lastMaintenanceDate` and `nextMaintenanceDue` when maintenance is completed
- Track spare parts on new maintenance records

## 🚀 Running the Application

### Terminal 1 - Backend Server
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

### Terminal 2 - Frontend Application
```bash
cd client
npm run dev
# Frontend runs on http://localhost:3000 (or http://localhost:5173 with Vite)
```

### Terminal 3 - MongoDB (if running locally)
```bash
mongod
# MongoDB runs on mongodb://localhost:27017
```

## 📱 Accessing New Features

Once both servers are running, new features are available at:

1. **Machine Readings** (Daily Sensor Logs)
   - URL: `http://localhost:3000/machine-readings`
   - Features:
     - Log operating hours, temperature, pressure, vibration
     - View readings history
     - Filter by equipment
     - Automatic anomaly alert creation

2. **Maintenance Calendar** (Visual Dashboard)
   - URL: `http://localhost:3000/maintenance-calendar`
   - Features:
     - Interactive calendar view
     - Month navigation
     - Status filtering
     - Overdue highlighting
     - Statistics cards

3. **Enhanced Maintenance Page**
   - URL: `http://localhost:3000/maintenance`
   - New features:
     - Add spare parts to maintenance records
     - Track part usage (name, qty, cost)
     - View all parts used in history
     - Download PDF reports

4. **Auto-calculated Maintenance Due Dates**
   - When equipment is set up, set `maintenanceIntervalDays`
   - When maintenance is completed, `nextMaintenanceDue` auto-calculates
   - Visible in Equipment page

5. **Overdue Alerts**
   - Automatic alerts when maintenance is overdue
   - Alerts created with severity levels
   - View in Alerts page
   - Marked on calendar with red color

6. **PDF Reports**
   - Click 📄 PDF button on maintenance records
   - Individual maintenance report downloaded
   - Or download summary report from API

## ⚙️ Configuration

### Set Maintenance Interval (in Equipment)

When creating/editing equipment, set the maintenance interval:

```javascript
{
  name: "Motor A",
  maintenanceIntervalDays: 30,  // Every 30 days
  // ... other fields
}
```

### Environment Variables

Ensure `.env` file in server directory has:

```
MONGODB_URI=mongodb://localhost:27017/factory-maintenance
PORT=5000
NODE_ENV=development
```

## 🧪 Testing the Features

### Test 1: Log a Machine Reading
1. Go to Machine Readings page
2. Select an equipment
3. Enter operating hours (e.g., 1500)
4. Enter temperature (e.g., 75°C)
5. Click "Save Reading"
6. Verify reading appears in history table

### Test 2: Check Calendar
1. Go to Maintenance Calendar page
2. Create a maintenance record (from Maintenance page)
3. Return to Calendar
4. Verify maintenance shows on the calendar date
5. Try filtering by status

### Test 3: Add Spare Parts
1. Go to Maintenance page
2. Click "Schedule Maintenance"
3. In "Spare Parts Used" section:
   - Enter part name (e.g., "Bearing")
   - Enter quantity (e.g., 2)
   - Enter cost (e.g., 150)
   - Click "Add"
4. Submit the maintenance record
5. Verify parts appear in the list

### Test 4: Generate PDF
1. Go to Maintenance page
2. Find a maintenance record
3. Click 📄 PDF button
4. PDF downloads with report details

### Test 5: Check Overdue Alerts
1. Go to Maintenance page
2. Schedule maintenance with a past date
3. Go to Alerts page
4. Verify "Maintenance Due" alert appears

## 🔍 Troubleshooting

### Issue: "Cannot find module 'pdfkit'"
**Solution**: Run `npm install` in server directory
```bash
cd server
npm install
```

### Issue: "MachineReading is not defined"
**Solution**: Ensure `server/models/MachineReading.js` exists and server is restarted
```bash
npm run dev  # Restart the server
```

### Issue: Calendar not showing maintenance
**Solution**: 
1. Verify maintenance records exist in database
2. Check browser console for errors
3. Ensure dates are properly formatted

### Issue: PDF download fails
**Solution**:
1. Verify `pdfkit` is installed
2. Check server logs for errors
3. Ensure MongoDB is running

### Issue: Dates/Times are incorrect
**Solution**: 
1. Check system timezone
2. MongoDB should store dates in UTC
3. Frontend handles timezone conversion

## 📊 Database Verification

To verify new collections/fields were created:

```bash
# Connect to MongoDB
mongosh

# Switch to database
use factory-maintenance

# Check collections
show collections

# View sample documents
db.equipment.findOne()  # Should have nextMaintenanceDue
db.maintenance.findOne()  # Should have partsUsed array
db.machinereadings.findOne()  # Should exist
```

## 📚 API Documentation

### Get Overdue Equipment
```bash
GET http://localhost:5000/api/alerts/overdue/equipment

Response:
[
  {
    _id: "...",
    name: "Motor A",
    nextMaintenanceDue: "2025-11-01",
    status: "Active"
  }
]
```

### Download Individual PDF Report
```bash
GET http://localhost:5000/api/reports/:maintenanceId

Response: PDF file
```

### Log Machine Reading
```bash
POST http://localhost:5000/api/machine-readings

Body: {
  equipmentId: "...",
  operatingHours: 1500,
  temperature: 75,
  pressure: 100,
  vibration: 2.5,
  status: "Normal",
  notes: "Running smoothly"
}
```

## ✅ Verification Checklist

- [ ] Backend server starts without errors: `npm run dev`
- [ ] Frontend loads successfully
- [ ] Machine Readings page accessible
- [ ] Maintenance Calendar page accessible
- [ ] Can log a machine reading
- [ ] Can schedule maintenance with spare parts
- [ ] Can download PDF report
- [ ] Calendar displays maintenance events
- [ ] Overdue alerts are created
- [ ] Equipment shows next maintenance due date

## 🆘 Support

If you encounter issues:

1. Check server logs: `npm run dev` output
2. Check browser console: F12 in browser
3. Verify MongoDB connection
4. Ensure all files are created/modified correctly
5. Restart both servers after any code changes

---

**Last Updated**: November 13, 2025
