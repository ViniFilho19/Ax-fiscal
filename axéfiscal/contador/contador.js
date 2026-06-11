(function () {
  "use strict";

  const CLIENTS = [
    {
      id: "joao",
      name: "João Silva",
      cpf: "123.456.789-00",
      email: "joao@email.com",
      total: 2653.0,
      txCount: 10,
      dependents: 4,
    },
    {
      id: "maria",
      name: "Maria Santos",
      cpf: "987.654.321-00",
      email: "maria@email.com",
      total: 400.0,
      txCount: 2,
      dependents: 1,
    },
    {
      id: "pedro",
      name: "Pedro Costa",
      cpf: "456.789.123-00",
      email: "pedro@email.com",
      total: 595.8,
      txCount: 2,
      dependents: 2,
    },
  ];

  const TOTAL_CATEGORIES = 7;

  const TX = [
    {
      date: "19/03/2026",
      client: "joao",
      desc: "Restaurante Bella Vista",
      cat: "Alimentação",
      type: "CARTAO",
      value: 145.5,
      deductible: true,
    },
    {
      date: "19/03/2026",
      client: "maria",
      desc: "Supermercado Extra",
      cat: "Alimentação",
      type: "CARTAO",
      value: 280.0,
      deductible: true,
    },
    {
      date: "19/03/2026",
      client: "pedro",
      desc: "Conta de Luz",
      cat: "Moradia",
      type: "CARTAO",
      value: 245.8,
      deductible: false,
    },
    {
      date: "18/03/2026",
      client: "joao",
      desc: "Uber - Corrida",
      cat: "Transporte",
      type: "PIX",
      value: 32.8,
      deductible: true,
    },
    {
      date: "18/03/2026",
      client: "maria",
      desc: "Academia Fit",
      cat: "Saúde",
      type: "PIX",
      value: 120.0,
      deductible: true,
    },
    {
      date: "18/03/2026",
      client: "pedro",
      desc: "Loja de Roupas Fashion",
      cat: "Vestuário",
      type: "CARTAO",
      value: 350.0,
      deductible: false,
    },
    {
      date: "17/03/2026",
      client: "joao",
      desc: "Farmácia São Paulo",
      cat: "Saúde",
      type: "CARTAO",
      value: 89.9,
      deductible: true,
    },
    {
      date: "16/03/2026",
      client: "joao",
      desc: "Mercado Superbom",
      cat: "Alimentação",
      type: "CARTAO",
      value: 325.4,
      deductible: true,
    },
    {
      date: "15/03/2026",
      client: "joao",
      desc: "Aluguel Março",
      cat: "Moradia",
      type: "PIX",
      value: 1500.0,
      deductible: false,
    },
    {
      date: "14/03/2026",
      client: "joao",
      desc: "Netflix Streaming",
      cat: "Lazer",
      type: "CARTAO",
      value: 55.9,
      deductible: false,
    },
  ];

  const clientById = Object.fromEntries(CLIENTS.map((c) => [c.id, c]));
  let activeFilter = "all";

  /* ---------------------------------------------------------------------
     Helpers
  --------------------------------------------------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const brl = (n) =>
    "R$ " +
    n.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const clientName = (id) => (clientById[id] ? clientById[id].name : id);
  const visibleClients = () =>
    activeFilter === "all"
      ? CLIENTS
      : CLIENTS.filter((c) => c.id === activeFilter);
  const filterTx = (list) =>
    activeFilter === "all"
      ? list
      : list.filter((t) => t.client === activeFilter);

  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };

  /* ---------------------------------------------------------------------
     Render: stat cards
  --------------------------------------------------------------------- */
  function renderStats() {
    const cs = visibleClients();
    const totalProcessed = cs.reduce((s, c) => s + c.total, 0);
    const txTotal = cs.reduce((s, c) => s + c.txCount, 0);
    const categories =
      activeFilter === "all"
        ? TOTAL_CATEGORIES
        : new Set(filterTx(TX).map((t) => t.cat)).size;

    $('[data-metric="clients"]').textContent = cs.length;
    $('[data-metric="total"]').textContent = brl(totalProcessed);
    $('[data-metric="tx"]').textContent = txTotal;
    $('[data-metric="categories"]').textContent = categories;

    $('[data-note="clients"]').textContent =
      activeFilter === "all" ? "Ativos no sistema" : "Cliente selecionado";
    $('[data-note="total"]').textContent =
      activeFilter === "all" ? "Todos os clientes" : clientName(activeFilter);
    $('[data-note="tx"]').textContent = "Processadas automaticamente";
    $('[data-note="categories"]').textContent = "Categorizadas";
  }

  /* ---------------------------------------------------------------------
     Render: clients table
  --------------------------------------------------------------------- */
  function renderClients() {
    const body = $("#clientsBody");
    body.innerHTML = "";
    const rows = visibleClients();
    if (!rows.length) return body.appendChild(emptyRow(6));

    rows.forEach((c) => {
      const tr = el("tr");
      tr.innerHTML =
        `<td class="td-name">${c.name}</td>` +
        `<td>${c.cpf}</td>` +
        `<td>${c.email}</td>` +
        `<td class="value">${brl(c.total)}</td>` +
        `<td><span class="pill pill--count">${c.txCount}</span></td>`;
      const action = el("td");
      const btn = el(
        "button",
        "link-action",
        `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg> Ver Detalhes`,
      );
      btn.setAttribute("aria-label", `Ver detalhes de ${c.name}`);
      btn.addEventListener("click", () => setFilter(c.id, true));
      action.appendChild(btn);
      tr.appendChild(action);
      body.appendChild(tr);
    });
  }

  /* ---------------------------------------------------------------------
     Render: transaction tables
  --------------------------------------------------------------------- */
  const catPill = (cat) => `<span class="pill pill--cat">${cat}</span>`;
  const typePill = (type) =>
    type === "PIX"
      ? `<span class="pill pill--pix">PIX</span>`
      : `<span class="pill pill--cartao">CARTAO</span>`;

  function renderTxTable(bodyId, list) {
    const body = $(bodyId);
    body.innerHTML = "";
    const rows = filterTx(list);
    if (!rows.length) return body.appendChild(emptyRow(6));

    rows.forEach((t) => {
      const tr = el("tr");
      tr.innerHTML =
        `<td>${t.date}</td>` +
        `<td class="td-name">${clientName(t.client)}</td>` +
        `<td>${t.desc}</td>` +
        `<td>${catPill(t.cat)}</td>` +
        `<td>${typePill(t.type)}</td>` +
        `<td class="ta-right value">${brl(t.value)}</td>`;
      body.appendChild(tr);
    });
  }

  function emptyRow(cols) {
    const tr = el("tr", "empty");
    tr.innerHTML = `<td colspan="${cols}">Nenhum registro para este cliente.</td>`;
    return tr;
  }

  /* ---------------------------------------------------------------------
     Render: bar charts (pure DOM)
  --------------------------------------------------------------------- */
  function niceTicks(max, count) {
    const step = max / count;
    return Array.from({ length: count + 1 }, (_, i) => Math.round(step * i));
  }

  function renderChart(container, data, opts) {
    const { max, ticks, tickFormat, tipFormat } = opts;
    container.innerHTML = "";

    // grid + y-axis ticks
    const grid = el("div", "chart__grid");
    ticks.forEach((t) => {
      const frac = t / max;
      const line = el("div", "chart__line");
      line.style.bottom = frac * 100 + "%";
      const label = el("span", "chart__ytick", tickFormat ? tickFormat(t) : t);
      label.style.bottom = frac * 100 + "%";
      grid.appendChild(line);
      grid.appendChild(label);
    });
    container.appendChild(grid);

    // bars
    const bars = el("div", "chart__bars");
    data.forEach((d) => {
      const col = el("div", "bar-col");
      if (activeFilter !== "all" && d.id !== activeFilter)
        col.classList.add("is-dim");

      const bar = el("div", "bar");
      bar.style.height = Math.max((d.value / max) * 100, 0.5) + "%";
      bar.innerHTML = `<span class="bar__tip">${tipFormat ? tipFormat(d.value) : d.value}</span>`;

      const label = el("span", "bar-col__label", d.label);
      col.appendChild(bar);
      col.appendChild(label);
      bars.appendChild(col);
    });
    container.appendChild(bars);
  }

  function renderCharts() {
    // Spend chart — always comparative across the three clients.
    const spendMax = 2800;
    renderChart(
      $("#spendChart"),
      CLIENTS.map((c) => ({
        id: c.id,
        label: c.name.split(" ")[0],
        value: c.total,
      })),
      {
        max: spendMax,
        ticks: [0, 700, 1400, 2100, 2800],
        tipFormat: (v) => brl(v),
      },
    );

    // Dependents chart
    renderChart(
      $("#depChart"),
      CLIENTS.map((c) => ({
        id: c.id,
        label: c.name.split(" ")[0],
        value: c.dependents,
      })),
      { max: 4, ticks: [0, 1, 2, 3, 4] },
    );

    // Dependents legend pills
    const leg = $("#depLegend");
    leg.innerHTML = "";
    CLIENTS.forEach((c) => {
      const li = el("li", null, `${c.dependents} - ${c.name.split(" ")[0]}`);
      if (activeFilter !== "all" && c.id !== activeFilter)
        li.style.opacity = "0.4";
      leg.appendChild(li);
    });
  }

  /* ---------------------------------------------------------------------
     Filter orchestration
  --------------------------------------------------------------------- */
  function setFilter(id, scroll) {
    activeFilter = id;

    // Sidebar active states
    $$(".nav-btn[data-filter]").forEach((b) => {
      const on = b.dataset.filter === id;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });

    // Select label + options
    const label = id === "all" ? "Todos os clientes" : clientById[id].name;
    $("#selectValue").textContent = label;
    $$("#selectMenu li").forEach((li) =>
      li.setAttribute("aria-selected", String(li.dataset.value === id)),
    );

    // Title context
    $("#dashSub").textContent =
      id === "all"
        ? "Gerencie e analise as finanças de todos os seus clientes"
        : `Analisando as finanças de ${clientById[id].name}`;

    renderStats();
    renderClients();
    renderTxTable("#recentBody", TX);
    renderTxTable(
      "#deductBody",
      TX.filter((t) => t.deductible),
    );
    renderCharts();

    closeDrawer();
    if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------------------------------------------------------------------
     Custom select (listbox) — keyboard accessible
  --------------------------------------------------------------------- */
  function initSelect() {
    const select = $("#clientSelect");
    const trigger = $("#selectTrigger");
    const menu = $("#selectMenu");
    const options = $$("#selectMenu li");

    const open = () => {
      select.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      menu.hidden = false;
      const sel =
        options.find((o) => o.getAttribute("aria-selected") === "true") ||
        options[0];
      sel.tabIndex = 0;
      sel.focus();
    };
    const close = () => {
      select.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
      menu.hidden = true;
    };
    const toggle = () => (menu.hidden ? open() : close());

    trigger.addEventListener("click", toggle);
    trigger.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });

    options.forEach((opt, i) => {
      opt.tabIndex = -1;
      opt.addEventListener("click", () => {
        setFilter(opt.dataset.value, false);
        close();
        trigger.focus();
      });
      opt.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFilter(opt.dataset.value, false);
          close();
          trigger.focus();
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          (options[i + 1] || options[0]).focus();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          (options[i - 1] || options[options.length - 1]).focus();
        } else if (e.key === "Escape") {
          close();
          trigger.focus();
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (!select.contains(e.target)) close();
    });
  }

  /* ---------------------------------------------------------------------
     Sidebar nav
  --------------------------------------------------------------------- */
  function initNav() {
    $$(".nav-btn[data-filter]").forEach((b) =>
      b.addEventListener("click", () => setFilter(b.dataset.filter, false)),
    );
    $("#logoutBtn").addEventListener("click", () =>
      toast("Sessão encerrada (demonstração)."),
    );
  }

  /* ---------------------------------------------------------------------
     Mobile drawer
  --------------------------------------------------------------------- */
  const sidebar = () => $("#sidebar");
  function openDrawer() {
    sidebar().classList.add("is-open");
    $("#backdrop").hidden = false;
    $("#menuToggle").setAttribute("aria-expanded", "true");
  }
  function closeDrawer() {
    sidebar().classList.remove("is-open");
    $("#backdrop").hidden = true;
    $("#menuToggle").setAttribute("aria-expanded", "false");
  }
  function initDrawer() {
    $("#menuToggle").addEventListener("click", () =>
      sidebar().classList.contains("is-open") ? closeDrawer() : openDrawer(),
    );
    $("#backdrop").addEventListener("click", closeDrawer);
  }

  /* ---------------------------------------------------------------------
     Report modal
  --------------------------------------------------------------------- */
  function initReport() {
    const modal = $("#reportModal");
    const openModal = () => {
      buildReport();
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      $("#modalClose").focus();
    };
    const closeModal = () => {
      modal.hidden = true;
      document.body.style.overflow = "";
      $("#reportBtn").focus();
    };

    $("#reportBtn").addEventListener("click", openModal);
    $("#modalClose").addEventListener("click", closeModal);
    $("#modalCancel").addEventListener("click", closeModal);
    $("#modalPrint").addEventListener("click", () => window.print());
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });
  }

  function buildReport() {
    const cs = visibleClients();
    const deductible = filterTx(TX).filter((t) => t.deductible);
    const dedTotal = deductible.reduce((s, t) => s + t.value, 0);
    const processed = cs.reduce((s, c) => s + c.total, 0);

    $("#modalSub").textContent =
      activeFilter === "all"
        ? "Resumo consolidado de todos os clientes para a declaração do IR."
        : `Resumo de ${clientName(activeFilter)} para a declaração do IR.`;

    let rows = cs
      .map((c) => `<tr><td>${c.name}</td><td>${brl(c.total)}</td></tr>`)
      .join("");
    rows +=
      `<tr><td>Transações dedutíveis</td><td>${deductible.length}</td></tr>` +
      `<tr><td>Valor dedutível estimado</td><td>${brl(dedTotal)}</td></tr>` +
      `<tr class="total-row"><td>Total processado</td><td>${brl(processed)}</td></tr>`;

    $("#modalBody").innerHTML = `<table><tbody>${rows}</tbody></table>`;
  }

  /* ---------------------------------------------------------------------
     Toast
  --------------------------------------------------------------------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.hidden = false;
    requestAnimationFrame(() => t.classList.add("is-show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      t.classList.remove("is-show");
      setTimeout(() => (t.hidden = true), 300);
    }, 2600);
  }

  /* ---------------------------------------------------------------------
     Boot
  --------------------------------------------------------------------- */
  function init() {
    initNav();
    initSelect();
    initDrawer();
    initReport();
    setFilter("all", false); // initial render
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
