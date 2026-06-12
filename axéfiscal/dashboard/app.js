

document.addEventListener('DOMContentLoaded', () => {

  const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                 'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const now = new Date();
  document.getElementById('currentMonth').textContent =
    meses[now.getMonth()] + ' ' + now.getFullYear();

  const total       = transacoes.reduce((s, t) => s + t.valor, 0);
  const pixTotal    = transacoes.filter(t => t.metodo === 'PIX').reduce((s, t) => s + t.valor, 0);
  const cartaoTotal = transacoes.filter(t => t.metodo === 'CARTÃO').reduce((s, t) => s + t.valor, 0);

  const categoriasUnicas  = [...new Set(transacoes.map(t => t.categoria))];
  const valorPorCategoria = categoriasUnicas.map(cat =>
    transacoes.filter(t => t.categoria === cat).reduce((s, t) => s + t.valor, 0)
  );

  const fmt = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const pct = (v, tot) => tot > 0 ? ((v / tot) * 100).toFixed(1) + '% do total' : '—';

  document.getElementById('totalGastos').textContent      = fmt(total);
  document.getElementById('totalTransacoes').textContent  = transacoes.length + ' transações processadas';
  document.getElementById('totalPix').textContent         = fmt(pixTotal);
  document.getElementById('porcPix').textContent          = pct(pixTotal, total);
  document.getElementById('totalCartao').textContent      = fmt(cartaoTotal);
  document.getElementById('porcCartao').textContent       = pct(cartaoTotal, total);
  document.getElementById('categoriasAtivas').textContent = categoriasUnicas.length;

  buildBarChart(categoriasUnicas, valorPorCategoria);
  buildPieChart(pixTotal, cartaoTotal, total);

  const list = document.getElementById('txList');
  list.innerHTML = transacoes.slice(0, 5).map(t => `
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

  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });

}); 
function exportarPlanilha() {
  const btn = document.getElementById('btnPlanilha');
  btn.style.opacity       = '.6';
  btn.style.pointerEvents = 'none';

  const wb    = XLSX.utils.book_new();
  const total = transacoes.reduce((s, t) => s + t.valor, 0);

  const txData = [['Nº', 'Estabelecimento', 'Categoria', 'Data', 'Valor (R$)', 'Método']];
  transacoes.forEach((t, i) =>
    txData.push([i + 1, t.nome, t.categoria, t.data, t.valor, t.metodo])
  );
  txData.push([]);
  txData.push(['', '', '', 'TOTAL', parseFloat(total.toFixed(2)), '']);

  const wsTx = XLSX.utils.aoa_to_sheet(txData);
  wsTx['!cols'] = [{ wch: 5 }, { wch: 28 }, { wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 10 }];
  XLSX.utils.book_append_sheet(wb, wsTx, 'Transações');

  const cats    = {};
  transacoes.forEach(t => cats[t.categoria] = (cats[t.categoria] || 0) + t.valor);
  const catData = [['Categoria', 'Total (R$)', '% do Total']];

  Object.entries(cats)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, val]) =>
      catData.push([cat, parseFloat(val.toFixed(2)), parseFloat((val / total * 100).toFixed(1))])
    );
  catData.push([]);
  catData.push(['TOTAL', parseFloat(total.toFixed(2)), 100]);

  const wsCat = XLSX.utils.aoa_to_sheet(catData);
  wsCat['!cols'] = [{ wch: 18 }, { wch: 14 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, wsCat, 'Por Categoria');

  const pixVal    = transacoes.filter(t => t.metodo === 'PIX').reduce((s, t) => s + t.valor, 0);
  const cartaoVal = transacoes.filter(t => t.metodo === 'CARTÃO').reduce((s, t) => s + t.valor, 0);

  const metData = [
    ['Método', 'Total (R$)', 'Qtd. Transações', '% do Total'],
    ['PIX',    parseFloat(pixVal.toFixed(2)),    transacoes.filter(t => t.metodo === 'PIX').length,    parseFloat((pixVal    / total * 100).toFixed(1))],
    ['CARTÃO', parseFloat(cartaoVal.toFixed(2)), transacoes.filter(t => t.metodo === 'CARTÃO').length, parseFloat((cartaoVal / total * 100).toFixed(1))],
    [],
    ['TOTAL',  parseFloat(total.toFixed(2)), transacoes.length, 100],
  ];

  const wsMet = XLSX.utils.aoa_to_sheet(metData);
  wsMet['!cols'] = [{ wch: 12 }, { wch: 14 }, { wch: 20 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, wsMet, 'Por Método');

  XLSX.writeFile(wb, 'axe_fiscal.xlsx');

  btn.style.opacity       = '1';
  btn.style.pointerEvents = 'auto';
}
