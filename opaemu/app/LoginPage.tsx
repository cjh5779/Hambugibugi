// app/LoginPage.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// 이미지 경로는 프로젝트 루트에 있는 'img' 폴더 기준으로 설정했습니다.
// 실제 경로에 맞게 수정해주세요.
const FacebookIcon = require('../img/Facebook.png');
const InstagramIcon = require('../img/Instagram.png');
const KakaoIcon = require('../img/kakaotalk.png');
const NaverBandIcon = require('../img/Naver BAND.png');

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (email && password) {
      // 로그인 후 뒤로가기 시 다시 로그인 화면으로 오지 않도록 replace 사용
      router.replace('/chat');
    } else {
      Alert.alert("오류", "아이디와 비밀번호를 입력해주세요.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LOGIN</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        <TextInput style={styles.input} placeholder="아이디 (이메일)" placeholderTextColor="#8e8e8e" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="비밀번호" placeholderTextColor="#8e8e8e" secureTextEntry value={password} onChangeText={setPassword} />
        
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>

        <Text style={styles.snsLoginTitle}>SNS 계정으로 로그인하기</Text>
        <View style={styles.socialIconsContainer}>
          <TouchableOpacity onPress={() => Alert.alert('Facebook 로그인')}><Image source={FacebookIcon} style={styles.socialIcon} /></TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert('Instagram 로그인')}><Image source={InstagramIcon} style={styles.socialIcon} /></TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert('카카오톡 로그인')}><Image source={KakaoIcon} style={styles.socialIcon} /></TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert('네이버 밴드 로그인')}><Image source={NaverBandIcon} style={styles.socialIcon} /></TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signupButton} onPress={() => router.push('/SignupAgreePage')}>
          <Text style={styles.signupButtonText}>계정이 없으신가요? 간편가입하기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity><Text style={styles.footerText}>아이디 찾기</Text></TouchableOpacity>
        <Text style={styles.footerSeparator}>|</Text>
        <TouchableOpacity><Text style={styles.footerText}>비밀번호 찾기</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  backButton: { width: 24 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 40 },
  input: { height: 50, borderColor: '#e0e0e0', borderWidth: 1, borderRadius: 8, marginBottom: 12, paddingHorizontal: 15, fontSize: 16, backgroundColor: '#f7f7f7' },
  loginButton: { height: 50, backgroundColor: '#000', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  snsLoginTitle: { marginTop: 60, textAlign: 'center', color: '#8e8e8e', fontSize: 14 },
  socialIconsContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20, gap: 20 },
  socialIcon: { width: 50, height: 50, borderRadius: 25 },
  signupButton: { height: 50, backgroundColor: '#fff', borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0', marginTop: 20 },
  signupButtonText: { color: '#000', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
  footerText: { color: '#8e8e8e', fontSize: 14 },
  footerSeparator: { color: '#e0e0e0', marginHorizontal: 10 },
});