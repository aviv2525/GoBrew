// app/order/[orderId].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { db } from '../lib/firebase';

type Order = {
  sellerId: string;
  buyerId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
};

export default function OrderStatusScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const ref = doc(db, 'orders', String(orderId));
    const unsub = onSnapshot(ref, (snap) => {
      setOrder(snap.data() as Order);
      setLoading(false);
    });
    return () => unsub();
  }, [orderId]);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  if (!order) return <Text>ההזמנה לא נמצאה</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>סטטוס הזמנה: {order.status}</Text>
      {order.status === 'accepted' && (
        <Button mode="contained" onPress={async () => {
          await updateDoc(doc(db, 'orders', String(orderId)), { status: 'completed', updatedAt: serverTimestamp() });
          router.back();
        }}>
          סמן כהושלם
        </Button>
      )}
      {order.status === 'rejected' && <Text>המוכר דחה את ההזמנה 🙁</Text>}
      {order.status === 'pending' && <Text>ממתין לאישור המוכר…</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: 'bold' },
});
