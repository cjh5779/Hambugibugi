// app/(auth)/SignupEmailPage.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function SignupEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleNext = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('알림', '올바른 이메일 주소를 입력해주세요.');
      return;
    }

    router.push({
      pathname: '/(auth)/SignupPasswordPage',
      params: { email: email },
    });
  };

  const isFilled = email.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#8C5A3A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>회원가입</Text>
        <View style={styles.backButton} />
      </View>

      {/* 내용 영역 */}
      <View style={styles.content}>
        <Text style={styles.title}>
          로그인에 사용할{'\n'}이메일 주소를 입력해주세요.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>이메일 주소</Text>
          <TextInput
            style={styles.input}
            placeholder="example@email.com"
            placeholderTextColor="#C0A394"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>
      </View>

      {/* 하단 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            { backgroundColor: isFilled ? '#8C5A3A' : '#E3CABA' },
          ]}
          onPress={handleNext}
          disabled={!isFilled}
        >
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 전체 배경
  container: {
    flex: 1,
    backgroundColor: '#FFF7F1',
  },

  // 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF7F1',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F6D6C4',
  },
  backButton: {
    width: 24,
  },
  headerTitle: {
    fontSize: 19,
    color: '#5B3B2A',
    fontFamily: 'HiMelody', // 포인트
  },

  // 내용 영역
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 18,
    color: '#5B3B2A',
    lineHeight: 26,
    marginBottom: 16,
    fontFamily: 'HiMelody', // 타이틀 포인트
  },

  // 카드
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: '#F6D6C4',
    shadowColor: '#E2B79C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  label: {
    fontSize: 14,
    color: '#8C5A3A',
    marginBottom: 8,
    // 시스템 폰트
  },
  input: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F0D7C3',
    backgroundColor: '#FFF7F1',
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#5B3B2A',
    // 시스템 폰트
  },

  // 하단 버튼 영역
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F6D6C4',
    backgroundColor: '#FFF7F1',
  },
  nextButton: {
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFF7F1',
    fontSize: 16,
  },
});
