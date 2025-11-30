// app/(auth)/SignupAgreePage.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function SignupAgreePage() {
  const router = useRouter();

  const [allAgreed, setAllAgreed] = useState(false);
  const [agreements, setAgreements] = useState({
    age: false,
    terms: false,
    privacy: false,
    marketing: false,
  });
  const isSignupEnabled =
    agreements.age && agreements.terms && agreements.privacy;

  const handleAllAgree = () => {
    const newState = !allAgreed;
    setAllAgreed(newState);
    setAgreements({
      age: newState,
      terms: newState,
      privacy: newState,
      marketing: newState,
    });
  };

  const handleAgreementToggle = (key: keyof typeof agreements) => {
    setAgreements((prev) => {
      const newState = { ...prev, [key]: !prev[key] };
      const allRequiredChecked =
        newState.age && newState.terms && newState.privacy;
      setAllAgreed(allRequiredChecked && newState.marketing);
      return newState;
    });
  };

  const handleSignup = () => {
    if (isSignupEnabled) {
      router.push('/(auth)/SignupEmailPage');
    } else {
      Alert.alert('알림', '필수 약관에 모두 동의해야 합니다.');
    }
  };

  const renderCheckbox = (
    label: string,
    key: keyof typeof agreements,
    required: boolean,
  ) => (
    <View style={styles.checkboxRow}>
      <TouchableOpacity
        onPress={() => handleAgreementToggle(key)}
        style={styles.checkboxIconWrap}
      >
        <Ionicons
          name={agreements[key] ? 'checkbox-outline' : 'square-outline'}
          size={22}
          color={agreements[key] ? '#8C5A3A' : '#C8A28A'}
        />
      </TouchableOpacity>
      <Text style={styles.checkboxText}>
        <Text style={required ? styles.requiredText : styles.optionalText}>
          [{required ? '필수' : '선택'}]
        </Text>{' '}
        {label}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#8C5A3A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>약관 동의</Text>
        <View style={styles.backButton} />
      </View>

      {/* 내용 */}
      <ScrollView style={styles.content}>
        <Text style={styles.title}>
          오패무 서비스 이용을 위해{'\n'}약관에 동의해 주세요.
        </Text>

        <View style={styles.card}>
          {/* 모두 동의 */}
          <TouchableOpacity onPress={handleAllAgree} style={styles.allAgreeRow}>
            <Ionicons
              name={allAgreed ? 'checkbox-outline' : 'square-outline'}
              size={24}
              color={allAgreed ? '#8C5A3A' : '#C8A28A'}
            />
            <Text style={styles.allAgreeText}>
              모두 동의{' '}
              <Text style={styles.allAgreeSub}>
                ({agreements.marketing ? '선택 포함' : '선택 제외'})
              </Text>
            </Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          {/* 개별 항목 */}
          {renderCheckbox('만 14세 이상입니다.', 'age', true)}
          {renderCheckbox('이용약관 동의', 'terms', true)}
          {renderCheckbox('개인정보 처리방침 동의', 'privacy', true)}
          {renderCheckbox(
            '광고성 정보 수신 및 마케팅 활용 동의',
            'marketing',
            false,
          )}
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.signupButton,
            { backgroundColor: isSignupEnabled ? '#8C5A3A' : '#E3CABA' },
          ]}
          onPress={handleSignup}
          disabled={!isSignupEnabled}
        >
          <Text style={styles.signupButtonText}>동의하고 가입하기</Text>
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

  // 내용
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 18,
    color: '#5B3B2A',
    lineHeight: 26,
    marginBottom: 18,
    fontFamily: 'HiMelody', // 타이틀 포인트
  },

  // 카드 영역
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
    marginBottom: 20,
  },

  // 모두 동의
  allAgreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  allAgreeText: {
    fontSize: 15,
    color: '#5B3B2A',
    marginLeft: 10,
    // 시스템 폰트
  },
  allAgreeSub: {
    fontSize: 13,
    color: '#C08E74',
    // 시스템 폰트
  },

  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0E0D4',
    marginVertical: 12,
  },

  // 체크박스 행
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxIconWrap: {
    marginRight: 10,
  },
  checkboxText: {
    fontSize: 14,
    color: '#5B3B2A',
    flexShrink: 1,
    // 시스템 폰트
  },
  requiredText: {
    color: '#8C5A3A',
    // 시스템 폰트
  },
  optionalText: {
    color: '#C08E74',
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
  signupButton: {
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#FFF7F1',
    fontSize: 16,
  },
});
