const orders=[
    {
        "id": "ORD101",
        "customer": "Bhuna",
        "product": "Laptop",
        "status": "Shipped"
    },
    {
        "id": "ORD102",
        "customer": "Alice Johnson",
        "product": "Tab",
        "status": "Processing"
    },
    {
        "id": "ORD103",
        "customer": "Bob smith",
        "product": "Laptop charger",
        "status": "Cancelled"
    },
    {
        "id": "ORD104",
        "customer": "Alice Johnson",
        "product": "Tab",
        "status": "Pending"
    }
];

export function getAllOrders() {
    return orders;
}
export function getOrderById(id) {
    return orders.find((order) => order.id === id) ?? null;
}
export function createOrder(customer, product) {
  const order = {
    id: `ORD-${String(nextId++).padStart(3, '0')}`,
    customer,
    product,
    status: 'pending'
  };
  orders.push(order);
  return order;
}
export function updateOrder(id, updates){
  const order = getOrderById(id);
  if(!order){
    return null;
  }
  if (updates.customer !== undefined){
    order.customer = updates.customer  
  }
  if(updates.product !== undefined){
    order.product = updates.product;
  }
  if(updates.status !== undefined){
    order.status = updates.status;
  }
  return order;
}
export function getOrdersByStatus(status){
  if(!status){
    return getAllOrders();
  }
  return orders.filter((order) => order.status === status);
}
