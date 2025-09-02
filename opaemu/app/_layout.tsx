import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // 기본 헤더 숨김 (탭에서만 관리)
      }}
    />
  );
}
