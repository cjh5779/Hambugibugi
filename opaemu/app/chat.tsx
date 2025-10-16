// app/chat.tsx

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from 'expo-router';
// 1. React의 useEffect와 useState를 가져옵니다.
import React, { useEffect, useRef, useState } from "react";
// 2. Firebase 관련 함수와 설정을 가져옵니다.
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import {
  Alert,
  Image, KeyboardAvoidingView, Platform, SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  imageUri?: string;
}

export default function ChatMain() {
  const router = useRouter();
  
  // 3. 로그인된 사용자 정보를 저장할 state를 만듭니다.
  const [user, setUser] = useState<User | null>(null);

  // 4. 로그인 상태를 실시간으로 감지하고 state를 업데이트합니다.
  useEffect(() => {
    // onAuthStateChanged는 로그인, 로그아웃 등 사용자 인증 상태가 바뀔 때마다 자동으로 실행됩니다.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // currentUser가 있으면 로그인된 상태, null이면 로그아웃된 상태입니다.
    });

    // 화면이 사라질 때 감시 기능을 정리(clean-up)하여 메모리 누수를 방지합니다.
    return () => unsubscribe();
  }, []);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "오늘 내 코디 어때?", isUser: true },
    { id: 2, text: "어! 좋아보여요!", isUser: false },
  ]);
  const scrollViewRef = useRef<ScrollView>(null);

  // 로그인 페이지로 이동하는 함수
  const goToLogin = () => {
    router.push('/LoginPage');
  };

  // 5. 로그아웃 기능 구현
  const handleLogout = () => {
    signOut(auth).catch((error) => console.error("로그아웃 오류:", error));
  };
  
  // 로그아웃 확인창을 띄우는 함수
  const showLogoutConfirm = () => {
    Alert.alert(
      "로그아웃",
      "정말 로그아웃 하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        { text: "확인", onPress: handleLogout, style: "destructive" },
      ]
    );
  };

  // 메시지 전송 함수 (기존과 동일)
  const sendMessage = () => {
    if (input.trim() === "") return;
    const newMessage: Message = { id: Date.now(), text: input, isUser: true };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");

    setTimeout(() => {
      const aiMessage: Message = { id: Date.now(), text: "AI의 응답", isUser: false };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 1000);
  };

  // 이미지 선택 함수 (기존과 동일)
  const handleImagePick = async () => {
    Alert.alert("사진 선택", "카메라로 찍거나 갤러리에서 선택하세요.", [
      { text: "카메라", onPress: () => launchCamera() },
      { text: "갤러리", onPress: () => launchGallery() },
      { text: "취소", style: "cancel" },
    ]);
  };

  // 카메라 실행 함수 (기존과 동일)
  const launchCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("카메라 권한이 필요합니다!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 1,
    });
    if (!result.canceled) {
      const newMessage: Message = { id: Date.now(), text: "", imageUri: result.assets[0].uri, isUser: true };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  // 갤러리 실행 함수 (기존과 동일)
  const launchGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("사진첩 접근 권한이 필요합니다!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 1,
    });
    if (!result.canceled) {
      const newMessage: Message = { id: Date.now(), text: "", imageUri: result.assets[0].uri, isUser: true };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* 6. user state 값에 따라 다른 아이콘을 보여줍니다. */}
          {user ? (
            // 로그인이 된 경우: 프로필 아이콘 + 로그아웃 기능
            <TouchableOpacity onPress={showLogoutConfirm}>
              <Ionicons name="person-circle-outline" size={32} color="#333" />
            </TouchableOpacity>
          ) : (
            // 로그인이 안 된 경우: 기존 로그인 페이지 이동 버튼
            <TouchableOpacity onPress={goToLogin}>
              <View style={styles.avatarSm} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.titleWrap}>
          <View style={styles.titleRow}>
            <Text style={styles.titleBold}> 오</Text><Text style={styles.titleSmall}>늘의</Text>
            <Text style={styles.titleBold}> 패</Text><Text style={styles.titleSmall}>션은</Text>
            <Text style={styles.titleHeavy}> 무</Text><Text style={styles.titleSmall}>엇?</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.gridBtn} onPress={() => { /* router.push('/grid') */ }} hitSlop={8}>
          <Ionicons name="grid-outline" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView ref={scrollViewRef} style={styles.scroll} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {messages.map((message) => (
          <View key={message.id} style={[styles.messageContainer, message.isUser ? styles.aiMessage : styles.userMessage]}>
            {message.imageUri ? <Image source={{ uri: message.imageUri }} style={styles.imageMessage} /> : null}
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>

      <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", android: undefined })} keyboardVerticalOffset={Platform.select({ ios: 8, android: 0 })}>
        <View style={styles.inputBar}>
          <View style={styles.leftButtons}>
            <TouchableOpacity style={styles.plusBtn} onPress={handleImagePick}>
              <Ionicons name="camera" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <TextInput value={input} onChangeText={setInput} placeholder="오늘의 코디는 무엇인가요?" placeholderTextColor="#8E8E93" style={styles.input} />
          <TouchableOpacity style={styles.plusBtn} onPress={sendMessage}>
            <Ionicons name="send" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingTop: 4, paddingBottom: 6 },
  headerLeft: { width: 36, alignItems: "flex-start", justifyContent: "center" },
  gridBtn: { width: 36, alignItems: "flex-end" },
  titleWrap: { flex: 1, alignItems: "center" },
  titleRow: { flexDirection: "row", alignItems: "flex-end" },
  titleSmall: { fontSize: 18, letterSpacing: 0.5 },
  titleBold: { fontSize: 24, fontWeight: "700", letterSpacing: 0.5 },
  titleHeavy: { fontSize: 26, fontWeight: "800", letterSpacing: 0.5 },
  avatarSm: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#D9D9D9", marginTop: 4 },
  scroll: { flex: 1 },
  messageContainer: { maxWidth: "80%", marginVertical: 8, padding: 10, borderRadius: 12 },
  userMessage: { backgroundColor: "#F0F0F0", alignSelf: "flex-start" },
  aiMessage: { backgroundColor: "#D9F9D4", alignSelf: "flex-end" },
  messageText: { fontSize: 16, color: "#333" },
  imageMessage: { width: 100, height: 100, borderRadius: 12, marginBottom: 8 },
  inputBar: { flexDirection: "row", alignItems: "center", borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#D1D1D6", paddingHorizontal: 12, paddingVertical: 8, backgroundColor: "#fff" },
  leftButtons: { flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginRight: 8 },
  input: { flex: 1, height: 42, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: "#E0E0E5", paddingHorizontal: 12, marginRight: 8 },
  plusBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", borderWidth: StyleSheet.hairlineWidth, borderColor: "#DADAE0", marginLeft: 8 },
});