export declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
      // 필요한 다른 메서드들 추가 가능
    };
    Firebug?: {
      chrome?: {
        isInitialized?: boolean;
      };
    };
  }

  type ClubName = "어흥" | "떼" | "하날다래" | "악반" | "푸른소래" | "산틀";  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type KakaoMap = any;

  type PostReportType =
    | "INCITING_TROUBLE"
    | "PORNOGRAPHY"
    | "SPAM"
    | "DEFAMATION"
    | "OFF_TOPIC"
    | "OTHER";
    
  type CommentReportType =
    | "INCITING_TROUBLE"
    | "PORNOGRAPHY"
    | "SPAM"
    | "DEFAMATION"
    | "OFF_TOPIC"
    | "OTHER";

  // INCITING_TROUBLE: 분란 조장
  // PORNOGRAPHY: 음란물
  // SPAM: 도배
  // DEFAMATION: 특정인 비방
  // OFF_TOPIC: 주제에 맞지 않는 게시물
  // OTHER: 기타x
}

declare module "nprogress" {
  interface NProgress {
    start: () => NProgress;
    done: (force?: boolean) => NProgress;
    set: (n: number) => NProgress;
    inc: (amount?: number) => NProgress;
    configure: (options: Partial<NProgressConfigureOptions>) => NProgress;
    status: null | number;
  }

  interface NProgressConfigureOptions {
    minimum: number;
    easing: string;
    speed: number;
    trickle: boolean;
    trickleSpeed: number;
    showSpinner: boolean;
  }

  const nprogress: NProgress;
  export default nprogress;
}

declare module "*.svg" {
  import React from "react";
  const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}