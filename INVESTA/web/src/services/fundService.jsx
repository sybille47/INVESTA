// const API_BASE_URL = "http://localhost:3000";

const API_BASE_URL = import.meta.env.VITE_API_URL ||
                    (import.meta.env.MODE === 'production' ? '' : 'http://localhost:3000');


export const fundService = {
  async getFunds(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/funds`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`Failed to fetch funds`);
      return response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  },

  async getFundByIsin(token, isin) {
    try {
      console.log("Fetching single fund:", isin);
      const response = await fetch(`${API_BASE_URL}/api/funds/${isin}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to fetch fund data: ${response.status} ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  },

  async getFundsTotal(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/funds-total`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`Failed to fetch total: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
}