// app/SettingsPage.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { 
  Alert, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from 'react-native';
// ⭐️ Expo/Android 호환성을 위해 다음 컴포넌트들을 import합니다.
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// 메뉴 아이템을 위한 재사용 컴포넌트
const MenuItem = ({ icon, title, onPress }: { icon: any; title: string; onPress?: () => void }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={22} color="#555" style={styles.menuIcon} />
    <Text style={styles.menuText}>{title}</Text>
    {/* 오른쪽 화살표 */}
    <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
  </TouchableOpacity>
);

// 섹션 헤더 컴포넌트 추가
const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeaderContainer}>
    <Text style={styles.sectionHeaderText}>{title}</Text>
  </View>
);

export default function SettingsPage() {
  const router = useRouter();

  // 앱 정보 표시 함수 (요청하신 상세 앱 정보)
  const showAppInfo = () => {
    Alert.alert(
      "앱 정보",
      `버전: 1.0.0\n개발사: AI Assistant\n개인정보 처리방침: 최신 버전 적용`,
      [{ text: "확인" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ⭐️ Expo의 StatusBar로 교체하고 style="dark"로 설정합니다. */}
      <StatusBar style="dark" />
      
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        
        {/* === 섹션 1: 일반 설정 === */}
        <SectionHeader title="일반" />
        <View style={styles.menuSection}>
          <MenuItem 
            icon="notifications-outline" 
            title="알림 설정" 
            onPress={() => Alert.alert("알림", "알림 설정 페이지로 이동합니다.")} 
          />
        </View>
        
        {/* === 섹션 2: 정보 및 지원 === */}
        <SectionHeader title="정보 및 지원" />
        <View style={styles.menuSection}>
          <MenuItem 
            icon="information-circle-outline" 
            title="앱 정보" 
            onPress={showAppInfo} // 상세 앱 정보 표시
          />
          <MenuItem 
            icon="document-text-outline" // 새로운 아이콘 추가
            title="서비스 이용약관" 
            onPress={() => Alert.alert("약관", "이용약관 페이지로 이동합니다.")} 
          />
          <MenuItem 
            icon="help-circle-outline" 
            title="문의하기" 
            onPress={() => Alert.alert("문의", "문의하기 페이지로 이동합니다.")} 
          />
          {/* 마지막 항목은 borderBottomWidth를 위해 그대로 둠 */}
        </View>
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  // 헤더 스타일
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', 
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0'
  },
  backButton: { width: 24 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  
  // 콘텐츠 및 섹션 스타일
  content: { flex: 1, paddingTop: 10 },
  sectionHeaderContainer: { paddingHorizontal: 20, paddingTop: 30, paddingBottom: 10, }, // 섹션 헤더 컨테이너
  sectionHeaderText: { fontSize: 14, fontWeight: 'bold', color: '#666' }, // 섹션 헤더 텍스트
  menuSection: { backgroundColor: '#fff', marginBottom: 20, borderTopWidth: 1, borderColor: '#f0f0f0' }, // 메뉴 섹션 배경 및 구분선
  
  // 메뉴 아이템 스타일
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0'
  },
  menuIcon: { width: 30, },
  menuText: { flex: 1, fontSize: 16, },
});