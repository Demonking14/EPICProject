# AgriMarket Platform

A full-stack web application for connecting farmers and buyers. Farmers list produce with photos and details; buyers browse the marketplace, filter by category, and request lots. Built with React (Vite), Node.js (Express), and MongoDB.

## Features

### For Everyone
- **JWT authentication** — Secure sign up and login with role-based access (farmer / buyer).
- **Responsive UI** — Tailwind CSS with a clean, modern layout.

### For Farmers
- **Dashboard** — View all your listed products and remove listings.
- **Add product** — Publish lots with name, description, price, quantity, location, category, availability window, and optional image upload.
- **Inventory overview** — See status and availability of each listing.
- **Mandi prices** — View daily AGMARKNET mandi prices by state, district, and commodity; toggle ₹/quintal or ₹/kg for fair negotiation.
- **Buyer requests** — See buyer requests on your products; **Accept** or **Reject** each request.
- **Real-time chat** — Message buyers (and buyers message you) via WebSocket for the inquiry.

### For Buyers
- **Live marketplace** — Browse all products with search and category filters (Cereals, Vegetables, Fruits, Spices, Other).
- **Request lot** — Send an inquiry to the farmer for a product (stored in backend for future “My inquiries” / farmer notifications).
- **Product images** — View uploaded photos when farmers add them.
- **Mandi prices** — Same daily mandi price data to compare market rates and negotiate fairly.
- **My requests** — List your lot requests and their status (pending / accepted / rejected).
- **Real-time chat** — Message the farmer for each request via WebSocket.

### Backend
- **REST API** — Auth (register, login), products (CRUD, list, filter), inquiries (create, get, update status, get messages), and mandi prices (AGMARKNET proxy).
- **WebSocket (Socket.io)** — Real-time messaging between farmer and buyer per inquiry; auth via JWT in handshake.
- **MongoDB** — Users, products, inquiries, and messages persisted in the database.
- **Image uploads** — Product photos stored on the server and served via URL.
- **Mandi (AGMARKNET) integration** — Daily wholesale prices from 3,000+ Indian markets via `MANDI_API_KEY` (data.gov.in). Filter by state, district, commodity; optional price per kg (Quintal ÷ 100).
- **Protected routes** — Farmer-only and buyer-only endpoints where needed.

## Tech Stack

- **Frontend:** React 18, Vite, React Router DOM, Tailwind CSS, socket.io-client
- **Backend:** Node.js, Express, Mongoose, JWT (jsonwebtoken), bcryptjs, multer, cors, dotenv, socket.io
- **Database:** MongoDB (Atlas or local)

## Getting Started

### 1. Environment variables

**Root (frontend)**  
Copy `.env.example` to `.env` in the project root and set:

```env
VITE_API_URL=http://localhost:5000
```

**Backend**  
Copy `backend/.env.example` to `backend/.env` and set:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/agrimarket?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5000
BASE_URL=http://localhost:5000
MANDI_API_KEY=your-data-gov-in-api-key
```

- Use your MongoDB Atlas connection string (or local MongoDB URI). Generate a long random string for `JWT_SECRET` in production.
- **Mandi prices:** Get `MANDI_API_KEY` from [data.gov.in](https://data.gov.in) (register and create an API key for the "Current daily price of various commodities from various markets (Mandi)" resource). Optional: set `MANDI_API_BASE_URL` if using a different resource URL.

### 2. Install dependencies

```bash
# Frontend (from project root)
npm install

# Backend
cd backend
npm install
```

### 3. Run the app

**Terminal 1 – backend**

```bash
cd backend
npm run dev
```

Server runs at `http://localhost:5000`. Use `npm start` for production.

