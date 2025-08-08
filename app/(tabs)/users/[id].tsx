import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../../lib/firebase';

type User = {
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
};

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const docRef = doc(db, 'users', String(id));
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUser({ id: docSnap.id, ...docSnap.data() } as User);
        }
      } catch (error) {
        console.error('שגיאה בטעינה:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>משתמש לא נמצא.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: user.image || 'https://via.placeholder.com/150' }} style={styles.avatar} />

      <Text style={styles.name}>{user.fullName || user.email}</Text>
      <Text style={styles.description}>{user.description || 'אין תיאור.'}</Text>
      {user.rating !== undefined && <Text style={styles.rating}>⭐ {user.rating.toFixed(1)} / 5</Text>}

      {user.address && <Text style={styles.info}>📍 {user.address}</Text>}
      {user.availableHours && <Text style={styles.info}>🕒 {user.availableHours}</Text>}

      {user.drinks && user.drinks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>☕ משקאות:</Text>
          {user.drinks.map((drink, i) => (
            <Text key={i}>• {drink}</Text>
          ))}
        </View>
      )}

      {user.photos && user.photos.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📸 תמונות:</Text>
          <ScrollView horizontal>
            {user.photos.map((photo, i) => (
              <Image key={i} source={{ uri: photo }} style={styles.media} />
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
  container: { padding: 16, backgroundColor: '#fff' },
  avatar: { width: 150, height: 150, borderRadius: 75, alignSelf: 'center', marginBottom: 16 },
  name: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  description: { textAlign: 'center', fontSize: 16, marginVertical: 8 },
  rating: { textAlign: 'center', fontSize: 18, color: '#ffa500' },
  info: { fontSize: 16, marginVertical: 4 },
  section: { marginTop: 16 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 8 },
  media: { width: 120, height: 120, borderRadius: 12, marginRight: 8 },
  button: {
    backgroundColor: '#2e86de',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});