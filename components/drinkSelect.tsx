import { MaterialIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
};

export default function DrinkSelect({ options, value, onChange, placeholder = "בחר משקה", label }: Props) {
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

      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{ backgroundColor:'#f0f0f0', padding:12, borderRadius:10, flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}
      >
        <Text style={{ fontSize: 16, opacity: value ? 1 : 0.6 }}>
          {value || placeholder}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={22} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable onPress={() => setOpen(false)} style={{ flex:1, backgroundColor:'rgba(0,0,0,0.25)' }}>
          <Pressable
            style={{ marginTop: 'auto', backgroundColor:'#fff', padding:12, borderTopLeftRadius:16, borderTopRightRadius:16, gap:8, maxHeight: '70%' }}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={{ height:4, width:40, backgroundColor:'#ddd', borderRadius:2, alignSelf:'center', marginBottom:6 }} />
            <TextInput
              placeholder="חיפוש משקה…"
              value={q}
              onChangeText={setQ}
              style={{ backgroundColor:'#f5f5f5', padding:10, borderRadius:8 }}
            />
            <FlatList
              data={filtered}
              keyExtractor={(it, i)=>`${it}-${i}`}
              renderItem={({ item }) => {
                const selected = item === value;
                return (
                  <TouchableOpacity
                    onPress={() => { onChange(item); setOpen(false); }}
                    style={{ paddingVertical:12, flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}
                  >
                    <Text style={{ fontSize:16 }}>{item}</Text>
                    {selected && <MaterialIcons name="check" size={20} />}
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => <View style={{ height:1, backgroundColor:'#eee' }} />}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
