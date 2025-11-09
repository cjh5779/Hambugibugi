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
  // 🚨 react-native의 SafeAreaView와 StatusBar는 여기서 제거합니다.
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from 'react-native';
// ⭐️ Expo/Android 호환성을 위해 다음 컴포넌트들을 import합니다.
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { auth, storage } from '../firebaseConfig';

// 메뉴 아이템을 위한 컴포넌트
const MenuItem = ({ icon, title, onPress }: { icon: any; title: string; onPress?: () => void }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={22} color="#555" style={styles.menuIcon} />
    <Text style={styles.menuText}>{title}</Text>
    <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
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
        onPress: () => signOut(auth).catch(err => Alert.alert("오류", "로그아웃 중 문제가 발생했습니다.")),
        style: "destructive" 
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
        Alert.alert("전송 완료", "비밀번호 재설정 이메일을 보냈습니다. 이메일 함을 확인해주세요.");
    } catch (error) {
        console.error("비밀번호 재설정 이메일 발송 오류:", error);
        Alert.alert("오류", "요청을 처리하는 중 문제가 발생했습니다.");
    }
  };

  // ⭐️ 프로필 사진 선택 및 업로드 기능 함수
  const pickAndUploadImage = async () => {
    // 1. 미디어 라이브러리 접근 권한 확인
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("알림", "프로필 사진을 변경하려면 사진첩 접근 권한이 필요합니다.");
      return;
    }

    // 2. 이미지 선택
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

      // 3. Firebase Storage에 업로드
      const storageRef = ref(storage, `profile_pictures/${user.uid}`);
      await uploadBytes(storageRef, blob);

      // 4. 업로드된 이미지의 URL 다운로드
      const downloadURL = await getDownloadURL(storageRef);

      // 5. Firebase Auth 프로필 업데이트 (사진 URL 저장)
      await updateProfile(user, { photoURL: downloadURL });
      
      // 상태를 강제로 업데이트하여 화면에 바로 반영되도록 함
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
      {/* ⭐️ Expo의 StatusBar로 교체하고 style="dark"로 설정합니다. */}
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>마이페이지</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={pickAndUploadImage} disabled={isUploading}>
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Ionicons name="person-outline" size={60} color="#ccc" />
              </View>
            )}
            <View style={styles.cameraIconContainer}>
              <Ionicons name="camera" size={20} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {isUploading && <Text style={styles.uploadingText}>사진 업로드 중...</Text>}
        </View>

        <View style={styles.menuSection}>
          <MenuItem icon="lock-closed-outline" title="비밀번호 변경" onPress={handlePasswordReset} />
          <MenuItem icon="exit-outline" title="로그아웃" onPress={handleLogout} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0'
  },
  backButton: { width: 24 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1 },
  profileSection: {
    paddingVertical: 40, alignItems: 'center', backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0', marginBottom: 10,
  },
  profileImage: { width: 120, height: 120, borderRadius: 60, },
  profilePlaceholder: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: '#e9e9e9',
    justifyContent: 'center', alignItems: 'center',
  },
  cameraIconContainer: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 18,
  },
  userEmail: { fontSize: 16, marginTop: 16, },
  uploadingText: { fontSize: 13, color: '#888', marginTop: 8 },
  menuSection: { backgroundColor: '#fff', },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0'
  },
  menuIcon: { width: 30, },
  menuText: { flex: 1, fontSize: 16, },
});