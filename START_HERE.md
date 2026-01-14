# 🚀 Quick Start Guide - Apartment Manager

## Prerequisites Installed ✅
- .NET 8 SDK
- Node.js
- All dependencies installed

## Step 1: Start the Backend API

Open a terminal and run:

```bash
cd backend/ApartmentManager.API
dotnet run
```

**Wait for this message:**
```
Now listening on: http://localhost:5082
```

✅ Backend is ready when you see this!

**To verify backend is working:**
- Open: http://localhost:5082/swagger
- You should see Swagger UI with all API endpoints

---

## Step 2: Start the Frontend

Open a **NEW** terminal (keep backend running) and run:

```bash
cd frontend
npm run dev
```

**Wait for this message:**
```
Local: http://localhost:5173/
```

✅ Frontend is ready!

---

## Step 3: Use the Application

1. **Open your browser:** http://localhost:5173

2. **Register a new user:**
   - Click "Register" or go to http://localhost:5173/register
   - Enter email: `admin@test.com`
   - Enter password: `password123` (minimum 6 characters)
   - Select role: `Admin`
   - Click "Register"

3. **You should be automatically logged in and redirected to the dashboard**

4. **Add your first apartment:**
   - Click "Add Apartment"
   - Enter name: `My First Apartment`
   - Enter location: `123 Main St` (optional)
   - Click "Create Apartment"

5. **Manage apartments:**
   - View all apartments on dashboard
   - Click "View Details" to see apartment info
   - Click "Delete" to remove an apartment

---

## 🧪 Testing the API with Swagger

1. Go to http://localhost:5082/swagger

2. **Test Registration:**
   - Expand `POST /api/Auth/register`
   - Click "Try it out"
   - Enter:
   ```json
   {
     "email": "test@example.com",
     "password": "password123",
     "role": "User"
   }
   ```
   - Click "Execute"
   - You should get a 200 response with user data

3. **Test Login:**
   - Expand `POST /api/Auth/login`
   - Click "Try it out"
   - Enter your credentials
   - Click "Execute"
   - Copy the `token` from the response

4. **Authorize:**
   - Click the green "Authorize" button at the top
   - Enter: `Bearer YOUR_TOKEN_HERE`
   - Click "Authorize"

5. **Now test protected endpoints:**
   - `GET /api/Apartments` - List apartments
   - `POST /api/Apartments` - Create apartment
   - etc.

---

## ⚠️ Troubleshooting

### Backend won't start
```bash
# Check if port 5082 is in use
netstat -ano | findstr :5082

# If something is using it, kill the process
taskkill //PID <PID_NUMBER> //F

# Then start again
cd backend/ApartmentManager.API
dotnet run
```

### Frontend won't start
```bash
# Check if port 5173 is in use
netstat -ano | findstr :5173

# If something is using it, kill the process
taskkill //PID <PID_NUMBER> //F

# Then start again
cd frontend
npm run dev
```

### "Network Error" when registering
1. Make sure backend is running (check http://localhost:5082/swagger)
2. Hard refresh the frontend (Ctrl+Shift+R or Cmd+Shift+R)
3. Check browser console (F12) for detailed errors

### "Email already exists" error
Try a different email address - the system doesn't allow duplicate emails.

### Can't see Swagger UI
- Make sure you're on http://localhost:5082/swagger (not http://localhost:5082)
- Backend must be running

---

## 📁 Project Structure

```
zen-booking/
├── backend/
│   ├── ApartmentManager.API/          # API Controllers & Startup
│   ├── ApartmentManager.Core/         # Business Logic & Services
│   ├── ApartmentManager.Infrastructure/  # Database & Repositories
│   ├── ApartmentManager.Shared/       # DTOs
│   └── apartment_manager.db           # SQLite Database (auto-created)
│
└── frontend/
    ├── src/
    │   ├── components/                # React Components
    │   ├── contexts/                  # Auth Context
    │   ├── pages/                     # Page Components
    │   ├── services/                  # API Client
    │   └── types/                     # TypeScript Types
    └── package.json
```

---

## 🎯 What's Working

✅ **Backend:**
- User registration & login (JWT)
- Apartment CRUD operations
- Protected API endpoints
- SQLite database
- Swagger documentation

✅ **Frontend:**
- Login & Registration pages
- Protected routes
- Dashboard with apartment list
- Create apartment form
- JWT token management
- Responsive UI

---

## 🔗 Important URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5082
- **Swagger UI:** http://localhost:5082/swagger
- **Database:** `backend/ApartmentManager.API/apartment_manager.db`

---

## 🎓 Next Steps (Optional Enhancements)

The core system is complete! You can extend it with:

1. **Income Management Pages:**
   - Create income entry form
   - List incomes per apartment
   - Edit/delete income entries

2. **Expense Management Pages:**
   - Create expense entry form
   - List expenses per apartment
   - Category filtering

3. **Summary & Reports:**
   - Monthly profit/loss view
   - Yearly summary tables
   - Charts and graphs

4. **Additional Features:**
   - Search and filter apartments
   - Export to PDF/Excel
   - Email notifications
   - Recurring income/expense templates

The foundation is solid - all the backend APIs are ready to use!

---

## 💡 Tips

- Keep both terminals open (backend + frontend)
- Backend logs show all API requests
- Use browser DevTools (F12) to debug frontend issues
- Test APIs in Swagger first before using frontend
- Database is auto-created on first run

---

## 🆘 Need Help?

1. Check that both servers are running
2. Look at terminal logs for errors
3. Check browser console (F12)
4. Test APIs in Swagger
5. Verify database file exists: `backend/ApartmentManager.API/apartment_manager.db`

Happy coding! 🎉
