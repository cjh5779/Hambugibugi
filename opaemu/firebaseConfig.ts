// firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// ⭐️ 1. Firebase Storage를 사용하기 위해 getStorage를 가져옵니다.
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAV0MsJSFiA9eEaawXFiOerhQQ4NNS9L70",
  authDomain: "hambugibugi-52466.firebaseapp.com",
  projectId: "hambugibugi-52466",
  storageBucket: "hambugibugi-52466.appspot.com",
  messagingSenderId: "176306114463",
  appId: "1:176306114463:web:c20bfc3d8892db99a0f7aa",
  measurementId: "G-SMZ5RS1PWT"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// ⭐️ 2. auth와 storage 객체를 모두 생성하고 내보냅니다.
export const auth = getAuth(app);
export const storage = getStorage(app); // Storage 서비스 초기화