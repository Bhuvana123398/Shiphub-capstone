import express from 'express';
import cors from 'cors';
import { getAllOrders, getOrderById, createOrder, updateOrder, getOrdersByStatus } from './order-store.js';
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
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
    return res.status(404).json({ error: 'Order not found', details: `No order exists with ID ${req.params.id}` });
  }
  return res.json(order);
});
app.post('/orders', (req, res) => {
  const { customer, product } = req.body ?? {};
  if (typeof customer !== 'string' || !customer.trim() || typeof product !== 'string' || !product.trim()) {
    return res.status(400).json({ error: 'Validation failed', details: 'Customer and product are both required.' });
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
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});
app.use((err, req, res, next) => {
  console.error(err.message);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status || 500).json({
    success: false,
    error: err.status === 400
      ? 'Invalid request body'
      : 'Internal server error'
  });
});
app.listen(PORT, () => {
  console.log(`ShipHub API running at http://localhost:${PORT}`);
});