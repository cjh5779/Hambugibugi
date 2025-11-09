// app/(auth)/SignupEmailPage.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  // 🚨 react-native의 SafeAreaView와 StatusBar는 여기서 제거합니다.
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
// ⭐️ Expo/Android 호환성을 위해 다음 컴포넌트들을 import합니다.
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function SignupEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleNext = () => {
    // 간단한 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('알림', '올바른 이메일 주소를 입력해주세요.');
      return;
    }
    
    // 다음 페이지(비밀번호 입력)로 이메일 정보를 전달합니다.
    router.push({
      pathname: '/(auth)/SignupPasswordPage',
      params: { email: email }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ⭐️ Expo의 StatusBar로 교체하고 style="dark"로 설정합니다. */}
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          로그인에 사용할 {"\n"}이메일 주소를 입력해주세요.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="이메일 주소 입력"
          placeholderTextColor="#A0A0A0"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: email.trim() ? '#000' : '#E0E0E0' }]}
          onPress={handleNext}
          disabled={!email.trim()}
        >
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ⭐️ 스타일은 기존 SignupIdPage와 거의 동일합니다.
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0', marginBottom: 40,
  },
  backButton: { width: 24 },
  content: { flex: 1, paddingHorizontal: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 30, lineHeight: 28 },
  input: {
    height: 50, borderColor: '#e0e0e0', borderWidth: 1, borderRadius: 8,
    paddingHorizontal: 15, fontSize: 16, backgroundColor: '#f7f7f7', marginBottom: 20,
  },
  nextButton: { height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});