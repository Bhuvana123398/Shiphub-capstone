# ShipHub Shipment API Documentation

## 1. Overview

The Shipment API allows clients to create shipments for existing orders and retrieve shipment records with pagination.

Base URL:

```text
http://localhost:3000
```

## 2. Create a Shipment

**Endpoint:** `POST /orders/:id/shipments`

Creates a shipment for an existing order.

### Request Headers

| Header | Required | Description |
|---|---|---|
| Content-Type | Yes | application/json |
| Idempotency-Key | No | Prevents duplicate shipments during retries |

### Request Body

```json
{
  "carrier": "DHL",
  "trackingNumber": "DHL123456"
}
```

### Validation Rules

- `carrier` must be DHL, FedEx, or UPS.
- `trackingNumber` must be a string containing 5–40 characters after trimming whitespace.
- Unknown fields are rejected.
- The order ID must belong to an existing order.

### Success Response

**Status:** `201 Created`

```json
{
  "data": {
    "id": "generated-shipment-id",
    "orderId": "ORD101",
    "carrier": "DHL",
    "trackingNumber": "DHL123456",
    "createdAt": "2026-11-01T05:00:00.000Z"
  }
}
```

The response includes a `Location` header containing the shipment resource path.

### Idempotency

When a client sends an `Idempotency-Key`, the server stores the key with the request details and created shipment.

- Retrying the same request with the same key returns the existing shipment with status `200 OK`.
- The response includes `Idempotency-Replayed: true`.
- Reusing the same key with a different order or request body returns `422 Unprocessable Entity`.

## 3. Get Shipments

**Endpoint:** `GET /orders/:id/shipments`

Retrieves shipments belonging to an existing order.

### Query Parameters

| Parameter | Default | Description |
|---|---:|---|
| page | 1 | Page number |
| limit | 20 | Number of shipments per page |

The maximum allowed limit is 100.

### Example Request

```text
GET /orders/ORD101/shipments?page=1&limit=10
```

### Success Response

**Status:** `200 OK`

```json
{
  "data": [],
  "page": 1,
  "limit": 10,
  "total": 0,
  "totalPages": 0
}
```

Shipments are sorted by creation time (newest first), with shipment ID as the secondary sort order.

If the requested page is beyond the last page, the API returns an empty `data` array.

## 4. Error Responses

All errors use the following response structure:

```json
{
  "error": "Error message",
  "details": [],
  "fields": {}
}
```

### HTTP Status Codes

| Status Code | Meaning | Scenario |
|---|---|---|
| 400 | Bad Request | Invalid shipment fields or pagination parameters |
| 404 | Not Found | Order does not exist |
| 422 | Unprocessable Entity | Idempotency key reused with a different request |
| 500 | Internal Server Error | Unexpected server error |

### Example Validation Error

```json
{
  "error": "Shipment validation failed",
  "details": [
    "Carrier must be DHL, FedEx, or UPS",
    "Tracking number must be 5–40 characters after trimming"
  ],
  "fields": {}
}
```

## 5. Testing

The API uses Node.js built-in test runner and Supertest for testing.

Run all tests:

```bash
npm test
```

Run linting:

```bash
npm run lint
```

Run linting and tests together:

```bash
npm run check
```

The test suite covers shipment validation, pagination, shipment creation, unknown orders, idempotent retries, and error handling.

## 6. API Design Reflection

One challenging design decision was implementing idempotency to prevent duplicate shipments when clients retry requests. I used an in-memory Map to associate each idempotency key with its original request and shipment response. Another challenge was implementing pagination while maintaining a consistent sorting order. I separated validation and pagination into pure functions so they could be tested independently. This made the API easier to maintain and helped identify pagination errors during testing.