import { useEffect, useState } from "react";
import "./app.css";

import { getOrders, updateOrderStatus } from "./api";
import SearchBox from "./components/SearchBox";
import StatusSummary from "./components/StatusSummary";
import type { Order, OrderStatus } from "./types";

const STATUSES: OrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];
function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<OrderStatus | "All">("All");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refreshOrders() {
    setLoading(true);
    setError("");

    try {
      const data = await getOrders();
      setOrders(data);
    } catch {
      setError("Could not load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshOrders();
  }, []);

  const visibleOrders = orders.filter((order) => {
    const matchesStatus =
      status === "All" || order.status === status;

    const matchesCustomer = order.customer
      .toLowerCase()
      .includes(query.trim().toLowerCase());

    return matchesStatus && matchesCustomer;
  });

  async function markAsShipped(id: string) {
    try {
      await updateOrderStatus(id, "Shipped");
      await refreshOrders();
    } catch {
      setError("Could not update the order. Please try again.");
    }
  }

  return (
    <main>
      <h1>ShipHub Order Tracker</h1>

      {loading && <p>Loading orders...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        <>
          <StatusSummary orders={orders} />

          <SearchBox
            query={query}
            onQueryChange={setQuery}
          />

          <label>
            Filter by status:{" "}
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as OrderStatus | "All")
              }
            >
              <option value="All">All</option>

              {STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {visibleOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.product}</td>
                  <td>
                    <span
                      className={`status-badge ${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button
                      disabled={
                        order.status === "Shipped" ||
                        order.status === "Delivered" ||
                        order.status === "Cancelled"
                      }
                      onClick={() => void markAsShipped(order.id)}
                    >
                      Mark as Shipped
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {visibleOrders.length === 0 && (
            <p>No orders match.</p>
          )}
        </>
      )}
    </main>
  );
}

export default App;