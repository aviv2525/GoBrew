import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

export default function OrdersScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ההזמנות שלי</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            עדיין אין לך הזמנות
          </Text>
          <Text style={styles.emptySubText}>
            התחל להזמין ממוכרים בעמוד הראשי
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
  },
});
