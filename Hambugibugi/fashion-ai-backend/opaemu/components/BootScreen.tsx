// components/BootScreen.tsx
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";

export default function BootScreen() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const t = setInterval(
      () => setDots((d) => (d.length >= 3 ? "" : d + ".")),
      450
    );
    return () => clearInterval(t);
  }, []);

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF7F1" />
      <View style={s.center}>
        {/* 로고 박스 */}
        <View style={s.logoWrapper}>
          <Image
            source={require("../assets/images/opaemu-icon.png")} // 👈 로고 파일 경로
            style={s.logo}
            resizeMode="contain"
          />
        </View>

        {/* 앱 이름 */}
        <Text style={s.appName}>
          <Text style={s.appNameAccent}>오</Text>
          <Text style={s.appNameText}>늘의 </Text>
          <Text style={s.appNameAccent}>패</Text>
          <Text style={s.appNameText}>션은 </Text>
          <Text style={s.appNameAccent}>무</Text>
          <Text style={s.appNameText}>엇?</Text>
        </Text>

        {/* 서브텍스트 */}
        <Text style={s.subtitle}>AI가 옷장을 뒤지는 중{dots}</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  // 배경색을 로고랑 맞는 크림톤으로
  container: { flex: 1, backgroundColor: "#FFF7F1" },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },

  // 로고를 조금 띄워 보이게 하는 박스
  logoWrapper: {
    width: 180,
    height: 180,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    // 살짝 그림자 (iOS/Android 둘 다)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  logo: {
    width: 140,
    height: 140,
  },

  appName: {
    fontSize: 26,
    letterSpacing: 2,
    flexDirection: "row",
  },
  appNameText: {
    fontFamily: "HiMelody",
    color: "#B47A5B", // 부드러운 브라운
  },
  appNameAccent: {
    fontFamily: "HiMelody",
    color: "#FF9F8F", // 로고 글자색이랑 비슷한 피치 컬러
  },

  subtitle: {
    marginTop: 4,
    fontFamily: "HiMelody",
    fontSize: 18,
    color: "#8C6B58",
  },
});
