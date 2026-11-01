import express from 'express';
import cors from 'cors';
import { getAllOrders, getOrderById, createOrder, updateOrder, getOrdersByStatus } from './order-store.js';
import { PORT } from './config.js';
import { logger } from './logger.js';
import { notFound } from './notFound.js';
import { errorHandler } from './errorHandler.js';
import { HttpError } from './HttpError.js';
const app = express();
app.use((req, res, next) => {
  const startTime = Date.now();

  logger.debug(`${req.method} ${req.path} - Request received`);

  res.on('finish', () => {
    const duration = Date.now() - startTime;

    const message = `${req.method} ${req.path} - Status: ${res.statusCode} - ${duration}ms`;

    if (res.statusCode >= 500) {
      logger.error(message);
    } else if (res.statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.info(message);
    }
  });
  next();
});
app.use(cors());
app.use(express.json());
app.get('/orders', (req, res) => {
  const { status } = req.query;
  if(status !== undefined){
    const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if(!allowedStatuses.includes(status)){
      return res.status(400).json({
        success: false,
        error: 'invalid status'
      });
    }
    return res.json({
      success: true,
      data: getOrdersByStatus(status)
    });
  }
  return res.json({
      success: true,
      data: getAllOrders()
    });
});
app.get('/orders/:id', (req, res) => {
  const order = getOrderById(req.params.id);
  if (!order) {
  throw new HttpError(
    404,
    `No order exists with ID ${req.params.id}`
  );
}
  return res.json(order);
});
app.post('/orders', (req, res) => {
  const { customer, product } = req.body ?? {};

  if (
    typeof customer !== 'string' ||
    !customer.trim() ||
    typeof product !== 'string' ||
    !product.trim()
  ) {
    throw new HttpError(400, 'Customer and product are both required.');
  }

  const created = createOrder(customer.trim(), product.trim());
  return res.status(201).json(created);
});
app.patch('/orders/:id', (req,res) =>{
  const {id} = req.params;
  const updates = req.body;
  if(!getOrderById(id)){
    return res.status(404).json({error: 'order not found'});
  }
  if(!updates || typeof updates !== 'object' || Array.isArray(updates) || Object.keys(updates).length === 0){
    return res.status(400).json({error: 'updated data is required'});
  }
  const allowedFields = ['customer', 'product', 'status'];
  if (Object.keys(updates).some(field => !allowedFields.includes(field))) {
    return res.status(400).json({
      success: false,
      error: 'Unknown fields are not allowed'
    });
  }
  for (const field of ['customer', 'product']) {
    if (
      field in updates &&
      (typeof updates[field] !== 'string' ||
        !updates[field].trim())
    ) {
      return res.status(400).json({
        success: false,
        error: `${field} must not be blank`
      });
    }
  }
  const allowedStatuses = ['Pending','Processing','Shipped','Delivered','Cancelled'];
  if('status' in updates && (typeof updates.status !== 'string' || !allowedStatuses.includes(updates.status))){
    return res.status(400).json({
      success: false,
      error: 'Invalid order status'
    });
  }
  const updatedOrder =  {...updates};
  if(updatedOrder.customer !== undefined){
    updatedOrder.customer = updatedOrder.customer.trim();
  }
  if(updatedOrder.product !== undefined){
    updatedOrder.product = updatedOrder.product.trim();
  }
  const updateddorder = updateOrder(id, updatedOrder);
  return res.status(200).json({
    success: true,
    data: updateddorder
  });
});
app.use(notFound);
app.use(errorHandler);
const server = app.listen(PORT, () => {
  logger.info(`ShipHub API running at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  logger.error(`Server listen error: ${err.message}`);
  process.exit(1);
});