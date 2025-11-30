// app/WelcomePage.tsx

import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Video, ResizeMode } from "expo-av";

export default function WelcomePage() {
  const router = useRouter();
  const videoRef = useRef<Video | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        {/* 👉 카드 없이, 비디오만 보여주기 */}
        <Video
          ref={videoRef}
          style={styles.video}
          source={require("../assets/videos/closet.mp4")}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted
        />

        <View style={styles.titleContainer}>
          <Text style={styles.title}>오늘의 패션은 무엇?</Text>
          <Text style={styles.subtitle}>
            AI가 당신의 옷장을 분석해{"\n"}
            최고의 코디를 추천해 드립니다.
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push("/(auth)/LoginPage")}
        >
          <Text style={styles.startButtonText}>시작하기</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>계정이 없으신가요? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/SignupAgreePage")}>
            <Text style={[styles.signupText, styles.signupLink]}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7F1",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  // 카드 없이, 영상만 살짝 둥글게
  video: {
    width: 260,
    height: 260,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 28,
  },

  titleContainer: {
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: "HiMelody",
    color: "#8C5A3A",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "HiMelody",
    color: "#C08E74",
    textAlign: "center",
    lineHeight: 24,
  },

  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 14,
  },
  startButton: {
    backgroundColor: "#FFB7A2",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    shadowColor: "#E2B79C",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  startButtonText: {
    color: "#5B3B2A",
    fontSize: 18,
    fontFamily: "HiMelody",
  },

  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    fontSize: 14,
    fontFamily: "HiMelody",
    color: "#B08A76",
  },
  signupLink: {
    color: "#8C5A3A",
    textDecorationLine: "underline",
  },
});
