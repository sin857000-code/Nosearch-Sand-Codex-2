const STORAGE_PREFIX = "nosearch-bo";
const SHARED_DATA_PATH = "../content-data/site-content.json";
const DRAFT_BUNDLE_KEY = `${STORAGE_PREFIX}:draft-bundle`;
const PUBLISHED_BUNDLE_KEY = `${STORAGE_PREFIX}:published-bundle`;
const DRAFT_UPDATED_KEY = `${STORAGE_PREFIX}:draft-updated-at`;
const PUBLISHED_UPDATED_KEY = `${STORAGE_PREFIX}:published-updated-at`;
const PUBLISH_ENDPOINT = "../api/publish-content";

const DEFAULT_DATA = {
  submain: {
    category: "공기청정기",
    slug: "picks-air-cleaner.html",
    status: "공개",
    title: "공기청정기 노써치픽 서브메인",
    summary: "구매가이드 4줄 요약부터 픽, 가전백과, CM 히스토리, 다음 업데이트 일정까지 한 화면에서 읽히는 카테고리 서브메인입니다.",
    badge1: "현재 메인 노출 카테고리",
    badge2: "가이드 · 백과 · 일정 연결",
    badge3: "최근 수정 2026.04.27",
    summaryLine1: "10평 원룸이냐 30평 거실이냐부터 갈라야 헛돈을 안 씁니다.",
    summaryLine2: "CADR 숫자보다 자동모드 안정감과 소음 체감이 더 오래 갑니다.",
    summaryLine3: "센서 민감도와 필터값이 은근히 매달 만족도를 갈라놓습니다.",
    summaryLine4: "공기청정기는 스펙 싸움 같아 보여도 유지비와 귀 피로도가 승부를 냅니다.",
    bestPick: "LG 퓨리케어 오브제컬렉션",
    valuePick: "샤오미 스마트 에어케어",
    plusPick: "삼성 블루스카이 AI",
    premiumPick: "다이슨 빅+콰이엇",
    encyclopediaLinks: "필터 비용이 왜 픽 순위를 바꾸는가\n자동모드가 좋다는 건 정확히 뭔가\n냄새 센서가 민감하면 생기는 일",
    cmHistory: "2026.04.27 | CADR보다 자동모드 안정감이 더 중요하다는 코멘트 반영\n2026.04.24 | 필터 교체비 비교 문단 추가\n2026.04.18 | 베스트픽 후보 2종 재비교 완료",
    nextSchedule: "04.30 | 필터 비용 2차 점검\n05.03 | 저소음 모델 비교 업데이트\n05.08 | 계절성 수요 반영 재정렬"
  },
  guide: {
    category: "공기청정기",
    listTitle: "공기청정기 구매가이드",
    listSummary: "면적, CADR, 센서, 자동모드, 필터 비용까지 실제 체감에 영향을 주는 기준만 길게 풀어쓴 구매가이드입니다.",
    listStatus: "오늘 순위 변경 반영",
    linkedSubmain: "picks-air-cleaner.html",
    linkedEncyclopedia: "필터 비용 / 자동모드 / 냄새 센서",
    chapter1Title: "사용 공간과 평형",
    chapter1Body: "거실 메인이냐 방 한 칸 보조냐를 먼저 자르면 불필요한 상향 구매를 많이 막을 수 있습니다.",
    chapter2Title: "CADR과 체감 성능",
    chapter2Body: "숫자가 높아도 자동모드가 튀거나 소음이 거슬리면 실제 만족도는 쉽게 떨어집니다.",
    chapter3Title: "센서와 자동모드",
    chapter3Body: "센서 반응이 안정적인 제품이 장기 사용에서 스트레스를 훨씬 덜 줍니다.",
    chapter4Title: "필터 비용과 유지비",
    chapter4Body: "필터 교체 주기와 가격은 몇 달 뒤 픽 순위를 뒤집는 핵심 포인트입니다."
  },
  encyclopedia: {
    category: "공기청정기",
    title: "필터 비용이 왜 픽 순위를 바꾸는가",
    summary: "초기 가격보다 필터 유지비가 총비용과 만족도에 더 크게 작용하는 순간을 설명하는 가전백과 콘텐츠입니다.",
    linkedSubmain: "picks-air-cleaner.html",
    keywords: "필터 비용, 유지비, 공기청정기 소모품, 가성비",
    note: "가성비픽과 프리미엄픽의 유지비 차이를 짧게 보여주는 비교 표를 함께 넣는 방향."
  },
  wiki: {
    keyword: "공기청정기 소음",
    aliases: "자동모드 소음, 저소음 공기청정기, 야간 소음",
    primaryResult: "picks-air-cleaner.html",
    secondaryResult: "guide.html",
    tertiaryResult: "encyclopedia.html",
    rationale: "실제 사용 고민에서 가장 먼저 검색되는 표현이라 서브메인, 가이드, 백과를 순서대로 노출하는 구조가 자연스럽습니다.",
    exposure: "추천 키워드 노출"
  },
  schedule: {
    category: "공기청정기",
    status: "정상",
    nextDate: "2026-04-30",
    inLabCopy: "공기청정기 12개 모델 비교 진행 중",
    submainSummary: "4월 30일 · 필터 비용 2차 점검",
    note: "여름 전 수요 상승을 반영해서 5월 초 한 번 더 순위 재확인."
  }
};

