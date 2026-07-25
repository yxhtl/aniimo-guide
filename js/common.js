/* ===== Aniimo Guide - Common JS ===== */
/* Dark mode / Language / Global Search / Burger / Back-to-top / Codex / Calculator */
/* Fix #11: search keyboard nav + highlight + expanded index */
/* Fix #12: dark mode reads prefers-color-scheme */
/* Fix #16: use textContent instead of innerHTML for data-en switching */
/* Fix #17: preserve scroll position on language switch */
(function () {
  "use strict";

  /* ---------- SVG icons ---------- */
  var ICON_SEARCH = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
  var ICON_SUN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  var ICON_MOON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  /* ---------- i18n dictionary ---------- */
  var I18N = {
    "nav.getting-started": { zh: "新手入门", en: "Beginner" },
    "nav.creatures": { zh: "伊莫图鉴", en: "Codex" },
    "nav.combat": { zh: "战斗系统", en: "Combat" },
    "nav.breeding": { zh: "培育养成", en: "Breeding" },
    "nav.explore": { zh: "世界探索", en: "Explore" },
    "nav.homeland": { zh: "家园建造", en: "Homeland" },
    "nav.cta.start": { zh: "开始攻略", en: "Start Guide" },
    "nav.cta.home": { zh: "返回首页", en: "Home" },
    "brand": { zh: "伊莫攻略站", en: "Aniimo Guide" },
    "search.placeholder": { zh: "搜索伊莫、属性、攻略…", en: "Search Aniimo, types, guides…" },
    "search.empty": { zh: "没有找到相关内容", en: "No results found" },
    "search.hint": { zh: "输入关键词搜索全站攻略（↑↓选择，回车跳转）", en: "Type to search (↑↓ to navigate, Enter to go)" },
    "foot.nav": { zh: "攻略导航", en: "Guides" },
    "foot.systems": { zh: "系统攻略", en: "Systems" },
    "foot.about": { zh: "关于", en: "About" },
    "foot.aboutus": { zh: "关于本站", en: "About" },
    "foot.feedback": { zh: "投稿反馈", en: "Feedback" },
    "foot.changelog": { zh: "更新日志", en: "Changelog" },
    "foot.branddesc": { zh: "《伊莫》中英双语攻略站，原创整理，持续更新。", en: "A bilingual Aniimo guide site, original content, updated regularly." },
    "foot.copy": { zh: "© 2026 伊莫攻略站 · Aniimo Bilingual Guide · 仅供学习交流", en: "© 2026 Aniimo Guide · Bilingual · For learning only" },
    "totype.all": { zh: "全部", en: "All" }
  };

  /* ---------- Build search index from creature data + pages ---------- */
  function buildSearchIndex() {
    var idx = [
      { page: "首页", pageEn: "Home", url: "index.html",
        title: "伊莫攻略站", titleEn: "Aniimo Guide Home",
        tags: "伊莫 Aniimo 攻略 首页 捉宠 开放世界 寻路者 伊迪尔", tagsEn: "Aniimo guide home creature-catching open-world pathfinder Idyll" },
      { page: "新手入门", pageEn: "Beginner", url: "getting-started.html",
        title: "从零到第一只伊莫", titleEn: "From Zero to First Aniimo",
        tags: "新手 入门 开荒 时间线 封藏 伊莫球 共鸣 燃爪 探路者 任务", tagsEn: "beginner guide timeline catch aniipod twine pathfinder quest" },
      { page: "伊莫图鉴", pageEn: "Codex", url: "creatures.html",
        title: "全伊莫图鉴", titleEn: "Aniimo Codex",
        tags: "图鉴 伊莫 95只 属性 形态 排行 筛选 计算器 TierList", tagsEn: "codex aniimo 95 type form stats ranking filter calculator tierlist" },
      { page: "战斗系统", pageEn: "Combat", url: "combat.html",
        title: "属性克制与配队指南", titleEn: "Type Chart & Team Building",
        tags: "战斗 属性 克制 配队 PVEVP 夺蛋 共鸣 实时 火水草电暗风光土光", tagsEn: "combat type chart team pvevp egg-heist twine fire water grass electric dark wind earth light" },
      { page: "培育养成", pageEn: "Breeding", url: "breeding.html",
        title: "潜力评级与共鸣训练", titleEn: "Potential Score & Resonance Training",
        tags: "培育 潜力评级 潜力值 MBTI 性格 共鸣训练 星矿 经验宝石 进化 Lumin Gamma Nova 先天后天 完美 免费", tagsEn: "breeding potential score MBTI personality resonance training astranite experience-gem evolution lumin gamma nova innate acquired perfect free" },
      { page: "世界探索", pageEn: "Explore", url: "explore.html",
        title: "伊迪尔大陆区域探索", titleEn: "Idyll Continent Exploration",
        tags: "探索 地图 区域 伊迪尔 天空都市 滑翔 潜水 钻地 天气 时间 失落群岛", tagsEn: "explore map region Idyll sky-metropolis glide dive burrow weather time lost-isles" },
      { page: "家园建造", pageEn: "Homeland", url: "homeland.html",
        title: "房车营地与家园系统", titleEn: "RV Camp & Homeland System",
        tags: "家园 房车 营地 种植 装饰 升级 战斗属性 篝火 聚会", tagsEn: "homeland RV camp farming decoration upgrade combat-stat campfire gathering" },
      { page: "战斗系统", pageEn: "Combat", url: "combat.html#type-chart",
        title: "属性克制表", titleEn: "Type Effectiveness Chart",
        tags: "属性 克制 表 火克草冰 水克火土 草克水土 电克水风 冰克水电 土克电冰 风克草暗 光克风暗 暗克火草光三系 非双向 1.6倍 0.625倍", tagsEn: "type chart effectiveness non-bidirectional 1.6x 0.625x" },
      { page: "战斗系统", pageEn: "Combat", url: "combat.html#egg-heist",
        title: "夺蛋模式（Egg Heist）", titleEn: "Egg Heist Mode",
        tags: "PVEVP 夺蛋 Egg Heist 3人组队 失落群岛 实时 搜索 战斗 撤离 蛋壳币 暗影蛋", tagsEn: "pvevp egg-heist 3-player lost-isles realtime search battle evacuation eggshell-coin darkler-egg" }
    ];
    /* Add all 95 creatures to search index */
    if (typeof CREATURES !== "undefined") {
      CREATURES.forEach(function (c) {
        var elName = EL_NAMES[c.el] ? EL_NAMES[c.el][en_or_zh()] : c.el;
        var elName2 = c.el2 ? " " + (EL_NAMES[c.el2] ? EL_NAMES[c.el2][en_or_zh()] : c.el2) : "";
        idx.push({
          page: "伊莫图鉴", pageEn: "Codex", url: "creatures.html#creature-" + c.no,
          title: c.nameZh + "（" + c.name + "）", titleEn: c.name,
          tags: "No." + c.no + " " + c.name + " " + c.nameZh + " " + c.el + (c.el2 ? " " + c.el2 : "") + " " + c.role + " " + c.stage + " HP" + c.hp + " ATK" + c.atk + " BREAK" + c.brk,
          tagsEn: c.no + " " + c.name + " " + c.el + (c.el2 ? " " + c.el2 : "") + " " + c.role + " " + c.stage + " HP" + c.hp + " ATK" + c.atk + " BREAK" + c.brk
        });
      });
    }
    return idx;
  }

  function en_or_zh() { return lang === "en" ? "en" : "zh"; }

  var lang = localStorage.getItem("aniimo-lang") || "zh";
  /* Fix #12: read system preference if no saved preference */
  var darkSaved = localStorage.getItem("aniimo-dark");
  var dark = darkSaved === "1" ? true : darkSaved === "0" ? false :
    (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);

  var SEARCH_INDEX = [];

  /* ---------- Apply language ---------- */
  /* Fix #16: use textContent where possible, only use innerHTML for elements that explicitly contain HTML */
  /* Fix #17: save and restore scroll position */
  function applyLang(l) {
    var scrollTop = window.scrollY;
    var scrollLeft = window.scrollX;
    lang = l;
    localStorage.setItem("aniimo-lang", l);
    document.documentElement.lang = l === "zh" ? "zh-CN" : "en";

    /* 1) UI framework elements via data-i18n dictionary */
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (I18N[key] && I18N[key][l]) {
        if (el.hasAttribute("data-i18n-ph")) el.setAttribute("placeholder", I18N[key][l]);
        else el.textContent = I18N[key][l];
      }
    });

    /* 2) Page content elements via data-en attribute */
    /* Fix #16: Use textContent instead of innerHTML to prevent XSS */
    document.querySelectorAll("[data-en]").forEach(function (el) {
      if (l === "en") {
        if (!el.hasAttribute("data-zh")) el.setAttribute("data-zh", el.textContent);
        /* Check if data-en contains HTML tags - if so, use innerHTML (safe for static content) */
        var enVal = el.getAttribute("data-en");
        if (enVal.indexOf("<") !== -1 && enVal.indexOf(">") !== -1) {
          el.innerHTML = enVal;
        } else {
          el.textContent = enVal;
        }
      } else {
        if (el.hasAttribute("data-zh")) {
          var zhVal = el.getAttribute("data-zh");
          if (zhVal.indexOf("<") !== -1 && zhVal.indexOf(">") !== -1) {
            el.innerHTML = zhVal;
          } else {
            el.textContent = zhVal;
          }
        }
      }
    });

    /* 2b) Handle data-en-ph for placeholder translation */
    document.querySelectorAll("[data-en-ph]").forEach(function (el) {
      if (l === "en") {
        if (!el.hasAttribute("data-zh-ph")) el.setAttribute("data-zh-ph", el.getAttribute("placeholder"));
        el.setAttribute("placeholder", el.getAttribute("data-en-ph"));
      } else {
        if (el.hasAttribute("data-zh-ph")) el.setAttribute("placeholder", el.getAttribute("data-zh-ph"));
      }
    });

    var langBtn = document.querySelector(".lang-btn");
    if (langBtn) langBtn.textContent = l === "zh" ? "English" : "中文";

    /* 3) Update aria-labels */
    var ariaMap = {
      ".search-btn": { zh: "搜索", en: "Search" },
      ".dark-btn": { zh: "暗色模式", en: "Toggle dark mode" },
      ".lang-btn": { zh: "语言", en: "Switch language" },
      "#burger": { zh: "菜单", en: "Menu" },
      "#toTop": { zh: "返回顶部", en: "Back to top" },
      ".search-close": { zh: "关闭", en: "Close" }
    };
    Object.keys(ariaMap).forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) el.setAttribute("aria-label", ariaMap[sel][l]);
    });

    /* 4) Re-render search results if overlay is open */
    var ov = document.getElementById("searchOverlay");
    if (ov && ov.classList.contains("show")) {
      var inp = ov.querySelector("input");
      renderSearch(inp ? inp.value : "");
    }

    /* 5) Re-render codex if on creatures page (cards use codexLang) */
    if (typeof renderCodex === "function") renderCodex();

    /* 6) Translate all type-badge elements by CSS class */
    translateBadges(l);

    /* Fix #17: restore scroll position */
    window.scrollTo(scrollLeft, scrollTop);
  }

  /* ---------- Apply dark ---------- */
  function applyDark(d) {
    dark = d;
    localStorage.setItem("aniimo-dark", d ? "1" : "0");
    document.body.classList.toggle("dark", d);
    var db = document.querySelector(".dark-btn");
    if (db) db.innerHTML = d ? ICON_SUN : ICON_MOON;
  }

  /* ---------- Search ---------- */
  /* Fix #11: keyboard navigation + highlight + expanded index */
  function openSearch() {
    var ov = document.getElementById("searchOverlay");
    if (!ov) return;
    ov.classList.add("show");
    var inp = ov.querySelector("input");
    if (inp) { inp.value = ""; inp.focus(); renderSearch(""); }
  }
  function closeSearch() {
    var ov = document.getElementById("searchOverlay");
    if (ov) ov.classList.remove("show");
  }

  function highlightMatch(text, query) {
    if (!query) return text;
    var lower = text.toLowerCase();
    var idx = lower.indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return text.substring(0, idx) + '<mark>' + text.substring(idx, idx + query.length) + '</mark>' + text.substring(idx + query.length);
  }

  var searchSelectedIdx = -1;
  var currentHits = [];

  function renderSearch(q) {
    var box = document.querySelector("#searchOverlay .search-results");
    if (!box) return;
    q = (q || "").trim().toLowerCase();
    searchSelectedIdx = -1;
    if (!q) {
      box.innerHTML = '<div class="sr-empty">' + t("search.hint") + "</div>";
      return;
    }
    currentHits = [];
    SEARCH_INDEX.forEach(function (e) {
      var hay = (e.page + " " + e.title + " " + e.tags + " " +
                 (e.pageEn || "") + " " + (e.titleEn || "") + " " + (e.tagsEn || "")
      ).toLowerCase();
      if (hay.indexOf(q) !== -1) currentHits.push(e);
    });
    if (!currentHits.length) {
      box.innerHTML = '<div class="sr-empty">' + t("search.empty") + "</div>";
      return;
    }
    var isEn = lang === "en";
    box.innerHTML = currentHits.map(function (e, i) {
      var pg = isEn ? (e.pageEn || e.page) : e.page;
      var ti = isEn ? (e.titleEn || e.title) : e.title;
      var tg = isEn ? (e.tagsEn || e.tags) : e.tags;
      var snip = tg.split(" ").slice(0, 6).join(" · ");
      var tiH = highlightMatch(ti, q);
      var snipH = highlightMatch(snip, q);
      return '<a class="sr-item' + (i === searchSelectedIdx ? " selected" : "") + '" href="' + e.url + '" data-idx="' + i + '">' +
        '<div class="sr-page">' + pg + "</div>" +
        '<div class="sr-title">' + tiH + "</div>" +
        '<div class="sr-snippet">' + snipH + "</div></a>";
    }).join("");
  }

  function moveSearchSelection(dir) {
    if (!currentHits.length) return;
    searchSelectedIdx += dir;
    if (searchSelectedIdx < 0) searchSelectedIdx = currentHits.length - 1;
    if (searchSelectedIdx >= currentHits.length) searchSelectedIdx = 0;
    var items = document.querySelectorAll("#searchOverlay .sr-item");
    items.forEach(function (el, i) {
      el.classList.toggle("selected", i === searchSelectedIdx);
    });
    var sel = document.querySelector("#searchOverlay .sr-item.selected");
    if (sel) sel.scrollIntoView({ block: "nearest" });
  }

  function t(key) { return I18N[key] ? (I18N[key][lang] || I18N[key].zh) : key; }

  /* ---------- Init ---------- */
  function init() {
    /* Build search index */
    SEARCH_INDEX = buildSearchIndex();

    applyDark(dark);
    applyLang(lang);

    /* set search button icon */
    var sb = document.querySelector(".search-btn");
    if (sb) sb.innerHTML = ICON_SEARCH;
    var sico = document.querySelector(".s-ico");
    if (sico) sico.innerHTML = ICON_SEARCH;

    /* burger */
    var burger = document.getElementById("burger");
    var navLinks = document.getElementById("navLinks");
    if (burger && navLinks) {
      burger.addEventListener("click", function () { navLinks.classList.toggle("open"); });
    }

    /* dark toggle */
    var db = document.querySelector(".dark-btn");
    if (db) db.addEventListener("click", function () { applyDark(!dark); });

    /* lang toggle */
    var lb = document.querySelector(".lang-btn");
    if (lb) lb.addEventListener("click", function () { applyLang(lang === "zh" ? "en" : "zh"); });

    /* back to top */
    var toTop = document.getElementById("toTop");
    if (toTop) {
      window.addEventListener("scroll", function () { toTop.classList.toggle("show", window.scrollY > 400); });
      toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    }

    /* search - Fix #11: keyboard navigation */
    var ov = document.getElementById("searchOverlay");
    if (sb) sb.addEventListener("click", openSearch);
    if (ov) {
      var close = ov.querySelector(".search-close");
      if (close) close.addEventListener("click", closeSearch);
      ov.addEventListener("click", function (e) { if (e.target === ov) closeSearch(); });
      var inp = ov.querySelector("input");
      if (inp) {
        inp.addEventListener("input", function () { renderSearch(inp.value); });
      }
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeSearch();
        if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); openSearch(); }
        /* keyboard navigation in search */
        if (ov.classList.contains("show")) {
          if (e.key === "ArrowDown") { e.preventDefault(); moveSearchSelection(1); }
          if (e.key === "ArrowUp") { e.preventDefault(); moveSearchSelection(-1); }
          if (e.key === "Enter" && searchSelectedIdx >= 0 && currentHits[searchSelectedIdx]) {
            e.preventDefault();
            window.location.href = currentHits[searchSelectedIdx].url;
          }
        }
      });
    }

    /* chip filters — skip on codex page (codex.js handles its own chips) */
    if (typeof initCodex !== "function") {
      var chips = document.querySelectorAll(".chip[data-filter]");
      if (chips.length) {
        chips.forEach(function (chip) {
          chip.addEventListener("click", function () {
            var filter = chip.getAttribute("data-filter");
            chips.forEach(function (c) { c.classList.remove("active"); });
            chip.classList.add("active");
            var items = document.querySelectorAll("[data-type]");
            items.forEach(function (item) {
              if (filter === "all" || item.getAttribute("data-type") === filter) {
                item.style.display = "";
              } else {
                item.style.display = "none";
              }
            });
          });
        });
      }
    }

    /* Init codex if on creatures page */
    if (typeof initCodex === "function") initCodex();

    /* Listen for system dark mode changes */
    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
        if (localStorage.getItem("aniimo-dark") === null) {
          applyDark(e.matches);
        }
      });
    }

    /* Note: do NOT call applyLang(lang) again here — it was already called
       above, and re-calling would trigger renderCodex → unnecessary re-render. */
  }

  /* ---------- Translate type badges by CSS class ---------- */
  /* Auto-translates <span class="type-badge t-fire">火</span> etc.
     Only touches badges whose text is a pure element name (zh or en),
     so custom badges like "物攻 +%" are left untouched. */
  function translateBadges(l) {
    var map = {
      fire:    { zh: "火", en: "Fire" },
      water:   { zh: "水", en: "Water" },
      grass:   { zh: "草", en: "Grass" },
      electric:{ zh: "电", en: "Lightning" },
      ice:     { zh: "冰", en: "Ice" },
      earth:   { zh: "土", en: "Earth" },
      wind:    { zh: "风", en: "Wind" },
      light:   { zh: "光", en: "Light" },
      dark:    { zh: "暗", en: "Dark" }
    };
    /* Build reverse lookup: text → element key */
    var lookup = {};
    Object.keys(map).forEach(function (k) {
      lookup[map[k].zh] = k;
      lookup[map[k].en] = k;
      lookup[map[k].zh + " " + map[k].en] = k; /* "火 Fire" combined */
      lookup[map[k].en + " " + map[k].zh] = k; /* "Fire 火" combined */
    });
    document.querySelectorAll(".type-badge").forEach(function (badge) {
      var txt = badge.textContent.trim();
      var key = lookup[txt];
      if (key) badge.textContent = map[key][l];
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
