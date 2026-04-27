(function () {
  var STORAGE_PREFIX = "nosearch-bo";
  var SHARED_DATA_PATH = "content-data/site-content.json";
  var sharedContent = null;

  function getPageName() {
    var parts = decodeURIComponent(window.location.pathname).split("/");
    return parts[parts.length - 1] || "index.html";
  }

  function getStore(store) {
    var sharedStore = (sharedContent && sharedContent[store]) || null;
    try {
      var raw = localStorage.getItem(STORAGE_PREFIX + ":" + store);
      var localStore = raw ? JSON.parse(raw) : null;
      if (sharedStore || localStore) {
        return Object.assign({}, sharedStore || {}, localStore || {});
      }
      return null;
    } catch (error) {
      console.error("Failed to read content store", store, error);
      return sharedStore;
    }
  }

  function setText(selector, value) {
    var target = document.querySelector(selector);
    if (target && value) {
      target.textContent = value;
    }
  }

  function setHTML(selector, value) {
    var target = document.querySelector(selector);
    if (target && value) {
      target.innerHTML = value;
    }
  }

  function setManyText(selectors, values) {
    selectors.forEach(function (selector, index) {
      setText(selector, values[index]);
    });
  }

  function splitLines(text) {
    return String(text || "")
      .split("\n")
      .map(function (line) { return line.trim(); })
      .filter(Boolean);
  }

  function summaryLine(label, text) {
      return "<strong>" + label + ".</strong> " + text;
  }

  async function loadSharedContent() {
    try {
      var response = await fetch(SHARED_DATA_PATH, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to load shared content: " + response.status);
      }
      sharedContent = await response.json();
    } catch (error) {
      console.warn("Shared content JSON could not be loaded. Falling back to localStorage only.", error);
      sharedContent = null;
    }
  }

  function renderHome() {
    var submain = getStore("submain");
    var schedule = getStore("schedule");
    var wiki = getStore("wiki");
    var encyclopedia = getStore("encyclopedia");
    if (!submain) {
      return;
    }

    setHTML(".home-picks-grid .pick-card:first-child h3", submain.category + " 카테고리<br />업데이트된 서브메인 바로 보기");
    setText(".home-picks-grid .pick-card:first-child > p", submain.summary);
    setText(".home-picks-grid .pick-card:first-child .category-summary-item:nth-child(1) span", "구매가이드 4줄 요약과 풀버전 진입");
    setText(".home-picks-grid .pick-card:first-child .category-summary-item:nth-child(2) span", "대표 픽: " + submain.bestPick + " · " + submain.valuePick);
    setText(".home-picks-grid .pick-card:first-child .category-summary-item:nth-child(3) span", "다음 점검: " + splitLines(submain.nextSchedule)[0]);
    setText(".home-picks-grid .pick-card:first-child .category-mini-item:first-child strong", submain.summaryLine2);
    setText(".home-picks-grid .pick-card:first-child .category-mini-item:first-child span", submain.summaryLine4);
    if (encyclopedia) {
      setText(".home-picks-grid .pick-card:first-child .category-mini-item:last-child strong", encyclopedia.title);
      setText(".home-picks-grid .pick-card:first-child .category-mini-item:last-child span", encyclopedia.summary);
    }
    setText(".home-picks-grid .pick-card:first-child .category-footnote", "서브메인 갱신 기준: " + (submain.badge3 || "최근 수정"));
    setText(".home-picks-grid .pick-card:first-child .category-link", submain.category + " 서브메인 열기");

    if (schedule) {
      setText(".lab-list .lab-item:first-child .lab-item-title", schedule.inLabCopy);
      setText(".lab-list .lab-item:first-child .lab-item-sub", schedule.note);
    }

    if (wiki) {
      setText(".wiki-panel p", "카테고리보다 먼저 떠오르는 건 대개 고민입니다. `" + wiki.keyword + "`, `" + splitLines(wiki.aliases)[0] + "`처럼 검색하면 관련 픽, 구매가이드, 가전백과를 묶어서 보여주는 위키형 검색 허브입니다.");
      var keywordLinks = document.querySelectorAll(".wiki-panel .wiki-keyword");
      var words = [wiki.keyword].concat(splitLines(wiki.aliases).slice(0, 4));
      keywordLinks.forEach(function (link, index) {
        if (words[index]) {
          link.textContent = words[index];
        }
      });
    }
  }

  function renderSubmain() {
    var submain = getStore("submain");
    var encyclopedia = getStore("encyclopedia");
    if (!submain) {
      return;
    }

    document.title = submain.category + " 노써치픽 - Nosearch Sand Codex 2";
    setText(".hero-panel h1", submain.category + " 노써치픽");
    setText(".hero-panel p", submain.summary);
    setManyText([".hero-meta span:nth-child(1)", ".hero-meta span:nth-child(2)", ".hero-meta span:nth-child(3)"], [submain.badge1, submain.badge2, submain.badge3]);

    var summaryLines = splitLines([
      submain.summaryLine1,
      submain.summaryLine2,
      submain.summaryLine3,
      submain.summaryLine4
    ].join("\n"));
    document.querySelectorAll(".summary-line").forEach(function (line, index) {
      if (summaryLines[index]) {
        line.innerHTML = summaryLine(index + 1, summaryLines[index]);
      }
    });

    setText(".pick-grid .pick-card:nth-child(1) .pick-copy h3", submain.bestPick);
    setText(".pick-grid .pick-card:nth-child(2) .pick-copy h3", submain.valuePick);

    if (encyclopedia) {
      setText(".encyclopedia-grid .encyclopedia-card:first-child h3", encyclopedia.title);
      setText(".encyclopedia-grid .encyclopedia-card:first-child p", encyclopedia.summary);
    }

    var historyList = document.querySelector(".history-list");
    var historyLines = splitLines(submain.cmHistory);
    if (historyList && historyLines.length) {
      historyList.innerHTML = historyLines.map(function (line) {
        var parts = line.split("|");
        var title = (parts[0] || "").trim();
        var body = (parts[1] || "").trim();
        return '<div class="history-item"><strong>' + title + '</strong><p>' + body + "</p></div>";
      }).join("");
    }

    var scheduleQuick = document.querySelector(".schedule-quick");
    var scheduleLines = splitLines(submain.nextSchedule);
    if (scheduleQuick && scheduleLines.length) {
      scheduleQuick.innerHTML = scheduleLines.map(function (line) {
        var parts = line.split("|");
        return "<div><strong>" + (parts[0] || "").trim() + "</strong>" + (parts[1] || "").trim() + "</div>";
      }).join("");
    }

    setText(".footer .container", submain.category + " 노써치픽은 카테고리별 서브메인 템플릿으로 운영됩니다.");
  }

  function renderGuide() {
    var guide = getStore("guide");
    if (!guide) {
      return;
    }

    document.title = guide.category + " 구매가이드 - Nosearch Sand Codex 2";
    setText(".hero-panel h1", guide.category + " 구매가이드");
    setText(".hero-panel p", guide.listSummary);
    setManyText([".hero-meta span:nth-child(1)", ".hero-meta span:nth-child(2)", ".hero-meta span:nth-child(3)"], [
      "연결: " + guide.linkedSubmain,
      "같이 읽기: " + guide.linkedEncyclopedia,
      "업데이트: " + guide.listStatus
    ]);

    setManyText([".toc a:nth-child(3)", ".toc a:nth-child(4)", ".toc a:nth-child(5)", ".toc a:nth-child(6)"], [
      "1. " + guide.chapter1Title,
      "2. " + guide.chapter2Title,
      "3. " + guide.chapter3Title,
      "4. " + guide.chapter4Title
    ]);
    setManyText([
      "#space h2", "#cadr h2", "#sensor h2", "#filter h2"
    ], [
      "1. " + guide.chapter1Title,
      "2. " + guide.chapter2Title,
      "3. " + guide.chapter3Title,
      "4. " + guide.chapter4Title
    ]);
    setManyText(["#space > p", "#cadr > p", "#sensor > p", "#filter > p"], [
      guide.chapter1Body,
      guide.chapter2Body,
      guide.chapter3Body,
      guide.chapter4Body
    ]);

    setText(".summary-card .summary-grid div:nth-child(1) span", guide.chapter1Body);
    setText(".summary-card .summary-grid div:nth-child(2) span", guide.chapter2Body);
    setText(".summary-card .summary-grid div:nth-child(3) span", guide.chapter4Body);
  }

  function renderGuideList() {
    var guide = getStore("guide");
    if (!guide) {
      return;
    }

    setText(".guide-grid .guide-card:first-child .guide-head .chip.success", guide.listStatus);
    setText(".guide-grid .guide-card:first-child h3", guide.listTitle);
    setText(".guide-grid .guide-card:first-child p", guide.listSummary);
    setText(".guide-grid .guide-card:first-child .guide-points div:nth-child(2) span", guide.linkedEncyclopedia);
    setText(".guide-grid .guide-card:first-child .guide-points div:nth-child(3) span", guide.linkedSubmain + " 으로 연결");
    setText(".guide-grid .guide-card:first-child .guide-points div:nth-child(4) span", guide.listStatus);
  }

  function renderEncyclopedia() {
    var encyclopedia = getStore("encyclopedia");
    if (!encyclopedia) {
      return;
    }

    setText(".hero-panel p", encyclopedia.summary);
    setText(".feature-grid .feature-card:first-child h3", encyclopedia.title);
    setText(".feature-grid .feature-card:first-child p", encyclopedia.summary);
    var keywordItems = splitLines(String(encyclopedia.keywords).replace(/,/g, "\n"));
    var featureList = document.querySelectorAll(".feature-grid .feature-card:first-child .feature-list div");
    featureList.forEach(function (item, index) {
      if (keywordItems[index]) {
        item.textContent = keywordItems[index];
      }
    });
    setText(".article-grid .article-card:first-child h3", encyclopedia.title);
    setText(".article-grid .article-card:first-child p", encyclopedia.summary);
  }

  function renderWiki() {
    var wiki = getStore("wiki");
    var submain = getStore("submain");
    var encyclopedia = getStore("encyclopedia");
    var guide = getStore("guide");
    if (!wiki) {
      return;
    }

    setText(".hero-panel p", "카테고리보다 고민이 먼저 떠오를 때 들어오는 페이지입니다. `" + wiki.keyword + "`, `" + splitLines(wiki.aliases)[0] + "`처럼 검색하면 노써치픽, 구매가이드, 가전백과, 카테고리 허브를 함께 보여줍니다.");
    var input = document.getElementById("searchInput");
    if (input) {
      input.placeholder = "예) " + wiki.keyword + " · " + splitLines(wiki.aliases).slice(0, 2).join(" · ");
    }
    var words = [wiki.keyword].concat(splitLines(wiki.aliases).slice(0, 4));
    document.querySelectorAll(".keyword").forEach(function (button, index) {
      if (words[index]) {
        button.textContent = words[index];
        button.setAttribute("data-keyword", words[index]);
      }
    });

    if (submain) {
      setText(".result-grid .result-card:nth-child(1) .result-top span:last-child", submain.category + " 서브메인");
      setText(".result-grid .result-card:nth-child(1) h3", submain.category + " 노써치픽");
      setText(".result-grid .result-card:nth-child(1) p", submain.summary);
      setManyText([
        ".result-grid .result-card:nth-child(1) .result-meta span:nth-child(1)",
        ".result-grid .result-card:nth-child(1) .result-meta span:nth-child(2)",
        ".result-grid .result-card:nth-child(1) .result-meta span:nth-child(3)"
      ], [
        "관련 키워드: " + wiki.keyword,
        splitLines(wiki.aliases)[0] || "",
        splitLines(wiki.aliases)[1] || ""
      ]);
      var subLink = document.querySelector(".result-grid .result-card:nth-child(1) .result-actions a");
      if (subLink) {
        subLink.setAttribute("href", submain.slug || "picks-air-cleaner.html");
      }
    }

    if (encyclopedia) {
      setText(".result-grid .result-card:nth-child(2) h3", encyclopedia.title);
      setText(".result-grid .result-card:nth-child(2) p", encyclopedia.summary);
    }

    if (guide) {
      setText(".result-grid .result-card:nth-child(3) h3", guide.category + " 구매가이드");
      setText(".result-grid .result-card:nth-child(3) p", guide.listSummary);
    }
  }

  function renderSchedule() {
    var schedule = getStore("schedule");
    if (!schedule) {
      return;
    }

    setText(".hero-panel p", "홈의 In The Lab과 픽 서브메인 하단 일정에서 이어지는 전체 보드입니다. `" + schedule.inLabCopy + "` 작업을 포함해 카테고리별 갱신 우선순위와 다음 점검 예정일을 표와 달력 두 형태로 모두 볼 수 있게 정리했습니다.");
    setManyText([
      ".schedule-table tbody tr:first-child td:nth-child(1)",
      ".schedule-table tbody tr:first-child td:nth-child(3)",
      ".schedule-table tbody tr:first-child td:nth-child(4)"
    ], [schedule.category, schedule.nextDate, schedule.note]);
    setText(".schedule-table tbody tr:first-child td:nth-child(2) .status", schedule.status);

    var day = "";
    if (schedule.nextDate) {
      day = schedule.nextDate.split("-")[2];
      if (day && day.charAt(0) === "0") {
        day = day.slice(1);
      }
    }
    var calendarDays = document.querySelectorAll(".calendar-day");
    calendarDays.forEach(function (card) {
      var strong = card.querySelector("strong");
      if (!strong || strong.textContent.trim() !== day) {
        return;
      }
      var dot = card.querySelector("div");
      if (dot) {
        dot.textContent = schedule.submainSummary;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", async function () {
    await loadSharedContent();
    var page = getPageName();
    if (page === "index.html") {
      renderHome();
    } else if (page === "picks-air-cleaner.html") {
      renderSubmain();
    } else if (page === "guides.html") {
      renderGuideList();
    } else if (page === "guide.html") {
      renderGuide();
    } else if (page === "encyclopedia.html") {
      renderEncyclopedia();
    } else if (page === "wiki.html") {
      renderWiki();
    } else if (page === "update-schedule.html") {
      renderSchedule();
    }
  });
})();