**Terminal 2 – frontend**

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`. Open it in the browser and sign up as a farmer or buyer.

### 4. Demo users (optional)

The login page shows placeholder demo credentials. To use them, create two accounts once the backend is running:

1. Sign up with email `farmer@test.com`, password `farmer123`, role **Farmer**.
2. Sign up with email `buyer@test.com`, password `buyer123`, role **Buyer**.

Then you can log in with those credentials to test both roles.

## Scripts

### Frontend (root)
- `npm run dev` — Start Vite dev server
- `npm run build` — Production build
- `npm run preview` — Preview production build

### Backend (`backend/`)
- `npm run dev` — Start server with watch mode
- `npm start` — Start server (production)

## Project Structure

```
├── src/                    # Frontend
│   ├── components/         # Layout, Sidebar, ProtectedRoute
│   ├── pages/              # Home, Login, Signup, FarmerDashboard, BuyerMarketplace, AddProduct, MandiPrices, MyInquiries, InquiryChat
│   ├── utils/              # api.js, auth.js, socket.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── backend/
│   ├── config/             # db.js (MongoDB connection)
│   ├── middleware/        # auth.js, upload.js (multer)
│   ├── models/             # User, Product, Inquiry, Message
│   ├── routes/             # auth, products, inquiries, mandi
│   ├── socket.js           # Socket.io server (auth, join_inquiry, send_message)
│   ├── services/           # mandiService.js (AGMARKNET/data.gov.in fetch)
│   ├── uploads/            # Product images (created at runtime)
│   ├── server.js
│   └── .env.example
├── .env.example            # VITE_API_URL for frontend
└── README.md
```

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register (name, email, password, role) |
| POST | `/api/auth/login` | Login (email, password) → returns user + token |
| GET | `/api/auth/me` | Current user (Bearer token) |
| GET | `/api/products` | List products (query: `search`, `category`) |
| GET | `/api/products/my` | My products (farmer, auth) |
| POST | `/api/products` | Create product (farmer, auth; multipart for image) |
| GET | `/api/products/:id` | Single product |
| PUT | `/api/products/:id` | Update product (farmer, own) |
| DELETE | `/api/products/:id` | Delete product (farmer, own) |
| POST | `/api/inquiries` | Create inquiry (buyer, auth; body: productId, message) |
| GET | `/api/inquiries/my` | My inquiries (buyer or farmer, auth) |
| GET | `/api/inquiries/:id` | Single inquiry (participant only, auth) |
| PUT | `/api/inquiries/:id` | Update inquiry status (farmer only; body: `{ status: "accepted" }` or `{ status: "rejected" }`) |
| GET | `/api/inquiries/:id/messages` | Chat history for inquiry (participant only, auth) |
| GET | `/api/mandi/prices` | Mandi (AGMARKNET) daily prices (auth; query: `state`, `district`, `commodity`, `limit`, `pricePerKg`) |

### WebSocket (Socket.io)

Connect with auth: `auth: { token: "<JWT>" }`.

| Event (client → server) | Payload | Description |
|-------------------------|--------|-------------|
| `join_inquiry` | `inquiryId`, callback | Join room for this inquiry (participant only). Callback: `(ack)` with `ack.error` or `ack.ok`. |
| `send_message` | `{ inquiryId, text }`, callback | Send a message; saved to DB and broadcast to room. Callback: `(ack)` with `ack.error` or `ack.ok`, `ack.message`. |

| Event (server → client) | Payload | Description |
|-------------------------|--------|-------------|
| `new_message` | message object | New message in the inquiry chat (sender, text, createdAt, etc.). |

## Routes (Frontend)

- `/` — Home
- `/login` — Login
- `/signup` — Sign up
- `/buyer-marketplace` — Marketplace (protected, buyer)
- `/farmer-dashboard` — Farmer dashboard (protected, farmer)
- `/add-product` — Add product (protected, farmer)
- `/mandi-prices` — Daily mandi prices (protected, farmer & buyer)
- `/my-inquiries` — My lot requests (protected, buyer)
- `/inquiry/:id/chat` — Real-time chat for an inquiry (protected, participant only)

## Authentication

The app uses JWT. On login or sign up, the backend returns a token; the frontend stores it in `localStorage` and sends it as `Authorization: Bearer <token>` on API requests. Protected routes check for a stored user; expired or invalid tokens will cause API calls to fail (you can extend this with a refresh flow or redirect to login).

## License

MIT (or your chosen license).
# EPICProject
