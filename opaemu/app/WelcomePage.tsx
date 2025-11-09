// app/WelcomePage.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { 
  // 🚨 react-native의 SafeAreaView는 여기서 제거합니다.
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from 'react-native';
// ⭐️ Expo/Android 호환성을 위해 다음 컴포넌트들을 import합니다.
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* ⭐️ Expo의 StatusBar를 추가하고 style="dark"로 설정합니다. */}
      <StatusBar style="dark" />
      <View style={styles.content}>
        {/* TODO: 나중에 여기에 로고나 예쁜 일러스트 이미지를 추가하면 좋습니다. */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>오늘의 패션은 무엇?</Text>
          <Text style={styles.subtitle}>AI가 당신의 옷장을 분석해{"\n"}최고의 코디를 추천해 드립니다.</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.startButton} 
          onPress={() => router.push('/(auth)/LoginPage')}
        >
          <Text style={styles.startButtonText}>시작하기</Text>
        </TouchableOpacity>
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>계정이 없으신가요? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/SignupAgreePage')}>
            <Text style={[styles.signupText, styles.signupLink]}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  startButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#888',
  },
  signupLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});