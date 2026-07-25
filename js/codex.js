/* ===== Codex Page Logic ===== */
/* Issue 1: Render all 95 creatures dynamically */
/* Issue 2: Card click → detail modal */
/* Issue 3: Type effectiveness calculator */
/* Issue 4: Multi-dimensional filters (element/role/stage/sort) */
/* Issue 5: Tier list (PvE/PvP) */
/* Issue 7: Evolution chain visualization */
/* Issue 8: Skills & traits display */
/* Issue 18: Six-stat bars on cards */
/* Issue 10: Data update markers */

var codexLang = "zh";
var codexFilters = { element: "all", role: "all", stage: "all", sort: "no", search: "" };

function elName(el) { return EL_NAMES[el] ? EL_NAMES[el][codexLang] : el; }
function roleName(r) { return ROLE_NAMES[r] ? ROLE_NAMES[r][codexLang] : r; }
function stageName(s) {
  var map = { "Lumin": codexLang === "zh" ? "Lumin" : "Lumin", "Gamma": "Gamma", "Nova": "Nova",
    "Basic Form": codexLang === "zh" ? "基础形态" : "Basic Form", "—": "—", "Starter": codexLang === "zh" ? "初始" : "Starter" };
  return map[s] || s;
}

/* ---------- Render creature cards ---------- */
function renderCodex() {
  codexLang = localStorage.getItem("aniimo-lang") || "zh";
  var grid = document.getElementById("creatureGrid");
  if (!grid || typeof CREATURES === "undefined") return;

  var filtered = CREATURES.filter(function (c) {
    if (codexFilters.element !== "all" && c.el !== codexFilters.element && c.el2 !== codexFilters.element) return false;
    if (codexFilters.role !== "all" && c.role !== codexFilters.role) return false;
    if (codexFilters.stage !== "all" && c.stage !== codexFilters.stage) return false;
    if (codexFilters.search) {
      var q = codexFilters.search.toLowerCase();
      var hay = (c.name + " " + c.nameZh + " " + c.no + " " + c.el + " " + c.role).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  });

  /* Sort */
  if (codexFilters.sort === "total-desc") filtered.sort(function (a, b) { return b.hp + b.brk + b.atk + b.pdef + b.mdef + b.regen - (a.hp + a.brk + a.atk + a.pdef + a.mdef + a.regen); });
  else if (codexFilters.sort === "atk-desc") filtered.sort(function (a, b) { return b.atk - a.atk; });
  else if (codexFilters.sort === "brk-desc") filtered.sort(function (a, b) { return b.brk - a.brk; });
  else if (codexFilters.sort === "hp-desc") filtered.sort(function (a, b) { return b.hp - a.hp; });
  else if (codexFilters.sort === "no-asc") filtered.sort(function (a, b) { return (a.no === "—" ? 999 : parseInt(a.no)) - (b.no === "—" ? 999 : parseInt(b.no)); });

  /* Update count */
  var countEl = document.getElementById("creatureCount");
  if (countEl) countEl.textContent = filtered.length + " / " + CREATURES.length;

  if (!filtered.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--ink-soft)">' +
      (codexLang === "zh" ? "没有找到符合条件的伊莫" : "No Aniimo found matching these filters") + "</div>";
    return;
  }

  grid.innerHTML = filtered.map(function (c) {
    var total = c.hp + c.brk + c.atk + c.pdef + c.mdef + c.regen;
    var maxStat = Math.max(c.hp, c.brk, c.atk, c.pdef, c.mdef, c.regen);
    var typeBadges = '<span class="type-badge t-' + c.el + '">' + elName(c.el) + "</span>" +
      (c.el2 ? '<span class="type-badge t-' + c.el2 + '">' + elName(c.el2) + "</span>" : "");
    var desc = codexLang === "zh" ? c.desc : c.descEn;

    /* Issue 18: Six-stat mini bars */
    var statBar = function (label, val) {
      var pct = Math.round(val / 130 * 100);
      var color = pct > 80 ? "#2e7d32" : pct > 50 ? "var(--azure)" : "var(--ink-soft)";
      return '<div class="mini-stat"><span class="ms-label">' + label + '</span><div class="ms-bar"><div class="ms-fill" style="width:' + pct + "%;background:" + color + '"></div></div><span class="ms-val">' + val + "</span></div>";
    };
    var statsHtml = '<div class="card-stats">' +
      statBar("HP", c.hp) + statBar("BRK", c.brk) + statBar("ATK", c.atk) +
      statBar("P.DEF", c.pdef) + statBar("M.DEF", c.mdef) + statBar("REG", c.regen) +
      "</div>";

    var roleBadge = '<span class="role-badge role-' + c.role.toLowerCase() + '">' + roleName(c.role) + "</span>";

    return '<div class="creature-card" data-type="' + c.el + '" data-no="' + c.no + '" data-role="' + c.role + '" data-stage="' + c.stage + '" onclick="openCreatureDetail(\'' + c.no + "','" + c.name.replace(/'/g, "\\'") + "')\">" +
      '<div class="creature-head"><div class="creature-no">' + c.no + "</div><div>" +
      "<h4>" + (codexLang === "zh" ? c.nameZh : c.name) + '</h4><div class="cn-name">' + elName(c.el) + (c.el2 ? "/" + elName(c.el2) : "") + " · " + roleName(c.role) + "</div></div></div>" +
      "<p>" + (desc || "") + "</p>" +
      '<div class="type-row">' + typeBadges + roleBadge + "</div>" +
      '<div class="form-tag">' + (codexLang === "zh" ? "阶段" : "Stage") + ": " + stageName(c.stage) + " · " + (codexLang === "zh" ? "总和" : "Total") + " " + total + "</div>" +
      statsHtml +
      "</div>";
  }).join("");

  /* Cards are already rendered with the correct language via codexLang.
     Do NOT call applyLang() here — it would cause infinite recursion
     (applyLang → renderCodex → applyLang → …). */

  /* Re-render calculator and tier list to reflect language change */
  initCalculator();
  renderTierList();
}

/* ---------- Creature detail modal (Issue 2) ---------- */
function openCreatureDetail(no, name) {
  var c = CREATURES.find(function (x) { return x.no === no && x.name === name; });
  if (!c) return;
  var modal = document.getElementById("creatureModal");
  if (!modal) return;
  var total = c.hp + c.brk + c.atk + c.pdef + c.mdef + c.regen;
  var isZh = codexLang === "zh";

  /* Find evolution chain */
  var evoHtml = "";
  if (c.evo && c.evo.length) {
    evoHtml = '<div class="evo-chain">' +
      '<div class="evo-node current"><div class="evo-num">' + c.no + "</div><div class='evo-name'>" + (isZh ? c.nameZh : c.name) + "</div></div>";
    c.evo.forEach(function (evoNo) {
      var evo = CREATURES.find(function (x) { return x.no === evoNo; });
      if (evo) {
        evoHtml += '<div class="evo-arrow">→</div>' +
          '<div class="evo-node" onclick="openCreatureDetail(\'' + evo.no + "','" + evo.name.replace(/'/g, "\\'") + '\')">' +
          '<div class="evo-num">' + evo.no + "</div><div class='evo-name'>" + (isZh ? evo.nameZh : evo.name) + "</div></div>";
      }
    });
    evoHtml += "</div>";
  }

  /* Find pre-evolutions */
  var preEvo = CREATURES.find(function (x) { return x.evo && x.evo.indexOf(c.no) !== -1; });
  if (preEvo) {
    evoHtml = '<div class="evo-chain">' +
      '<div class="evo-node" onclick="openCreatureDetail(\'' + preEvo.no + "','" + preEvo.name.replace(/'/g, "\\'") + '\')">' +
      '<div class="evo-num">' + preEvo.no + "</div><div class='evo-name'>" + (isZh ? preEvo.nameZh : preEvo.name) + "</div></div>" +
      '<div class="evo-arrow">→</div>' +
      '<div class="evo-node current"><div class="evo-num">' + c.no + "</div><div class='evo-name'>" + (isZh ? c.nameZh : c.name) + "</div></div>" +
      (evoHtml ? evoHtml.replace('<div class="evo-chain">', "").replace(/<\/div>$/, "") : "") +
      "</div>";
  }

  /* Skills */
  var skillsHtml = "";
  if (c.skills && c.skills.length) {
    skillsHtml = '<div class="detail-section"><h4>' + (isZh ? "技能" : "Skills") + '</h4><div class="skill-list">' +
      c.skills.map(function (s) {
        return '<div class="skill-item"><div class="skill-head"><span class="skill-name">' + (isZh ? s.nZh : s.n) + "</span>" +
          '<span class="skill-tags">' +
          '<span class="type-badge t-' + s.el + '">' + elName(s.el) + "</span>" +
          '<span class="skill-type">' + s.t + "</span>" +
          (s.ep > 0 ? '<span class="skill-ep">EP ' + s.ep + "</span>" : "") +
          "</span></div>" +
          '<div class="skill-stats"><span>' + (isZh ? "威力" : "Power") + ": <b>" + s.pw + "</b></span></div>" +
          "</div>";
      }).join("") + "</div></div>";
  }

  /* Traits */
  var traitsHtml = "";
  if (c.traits && c.traits.length) {
    traitsHtml = '<div class="detail-section"><h4>' + (isZh ? "特性" : "Traits") + '</h4><div class="trait-list">' +
      c.traits.map(function (tr) {
        return '<div class="trait-item"><div class="trait-name">' + (isZh ? tr.nZh : tr.n) + "</div><div class='trait-desc'>" + (isZh ? tr.d : tr.d) + "</div></div>";
      }).join("") + "</div></div>";
  }

  /* Habitats */
  var habitatsHtml = "";
  if (c.habitats && c.habitats.length) {
    habitatsHtml = '<div class="detail-section"><h4>' + (isZh ? "栖息地" : "Habitats") + '</h4><div class="habitat-list">' +
      c.habitats.map(function (h) { return '<span class="habitat-tag">' + h + "</span>"; }).join("") + "</div></div>";
  }

  /* Type badges */
  var typeBadges = '<span class="type-badge t-' + c.el + '">' + elName(c.el) + "</span>" +
    (c.el2 ? '<span class="type-badge t-' + c.el2 + '">' + elName(c.el2) + "</span>" : "");

  /* Stat bars (larger version) */
  var statBar = function (label, val) {
    var pct = Math.round(val / 130 * 100);
    var color = pct > 80 ? "#2e7d32" : pct > 50 ? "var(--azure)" : "var(--ink-soft)";
    return '<div class="stat-row"><span class="stat-row-label">' + label + '</span><div class="stat-row-bar"><div class="stat-row-fill" style="width:' + pct + "%;background:" + color + '"></div></div><span class="stat-row-val">' + val + "</span></div>";
  };

  var body = modal.querySelector(".modal-body");
  if (body) {
    body.innerHTML =
      '<div class="detail-header">' +
        '<div class="creature-no">' + c.no + "</div>" +
        '<div><h3>' + (isZh ? c.nameZh : c.name) + '</h3><div class="detail-sub">' + elName(c.el) + (c.el2 ? "/" + elName(c.el2) : "") + " · " + roleName(c.role) + " · " + stageName(c.stage) + "</div></div>" +
        '<button class="modal-close" onclick="closeCreatureDetail()" aria-label="Close">×</button>' +
      "</div>" +
      '<p class="detail-desc">' + (isZh ? c.desc : c.descEn) + "</p>" +
      '<div class="detail-types">' + typeBadges + "</div>" +
      (c.forms ? '<div class="detail-forms"><b>' + (isZh ? "形态" : "Forms") + ":</b> " + c.forms + "</div>" : "") +
      '<div class="detail-stats-grid">' +
        statBar("HP", c.hp) + statBar("BREAK", c.brk) + statBar("ATK", c.atk) +
        statBar("P.DEF", c.pdef) + statBar("M.DEF", c.mdef) + statBar("REGEN", c.regen) +
        '<div class="stat-row total-row"><span class="stat-row-label">TOTAL</span><span class="stat-row-val">' + total + "</span></div>" +
      "</div>" +
      (evoHtml ? '<div class="detail-section"><h4>' + (isZh ? "进化链" : "Evolution") + "</h4>" + evoHtml + "</div>" : "") +
      skillsHtml + traitsHtml + habitatsHtml +
      '<div class="detail-source">' + (isZh ? "数据来源：aniimotools.dev / wiki.aniimo.com · Beta 测试值" : "Source: aniimotools.dev / wiki.aniimo.com · Beta values") + "</div>";
  }
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeCreatureDetail() {
  var modal = document.getElementById("creatureModal");
  if (modal) modal.classList.remove("show");
  document.body.style.overflow = "";
}

/* ---------- Type Calculator (Issue 3) ---------- */
function initCalculator() {
  var box = document.getElementById("calcBox");
  if (!box || typeof TYPE_CHART === "undefined") return;
  var isZh = codexLang === "zh";
  var elements = ["fire","water","grass","electric","ice","earth","wind","light","dark"];

  var options = elements.map(function (e) { return '<option value="' + e + '">' + elName(e) + "</option>"; }).join("");

  box.innerHTML =
    '<div class="calc-row"><label>' + (isZh ? "攻击属性" : "Attack Type") + '</label><select id="calcAtk">' + options + "</select></div>" +
    '<div class="calc-row"><label>' + (isZh ? "防御属性" : "Defense Type") + '</label><select id="calcDef">' + options + "</select></div>" +
    '<div class="calc-row"><label>' + (isZh ? "技能威力" : "Skill Power") + '</label><input type="number" id="calcPower" value="80" min="0" max="999"></div>' +
    '<div class="calc-result" id="calcResult"></div>';

  function calc() {
    var atk = document.getElementById("calcAtk").value;
    var def = document.getElementById("calcDef").value;
    var power = parseInt(document.getElementById("calcPower").value) || 0;
    var mult = 1.0;
    var label = isZh ? "中性" : "Neutral";
    var cls = "nn";
    if (TYPE_CHART[atk] && TYPE_CHART[atk][def]) {
      mult = TYPE_CHART[atk][def];
      if (mult > 1) { label = isZh ? "强效！" : "Super Effective!"; cls = "se"; }
      else if (mult < 1) { label = isZh ? "抵抗" : "Resisted"; cls = "ne"; }
    }
    var dmg = Math.round(power * mult);
    var res = document.getElementById("calcResult");
    res.innerHTML =
      '<div class="rline"><span>' + (isZh ? "倍率" : "Multiplier") + '</span><b class="' + cls + '">' + mult + "x</b></div>" +
      '<div class="rline"><span>' + (isZh ? "效果" : "Effectiveness") + '</span><b class="' + cls + '">' + label + "</b></div>" +
      '<div class="rline"><span>' + (isZh ? "预计伤害" : "Est. Damage") + '</span><b class="big ' + cls + '">' + dmg + "</b></div>";
  }
  document.getElementById("calcAtk").addEventListener("change", calc);
  document.getElementById("calcDef").addEventListener("change", calc);
  document.getElementById("calcPower").addEventListener("input", calc);
  calc();
}

/* ---------- Tier List (Issue 5) ---------- */
function renderTierList() {
  var box = document.getElementById("tierListBox");
  if (!box || typeof TIER_LIST === "undefined") return;
  var mode = document.getElementById("tierMode").dataset.mode || "PvE";
  var isZh = codexLang === "zh";
  var tiers = TIER_LIST[mode];
  var tierColors = { SS: "#E46161", S: "#E8A534", A: "#51B17A", B: "#0589DF", C: "#9063F3", D: "#888" };

  box.innerHTML = Object.keys(tiers).map(function (tier) {
    var creatures = tiers[tier];
    if (!creatures.length) return "";
    var cards = creatures.map(function (name) {
      var c = CREATURES.find(function (x) { return x.name === name; });
      if (!c) return "";
      return '<div class="tier-creature" onclick="openCreatureDetail(\'' + c.no + "','" + c.name.replace(/'/g, "\\'") + '\')" title="' + (isZh ? c.nameZh : c.name) + '">' +
        '<span class="type-badge t-' + c.el + '">' + elName(c.el) + "</span>" +
        "<span>" + (isZh ? c.nameZh : c.name) + "</span></div>";
    }).join("");
    return '<div class="tier-row" style="border-left:5px solid ' + tierColors[tier] + '">' +
      '<div class="tier-label" style="background:' + tierColors[tier] + ';color:#fff">' + tier + "</div>" +
      '<div class="tier-creatures">' + cards + "</div></div>";
  }).join("");
}

/* ---------- Init codex ---------- */
function initCodex() {
  if (typeof CREATURES === "undefined") return;

  /* Filter chips - elements */
  var elChips = document.querySelectorAll(".chip[data-filter]");
  elChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      codexFilters.element = chip.dataset.filter;
      elChips.forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      renderCodex();
    });
  });

  /* Role filter */
  var roleSelect = document.getElementById("filterRole");
  if (roleSelect) roleSelect.addEventListener("change", function () { codexFilters.role = this.value; renderCodex(); });

  /* Stage filter */
  var stageSelect = document.getElementById("filterStage");
  if (stageSelect) stageSelect.addEventListener("change", function () { codexFilters.stage = this.value; renderCodex(); });

  /* Sort */
  var sortSelect = document.getElementById("filterSort");
  if (sortSelect) sortSelect.addEventListener("change", function () { codexFilters.sort = this.value; renderCodex(); });

  /* Search */
  var searchInput = document.getElementById("codexSearch");
  if (searchInput) searchInput.addEventListener("input", function () { codexFilters.search = this.value; renderCodex(); });

  /* Tier mode toggle */
  var tierBtns = document.querySelectorAll(".tier-mode-btn");
  tierBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      tierBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      document.getElementById("tierMode").dataset.mode = btn.dataset.mode;
      renderTierList();
    });
  });

  /* Modal close on backdrop click */
  var modal = document.getElementById("creatureModal");
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeCreatureDetail();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("show")) closeCreatureDetail();
    });
  }

  /* Init calculator */
  initCalculator();

  /* Init tier list */
  renderTierList();

  /* Initial render */
  renderCodex();

  /* Check URL hash for direct creature link */
  if (location.hash.indexOf("#creature-") === 0) {
    var no = location.hash.replace("#creature-", "");
    var c = CREATURES.find(function (x) { return x.no === no; });
    if (c) setTimeout(function () { openCreatureDetail(c.no, c.name); }, 300);
  }
}
