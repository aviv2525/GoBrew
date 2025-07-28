import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../lib/firebase';

type Seller = {
  id: string;
  fullName?: string;
  email: string;
  image?: string;
  description?: string;
  rating?: number;
  address?: string;
  availableHours?: string;
  drinks?: string[];
  photos?: string[];
  videos?: string[];
};

export default function SellerProfileScreen() {
  const { id } = useLocalSearchParams();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const docRef = doc(db, 'users', String(id));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSeller({ id: docSnap.id, ...docSnap.data() } as Seller);
        }
      } catch (error) {
        console.error('שגיאה בטעינת מוכר:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeller();
  }, [id]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  if (!seller) {
    return (
      <View style={styles.container}>
        <Text>לא נמצא מוכר עם מזהה זה.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: seller.image || 'https://via.placeholder.com/150' }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{seller.fullName || seller.email}</Text>
      <Text style={styles.description}>{seller.description || 'אין תיאור זמין.'}</Text>
      {seller.rating !== undefined && (
        <Text style={styles.rating}>⭐ {seller.rating.toFixed(1)} / 5</Text>
      )}

      {seller.address && <Text style={styles.info}>📍 {seller.address}</Text>}
      {seller.availableHours && <Text style={styles.info}>🕒 {seller.availableHours}</Text>}

      {seller.drinks && seller.drinks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>☕ משקאות מוצעים:</Text>
          {seller.drinks.map((drink, index) => (
            <Text key={index}>• {drink}</Text>
          ))}
        </View>
      )}

      {seller.photos && seller.photos.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📷 תמונות:</Text>
          <ScrollView horizontal>
            {seller.photos.map((photo, index) => (
              <Image
                key={index}
                source={{ uri: photo }}
                style={styles.media}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {seller.videos && seller.videos.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎥 סרטונים:</Text>
          <ScrollView horizontal>
            {seller.videos.map((video, index) => (
              <Image
                key={index}
                source={{ uri: video }} // תוכל להחליף בנגן בעתיד
                style={styles.media}
              />
            ))}
          </ScrollView>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={() => alert('הזמנה נשלחה!')}>
        <Text style={styles.buttonText}>📩 הזמן עכשיו</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginVertical: 8,
    fontSize: 16,
    color: '#555',
  },
  rating: {
    textAlign: 'center',
    fontSize: 18,
    color: '#ffa500',
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    marginVertical: 4,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  media: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 8,
  },
  button: {
    backgroundColor: '#2e86de',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
