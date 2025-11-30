// app/MyProfilePage.tsx

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { User, onAuthStateChanged, sendPasswordResetEmail, signOut, updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { 
  Alert, 
  Image,
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { auth, storage } from '../firebaseConfig';

// 메뉴 아이템을 위한 컴포넌트
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
    <Ionicons name="chevron-forward-outline" size={20} color="#D4A58A" />
  </TouchableOpacity>
);

export default function MyProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "확인",
        onPress: () =>
          signOut(auth).catch((err) =>
            Alert.alert("오류", "로그아웃 중 문제가 발생했습니다.")
          ),
        style: "destructive",
      },
    ]);
  };

  const handlePasswordReset = async () => {
    if (!user || !user.email) {
      Alert.alert("오류", "사용자 정보가 없습니다.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, user.email);
      Alert.alert(
        "전송 완료",
        "비밀번호 재설정 이메일을 보냈습니다. 이메일함을 확인해주세요."
      );
    } catch (error) {
      console.error("비밀번호 재설정 이메일 발송 오류:", error);
      Alert.alert("오류", "요청을 처리하는 중 문제가 발생했습니다.");
    }
  };

  // 프로필 사진 선택 및 업로드 기능
  const pickAndUploadImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "알림",
        "프로필 사진을 변경하려면 사진첩 접근 권한이 필요합니다."
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (pickerResult.canceled || !user) return;
    setIsUploading(true);

    try {
      const imageUri = pickerResult.assets[0].uri;
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const storageRef = ref(storage, `profile_pictures/${user.uid}`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);

      await updateProfile(user, { photoURL: downloadURL });

      setUser({ ...user });

      Alert.alert("성공", "프로필 사진이 변경되었습니다.");
    } catch (error) {
      console.error("프로필 사진 업로드 오류:", error);
      Alert.alert("오류", "사진을 업로드하는 중 문제가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
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
        <Text style={styles.headerTitle}>마이페이지</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        {/* 프로필 섹션 */}
        <View style={styles.profileSection}>
          <TouchableOpacity
            onPress={pickAndUploadImage}
            disabled={isUploading}
            style={styles.profileWrapper}
          >
            {user?.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Ionicons name="person-outline" size={60} color="#D4A58A" />
              </View>
            )}
            <View style={styles.cameraIconContainer}>
              <Ionicons name="camera" size={18} color="#FFF7F1" />
            </View>
          </TouchableOpacity>

          <Text style={styles.userEmail}>{user?.email}</Text>
          {isUploading && (
            <Text style={styles.uploadingText}>사진 업로드 중...</Text>
          )}
        </View>

        {/* 메뉴 섹션 */}
        <View style={styles.menuSection}>
          <MenuItem
            icon="lock-closed-outline"
            title="비밀번호 변경"
            onPress={handlePasswordReset}
          />
          <MenuItem icon="exit-outline" title="로그아웃" onPress={handleLogout} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 전체 배경: 크림색
  container: { flex: 1, backgroundColor: "#FFF7F1" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF7F1",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F6D6C4",
  },
  backButton: { width: 24 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5B3B2A",
  },

  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },

  profileSection: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F6D6C4",
    marginBottom: 16,
    shadowColor: "#E2B79C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  profileWrapper: {
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#FFE1CF",
  },
  profilePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFEFE3",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#F6D6C4",
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "#FF9E7D",
    padding: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FFF7F1",
  },
  userEmail: {
    fontSize: 16,
    marginTop: 16,
    color: "#5B3B2A",
  },
  uploadingText: {
    fontSize: 13,
    color: "#C08E74",
    marginTop: 8,
  },

  menuSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F6D6C4",
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F6D6C4",
  },
  menuIcon: { width: 30 },
  menuText: {
    flex: 1,
    fontSize: 15,
    color: "#5B3B2A",
  },
});
