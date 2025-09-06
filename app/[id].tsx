// app/users/[id].tsx

import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DrinkSelect from '../components/drinkSelect';
import MenuItemCard from '../components/MenuItemCard';
import { auth, db } from '../lib/firebase';



export default function SellerProfileScreen() {
  const { id: sellerId } = useLocalSearchParams();
  const currentUser = auth.currentUser;
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedDrink, setSelectedDrink] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  //const [sellerID ,drinksOffered,] = useState<any[]>([]);  

const router = useRouter();

  // שליפת פרטי המוכר
  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const docRef = doc(db, "users", sellerId as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSeller({ id: docSnap.id, ...docSnap.data() });
        } else {
          Alert.alert("שגיאה", "משתמש לא נמצא");
        }
      } catch (err) {
        console.error("Error fetching seller:", err);
      } finally {
        setLoading(false);
      }
    };
    if (sellerId) fetchSeller();
  }, [sellerId]);

  // אם אני המוכר — האזנה להזמנות
  useEffect(() => {
    if (currentUser?.uid === sellerId) {
      const q = query(
        collection(db, "orders"),
        where("sellerId", "==", sellerId),
        where("status", "==", "pending")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(newOrders);
      });
      return unsubscribe;
    }
  }, [sellerId]);

type MenuItem = { id: string; name: string; price?: number; description?: string; imageURL?: string };

const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

useEffect(() => {
  if (!sellerId) return;
  const q = query(
    collection(db, "users", String(sellerId), "menuItems"),
    orderBy("updatedAt", "desc")
  );
  const unsub = onSnapshot(q, (ss) => {
    setMenuItems(ss.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
  });
  return unsub;
}, [sellerId]);
const itemsToRender: MenuItem[] = menuItems.length
  ? menuItems
  : (seller?.drinksOffered || []).map((name: string, i: number) => ({
      id: `d-${i}`,
      name,             // אין מחיר/תיאור – נציג רק שם (ואייקון)
    }));


  
  // יצירת הזמנה
   const createOrder = async () => {
    try {
      if (!currentUser) {
        Alert.alert("אנא התחבר תחילה");
        return;
      }
      await addDoc(collection(db, "orders"), {
        buyerId: currentUser.uid,
        buyerName: currentUser.displayName || "לקוח",
        drinkType: selectedDrink || "לא נבחר משקה",
        notes: orderNotes || "אין הערות",
        sellerId: sellerId,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      Alert.alert("הזמנה נשלחה", "המוכר יקבל התראה");
      setSelectedDrink("");
      setOrderNotes("");
    } catch (err) {
      console.error("Error creating order:", err);
    }
  };



  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  if (!seller) return <Text>לא נמצא מוכר</Text>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      
      <View style={{ alignItems: 'center' }}>
          <Image
        source={require('../assets/images/coffee.png')}
        //source={{ uri: seller.photoURL || 'https://placehold.co/100x100/png' }}
        style={{ width: 250, height: 250, borderRadius: 50 }}
        />
          {/* נקודת סטטוס על האווטאר */}
    <View style={{
      position: 'absolute',
      bottom: 6, right: 6,
      width: 16, height: 16, borderRadius: 8,
      backgroundColor: seller.online ? '#22c55e' : '#94a3b8',
      borderWidth: 2, borderColor: '#fff'
    }}/>
  </View>
      

  <Text>{seller.fullName}</Text>
      <TouchableOpacity
        onPress={() => router.canGoBack() ? router.back() : router.replace('/users')}
        style={{ alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 8 }}
      >
        <Text style={{ fontSize: 16 }}>⬅️ חזור</Text>
      </TouchableOpacity>


      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{seller.fullName}</Text>
      <Text>{seller.description}</Text>
      <Text>סוג מכונה: {seller.machineType}</Text>
      <Text>מחובר : {seller.online}</Text>
      <Text>כתובת: {seller.address}</Text>  
      <Text>שעות פעילות: {seller.openHours}</Text>
     <Text>טלפון: {seller.phoneNumber || " לא סופק"}</Text>
      <Text>מייל: {seller.email || " לא סופק"}</Text>



      {currentUser?.uid !== sellerId && (
        <>
        {/* בחירת משקה */}
      <DrinkSelect
        label="בחר משקה"
        options={(seller?.drinksOffered || seller?.drinks || []) as string[]}
        value={selectedDrink}
        onChange={setSelectedDrink}
        placeholder="בחר משקה"
/>

          {/* בחירת משקה */}
        <Text style={{ fontSize: 18, fontWeight: '800', marginTop: 8 }}>תפריט</Text>
  <View style={{ gap: 10 }}>
    {itemsToRender.map((mi) => (
      <MenuItemCard
      key={mi.id}
      item={{ ...mi, price: mi.price ?? 0 }}
      onPress={() => setSelectedDrink(mi.name)} // בחירה להזמנה
      rightSlot={
        <View style={{ backgroundColor:'#4CAF50', borderRadius:999, paddingVertical:6, paddingHorizontal:10 }}>
          <Text style={{ color:'#fff', fontWeight:'700' }}>בחר</Text>
        </View>
      }
    />
  ))}
  {!itemsToRender.length && (
    <Text style={{ opacity: 0.6 }}>אין פריטים להצגה</Text>
  )}
</View>



          {/* הערות להזמנה */}
          <Text style={{ marginTop: 20, fontSize: 16 }}>הערות להזמנה:</Text>
          <TextInput
            placeholder="...לדוגמה: סוכר בצד, חלב שקדים"
            value={orderNotes}
            onChangeText={setOrderNotes}
            style={{
              backgroundColor: "#f0f0f0",
              padding: 10,
              borderRadius: 8,
              marginTop: 8,
            }}
          />

          {/* כפתור הזמנה */}
          <TouchableOpacity
            onPress={createOrder}
            style={{
              marginTop: 20,
              backgroundColor: "#4CAF50",
              padding: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
              שלח הזמנה
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

