import { FlatList, Image, StyleSheet, Text, View } from 'react-native';

const users = [
  {
    id: '1',
    name: 'אלון גורן',
    description: 'מומחה לקפה ולטחינה מדויקת',
    rating: 4.5,
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '2',
    name: 'שירה לוי',
    description: 'בעלת סטודיו לקפה בתל אביב',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '3',
    name: 'יונתן רז',
    description: 'בריסטה עם ניסיון של 10 שנים',
    rating: 4,
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
];

export default function UsersScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.avatar} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
          </View>
        )} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#f4f4f4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
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
