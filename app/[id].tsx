// app/[id].tsx

import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { 
  ActivityIndicator, 
  Alert, 
  Dimensions, 
  Image, 
  Modal, 
  Pressable, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  View,
  Linking
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { db } from '../lib/firebase';

const { width: screenWidth } = Dimensions.get('window');

type User = {
  id: string;
  fullName?: string;
  email: string;
  image?: string;
  description?: string;
  rating?: number;
  address?: string;
  availableHours?: string;
  drinks?: string[];
  photos?: string[];
  videos?: string[];
  phone?: string;
  specialties?: string[];
  priceRange?: string;
};

// Star Rating Component
function StarRating({ rating, size = 20 }: { rating: number; size?: number }) {
  const tintColor = useThemeColor({}, 'tint');
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Ionicons key={i} name="star" size={size} color="#FFD700" />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <Ionicons key={i} name="star-half" size={size} color="#FFD700" />
      );
    } else {
      stars.push(
        <Ionicons key={i} name="star-outline" size={size} color="#E0E0E0" />
      );
    }
  }

  return <View style={styles.starsContainer}>{stars}</View>;
}

// Media Gallery Component
function MediaGallery({ photos, videos }: { photos?: string[]; videos?: string[] }) {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const allMedia = [...(photos || []), ...(videos || [])];

  const openMedia = (mediaUrl: string) => {
    setSelectedMedia(mediaUrl);
    setIsModalVisible(true);
  };

  return (
    <View style={styles.mediaSection}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        <Ionicons name="images" size={20} /> גלריית תמונות
      </ThemedText>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaScroll}>
        {allMedia.map((media, index) => (
          <TouchableOpacity key={index} onPress={() => openMedia(media)}>
            <Image source={{ uri: media }} style={styles.mediaThumbnail} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={isModalVisible} transparent animationType="fade">
        <BlurView intensity={100} style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalCloseArea} 
            onPress={() => setIsModalVisible(false)}
          >
            <Ionicons name="close" size={30} color="white" style={styles.closeIcon} />
          </TouchableOpacity>
          {selectedMedia && (
            <Image source={{ uri: selectedMedia }} style={styles.modalImage} />
          )}
        </BlurView>
      </Modal>
    </View>
  );
}

// Info Card Component
function InfoCard({ icon, title, content }: { icon: string; title: string; content: string }) {
  const backgroundColor = useThemeColor({ light: '#f8f9fa', dark: '#2a2a2a' }, 'background');
  
  return (
    <View style={[styles.infoCard, { backgroundColor }]}>
      <Ionicons name={icon as any} size={24} color="#0a7ea4" />
      <View style={styles.infoCardContent}>
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        <ThemedText style={styles.infoCardText}>{content}</ThemedText>
      </View>
    </View>
  );
}

// Drinks/Services List Component
function ServicesList({ drinks, specialties }: { drinks?: string[]; specialties?: string[] }) {
  const tintColor = useThemeColor({}, 'tint');
  
  const allServices = [...(drinks || []), ...(specialties || [])];
  
  if (allServices.length === 0) return null;

  return (
    <View style={styles.servicesSection}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        <Ionicons name="cafe" size={20} /> שירותים ומשקאות
      </ThemedText>
      <View style={styles.servicesGrid}>
        {allServices.map((service, index) => (
          <View key={index} style={[styles.serviceTag, { borderColor: tintColor }]}>
            <ThemedText style={[styles.serviceText, { color: tintColor }]}>
              {service}
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

// Action Buttons Component
function ActionButtons({ user }: { user: User }) {
  const tintColor = useThemeColor({}, 'tint');

  const handleOrder = () => {
    Alert.alert(
      'בצע הזמנה',
      `האם אתה בטוח שברצונך להזמין מ${user.fullName || user.email}?`,
      [
        { text: 'ביטול', style: 'cancel' },
        { 
          text: 'כן, הזמן', 
          onPress: () => {
            // Here you can implement actual ordering logic
            Alert.alert('הזמנה נשלחה!', 'ההזמנה שלך נשלחה בהצלחה');
          }
        }
      ]
    );
  };

  const handleCall = () => {
    if (user.phone) {
      Linking.openURL(`tel:${user.phone}`);
    } else {
      Alert.alert('מספר טלפון לא זמין', 'לא ניתן להתקשר למוכר זה');
    }
  };

  const handleMessage = () => {
    if (user.phone) {
      Linking.openURL(`sms:${user.phone}`);
    } else {
      Alert.alert('מספר טלפון לא זמין', 'לא ניתן לשלוח הודעה למוכר זה');
    }
  };

  return (
    <View style={styles.actionButtonsContainer}>
      <TouchableOpacity 
        style={[styles.primaryButton, { backgroundColor: tintColor }]} 
        onPress={handleOrder}
      >
        <Ionicons name="cart" size={20} color="white" />
        <ThemedText style={styles.primaryButtonText}>הזמן עכשיו</ThemedText>
      </TouchableOpacity>
      
      <View style={styles.secondaryButtons}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleCall}>
          <Ionicons name="call" size={20} color={tintColor} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleMessage}>
          <Ionicons name="chatbubble" size={20} color={tintColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const backgroundColor = useThemeColor({}, 'background');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const docRef = doc(db, 'users', String(id));
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUser({ id: docSnap.id, ...docSnap.data() } as User);
        } else {
          console.warn('משתמש לא נמצא ב-Firestore');
        }
      } catch (error) {
        console.error('שגיאה בטעינה:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <ThemedText style={styles.loadingText}>טוען פרופיל...</ThemedText>
      </ThemedView>
    );
  }

  if (!user) {
    return (
      <ThemedView style={styles.errorContainer}>
        <Ionicons name="sad-outline" size={60} color="#999" />
        <ThemedText type="title" style={styles.errorText}>משתמש לא נמצא</ThemedText>
        <ThemedText>הפרופיל המבוקש אינו קיים במערכת</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor }]} showsVerticalScrollIndicator={false}>
      {/* Header Section with Avatar and Basic Info */}
      <LinearGradient
        colors={['#0a7ea4', '#45b7d1']}
        style={styles.headerGradient}
      >
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: user.image || 'https://via.placeholder.com/150' }} 
            style={styles.avatar} 
          />
          <View style={styles.headerInfo}>
            <ThemedText type="title" style={styles.nameText}>
              {user.fullName || user.email}
            </ThemedText>
            {user.rating && (
              <View style={styles.ratingContainer}>
                <StarRating rating={user.rating} size={18} />
                <ThemedText style={styles.ratingText}>
                  {user.rating.toFixed(1)} / 5
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>

      <View style={styles.contentContainer}>
        {/* Description Section */}
        {user.description && (
          <View style={styles.descriptionSection}>
            <ThemedText style={styles.description}>{user.description}</ThemedText>
          </View>
        )}

        {/* Info Cards */}
        <View style={styles.infoSection}>
          {user.address && (
            <InfoCard icon="location" title="כתובת" content={user.address} />
          )}
          {user.availableHours && (
            <InfoCard icon="time" title="שעות פעילות" content={user.availableHours} />
          )}
          {user.priceRange && (
            <InfoCard icon="card" title="טווח מחירים" content={user.priceRange} />
          )}
        </View>

        {/* Services/Drinks */}
        <ServicesList drinks={user.drinks} specialties={user.specialties} />

        {/* Media Gallery */}
        {((user.photos && user.photos.length > 0) || (user.videos && user.videos.length > 0)) && (
          <MediaGallery photos={user.photos} videos={user.videos} />
        )}

        {/* Action Buttons */}
        <ActionButtons user={user} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    marginVertical: 16,
    textAlign: 'center',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 20,
  },
  nameText: {
    color: 'white',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  contentContainer: {
    padding: 20,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoCardContent: {
    marginLeft: 12,
  },
  infoCardText: {
    marginTop: 4,
    opacity: 0.8,
  },
  servicesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 14,
    fontWeight: '500',
  },
  mediaSection: {
    marginBottom: 24,
  },
  mediaScroll: {
    marginTop: 8,
  },
  mediaThumbnail: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseArea: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
  closeIcon: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  modalImage: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.9,
    borderRadius: 12,
  },
  actionButtonsContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  secondaryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
