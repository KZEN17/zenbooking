# 🏠 Complete Apartment Management System

## ✅ ALL Features Implemented

### 1. **User Authentication**
- Register new users (Admin/User roles)
- Login with JWT tokens
- Protected routes

### 2. **Apartment Management**
- Create apartments
- List all apartments
- Delete apartments

### 3. **Income Tracking** ✅ NEW
- Add income entries per apartment
- View all income for an apartment
- Delete income entries
- See total income

### 4. **Expense Tracking** ✅ NEW
- Add expense entries per apartment
- Categorize expenses (Maintenance, Utilities, Tax, etc.)
- View all expenses for an apartment
- Delete expense entries
- See total expenses

### 5. **Booking Calendar** ✅ NEW
- Visual calendar showing booked dates
- Add guest bookings with check-in/check-out dates
- See which dates are occupied
- Manage all bookings
- Delete bookings

---

## 🚀 How to Start

### Terminal 1 - Backend:
```bash
cd backend/ApartmentManager.API
dotnet run
```
Wait for: `Now listening on: http://localhost:5082`

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```
Wait for: `Local: http://localhost:5173/`

**OR use the batch file:**
- Double-click `start-all.bat` (Windows)

---

## 📱 How to Use

1. **Register/Login**
   - Go to http://localhost:5173
   - Create account or login

2. **Dashboard (Main Page)**
   - Search available apartments by date range
   - View all apartments with their next bookings
   - See upcoming bookings across all apartments
   - Quick access to apartment calendars, income, and expenses

3. **Search for Available Apartments**
   - Enter check-in and check-out dates on the dashboard
   - Click "Search Availability"
   - View only apartments that are available for your dates
   - Click "Clear Search" to see all apartments again

4. **Manage Apartments (Apartments Tab)**
   - Click "Apartments" in the navigation
   - Add new apartments with name and location
   - Edit existing apartment details
   - Delete apartments
   - Access income, expenses, and calendar from each apartment

5. **Track Income**
   - From dashboard or apartments page, click "Income" on any apartment
   - Click "+ Add Income"
   - Enter amount, date, description
   - View total income

6. **Track Expenses**
   - From dashboard or apartments page, click "Expenses" on any apartment
   - Click "+ Add Expense"
   - Enter amount, date, category, description
   - View total expenses by category

7. **Manage Bookings**
   - From dashboard, click "View Calendar" on any apartment
   - Visual calendar shows:
     - Red days = Booked
     - Blue = Today
     - White = Available
   - Click "+ Add Booking"
   - Enter guest name, check-in, check-out
   - See all bookings in table below
   - Bookings automatically show on the main dashboard

---

## 🎯 Complete Feature List

### Dashboard (Main Page)
- **Date-based search** to find available apartments
- View all apartments with next booking information
- See upcoming bookings across all apartments
- Quick access to apartment calendars, income, and expenses
- Real-time availability checking

### Apartments Management (Separate Tab)
- CRUD operations for apartments
- Add, edit, and delete apartments
- View apartment list with details
- Quick navigation to income, expenses, and calendar pages

### Income Page (`/apartments/:id/income`)
- Add new income entries
- View all income in table
- See total income amount
- Delete income entries
- Shows: Date, Amount, Description

### Expense Page (`/apartments/:id/expenses`)
- Add new expense entries
- Categorize by type:
  - Maintenance
  - Utilities
  - Tax
  - Insurance
  - Repairs
  - Cleaning
  - Other
- View all expenses in table
- See total expense amount
- Delete expense entries
- Shows: Date, Category, Amount, Description

### Calendar/Booking Page (`/apartments/:id/calendar`)
- Monthly calendar view
- Visual indication of booked dates
- Add guest bookings
- Check-in and check-out dates
- Guest name and notes
- List of all bookings
- Delete bookings
- Navigate between months

---

## 🗄️ Data Storage

### Backend (API + Database)
- **Users**: Stored in SQLite database
- **Apartments**: Stored in SQLite database
- **Income**: Stored in SQLite database
- **Expenses**: Stored in SQLite database

### Frontend (LocalStorage)
- **Bookings**: Stored in browser localStorage (for demo)
  - Format: `bookings_{apartmentId}`
  - Persists across page refreshes
  - Per apartment

