import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { placeOrderService } from '../services/placeOrderService';

export function usePlaceOrder() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState({
    order_type: '',
    isin: '',
    trade_date: '',
    amount: '',
    units: '',
    fund_name: '',
    value_date: '',
    ccy: '',
    units_held:''
  });

  const placeOrder = async (newData) => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const result = await placeOrderService.postOrders(token, newData);

      setError(null);
      return { success: true, order_id: result.order_id };
    } catch (err) {
      setError(err.message);
      console.error('Failed to place order:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    orderData,
    setOrderData,
    loading,
    error,
    placeOrder,
  };
}