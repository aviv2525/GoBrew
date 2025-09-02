// app/(tabs)/users.tsx

import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth'; // 
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Paragraph, Title } from "react-native-paper";
import { db } from '../lib/firebase';



type User = {
  id: string;
  fullName?: string;
  email: string;
  role: string; // 'seller' or 'user'
  imageUrl?: string;
  description?: string;
  rating?: number;
  online?: boolean;
  address?: string;
  openHours?: string;
  drinksOffered?: string[];
  machineType?: string;
};



export default function UsersScreen() {
  
  
  /*
  ~~~~ with online user view : ~~~~
  V 
  import { collection, onSnapshot } from 'firebase/firestore';
  
  // במקום getDocs
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const fetchedUsers: User[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        })) as User[];
        
        const sellersOnly = fetchedUsers.filter((user) => user.role === 'seller');
        setSellers(sellersOnly);
        });
        
        return () => unsubscribe();
        }, []);
        
        
        */
       
       
       
  const router = useRouter();
  const [sellers, setSellers] = useState<User[]>([]);
  const [role, setRole] = useState<'seller' | 'user' | null>(null);       // ⬅️ חדש
  const [pendingCount, setPendingCount] = useState(0);                    // ⬅️ חדש
  const auth = getAuth();
  const uid = auth.currentUser?.uid;
  const isLoggedIn = !!uid;



useEffect(() => {

    (async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const fetchedUsers: User[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      setSellers(fetchedUsers.filter((u) => u.role === 'seller'));
    })();
  }, []);

  // טעינת תפקיד המשתמש המחובר + מונה הזמנות ממתינות אם הוא מוכר
  useEffect(() => {
    let unsub = () => {};
    (async () => {
      if (!uid) { setRole(null); setPendingCount(0); return; }
      const meSnap = await getDoc(doc(db, 'users', uid));
      const myRole = (meSnap.exists() ? (meSnap.data() as any).role : 'user') as 'seller'|'user';
      setRole(myRole);

      if (myRole === 'seller') {
        const qRef = query(
          collection(db, 'orders'),
          where('sellerId', '==', uid),
          where('status', '==', 'pending')
        );
        unsub = onSnapshot(qRef, (snap) => setPendingCount(snap.size));
      }
    })();
    return () => unsub();
  }, [uid]);

  const renderItem = ({ item }: { item: User }) => (
    <Card style={styles.card} onPress={() => router.push(`/${item.id}`)}>
      <Card.Cover source={{ uri: item.imageUrl || 'https://via.placeholder.com/400x200' }} />
      <Card.Content>
        <Title style={styles.name}>{item.fullName || item.email}</Title>
        <Paragraph style={styles.description}>📍 {item.address || 'כתובת לא זמינה'}</Paragraph>
        <Paragraph style={styles.description}>🕒 {item.openHours || 'שעות לא זמינות'}</Paragraph>
        <Paragraph style={styles.description}>☕ {item.drinksOffered?.join(', ') || 'אין משקאות רשומים'}</Paragraph>
        <Paragraph style={styles.description}>🛠 {item.machineType || 'סוג מכונה לא ידוע'}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={() => router.push(`/${item.id}`)}>
          הזמן עכשיו
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* אזור כפתורים עליון */}
      <View style={{ alignItems: 'flex-end', marginBottom: 10, gap: 8 }}>
        {role === 'seller' && (
          <Button
            mode="contained"
            onPress={() => router.push('/inbox')}
          >
            ניהול הזמנות{pendingCount ? ` (${pendingCount})` : ''}
          </Button>
        )}

        {isLoggedIn ? (
          <Button onPress={() => router.push('/profile')}>הפרופיל שלי</Button>
        ) : (
          <Button onPress={() => router.replace('/')}>התחבר</Button>
        )}
      </View>

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 6 }}>משתמשים זמינים</Text>
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
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  name: { fontSize: 18, fontWeight: "bold", color: "#333" },
  description: { fontSize: 14, color: "#666" },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#333' },
});

