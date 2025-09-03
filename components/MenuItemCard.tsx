// app/components/MenuItemCard.tsx
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

type Item = { id: string; name: string; price: number; description?: string; imageURL?: string };
type Props = {
  item: Item;
  onPress?: () => void;      // לדוגמה: לבחור את המשקה להזמנה
  rightSlot?: React.ReactNode; // לדוגמה: כפתור "בחר" / "ערוך"
};

function emojiFallback(name: string) {
  const n = (name || '').toLowerCase();
  if (n.includes('קר') || n.includes('ice')) return '🧊';
  if (n.includes('מוקה') || n.includes('שוקו')) return '🍫';
  if (n.includes('מאצ') || n.includes('תה')) return '🍵';
  if (n.includes('חלב') || n.includes('לאטה') || n.includes('קפוצ')) return '🥛';
  return '☕';
}

export default function MenuItemCard({ item, onPress, rightSlot }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor:'#fff',
          borderRadius:14,
          borderWidth:1,
          borderColor:'#eee',
          padding:12,
          flexDirection:'row',
          alignItems:'center',
          gap:12,
          shadowColor:'#000',
          shadowOpacity:0.06,
          shadowRadius:10,
          shadowOffset:{ width:0, height:4 },
          elevation:3,
          opacity: pressed ? 0.95 : 1
        }
      ]}
    >
      {/* תמונה/אייקון */}
      {item.imageURL ? (
        <Image source={{ uri: item.imageURL }} style={{ width:64, height:64, borderRadius:12 }} />
      ) : (
        <View style={{
          width:64, height:64, borderRadius:12,
          alignItems:'center', justifyContent:'center',
          backgroundColor:'#f5f5f5', borderWidth:1, borderColor:'#eee'
        }}>
          <Text style={{ fontSize:26 }}>{emojiFallback(item.name)}</Text>
        </View>
      )}

      {/* טקסטים */}
      <View style={{ flex:1 }}>
        <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', gap:8 }}>
          <Text style={{ fontSize:16, fontWeight:'700' }}>{item.name}</Text>
          {/* תג מחיר */}
          <View style={{ backgroundColor:'#111', borderRadius:999, paddingVertical:4, paddingHorizontal:10 }}>
            <Text style={{ color:'#fff', fontWeight:'700' }}>{`₪${item.price}`}</Text>
          </View>
        </View>
        {!!item.description && (
          <Text numberOfLines={2} style={{ color:'#666', marginTop:4 }}>
            {item.description}
          </Text>
        )}
      </View>

      {/* אזור ימין (כפתור "בחר"/"ערוך") */}
      {rightSlot}
    </Pressable>
  );
}
