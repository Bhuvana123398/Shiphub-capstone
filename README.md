# ShipHub – Order Tracking Application

ShipHub is a full-stack order tracking application with an Express.js backend and React frontend. It allows users to view, filter, and manage orders.

# 1. Requirements

- Node.js >= 22
- npm
- Git

# 2. Project Structure

```text
Shiphub-capstone/
├── shiphub-api/       # Express backend
├── shiphub-web/       # React frontend
├── scripts/           # Setup scripts
├── package.json       # Root scripts
├── .gitignore
└── README.md
```

# 3. Installation and Setup

Clone the repository:

```bash
git clone <repository-url>
cd Shiphub-capstone
```

Run the setup command:

```bash
npm run setup
```

This command creates missing `.env` files from `.env.example` files without overwriting existing environment files and installs dependencies.

# 4. Run the Application

Start both frontend and backend:

```bash
npm run dev
```

Build the frontend:

```bash
npm run build
```

Start the backend:

```bash
npm start
```

# 5. Environment Configuration

# Backend – shiphub-api/.env

```env
PORT=3000
LOG_LEVEL=info
```

- PORT: Backend server port.
- LOG_LEVEL: Logging level (`debug`, `info`, `warn`, or `error`).

# Frontend – shiphub-web/.env

```env
API_URL=http://localhost:3000
```

- API_URL: Backend URL used by the Vite development proxy.

If the backend port changes, update API_URL to match it and restart the Vite development server.

# 6. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /orders | Get all orders |
| GET | /orders/:id | Get an order by ID |
| POST | /orders | Create an order |
| PATCH | /orders/:id | Update an order |

# 7. Error Handling and Logging

The backend uses centralized error handling with:

- HttpError for application errors.
- notFound middleware for unknown routes.
- errorHandler for consistent error responses.
- A leveled logger supporting debug, info, warn, and error.

Unexpected server errors return a generic response to the client. Detailed error information is logged on the server.

# 8. Troubleshooting

# Backend is not starting

- Check whether the configured PORT is already in use.
- Verify that PORT is a valid number between 1 and 65535.

# Frontend cannot load orders

- Make sure the backend is running.
- Check that API_URL points to the correct backend URL.
- Restart the Vite development server after changing API_URL.

# Missing environment files

Run:

```bash
npm run setup
```

Existing `.env` files will not be overwritten.

# Invalid log level

Use one of:

```text
debug
info
warn
error
```

# 9. Build

Run the following command to verify the frontend build:

```bash
npm run build
```