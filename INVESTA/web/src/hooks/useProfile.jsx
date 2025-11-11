import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { profileService } from '../services/profileService';

export function useProfile() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    email_address: '',
    first_name: '',
    last_name: '',
    street: '',
    house_no: '',
    zip_code: '',
    town: '',
    country: '',
    holder: '',
    iban: '',
    bank_name: '',
    bic: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();
        const data = await profileService.getProfile(token);

        if (data && data.length > 0) {
          setProfileData(data[0]);
        }
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, getAccessTokenSilently]);

  const updateProfile = async (newData) => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const updated = await profileService.updateProfile(token, newData);
      console.log('new Data', newData);
      console.log('updated', updated);
      setProfileData(updated);
      setError(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Failed to update profile:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    profileData,
    loading,
    error,
    updateProfile,
    setProfileData
  };
}