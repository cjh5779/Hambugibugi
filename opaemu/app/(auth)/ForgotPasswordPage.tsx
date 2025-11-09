// app/(auth)/ForgotPasswordPage.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// ⭐️ React와 함께 useState를 { } 안에 넣어서 가져옵니다.
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
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
        [{ text: '확인', onPress: () => router.back() }]
      );
    } catch (error: any) {
      console.error('비밀번호 재설정 오류:', error.code);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
        Alert.alert('전송 실패', '등록되지 않았거나 잘못된 이메일 주소입니다.');
      } else {
        Alert.alert('오류', '이메일을 보내는 중 문제가 발생했습니다.');
      }
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
        <Text style={styles.headerTitle}>비밀번호 찾기</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        <Text style={styles.infoText}>가입 시 사용한 이메일 주소를 입력하시면,{'\n'}비밀번호 재설정 링크를 보내드립니다.</Text>
        <TextInput
          style={styles.input}
          placeholder="이메일 주소 입력"
          placeholderTextColor="#8e8e8e"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handlePasswordReset}>
          <Text style={styles.sendButtonText}>재설정 이메일 보내기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0'
  },
  backButton: { width: 24 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 40 },
  infoText: { fontSize: 15, color: '#555', lineHeight: 22, marginBottom: 20 },
  input: {
    height: 50, borderColor: '#e0e0e0', borderWidth: 1, borderRadius: 8,
    marginBottom: 20, paddingHorizontal: 15, fontSize: 16, backgroundColor: '#f7f7f7'
  },
  sendButton: { height: 50, backgroundColor: '#000', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  sendButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});