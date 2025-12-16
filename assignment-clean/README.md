# Employee Attendance System

A full-stack employee attendance tracking system with punch-in/punch-out functionality, attendance records, and analytics dashboard.

## ✨ Features

- **Attendance Tracking**: Employees can punch-in and punch-out once per day
- **Punctuality Logic**: Automatic calculation of on-time, late, or early status based on business hours
- **Attendance Records**: Filterable table with date, employee name, and punctuality status filters
- **Analytics Dashboard**: Real-time statistics with interactive cards that filter records
- **Modern UI**: Beautiful, responsive design with gradients and animations
- **MVC Architecture**: Clean, modular backend structure

## 🛠 Tech Stack

### Backend
- Node.js with Express
- SQLite database
- MVC architecture (Models, Routes, Controllers)
- RESTful API

### Frontend
- Next.js 16 (JavaScript)
- React Hook Form with Yup validation
- Tailwind CSS with gradients and modern design
- React DatePicker
- Axios for API calls

## 📁 Project Structure

### Backend Structure (MVC)
```
backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── analyticsController.js
│   ├── attendanceController.js
│   ├── employeeController.js
│   └── settingsController.js
├── models/
│   ├── Attendance.js
│   ├── Employee.js
│   └── Settings.js
├── routes/
│   ├── analyticsRoutes.js
│   ├── attendanceRoutes.js
│   ├── employeeRoutes.js
│   └── settingsRoutes.js
├── utils/
│   └── punctuality.js        # Punctuality calculation helpers
└── server.js                 # Main server file
```

### Frontend Structure
```
frontend/
├── app/
│   ├── attendance/
│   │   └── page.js          # Punch in/out page
│   ├── records/
│   │   └── page.js          # Records table page
│   ├── layout.js            # Root layout
│   └── page.js              # Dashboard
├── components/
│   └── Navigation.js        # Navigation component
└── lib/
    └── api.js               # API utility functions
```

## 🚀 Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create a new employee

### Attendance
- `POST /api/attendance/punch-in` - Punch in for an employee
- `POST /api/attendance/punch-out` - Punch out for an employee
- `GET /api/attendance` - Get attendance records with filters
  - Query params: `date`, `employee_name`, `punctuality_status`
- `GET /api/attendance/status/:employee_id` - Get current attendance status

### Analytics
- `GET /api/analytics` - Get analytics data
  - Returns: total_employees, present_today, on_time_count, late_count, attendance_rate

### Settings
- `GET /api/settings` - Get business hours settings
- `PUT /api/settings` - Update business hours settings
  - Body: `{ business_hours_start, grace_period_minutes }`

## ⚙️ Default Settings

- Business hours start: **9:00 AM**
- Grace period: **10 minutes**

## 📊 Punctuality Rules

- **Early**: Punch-in before business hours start (before 9:00 AM)
- **On-Time**: Punch-in between business hours start and grace period end (9:00 AM - 9:10 AM)
- **Late**: Punch-in after grace period (after 9:10 AM)

### Example:
- Business hours: 9:00 AM
- Grace period: 10 minutes
- Punch-in at **8:55 AM** → **Early** ✅
- Punch-in at **9:05 AM** → **On-Time** ✅
- Punch-in at **9:15 AM** → **Late** ⚠️

## 🎨 UI Features

- **Dashboard**: 
  - Interactive analytics cards with gradients
  - Real-time data updates
  - Click cards to filter records
  - Quick action buttons
  - Business hours information

- **Punch In/Out Page**:
  - Live clock display
  - Employee selection dropdown
  - Real-time status updates
  - Visual status badges
  - Large, accessible buttons

- **Records Page**:
  - Advanced filtering (date, name, status)
  - Beautiful data table
  - Responsive design
  - Empty state handling

## 📝 Sample Data

The system comes with 3 pre-loaded sample employees:
- John Doe (john@example.com) - ID: 1
- Jane Smith (jane@example.com) - ID: 2
- Bob Johnson (bob@example.com) - ID: 3

## 🎯 Usage

1. **Dashboard**: View real-time analytics and click cards to filter records
2. **Punch In/Out**: Select an employee and record attendance
3. **Records**: View and filter all attendance records with multiple criteria

## 🔧 Development

The backend follows MVC architecture for better code organization:
- **Models**: Database operations
- **Controllers**: Business logic
- **Routes**: API endpoint definitions
- **Utils**: Helper functions

All code is modular, reusable, and follows best practices.
