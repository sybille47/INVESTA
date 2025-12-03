# INVESTA — Full-Stack Investment Tracking App

INVESTA is a full-stack application built with a **React + Vite web client**, a **Node/Express API server**, and a **PostgreSQL database**. It allows authenticated users to view investment funds, track NAV history, create orders, review portfolio allocation, and visualize investment performance through charts.

This project uses **Auth0** for secure authentication, **JWT validation** for backend protection, and **Recharts** for clean data visualization.

---

## Features

- **Secure Auth** using Auth0 + JWT
- **Charts & Analytics** (NAV history, allocation, monthly counts)
- **Fund listing, totals, and detailed ISIN views**
- **Order creation & order history**
- **User profile viewing & updating**
- **PostgreSQL storage layer** with user-scoped data access
- **Fast frontend dev with Vite**
- **Styling via Tailwind CSS**

---

## Tech Stack

### **Frontend**
- React 18  
- Vite  
- Tailwind CSS  
- Auth0 React SDK  
- React Router  
- Recharts  

### **Backend**
- Node.js 18  
- Express 5  
- PostgreSQL (`pg`)  
- Auth0 JWT Middleware  
- dotenv  

### **Testing**
- Vitest  
- Testing Library (frontend tests)

---

## Prerequisites

Before installing and running the project, ensure you have:

- **Node.js 18+**
- **npm** (or yarn/pnpm)
- **PostgreSQL 14+**
- An **Auth0 tenant**  
  - API audience  
  - Client ID  
  - Domain  

---

## Getting Started

### 1. **Clone the repository**

```bash
git clone https://github.com/<your-username>/INVESTA.git
cd INVESTA
```
###  **Frontend Setup (React + Vite)**

### 2. **Install dependencies**

```bash
cd web
npm install
```

### 3. **Create a .env file**

Create web/.env

```
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://investa-api
VITE_API_URL=http://localhost:3000
```

### 4. **Start the Frontend**

```bash
npm run dev
```

The frontend will run at 

```
http://localhost:5173
```

###  **Backend Setup (Express API Server)**

### 5. **Install backend dependencies**

```bash
cd server
npm install
```

### 6. **Create environment configuration**

Create server/.env

```
PORT=3000
DATABASE_URL=postgres://postgres:password@localhost:5432/investa

AUTH0_ISSUER_BASE_URL=https://your-tenant.us.auth0.com/
AUTH0_AUDIENCE=https://investa-api
```

### 7. **Start the server**

```
node index.js
```

The API server runs on 

```
http://localhost:3000
```

###  Database Setup

1. Create a PostgreSQL database:

```
sql
CREATE DATABASE investa;
```
2. Run your schema/migration SQL files
3. Seed optional data

### Authentication

This project uses Auth0 for:

  - Login / logout
  - JWT authentication
  - Protecting backend routes
    
To access most API endpoints, the frontend must send:

```
Authorization: Bearer <JWT>
```
All secure endpoints require this.

### API Reference

#### Base URL:

```
http://localhost:3000/api
```
All GET/POST/PUT endpoints require an Auth0 JWT unless noted.

#### Health Check

GET /

Returns a simple service-running message.
No authentication required.
-----------------------------------------------------------------------------------------------------------------------------------------------------------------

#### Funds

GET /api/funds
Returns all funds for the authenticated user.

GET /api/funds-total
Returns the user's total fund value.
-----------------------------------------------------------------------------------------------------------------------------------------------------------------

#### Orders

GET /api/orders
Optional query:
```
?isin=XYZ
```

POST /api/orders
Creates a new order.

#### Profiles

GET /api/profile
Returns user profile information.

PUT /api/profile
Updates user profile details.

#### NAV & Charts

GET /api/nav/:isin
Per-fund NAV history.

GET /api/nav
NAV for all user funds.

GET /api/charts/investment-value
Data for investment value over time.

GET /api/charts/monthly-counts
Counts of monthly investments.

GET /api/charts/fund-allocation
Portfolio allocation data.

#### Folder Structure

INVESTA/
├── web/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── server/
│   ├── index.js
│   ├── router.js
│   ├── db/
│   ├── services/
│   ├── package.json
│   └── ...
└── README.md





















