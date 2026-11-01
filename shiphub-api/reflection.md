# ShipHub – Deployment Reflection

If the server restarts, all shipment data and idempotency records stored in memory will be lost. This happens because arrays and Maps exist only while the Node.js process is running.

If three server instances run behind a load balancer, each instance maintains its own separate memory. A shipment created on one instance may not be available on another instance. This can also cause duplicate shipments if an idempotency key is received by different instances.

To solve these problems, I would use a shared database to store shipments and idempotency records. All server instances would connect to the same database. A unique constraint on the idempotency key, combined with database transactions, would help prevent duplicate shipments. This would make the application more reliable, consistent, and suitable for multiple server instances.

Database transactions would ensure that creating a shipment and recording its idempotency key happen together, preventing inconsistent data if a request fails midway.