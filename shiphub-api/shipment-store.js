import { randomUUID } from 'node:crypto';

const shipments = [];
const idempotencyRecords = new Map();

export function validateNewShipment(body) {
  const errors = [];
  const allowedFields = ['carrier', 'trackingNumber'];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return {
      valid: false,
      errors: ['Request body must be an object']
    };
  }

  const unknownFields = Object.keys(body).filter(
    (field) => !allowedFields.includes(field)
  );

  if (unknownFields.length > 0) {
    errors.push(`Unknown fields: ${unknownFields.join(', ')}`);
  }

  const allowedCarriers = ['DHL', 'FedEx', 'UPS'];

  if (!allowedCarriers.includes(body.carrier)) {
    errors.push('Carrier must be DHL, FedEx, or UPS');
  }

  if (
    typeof body.trackingNumber !== 'string' ||
    body.trackingNumber.trim().length < 5 ||
    body.trackingNumber.trim().length > 40
  ) {
    errors.push('Tracking number must be 5–40 characters after trimming');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function createShipment(orderId, body, idempotencyKey) {
  const normalizedBody = {
    carrier: body.carrier,
    trackingNumber: body.trackingNumber.trim()
  };

  if (idempotencyKey && idempotencyRecords.has(idempotencyKey)) {
    const existing = idempotencyRecords.get(idempotencyKey);

    if (
      existing.orderId !== orderId ||
      JSON.stringify(existing.body) !== JSON.stringify(normalizedBody)
    ) {
      const error = new Error(
        'Idempotency key was already used with a different request'
      );
      error.statusCode = 422;
      throw error;
    }

    return {
      shipment: existing.shipment,
      replayed: true
    };
  }

  const shipment = {
    id: randomUUID(),
    orderId,
    ...normalizedBody,
    createdAt: new Date().toISOString()
  };

  shipments.push(shipment);

  if (idempotencyKey) {
    idempotencyRecords.set(idempotencyKey, {
      orderId,
      body: normalizedBody,
      shipment
    });
  }

  return {
    shipment,
    replayed: false
  };
}

export function getShipmentsByOrderId(orderId) {
  return shipments.filter((shipment) => shipment.orderId === orderId);
}
export function paginate(items, page = 1, limit = 20) {
  const sortedItems = [...items].sort((a, b) => {
    const dateDifference =
      new Date(b.createdAt) - new Date(a.createdAt);

    if (dateDifference !== 0) {
      return dateDifference;
    }

    return a.id.localeCompare(b.id);
  });

  const total = sortedItems.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;

  return {
    data: sortedItems.slice(startIndex, startIndex + limit),
    page,
    limit,
    total,
    totalPages
  };
}