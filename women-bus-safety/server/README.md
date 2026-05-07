# Women Bus Safety Server

## Start

1. Install: `npm install`
2. Run: `npm start`

## Deploy To Render

1. Create an account at [render.com](https://render.com).
2. Click **New** -> **Web Service** and connect your GitHub repository.
3. Set the root directory to `server/`.
4. Build command: `npm install`.
5. Start command: `node index.js`.
6. Add environment variables from `server/.env` in Render dashboard.
7. Add Firebase service account securely:
   - Preferred: upload `serviceAccountKey.json` as a secret file and set `FIREBASE_SERVICE_ACCOUNT_PATH`.
   - Alternative: store JSON content in environment secret and parse in runtime.

## Routes

- `POST /api/auth/verify-aadhaar`
- `POST /api/auth/verify-license`
- `GET /api/buses/active`
- `POST /api/journey/start`
- `POST /api/journey/complete`
- `GET /api/admin/buses`
- `GET /api/admin/drivers`
- `GET /api/admin/passengers`
- `GET /api/admin/sos-alerts`
- `POST /api/admin/assign-bus`
