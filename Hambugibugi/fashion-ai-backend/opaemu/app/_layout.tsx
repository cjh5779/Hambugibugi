// app/_layout.tsx

import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebaseConfig";
import BootScreen from "../components/BootScreen";

// ⭐️ SafeAreaProvider와 StatusBar를 import 합니다.
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

// ⭐️ 커스텀 폰트 로딩용
import { useFonts } from "expo-font";
// ⭐️ 전역 Text 기본 폰트 설정용
import { Text as RNText } from "react-native";

// 공통 배경 컬러
const THEME_BG = "#FFF7F1";

// Text.defaultProps 한 번만 건드리기 위한 플래그
let hasSetDefaultFont = false;

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // 부트스크린 3초 보여주기
      setTimeout(() => {
        setUser(currentUser);
        setInitializing(false);
      }, 3000);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === "(auth)";
    const isWelcomePage = segments[0] === "WelcomePage";

    if (user && (inAuthGroup || isWelcomePage)) {
      router.replace("/chat");
    } else if (!user && !inAuthGroup && !isWelcomePage) {
      router.replace("/WelcomePage");
    }
  }, [user, segments, initializing, router]);

  if (initializing) {
    return <BootScreen />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // 👉 모든 스크린 기본 배경색
        contentStyle: { backgroundColor: THEME_BG },
      }}
    >
      <Stack.Screen name="chat" />
      <Stack.Screen name="MyProfilePage" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="WelcomePage" />
      <Stack.Screen name="SettingsPage" />
    </Stack>
  );
}

export default function RootLayout() {
  // 👇 여기서 폰트를 한 번만 로딩해 줍니다.
  const [fontsLoaded] = useFonts({
    HiMelody: require("../assets/fonts/HiMelody-Regular.ttf"),
  });

  // 폰트가 아직 안 로딩됐으면 아무 것도 렌더링 안 함 (잠깐 빈 화면)
  if (!fontsLoaded) {
    return null;
    // 또는 <BootScreen />:
    // return <BootScreen />;
  }

  // ✅ 전역 Text 기본 폰트 HiMelody로 설정 (한 번만 실행)
  if (!hasSetDefaultFont) {
    hasSetDefaultFont = true;

    const TextAny = RNText as any; // <-- 타입스크립트 회피용 캐스팅

    if (!TextAny.defaultProps) {
      TextAny.defaultProps = {};
    }

    TextAny.defaultProps.style = [
      TextAny.defaultProps.style,
      { fontFamily: "HiMelody" },
    ];
  }

  return (
    // ⭐️ SafeAreaProvider로 전체 앱을 감싸고 기본 배경색 지정
    <SafeAreaProvider style={{ flex: 1, backgroundColor: THEME_BG }}>
      <StatusBar style="dark" backgroundColor={THEME_BG} />
      <RootLayoutNav />
    </SafeAreaProvider>
  );
}
