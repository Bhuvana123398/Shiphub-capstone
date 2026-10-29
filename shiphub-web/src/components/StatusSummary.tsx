import type { Order } from "../types";
import { countByStatus } from "../lib/countByStatus";

interface StatusSummaryProps {
  orders: Order[];
}

export default function StatusSummary({
  orders,
}: StatusSummaryProps) {
  const counts = countByStatus(orders);

  return (
    <section>
      <h2>Order Summary</h2>

      {Object.entries(counts).map(([status, count]) => (
        <p key={status}>
          {status}: {count}
        </p>
      ))}
    </section>
  );
}