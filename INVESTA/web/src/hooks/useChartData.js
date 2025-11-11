import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function useNavHistory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE}/nav`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch NAV history');

        const navData = await response.json();
        setData(navData);
        setError(null);
      } catch (err) {
        console.error('Error fetching NAV history:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [getAccessTokenSilently]);

  return {
  data,
  loading,
  error,
  hasData: Array.isArray(data) && data.length > 0
};
}

export function useFundAllocation() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE}/charts/fund-allocation`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch fund allocation');

        const allocation = await response.json();
        setData(allocation);
        setError(null);
      } catch (err) {
        console.error('Error fetching fund allocation:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [getAccessTokenSilently]);

  return {
  data,
  loading,
  error,
  hasData: Array.isArray(data) && data.length > 0
};
}

export function useMonthlyInvestments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE}/charts/monthly-counts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch monthly counts');

        const counts = await response.json();
        console.debug('monthly-counts raw response:', counts);
        setData(counts);

        setData(counts);
        setError(null);
      } catch (err) {
        console.error('Error fetching monthly counts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [getAccessTokenSilently]);

  return {
  data,
  loading,
  error,
  hasData: Array.isArray(data) && data.length > 0
};
}

export function useInvestmentValue() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE}/charts/investment-value`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch investment value');

        const values = await response.json();
        setData(values);
        setError(null);
      } catch (err) {
        console.error('Error fetching investment value:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [getAccessTokenSilently]);

  return {
  data,
  loading,
  error,
  hasData: Array.isArray(data) && data.length > 0
};
}