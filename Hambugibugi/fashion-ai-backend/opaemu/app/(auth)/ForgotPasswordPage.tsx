// app/(auth)/ForgotPasswordPage.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
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

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    if (email.trim() === '') {
      Alert.alert('입력 오류', '이메일 주소를 입력해주세요.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        '전송 완료',
        '비밀번호 재설정 이메일을 보냈습니다. 이메일 함을 확인해주세요.',
        [{ text: '확인', onPress: () => router.back() }],
      );
    } catch (error: any) {
      console.error('비밀번호 재설정 오류:', error.code);
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/invalid-email'
      ) {
        Alert.alert(
          '전송 실패',
          '등록되지 않았거나 잘못된 이메일 주소입니다.',
        );
      } else {
        Alert.alert('오류', '이메일을 보내는 중 문제가 발생했습니다.');
      }
    }
  };

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
        <Text style={styles.headerTitle}>비밀번호 찾기</Text>
        <View style={styles.backButton} />
      </View>

      {/* 내용 */}
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>이메일로 비밀번호 재설정</Text>
          <Text style={styles.infoText}>
            가입 시 사용한 이메일 주소를 입력하시면{'\n'}
            비밀번호 재설정 링크를 보내드릴게요.
          </Text>

          <Text style={styles.label}>이메일 주소</Text>
          <TextInput
            style={styles.input}
            placeholder="example@email.com"
            placeholderTextColor="#C08E74"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={styles.sendButton}
            onPress={handlePasswordReset}
          >
            <Text style={styles.sendButtonText}>재설정 이메일 보내기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 전체 배경: 크림톤
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
    paddingTop: 32,
  },

  // 카드 박스
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: '#F6D6C4',
    shadowColor: '#E2B79C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  title: {
    fontSize: 20,
    color: '#5B3B2A',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#8C5A3A',
    lineHeight: 22,
    marginBottom: 20,
    // 시스템 폰트
  },

  label: {
    fontSize: 14,
    color: '#C08E74',
    marginBottom: 6,
    // 시스템 폰트
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F6D6C4',
    paddingHorizontal: 14,
    fontSize: 15,
    backgroundColor: '#FFF2E8',
    marginBottom: 18,
    color: '#5B3B2A',
    // 시스템 폰트
  },

  sendButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#8C5A3A',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  sendButtonText: {
    color: '#FFF7F1',
    fontSize: 16,
  },
});
