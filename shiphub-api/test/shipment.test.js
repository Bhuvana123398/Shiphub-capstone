import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../server.js';
import {
  validateNewShipment,
  paginate
} from '../shipment-store.js';
test('should accept a valid shipment', () => {
  const result = validateNewShipment({
    carrier: 'DHL',
    trackingNumber: 'DHL123456'
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});
test('should reject invalid shipment details', () => {
  const result = validateNewShipment({
    carrier: 'Amazon',
    trackingNumber: '123',
    extra: 'test'
  });

  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 3);
});
test('should return the requested page of shipments', () => {
  const shipments = [
    { id: 'S1', createdAt: '2026-01-01T10:00:00Z' },
    { id: 'S2', createdAt: '2026-01-02T10:00:00Z' },
    { id: 'S3', createdAt: '2026-01-03T10:00:00Z' }
  ];

  const result = paginate(shipments, 1, 2);

  assert.equal(result.page, 1);
  assert.equal(result.limit, 2);
  assert.equal(result.total, 3);
  assert.equal(result.totalPages, 2);
  assert.deepEqual(
    result.data.map((shipment) => shipment.id),
    ['S3', 'S2']
  );
});
test('should create a shipment and return a Location header', async () => {
  const response = await request(app)
    .post('/orders/ORD101/shipments')
    .send({
      carrier: 'DHL',
      trackingNumber: 'DHL123456'
    });

  assert.equal(response.status, 201);
  assert.ok(response.headers.location);
  assert.equal(response.body.data.carrier, 'DHL');
});
test('should reject invalid shipment fields', async () => {
  const response = await request(app)
    .post('/orders/ORD101/shipments')
    .send({
      carrier: 'Amazon',
      trackingNumber: '123',
      extra: 'test'
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.details.length, 3);
});
test('should return 404 for an unknown order', async () => {
  const response = await request(app)
    .get('/orders/UNKNOWN/shipments');

  assert.equal(response.status, 404);
});
test('should return an empty list for a page beyond the last page', async () => {
  const response = await request(app)
    .get('/orders/ORD101/shipments?page=999&limit=2');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body.data, []);
});
test('should replay an existing shipment for the same idempotency key', async () => {
  const shipmentData = {
    carrier: 'UPS',
    trackingNumber: 'UPS123456'
  };

  const firstResponse = await request(app)
    .post('/orders/ORD102/shipments')
    .set('Idempotency-Key', 'test-retry-001')
    .send(shipmentData);

  const retryResponse = await request(app)
    .post('/orders/ORD102/shipments')
    .set('Idempotency-Key', 'test-retry-001')
    .send(shipmentData);

  assert.equal(firstResponse.status, 201);
  assert.equal(retryResponse.status, 200);
  assert.equal(retryResponse.headers['idempotency-replayed'], 'true');
  assert.equal(
    retryResponse.body.data.id,
    firstResponse.body.data.id
  );
});
test('should return 422 when an idempotency key is reused with a different body', async () => {
  const firstResponse = await request(app)
    .post('/orders/ORD103/shipments')
    .set('Idempotency-Key', 'test-reuse-001')
    .send({
      carrier: 'DHL',
      trackingNumber: 'DHL123456'
    });

  const secondResponse = await request(app)
    .post('/orders/ORD103/shipments')
    .set('Idempotency-Key', 'test-reuse-001')
    .send({
      carrier: 'UPS',
      trackingNumber: 'UPS987654'
    });

  assert.equal(firstResponse.status, 201);
  assert.equal(secondResponse.status, 422);
});