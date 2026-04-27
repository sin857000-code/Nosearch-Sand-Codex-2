const STORAGE_PREFIX = "nosearch-bo";
const SHARED_DATA_PATH = "../content-data/site-content.json";

const DEFAULT_DATA = {
  submain: {
    category: "공기청정기",
    slug: "picks-air-cleaner.html",
    status: "공개",
    title: "공기청정기 노써치픽 서브메인",
    summary:
      "구매가이드 4줄 요약부터 픽, 가전백과, CM 히스토리, 다음 업데이트 일정까지 한 화면에서 읽히는 카테고리 서브메인입니다.",
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
    cmHistory:
      "2026.04.27 | CADR보다 자동모드 안정감이 더 중요하다는 코멘트 반영\n2026.04.24 | 필터 교체비 비교 문단 추가\n2026.04.18 | 베스트픽 후보 2종 재비교 완료",
    nextSchedule: "04.30 | 필터 비용 2차 점검\n05.03 | 저소음 모델 비교 업데이트\n05.08 | 계절성 수요 반영 재정렬"
  },
  guide: {
    category: "공기청정기",
    listTitle: "공기청정기 구매가이드",
    listSummary:
      "면적, CADR, 센서, 자동모드, 필터 비용까지 실제 체감에 영향을 주는 기준만 길게 풀어쓴 구매가이드입니다.",
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
    summary:
      "초기 가격보다 필터 유지비가 총비용과 만족도에 더 크게 작용하는 순간을 설명하는 가전백과 콘텐츠입니다.",
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
    rationale:
      "실제 사용 고민에서 가장 먼저 검색되는 표현이라 서브메인, 가이드, 백과를 순서대로 노출하는 구조가 자연스럽습니다.",
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

function storageKey(store) {
  return `${STORAGE_PREFIX}:${store}`;
}

function getStoreData(store, sharedData = {}) {
  const fallback = {
    ...structuredClone(DEFAULT_DATA[store] || {}),
    ...(sharedData[store] || {})
  };
  try {
    const raw = localStorage.getItem(storageKey(store));
    if (!raw) {
      return fallback;
    }
    return { ...fallback, ...JSON.parse(raw) };
  } catch (error) {
    console.error("Failed to parse storage data", store, error);
    return fallback;
  }
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

function setStoreData(store, data) {
  localStorage.setItem(storageKey(store), JSON.stringify(data));
  localStorage.setItem(`${storageKey(store)}:updatedAt`, new Date().toISOString());
}

function getUpdatedAt(store) {
  return localStorage.getItem(`${storageKey(store)}:updatedAt`);
}

function formatDateTime(value) {
  if (!value) {
    return "아직 저장 기록이 없습니다.";
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

function fillForm(form, data) {
  const fields = form.querySelectorAll("[name]");
  fields.forEach((field) => {
    const value = data[field.name];
    if (typeof value === "undefined") {
      return;
    }
    if (field.type === "checkbox") {
      field.checked = Boolean(value);
      return;
    }
    field.value = value;
  });
}

function collectForm(form) {
  const payload = {};
  form.querySelectorAll("[name]").forEach((field) => {
    if (field.type === "checkbox") {
      payload[field.name] = field.checked;
      return;
    }
    payload[field.name] = field.value.trim();
  });
  return payload;
}

function setSaveStatus(scope, message, type = "") {
  const target = scope.querySelector("[data-save-status]");
  if (!target) {
    return;
  }
  target.textContent = message;
  target.classList.remove("is-success", "is-error");
  if (type) {
    target.classList.add(type);
  }
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

function buildBundle(sharedData = {}) {
  return Object.keys(DEFAULT_DATA).reduce((acc, store) => {
    acc[store] = getStoreData(store, sharedData);
    return acc;
  }, {});
}

async function initEditorPage(sharedData) {
  const form = document.querySelector("[data-editor-form]");
  if (!form) {
    return;
  }

  const store = document.body.dataset.store;
  if (!store) {
    return;
  }

  fillForm(form, getStoreData(store, sharedData));
  setSaveStatus(document, `마지막 저장: ${formatDateTime(getUpdatedAt(store))}`);

  const saveButton = document.querySelector("[data-save]");
  if (saveButton) {
    saveButton.addEventListener("click", () => {
      try {
        const payload = collectForm(form);
        setStoreData(store, payload);
        setSaveStatus(document, `저장 완료 · ${formatDateTime(getUpdatedAt(store))}`, "is-success");
      } catch (error) {
        console.error(error);
        setSaveStatus(document, "저장 중 오류가 발생했습니다.", "is-error");
      }
    });
  }

  const resetButton = document.querySelector("[data-reset]");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      fillForm(form, DEFAULT_DATA[store]);
      setSaveStatus(document, "샘플 데이터로 다시 채웠습니다. 저장하면 반영됩니다.");
    });
  }

  const exportButton = document.querySelector("[data-export]");
  if (exportButton) {
    exportButton.addEventListener("click", () => {
      downloadJson(`${store}.json`, collectForm(form));
      setSaveStatus(document, "현재 폼 값을 JSON으로 내보냈습니다.", "is-success");
    });
  }
}

async function initDashboard(sharedData) {
  const dashboard = document.querySelector("[data-dashboard]");
  if (!dashboard) {
    return;
  }

  dashboard.querySelectorAll("[data-dashboard-store]").forEach((card) => {
    const store = card.dataset.dashboardStore;
    const data = getStoreData(store, sharedData);
    const updated = getUpdatedAt(store);
    const summaryField = card.dataset.summaryField;
    const titleField = card.dataset.titleField;
    const dateTarget = card.querySelector("[data-updated-at]");
    const summaryTarget = card.querySelector("[data-summary]");
    const titleTarget = card.querySelector("[data-title]");

    if (dateTarget) {
      dateTarget.textContent = formatDateTime(updated);
    }
    if (summaryTarget && summaryField) {
      summaryTarget.textContent = data[summaryField] || "-";
    }
    if (titleTarget && titleField) {
      titleTarget.textContent = data[titleField] || "-";
    }
  });

  const exportBundleButton = document.querySelector("[data-export-bundle]");
  if (exportBundleButton) {
    exportBundleButton.addEventListener("click", () => {
      downloadJson("site-content.json", buildBundle(sharedData));
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const sharedData = await getSharedData();
  initEditorPage(sharedData);
  initDashboard(sharedData);
});
