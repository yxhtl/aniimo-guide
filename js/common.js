/* ===== Aniimo Guide - Common JS ===== */
/* Dark mode / Language / Global Search / Burger / Back-to-top */
(function () {
  "use strict";

  /* ---------- SVG icons ---------- */
  var ICON_SEARCH = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
  var ICON_SUN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  var ICON_MOON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  /* ---------- i18n dictionary (UI framework) ---------- */
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
    "search.hint": { zh: "输入关键词搜索全站攻略", en: "Type to search the whole site" },
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

  /* ---------- Search index ---------- */
  /* Each entry has zh + en fields; search matches both languages, display follows UI lang */
  var SEARCH_INDEX = [
    { page: "首页", pageEn: "Home", url: "index.html",
      title: "伊莫攻略站", titleEn: "Aniimo Guide Home",
      tags: "伊莫 Aniimo 攻略 首页 捉宠 开放世界 寻路者 伊迪尔", tagsEn: "Aniimo guide home creature-catching open-world pathfinder Idyll" },
    { page: "新手入门", pageEn: "Beginner", url: "getting-started.html",
      title: "从零到第一只伊莫", titleEn: "From Zero to First Aniimo",
      tags: "新手 入门 开荒 时间线 封藏 伊莫球 共鸣 燃爪 探路者 任务", tagsEn: "beginner guide timeline catch aniipod twine pathfinder quest" },
    { page: "伊莫图鉴", pageEn: "Codex", url: "creatures.html",
      title: "全伊莫图鉴", titleEn: "Aniimo Codex",
      tags: "图鉴 伊莫 95只 炽嚎 Scorchhowl 星角 Celestis 浮云 Nimbi 芽爪 Budclaw 潜猪 Susuta 暗袭 Ignitis 勇骑 Pawney 炼狱狼 Inferlupa 波涛兽 Wavwal 珊瑚兽 Coraliz 属性 形态 排行", tagsEn: "codex aniimo 95 scorchhowl celestis nimbi budclaw susuta ignitis pawney inferlupa wavwal coraliz type form stats ranking" },
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
    /* extra searchable anchors */
    { page: "伊莫图鉴", pageEn: "Codex", url: "creatures.html",
      title: "炽嚎（Scorchhowl）", titleEn: "Scorchhowl",
      tags: "No.003 炽嚎 Scorchhowl 火 雷暴形态 棱晶形态", tagsEn: "003 Scorchhowl fire thunderstorm prismana form" },
    { page: "伊莫图鉴", pageEn: "Codex", url: "creatures.html",
      title: "星角（Celestis）", titleEn: "Celestis",
      tags: "No.005 星角 Celestis 暗 萤火 森林", tagsEn: "005 Celestis dark firefly forest" },
    { page: "伊莫图鉴", pageEn: "Codex", url: "creatures.html",
      title: "浮云（Nimbi）", titleEn: "Nimbi",
      tags: "No.018 浮云 Nimbi 风 暴雨形态", tagsEn: "018 Nimbi wind rainstorm form" },
    { page: "伊莫图鉴", pageEn: "Codex", url: "creatures.html",
      title: "芽爪（Budclaw）", titleEn: "Budclaw",
      tags: "No.024 芽爪 Budclaw 土 草 泥滩形态 双属性", tagsEn: "024 Budclaw earth grass mudflat dual-type" },
    { page: "战斗系统", pageEn: "Combat", url: "combat.html",
      title: "属性克制表", titleEn: "Type Effectiveness Chart",
      tags: "属性 克制 表 火克草冰 水克火土 草克水土 电克水风 冰克水电 土克电冰 风克草暗 光克风暗 暗克火草光三系 非双向 1.6倍 0.625倍", tagsEn: "type chart effectiveness fire-grass-ice water-fire-earth grass-water-earth electric-water-wind ice-water-electric earth-electric-ice wind-grass-dark light-wind-dark dark-fire-grass-light-3x non-bidirectional 1.6x 0.625x" },
    { page: "战斗系统", pageEn: "Combat", url: "combat.html",
      title: "夺蛋模式（Egg Heist）", titleEn: "Egg Heist Mode",
      tags: "PVEVP 夺蛋 Egg Heist 3人组队 失落群岛 实时 搜索 战斗 撤离 蛋壳币 暗影蛋", tagsEn: "pvevp egg-heist 3-player lost-isles realtime search battle evacuation eggshell-coin darkler-egg" }
  ];

  var lang = localStorage.getItem("aniimo-lang") || "zh";
  var dark = localStorage.getItem("aniimo-dark") === "1";

  /* ---------- Apply language ---------- */
  function applyLang(l) {
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
    document.querySelectorAll("[data-en]").forEach(function (el) {
      if (l === "en") {
        if (!el.hasAttribute("data-zh")) el.setAttribute("data-zh", el.innerHTML);
        el.innerHTML = el.getAttribute("data-en");
      } else {
        if (el.hasAttribute("data-zh")) el.innerHTML = el.getAttribute("data-zh");
      }
    });

    var langBtn = document.querySelector(".lang-btn");
    if (langBtn) langBtn.textContent = l === "zh" ? "English" : "中文";

    /* 3) Update aria-labels for accessibility */
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
  function renderSearch(q) {
    var box = document.querySelector("#searchOverlay .search-results");
    if (!box) return;
    q = (q || "").trim().toLowerCase();
    if (!q) {
      box.innerHTML = '<div class="sr-empty" data-i18n="search.hint">' + t("search.hint") + "</div>";
      applyLang(lang);
      return;
    }
    var hits = [];
    SEARCH_INDEX.forEach(function (e) {
      /* search against BOTH zh and en fields so users can search in either language */
      var hay = (e.page + " " + e.title + " " + e.tags + " " +
                 (e.pageEn || "") + " " + (e.titleEn || "") + " " + (e.tagsEn || "")
      ).toLowerCase();
      if (hay.indexOf(q) !== -1) hits.push(e);
    });
    if (!hits.length) {
      box.innerHTML = '<div class="sr-empty">' + t("search.empty") + "</div>";
      return;
    }
    var isEn = lang === "en";
    box.innerHTML = hits.map(function (e) {
      var pg = isEn ? (e.pageEn || e.page) : e.page;
      var ti = isEn ? (e.titleEn || e.title) : e.title;
      var tg = isEn ? (e.tagsEn || e.tags) : e.tags;
      var snip = tg.split(" ").slice(0, 6).join(" · ");
      return '<a class="sr-item" href="' + e.url + '">' +
        '<div class="sr-page">' + pg + "</div>" +
        '<div class="sr-title">' + ti + "</div>" +
        '<div class="sr-snippet">' + snip + "</div></a>";
    }).join("");
  }
  function t(key) { return I18N[key] ? (I18N[key][lang] || I18N[key].zh) : key; }

  /* ---------- Init ---------- */
  function init() {
    applyDark(dark);
    applyLang(lang);

    /* set search button icon */
    var sb = document.querySelector(".search-btn");
    if (sb) sb.innerHTML = ICON_SEARCH;

    /* set search overlay icon */
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

    /* search */
    var ov = document.getElementById("searchOverlay");
    if (sb) sb.addEventListener("click", openSearch);
    if (ov) {
      var close = ov.querySelector(".search-close");
      if (close) close.addEventListener("click", closeSearch);
      ov.addEventListener("click", function (e) { if (e.target === ov) closeSearch(); });
      var inp = ov.querySelector("input");
      if (inp) {
        inp.setAttribute("data-i18n", "search.placeholder");
        inp.setAttribute("data-i18n-ph", "1");
        inp.addEventListener("input", function () { renderSearch(inp.value); });
      }
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeSearch();
        if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); openSearch(); }
      });
    }

    /* chip filters (if present on page) */
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

    applyLang(lang);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
