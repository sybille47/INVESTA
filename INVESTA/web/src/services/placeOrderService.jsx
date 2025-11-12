// const API_BASE_URL = 'http://localhost:3000';

const API_BASE_URL = import.meta.env.VITE_API_URL ||
                    (import.meta.env.MODE === 'production' ? '' : 'http://localhost:3000');


export const placeOrderService = {
  async postOrders(token, orderData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      console.log('OrderData sent:', orderData);
      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Post error response:', errorText);
        throw new Error(
          `Failed to post order service: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();
      console.log('Response JSON:', data);
      return data;

    } catch (error) {
      console.error('Post fetch error:', error);
      throw error;
    }
  },
};
