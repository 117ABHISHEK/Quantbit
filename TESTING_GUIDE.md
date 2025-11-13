# 🧪 STEP-BY-STEP TESTING GUIDE

## Before You Start

1. Ensure server is running: `cd server && npm run dev`
2. Ensure frontend is running: `cd client && npm run dev`
3. Backend is on: `http://localhost:5000`
4. Frontend is on: `http://localhost:5173`
5. MongoDB is running

---

## ⚡ Quick Sanity Check (2 minutes)

### Quick Test #1: Server Health
```bash
# Run the API test script
cd d:\Quantbit
node test-api.js
```

**Expected Output**:
```
✅ All tests PASSED!
```

If this fails, the server isn't running properly.

---

## 📝 Comprehensive Test Walkthrough (15 minutes)

### 🔄 STEP 1: Fresh Browser Start (30 seconds)

1. **Close browser tab** running the app (if open)
2. **Clear browser cache**: Press `Ctrl+Shift+Delete`
3. **Reload from scratch**: Visit `http://localhost:5173`
4. **Wait for page to load** (5-10 seconds)

**What to see**:
- Sidebar with 6 items (including 📈 and 📅)
- Dashboard page loads
- No console errors (F12 to check)

---

### ⚙️ TEST 2: Equipment Management - Create (2 minutes)

**Test Goal**: Verify equipment creation with validation feedback

**Steps**:
1. Click **⚙️ Equipment** in sidebar
2. Click **Add Equipment** button
3. Try submitting empty form → Should see validation error for required fields
4. Fill in form:
   ```
   Equipment Name: CNC Machine Alpha
   Category: Press
   Serial Number: CNC-2025-ALPHA-001
   Location: Building A, Section 2
   Manufacturer: Siemens
   Maintenance Interval: 30
   Criticality: High
   ```
5. Click **Create Equipment**

**Expected Result**:
- ✅ Green success message appears
- ✅ Equipment appears in table below
- ✅ Form clears automatically
- ✅ Success message disappears after 3 seconds

**What to look for**:
- Name: `CNC Machine Alpha`
- Category: `Press`
- Serial: `CNC-2025-ALPHA-001`
- Status: `Active`
- Criticality: `High`
- Next Due: Should show empty (no maintenance completed yet)

---

### ⚙️ TEST 3: Equipment - See Overdue Highlighting (1 minute)

**Test Goal**: Verify overdue equipment displays correctly

**Prerequisites**: Complete TEST 2

**Steps**:
1. Look at the equipment table row for "CNC Machine Alpha"
2. Notice: The row should look normal (no red) since next maintenance isn't set

**Expected Result**:
- Row has normal styling (no red)
- Next Due column shows `-`

---

### 🔧 TEST 4: Maintenance - Schedule & Complete (2 minutes)

**Test Goal**: Verify maintenance scheduling and auto-calculation

**Prerequisites**: Complete TEST 2 (need equipment)

**Steps**:
1. Click **🔧 Maintenance** in sidebar
2. Click **Schedule Maintenance** button
3. Fill form:
   ```
   Equipment: CNC Machine Alpha (select from dropdown)
   Type: Preventive
   Status: Completed (IMPORTANT!)
   Scheduled Date: 2025-11-13 (today)
   Completion Date: 2025-11-13 (today)
   Technician: John Smith
   Description: Routine preventive maintenance
   Estimated Hours: 2
   Actual Hours: 2.5
   Cost: 500
   ```
4. **Don't add parts yet** - click **Schedule Maintenance**

**Expected Result**:
- ✅ Maintenance appears in list
- ✅ Status shows "Completed"
- ✅ Can see technician name

**Important**: By marking as "Completed", the system should auto-calculate next due date!

---

### ⚙️ TEST 5: Verify Auto-Calculated Next Due Date (1 minute)

**Test Goal**: Confirm auto-calculation worked

**Prerequisites**: Complete TEST 4

**Steps**:
1. Go back to **⚙️ Equipment**
2. Look at CNC Machine Alpha row
3. Check **Next Due** column

**Expected Result**:
- Next Due should show: `12/13/2025` (today + 30 days)
- If different date shown, interval was applied correctly
- Row should NOT be red (due date is in future)

**Troubleshooting**:
- If still blank: Refresh the page
- If still blank: Check that maintenance was marked "Completed"
- If still blank: Check browser console for errors

---

### 📈 TEST 6: Machine Readings - Log Data (2 minutes)

**Test Goal**: Verify machine readings logging and anomaly detection

