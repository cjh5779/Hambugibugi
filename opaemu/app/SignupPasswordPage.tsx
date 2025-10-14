// app/SignupPasswordPage.tsx

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// 유효성 검사 항목을 표시하는 작은 컴포넌트
const ValidationCheck = ({ isValid, text }: { isValid: boolean; text: string }) => (
  <View style={styles.validationRow}>
    <Ionicons
      name={isValid ? "checkmark" : "checkmark"}
      size={16}
      color={isValid ? '#2DD4BF' : '#E0E0E0'} // 조건 충족 시 색상 변경
    />
    <Text style={[styles.validationText, { color: isValid ? '#333' : '#A0A0A0' }]}>
      {text}
    </Text>
  </View>
);

export default function SignupPasswordPage() {
  const router = useRouter();
  // 이전 페이지에서 넘겨준 이메일 값을 받습니다.
  const { email } = useLocalSearchParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 비밀번호 유효성 검사를 실시간으로 처리합니다.
  const validations = useMemo(() => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isLengthValid = password.length >= 8 && password.length <= 20;
    const doPasswordsMatch = password !== '' && password === confirmPassword;
    return { hasLetter, hasNumber, isLengthValid, doPasswordsMatch };
  }, [password, confirmPassword]);

  // 모든 조건이 충족되었는지 확인합니다.
  const isButtonEnabled = validations.hasLetter && validations.hasNumber && validations.isLengthValid && validations.doPasswordsMatch;

  const handleNext = () => {
    if (!isButtonEnabled) return;
    
    // TODO: 실제 회원가입 API를 호출하는 로직을 여기에 구현합니다.
    // email, password 값을 서버로 전송합니다.
    console.log('회원가입 시도:', { email, password });
    Alert.alert(
      '회원가입 완료', 
      `${email} 계정으로 회원가입이 완료되었습니다.`,
      [
        { text: '로그인 화면으로', onPress: () => router.replace('/LoginPage') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
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
              secureTextEntry // 비밀번호 숨김 처리
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: { width: 24 },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    lineHeight: 28,
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f7f7f7',
  },
  validationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
    gap: 16, // 항목 간 간격
  },
  validationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  validationText: {
    marginLeft: 4,
    fontSize: 13,
  },
  footer: {
    padding: 20,
  },
  nextButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});