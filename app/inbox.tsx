// app/seller/inbox.tsx
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, Paragraph, Title } from 'react-native-paper';
import { db } from '../lib/firebase'; // התאם אם הנתיב שונה אצלך

type Order = {
  id: string;
  buyerId: string;
  buyerName?: string;
  drinkType?: string;
  notes?: string;
  sellerId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'served';
  createdAt?: { seconds: number; nanoseconds: number } | null;
};

export default function SellerInboxScreen() {
  const router = useRouter();
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  const [role, setRole] = useState<'seller' | 'user' | 'guest' | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'served'>('all');

  // שמירת תפקיד (כדי לחסום גישה אם לא מוכר)
  useEffect(() => {
    const run = async () => {
      if (!uid) { setRole('guest'); setLoading(false); return; }
      const snap = await getDoc(doc(db, 'users', uid));
      const r = (snap.exists() ? (snap.data() as any).role : 'user') as 'seller' | 'user';
      setRole(r);
    };
    run();
  }, [uid]);

  // האזנה להזמנות של המוכר
  useEffect(() => {
    if (!uid) return;
    // נשמור פשוט: נטען את כולן ונסנן בצד קליינט (כדי לא להיכנס לקומפוזיט אינדקסים)
    const qRef = query(collection(db, 'orders'), where('sellerId', '==', uid));
    const unsub = onSnapshot(qRef, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Order[];
      // מיון לפי תאריך ירדני (אם קיים)
      list.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
      setOrders(list);
      setLoading(false);
    }, (err) => {
      console.error(err);
      Alert.alert('שגיאה', 'נכשל בטעינת הזמנות');
      setLoading(false);
    });
    return () => unsub();
  }, [uid]);

  const filtered = useMemo(() => {
    if (filter === 'all') return orders;
    return orders.filter(o => o.status === filter);
  }, [orders, filter]);

  const setStatus = async (orderId: string, status: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status, updatedAt: serverTimestamp() });
    } catch (e) {
      console.error(e);
      Alert.alert('שגיאה', 'עדכון סטטוס נכשל');
    }
  };

  const formatDate = (o: Order) => {
    if (!o.createdAt) return '';
    const ms = o.createdAt.seconds * 1000 + Math.floor(o.createdAt.nanoseconds / 1e6);
    return new Date(ms).toLocaleString();
    // אם אתה ב־RTL/עברית, זה כבר יראה יפה במכשיר
  };

  if (!uid) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <Text>אנא התחבר כדי לצפות בהזמנות</Text>
        <Button onPress={() => router.replace('/')}>מסך כניסה</Button>
      </View>
    );
  }

  if (role && role !== 'seller') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <Text>מסך זה זמין רק למוכרים</Text>
        <Button onPress={() => router.replace('/users')}>חזרה לרשימת משתמשים</Button>
      </View>
    );
  }

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 8 }}>
      {/* Back ידני למקרה שאין Header Stack */}
      <TouchableOpacity
        onPress={() => router.canGoBack() ? router.back() : router.replace('/users')}
        style={{ alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 8 }}
      >
        <Text style={{ fontSize: 16 }}>⬅️ חזור</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
        ניהול הזמנות ({filtered.length})
      </Text>

      {/* פילטר סטטוסים פשוט */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        {(['all','pending','accepted','rejected','served'] as const).map(s => (
          <Button
            key={s}
            mode={filter === s ? 'contained' : 'outlined'}
            onPress={() => setFilter(s)}
            compact
          >
            {s === 'all' ? 'הכל' :
             s === 'pending' ? 'ממתינות' :
             s === 'accepted' ? 'מאושרות' :
             s === 'rejected' ? 'נדחו' : 'הוגשו'}
          </Button>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(o) => o.id}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 12 }}>
            <Card.Content>
              <Title>{item.buyerName || 'לקוח'}</Title>
              <Paragraph>משקה: {item.drinkType || '—'}</Paragraph>
              {!!item.notes && <Paragraph>הערות: {item.notes}</Paragraph>}
              <Paragraph>סטטוס: {item.status}</Paragraph>
              {!!item.createdAt && <Paragraph>נוצר: {formatDate(item)}</Paragraph>}
            </Card.Content>
            <Card.Actions style={{ justifyContent: 'flex-end' }}>
              {item.status === 'pending' && (
                <>
                  <Button onPress={() => setStatus(item.id, 'accepted')} mode="contained">אשר</Button>
                  <Button onPress={() => setStatus(item.id, 'rejected')}>דחה</Button>
                </>
              )}
              {item.status === 'accepted' && (
                <Button onPress={() => setStatus(item.id, 'served')} mode="contained">סמן כהוגש</Button>
              )}
            </Card.Actions>
          </Card>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 24 }}>אין הזמנות להצגה</Text>}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}
