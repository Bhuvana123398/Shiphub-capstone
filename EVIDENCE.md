# Test Evidence

# 1. Unknown Order ID

$ curl.exe -i http://localhost:4000/orders/UNKNOWN

HTTP/1.1 404 Not Found


{"success":false,"error":"No order exists with ID UNKNOWN"}


# 2. Unknown Route

$ curl.exe -i http://localhost:4000/unknown-route

HTTP/1.1 404 Not Found


{"success":false,"error":"Route not found"}

# 3. Malformed JSON

$ curl.exe -i -X POST http://localhost:4000/orders -H 
"Content-Type: application/json" -d "{bad json"

HTTP/1.1 400 Bad Request


{"success":false,"error":"Expected property name or '}' in JSON at position 1 (line 1 column 2)"}

**Failure Explanation – Malformed JSON**

When a client sends malformed JSON to the ShipHub API, the request first reaches the Express server. The JSON body parser attempts to parse the request body but fails because the JSON syntax is invalid. Express passes this parsing error to the centralized error-handling middleware.

The error handler identifies the parsing error as a client-side request error and returns HTTP 400 Bad Request with a JSON error response. The client receives a helpful message explaining the parsing problem instead of an internal server error.

The backend log records the request method, route, error message, response status, and processing time. The actual log entry was:

[WARN] POST /orders - Status: 400 - 2ms

This helps identify which request failed and why. Since the request contains invalid input, it is treated as a 400 error rather than a 500 server error. Centralized error handling keeps error responses consistent and makes debugging easier.


# 4. Empty Customer


$ curl.exe -i -X POST http://localhost:4000/orders -H "Content-Type: application/json" -d '{"customer":"","product":"Laptop"}'

HTTP/1.1 400 Bad Request


{"success":false,"error":"Customer and product are both required."}

# 5. Internal Server Error
$ curl.exe -i http://localhost:4000/test-error


{"success":false,"error":"Route not found"}

# 6. Frontend Proxy Test

$ curl.exe -i http://localhost:5173/api/orders


{"success":true,"data":[{"id":"ORD101","customer":"Bhuna","product":"Laptop","status":"Shipped"},{"id":"ORD102","customer":"Alice Johnson","product":"Tab","status":"Processing"},{"id":"ORD103","customer":"Bob smith","product":"Laptop charger","status":"Cancelled"},{"id":"ORD104","customer":"Alice Johnson","product":"Tab","status":"Pending"}]}

# Fresh-Clone Test
Cloned the GitHub repository into a separate folder named Shiphub-fresh-test

# Setup command:
            npm run setup

Result: Both .env files were created, and root, backend, and frontend dependencies installed successfully.

# Build command:

npm run build

Result: TypeScript check and Vite production build completed successfully.

# Backend test:

Started the backend using npm start.

Backend ran successfully on port 3000.

GET /orders returned all four orders.

# Frontend test:

Started the frontend using npm run dev.

Opened the application at http://localhost:5173/.

All four orders and their status summary were displayed correctly.

Search, status filtering, and eligible shipping actions were visible.

# Conclusion: 
        The repository can be cloned, configured, installed, built, and run successfully in a fresh environment.