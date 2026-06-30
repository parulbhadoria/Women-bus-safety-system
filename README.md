```markdown
# Women Bus Safety & Tracking System

> A role-based real-time safety and tracking platform for women's public bus transit, enabling live location sharing, route visibility, and instant emergency alerts.

---

## Overview

Women Bus Safety & Tracking System is a full-stack web application built to improve safety on public bus transit through real-time GPS tracking, role-based access for passengers, drivers, and admins, and a one-tap SOS emergency alert system. The platform aims to give passengers visibility into their journey and a fast, reliable way to signal distress when needed.

---

## Demo

**Live Demo:** [add link if deployed]

---

## Features

* Role-based access with separate Passenger, Driver, and Admin modules
* Real-time GPS tracking of buses using browser geolocation
* Live route visualization on an interactive map
* One-tap SOS emergency alert system
* Instant email notifications on SOS trigger via Email.js
* Real-time data synchronization across users using Firebase
* Admin oversight of active routes and driver/passenger activity

---

## Tech Stack

### Frontend
* React.js
* Leaflet.js
* OpenStreetMap

### Backend
* Node.js
* Express.js

### Real-time & Notifications
* Firebase (real-time database/sync)
* Email.js (instant SOS notifications)

---

## Roles & Modules

**Passenger**
* View live bus location and route
* Trigger SOS alert in emergencies

**Driver**
* Share live GPS location while on route
* View assigned route details

**Admin**
* Monitor all active buses and routes in real time
* View SOS alerts and respond accordingly

---

## Project Structure

```text
src/
├── components/
├── modules/
│   ├── passenger/
│   ├── driver/
│   └── admin/
├── lib/
└── App.jsx
```

---

## Getting Started

### Prerequisites
* Node.js (v18 or later)
* npm
* Firebase project
* Email.js account

### Clone Repository
```bash
git clone https://github.com/parulbhadoria/Women-bus-safety-system.git
cd Women-bus-safety-system
```

### Install Dependencies
```bash
npm install
```

### Configure Environment Variables
Create a `.env` file in the project root:
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
```

### Run the Project
```bash
npm run dev
```

Visit:
```
http://localhost:5173
```

---

## How It Works

1. Driver starts a route, sharing live GPS location.
2. Passengers view the bus's real-time position and route on the map.
3. In an emergency, the passenger triggers an SOS alert.
4. Email.js sends an instant notification to configured emergency contacts/admin.
5. Admin can view and respond to active SOS alerts in real time.

---

## Future Improvements

* SMS-based SOS alerts in addition to email
* Push notifications for route delays
* Driver verification system
* Offline location caching for low-connectivity areas

---

## Contributing

Contributions and suggestions are welcome. Fork the repository, create a feature branch, and submit a pull request.

---

## License

This project is licensed under the MIT License.

---

## Author

**Parul Bhadoria**
Built using React, Node.js, Firebase, and Leaflet.js.
```.
