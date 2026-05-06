# Women Bus Safety and Tracking System

Women safety-focused bus tracking platform with passenger, driver, and admin modules.

## Folder Structure

- `client`: React + TypeScript frontend
- `server`: Express + Firebase Admin backend
- `firestore-seed`: Firestore seed script

## Setup

1. Open terminal at `women-bus-safety`.
2. Start backend:
   - `cd server`
   - `npm install`
   - `npm start`
3. Start frontend in a new terminal:
   - `cd client`
   - `npm install`
   - `npm start`
4. Seed data in a third terminal:
   - `cd firestore-seed`
   - `npm install`
   - `node seed.js`

## Firebase/API Keys

- Frontend Firebase and EmailJS values are already configured in `client/.env`.
- Backend uses `server/.env` with `FIREBASE_SERVICE_ACCOUNT_PATH=./serviceaccountkey.json`.

## Service Account Key

Firebase Console -> Project Settings -> Service accounts -> Generate new private key.
Save as `server/serviceaccountkey.json`.

## Test Data

- Aadhaar: `111122223333`, `222233334444`, `333344445555`, `444455556666`, `555566667777`
- License IDs: `DL001`, `DL002`, `DL003`, `DL004`, `DL005`
- Admin email: `admin@womenbus.com` (create this user in Firebase Auth)

## Deploy

### Render (Server)

1. Push `server` to GitHub.
2. Create Render Web Service from repo.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables from `.env`.

### Firebase Hosting (Client)

1. `npm install -g firebase-tools`
2. `firebase login`
3. In `client`: `npm run build`
4. `firebase init hosting` and choose `client/build`
5. `firebase deploy`
