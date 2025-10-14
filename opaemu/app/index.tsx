// app/index.tsx

import { useRouter } from "expo-router";
import { useEffect } from "react";
import BootScreen from "../components/BootScreen"; // BootScreen 컴포넌트 경로는 실제 프로젝트에 맞게 확인해주세요.

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const prepare = async () => {
      // 여기에 미리 불러올 작업들(api 프리페치, 스토리지 읽기 등)을 넣을 수 있습니다.
      setTimeout(() => {
        // '/chat'은 app/chat.tsx 파일을 의미합니다.
        router.replace("/chat"); 
      }, 1200); // 로딩 화면을 보여주기 위한 딜레이 (원하면 제거 가능)
    };
    prepare();
  }, [router]);

  return <BootScreen />;
}