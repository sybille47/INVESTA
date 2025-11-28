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

