// components/BootScreen.tsx
import React, { useEffect, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";

export default function BootScreen() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const t = setInterval(() => setDots((d) => (d.length >= 3 ? "" : d + ".")), 450);
    return () => clearInterval(t);
  }, []);

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />
      <View style={s.center}>
        <Text style={s.topLine}>
          <Text style={s.light}>오</Text>
          <Text style={s.bold}>늘의 </Text>
          <Text style={s.light}>패</Text>
          <Text style={s.bold}>션은 </Text>
          <Text style={s.light}>무</Text>
          <Text style={s.bold}>엇?</Text>
        </Text>

        <Text style={s.subtitle}>AI가 옷장을 뒤지는 중{dots}</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E5E5E5" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 24 },
  topLine: { fontSize: 28, letterSpacing: 2 },
  light: { fontFamily: "NotoSansKR_400Regular" },
  bold: { fontFamily: "NotoSansKR_700Bold" },
  subtitle: { fontFamily: "NotoSansKR_700Bold", fontSize: 20 },
});
