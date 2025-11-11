import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { fundService } from '../services/fundService';

export function useFundTotal() {
  const { getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchTotal() {
      try {
        console.log("🎣 useFundTotal: Fetching...");
        setLoading(true);
        setError(null);

        const token = await getAccessTokenSilently();
        console.log("🔑 Token obtained");

        const result = await fundService.getFundsTotal(token);
        console.log("📊 Total data received:", result);

        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        console.error("❌ useFundTotal error:", err);
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    }

    fetchTotal();

    return () => {
      isMounted = false;
    };
  }, [getAccessTokenSilently]);

  return {
    totalValue: data?.total_value || 0,
    data,
    loading,
    error,
    hasData: data !== null && data.total_value !== undefined,
  };
}