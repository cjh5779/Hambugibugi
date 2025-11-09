// app/(auth)/LoginPage.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import {
  Alert,
  // 🚨 react-native의 SafeAreaView와 StatusBar는 여기서 제거합니다.
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// ⭐️ Expo/Android 호환성을 위해 다음 컴포넌트들을 import합니다.
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (email.trim() && password.trim()) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('로그인 성공!', userCredential.user.email);
        router.replace('/chat');
      } catch (error: any) {
        console.error('로그인 오류:', error.code);
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          Alert.alert('로그인 실패', '이메일 또는 비밀번호가 올바르지 않습니다.');
        } else {
          Alert.alert('로그인 실패', '로그인 중 문제가 발생했습니다.');
        }
      }
    } else {
      Alert.alert("입력 오류", "이메일과 비밀번호를 모두 입력해주세요.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ⭐️ Expo의 StatusBar로 교체하고 style="dark"로 설정합니다. */}
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LOGIN</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        <TextInput 
          style={styles.input} 
          placeholder="아이디 (이메일)" 
          placeholderTextColor="#8e8e8e" 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address" 
          autoCapitalize="none" 
        />
        <TextInput 
          style={styles.input} 
          placeholder="비밀번호" 
          placeholderTextColor="#8e8e8e" 
          secureTextEntry 
          value={password} 
          onChangeText={setPassword} 
        />
        
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>계정이 없으신가요? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/SignupAgreePage')}>
            <Text style={[styles.signupText, styles.signupLink]}>간편가입하기</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ⭐️ 아이디 찾기 버튼을 삭제하고 비밀번호 찾기 기능만 남겼습니다. */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.push('/(auth)/ForgotPasswordPage')}>
          <Text style={styles.footerText}>비밀번호를 잊으셨나요?</Text>
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
    borderBottomColor: '#f0f0f0' 
  },
  backButton: { width: 24 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { 
    flex: 1, 
    paddingHorizontal: 20, 
    paddingTop: 40 
  },
  input: { 
    height: 50, 
    borderColor: '#e0e0e0', 
    borderWidth: 1, 
    borderRadius: 8, 
    marginBottom: 12, 
    paddingHorizontal: 15, 
    fontSize: 16, 
    backgroundColor: '#f7f7f7' 
  },
  loginButton: { 
    height: 50, 
    backgroundColor: '#000', 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 10,
  },
  loginButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    fontSize: 14,
    color: '#888',
  },
  signupLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#000',
  },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 20 
  },
  footerText: { 
    color: '#8e8e8e', 
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});