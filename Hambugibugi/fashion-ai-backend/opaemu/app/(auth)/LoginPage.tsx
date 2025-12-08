// app/(auth)/LoginPage.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
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
import LottieView from 'lottie-react-native';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('입력 오류', '이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log('로그인 성공!', userCredential.user.email);
      // 라우팅은 _layout의 onAuthStateChanged에서 처리
    } catch (error: any) {
      console.error('로그인 오류:', error.code);
      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password'
      ) {
        Alert.alert('로그인 실패', '이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        Alert.alert('로그인 실패', '로그인 중 문제가 발생했습니다.');
      }
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isLoading ? 'light' : 'dark'} />

      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          disabled={isLoading}
        >
          <Ionicons name="arrow-back" size={24} color="#8C5A3A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>로그인</Text>
        <View style={styles.backButton} />
      </View>

      {/* 메인 내용 */}
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>오늘의 패션을 시작해볼까요?</Text>
          <Text style={styles.subtitle}>
            오패무 계정으로 로그인하고{'\n'}
            AI 코디 추천을 받아보세요.
          </Text>

          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            placeholder="아이디 (이메일)"
            placeholderTextColor="#C08E74"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />

          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            placeholderTextColor="#C08E74"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
          />

          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? '로그인 중...' : '로그인'}
            </Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>계정이 없으신가요? </Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/SignupAgreePage')}
              disabled={isLoading}
            >
              <Text style={styles.signupLink}>간편가입하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 하단 비밀번호 찾기 */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => router.push('/(auth)/ForgotPasswordPage')}
          disabled={isLoading}
        >
          <Text style={styles.footerText}>비밀번호를 잊으셨나요?</Text>
        </TouchableOpacity>
      </View>

      {/* Lottie 로딩 오버레이 */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <LottieView
            source={require('../../assets/lotties/Sandy Loading.json')}
            autoPlay
            loop
            style={styles.loadingLottie}
          />
          <Text style={styles.loadingText}>로그인 중입니다...</Text>
        </View>
      )}
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
    fontFamily: 'HiMelody', // 포인트만 HiMelody
  },

  // 본문
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },

  // 카드
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
    fontSize: 21,
    color: '#5B3B2A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#8C5A3A',
    lineHeight: 22,
    marginBottom: 20,
    // 본문은 시스템 폰트
  },

  label: {
    fontSize: 14,
    color: '#C08E74',
    marginBottom: 6,
    marginTop: 8,
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
    color: '#5B3B2A',
    // 시스템 폰트
  },

  loginButton: {
    height: 48,
    backgroundColor: '#8C5A3A',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFF7F1',
    fontSize: 17,
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  signupText: {
    fontSize: 14,
    color: '#8C5A3A',
    // 시스템 폰트
  },
  signupLink: {
    fontSize: 14,
    color: '#C08E74',
    textDecorationLine: 'underline',
    // 시스템 폰트
  },

  // 하단
  footer: {
    paddingVertical: 18,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F6D6C4',
    backgroundColor: '#FFF7F1',
  },
  footerText: {
    color: '#C08E74',
    fontSize: 14,
    textDecorationLine: 'underline',
    // 시스템 폰트
  },

  // 로딩 오버레이
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingLottie: {
    width: 180,
    height: 180,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#fff',
    fontFamily: 'HiMelody', // 로딩 문구도 포인트로
  },
});
