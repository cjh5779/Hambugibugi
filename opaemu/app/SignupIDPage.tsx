// app/SignupIDPage.tsx

import { Ionicons } from '@expo/vector-icons';
// ⭐️ 1. useLocalSearchParams 훅을 추가로 import 합니다.
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function SignupIdPage() {
  const router = useRouter();
  // ⭐️ 2. 이전 페이지에서 전달한 파라미터를 받습니다. { email: '...' } 형태로 들어옵니다.
  const { email } = useLocalSearchParams(); 

  const [userId, setUserId] = useState('');

  const handleNext = () => {
    if (userId.trim() === '') {
      Alert.alert('알림', '사용할 아이디(이메일)를 입력해주세요.');
    } else {
      // TODO: 아이디 중복 확인 등 실제 회원가입 로직 구현
      
      // ⭐️ 3. 다음 페이지로 이메일과 아이디 정보를 함께 전달합니다.
      router.push({
        pathname: '/SignupPasswordPage',
        params: { 
          email: email, // 이전 페이지에서 받은 email
          userId: userId   // 현재 페이지에서 입력한 userId
        }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          로그인에 사용할 {"\n"}아이디를 입력해주세요.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="아이디 입력"
          placeholderTextColor="#A0A0A0"
          value={userId}
          onChangeText={setUserId}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: userId.trim() ? '#000' : '#E0E0E0' }]}
          onPress={handleNext}
          disabled={!userId.trim()}
        >
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 40,
  },
  backButton: { width: 24 },
  content: { flex: 1, paddingHorizontal: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 30, lineHeight: 28 },
  input: {
    height: 50,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f7f7f7',
    marginBottom: 20,
  },
  nextButton: { height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});