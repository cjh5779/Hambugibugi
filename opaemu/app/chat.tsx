// app/chat.tsx
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";

const BASE_URL = "http://54.180.99.121:7000";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  imageUri?: string; // 로컬 미리보기
  imageUrl?: string; // S3 주소
  imageWidth?: number;
  imageHeight?: number;
  sender?: string;
  created_at?: string;
}

const CHAT_ID = "room_1";

/** ai_result → 채팅에 보여줄 텍스트로 변환 */
function buildAiReply(aiResult: any): string {
  const analysis = aiResult?.analysis || {};
  const advice = aiResult?.llm_advice || {};

  const rawAesth = analysis.aesthetics_score_h1;
  const rawCompat = analysis.compatibility_score_h2;

  const aestheticsScore =
    typeof rawAesth === "number"
      ? rawAesth.toFixed(2)
      : rawAesth != null
      ? Number(rawAesth).toFixed(2)
      : null;

  const compatibilityScore =
    typeof rawCompat === "number"
      ? rawCompat.toFixed(2)
      : rawCompat != null
      ? Number(rawCompat).toFixed(2)
      : null;

  let scoreText = "📊 오늘의 점수\n";
  scoreText += aestheticsScore
    ? `🧠 심미 점수: ${aestheticsScore}점\n`
    : "🧠 심미 점수를 가져오지 못했어요.\n";
  scoreText += compatibilityScore
    ? `🎯 조합 점수: ${compatibilityScore}점\n`
    : "🎯 조합 점수를 가져오지 못했어요.\n";
  scoreText += "\n";

  const oneLine =
    advice.one_line_summary || "요약 정보를 가져오지 못했어요.";

  const positivesArray: string[] = Array.isArray(advice.positive_points)
    ? advice.positive_points
    : advice.positive_points
    ? [advice.positive_points]
    : [];

  const positivesText =
    positivesArray.length > 0
      ? positivesArray.map((p) => `• ${p}`).join("\n")
      : "좋았던 점 정보를 가져오지 못했어요.";

  const suggestion =
    advice.suggestion || "스타일 제안 정보를 가져오지 못했어요.";

  const replyText =
    scoreText +
    `✨ 한 줄 요약\n${oneLine}\n\n` +
    `👍 좋았던 점\n${positivesText}\n\n` +
    `💡 스타일 제안\n${suggestion}`;

  return replyText;
}

/** 백엔드 history 응답 → Message[] 로 변환 (이미지 + AI 답변 둘 다 생성) */
function normalizeHistory(raw: any, uid: string): Message[] {
  const list = Array.isArray(raw?.messages)
    ? raw.messages
    : Array.isArray(raw?.items)
    ? raw.items
    : Array.isArray(raw)
    ? raw
    : [];

  const result: Message[] = [];

  list.forEach((m: any) => {
    const baseId = m.id?.toString?.() ?? String(Math.random());
    const sender = m.sender;
    const isUser = sender === uid || sender === "user";

    // 1) 유저가 보낸 원본 (텍스트 or 이미지)
    if (m.type === "text" && m.text) {
      result.push({
        id: baseId,
        text: m.text,
        isUser,
        imageUrl: undefined,
        sender,
        created_at: m.created_at,
      });
    } else if (m.type === "image" && m.image_url) {
      result.push({
        id: baseId,
        text: "",
        isUser, // 항상 오른쪽(유저)로 보이게
        imageUrl: m.image_url,
        sender,
        created_at: m.created_at,
      });
    }

    // 2) 같은 레코드에 ai_result 있으면 → AI 말풍선 하나 더 추가
    if (m.ai_result) {
      const replyText = buildAiReply(m.ai_result);
      result.push({
        id: `${baseId}-ai`,
        text: replyText,
        isUser: false, // AI는 항상 왼쪽
        imageUrl: undefined,
        sender: "assistant",
        created_at: m.created_at,
      });
    }
  });

  return result;
}

