import type { Order } from "./types";

export async function getOrders(): Promise<Order[]> {
  const response = await fetch("/api/orders");

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  const result: { data: Order[] } = await response.json();
  return result.data;
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<void> {
  const response = await fetch(`/api/orders/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Failed to update order");
  }
}