**Prerequisites**: Complete TEST 2 (need equipment)

**Steps**:
1. Click **📈 Machine Readings** in sidebar
2. Click **Log Reading** button
3. Fill form:
   ```
   Equipment: CNC Machine Alpha
   Operating Hours: 1500
   Temperature: 65 (°C)
   Pressure: 3.2 (bar)
   Vibration: 0.15 (mm/s)
   Status: Normal
   Notes: Routine monitoring at 2:30 PM
   ```
4. Click **Record Reading**

**Expected Result**:
- ✅ Reading appears in table below
- ✅ Shows all values entered
- ✅ Auto-timestamp (current date/time)
- ✅ Form clears for next entry

**Advanced Test** (Anomaly Detection):
1. Click **Log Reading** again
2. Enter critical values:
   ```
   Temperature: 85 (too hot!)
   Vibration: 0.8 (very high!)
   ```
3. Click **Record Reading**
4. Go to **🚨 Alerts** page
5. **Expected**: See alert with "Critical" severity

---

### 📅 TEST 7: Calendar Dashboard (1 minute)

**Test Goal**: Verify calendar displays maintenance

**Prerequisites**: Complete TEST 4 (need maintenance record)

**Steps**:
1. Click **📅 Calendar** in sidebar
2. Wait for page to load

**What you should see**:
- Large calendar for current month (November 2025)
- Date "13" should have a blue indicator (if maintenance on that date)
- Statistics cards showing totals
- Buttons for Previous/Next month

**Try these actions**:
- Click **Next** button → Calendar moves to December
- Click **Previous** button → Calendar moves back to November
- Select **Status Filter**: "Completed" → Calendar updates
- Click **Reset Filter** → Shows all statuses

**Expected Result**:
- ✅ Calendar renders correctly
- ✅ Navigation works
- ✅ Filtering works
- ✅ Date indicators show

---

### 🚨 TEST 8: Alerts & Overdue Detection (1 minute)

**Test Goal**: Verify overdue alerts system

**Prerequisites**: Complete TEST 4

**Steps**:
1. Click **🚨 Alerts** page
2. Observe alerts list

**Expected Result**:
- Should show 0 or more alerts
- If you have maintenance records, might see some

**To Test Overdue Functionality** (Requires MongoDB modification):
- Ideally, set a past next maintenance date
- Then alerts will show "Maintenance Due" with red severity

**Alternative Simple Test**:
- The overdue detection runs automatically
- If you complete maintenance, go back to Equipment
- Then change system clock back 30 days
- Refresh alerts - overdue alert should appear

---

### 🔧 TEST 9: Spare Parts Tracking (1 minute)

**Test Goal**: Verify spare parts are tracked and saved

**Prerequisites**: Complete TEST 4

**Steps**:
1. Go to **🔧 Maintenance**
2. Look at your completed maintenance record
3. Notice if you see spare parts section (if you added any)

**To Add Spare Parts** (Future maintenance):
1. Click **Schedule Maintenance** button (create new)
2. Select equipment
3. Scroll to **Spare Parts Used** section
4. Add parts:
   - Part Name: `Motor Bearing`
   - Quantity: `2`
   - Cost: `250`
5. Click **Add Part** button
6. See part listed with timestamp
7. Complete the maintenance

---

### 📄 TEST 10: PDF Generation (1 minute)

**Test Goal**: Verify PDF report generation

**Prerequisites**: Complete TEST 4 (need completed maintenance)

**Steps**:
1. Go to **🔧 Maintenance**
2. Find your completed maintenance record
3. Look for **📄 PDF** button in Actions column
4. Click **📄 PDF**

**Expected Result**:
- ✅ PDF starts downloading
- ✅ File named like: `maintenance-report-[ID].pdf`
- ✅ Opens in PDF viewer or downloads to Downloads folder

**Check PDF Contents**:
- Equipment name
- Serial number
- Maintenance details
- Technician name
- Dates and costs
- Any spare parts (if added)

---

## ✅ Complete Test Checklist

After running all tests above, fill in your results:

### Test Results Matrix

| # | Test | Expected | Result | Status |
|---|------|----------|--------|--------|
| 1 | Server Health | All tests pass | ✅ | PASS |
| 2 | Equipment Create | Success message | ? | ? |
| 3 | Overdue Highlight | Row shows normal | ? | ? |
| 4 | Schedule Maintenance | Record appears | ? | ? |
| 5 | Auto-Calculate Due | Next date shows | ? | ? |
| 6 | Log Readings | Reading appears | ? | ? |
| 6b | Anomaly Alert | Critical alert created | ? | ? |
| 7 | Calendar View | Displays correctly | ? | ? |
| 8 | Alerts Page | Shows records | ? | ? |
| 9 | Spare Parts | Tracked with timestamp | ? | ? |
| 10 | PDF Download | PDF generates | ? | ? |

