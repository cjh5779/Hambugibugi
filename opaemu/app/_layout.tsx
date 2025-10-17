// app/_layout.tsx

import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebaseConfig";
import BootScreen from "../components/BootScreen";

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setTimeout(() => {
        setUser(currentUser);
        setInitializing(false);
      }, 3000); 
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isWelcomePage = segments[0] === 'WelcomePage';

    if (user && (inAuthGroup || isWelcomePage)) {
      router.replace('/chat');
    } else if (!user && !inAuthGroup && !isWelcomePage) {
      router.replace('/WelcomePage'); 
    }
  }, [user, segments, initializing, router]);

  if (initializing) {
    return <BootScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="chat" />
      <Stack.Screen name="MyProfilePage" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="WelcomePage" /> 
      <Stack.Screen name="SettingsPage" />
    </Stack>
  );
}

export default function RootLayout() {
  return <RootLayoutNav />;
}