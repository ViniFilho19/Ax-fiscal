// js/app.js — Lógica principal do dashboard

document.addEventListener('DOMContentLoaded', () => {

  // ── Mês atual ──────────────────────────────────────────
  const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                 'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const now = new Date();
  document.getElementById('currentMonth').textContent =
    meses[now.getMonth()] + ' ' + now.getFullYear();

  // ── Cálculos ───────────────────────────────────────────
  const total      = transacoes.reduce((s, t) => s + t.valor, 0);
  const pixTotal   = transacoes.filter(t => t.metodo === 'PIX').reduce((s, t) => s + t.valor, 0);
  const cartaoTotal= transacoes.filter(t => t.metodo === 'CARTÃO').reduce((s, t) => s + t.valor, 0);

  const categoriasUnicas = [...new Set(transacoes.map(t => t.categoria))];
  const valorPorCategoria = categoriasUnicas.map(cat =>
    transacoes.filter(t => t.categoria === cat).reduce((s, t) => s + t.valor, 0)
  );

  const fmt = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const pct = (v, tot) => tot > 0 ? ((v / tot) * 100).toFixed(1) + '% do total' : '—';

  // ── Métricas ───────────────────────────────────────────
  document.getElementById('totalGastos').textContent    = fmt(total);
  document.getElementById('totalTransacoes').textContent= transacoes.length + ' transações processadas';
  document.getElementById('totalPix').textContent       = fmt(pixTotal);
  document.getElementById('porcPix').textContent        = pct(pixTotal, total);
  document.getElementById('totalCartao').textContent    = fmt(cartaoTotal);
  document.getElementById('porcCartao').textContent     = pct(cartaoTotal, total);
  document.getElementById('categoriasAtivas').textContent = categoriasUnicas.length;

  // ── Gráficos ───────────────────────────────────────────
  buildBarChart(categoriasUnicas, valorPorCategoria);
  buildPieChart(pixTotal, cartaoTotal, total);

  // ── Transações recentes ────────────────────────────────
  const list = document.getElementById('txList');
  const recentes = transacoes.slice(0, 5);

  list.innerHTML = recentes.map(t => `
    <li class="tx-item">
      <div class="tx-avatar">
        <i class="ti ${t.icone}" aria-hidden="true"></i>
      </div>
      <div class="tx-info">
        <p class="tx-name">${t.nome}</p>
        <p class="tx-meta">${t.categoria} • ${t.data}</p>
      </div>
      <div class="tx-right">
        <p class="tx-value">${fmt(t.valor)}</p>
        <p class="tx-method">${t.metodo}</p>
      </div>
    </li>
  `).join('');

  // ── Navegação lateral ──────────────────────────────────
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });

});
