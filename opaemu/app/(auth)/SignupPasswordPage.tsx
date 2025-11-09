// app/(auth)/SignupPasswordPage.tsx

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
// ⭐️ 1. Firebase 관련 함수와 설정 파일을 가져옵니다.
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; 
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
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

// 유효성 검사 항목을 표시하는 작은 컴포넌트
const ValidationCheck = ({ isValid, text }: { isValid: boolean; text: string }) => (
  <View style={styles.validationRow}>
    <Ionicons
      name={isValid ? "checkmark" : "checkmark"}
      size={16}
      color={isValid ? '#2DD4BF' : '#E0E0E0'}
    />
    <Text style={[styles.validationText, { color: isValid ? '#333' : '#A0A0A0' }]}>
      {text}
    </Text>
  </View>
);

export default function SignupPasswordPage() {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validations = useMemo(() => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isLengthValid = password.length >= 8 && password.length <= 20;
    const doPasswordsMatch = password !== '' && password === confirmPassword;
    return { hasLetter, hasNumber, isLengthValid, doPasswordsMatch };
  }, [password, confirmPassword]);

  const isButtonEnabled = validations.hasLetter && validations.hasNumber && validations.isLengthValid && validations.doPasswordsMatch;

  // ⭐️ 2. handleNext 함수를 Firebase 회원가입 로직으로 수정합니다.
  const handleNext = async () => { // async 함수로 변경
    if (!isButtonEnabled) return;

    try {
      // expo-router는 파라미터를 배열로 받을 수도 있으므로, 문자열로 처리해줍니다.
      const userEmail = Array.isArray(email) ? email[0] : email; 
      
      if (!userEmail) {
        Alert.alert("오류", "이메일 정보가 없습니다. 이전 단계로 돌아가 다시 시도해주세요.");
        return;
      }

      // Firebase에 이메일과 비밀번호로 새로운 사용자를 생성합니다.
      const userCredential = await createUserWithEmailAndPassword(auth, userEmail, password);
      console.log('회원가입 성공!', userCredential.user);

      Alert.alert(
        '회원가입 완료',
        `${userEmail} 계정으로 회원가입이 완료되었습니다.`,
        [{ text: '로그인 화면으로', onPress: () => router.replace('/(auth)/LoginPage') }]
      );

    } catch (error: any) {
      console.error('회원가입 오류:', error.code);
      // Firebase에서 제공하는 에러 코드에 따라 사용자에게 다른 메시지를 보여줍니다.
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('오류', '이미 사용 중인 이메일 주소입니다.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('오류', '유효하지 않은 이메일 형식입니다.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('오류', '비밀번호는 6자리 이상이어야 합니다.');
      } else {
        Alert.alert('오류', '회원가입 중 문제가 발생했습니다.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ⭐️ Expo의 StatusBar로 교체하고 style="dark"로 설정합니다. */}
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>
            로그인에 사용할{"\n"}비밀번호를 입력해주세요.
          </Text>
          
          {/* 비밀번호 입력 */}
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="비밀번호 입력"
              placeholderTextColor="#A0A0A0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <View style={styles.validationContainer}>
              <ValidationCheck isValid={validations.hasLetter} text="영문 포함" />
              <ValidationCheck isValid={validations.hasNumber} text="숫자 포함" />
              <ValidationCheck isValid={validations.isLengthValid} text="8-20자 이내" />
            </View>
          </View>

          {/* 비밀번호 확인 입력 */}
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="비밀번호 확인"
              placeholderTextColor="#A0A0A0"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <View style={styles.validationContainer}>
              <ValidationCheck isValid={validations.doPasswordsMatch} text="비밀번호 일치" />
            </View>
          </View>
        </View>

        {/* 하단 버튼 */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: isButtonEnabled ? '#000' : '#E0E0E0' }]}
            onPress={handleNext}
            disabled={!isButtonEnabled}
          >
            <Text style={styles.nextButtonText}>다음</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  backButton: { width: 24 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 40 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 30, lineHeight: 28 },
  inputGroup: { marginBottom: 20 },
  input: { height: 50, borderColor: '#e0e0e0', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, fontSize: 16, backgroundColor: '#f7f7f7' },
  validationContainer: { flexDirection: 'row', justifyContent: 'flex-start', marginTop: 8, gap: 16 },
  validationRow: { flexDirection: 'row', alignItems: 'center' },
  validationText: { marginLeft: 4, fontSize: 13 },
  footer: { padding: 20 },
  nextButton: { height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});