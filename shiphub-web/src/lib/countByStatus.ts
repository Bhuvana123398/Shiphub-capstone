
import type { Order, StatusCounts } from "../types";

export function countByStatus(orders: Order[]): StatusCounts {
  const counts: StatusCounts = {
    Pending: 0,
    Processing: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
  };

  for (const order of orders) {
    counts[order.status]++;
  }

  return counts;
}
