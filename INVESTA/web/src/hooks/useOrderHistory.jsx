import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { orderHistoryService } from "../services/orderHistoryService";

export function useOrderHistory(isin = null) {
  const { user, getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();
        const data = await orderHistoryService.getOrders(token, isin);
        console.log(data);
        setOrders(data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchOrders();
  }, [user, getAccessTokenSilently, isin]);

  return {
    orders,
    loading,
    error,
    hasOrders: orders.length > 0,
  };
}