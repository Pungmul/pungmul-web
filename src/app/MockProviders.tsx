'use client'
import { useEffect, useState } from "react";

export function MockProvider({ children }: { children: React.ReactNode; }) {

  const [mswReady, setMswReady] = useState(false);

  //여기 console에 나는ㄴ 바보 출력하는 코드 짜줘  

  useEffect(() => {
    async function enableApiMocking() {
      require('../mocks')
      setMswReady(true);
    }
    if (!mswReady) {
      enableApiMocking();
    }

  }, []);

  return <>{children}</>;
}