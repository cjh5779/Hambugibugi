// app/SettingsPage.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 메뉴 아이템을 위한 재사용 컴포넌트
const MenuItem = ({ icon, title, onPress }: { icon: any; title: string; onPress?: () => void }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={22} color="#555" style={styles.menuIcon} />
    <Text style={styles.menuText}>{title}</Text>
    <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
  </TouchableOpacity>
);

export default function SettingsPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        {/* 메뉴 섹션 */}
        <View style={styles.menuSection}>
          <MenuItem icon="notifications-outline" title="알림 설정" onPress={() => Alert.alert("알림", "알림 설정 기능은 준비 중입니다.")} />
          <MenuItem icon="information-circle-outline" title="앱 정보" onPress={() => Alert.alert("앱 정보", "버전 1.0.0")} />
          <MenuItem icon="help-circle-outline" title="문의하기" onPress={() => Alert.alert("알림", "문의하기 기능은 준비 중입니다.")} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', 
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0'
  },
  backButton: { width: 24 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, paddingTop: 10 },
  menuSection: { backgroundColor: '#fff', },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0'
  },
  menuIcon: { width: 30, },
  menuText: { flex: 1, fontSize: 16, },
});