const SECTION_SCHEMA = [
  {
    id: "home",
    label: "홈",
    store: "submain",
    previewPage: "../index.html",
    description: "메인 홈에서 카테고리 카드, 위키 유입, In The Lab 문구가 어떻게 보이는지 관리합니다.",
    noteCards: [
      "카테고리 카드는 제품이 아니라 서브메인 진입점처럼 보여야 합니다.",
      "홈은 설명이 길기보다 흐름이 분명해야 합니다. 큐레이션 → 카테고리 → 위키 순서가 중요합니다.",
      "위키와 업데이트 문구는 홈의 신선도를 보여주는 운영 신호로 사용합니다."
    ],
    groups: [
      {
        id: "home-category-card",
        title: "최근 업데이트된 카테고리 카드",
        description: "홈 카드의 제목, 소개, 메타 배지를 정리합니다.",
        fields: [
          { store: "submain", name: "category", label: "카테고리명", type: "text", help: "홈 카드와 서브메인 타이틀에 같이 쓰입니다." },
          { store: "submain", name: "title", label: "서브메인 제목", type: "text" },
          { store: "submain", name: "summary", label: "홈 소개 문구", type: "textarea", rows: 4 },
          { store: "submain", name: "badge1", label: "배지 1", type: "text" },
          { store: "submain", name: "badge2", label: "배지 2", type: "text" },
          { store: "submain", name: "badge3", label: "배지 3", type: "text" }
        ]
      },
      {
        id: "home-lab",
        title: "In The Lab / 일정",
        description: "홈의 운영 신호 문구와 일정 요약을 조정합니다.",
        fields: [
          { store: "schedule", name: "inLabCopy", label: "In The Lab 문구", type: "text" },
          { store: "schedule", name: "submainSummary", label: "홈 일정 요약", type: "text" },
          { store: "schedule", name: "note", label: "운영 메모", type: "textarea", rows: 4 }
        ]
      },
      {
        id: "home-wiki",
        title: "위키 유입",
        description: "홈 하단 위키 유입 키워드를 조정합니다.",
        fields: [
          { store: "wiki", name: "keyword", label: "대표 키워드", type: "text" },
          { store: "wiki", name: "aliases", label: "연관 키워드", type: "textarea", rows: 4 },
          { store: "wiki", name: "exposure", label: "노출 방식", type: "select", options: ["추천 키워드 노출", "검색 전용", "비노출"] }
        ]
      }
    ]
  },
  {
    id: "submain",
    label: "노써치픽 서브메인",
    store: "submain",
    previewPage: "../picks-air-cleaner.html",
    description: "카테고리별 픽 서브메인에서 4줄 요약, 대표 픽, CM 코멘트 히스토리를 편집합니다.",
    noteCards: [
      "상품 하나보다 카테고리의 판단 기준이 먼저 읽혀야 합니다.",
      "최근 변경 이유는 카드가 아니라 CM 히스토리 톤으로 유지하는 게 자연스럽습니다.",
      "다음 일정은 길게 설명하지 말고 한 줄씩 빠르게 보여주는 편이 좋습니다."
    ],
    groups: [
      {
        id: "submain-header",
        title: "상단 히어로",
        description: "카테고리명, 제목, 메타 배지, 소개 문구를 편집합니다.",
        fields: [
          { store: "submain", name: "category", label: "카테고리", type: "select", options: ["공기청정기", "노트북", "로봇청소기", "제습기"] },
          { store: "submain", name: "slug", label: "연결 파일", type: "text" },
          { store: "submain", name: "status", label: "상태", type: "select", options: ["공개", "초안", "검수중"] },
          { store: "submain", name: "title", label: "서브메인 제목", type: "text" },
          { store: "submain", name: "summary", label: "상단 소개", type: "textarea", rows: 4 },
          { store: "submain", name: "badge1", label: "배지 1", type: "text" },
          { store: "submain", name: "badge2", label: "배지 2", type: "text" },
          { store: "submain", name: "badge3", label: "배지 3", type: "text" }
        ]
      },
      {
        id: "submain-summary",
        title: "구매가이드 4줄 요약",
        description: "가이드 풀버전을 안 읽는 사람을 위한 빠른 판단 문구입니다.",
        fields: [
          { store: "submain", name: "summaryLine1", label: "4줄 요약 1", type: "text" },
          { store: "submain", name: "summaryLine2", label: "4줄 요약 2", type: "text" },
          { store: "submain", name: "summaryLine3", label: "4줄 요약 3", type: "text" },
          { store: "submain", name: "summaryLine4", label: "4줄 요약 4", type: "text" }
        ]
      },
      {
        id: "submain-picks",
        title: "대표 픽 묶음",
        description: "베스트, 가성비, 플러스, 프리미엄 픽 이름을 관리합니다.",
        fields: [
          { store: "submain", name: "bestPick", label: "베스트픽", type: "text" },
          { store: "submain", name: "valuePick", label: "가성비픽", type: "text" },
          { store: "submain", name: "plusPick", label: "플러스픽", type: "text" },
          { store: "submain", name: "premiumPick", label: "프리미엄픽", type: "text" }
        ]
      },
      {
        id: "submain-context",
        title: "백과 / 히스토리 / 일정",
        description: "관련 백과 링크, CM 히스토리, 다음 업데이트 일정을 텍스트로 정리합니다.",
        fields: [
          { store: "submain", name: "encyclopediaLinks", label: "연결 가전백과", type: "textarea", rows: 4 },
          { store: "submain", name: "cmHistory", label: "CM 업데이트 히스토리", type: "textarea", rows: 6 },
          { store: "submain", name: "nextSchedule", label: "다음 업데이트 일정", type: "textarea", rows: 4 }
        ]
      }
    ]
  },
  {
    id: "guides",
    label: "구매가이드 목록",
    store: "guide",
    previewPage: "../guides.html",
    description: "카테고리 구매가이드 목록 카드의 제목, 설명, 상태 문구를 조정합니다.",
    noteCards: [
      "목록 페이지에서는 설명을 길게 쓰기보다 어떤 기준을 다루는지 빠르게 전달하는 게 좋습니다.",
      "서브메인과 백과 연결은 가이드의 깊이를 보완하는 역할만 해야 합니다.",
      "상태 문구는 ‘오늘 순위 변경’, ‘2시간 전 업데이트’처럼 운영감이 느껴져야 합니다."
    ],
    groups: [
      {
        id: "guide-list-main",
        title: "목록 카드",
        description: "구매가이드 목록에 보이는 메인 카드 정보를 편집합니다.",
        fields: [
          { store: "guide", name: "category", label: "카테고리", type: "select", options: ["공기청정기", "노트북", "제습기"] },
          { store: "guide", name: "listTitle", label: "목록 제목", type: "text" },
          { store: "guide", name: "listSummary", label: "목록 설명", type: "textarea", rows: 4 },
          { store: "guide", name: "listStatus", label: "상태 문구", type: "text" },
          { store: "guide", name: "linkedSubmain", label: "연결 서브메인", type: "text" },
          { store: "guide", name: "linkedEncyclopedia", label: "연결 가전백과", type: "text" }
        ]
      }
    ]
  },
  {
    id: "guide",
    label: "구매가이드 상세",
    store: "guide",
    previewPage: "../guide.html",
    description: "가이드 상세 페이지의 챕터 구조와 본문 카피를 편집합니다.",
    noteCards: [
      "챕터 제목은 구매 기준을 직접적으로 설명해야 합니다.",
      "본문은 스펙 설명보다 구매 판단에 어떤 영향을 주는지 중심으로 적는 편이 좋습니다.",
      "가이드 상세는 서브메인의 4줄 요약보다 한 단계 깊은 설명이어야 합니다."
    ],
    groups: [
      {
        id: "guide-chapter-1",
        title: "챕터 1-2",
        description: "사용 공간과 핵심 성능 기준을 다루는 상단 챕터입니다.",
        fields: [
          { store: "guide", name: "chapter1Title", label: "챕터 1 제목", type: "text" },
          { store: "guide", name: "chapter1Body", label: "챕터 1 본문", type: "textarea", rows: 5 },
          { store: "guide", name: "chapter2Title", label: "챕터 2 제목", type: "text" },
          { store: "guide", name: "chapter2Body", label: "챕터 2 본문", type: "textarea", rows: 5 }
        ]
      },
      {
        id: "guide-chapter-2",
        title: "챕터 3-4",
        description: "자동모드와 유지비처럼 체감에 가까운 후반 챕터입니다.",
        fields: [
          { store: "guide", name: "chapter3Title", label: "챕터 3 제목", type: "text" },
          { store: "guide", name: "chapter3Body", label: "챕터 3 본문", type: "textarea", rows: 5 },
          { store: "guide", name: "chapter4Title", label: "챕터 4 제목", type: "text" },
          { store: "guide", name: "chapter4Body", label: "챕터 4 본문", type: "textarea", rows: 5 }
        ]
      }
    ]
  },
  {
    id: "encyclopedia",
    label: "가전백과",
    store: "encyclopedia",
    previewPage: "../encyclopedia.html",
    description: "질문형 제목과 키워드, 서브메인 연결 맥락을 편집합니다.",
    noteCards: [
      "가전백과는 검색형 질문 제목이 더 자연스럽습니다.",
      "서브메인의 픽 판단 근거를 보완하는 짧고 명확한 콘텐츠가 잘 맞습니다.",
      "키워드는 위키검색 결과와도 연결될 수 있게 실제 검색어 톤으로 적는 편이 좋습니다."
    ],
    groups: [
      {
        id: "encyclopedia-main",
        title: "백과 기본 정보",
        description: "질문형 제목, 요약, 키워드를 편집합니다.",
        fields: [
          { store: "encyclopedia", name: "category", label: "카테고리", type: "select", options: ["공기청정기", "노트북", "로봇청소기"] },
          { store: "encyclopedia", name: "title", label: "질문형 제목", type: "text" },
          { store: "encyclopedia", name: "summary", label: "요약", type: "textarea", rows: 4 },
          { store: "encyclopedia", name: "linkedSubmain", label: "연결 서브메인", type: "text" },
          { store: "encyclopedia", name: "keywords", label: "키워드", type: "textarea", rows: 4 },
          { store: "encyclopedia", name: "note", label: "편집 메모", type: "textarea", rows: 4 }
        ]
      }
    ]
  },
  {
    id: "wiki",
    label: "위키검색",
    store: "wiki",
    previewPage: "../wiki.html",
    description: "대표 검색어, 연관 검색어, 우선 노출 결과를 관리합니다.",
    noteCards: [
      "카테고리명보다 실제 검색어 형태가 더 중요합니다.",
      "결과 우선순위는 서브메인 → 가이드 → 백과 흐름이 자연스럽습니다.",
      "별칭은 줄바꿈으로 관리하면 검색 후보를 한눈에 보기에 좋습니다."
    ],
    groups: [
      {
        id: "wiki-keywords",
        title: "검색 키워드",
        description: "대표 검색어와 노출 방식을 정의합니다.",
        fields: [
          { store: "wiki", name: "keyword", label: "대표 키워드", type: "text" },
          { store: "wiki", name: "aliases", label: "별칭 키워드", type: "textarea", rows: 5 },
          { store: "wiki", name: "exposure", label: "노출 방식", type: "select", options: ["추천 키워드 노출", "검색 전용", "비노출"] }
        ]
      },
      {
        id: "wiki-results",
        title: "결과 우선순위",
        description: "검색 결과 카드 순서와 메모를 편집합니다.",
        fields: [
          { store: "wiki", name: "primaryResult", label: "1순위 결과", type: "text" },
          { store: "wiki", name: "secondaryResult", label: "2순위 결과", type: "text" },
          { store: "wiki", name: "tertiaryResult", label: "3순위 결과", type: "text" },
          { store: "wiki", name: "rationale", label: "노출 이유 메모", type: "textarea", rows: 5 }
        ]
      }
    ]
  },
  {
    id: "schedule",
    label: "업데이트 일정",
    store: "schedule",
    previewPage: "../update-schedule.html",
    description: "In The Lab과 전체 업데이트 일정 보드 문구를 관리합니다.",
    noteCards: [
      "일정은 서브메인 하단에서 빠르게 읽히는 버전과 전체 보드에서 읽히는 버전이 톤이 달라도 됩니다.",
      "상태는 정상, 모니터링, 우선 업데이트처럼 운영 우선순위가 보이게 두는 편이 좋습니다.",
      "캘린더에 들어갈 문구는 아주 짧고, 메모는 별도로 보관하는 게 보기 편합니다."
    ],
    groups: [
      {
        id: "schedule-main",
        title: "운영 일정",
        description: "카테고리별 점검일과 In The Lab 문구를 편집합니다.",
        fields: [
          { store: "schedule", name: "category", label: "카테고리", type: "select", options: ["공기청정기", "노트북", "로봇청소기", "제습기"] },
          { store: "schedule", name: "status", label: "상태", type: "select", options: ["정상", "모니터링", "우선 업데이트"] },
          { store: "schedule", name: "nextDate", label: "다음 점검일", type: "date" },
          { store: "schedule", name: "inLabCopy", label: "In The Lab 문구", type: "text" },
          { store: "schedule", name: "submainSummary", label: "서브메인 일정 요약", type: "text" },
          { store: "schedule", name: "note", label: "운영 메모", type: "textarea", rows: 4 }
        ]
      }
    ]
  }
];

