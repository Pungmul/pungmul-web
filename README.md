## 풍물 커뮤니티티 (Pungmul Web)
풍물패를 위한 소셜 플랫폼 **웹 애플리케이션**



<details>
<summary><h3 style="color:rgb(124, 211, 255);">프로젝트 관련 블로그 글 모음 (클릭하여 열기/닫기)</h3></summary>

- [브라우저의 너비에 맞는 컴포넌트 분기](https://almondine-hibiscus-9bf.notion.site/244f7b6d2d0f809a9919febb369c9924)
- [React use API를 통해 유용한 Suspense처리하기](https://almondine-hibiscus-9bf.notion.site/React-use-API-Suspense-240f7b6d2d0f80eea727c3b78fc9826e)
- [SharedWorker로 하나의 웹소켓 공유하기](https://almondine-hibiscus-9bf.notion.site/SharedWorker-244f7b6d2d0f80f58074d0d6d1624085)

</details>

## 1. 서비스 소개

풍물 커뮤니티는 풍물패를 위한 소셜 플랫폼입니다. 풍물패원들이 서로 소통하고, 번개 모임을 만들고, 게시판을 통해 정보를 공유할 수 있는 웹 서비스입니다.

**주요 기능:**
- **번개 모임**: 실시간 위치 기반 번개 모임 생성 및 참여
- **게시판**: 자유게시판, 공지사항 등 다양한 게시판
- **채팅**: 실시간 채팅 기능
- **친구 관리**: 친구 추가, 요청 관리
- **알림 시스템**: 실시간 알림 및 푸시 알림
- **위치 기반 서비스**: 근처 번개 모임 찾기

<br/><br/>

## 2. 사용 스택

<div align="left">
<div>
<img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white">
<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black">
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white">
</div>
<div>
<img src="https://img.shields.io/badge/Zustand-764ABC?style=flat-square&logo=zustand&logoColor=white">
<img src="https://img.shields.io/badge/React_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white">
<img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white">
</div>
</div>

<br/><br/>

## 3. 아키텍처

이 프로젝트는 **Feature-Based Atomic Design** 아키텍처를 기반으로 구성되어 있습니다.

```bash
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 관련 페이지
│   ├── (main)/            # 메인 페이지들
│   ├── globals.css        # 전역 스타일
│   └── layout.tsx         # 루트 레이아웃
├── features/              # 비즈니스 기능
│   ├── auth/              # 인증 기능
│   ├── board/             # 게시판 기능
│   ├── chat/              # 채팅 기능
│   ├── friends/           # 친구 관리 기능
│   ├── lightning/         # 번개 모임 기능
│   ├── location/          # 위치 기반 기능
│   ├── my-page/           # 마이페이지 기능
│   └── notification/      # 알림 기능
├── shared/                # 공통 모듈
│   ├── components/        # 공통 컴포넌트
│   ├── constants/         # 상수
│   ├── lib/               # 유틸리티 함수
│   └── types/             # 타입 정의
└── core/                  # 핵심 모듈
    ├── api/               # API 관련
    ├── config/            # 설정
    ├── providers/         # 프로바이더
    └── socket/            # 소켓 관리
```

<br/><br/>

## 4. 주요 기능

### 인증 시스템
- 로그인/로그아웃
- 회원가입
- 자동 로그인
- 토큰 관리

### 번개 모임
- 실시간 위치 기반 번개 모임 생성
- 번개 모임 참여/퇴장
- 카카오맵 연동
- 실시간 소켓 통신

### 게시판 시스템
- 자유게시판, 공지사항 등
- 게시글 작성/수정/삭제
- 댓글 시스템
- 무한 스크롤

### 채팅 시스템
- 실시간 채팅
- 개인 채팅방
- 그룹 채팅방
- 친구 선택 모달

### 친구 관리
- 친구 검색
- 친구 요청/수락/거절
- 친구 목록 관리

### 위치 기반 서비스
- 현재 위치 기반 번개 모임 찾기
- 위치 업데이트
- 근처 번개 모임 추천

### 알림 시스템
- 실시간 알림
- 푸시 알림
- 읽지 않은 알림 관리

### 기타 기능
- 반응형 디자인
- 다크모드 지원
- 실시간 소켓 통신
- 이미지 업로드

<br/><br/>

### 코드 스타일
- TypeScript 사용
- ESLint + Prettier 적용
- FSD 아키텍처 준수
- Tailwind CSS 사용

### 상태 관리
- **Zustand**: 클라이언트 상태 관리
- **React Query**: 서버 상태 관리
- **stomp.js, SockJS**: 실시간 통신

<br/><br/>

## 5. 배포

이 프로젝트는 Vercel을 통해 배포됩니다.

배포 주소: https://pungmul-web.vercel.app

<br/><br/>

## 6. 참여자

<table>
  <tr align="center">
    <td>
      FE, UI•UX
    </td>
  </tr>
  <tr align="center">
    <td>
      <a href="https://github.com/Wide-Pants">
        <img src="https://github.com/Wide-Pants.png?size=100"/>
      </a>
      <br>
      <a href="https://github.com/Wide-Pants">강윤호@Wide-Pants</a>
    </td>
  </tr>
</table>

<br/><br/>
