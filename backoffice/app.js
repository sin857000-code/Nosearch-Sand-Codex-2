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

const PREVIEW_PAGE_BY_SECTION = {
  home: "../index.html",
  submain: "../picks-air-cleaner.html",
  guides: "../guides.html",
  guide: "../guide.html",
  encyclopedia: "../encyclopedia.html",
  wiki: "../wiki.html",
  schedule: "../update-schedule.html"
};

let sharedData = {};
let workingBundle = {};
let currentSection = "home";
let currentPreviewMode = "admin";
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

function populateFields(bundle) {
  document.querySelectorAll("[data-store][name]").forEach((field) => {
    const store = field.dataset.store;
    const value = bundle?.[store]?.[field.name];
    if (typeof value === "undefined") {
      return;
    }
    field.value = value;
  });
}

function collectBundleFromFields() {
  const nextBundle = mergeBundles(getFallbackBundle(), sharedData);
  document.querySelectorAll("[data-store][name]").forEach((field) => {
    const store = field.dataset.store;
    nextBundle[store] = nextBundle[store] || {};
    nextBundle[store][field.name] = field.value.trim();
  });
  return nextBundle;
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

function updateMetaChips() {
  const draftUpdated = localStorage.getItem(DRAFT_UPDATED_KEY);
  const publishedUpdated = localStorage.getItem(PUBLISHED_UPDATED_KEY);
  const draftMeta = document.querySelector("[data-draft-meta]");
  const publishedMeta = document.querySelector("[data-published-meta]");
  const sectionMeta = document.querySelector("[data-section-meta]");
  if (draftMeta) {
    draftMeta.textContent = `초안 저장: ${formatDateTime(draftUpdated)}`;
  }
  if (publishedMeta) {
    publishedMeta.textContent = `최종 발행: ${formatDateTime(publishedUpdated)}`;
  }
  if (sectionMeta) {
    sectionMeta.textContent = `현재 편집: ${document.querySelector(`[data-section-tab="${currentSection}"]`)?.textContent || "-"}`;
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

function refreshPreview() {
  const frame = document.getElementById("previewFrame");
  if (!frame) {
    return;
  }
  const basePath = PREVIEW_PAGE_BY_SECTION[currentSection] || "../index.html";
  const query = currentPreviewMode === "admin" ? "preview=admin" : currentPreviewMode === "published-local" ? "preview=published-local" : "";
  frame.src = query ? `${basePath}?${query}&ts=${Date.now()}` : `${basePath}?ts=${Date.now()}`;
}

function schedulePreviewRefresh() {
  clearTimeout(previewRefreshTimer);
  previewRefreshTimer = setTimeout(() => {
    if (currentPreviewMode === "admin") {
      writeBundleToStorage(DRAFT_BUNDLE_KEY, workingBundle, DRAFT_UPDATED_KEY);
      refreshPreview();
      updateMetaChips();
    }
  }, 450);
}

function activateSection(section) {
  currentSection = section;
  document.querySelectorAll("[data-section-tab]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.sectionTab === section);
  });
  document.querySelectorAll("[data-editor-section]").forEach((panel) => {
    panel.hidden = panel.dataset.editorSection !== section;
  });
  updateMetaChips();
  refreshPreview();
}

function activatePreviewMode(mode) {
  currentPreviewMode = mode;
  document.querySelectorAll("[data-preview-mode]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.previewMode === mode);
  });
  const modeLabel = mode === "admin" ? "관리자용 미리보기" : mode === "published-local" ? "최종 발행 미리보기" : "공용 공개본";
  setStatus(`${modeLabel}로 전환했습니다.`);
  refreshPreview();
}

function bindSectionTabs() {
  document.querySelectorAll("[data-section-tab]").forEach((button) => {
    button.addEventListener("click", () => activateSection(button.dataset.sectionTab));
  });
}

function bindPreviewModeTabs() {
  document.querySelectorAll("[data-preview-mode]").forEach((button) => {
    button.addEventListener("click", () => activatePreviewMode(button.dataset.previewMode));
  });
}

function bindFields() {
  document.querySelectorAll("[data-store][name]").forEach((field) => {
    field.addEventListener("input", () => {
      workingBundle = collectBundleFromFields();
      setStatus("초안에 반영할 변경사항이 있습니다.");
      schedulePreviewRefresh();
    });
  });
}

function bindWorkflowActions() {
  const saveDraft = document.querySelector("[data-action='save-draft']");
  const previewAdmin = document.querySelector("[data-action='preview-admin']");
  const publishLocal = document.querySelector("[data-action='publish-local']");
  const publishGithub = document.querySelector("[data-action='publish-github']");
  const openPublished = document.querySelector("[data-action='preview-published']");
  const exportBundle = document.querySelector("[data-action='export-bundle']");
  const resetToPublished = document.querySelector("[data-action='reset-published']");

  saveDraft?.addEventListener("click", () => {
    workingBundle = collectBundleFromFields();
    writeBundleToStorage(DRAFT_BUNDLE_KEY, workingBundle, DRAFT_UPDATED_KEY);
    setStatus(`초안 저장 완료 · ${formatDateTime(localStorage.getItem(DRAFT_UPDATED_KEY))}`, "is-success");
    updateMetaChips();
    if (currentPreviewMode === "admin") {
      refreshPreview();
    }
  });

  previewAdmin?.addEventListener("click", () => {
    workingBundle = collectBundleFromFields();
    writeBundleToStorage(DRAFT_BUNDLE_KEY, workingBundle, DRAFT_UPDATED_KEY);
    activatePreviewMode("admin");
  });

  publishLocal?.addEventListener("click", () => {
    workingBundle = collectBundleFromFields();
    writeBundleToStorage(DRAFT_BUNDLE_KEY, workingBundle, DRAFT_UPDATED_KEY);
    writeBundleToStorage(PUBLISHED_BUNDLE_KEY, workingBundle, PUBLISHED_UPDATED_KEY);
    setStatus(`최종 발행 상태로 반영했습니다 · ${formatDateTime(localStorage.getItem(PUBLISHED_UPDATED_KEY))}`, "is-success");
    updateMetaChips();
    activatePreviewMode("published-local");
  });

  publishGithub?.addEventListener("click", async () => {
    workingBundle = collectBundleFromFields();
    writeBundleToStorage(DRAFT_BUNDLE_KEY, workingBundle, DRAFT_UPDATED_KEY);
    writeBundleToStorage(PUBLISHED_BUNDLE_KEY, workingBundle, PUBLISHED_UPDATED_KEY);
    updateMetaChips();

    const secretInput = document.querySelector("[data-publish-secret]");
    const publishSecret = secretInput ? secretInput.value.trim() : "";

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
        commitUrl
          ? `GitHub 발행 완료 · ${result.commit.sha.slice(0, 7)}`
          : "GitHub 발행 완료",
        "is-success"
      );

      if (commitUrl) {
        window.open(commitUrl, "_blank", "noopener,noreferrer");
      }

      activatePreviewMode("published-local");
    } catch (error) {
      console.error(error);
      setStatus(`GitHub 발행 실패 · ${error.message}`, "is-error");
    }
  });

  openPublished?.addEventListener("click", () => activatePreviewMode("published-local"));

  exportBundle?.addEventListener("click", () => {
    workingBundle = collectBundleFromFields();
    downloadJson("site-content.json", workingBundle);
    setStatus("발행용 site-content.json을 내보냈습니다.", "is-success");
  });

  resetToPublished?.addEventListener("click", () => {
    const publishedBundle = readBundleFromStorage(PUBLISHED_BUNDLE_KEY);
    workingBundle = publishedBundle ? mergeBundles(mergeBundles(getFallbackBundle(), sharedData), publishedBundle) : mergeBundles(getFallbackBundle(), sharedData);
    populateFields(workingBundle);
    writeBundleToStorage(DRAFT_BUNDLE_KEY, workingBundle, DRAFT_UPDATED_KEY);
    setStatus("현재 초안을 마지막 발행 상태 기준으로 되돌렸습니다.");
    updateMetaChips();
    if (currentPreviewMode === "admin") {
      refreshPreview();
    }
  });
}

async function init() {
  sharedData = mergeBundles(getFallbackBundle(), await getSharedData());
  const draftBundle = readBundleFromStorage(DRAFT_BUNDLE_KEY);
  workingBundle = draftBundle ? mergeBundles(sharedData, draftBundle) : sharedData;

  populateFields(workingBundle);
  bindSectionTabs();
  bindPreviewModeTabs();
  bindFields();
  bindWorkflowActions();
  updateMetaChips();
  activateSection(currentSection);
  activatePreviewMode(currentPreviewMode);
}

document.addEventListener("DOMContentLoaded", init);
