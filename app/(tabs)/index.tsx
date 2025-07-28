import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  Alert,
  SafeAreaView 
} from 'react-native';
import { SellerCard } from '@/components/SellerCard';
import { useSellers } from '@/hooks/useSellers';
import { useAuth } from '@/hooks/useAuth';
import { Seller } from '@/types';

export default function HomeScreen() {
  const { sellers, loading, error } = useSellers();
  const { user } = useAuth();

  const handleSellerPress = (seller: Seller) => {
    Alert.alert(
      'ביצוע הזמנה',
      `האם תרצה להזמין מ${seller.businessName}?`,
      [
        { text: 'ביטול', style: 'cancel' },
        { 
          text: 'כן', 
          onPress: () => {
            // כאן ניתן להוסיף ניווט למסך הזמנה
            Alert.alert('הזמנה', `הזמנה מ${seller.businessName} בקרוב!`);
          }
        }
      ]
    );
  };

  const renderSeller = ({ item }: { item: Seller }) => (
    <SellerCard seller={item} onPress={handleSellerPress} />
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>טוען מוכרים...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>מוכרים זמינים</Text>
        {user && (
          <Text style={styles.welcomeText}>
            שלום {user.displayName}
          </Text>
        )}
      </View>
      
      <FlatList
        data={sellers}
        renderItem={renderSeller}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              אין מוכרים זמינים כרגע
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  listContainer: {
    paddingVertical: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3333',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});
