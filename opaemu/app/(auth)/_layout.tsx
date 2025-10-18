// app/(auth)/_layout.tsx

import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginPage" />
      <Stack.Screen name="SignupAgreePage" />
      <Stack.Screen name="SignupEmailPage" /> 
      <Stack.Screen name="SignupPasswordPage" />
      <Stack.Screen name="ForgotPasswordPage" />
    </Stack>
  );
}