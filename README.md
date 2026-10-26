# Life of Paradise (AMITA Karma Insurance)

Claude Artifacts에서 만든 단일 HTML 파일을 실제 배포 가능한 정적 웹 프로젝트로 분리한 결과물입니다.

## 코드 분석 요약

- **프레임워크 없음**: React/Vue 등 라이브러리 의존성이 전혀 없는 순수 HTML + CSS + Vanilla JS(ES5) 프로젝트입니다.
- **외부 의존성**: Google Fonts(`Bodoni Moda`)만 CDN으로 로드합니다. npm 패키지 의존성은 없습니다.
- **구조**: intro(인트로) → cases(사례 아카이브, 4개 패널) → about(소개) 3개의 "뷰"를 `hidden` 속성과 `history.pushState`로 전환하는 SPA 형태입니다.
- **원본 index.html(914KB)**은 8개의 webp 이미지가 base64로 인라인되어 있어 용량이 컸습니다. 이번 작업에서 모두 실제 이미지 파일로 분리했습니다(기능·디자인 변경 없음).

## 폴더 구조

```
index.html          메인 HTML (뷰 3개: intro / archive / about)
css/style.css        전체 디자인 시스템 CSS (색상, 레이아웃, 애니메이션)
js/main.js           뷰 전환, 영상 재생/일시정지, 언어 토글, 커스텀 커서 로직
img/
  about.jpg          About 섹션 배경
  case/              4개 사례(human/beast) webp 이미지 8장 (base64에서 추출)
videos/
  intro-bg.mp4/.webm/.jpg   인트로 배경 영상 (이미 포함됨)
  munjingui.mp4, bokyongsu.mp4, jeonpajo.mp4, chwaryeongma.mp4
                     4개 사례 영상 자리 — 아직 파일이 없어도 에러 없이
                     포스터 이미지로 자연스럽게 대체됩니다(원본 동작 유지).
```

## 유지된 기능/인터랙션

- 인트로 배경 영상 자동재생·반복재생·음소거(`autoplay muted loop playsinline`)
- 사례 패널 hover 시 미리보기 영상 자동재생(muted), 클릭 시 전체화면으로 열리며 음소거 해제 후 1회 재생
- 패널 hover 애니메이션(사람→짐승 전환), 커스텀 커서, intro/about/archive 간 전환 애니메이션, 브라우저 뒤로가기 연동
- 언어 토글(한글/영문), 모든 버튼 기능 100% 동일

## 100MB 이상 MP4 영상 연결 방법

`videos/` 폴더에 파일명을 그대로 넣기만 하면 됩니다 (예: `videos/munjingui.mp4`).
`data-film` 속성 값과 파일명이 일치해야 합니다.

대용량 파일 때문에 Git 저장소가 무거워지는 걸 피하려면 두 가지 방법이 있습니다.

1. **Git LFS 사용** (Vercel이 Git LFS를 지원)
   ```bash
   git lfs install
   git lfs track "*.mp4" "*.webm"   # .gitattributes에 이미 설정됨
   git add .gitattributes videos/*.mp4
   git commit -m "add scenario videos via LFS"
   ```
2. **외부 CDN/스토리지 사용** (추천: 100MB가 훨씬 넘는 경우)
   영상을 Cloudflare R2, AWS S3+CloudFront, Bunny Stream 등에 올린 뒤,
   `index.html`의 해당 `data-film` 값을 전체 URL로 바꾸면 됩니다.
   ```html
   <li class="panel" data-i="0" data-film="https://cdn.example.com/munjingui.mp4">
   ```
   `js/main.js`가 `data-film`이 `http(s)://`로 시작하면 그대로 사용하고,
   아니면 `videos/파일명.mp4`로 자동 조합하도록 이미 수정되어 있습니다.

## 로컬에서 실행하기

```bash
npm install
npm run dev
# http://localhost:3000 접속
```

(브라우저가 `file://`로 직접 열면 영상 자동재생/모듈 로딩이 막힐 수 있어 반드시 로컬 서버로 실행하세요.)

## Vercel 배포

1. 이 폴더를 GitHub 저장소로 push (영상이 크면 위의 Git LFS 방법 사용)
2. [vercel.com](https://vercel.com)에서 저장소 Import → Framework Preset: **Other** (빌드 명령 없음, Output Directory: 루트)
3. `vercel.json`에 영상/이미지 장기 캐싱 헤더가 이미 설정되어 있어 그대로 배포하면 됩니다.

CLI로 배포하려면:
```bash
npm i -g vercel
vercel        # 미리보기 배포
vercel --prod # 프로덕션 배포
```
