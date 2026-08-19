# Preetha Physio Clinic

A modern physiotherapy clinic management system with patient appointments, reviews, and simulated email functionality.

## 🚀 Live Deployments

- **Frontend:** https://preethaphysio-frontend.onrender.com
- **Backend:** https://preethaphysio-backend.onrender.com

## 📋 Features

- **Patient Registration & Authentication** - Secure user registration and login with JWT
- **Appointment Booking** - Interactive calendar for scheduling appointments
- **Patient Dashboard** - View appointments, manage profile
- **Doctor Dashboard** - Manage appointments, view patient information
- **Reviews System** - Patients can submit, edit, and delete reviews
- **Simulated Email Inbox** - View appointment confirmations and password reset emails
- **Treatment Gallery** - Animated showcase of treatment approaches
- **Health Blog** - Educational content about physiotherapy and wellness

## 🛠️ Tech Stack

### Frontend
- React with Vite
- TypeScript
- TailwindCSS
- Framer Motion (animations)
- Lucide Icons

### Backend
- Node.js with Express
- TypeScript
- Supabase (database)
- JWT authentication
- Resend (email service)

### Deployment
- Render.com (permanent hosting)
- Supabase (database)

## 🏗️ Project Structure

```
Physio clinic/
├── src/
│   ├── components/       # React components
│   │   ├── AboutDoctor.tsx
│   │   ├── AuthModal.tsx
│   │   ├── Blogs.tsx
│   │   ├── BookingCalendar.tsx
│   │   ├── ContactSection.tsx
│   │   ├── DoctorDashboard.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── PatientDashboard.tsx
│   │   ├── ReviewsSection.tsx
│   │   ├── Services.tsx
│   │   ├── SimulatedEmailInbox.tsx
│   │   └── TreatmentGallery.tsx
│   ├── config.ts        # API configuration
│   ├── main.tsx         # React entry point
│   └── types.ts         # TypeScript types
├── server.ts            # Express backend server
├── package.json         # Dependencies and scripts
└── README.md
```

## 🚦 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Supabase Service Role Key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Varshini2619/Preethaphysio.git
cd Physio clinic
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
RESEND_API_KEY=your_resend_api_key
PORT=3000
```

4. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🗄️ Database Schema

### Tables
- **users** - Patient and doctor accounts
- **appointments** - Appointment bookings
- **reviews** - Patient reviews
- **emails** - Simulated emails for inbox

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/reset-password` - Password reset request

### Appointments
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Reviews
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Submit review
- `DELETE /api/reviews/:id` - Delete review

### Emails
- `GET /api/simulated-emails` - Get simulated emails

## 🎨 Recent Updates

### Migration to Render.com (August 2026)
- Migrated from Railway (backend) and Vercel (frontend) to Render.com
- Configured permanent hosting without weekly restarts
- Updated CORS settings for Render frontend URL
- Fixed Supabase schema issues (comment column type)
- Added review deletion functionality
- Improved treatment gallery animation smoothness
- Removed AI-generated formatting from blog content

### Bug Fixes
- Fixed review date display (snake_case to camelCase transformation)
- Fixed toLowerCase error on undefined patient names
- Fixed Supabase reviews table schema (removed time column, fixed comment type)
- Improved animation smoothness with Framer Motion infinite loop

## 📦 Build Scripts

- `npm run dev` - Start development server
- `npm run dev:frontend` - Start frontend only
- `npm run dev:backend` - Start backend only
- `npm run build` - Build for production
- `npm start` - Start production server

## 🌐 Deployment

### Render.com Deployment

**Backend (Web Service):**
- Build Command: `npm run build`
- Start Command: `npm start`
- Environment Variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET, FRONTEND_URL, RESEND_API_KEY, PORT=10000

**Frontend (Static Site):**
- Build Command: `npm run build`
- Publish Directory: `dist`
- Environment Variables: VITE_API_URL

## 🔐 Security

- JWT-based authentication
- CORS configuration for allowed origins
- Input validation on all endpoints
- Service role key for database operations
- Password hashing with bcrypt

## 📝 License

This project is licensed under the MIT License.
