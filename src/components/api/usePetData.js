import { useState, useEffect } from 'react';
import { fetchPet } from './api';

const usePetData = (id) => {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPet = async () => {
      try {
        const petData = await fetchPet(id);
        setPet(petData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pet details:', error);
        setLoading(false);
      }
    };

    getPet();
  }, [id]);

  return { pet, loading, setPet };
};

export default usePetData;