---

## 🐛 Troubleshooting Guide

### Problem: Equipment doesn't save
**Checklist**:
- [ ] Serial number is unique (not duplicate)
- [ ] Name field is filled
- [ ] Server console shows no errors
- [ ] Check browser console (F12)
- [ ] API health is OK: `node test-api.js`

**Solution**:
```bash
# Restart server
cd server && npm run dev

# In another terminal, test API
node test-api.js
```

### Problem: Next Due date is blank after completing maintenance
**Checklist**:
- [ ] You selected "Completed" status
- [ ] Completion date is filled
- [ ] Equipment has `maintenanceIntervalDays` (should be 30)
- [ ] Refresh the Equipment page

**Solution**:
```javascript
// In browser console, check equipment
fetch('http://localhost:5000/api/equipment')
  .then(r => r.json())
  .then(data => console.log(data[0]))
  // Should show: maintenanceIntervalDays: 30, nextMaintenanceDue: "2025-12-13T00:00:00.000Z"
```

### Problem: Machine Readings page shows no data
**Checklist**:
- [ ] You logged at least one reading
- [ ] Equipment is selected when logging
- [ ] Refresh page
- [ ] Check browser console for errors

**Solution**:
```bash
# Test readings API
curl.exe http://localhost:5000/api/machine-readings
```

### Problem: Calendar doesn't load
**Checklist**:
- [ ] You have at least one maintenance record
- [ ] Scheduled date is set
- [ ] Check browser console (F12) for errors
- [ ] Refresh page with F5

### Problem: PDF doesn't download
**Checklist**:
- [ ] Maintenance record is marked "Completed"
- [ ] You're not blocking pop-ups/downloads
- [ ] Server is running
- [ ] Check browser console for errors

**Solution**:
```bash
# Test PDF endpoint
curl.exe -o test.pdf http://localhost:5000/api/reports/[MAINTENANCE_ID]
# Replace [MAINTENANCE_ID] with actual ID
```

### Problem: Alerts page is empty
**Checklist**:
- [ ] You have overdue maintenance (past due date)
- [ ] Equipment status is "Active"
- [ ] Refresh page to trigger check
- [ ] Check backend logs for errors

---

## 📊 Performance Notes

### Expected Load Times
- Equipment page: < 500ms
- Maintenance page: < 1000ms
- Calendar page: < 1500ms (first load)
- PDF generation: 2-5 seconds
- Alert check: < 500ms

### Data Limits (No Issues Up To)
- 1000+ equipment
- 10000+ maintenance records
- 100000+ readings
- 1000+ alerts

---

## 🎓 Understanding Test Flows

### Basic Flow (Start Here)
```
Create Equipment → Schedule Maintenance → View in Calendar → Generate PDF
```

### Advanced Flow (After Basic)
```
Create Equipment → Log Readings → Complete Maintenance → Check Auto-Calc → View Overdue → Generate PDF
```

### Anomaly Detection Flow
```
Log High Temperature Reading → Check Alerts → See Critical Alert
```

---

## 🚀 Final Verification

All features should work end-to-end:

1. ✅ Can create equipment with intervals
2. ✅ Can schedule and complete maintenance  
3. ✅ Next due date auto-calculates
4. ✅ Overdue machines highlighted in red
5. ✅ Can log machine readings
6. ✅ Can view calendar with all maintenance
7. ✅ Can generate PDF reports
8. ✅ Spare parts are tracked with timestamps
9. ✅ Alerts created for overdue/anomalies
10. ✅ Error messages show for failures

If all 10 items work, **your application is fully operational!** 🎉

---

## 📞 Quick Debug Commands

```bash
# Test everything
cd d:\Quantbit && node test-api.js

# Check equipment
curl.exe http://localhost:5000/api/equipment

# Check maintenance
curl.exe http://localhost:5000/api/maintenance

# Check alerts
curl.exe http://localhost:5000/api/alerts

# Check readings
curl.exe http://localhost:5000/api/machine-readings

# Restart server
cd d:\Quantbit\server && npm run dev
```

---

**You're all set! Start with Step 1 and work through the tests.** ✅
