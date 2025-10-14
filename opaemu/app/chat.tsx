// app/chat.tsx

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from 'expo-router'; // expo-router의 useRouter를 사용합니다.
import React, { useRef, useState } from "react";
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
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "오늘 내 코디 어때?", isUser: true },
    { id: 2, text: "어! 좋아보여요!", isUser: false },
  ]);

  const scrollViewRef = useRef<ScrollView>(null);

  // 로그인 페이지로 이동하는 함수
  const goToLogin = () => {
    // '/LoginPage'는 app/LoginPage.tsx 파일을 의미합니다.
    router.push('/LoginPage');
  };

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
        <TouchableOpacity style={styles.headerLeft} onPress={goToLogin}>
          <View style={styles.avatarSm} />
        </TouchableOpacity>

        <View style={styles.titleWrap}>
          <View style={styles.titleRow}>
            <Text style={styles.titleBold}> 오</Text><Text style={styles.titleSmall}>늘의</Text>
            <Text style={styles.titleBold}> 패</Text><Text style={styles.titleSmall}>션은</Text>
            <Text style={styles.titleHeavy}> 무</Text><Text style={styles.titleSmall}>엇?</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.gridBtn} onPress={() => { /* router.push('/grid') 와 같이 사용 */ }} hitSlop={8}>
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
  headerLeft: { width: 36, alignItems: "flex-start", justifyContent: "center", marginTop: 8 },
  gridBtn: { width: 36, alignItems: "flex-end" },
  titleWrap: { flex: 1, alignItems: "center" },
  titleRow: { flexDirection: "row", alignItems: "flex-end" },
  titleSmall: { fontSize: 18, letterSpacing: 0.5 },
  titleBold: { fontSize: 24, fontWeight: "700", letterSpacing: 0.5 },
  titleHeavy: { fontSize: 26, fontWeight: "800", letterSpacing: 0.5 },
  avatarSm: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#D9D9D9" },
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