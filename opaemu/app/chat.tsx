// app/chat.tsx

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import {
  Alert,
  Image, KeyboardAvoidingView, Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context'; 
import { StatusBar } from 'expo-status-bar'; 

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  imageUri?: string;
}

export default function ChatMain() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "오늘 내 코디 어때?", isUser: true },
    { id: 2, text: "어! 좋아보여요!", isUser: false },
  ]);
  const scrollViewRef = useRef<ScrollView>(null);

  const goToLogin = () => { router.push('/(auth)/LoginPage'); };
  const goToMyProfile = () => { router.push('/MyProfilePage'); };
  const goToSettings = () => { router.push('/SettingsPage'); };

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

  const handleImagePick = async () => {
    Alert.alert("사진 선택", "카메라로 찍거나 갤러리에서 선택하세요.", [
      { text: "카메라", onPress: () => launchCamera() },
      { text: "갤러리", onPress: () => launchGallery() },
      { text: "취소", style: "cancel" },
    ]);
  };

  const launchCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) { alert("카메라 권한이 필요합니다!"); return; }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 1,
    });
    if (!result.canceled) {
      const newMessage: Message = { id: Date.now(), text: "", imageUri: result.assets[0].uri, isUser: true };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  const launchGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) { alert("사진첩 접근 권한이 필요합니다!"); return; }
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
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {user ? (
            <TouchableOpacity onPress={goToMyProfile}>
              {user.photoURL ? (
                <Image source={{ uri: user.photoURL }} style={styles.profileIcon} />
              ) : (
                <Ionicons name="person-circle-outline" size={32} color="#333" />
              )}
            </TouchableOpacity>
          ) : (
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

        <TouchableOpacity style={styles.settingsBtn} onPress={goToSettings} hitSlop={8}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.chatContainer} 
      >
        <ScrollView 
          ref={scrollViewRef} 
          style={styles.scroll} 
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }} 
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View key={message.id} style={[styles.messageContainer, message.isUser ? styles.aiMessage : styles.userMessage]}>
              {message.imageUri ? <Image source={{ uri: message.imageUri }} style={styles.imageMessage} /> : null}
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.plusBtn} onPress={handleImagePick}>
            <Ionicons name="camera-outline" size={24} color="#000" />
          </TouchableOpacity>
          
          {/* ⭐️ 1. TextInput에 multiline 속성을 추가합니다. */}
          <TextInput 
            value={input} 
            onChangeText={setInput} 
            placeholder="오늘의 코디는 무엇인가요?" 
            placeholderTextColor="#8E8E93" 
            style={styles.input} 
            multiline // 여러 줄 입력을 활성화
            numberOfLines={1} // (초기 라인 수, 선택 사항)
          />
          
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
  chatContainer: { flex: 1 }, 
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingTop: 4, paddingBottom: 6 },
  headerLeft: { width: 36, alignItems: "flex-start", justifyContent: "center" },
  settingsBtn: { width: 36, alignItems: "flex-end" },
  titleWrap: { flex: 1, alignItems: "center" },
  titleRow: { flexDirection: "row", alignItems: "flex-end" },
  titleSmall: { fontSize: 18, letterSpacing: 0.5 },
  titleBold: { fontSize: 24, fontWeight: "700", letterSpacing: 0.5 },
  titleHeavy: { fontSize: 26, fontWeight: "800", letterSpacing: 0.5 },
  avatarSm: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#D9D9D9", marginTop: 4 },
  profileIcon: { width: 32, height: 32, borderRadius: 16 },
  scroll: { flex: 1 },
  messageContainer: { maxWidth: "80%", marginVertical: 8, padding: 10, borderRadius: 12 },
  userMessage: { backgroundColor: "#F0F0F0", alignSelf: "flex-start" },
  aiMessage: { backgroundColor: "#D9F9D4", alignSelf: "flex-end" },
  messageText: { fontSize: 16, color: "#333" },
  imageMessage: { width: 150, height: 150, borderRadius: 12, marginBottom: 8 },
  inputBar: { flexDirection: "row", alignItems: "center", borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#D1D1D6", paddingHorizontal: 12, paddingVertical: 8, backgroundColor: "#fff" },
  
  // ⭐️ 2. input 스타일을 수정합니다.
  input: { 
    flex: 1, 
    // height: 42, // (고정 높이 제거)
    minHeight: 42, // 최소 높이 설정 (기존 높이 유지)
    maxHeight: 120, // 최대 높이 설정 (약 5~6줄 분량)
    borderRadius: 21, 
    backgroundColor: '#f0f0f0', 
    paddingHorizontal: 16, 
    paddingVertical: 10, // ⭐️ 여러 줄 입력을 위해 세로 패딩 추가
    marginHorizontal: 8,
    fontSize: 16, // (글꼴 크기 명시 권장)
  },
  
  plusBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
});