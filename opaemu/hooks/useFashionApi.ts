// hooks/useFashionApi.ts
import { API_BASE_URL } from "../constants/api";

// ✅ chat_api.py의 /healthz 사용
export async function checkHealth() {
  const res = await fetch(`${API_BASE_URL}/healthz`);
  if (!res.ok) {
    throw new Error("서버 응답이 정상이 아님");
  }
  return res.json();
}

// ✅ 이미지를 /v1/chat으로 보내서 분석 + 패션 조언까지 받기
export async function uploadImage(fileUri: string) {
  const formData = new FormData();

  formData.append("file", {
    uri: fileUri,
    name: "image.jpg",
    type: "image/jpeg",
  } as any);

  const res = await fetch(`${API_BASE_URL}/v1/chat`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`서버 에러 (status: ${res.status})`);
  }

  // chat_api.py의 응답 형식:
  // { ai_analysis: {...}, fashion_advice: {...} }
  const data = await res.json();
  return data;
}
