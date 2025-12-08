// app/(auth)/SignupPasswordPage.tsx

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// 유효성 검사 항목을 표시하는 작은 컴포넌트
const ValidationCheck = ({
  isValid,
  text,
}: {
  isValid: boolean;
  text: string;
}) => (
  <View style={styles.validationRow}>
    <Ionicons
      name="checkmark"
      size={16}
      color={isValid ? '#8C5A3A' : '#D7C1B3'}
    />
    <Text
      style={[
        styles.validationText,
        { color: isValid ? '#5B3B2A' : '#B8A29A' },
      ]}
    >
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

  const isButtonEnabled =
    validations.hasLetter &&
    validations.hasNumber &&
    validations.isLengthValid &&
    validations.doPasswordsMatch;

  const handleNext = async () => {
    if (!isButtonEnabled) return;

    try {
      const userEmail = Array.isArray(email) ? email[0] : email;

      if (!userEmail) {
        Alert.alert(
          '오류',
          '이메일 정보가 없습니다. 이전 단계로 돌아가 다시 시도해주세요.',
        );
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userEmail,
        password,
      );
      console.log('회원가입 성공!', userCredential.user);

      Alert.alert(
        '회원가입 완료',
        `${userEmail} 계정으로 회원가입이 완료되었습니다.`,
        [
          {
            text: '로그인 화면으로',
            onPress: () => router.replace('/(auth)/LoginPage'),
          },
        ],
      );
    } catch (error: any) {
      console.error('회원가입 오류:', error.code);
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

  const allTouched = password.length > 0 || confirmPassword.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kbContainer}
      >
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

        {/* 내용 */}
        <View style={styles.content}>
          <Text style={styles.title}>
            로그인에 사용할{'\n'}비밀번호를 입력해주세요.
          </Text>

          {/* 카드 */}
          <View style={styles.card}>
            {/* 비밀번호 입력 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>비밀번호</Text>
              <TextInput
                style={styles.input}
                placeholder="영문, 숫자 포함 8~20자"
                placeholderTextColor="#C0A394"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
              <View style={styles.validationContainer}>
                <ValidationCheck
                  isValid={validations.hasLetter}
                  text="영문 포함"
                />
                <ValidationCheck
                  isValid={validations.hasNumber}
                  text="숫자 포함"
                />
                <ValidationCheck
                  isValid={validations.isLengthValid}
                  text="8–20자 이내"
                />
              </View>
            </View>

            {/* 비밀번호 확인 입력 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>비밀번호 확인</Text>
              <TextInput
                style={styles.input}
                placeholder="다시 한번 입력해주세요"
                placeholderTextColor="#C0A394"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
              />
              <View style={styles.validationContainer}>
                <ValidationCheck
                  isValid={validations.doPasswordsMatch && allTouched}
                  text="비밀번호 일치"
                />
              </View>
            </View>
          </View>
        </View>

        {/* 하단 버튼 */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              { backgroundColor: isButtonEnabled ? '#8C5A3A' : '#E3CABA' },
            ]}
            onPress={handleNext}
            disabled={!isButtonEnabled}
          >
            <Text style={styles.nextButtonText}>회원가입 완료</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 전체 배경
  container: {
    flex: 1,
    backgroundColor: '#FFF7F1',
  },
  kbContainer: {
    flex: 1,
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

  // 내용
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
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
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#F6D6C4',
    shadowColor: '#E2B79C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },

  // 입력 그룹
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: '#8C5A3A',
    marginBottom: 6,
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

  // 유효성 체크 영역
  validationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 10,
  },
  validationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  validationText: {
    marginLeft: 4,
    fontSize: 12,
    // 시스템 폰트
  },

  // 하단 버튼
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
