# Apartment Income & Expense Manager

A full-stack apartment management system for tracking rental income and expenses.

## Tech Stack

**Backend:**
- ASP.NET Core Web API (.NET 8)
- Entity Framework Core
- SQLite Database
- JWT Authentication

**Frontend:**
- React 18 with TypeScript
- Vite
- React Router
- Axios

## Features

- User registration and login (JWT authentication)
- Apartment management (CRUD operations)
- Income tracking per apartment
- Expense tracking with categories
- Monthly and yearly financial summaries
- Profit/loss calculations

## Project Structure

```
├── backend/
│   ├── ApartmentManager.API/         # Web API Controllers
│   ├── ApartmentManager.Core/        # Business Logic & Entities
│   ├── ApartmentManager.Infrastructure/  # Data Access & Repositories
│   ├── ApartmentManager.Shared/      # DTOs
│   └── apartment_manager.db          # SQLite Database
└── frontend/
    └── src/
        ├── components/               # React Components
        ├── contexts/                 # Auth Context
        ├── pages/                    # Page Components
        ├── services/                 # API Service
        └── types/                    # TypeScript Types
```

## Getting Started

### Prerequisites

- .NET 8 SDK
- Node.js (v18+)
- npm

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Restore packages:
   ```bash
   dotnet restore
   ```

3. Run the API:
   ```bash
   cd ApartmentManager.API
   dotnet run
   ```

The API will be available at `http://localhost:5082`
Swagger documentation: `http://localhost:5082/swagger`

### Frontend Setup

1. Navigate to frontend directory:
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

The app will be available at `http://localhost:5173`

## Usage

1. **Register**: Create a new account (Admin or User role)
2. **Login**: Sign in with your credentials
3. **Add Apartments**: Create apartments to track
4. **Track Income**: Add rental income for each apartment
5. **Track Expenses**: Record expenses by category
6. **View Summaries**: See monthly and yearly profit/loss reports

## API Endpoints

### Authentication
- `POST /api/Auth/register` - Register new user
- `POST /api/Auth/login` - Login and get JWT token

### Apartments
- `GET /api/Apartments` - Get all apartments
- `POST /api/Apartments` - Create apartment
- `PUT /api/Apartments/{id}` - Update apartment
- `DELETE /api/Apartments/{id}` - Delete apartment

### Income
- `GET /api/Incomes/apartment/{apartmentId}` - Get incomes
- `POST /api/Incomes` - Create income
- `PUT /api/Incomes/{id}` - Update income
- `DELETE /api/Incomes/{id}` - Delete income

### Expenses
- `GET /api/Expenses/apartment/{apartmentId}` - Get expenses
- `POST /api/Expenses` - Create expense
- `PUT /api/Expenses/{id}` - Update expense
- `DELETE /api/Expenses/{id}` - Delete expense

### Summary
- `GET /api/Summary/monthly/{apartmentId}/{year}/{month}` - Monthly summary
- `GET /api/Summary/yearly/{year}` - Yearly summary

## Database

The application uses SQLite for local storage. The database file (`apartment_manager.db`) is created automatically in the API project directory when you first run the application.

### Database Schema

- **Users**: User accounts with roles
- **Apartments**: Apartment listings
- **Incomes**: Rental income records
- **Expenses**: Expense records with categories

All tables include:
- Primary keys (auto-increment)
- Foreign key relationships
- Created timestamps
- Proper indexing

## Security

- Passwords are hashed using BCrypt
- JWT tokens for authentication
- Token stored in localStorage
- Protected API routes require valid JWT
- CORS configured for local development

## Development Notes

- The API runs on port 5082
- The frontend runs on port 5173
- Both must be running for the app to work
- Database is created automatically on first run
- JWT secret key should be changed in production

## Future Enhancements

- Income and expense editing/viewing pages
- Advanced filtering and search
- Charts and graphs for visualizations
- PDF report generation
- Multi-tenant support
- Email notifications
- Recurring income/expense templates

## License

This project is for personal use.
