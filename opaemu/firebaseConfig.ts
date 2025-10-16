// firebaseConfig.ts

import { initializeApp } from "firebase/app";
// ⭐️ getAnalytics 대신 getAuth를 가져옵니다.
import { getAuth } from "firebase/auth";

// ⭐️ Firebase 콘솔에서 복사한 설정 값은 그대로 사용합니다.
const firebaseConfig = {
  apiKey: "AIzaSyAV0MsJSFiA9eEaawXFiOerhQQ4NNS9L70",
  authDomain: "hambugibugi-52466.firebaseapp.com",
  projectId: "hambugibugi-52466",
  storageBucket: "hambugibugi-52466.appspot.com", // 'firebasestorage.app' -> 'appspot.com' 이 맞습니다.
  messagingSenderId: "176306114463",
  appId: "1:176306114463:web:c20bfc3d8892db99a0f7aa",
  measurementId: "G-SMZ5RS1PWT"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// ⭐️ 다른 파일에서 로그인 기능을 사용할 수 있도록 auth 객체를 내보냅니다.
export const auth = getAuth(app);