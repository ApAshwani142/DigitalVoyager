# Deployment Configuration Guide

This guide explains how to configure the frontend and backend for production deployment.

## Frontend Configuration (Vercel)

### Environment Variables

In your Vercel project settings, add the following environment variable:

```
VITE_API_URL=https://digitalvoyager.onrender.com
```

### Steps:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add `VITE_API_URL` with value `https://digitalvoyager.onrender.com`
4. Redeploy your frontend

## Backend Configuration (Render)

### CORS Configuration

The backend CORS is already configured to allow requests from:
- `https://dgvoyager.com`
- `https://www.dgvoyager.com`
- `http://dgvoyager.com`
- `http://www.dgvoyager.com`

### Environment Variables

Make sure your Render backend has all necessary environment variables configured:
- Database connection strings
- JWT secrets
- Email service credentials
- Any other required API keys

## API Endpoints

All API endpoints are now centralized in `Frontend/src/config/api.js`. The base URL is configured via the `VITE_API_URL` environment variable.

### Available Endpoints:
- Auth: `/api/auth/*`
- Products: `/api/products/*`
- Chat: `/api/chat`
- Contact: `/api/contact/*`

## Local Development

For local development, create a `.env` file in the Frontend directory:

```
VITE_API_URL=http://localhost:5000
```

The backend will automatically allow requests from `http://localhost:5173` and `http://localhost:3000` for local development.

## Testing the Integration

1. Ensure backend is running on Render
2. Ensure frontend is deployed on Vercel with the correct `VITE_API_URL`
3. Visit `https://dgvoyager.com` and test:
   - User registration/login
   - Product browsing
   - Contact form submission
   - Chat functionality

## Troubleshooting

### CORS Errors
- Verify the frontend URL matches one of the allowed origins in `Backend/server.js`
- Check that credentials are being sent correctly

### API Connection Errors
- Verify `VITE_API_URL` is set correctly in Vercel
- Check that the backend URL is accessible (https://digitalvoyager.onrender.com)
- Ensure backend is running and not sleeping (Render free tier sleeps after inactivity)

### Environment Variables Not Loading
- In Vercel, ensure environment variables are prefixed with `VITE_`
- Redeploy after adding/changing environment variables
- Clear browser cache if needed

