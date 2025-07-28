// app/(tabs)/users.tsx

import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../lib/firebase';

type User = {
  id: string;
  fullName?: string;
  email: string;
  role: string; // 'seller' or 'user'
  image?: string;
  description?: string;
  rating?: number;
};

export default function UsersScreen() {
  const [sellers, setSellers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        const fetchedUsers: User[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];

        // סינון רק מוכרים
        const sellersOnly = fetchedUsers.filter((user) => user.role === 'seller');
        setSellers(sellersOnly);
      } catch (error) {
        console.error('שגיאה בטעינת משתמשים:', error);
      }
    };

    fetchUsers();
  }, []);

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`./${item.id}`)}
    >
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/80' }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{item.fullName || item.email}</Text>
      <Text style={styles.description}>{item.description || 'אין תיאור'}</Text>
      {item.rating !== undefined && (
        <Text style={styles.rating}>⭐ {item.rating.toFixed(1)} / 5</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>מוכרים זמינים ({sellers.length})</Text>

      <FlatList
        data={sellers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    textAlign: 'center',
    marginVertical: 6,
    color: '#555',
  },
  rating: {
    fontSize: 16,
    color: '#ffa500',
  },
});
