# Physio Clinic Deployment Guide

This guide covers deploying the Physio Clinic application to production.

## Prerequisites

- Node.js 18+ installed
- Supabase project with required tables
- Resend API key (for email functionality)
- Hosting platform (Vercel, Netlify, Railway, Render, etc.)

## Environment Variables

Create a `.env` file in your project root with the following variables:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-from-supabase
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-from-supabase

# JWT Secret for authentication
JWT_SECRET=your-secure-random-secret-key

# Email Service (Resend)
RESEND_API_KEY=your-resend-api-key

# Backend API URL (production)
VITE_API_URL=https://your-backend-url.com

# Frontend URL (production)
FRONTEND_URL=https://your-frontend-url.com

# Server Port
PORT=3000
```

## Supabase Setup

### Required Tables

1. **users table**
   - id (text, primary key)
   - email (text, unique)
   - password_hash (text)
   - name (text)
   - age (integer)
   - gender (text)
   - phone (text)
   - address (text)
   - medical_info (text)
   - role (text)

2. **appointments table**
   - id (text, primary key)
   - patient_id (text)
   - patient_name (text)
   - patient_phone (text)
   - date (text)
   - time_slot (text)
   - doctor_name (text)
   - consultation_type (text)
   - status (text)
   - medical_notes (text)
   - recovery_status (text)
   - meeting_link (text)
   - created_at (timestamp)

3. **reviews table**
   - id (text, primary key)
   - patient_name (text)
   - rating (integer)
   - comment (text)
   - image_url (text)
   - created_at (timestamp)
   - time (timestamp)

4. **emails table**
   - id (text, primary key)
   - to (text)
   - subject (text)
   - body (text)
   - sent_at (timestamp)

### Row Level Security (RLS)

For production, ensure RLS policies are properly configured to allow:
- Service role key to bypass RLS for server-side operations
- Anon key to read public data
- Authenticated users to access their own data

## Build for Production

```bash
npm run build
```

This creates:
- `dist/` - Frontend build files
- `dist/server.cjs` - Bundled backend server

## Deployment Options

### Option 1: Separate Frontend and Backend

#### Frontend (Vercel/Netlify)
1. Connect your repository to Vercel/Netlify
2. Set environment variables:
   - `VITE_API_URL=https://your-backend-url.com`
3. Deploy - the platform will automatically build and deploy

#### Backend (Railway/Render)
1. Connect your repository to Railway/Render
2. Set environment variables (all except VITE_API_URL)
3. Configure build command: `npm run build`
4. Configure start command: `node dist/server.cjs`
5. Deploy

### Option 2: Single Server Deployment

Deploy both frontend and backend on the same server:

1. Build the project: `npm run build`
2. Upload files to your server
3. Install dependencies: `npm install --production`
4. Set environment variables
5. Start server: `node dist/server.cjs`
6. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start dist/server.cjs --name physio-clinic
   pm2 save
   pm2 startup
   ```

### Option 3: Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
```

Build and run:
```bash
docker build -t physio-clinic .
docker run -p 3000:3000 --env-file .env physio-clinic
```

## Post-Deployment Checklist

- [ ] Update CORS allowed origins in production environment
- [ ] Verify Supabase connection
- [ ] Test user registration and login
- [ ] Test appointment booking
- [ ] Test review submission
- [ ] Test email functionality (if Resend is configured)
- [ ] Set up SSL/HTTPS
- [ ] Configure domain names
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy for database

## Troubleshooting

### CORS Errors
Ensure `FRONTEND_URL` in your backend environment variables matches your deployed frontend URL exactly.

### Database Connection Errors
Verify Supabase credentials are correct and the Supabase project is active.

### Build Errors
Ensure all dependencies are installed and Node.js version is compatible.

### Email Not Sending
Verify Resend API key is valid and your domain is verified in Resend dashboard.

## Security Notes

- Change `JWT_SECRET` to a strong, random value in production
- Never commit `.env` file to version control
- Use HTTPS in production
- Keep dependencies updated
- Implement rate limiting for API endpoints
- Regularly review Supabase RLS policies