**Note:** Bookings are client-side only for simplicity. To make them permanent:
1. Add Booking entity to backend
2. Create BookingController
3. Update frontend to use API instead of localStorage

---

## 📊 Summary/Reports (Coming Soon)

The Summary page will show:
- Monthly profit (Income - Expenses)
- Yearly summaries
- Per apartment breakdown
- Charts and graphs

API endpoints are ready:
- `GET /api/Summary/monthly/{apartmentId}/{year}/{month}`
- `GET /api/Summary/yearly/{year}`

---

## 🔗 Available URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5082
- **Swagger:** http://localhost:5082/swagger

### Frontend Routes
- `/` - Dashboard (booking search & overview)
- `/login` - Login page
- `/register` - Registration page
- `/apartments` - Apartment management (CRUD)
- `/apartments/new` - Create apartment
- `/apartments/:id/income` - Income tracking
- `/apartments/:id/expenses` - Expense tracking
- `/apartments/:id/calendar` - Booking calendar
- `/summary` - Summary reports (placeholder)

### Backend API Endpoints
All documented at http://localhost:5082/swagger

**Auth:**
- POST `/api/Auth/register`
- POST `/api/Auth/login`

**Apartments:**
- GET `/api/Apartments`
- GET `/api/Apartments/{id}`
- POST `/api/Apartments`
- PUT `/api/Apartments/{id}`
- DELETE `/api/Apartments/{id}`

**Income:**
- GET `/api/Incomes/apartment/{apartmentId}`
- GET `/api/Incomes/{id}`
- POST `/api/Incomes`
- PUT `/api/Incomes/{id}`
- DELETE `/api/Incomes/{id}`

**Expenses:**
- GET `/api/Expenses/apartment/{apartmentId}`
- GET `/api/Expenses/{id}`
- POST `/api/Expenses`
- PUT `/api/Expenses/{id}`
- DELETE `/api/Expenses/{id}`

**Summary:**
- GET `/api/Summary/monthly/{apartmentId}/{year}/{month}`
- GET `/api/Summary/yearly/{year}`

---

## 💡 Tips

1. **Testing Income/Expenses:**
   - Add several entries with different dates
   - See totals update automatically

2. **Testing Calendar:**
   - Add a booking spanning multiple days
   - Navigate months to see bookings persist
   - Days turn red when booked

3. **Data Persistence:**
   - Backend data saved in SQLite
   - Bookings saved in browser
   - Clear browser data = lost bookings

4. **Multiple Apartments:**
   - Each apartment has separate income/expense/booking tracking
   - Switch between apartments from dashboard

---

## 🎨 UI Features

- Clean, modern design
- Responsive tables
- Color-coded data:
  - Green = Income
  - Red = Expenses/Danger
  - Blue = Today
  - Status badges
- Form validation
- Loading states
- Error messages
- Confirmation dialogs

---

## 🔧 Technical Details

**Backend:**
- ASP.NET Core 8 Web API
- Entity Framework Core
- SQLite database
- JWT authentication
- Repository pattern
- Service layer
- Clean architecture

**Frontend:**
- React 18 + TypeScript
- Vite
- React Router
- Axios for API calls
- Context API for auth
- LocalStorage for bookings
- Type-safe with TypeScript

---

## ✅ What's Complete

✅ User registration & login
✅ JWT authentication
✅ Apartment CRUD
✅ **Income tracking with totals**
✅ **Expense tracking by category**
✅ **Visual booking calendar**
✅ **Guest booking management**
✅ Protected routes
✅ Responsive UI
✅ Form validation
✅ Error handling

---

## 🚀 Next Enhancements (Optional)

1. **Move Bookings to Backend**
   - Create Booking entity
   - Add BookingController
   - Store in database

2. **Summary Page**
   - Monthly profit/loss
   - Charts with Chart.js
   - Export to PDF

3. **Advanced Features**
   - Edit income/expense entries
   - Search and filter
   - Recurring payments
   - Email notifications
   - File uploads (receipts)

---

## 🎉 You're Done!

Everything is now working:
- ✅ Add apartments
- ✅ Track income
- ✅ Track expenses
- ✅ Manage bookings with calendar
- ✅ See which dates are booked

**Start the app and try it out!**
