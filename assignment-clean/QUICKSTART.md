# Quick Start Guide

## Prerequisites
- Node.js (v18 or higher)
- npm

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 2: Start Backend Server

```bash
npm start
# or for development:
npm run dev
```

The backend will start on `http://localhost:5000`

## Step 3: Install Frontend Dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

## Step 4: Start Frontend Server

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## Step 5: Access the Application

Open your browser and navigate to:
- **Dashboard**: http://localhost:3000
- **Punch In/Out**: http://localhost:3000/attendance
- **Records**: http://localhost:3000/records

## Testing the System

1. Go to the **Punch In/Out** page
2. Select an employee from the dropdown (sample employees are pre-loaded)
3. Click **Punch In** to record attendance
4. Click **Punch Out** when leaving
5. View records on the **Records** page
6. Check analytics on the **Dashboard**

## Default Business Hours

- Start Time: 9:00 AM
- Grace Period: 10 minutes

These can be updated via the settings API endpoint.

## Sample Employees

The system comes with 3 pre-loaded employees:
- John Doe (john@example.com) - ID: 1
- Jane Smith (jane@example.com) - ID: 2
- Bob Johnson (bob@example.com) - ID: 3

## Troubleshooting

- **Backend not starting**: Make sure port 5000 is not in use
- **Frontend not connecting**: Verify backend is running on port 5000
- **Database errors**: Delete `backend/attendance.db` to reset the database

