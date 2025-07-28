import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Seller } from '../types';

export const useSellers = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'users'), 
          where('userType', '==', 'seller'),
          where('isActive', '==', true)
        );
        
        const querySnapshot = await getDocs(q);
        const sellersData: Seller[] = [];
        
        querySnapshot.forEach((doc) => {
          sellersData.push({
            id: doc.id,
            ...doc.data()
          } as Seller);
        });
        
        setSellers(sellersData);
        setError(null);
      } catch (err) {
        setError('שגיאה בטעינת המוכרים');
        console.error('Error fetching sellers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  return { sellers, loading, error };
};