let sharedData = {};
let workingBundle = {};
let currentSectionId = "home";
let currentGroupId = null;
let currentPreviewMode = "admin";
let currentDevice = "desktop";
let previewRefreshTimer = null;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function mergeBundles(base, override) {
  const bundle = clone(base || {});
  Object.keys(override || {}).forEach((store) => {
    bundle[store] = { ...(bundle[store] || {}), ...(override[store] || {}) };
  });
  return bundle;
}

function getFallbackBundle() {
  return clone(DEFAULT_DATA);
}

async function getSharedData() {
  try {
    const response = await fetch(SHARED_DATA_PATH, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load shared data: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn("Shared JSON was not loaded. Falling back to defaults.", error);
    return {};
  }
}

function readBundleFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Failed to parse bundle storage", key, error);
    return null;
  }
}

function writeBundleToStorage(key, bundle, updatedKey) {
  localStorage.setItem(key, JSON.stringify(bundle));
  localStorage.setItem(updatedKey, new Date().toISOString());
}

function formatDateTime(value) {
  if (!value) {
    return "기록 없음";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function getSectionConfig(sectionId = currentSectionId) {
  return SECTION_SCHEMA.find((section) => section.id === sectionId) || SECTION_SCHEMA[0];
}

function getGroupConfig(sectionId = currentSectionId, groupId = currentGroupId) {
  const section = getSectionConfig(sectionId);
  return section.groups.find((group) => group.id === groupId) || section.groups[0];
}

function getFieldValue(store, name) {
  return (workingBundle[store] && workingBundle[store][name]) || "";
}

function collectDirtyCount() {
  const base = mergeBundles(getFallbackBundle(), sharedData);
  return SECTION_SCHEMA.reduce((count, section) => {
    section.groups.forEach((group) => {
      group.fields.forEach((field) => {
        const currentValue = getFieldValue(field.store, field.name);
        const baseValue = (base[field.store] && base[field.store][field.name]) || "";
        if (String(currentValue) !== String(baseValue)) {
          count += 1;
        }
      });
    });
    return count;
  }, 0);
}

function setStatus(message, tone = "") {
  const target = document.querySelector("[data-workflow-status]");
  if (!target) {
    return;
  }
  target.textContent = message;
  target.classList.remove("is-success", "is-error");
  if (tone) {
    target.classList.add(tone);
  }
}

function renderMeta() {
  const draftUpdated = localStorage.getItem(DRAFT_UPDATED_KEY);
  const publishedUpdated = localStorage.getItem(PUBLISHED_UPDATED_KEY);
  const section = getSectionConfig();

  const sectionMeta = document.querySelector("[data-section-meta]");
  const draftMeta = document.querySelector("[data-draft-meta]");
  const publishedMeta = document.querySelector("[data-published-meta]");
  const dirtyCount = document.querySelector("[data-dirty-count]");

  if (sectionMeta) {
    sectionMeta.textContent = `현재 편집: ${section.label}`;
  }
  if (draftMeta) {
    draftMeta.textContent = `초안 저장: ${formatDateTime(draftUpdated)}`;
  }
  if (publishedMeta) {
    publishedMeta.textContent = `최종 발행: ${formatDateTime(publishedUpdated)}`;
  }
  if (dirtyCount) {
    dirtyCount.textContent = String(collectDirtyCount());
  }
}

function createMetaTags(section) {
  const tags = [
    section.label,
    currentPreviewMode === "admin" ? "초안 미리보기" : "발행 상태",
    section.store
  ];
  return tags.map((tag) => `<span>${tag}</span>`).join("");
}

function renderSectionList() {
  const list = document.querySelector("[data-section-list]");
  if (!list) {
    return;
  }

  list.innerHTML = SECTION_SCHEMA.map((section) => {
    const isActive = section.id === currentSectionId;
    return `
      <button type="button" class="section-item ${isActive ? "is-active" : ""}" data-section-id="${section.id}">
        <strong>${section.label}</strong>
        <p>${section.description}</p>
        <div class="item-meta">${createMetaTags(section)}</div>
      </button>
    `;
  }).join("");

  list.querySelectorAll("[data-section-id]").forEach((button) => {
    button.addEventListener("click", () => activateSection(button.dataset.sectionId));
  });
}

function renderGroupList() {
  const section = getSectionConfig();
  const list = document.querySelector("[data-group-list]");
  if (!list) {
    return;
  }

  list.innerHTML = section.groups.map((group) => `
    <button type="button" class="group-item ${group.id === currentGroupId ? "is-active" : ""}" data-group-id="${group.id}">
      <strong>${group.title}</strong>
      <p>${group.description}</p>
    </button>
  `).join("");

  list.querySelectorAll("[data-group-id]").forEach((button) => {
    button.addEventListener("click", () => activateGroup(button.dataset.groupId));
  });
}

function renderPreviewMeta() {
  const section = getSectionConfig();
  const title = document.querySelector("[data-preview-title]");
  const description = document.querySelector("[data-preview-description]");
  const inspectorTitle = document.querySelector("[data-inspector-title]");
  const inspectorDescription = document.querySelector("[data-inspector-description]");
  const noteList = document.querySelector("[data-note-list]");

  if (title) {
    title.textContent = section.label;
  }
  if (description) {
    description.textContent = section.description;
  }
  if (inspectorTitle) {
    inspectorTitle.textContent = section.label;
  }
  if (inspectorDescription) {
    inspectorDescription.textContent = `${section.label}에서 지금 필요한 필드만 그룹별로 관리합니다.`;
  }
  if (noteList) {
    noteList.innerHTML = section.noteCards.map((note) => `
      <article class="note-card">
        <strong>${section.label} 편집 팁</strong>
        <p>${note}</p>
      </article>
    `).join("");
  }
}

function createFieldInput(field) {
  const value = getFieldValue(field.store, field.name);
  const safeValue = String(value || "");
  const help = field.help ? `<div class="field-help">${field.help}</div>` : "";

  if (field.type === "textarea") {
    return `
      <label for="${field.store}-${field.name}">${field.label}</label>
      <textarea id="${field.store}-${field.name}" data-store="${field.store}" name="${field.name}" rows="${field.rows || 4}">${safeValue}</textarea>
      ${help}
    `;
  }

  if (field.type === "select") {
    const options = (field.options || []).map((option) => `
      <option value="${option}" ${option === safeValue ? "selected" : ""}>${option}</option>
    `).join("");
    return `
      <label for="${field.store}-${field.name}">${field.label}</label>
      <select id="${field.store}-${field.name}" data-store="${field.store}" name="${field.name}">
        ${options}
      </select>
      ${help}
    `;
  }

  return `
    <label for="${field.store}-${field.name}">${field.label}</label>
    <input id="${field.store}-${field.name}" data-store="${field.store}" name="${field.name}" type="${field.type || "text"}" value="${safeValue}" />
    ${help}
  `;
}

function renderGroupTabs() {
  const section = getSectionConfig();
  const tabs = document.querySelector("[data-group-tabs]");
  if (!tabs) {
    return;
  }

  tabs.innerHTML = section.groups.map((group) => `
    <button type="button" class="group-tab ${group.id === currentGroupId ? "is-active" : ""}" data-group-tab="${group.id}">
      ${group.title}
    </button>
  `).join("");

  tabs.querySelectorAll("[data-group-tab]").forEach((button) => {
    button.addEventListener("click", () => activateGroup(button.dataset.groupTab));
  });
}

function bindDynamicFields() {
  document.querySelectorAll("[data-store][name]").forEach((field) => {
    field.addEventListener("input", () => {
      const store = field.dataset.store;
      if (!workingBundle[store]) {
        workingBundle[store] = {};
      }
      workingBundle[store][field.name] = field.value.trim();
      renderMeta();
      setStatus("초안에 반영할 변경사항이 있습니다.");
      schedulePreviewRefresh();
    });
  });
}

function renderGroupPanel() {
  const panel = document.querySelector("[data-group-panel]");
  const group = getGroupConfig();
  if (!panel || !group) {
    return;
  }

  panel.innerHTML = `
    <div class="group-header">
      <strong>${group.title}</strong>
      <p>${group.description}</p>
    </div>
    ${group.fields.map((field) => `<div class="field-card">${createFieldInput(field)}</div>`).join("")}
  `;

  bindDynamicFields();
}

function refreshPreview() {
  const frame = document.getElementById("previewFrame");
  const section = getSectionConfig();
  if (!frame || !section) {
    return;
  }

  const query = currentPreviewMode === "admin" ? "preview=admin" : "preview=published-local";
  frame.src = `${section.previewPage}?${query}&ts=${Date.now()}`;
}

function schedulePreviewRefresh() {
  clearTimeout(previewRefreshTimer);
  previewRefreshTimer = setTimeout(() => {
    if (currentPreviewMode === "admin") {
      writeBundleToStorage(DRAFT_BUNDLE_KEY, workingBundle, DRAFT_UPDATED_KEY);
      refreshPreview();
      renderMeta();
    }
  }, 300);
}

function setDevice(device) {
  currentDevice = device;
  document.querySelectorAll("[data-device]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.device === device);
  });
  const stage = document.querySelector(".preview-stage");
  if (stage) {
    stage.setAttribute("data-device-frame", device);
  }
}

function activateGroup(groupId) {
  currentGroupId = groupId;
  renderGroupList();
  renderGroupTabs();
  renderGroupPanel();
}

function activateSection(sectionId) {
  const section = getSectionConfig(sectionId);
  currentSectionId = section.id;
  currentGroupId = section.groups[0] && section.groups[0].id;
  renderSectionList();
  renderGroupList();
  renderPreviewMeta();
  renderGroupTabs();
  renderGroupPanel();
  renderMeta();
  refreshPreview();
}

function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function bindHeaderActions() {
  document.querySelector("[data-action='save-draft']")?.addEventListener("click", () => {
    writeBundleToStorage(DRAFT_BUNDLE_KEY, workingBundle, DRAFT_UPDATED_KEY);
    setStatus(`초안 저장 완료 · ${formatDateTime(localStorage.getItem(DRAFT_UPDATED_KEY))}`, "is-success");
    renderMeta();
    if (currentPreviewMode === "admin") {
      refreshPreview();
    }
  });

  document.querySelector("[data-action='preview-admin']")?.addEventListener("click", () => {
    writeBundleToStorage(DRAFT_BUNDLE_KEY, workingBundle, DRAFT_UPDATED_KEY);
    currentPreviewMode = "admin";
    document.querySelectorAll("[data-preview-mode]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.previewMode === "admin");
    });
    setStatus("관리자용 미리보기로 전환했습니다.");
    refreshPreview();
  });

  document.querySelector("[data-action='publish-local']")?.addEventListener("click", () => {
    writeBundleToStorage(DRAFT_BUNDLE_KEY, workingBundle, DRAFT_UPDATED_KEY);
    writeBundleToStorage(PUBLISHED_BUNDLE_KEY, workingBundle, PUBLISHED_UPDATED_KEY);
    currentPreviewMode = "published-local";
    document.querySelectorAll("[data-preview-mode]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.previewMode === "published-local");
    });
    setStatus(`최종 발행 상태로 반영했습니다 · ${formatDateTime(localStorage.getItem(PUBLISHED_UPDATED_KEY))}`, "is-success");
    renderMeta();
    refreshPreview();
  });

  document.querySelector("[data-action='publish-github']")?.addEventListener("click", async () => {
    writeBundleToStorage(DRAFT_BUNDLE_KEY, workingBundle, DRAFT_UPDATED_KEY);
    writeBundleToStorage(PUBLISHED_BUNDLE_KEY, workingBundle, PUBLISHED_UPDATED_KEY);
    renderMeta();

    const publishSecret = document.querySelector("[data-publish-secret]")?.value.trim() || "";
    setStatus("GitHub 발행 요청을 보내는 중입니다.");

    try {
      const response = await fetch(PUBLISH_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          ...(publishSecret ? { "x-backoffice-secret": publishSecret } : {})
        },
        body: JSON.stringify({
          bundle: workingBundle,
          commitMessage: "Publish site content from backoffice"
        })
      });

      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result && result.error ? result.error : "GitHub publish failed.");
      }

      const commitUrl = result.commit && result.commit.html_url ? result.commit.html_url : "";
      setStatus(
        commitUrl ? `GitHub 발행 완료 · ${result.commit.sha.slice(0, 7)}` : "GitHub 발행 완료",
        "is-success"
      );

      if (commitUrl) {
        window.open(commitUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error(error);
      setStatus(`GitHub 발행 실패 · ${error.message}`, "is-error");
    }
  });

  document.querySelector("[data-action='export-bundle']")?.addEventListener("click", () => {
    downloadJson("site-content.json", workingBundle);
    setStatus("발행용 site-content.json을 내보냈습니다.", "is-success");
  });

  document.querySelector("[data-action='reset-published']")?.addEventListener("click", () => {
    const publishedBundle = readBundleFromStorage(PUBLISHED_BUNDLE_KEY);
    workingBundle = publishedBundle
      ? mergeBundles(mergeBundles(getFallbackBundle(), sharedData), publishedBundle)
      : mergeBundles(getFallbackBundle(), sharedData);
    setStatus("현재 초안을 마지막 발행 상태 기준으로 되돌렸습니다.");
    renderMeta();
    renderGroupPanel();
    if (currentPreviewMode === "admin") {
      refreshPreview();
    }
  });

  document.querySelectorAll("[data-preview-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      currentPreviewMode = button.dataset.previewMode;
      document.querySelectorAll("[data-preview-mode]").forEach((item) => {
        item.classList.toggle("is-active", item.dataset.previewMode === currentPreviewMode);
      });
      setStatus(currentPreviewMode === "admin" ? "관리자용 미리보기로 전환했습니다." : "발행 상태 미리보기로 전환했습니다.");
      refreshPreview();
    });
  });

  document.querySelectorAll("[data-device]").forEach((button) => {
    button.addEventListener("click", () => setDevice(button.dataset.device));
  });

  document.querySelector("[data-action='refresh-preview']")?.addEventListener("click", () => {
    refreshPreview();
    setStatus("프리뷰를 새로고침했습니다.");
  });

  document.querySelector("[data-action='open-preview']")?.addEventListener("click", () => {
    const section = getSectionConfig();
    const query = currentPreviewMode === "admin" ? "preview=admin" : "preview=published-local";
    window.open(`${section.previewPage}?${query}`, "_blank", "noopener,noreferrer");
  });
}

async function init() {
  sharedData = mergeBundles(getFallbackBundle(), await getSharedData());
  const draftBundle = readBundleFromStorage(DRAFT_BUNDLE_KEY);
  workingBundle = draftBundle ? mergeBundles(sharedData, draftBundle) : sharedData;

  bindHeaderActions();
  setDevice(currentDevice);
  activateSection(currentSectionId);
  renderMeta();
}

document.addEventListener("DOMContentLoaded", init);
