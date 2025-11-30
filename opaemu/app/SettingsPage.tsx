// app/SettingsPage.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// 메뉴 아이템 컴포넌트
const MenuItem = ({
  icon,
  title,
  onPress,
}: {
  icon: any;
  title: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={22} color="#8C5A3A" style={styles.menuIcon} />
    <Text style={styles.menuText}>{title}</Text>
    <Ionicons
      name="chevron-forward-outline"
      size={20}
      color="#D4A58A"
    />
  </TouchableOpacity>
);

// 섹션 헤더
const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeaderContainer}>
    <Text style={styles.sectionHeaderText}>{title}</Text>
  </View>
);

export default function SettingsPage() {
  const router = useRouter();

  const showAppInfo = () => {
    Alert.alert(
      '앱 정보',
      `버전: 1.0.0\n앱 이름: 오늘의 패션은 무엇? (오패무)\n개인정보 처리방침: 최신 버전 적용`,
      [{ text: '확인' }],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#8C5A3A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        {/* 섹션 1: 일반 */}
        <SectionHeader title="일반" />
        <View style={styles.menuSection}>
          <MenuItem
            icon="notifications-outline"
            title="알림 설정"
            onPress={() =>
              Alert.alert('알림', '알림 설정 페이지는 준비 중입니다.')
            }
          />
        </View>

        {/* 섹션 2: 정보 및 지원 */}
        <SectionHeader title="정보 및 지원" />
        <View style={styles.menuSection}>
          <MenuItem
            icon="information-circle-outline"
            title="앱 정보"
            onPress={showAppInfo}
          />
          <MenuItem
            icon="document-text-outline"
            title="서비스 이용약관"
            onPress={() =>
              Alert.alert('약관', '이용약관 페이지는 준비 중입니다.')
            }
          />
          <MenuItem
            icon="help-circle-outline"
            title="문의하기"
            onPress={() =>
              Alert.alert('문의', '문의하기 페이지는 준비 중입니다.')
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 전체 배경: 크림 톤
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
  backButton: { width: 24 },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5B3B2A',
  },

  content: {
    flex: 1,
    paddingTop: 8,
  },

  // 섹션 헤더
  sectionHeaderContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C08E74',
  },

  // 메뉴 카드 섹션
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F6D6C4',
    overflow: 'hidden',
    shadowColor: '#E2B79C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  // 메뉴 아이템
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F6D6C4',
  },
  menuIcon: {
    width: 30,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    color: '#5B3B2A',
  },
});
