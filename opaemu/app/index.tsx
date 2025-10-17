// app/index.tsx

import React from 'react';
import BootScreen from '../components/BootScreen'; // BootScreen 컴포넌트를 사용

/**
 * 이 페이지는 앱의 시작점으로, 로딩 화면(스플래시 스크린)의 역할을 합니다.
 * 실제 페이지 이동(리디렉션) 로직은 app/_layout.tsx 에서 모두 처리합니다.
 */
export default function Index() {
  // BootScreen 컴포넌트만 보여주고 아무 작업도 하지 않습니다.
  return <BootScreen />;
}