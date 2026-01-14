# Zen Booking - Cloud Deployment Guide

Deploy your Zen Booking app to the cloud for **100% FREE** using Vercel + Koyeb!

## Architecture

```
Frontend (React)     → Vercel (Free)
Backend (.NET API)   → Koyeb (Free - 1 web service)
Database (PostgreSQL)→ Koyeb (Free - 1 database)
```

---

## Prerequisites

- GitHub account
- Vercel account (sign up at vercel.com)
- Koyeb account (sign up at koyeb.com)

---

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub

```bash
# Initialize git if not already done
cd "c:\Users\ZLATKO NIKOLOSKI\OneDrive\Desktop\Github\zen-booking"
git init
git add .
git commit -m "Initial commit - Zen Booking app"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/zen-booking.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Koyeb

### 2.1 Create Koyeb Account
1. Go to https://www.koyeb.com
2. Sign up (free, no credit card required)
3. Verify your email

### 2.2 Create PostgreSQL Database
1. In Koyeb dashboard, click **"Create Database"**
2. Select **PostgreSQL**
3. Choose **"Free tier"**
4. Name it: `zen-booking-db`
5. Click **"Create Database"**
6. **SAVE** the connection string (you'll need this!)

### 2.3 Deploy Backend Service
1. Click **"Create Service"**
2. Select **"GitHub"** as source
3. Connect your GitHub account
4. Select repository: `zen-booking`
5. Configure:
   - **Name**: `zen-booking-api`
   - **Builder**: Docker
   - **Dockerfile path**: `backend/Dockerfile`
   - **Port**: 8080
   - **Region**: Choose closest to you

### 2.4 Set Environment Variables

Click **"Environment variables"** and add:

```
ConnectionStrings__DefaultConnection=<YOUR_KOYEB_POSTGRES_CONNECTION_STRING>
JwtSettings__SecretKey=YOUR_SUPER_SECRET_JWT_KEY_CHANGE_THIS
JwtSettings__Issuer=ZenBooking
JwtSettings__Audience=ZenBookingUsers
JwtSettings__ExpiryMinutes=1440
ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:5174
ASPNETCORE_ENVIRONMENT=Production
```

**Important:**
- Replace `<YOUR_KOYEB_POSTGRES_CONNECTION_STRING>` with the connection string from Step 2.2
- Generate a strong JWT secret key (use a password generator)
- You'll update `ALLOWED_ORIGINS` after deploying the frontend

### 2.5 Deploy!
1. Click **"Deploy"**
2. Wait 5-10 minutes for build
3. Once done, **copy your Koyeb service URL**: `https://zen-booking-api-YOUR_APP.koyeb.app`

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub (free forever)

### 3.2 Import Project
1. Click **"Add New Project"**
2. Import `zen-booking` repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.3 Set Environment Variable
Click **"Environment Variables"** and add:

```
VITE_API_BASE_URL=https://YOUR_KOYEB_BACKEND_URL
```

Replace with your Koyeb backend URL from Step 2.5

**Example:**
```
VITE_API_BASE_URL=https://zen-booking-api-zlatko.koyeb.app
```

### 3.4 Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your frontend will be live at: `https://zen-booking-YOUR_USERNAME.vercel.app`

---

## Step 4: Update Frontend API URL

### 4.1 Update API Base URL in Code

Edit `frontend/src/services/api.ts`:

```typescript
// Change this line:
const API_BASE_URL = 'http://127.0.0.1:5082/api';

// To your Koyeb backend URL:
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5082/api';
```

### 4.2 Commit and Push

```bash
git add .
git commit -m "Update API URL for production"
git push
```

Vercel will automatically redeploy!

---

## Step 5: Update CORS Settings

### 5.1 Go back to Koyeb
1. Open your backend service
2. Go to **"Environment variables"**
3. Update `ALLOWED_ORIGINS`:

```
ALLOWED_ORIGINS=https://zen-booking-YOUR_USERNAME.vercel.app
```

Replace with your actual Vercel URL

4. Click **"Redeploy"**

---

## Step 6: Test Your App!

1. Visit your Vercel URL: `https://zen-booking-YOUR_USERNAME.vercel.app`
2. Register a new account
3. Log in
4. Create apartments and bookings
5. Everything should work!

---

## Custom Domain (Optional)

### For Frontend (Vercel):
1. Go to Vercel project settings
2. Click **"Domains"**
3. Add your domain (e.g., `zenbooking.com`)
4. Follow DNS instructions

### For Backend (Koyeb):
1. Go to Koyeb service settings
2. Click **"Domains"**
3. Add custom domain (e.g., `api.zenbooking.com`)
4. Update DNS records

---

## Monitoring & Logs

### Koyeb Backend:
- View logs: Koyeb dashboard > Your service > "Logs"
- Check database: Koyeb dashboard > Databases > "zen-booking-db"

### Vercel Frontend:
- View deployments: Vercel dashboard > Your project > "Deployments"
- Check logs: Click on any deployment

---

## Staying Free

Both services are **completely free** with these limits:

**Vercel:**
- ✅ Unlimited bandwidth
- ✅ Unlimited deployments
- ✅ Free forever

**Koyeb:**
- ✅ 1 web service (your backend)
- ✅ 1 PostgreSQL database
- ✅ Scale-to-zero (no waste when idle)
- ⚠️ After free tier, pay-per-second usage
- **Tip**: Monitor usage in Koyeb dashboard to stay free

---

## Troubleshooting

### Backend won't start?
- Check Koyeb logs for errors
- Verify database connection string
- Ensure JWT secret is set

### Frontend can't connect to backend?
- Check CORS settings in backend
- Verify API URL in frontend environment variables
- Check browser console for errors

### Database connection failed?
- Verify connection string format
- Ensure database is running in Koyeb
- Check firewall settings

---

## Local Development

To run locally with production database:

1. Get your Koyeb database connection string
2. Update `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "<YOUR_KOYEB_DB_CONNECTION_STRING>"
  }
}
```

3. Run backend: `dotnet run` in `backend/ApartmentManager.API`
4. Run frontend: `npm run dev` in `frontend`

---

## Next Steps

- ✅ Set up custom domain
- ✅ Configure automatic backups (Koyeb dashboard)
- ✅ Add monitoring/alerts
- ✅ Set up CI/CD (automatic deployment on push)

---

## Support

- Vercel Docs: https://vercel.com/docs
- Koyeb Docs: https://www.koyeb.com/docs

Enjoy your **FREE** cloud-deployed Zen Booking app! 🚀
