
export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface Order {
  id: string;
  customer: string;
  product: string;
  status: OrderStatus;
}

export type StatusCounts = Record<OrderStatus, number>;
