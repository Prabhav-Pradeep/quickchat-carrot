# QuickChat

QuickChat is a real-time messaging application built on the MERN stack with Socket.io for live communication. It supports authenticated one-to-one conversations, persistent message history, online presence tracking, unread message counts, and inline image sharing.

## Overview

The application is split into two independently run services: a React single-page frontend and an Express REST API backend. The two communicate over HTTP for standard CRUD operations (authentication, message history, profile updates) and over a persistent WebSocket connection (via Socket.io) for real-time events such as message delivery and online status updates.

Authentication is session-based using a signed token. On login, the backend issues a token that is stored in `localStorage` on the client and attached to subsequent requests. On every page load, the frontend re-validates this token against the backend before rendering protected routes, so sessions persist across refreshes without requiring the user to log in again.

## Core Features

### Authentication
Users sign up and log in with email and password. The backend issues a token on successful authentication, which the client persists locally and uses to authorize all further requests. A dedicated check endpoint allows the frontend to verify token validity on load and restore the session.

### Real-time Messaging
Each conversation is scoped to a sender and receiver pair. When a user sends a message, it is persisted to the database and simultaneously emitted to the recipient's active socket connection if they are online, so messages appear instantly without polling.

### Online Presence
The backend maintains a mapping of connected users to their active socket IDs. This is broadcast to all connected clients whenever a user connects or disconnects, allowing the sidebar to reflect accurate online and offline status in real time.

### Unseen Message Tracking
Messages are marked as seen or unseen at the database level. The sidebar aggregates unseen message counts per contact, and these are cleared when the corresponding conversation is opened.

### Image Sharing
Users can attach images to messages. Images are uploaded to Cloudinary, and the resulting URL is stored alongside the message record rather than the raw file, keeping the database lightweight.

### Profile Management
Users can update their display name, bio, and profile picture after account creation.

## Project Structure

```
quickchat/
├── client/                 # React frontend
│   ├── src/
│   │   ├── assets/
│   │   ├── components/     # Sidebar, ChatContainer, etc.
│   │   ├── context/        # AuthContext, ChatContext
│   │   ├── pages/          # HomePage, LoginPage, ProfilePage
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                  # Express backend
│   ├── controllers/        # authController, messageController
│   ├── lib/                 # cloudinary, db connection
│   ├── middleware/          # auth middleware
│   ├── models/              # User, Message
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── README.md
```

> Adjust folder names above if your repo structure differs, for example if you use `frontend` and `backend` instead of `client` and `server`.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local instance or MongoDB Atlas)
- A Cloudinary account (for image uploads)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd quickchat
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend server:

```bash
npm run dev
```

The server should now be running on `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Start the frontend dev server:

```bash
npm run dev
```

The app should now be running on `http://localhost:5173`.

## API Reference

All routes are prefixed with `/api`. Protected routes require the `token` header set on the request, which the frontend attaches automatically once a user is authenticated.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Create a new account |
| POST | `/auth/login` | Authenticate and receive a token |
| GET | `/auth/check` | Validate the current token and return the associated user |
| PUT | `/auth/update-profile` | Update the authenticated user's profile |
| GET | `/messages/users` | Get the sidebar list of users along with unseen message counts |
| GET | `/messages/:id` | Get the full message history with a specific user |
| POST | `/messages/send/:id` | Send a message to a specific user |
| PUT | `/messages/mark/:id` | Mark a specific message as seen |

### Socket events

| Event | Direction | Description |
|---|---|---|
| `newMessage` | Server to client | Emitted to the recipient's socket when a new message is sent |
| `getOnlineUsers` | Server to client | Broadcast whenever a user connects or disconnects, containing the current list of online user IDs |

## Usage

1. Open the app and create an account, or log in if you already have one.
2. Browse the sidebar to see available contacts and their online status.
3. Click on a contact to open the chat window and load the conversation history.
4. Send text messages or attach images, which appear instantly for the recipient if they are online.
5. Unread messages show up as a badge count next to each contact and clear once the conversation is opened.

## Known Limitations and Roadmap

- [ ] Delivery and read receipts beyond a single "seen" flag
- [ ] Typing indicators
- [ ] Message editing and deletion
- [ ] Group conversations
- [ ] Deployment configuration (currently local development only)

## Tech Stack

**Frontend**

- React (Vite)
- React Router DOM
- Tailwind CSS
- Axios
- Socket.io-client
- React Hot Toast

**Backend**

- Node.js and Express
- MongoDB with Mongoose
- Socket.io
- Cloudinary for image storage
- Token-based authentication

## License

This project is open for personal and educational use. Add a license of your choice, MIT is a reasonable default, if you plan to share or open-source this repository.
