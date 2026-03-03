# Google Sign-In Setup Guide

## Overview
This project now supports Google Sign-In authentication. Users can log in using their Google account on the login page.

## Backend Changes
- Added `googleLogin` controller function to verify Google ID tokens
- Created `/api/auth/google` endpoint for Google authentication
- Updated `User` model to support OAuth (optional `password_hash` and `googleId` fields)
- Added `google-auth-library` dependency

## Frontend Changes
- Added `@react-oauth/google` library
- Wrapped app with `GoogleOAuthProvider` in `_app.tsx`
- Added Google Login button to login page with smooth UI integration
- Integrated Google sign-in with existing authentication flow

## Setup Instructions

### Step 1: Get Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Select **Web Application**
6. Add authorized redirect URIs:
   - `http://localhost:3000` (development)
   - `http://localhost:3000/api/auth/callback` (if needed)
   - Your production domain
7. Copy your **Client ID**

### Step 2: Configure Environment Variables

#### Backend (.env)
```
GOOGLE_CLIENT_ID=your_google_client_id_from_step1
JWT_SECRET=your_secret_key
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

#### Frontend (.env.local)
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_from_step1
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Step 3: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 4: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000/login` and click the Google sign-in button!

## How It Works

1. **User clicks Google Sign-In button**
   - The `@react-oauth/google` component opens Google's authentication popup

2. **User authenticates with Google**
   - Returns a credential token to the frontend

3. **Frontend sends token to backend**
   - POST request to `/api/auth/google` with the credential

4. **Backend verifies token**
   - Uses `google-auth-library` to verify the token
   - Extracts user info (email, name, googleId)
   - Creates new user or links Google ID to existing account
   - Generates JWT token and returns it

5. **Frontend stores token and redirects**
   - Saves JWT to localStorage
   - Redirects to projects page

## Features

✅ Users can sign in with Google account
✅ Automatic user creation on first Google sign-in
✅ Can link Google account to existing email account
✅ Secure token verification using Google's official library
✅ Seamless integration with existing login flow

## Troubleshooting

**"Google login failed" error:**
- Check that `GOOGLE_CLIENT_ID` is correct in both `.env` files
- Ensure the frontend URL is in authorized redirect URIs in Google Cloud Console
- Clear browser cookies and try again

**CORS errors:**
- Make sure backend is running on `http://localhost:5000`
- Check `CORS` configuration in backend

**Token verification fails:**
- Verify the `GOOGLE_CLIENT_ID` matches between Google Console and your `.env` file
- Check that the token hasn't expired

## Next Steps

You can enhance this further by:
- Adding Google login to the signup page
- Implementing "Remember me" functionality with Google sign-in
- Adding option to link/unlink Google account in user settings
- Implementing logout functionality
- Adding refresh token support

