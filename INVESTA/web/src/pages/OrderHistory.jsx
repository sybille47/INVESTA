import { useSearchParams } from "react-router-dom";
import OrderHistory from '../component/data/OrderHistory';
import { Card, CardHeader, CardTitle, CardContent } from '../component/ui/card';
import { useOrderHistory } from "../hooks/useOrderHistory";



function OrderHistoryPage() {
  const [searchParams] = useSearchParams();
  const isin = searchParams.get("isin");
  const { orders, loading, error, hasOrders } = useOrderHistory(isin);

  return (
    <div className="page-container">
      {/* <SubNavBar /> */}
      <h1 className="order-heading text-3xl font-bold mb-6">Order History</h1>
      <OrderHistory />
    </div>
  );
}

export default OrderHistoryPage;