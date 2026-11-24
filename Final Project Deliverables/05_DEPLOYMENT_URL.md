# Deployment & Hosting Guide
### Live Application & Cloud Infrastructure Specification

---

## 1. Local Deployment Endpoints

When running locally on the development machine:
- **Frontend Web Application**: [http://localhost:5173](http://localhost:5173)
- **Backend REST API**: [http://localhost:5005](http://localhost:5005)
- **API Health Check**: [http://localhost:5005/api/health](http://localhost:5005/api/health)
- **API Service Status**: [http://localhost:5005/api/status](http://localhost:5005/api/status)

---

## 2. Production Cloud Deployment (Vercel + Render)

The application is structured to deploy smoothly to modern cloud platforms:

### 2.1 Backend Deployment (Render / Railway)
1. Link your GitHub repository to **Render** (`https://render.com`) or **Railway** (`https://railway.app`).
2. Create a **New Web Service**:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**:
     - `PORT`: `5005` (or assigned by host)
     - `NODE_ENV`: `production`
     - `TTS_PROVIDER`: `free`
     - `RATE_LIMIT_WINDOW_MS`: `60000`
     - `RATE_LIMIT_MAX_REQUESTS`: `60`
     - `MAX_TEXT_LENGTH`: `5000`
3. Resulting Public Backend URL: `https://vocalix-tts-api.onrender.com`

### 2.2 Frontend Deployment (Vercel / Netlify)
1. Link the repository to **Vercel** (`https://vercel.com`).
2. Set configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_URL`: `https://vocalix-tts-api.onrender.com`
3. Resulting Public Frontend URL: `https://vocalix-tts.vercel.app`

---

## 3. Production Readiness Checklist

- [x] CORS configured for authorized origin domains.
- [x] In-memory rate limiting active (60 requests/minute/IP).
- [x] Automatic fallback to browser Web Speech API if backend server is unreachable.
- [x] Input validation on text length, pitch bounds, speed limits, and volume ranges.
- [x] Error handling middleware masking raw stack traces in production mode.
- [x] Clean production build without compiler warnings or bundle errors (`dist/index.html`).
