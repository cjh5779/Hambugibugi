import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function ChatScreen() {
  const [messages, setMessages] = useState<
    { id: string; sender: string; text: string; image?: string }[]
  >([
    {
      id: "1",
      sender: "user",
      text: "오늘 내 코디 어때?",
      image: "https://via.placeholder.com/200",
    },
    { id: "2", sender: "ai", text: "깔끔하네요! 👍 상의가 포인트에요." },
  ]);

  const [input, setInput] = useState("");
  const [inputHeight, setInputHeight] = useState(40); // ✅ 기본 한 줄 높이

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now().toString(), sender: "user", text: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setInputHeight(40); // ✅ 전송 후 다시 기본 높이로
  };

  const renderItem = ({ item }: { item: typeof messages[0] }) => {
    const isUser = item.sender === "user";

    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: isUser ? "flex-end" : "flex-start",
          marginVertical: 6,
          paddingHorizontal: 10,
        }}
      >
        <View
          style={{
            backgroundColor: isUser ? "#2DD4BF" : "#f0f0f0",
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 16,
            maxWidth: "70%",
            borderTopLeftRadius: isUser ? 16 : 4,
            borderTopRightRadius: isUser ? 4 : 16,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          }}
        >
          <Text
            style={{
              color: isUser ? "#fff" : "#000",
              fontSize: 15,
              textAlign: "left",
              flexShrink: 1,
              alignSelf: "flex-start",
            }}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={95}
    >
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* 헤더 */}
        <View
          style={{
            height: 60,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            borderBottomWidth: 1,
            borderColor: "#ddd",
          }}
        >
          <Ionicons name="menu" size={24} />
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>오늘의 코디</Text>
          <Ionicons name="grid-outline" size={22} />
        </View>

        {/* 메시지 리스트 */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12 }}
        />

        {/* 입력창 */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            padding: 10,
            borderTopWidth: 1,
            borderColor: "#ddd",
          }}
        >
          <Ionicons
            name="person-circle-outline"
            size={28}
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 20,
              paddingHorizontal: 15,
              marginRight: 8,
              fontSize: 16,
              lineHeight: 24,              // ✅ 커서 크기 맞춤
              minHeight: inputHeight,      // ✅ 기본 높이에서 자연스럽게 늘어남
              maxHeight: 120,              // ✅ 최대 제한
              textAlignVertical: "center", // ✅ placeholder와 입력 글자 중앙 정렬
            }}
            value={input}
            onChangeText={setInput}
            placeholder="오늘의 코디는 무엇인가요?"
            multiline={true}
            onContentSizeChange={(e) =>
              setInputHeight(
                Math.min(120, Math.max(40, e.nativeEvent.contentSize.height))
              )
            }
            selectionColor="#2DD4BF"
          />
          <TouchableOpacity onPress={sendMessage}>
            {input.trim() ? (
              <Ionicons name="send" size={26} color="#2DD4BF" />
            ) : (
              <Ionicons name="add-circle" size={28} color="#2DD4BF" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
