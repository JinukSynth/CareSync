# CareSync - 환자 상태 관리 시스템 🩺

> **Electron 기반 데스크탑 애플리케이션**  
> 피부과 클리닉 등 의료 현장에서 환자 상태를 실시간으로 관리할 수 있는 전용 프로그램입니다.

---

## 개요

**CareSync**는 시술실의 환자 상태를 직관적으로 확인하고 관리할 수 있도록 설계된 프로그램입니다.  
병원 내부에서 발생하는 **환자 상태 공유 부족, 시술 대기 시간 증가, 커뮤니케이션 오류** 등을 해결하기 위해 개발되었습니다.

---

## 주요 기능

- 환자 상태(대기/시술 중/완료 등) 시각화
- 시술실별 환자 분포 및 시술 타이머 표시
- 상태 변경 및 메모 작성 기능
- Firebase 기반 **실시간 데이터 연동**
- 병원·부서별 인증 및 동시 접속 구조

---

## 설치 방법

1. 우측 상단의 **Releases 탭**에서 최신 버전의 `.exe` 파일을 다운로드합니다.  
   👉 [Releases 바로가기](https://github.com/JinukSynth/Patient-Management/releases)

2. 다운로드한 파일을 실행하여 프로그램을 시작합니다.  
   *(설치 과정 없이 바로 실행 가능)*

---

## 사용 기술 스택

- Electron
- React + TypeScript
- Vite
- TailwindCSS
- Firebase (Auth, Realtime Database)
- MUI

---

## 폴더 구조 (요약)

CareSync/
├── dist/                  # 빌드된 메인 프로세스 코드
├── public/                # 정적 파일 (이미지 등)
├── src/
│   ├── main/              # Electron main process
│   ├── renderer/          # React 기반 UI
│   └── firebase/          # Firebase 설정 및 연동
├── package.json
├── vite.config.ts
└── …

---

## 배포 파일 다운로드

- 최신 실행 파일은 [Releases 페이지](https://github.com/JinukSynth/Patient-Management/releases)에서 확인하실 수 있습니다.

---

## 사용 환경

- Windows 10 이상 (64bit)
- 인터넷 연결 필요 (Firebase 연동용)

---

## 개발자 한마디

> 실제 병원에서 사용 중인 **CareSync**는 "기능보다 현장"을 우선하며 개발되었습니다.  
> 빠른 반응성과 실시간 동기화, 그리고 직관적인 UI를 통해 의료진의 업무 흐름을 돕는 데 집중했습니다.
