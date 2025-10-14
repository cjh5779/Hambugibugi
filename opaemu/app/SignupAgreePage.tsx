// app/SignupAgreePage.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignupAgreePage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [allAgreed, setAllAgreed] = useState(false);
  const [agreements, setAgreements] = useState({ age: false, terms: false, privacy: false, marketing: false });
  const isSignupEnabled = agreements.age && agreements.terms && agreements.privacy;

  const handleAllAgree = () => {
    const newState = !allAgreed;
    setAllAgreed(newState);
    setAgreements({ age: newState, terms: newState, privacy: newState, marketing: newState });
  };
  
  const handleAgreementToggle = (key: keyof typeof agreements) => {
    setAgreements(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      const allRequiredChecked = newState.age && newState.terms && newState.privacy;
      setAllAgreed(allRequiredChecked && newState.marketing);
      return newState;
    });
  };

  const handleSignup = () => {
    if (email.trim() === '') {
      Alert.alert('알림', '이메일 주소를 입력해주세요.');
      return;
    }

    if (isSignupEnabled) {
      router.push({
        // ⭐️ 실제 파일 이름('SignupIDPage.tsx')과 대소문자를 정확히 일치시켰습니다.
        pathname: '/SignupIDPage', 
        params: { email: email } 
      });
    } else {
      Alert.alert('알림', '필수 약관에 모두 동의해야 합니다.');
    }
  };

  const renderCheckbox = (label: string, key: keyof typeof agreements, required: boolean) => (
    <View style={styles.checkboxRow}>
      <TouchableOpacity onPress={() => handleAgreementToggle(key)} style={styles.checkboxContainer}>
        <Ionicons name={agreements[key] ? 'checkbox-outline' : 'square-outline'} size={22} color={agreements[key] ? '#000' : '#8e8e8e'} />
      </TouchableOpacity>
      <Text style={styles.checkboxText}>
        <Text style={required ? styles.requiredText : styles.optionalText}>[{required ? '필수' : '선택'}]</Text> {' '}{label}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>오늘의 패션은 무엇 서비스 이용 약관에 동의해주세요.</Text>
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="이메일 주소 입력" 
            placeholderTextColor="#8e8e8e" 
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <TouchableOpacity onPress={handleAllAgree} style={styles.allAgreeRow}>
          <Ionicons name={allAgreed ? 'checkbox-outline' : 'square-outline'} size={24} color={allAgreed ? '#000' : '#8e8e8e'} />
          <Text style={styles.allAgreeText}>모두 동의 ({agreements.marketing ? '선택 정보 포함' : '선택 정보 미포함'})</Text>
        </TouchableOpacity>

        <View style={styles.separator} />
        {renderCheckbox('만 14세 이상', 'age', true)}
        {renderCheckbox('이용약관 동의', 'terms', true)}
        {renderCheckbox('개인정보 처리방침 동의', 'privacy', true)}
        {renderCheckbox('광고성 정보 수신 및 마케팅 활용 동의', 'marketing', false)}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.signupButton, { backgroundColor: isSignupEnabled ? '#000' : '#E0E0E0' }]} 
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
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  backButton: { width: 24 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 30 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 30 },
  inputContainer: { marginBottom: 30 },
  input: { height: 50, borderColor: '#e0e0e0', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, fontSize: 16, backgroundColor: '#f7f7f7' },
  allAgreeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  allAgreeText: { fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  separator: { borderBottomWidth: 1, borderBottomColor: '#f0f0f0', marginVertical: 15 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  checkboxContainer: { marginRight: 10 },
  checkboxText: { fontSize: 15, color: '#333' },
  requiredText: { fontWeight: 'bold', color: '#000' },
  optionalText: { fontWeight: 'normal', color: '#8e8e8e' },
  footer: { paddingHorizontal: 20, paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  signupButton: { height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  signupButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});