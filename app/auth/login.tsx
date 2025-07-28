import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [userType, setUserType] = useState<'buyer' | 'seller'>('buyer');
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('שגיאה', 'נא למלא את כל השדות הנדרשים');
      return;
    }

    if (!isLogin && !displayName) {
      Alert.alert('שגיאה', 'נא להזין שם מלא');
      return;
    }

    if (!isLogin && userType === 'seller' && !businessName) {
      Alert.alert('שגיאה', 'נא להזין שם עסק');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, displayName, userType, businessName);
      }
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('שגיאה', error.message || 'משהו השתבש');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {isLogin ? 'כניסה למערכת' : 'הרשמה למערכת'}
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="כתובת אימייל"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="סיסמה"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {!isLogin && (
            <>
              <TextInput
                style={styles.input}
                placeholder="שם מלא"
                value={displayName}
                onChangeText={setDisplayName}
              />

              <View style={styles.userTypeContainer}>
                <Text style={styles.label}>סוג משתמש:</Text>
                <View style={styles.radioGroup}>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      userType === 'buyer' && styles.radioButtonSelected
                    ]}
                    onPress={() => setUserType('buyer')}
                  >
                    <Text style={[
                      styles.radioText,
                      userType === 'buyer' && styles.radioTextSelected
                    ]}>
                      קונה
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      userType === 'seller' && styles.radioButtonSelected
                    ]}
                    onPress={() => setUserType('seller')}
                  >
                    <Text style={[
                      styles.radioText,
                      userType === 'seller' && styles.radioTextSelected
                    ]}>
                      מוכר
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {userType === 'seller' && (
                <TextInput
                  style={styles.input}
                  placeholder="שם העסק"
                  value={businessName}
                  onChangeText={setBusinessName}
                />
              )}
            </>
          )}

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isLogin ? 'כניסה' : 'הרשמה'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.switchButtonText}>
              {isLogin 
                ? 'אין לך חשבון? הירשם כאן' 
                : 'יש לך חשבון? התחבר כאן'
              }
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'right',
  },
  userTypeContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'right',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  radioButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  radioButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  radioTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});