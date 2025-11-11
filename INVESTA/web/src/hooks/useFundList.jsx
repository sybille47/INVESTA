import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { fundService } from '../services/fundService';

export function useFundList() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [funds, setFunds] = useState([]);

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();
        const data = await fundService.getFunds(token);
        setFunds(data || []);
        console.log('data in hook:', data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch funds hook:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFunds();
    }
  }, [user, getAccessTokenSilently]);

  return {
    funds,
    loading,
    error,
    hasFunds: funds.length > 0
  };
}