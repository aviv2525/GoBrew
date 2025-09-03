// app/components/DrinkSelect.tsx
import React, { useMemo, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';

type Props = {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
};

function drinkEmoji(name: string) {
  const n = (name || '').toLowerCase();
  if (n.includes('קר') || n.includes('ice')) return '🧊';
  if (n.includes('מוקה') || n.includes('שוקו')) return '🍫';
  if (n.includes('מאצ') || n.includes('תה')) return '🍵';
  if (n.includes('חלב') || n.includes('לאטה') || n.includes('קפוצ')) return '🥛';
  return '☕';
}

export default function DrinkSelect({
  options,
  value,
  onChange,
  placeholder = "בחר משקה",
  label
}: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return options;
    return options.filter(o => o.toLowerCase().includes(s));
  }, [q, options]);

  return (
    <View style={{ gap: 6 }}>
      {!!label && <Text style={{ fontSize: 16 }}>{label}</Text>}

      {/* טריגר לפתיחת המודאל */}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{
          backgroundColor:'#f0f0f0',
          padding:12,
          borderRadius:12,
          flexDirection:'row',
          justifyContent:'space-between',
          alignItems:'center'
        }}
      >
        <Text style={{ fontSize: 16, opacity: value ? 1 : 0.6, textAlign:'right', flex:1 }}>
          {value || placeholder}
        </Text>
        <Text aria-hidden style={{ marginStart: 8, fontSize: 18 }}>▾</Text>
      </TouchableOpacity>

      {/* מודאל בחירה */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        {/* שכבת רקע */}
        <Pressable onPress={() => setOpen(false)} style={{ flex:1, backgroundColor:'rgba(0,0,0,0.25)' }}>
          {/* סדין מלמטה */}
          <Pressable
            onPress={(e)=>e.stopPropagation()}
            style={{
              marginTop:'auto', backgroundColor:'#fff', padding:14,
              borderTopLeftRadius:16, borderTopRightRadius:16, gap:12,
              maxHeight:'70%'
            }}
          >
            <View style={{ height:4, width:40, backgroundColor:'#ddd', borderRadius:2, alignSelf:'center' }} />

            <TextInput
              placeholder="חיפוש משקה…"
              value={q}
              onChangeText={setQ}
              style={{ backgroundColor:'#f5f5f5', padding:12, borderRadius:10, textAlign:'right' }}
              autoFocus={Platform.OS !== 'android'}
            />

            {/* גריד צ'יפים */}
            <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8 }}>
              {filtered.map((item, idx) => {
                const isSelected = item === value;
                return (
                  <TouchableOpacity
                    key={`${item}-${idx}`}
                    onPress={() => { onChange(item); setOpen(false); }}
                    style={{
                      flexDirection:'row',
                      alignItems:'center',
                      gap:8,
                      paddingVertical:10,
                      paddingHorizontal:14,
                      borderRadius:999,
                      borderWidth:1,
                      borderColor: isSelected ? '#222' : '#e6e6e6',
                      backgroundColor: isSelected ? '#222' : '#fff',
                      shadowColor:'#000',
                      shadowOpacity:0.06,
                      shadowRadius:6,
                      shadowOffset:{width:0,height:3},
                      elevation: isSelected ? 2 : 0
                    }}
                  >
                    <Text style={{ fontSize:16 }}>{drinkEmoji(item)}</Text>
                    <Text style={{ fontSize:16, color: isSelected ? '#fff' : '#111' }}>{item}</Text>
                  </TouchableOpacity>
                );
              })}
              {filtered.length === 0 && (
                <Text style={{ textAlign:'center', opacity:0.6, width:'100%' }}>לא נמצאו תוצאות</Text>
              )}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
