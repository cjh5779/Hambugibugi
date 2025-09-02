import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#ddd",
          height: 60,
        },
        tabBarActiveTintColor: "#2DD4BF", // 민트색
        tabBarInactiveTintColor: "#999",
      }}
    >
      {/* Grid 탭 */}
      <Tabs.Screen
        name="grid"
        options={{
          headerTitle: "오늘의 패션은 무엇",
          headerTitleAlign: "center",
          headerLeft: () => (
            <View style={{ marginLeft: 15 }}>
              <Ionicons name="menu-outline" size={24} color="#000" />
            </View>
          ),
          headerRight: () => (
            <View
              style={{
                marginRight: 15,
                padding: 6,
                borderWidth: 2,
                borderColor: "#000",
                borderRadius: 6,
              }}
            >
              <Ionicons name="add" size={20} color="#000" />
            </View>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" color={color} size={size} />
          ),
        }}
      />

      {/* Chat 탭 */}
      <Tabs.Screen
        name="chat"
        options={{
          headerTitle: "채팅",
          headerTitleAlign: "center",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" color={color} size={size} />
          ),
        }}
      />

      {/* Profile 탭 */}
      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: "내 프로필",
          headerTitleAlign: "center",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
