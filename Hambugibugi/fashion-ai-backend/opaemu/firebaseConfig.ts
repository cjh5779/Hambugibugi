// firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// ⭐️ 1. Firebase Storage를 사용하기 위해 getStorage를 가져옵니다.
import { getStorage } from "firebase/storage";
// ⭐️ 2. Firestore 사용을 위해 getFirestore 추가
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAV0MsJSFiA9eEaawXFiOerhQQ4NNS9L70",
  authDomain: "hambugibugi-52466.firebaseapp.com",
  projectId: "hambugibugi-52466",
  storageBucket: "hambugibugi-52466.appspot.com",
  messagingSenderId: "176306114463",
  appId: "1:176306114463:web:c20bfc3d8892db99a0f7aa",
  measurementId: "G-SMZ5RS1PWT",
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// ⭐️ auth, storage, db 모두 export
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);   // ← 이 줄이 새로 추가된 부분
