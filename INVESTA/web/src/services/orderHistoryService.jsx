const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const orderHistoryService = {
  async getOrders(token, isin) {
    const url = isin
            ? `${import.meta.env.VITE_API_URL}/api/orders?isin=${isin}`
            : `${import.meta.env.VITE_API_URL}/api/orders`;

      console.log("🔍 Fetching:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

  if (!response.ok && response.status !== 304) {
      throw new Error(`Failed to fetch orders (status ${response.status})`);
    }

    return response.json();
  },
};