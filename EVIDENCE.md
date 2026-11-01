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

