// app/(tabs)/users.tsx

import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Paragraph, Title } from "react-native-paper";
import { db } from '../lib/firebase';

type User = {
  id: string;
  fullName?: string;
  email: string;
  role: string; // 'seller' or 'user'
  image?: string;
  description?: string;
  rating?: number;

  address?: string;
  openHours?: string;
  drinksOffered?: string[];
  machineType?: string;
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
  <Card style={styles.card} onPress={() => router.push(`./${item.id}`)}>
    <Card.Cover source={{ uri: item.image || 'https://via.placeholder.com/400x200' }} />

    <Card.Content>
      <Title style={styles.name}>{item.fullName || item.email}</Title>

      <Paragraph style={styles.description}>
        📍 {item.address || 'כתובת לא זמינה'}
      </Paragraph>

      <Paragraph style={styles.description}>
        🕒 {item.openHours || 'שעות לא זמינות'}
      </Paragraph>

      <Paragraph style={styles.description}>
        ☕ {item.drinksOffered?.join(', ') || 'אין משקאות רשומים'}
      </Paragraph>

      <Paragraph style={styles.description}>
        🛠 {item.machineType || 'סוג מכונה לא ידוע'}
      </Paragraph>
    </Card.Content>

    <Card.Actions>
      <Button mode="contained" onPress={() => console.log("הזמנה", item.fullName)}>
        הזמן עכשיו
      </Button>
    </Card.Actions>
  </Card>
);

  
  if (sellers.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>אין מוכרים זמינים כרגע</Text>
      </View>
    );
  } 

  return (

    <View style={{ flex: 1, padding: 20 }}>
      {/* כפתור גישה לפרופיל */}
      <View style={{ alignItems: 'flex-end', marginBottom: 10 }}>
        <Button title="הפרופיל שלי" onPress={() => router.push('./profile')} />
      </View>

      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>משתמשיםזמינים</Text>

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
  overflow: "hidden", // חשוב בשביל שהתמונה והגרדיאנט יהיו בגבולות הכרטיס
  elevation: 4, // צל באנדרואיד
  shadowColor: "#000", // צל ב-iOS
  shadowOpacity: 0.2,
  shadowRadius: 4,
},
gradient: {
  ...StyleSheet.absoluteFillObject,
  height: 200,
},
name: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#333",
},
description: {
  fontSize: 14,
  color: "#666",
},



title: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 10,
  color: '#333',
},    
});
