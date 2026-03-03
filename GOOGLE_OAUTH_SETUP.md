# Complete Google OAuth Setup Guide

## ⚠️ Your Current Issue
- Error: `Error 401: invalid_client`
- Reason: Client ID is either missing, invalid, or not registered properly in Google Console

---

## 🔧 Solution: Get & Configure Your Client ID (5 minutes)

### Step 1: Open Google Cloud Console
👉 Go to: https://console.cloud.google.com/

### Step 2: Create a New Project
1. Look for **"Select a Project"** dropdown (top-left)
2. Click **"NEW PROJECT"**
3. Project name: `Project Management` (or any name)
4. Click **"CREATE"**
5. Wait for it to be created (may take 30 seconds)

### Step 3: Enable Google+ API
1. In the search bar (at the top), search: `Google+ API`
2. Click on it in the results
3. Click the **"ENABLE"** button (blue button)
4. Wait for it to enable

### Step 4: Create OAuth Consent Screen
1. Go to **Credentials** (left sidebar)
2. You'll see a message: "To create an OAuth client ID you must first create an OAuth consent screen"
3. Click **"CREATE CONSENT SCREEN"**
4. Choose **"External"** (click "CREATE")
5. Fill in the form:
   - **App name**: `Project Management`
   - **User support email**: `rithikn.23it@kongu.edu`
   - **Developer contact**: `rithikn.23it@kongu.edu`
6. Click **"SAVE AND CONTINUE"**
7. Skip Scopes, just click **"SAVE AND CONTINUE"** twice
8. Done!

### Step 5: Create OAuth 2.0 Client ID
1. Go to **Credentials** tab
2. Click **"+ CREATE CREDENTIALS"** (top button)
3. Select **"OAuth Client ID"**
4. Application type: **"Web Application"**
5. Name: `Project Management App`

### Step 6: Add Authorized URLs
Under **Authorized JavaScript origins**, click **"ADD URI"** and add:
```
http://localhost:3000
http://localhost
http://127.0.0.1:3000
```

Under **Authorized redirect URIs**, click **"ADD URI"** and add:
```
http://localhost:3000
http://localhost:3000/login
```

Click **"CREATE"**

### Step 7: Copy Your Client ID
✅ A popup will appear with your credentials
✅ **Copy the "Client ID"** (it looks like: `123456789-abc123xyz.apps.googleusercontent.com`)

---

## 📋 Example Client ID Format
Your Client ID should look something like:
```
123456789-abcdefghijklmnop.apps.googleusercontent.com
```

---

## ✅ Update Your Files

Once you have your Client ID, provide it and I'll update both files for you!

**Or manually update:**

### File 1: `backend/.env`
Find the line with `GOOGLE_CLIENT_ID=` and replace it:
```
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
```

### File 2: `frontend/.env.local`
Find the line with `NEXT_PUBLIC_GOOGLE_CLIENT_ID=` and replace it:
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
```

---

## 🔄 Restart Servers
After updating, close and restart both:
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2 (new terminal)
cd frontend
npm run dev
```

---

## 🧪 Test It
Visit: http://localhost:3000/login
Click the Google Sign-In button and try logging in

---

## ❌ Still Getting Error?

1. **Double-check Client ID** - Make sure you copied it correctly (no extra spaces)
2. **Restart both servers** - Changes won't take effect until restart
3. **Clear browser cache** - Press `Ctrl+Shift+Delete`
4. **Check console** - Open DevTools (F12) → Console tab for error details

---

## 💡 Common Mistakes
❌ Forgetting to enable Google+ API
❌ Not creating OAuth consent screen first
❌ Wrong authorized URLs (must match `localhost:3000`)
❌ Not restarting servers after changing `.env`
❌ Typo in Client ID

---

## ✨ If You Get Lost
Just share your actual Client ID and I'll update the files for you!
