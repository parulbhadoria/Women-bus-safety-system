# Women Bus Safety & Tracking System

> A role-based real-time safety and tracking platform for women's public bus transit, enabling live location sharing, route visibility, and instant emergency alerts.

---

## Overview

Women Bus Safety & Tracking System is a full-stack web application designed to improve the safety of women using public bus transportation. The platform provides real-time bus tracking, role-based access for passengers, drivers, and administrators, and a one-tap SOS emergency alert system.

Passengers can monitor live bus locations, drivers can share their real-time GPS location, and administrators can oversee routes and respond to emergency alerts.

---

## Features

- Role-based authentication (Passenger, Driver, Admin)
- Real-time GPS tracking using browser geolocation
- Interactive route visualization with Leaflet and OpenStreetMap
- One-tap SOS emergency alert system
- Instant email notifications using EmailJS
- Real-time synchronization with Firebase
- Admin dashboard for monitoring buses, routes, and SOS alerts
- Responsive user interface

---

## Tech Stack

### Frontend

- React.js
- Tailwind CSS
- Leaflet.js
- OpenStreetMap

### Backend

- Node.js
- Express.js

### Database & Services

- Firebase Firestore
- Firebase Authentication
- Firebase Admin SDK
- EmailJS

---

## User Roles

### Passenger

- View live bus location
- View assigned route
- Trigger SOS alerts during emergencies

### Driver

- Share real-time GPS location
- View assigned route information

### Admin

- Monitor all active buses
- View live locations
- Monitor SOS alerts
- Manage system activity

---

## Project Structure

```text
women-bus-safety/
│
├── client/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── .env
│   ├── .env.example
│   ├── serviceaccountkey.json
│   ├── index.js
│   └── package.json
│
├── firestore-seed/
│   ├── seed.js
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js (v18 or later)
- npm
- Firebase Project
- EmailJS Account

---

### Clone the Repository

```bash
git clone https://github.com/parulbhadoria/Women-bus-safety-system.git
cd Women-bus-safety-system
```

---

## Backend Setup

Navigate to the server folder.

```bash
cd server
```

Install dependencies.

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file inside the `server` folder.

You can use `.env.example` as a reference.

Example:

```env
PORT=5000

# Add your backend environment variables here
```

### Configure Firebase Admin SDK

This project uses the Firebase Admin SDK for secure backend operations.

For security reasons, `serviceaccountkey.json` is **not included** in this repository.

Generate a new Firebase Service Account key from:

**Firebase Console → Project Settings → Service Accounts → Generate New Private Key**

Place the downloaded file inside the `server` directory.

Your folder should look like:

```text
server/
│
├── .env
├── .env.example
├── serviceaccountkey.json
├── index.js
└── package.json
```

> `serviceaccountkey.json` contains sensitive credentials and must never be committed to GitHub. It is already included in `.gitignore`.

### Start the Backend Server

```bash
node index.js
```

The backend will run at:

```
http://localhost:5000
```

---

## Frontend Setup

Open a new terminal.

Navigate to the client folder.

```bash
cd client
```

Install dependencies.

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file inside the `client` folder.

```env
VITE_FIREBASE_API_KEY=

VITE_FIREBASE_AUTH_DOMAIN=

VITE_FIREBASE_PROJECT_ID=

VITE_FIREBASE_STORAGE_BUCKET=

VITE_FIREBASE_MESSAGING_SENDER_ID=

VITE_FIREBASE_APP_ID=

VITE_EMAILJS_SERVICE_ID=

VITE_EMAILJS_TEMPLATE_ID=

VITE_EMAILJS_PUBLIC_KEY=

VITE_API_URL=http://localhost:5000
```

### Run the Frontend

```bash
npm run dev
```

Open your browser:

```
http://localhost:5173
```

---

## Firestore Seed (Optional)

To populate Firestore with sample data:

```bash
cd firestore-seed

npm install

node seed.js
```

---

## How It Works

1. Driver starts sharing live GPS location.
2. Passengers can monitor the bus's live location and route.
3. In an emergency, the passenger triggers the SOS button.
4. EmailJS sends instant emergency notifications.
5. The admin dashboard displays active buses and SOS alerts in real time.

---

## Future Improvements

- SMS-based SOS alerts
- Push notifications
- Driver verification
- Offline location caching
- ETA prediction
- Route history
- Mobile application support

---

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a new feature branch.

```bash
git checkout -b feature-name
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push the branch.

```bash
git push origin feature-name
```

5. Open a Pull Request.

---

## License

This project is licensed under the MIT License.

---

## Author

**Parul Bhadoria**

Built using React, Node.js, Express.js, Firebase, Leaflet, OpenStreetMap, and EmailJS.
