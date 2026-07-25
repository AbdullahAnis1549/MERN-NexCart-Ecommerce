# NexCart — MERN E-Commerce Platform

A full-stack e-commerce web application built with the MERN stack (MongoDB, Express, React, Node.js), featuring a complete storefront, cart & checkout with Stripe payments, and a dedicated admin panel for store management.

**Live Demo:** _[add your Vercel frontend URL here]_
**Backend API:** _[add your Render backend URL here]_

---

## Features

### Customer-Facing
- **Authentication** — Register with email verification, login, forgot/reset password, JWT-based sessions
- **Product Catalog** — Browse by category, search, filter by price, best-seller & featured collections
- **Cart & Wishlist** — Persistent, synced across the app in real time (Redux Toolkit)
- **Checkout** — Cash on Delivery or online card payment via Stripe
- **Order Tracking** — View order history, cancel eligible orders
- **Product Reviews** — Rate and review products from delivered orders
- **Responsive storefront** — Home page with banners, category carousel, best-selling & featured sections
- About & Contact pages

### Admin Panel
- **Dashboard** — Revenue, order status breakdown, low-stock alerts, recent orders
- **Product Management** — Create/edit/delete products, toggle best-seller/featured flags, image upload (Cloudinary)
- **Category Management** — Full CRUD with image upload
- **Banner Management** — Homepage promotional banners
- **Order Management** — View order details, update order status (Pending → Delivered)
- **User Management** — View registered customers, order history per user, delete accounts

---

## Tech Stack

**Frontend**
- React 19 + Vite
- Redux Toolkit + React Redux — global state (auth, cart, wishlist, products, categories, orders, admin)
- React Router — client-side routing, nested layouts, protected admin routes
- React Hook Form — form handling & validation
- Axios — API communication with JWT auto-attach interceptor
- Stripe.js / React Stripe.js — card payments

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT — authentication
- bcrypt — password hashing
- Multer + Cloudinary — image uploads
- Nodemailer — verification & order emails
- Stripe — payment processing

---

## Project Structure

```
├── backend/
│   ├── Controllers/       # Route logic
│   ├── Models/             # Mongoose schemas
│   ├── Routes/             # Express routers
│   ├── Middleware/         # Auth guards, validation
│   ├── utils/               # Email templates, image upload config
│   ├── Config/DB.js         # MongoDB connection
│   └── Server.js            # Entry point
│
└── frontend/
    ├── src/
    │   ├── pages/            # Route-level pages (+ pages/Admin for admin panel)
    │   ├── components/       # Reusable UI (Navbar, ProductCard, ReviewSection, etc.)
    │   ├── features/         # Redux slices (auth, cart, wishlist, products, categories, orders, admin)
    │   ├── store/store.js     # Redux store configuration
    │   ├── api/                # Axios instance, Stripe setup
    │   └── utils/              # Shared helpers
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Stripe account (test mode keys)
- Gmail account with an App Password (for order/verification emails)

### 1. Clone the repository
```bash
git clone https://github.com/AbdullahAnis1549/MERN-NexCart-Ecommerce.git
cd MERN-NexCart-Ecommerce
```

### 2. Backend setup
```bash
cd backend
npm install
```
Create a `.env` file in `backend/`:
```env
PORT=5000
FRONTEND_URL=http://localhost:5173

DATABASE=your_mongodb_connection_string

Cloudinaryname=your_cloudinary_cloud_name
Cloudinarykey=your_cloudinary_api_key
Cloudinarysecret=your_cloudinary_api_secret

Gmailuser=your_gmail_address
Gmailpassword=your_gmail_app_password

SecretKey=your_stripe_secret_key
PublishableKey=your_stripe_publishable_key

jwtkey=your_jwt_secret
jwtexpire=1d
```
Run the server:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
npm install
```
Create a `.env` file in `frontend/`:
```env
VITE_API_BASE_URL=http://localhost:5000
```
Run the dev server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### (Optional) Seed sample data
```bash
cd backend
node seed.js
```
Populates the database with sample categories and products.

---

## Deployment

- **Frontend** is deployed on [Vercel](https://vercel.com)
- **Backend** is deployed on [Render](https://render.com)

When deploying:
1. Deploy the backend first and note its live URL
2. Set `VITE_API_BASE_URL` on Vercel to the backend's live URL
3. Set `FRONTEND_URL` on Render to the deployed frontend's URL (required for CORS)

---

## Test Payment (Stripe test mode)

| Field | Value |
|---|---|
| Card Number | `4242 4242 4242 4242` |
| Expiry | Any future date |
| CVC | Any 3 digits |

---

## License

This project is for educational/portfolio purposes.
