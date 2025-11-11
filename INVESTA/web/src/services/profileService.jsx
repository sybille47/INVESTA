// const API_BASE_URL = 'http://localhost:3000';

const API_BASE_URL = import.meta.env.VITE_API_URL ||
                    (import.meta.env.MODE === 'production' ? '' : 'http://localhost:3000');


export const profileService = {
  async getProfile(token) {
    try {
      console.log('Fetching profile from:', `${API_BASE_URL}/profile`);
      console.log('With token:', token ? 'Token exists' : 'No token');

      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch profile service: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Profile data received:', data);
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },

  async updateProfile(token, profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      console.log('Update response status:', response.status, profileData);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update error response:', errorText);
        throw new Error(`Failed to update profile: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Update fetch error:', error);
      throw error;
    }
  }
};