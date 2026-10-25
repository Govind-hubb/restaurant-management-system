# Restaurant Management System

## 1. Project Overview
The Restaurant Management System is a Proof of Concept (PoC) web application developed using the MERN stack: MongoDB, Express.js, React.js, and Node.js.

It helps restaurant staff manage food menu items, customer orders, table reservations, and billing through a single application.

## 2. Objectives
- Manage food items and their prices.
- Create and view customer orders.
- Calculate order totals.
- Reserve tables for customers.
- Prevent overlapping reservations for the same table.
- Record payment methods and payment status.
- Display restaurant activity on a dashboard.

## 3. Technologies Used
- Frontend: React.js, Vite, React Router
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- API Testing: Postman
- Development Tools: Visual Studio Code, Nodemon

## 4. Main Modules
1. Menu Management
2. Order Management
3. Table Reservation
4. Billing Management
5. Dashboard

## 5. Project Structure
```text
restaurant-management-system/
├── client/
│   └── src/
│       ├── pages/
│       ├── App.jsx
│       └── styles.css
├── server/
│   ├── models/
│   ├── routes/
│   └── server.js
└── README.md
```

## 6. Setup Instructions

### Prerequisites
Install Node.js, npm, and MongoDB. Ensure MongoDB is running and a database connection string is configured.

### Backend
1. Open a terminal in the server folder.
2. Install dependencies:
   `npm install`
3. Configure the MongoDB connection string and port in the server environment file.
4. Start the backend:
   `npm run dev`

### Frontend
1. Open another terminal in the client folder.
2. Install dependencies:
   `npm install`
3. Start the React development server:
   `npm run dev`
4. Open the local URL shown in the terminal, usually `http://localhost:5173`.

## 7. API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/menu` | Retrieve menu items |
| POST | `/api/menu` | Add a menu item |
| GET | `/api/orders` | Retrieve orders |
| POST | `/api/orders` | Create an order |
| GET | `/api/reservations` | Retrieve reservations |
| POST | `/api/reservations` | Create a reservation |
| PUT | `/api/reservations/:id/status` | Update reservation status |
| PUT | `/api/orders/:id/payment` | Record payment |

Additional menu and order endpoints may be available depending on the implemented routes.

## 8. Testing
The following functional tests have been performed:
- Menu item creation and retrieval.
- Customer order creation and total calculation.
- Reservation creation.
- Rejection of overlapping table reservations.
- Payment status persistence.
- Dashboard data retrieval.

## 9. Limitations
- Payment recording is simulated and does not process real transactions.
- The project is a PoC and may require additional authentication, authorization, and production-level security before deployment.
- Reservation conflict checking should be strengthened for simultaneous booking requests.

## 10. Future Enhancements
- User authentication and role-based access.
- Real payment gateway integration.
- Restaurant reports and analytics.
- Improved responsive design.
- Deployment to a cloud platform.

## 11. Conclusion
The project demonstrates end-to-end integration of React, Express, Node.js, and MongoDB to support basic restaurant operations.
