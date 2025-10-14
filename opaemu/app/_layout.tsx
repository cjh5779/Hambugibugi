// app/_layout.tsx

import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        // 모든 화면의 기본 헤더를 숨깁니다.
        headerShown: false, 
      }}
    >
      {/* 아래와 같이 개별적으로 스크린을 선언할 필요 없이,
        app 폴더에 있는 파일들이 자동으로 스크린으로 인식됩니다.
        'initialRouteName'도 기본적으로 'index' 파일로 설정됩니다.
      */}
      <Stack.Screen name="index" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="LoginPage" />
      <Stack.Screen name="SignupAgreePage" />
      <Stack.Screen name="SignupIdPage" />
      <Stack.Screen name="SignupPasswordPage" />
    </Stack>
  );
}