export default function ChatMain() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const [isThinking, setIsThinking] = useState(false); // 로딩 오버레이 표시용

  // 로그인 유저 구독
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 히스토리 불러오기
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const uid = user?.uid ?? "test_user";
        const res = await fetch(
          `${BASE_URL}/chat/history?uid=${uid}&chat_id=${CHAT_ID}`
        );
        const data = await res.json();
        console.log("📜 initial history:", data);

        const serverMessages = normalizeHistory(data, uid);

        if (serverMessages.length > 0) {
          setMessages(serverMessages);
        } else {
          setMessages([]);
        }

        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 200);
      } catch (err) {
        console.log("history error", err);
        setMessages([]);
      }
    };

    fetchHistory();
  }, [user]);

  const goToLogin = () => {
    router.push("/(auth)/LoginPage");
  };
  const goToMyProfile = () => {
    router.push("/MyProfilePage");
  };
  const goToSettings = () => {
    router.push("/SettingsPage");
  };

  // 텍스트 메시지 전송
  const sendMessage = async () => {
    if (input.trim() === "") return;
    const uid = user?.uid ?? "test_user";
    const userText = input.trim();

    const tempMsg: Message = {
      id: Date.now().toString(),
      text: userText,
      isUser: true,
    };
    setMessages((prev) => [...prev, tempMsg]);
    setInput("");
    scrollViewRef.current?.scrollToEnd({ animated: true });

    // 로딩 시작
    setIsThinking(true);

    try {
      const res = await fetch(`${BASE_URL}/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          user_message: userText,
          uid: uid,
        }),
      });

      const data = await res.json();
      console.log("📨 /chat/message response:", data);

      const refresh = await fetch(
        `${BASE_URL}/chat/history?uid=${uid}&chat_id=${CHAT_ID}`
      );
      const newData = await refresh.json();
      console.log("🔁 history after send:", newData);

      const serverMessages = normalizeHistory(newData, uid);
      if (serverMessages.length > 0) {
        setMessages(serverMessages);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 200);
      }
    } catch (err) {
      console.log("send message error", err);
    } finally {
      // 로딩 종료
      setIsThinking(false);
    }
  };

  // 사진 선택
  const handleImagePick = async () => {
    Alert.alert("사진 선택", "카메라로 찍거나 갤러리에서 선택하세요.", [
      { text: "카메라", onPress: () => launchCamera() },
      { text: "갤러리", onPress: () => launchGallery() },
      { text: "취소", style: "cancel" },
    ]);
  };

  const launchCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert("카메라 권한이 필요합니다!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      await uploadImageToServer(asset.uri, asset.width, asset.height);
    }
  };

  const launchGallery = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("사진첩 접근 권한이 필요합니다!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      await uploadImageToServer(asset.uri, asset.width, asset.height);
    }
  };

  // 이미지 업로드
  const uploadImageToServer = async (
    localUri: string,
    width?: number,
    height?: number
  ) => {
    const uid = user?.uid ?? "test_user";

    const temp: Message = {
      id: Date.now().toString(),
      text: "",
      isUser: true,
      imageUri: localUri,
      imageWidth: width,
      imageHeight: height,
    };
    setMessages((prev) => [...prev, temp]);
    scrollViewRef.current?.scrollToEnd({ animated: true });

    // 로딩 시작
    setIsThinking(true);

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: localUri,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);

      const res = await fetch(
        `${BASE_URL}/upload/image?uid=${uid}&chat_id=${CHAT_ID}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        Alert.alert("서버 에러", `Status: ${res.status}\n내용: ${errorText}`);
        return;
      }

      const data = await res.json();
      console.log("📨 /upload/image response:", data);

      const refresh = await fetch(
        `${BASE_URL}/chat/history?uid=${uid}&chat_id=${CHAT_ID}`
      );
      const newData = await refresh.json();
      console.log("🔁 history after image:", newData);

      const serverMessages = normalizeHistory(newData, uid);
      if (serverMessages.length > 0) {
        setMessages(serverMessages);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 200);
      }
    } catch (err) {
      console.log("image upload error", err);
    } finally {
      // 로딩 종료
      setIsThinking(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style={isThinking ? "light" : "dark"} />

      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {user ? (
            <TouchableOpacity onPress={goToMyProfile}>
              {user.photoURL ? (
                <Image
                  source={{ uri: user.photoURL }}
                  style={styles.profileIcon}
                />
              ) : (
                <Ionicons
                  name="person-circle-outline"
                  size={32}
                  color="#8C5A3A"
                />
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
            <Text style={styles.titleBold}> 오</Text>
            <Text style={styles.titleSmall}>늘의</Text>
            <Text style={styles.titleBold}> 패</Text>
            <Text style={styles.titleSmall}>션은</Text>
            <Text style={styles.titleHeavy}> 무</Text>
            <Text style={styles.titleSmall}>엇?</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={goToSettings}
          hitSlop={8}
        >
          <Ionicons name="settings-outline" size={24} color="#8C5A3A" />
        </TouchableOpacity>
      </View>

      {/* 채팅 영역 */}
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
          {messages.map((message) => {
            const imgSource = message.imageUri || message.imageUrl;
            const isImageOnly = !!imgSource && !message.text;

            // ✅ 이미지만 있는 메시지: 말풍선 없이 이미지만
            if (isImageOnly) {
              const maxWidth = 260;
              const width =
                message.imageWidth && message.imageWidth > 0
                  ? Math.min(message.imageWidth, maxWidth)
                  : 220;
              const height =
                message.imageWidth &&
                message.imageHeight &&
                message.imageWidth > 0
                  ? (width * message.imageHeight) / message.imageWidth
                  : 260;

              return (
                <View
                  key={message.id}
                  style={
                    message.isUser
                      ? styles.imageOnlyRight
                      : styles.imageOnlyLeft
                  }
                >
                  <Image
                    source={{ uri: imgSource! }}
                    style={[styles.imageOnlyImage, { width, height }]}
                    resizeMode="contain"
                    onError={(e) => {
                      console.log(
                        "❌ image load error:",
                        imgSource,
                        e.nativeEvent
                      );
                    }}
                  />
                </View>
              );
            }

            // ✅ 텍스트(또는 텍스트+이미지) 메시지: 말풍선 사용
            return (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.isUser ? styles.aiMessage : styles.userMessage,
                ]}
              >
                {imgSource && (
                  <Image
                    source={{ uri: imgSource }}
                    style={styles.imageMessage}
                    resizeMode="contain"
                    onError={(e) =>
                      console.log(
                        "❌ image load error:",
                        imgSource,
                        e.nativeEvent
                      )
                    }
                  />
                )}
                {!!message.text && (
                  <Text style={styles.messageText}>{message.text}</Text>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* 입력 바 */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.plusBtn} onPress={handleImagePick}>
            <Ionicons name="camera-outline" size={24} color="#8C5A3A" />
          </TouchableOpacity>

          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="오늘의 코디는 무엇인가요?"
            placeholderTextColor="#C08E74"
            style={styles.input}
            multiline
            numberOfLines={1}
          />

          <TouchableOpacity style={styles.plusBtn} onPress={sendMessage}>
            <Ionicons name="send" size={22} color="#8C5A3A" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* 로딩 오버레이: 화면 어둡게 + Lottie 애니메이션 */}
      {isThinking && (
        <View style={styles.loadingOverlay}>
          <LottieView
            source={require("../assets/lotties/Sandy Loading.json")}
            autoPlay
            loop
            style={styles.loadingLottie}
          />
          <Text style={styles.loadingText}>코디를 분석하는 중이에요...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 전체 배경: 로고랑 맞춘 크림색
  safe: { flex: 1, backgroundColor: "#FFF7F1" },
  chatContainer: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 8,
    backgroundColor: "#FFF7F1",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F6D6C4",
  },
  headerLeft: { width: 36, alignItems: "flex-start", justifyContent: "center" },
  settingsBtn: { width: 36, alignItems: "flex-end" },
  titleWrap: { flex: 1, alignItems: "center" },
  titleRow: { flexDirection: "row", alignItems: "flex-end" },

  titleSmall: {
    fontSize: 18,
    letterSpacing: 0.5,
    fontFamily: "HiMelody",
    color: "#8C5A3A",
  },
  titleBold: {
    fontSize: 24,
    letterSpacing: 0.5,
    fontFamily: "HiMelody",
    color: "#FF9E7D",
  },
  titleHeavy: {
    fontSize: 26,
    letterSpacing: 0.5,
    fontFamily: "HiMelody",
    color: "#FF9E7D",
  },

  avatarSm: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F5D1B6",
    marginTop: 4,
  },
  profileIcon: { width: 32, height: 32, borderRadius: 16 },

  scroll: { flex: 1 },

  messageContainer: {
    maxWidth: "80%",
    marginVertical: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    shadowColor: "#E2B79C",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },

  // isUser === false (AI) 말풍선 – 왼쪽
  userMessage: {
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#F6D6C4",
  },
  // isUser === true (나) 말풍선 – 오른쪽
  aiMessage: {
    backgroundColor: "#FFE1CF",
    alignSelf: "flex-end",
  },

  // 📷 이미지만 있을 때 컨테이너 (말풍선 X)
  imageOnlyRight: {
    alignSelf: "flex-end",
    marginVertical: 6,
  },
  imageOnlyLeft: {
    alignSelf: "flex-start",
    marginVertical: 6,
  },
  imageOnlyImage: {
    borderRadius: 18,
    backgroundColor: "transparent",
  },

  messageText: {
    fontSize: 16,
    color: "#5B3B2A",
    lineHeight: 22,
  },

  imageMessage: {
    borderRadius: 18,
    marginBottom: 6,
    backgroundColor: "#FFF",
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#F6D6C4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FFF7F1",
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 120,
    borderRadius: 21,
    backgroundColor: "#FFEFE3",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
    fontSize: 16,
    color: "#5B3B2A",
  },
  plusBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  // 전체 화면 로딩 오버레이
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loadingLottie: {
    width: 220,
    height: 220,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#FFF7F1",
  },
});
