// js/charts.js — Inicialização dos gráficos Chart.js

function buildBarChart(categorias, valores) {
  const ctx = document.getElementById('barChart').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: categorias,
      datasets: [{
        data: valores,
        backgroundColor: categorias.map(c => categoriaCores[c] || '#C4622D'),
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 40,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ' R$ ' + ctx.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: "'Sora', sans-serif", size: 11 }, color: '#8A7060' }
        },
        y: {
          grid: { color: '#F0EAE2' },
          ticks: {
            font: { family: "'DM Mono', monospace", size: 11 },
            color: '#B5A090',
            callback: v => 'R$ ' + v.toLocaleString('pt-BR')
          }
        }
      }
    }
  });
}

function buildPieChart(pixTotal, cartaoTotal, total) {
  const ctx = document.getElementById('pieChart').getContext('2d');
  const pixPct    = total > 0 ? ((pixTotal / total) * 100).toFixed(1) : 0;
  const cartaoPct = total > 0 ? ((cartaoTotal / total) * 100).toFixed(1) : 0;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['PIX', 'Cartão'],
      datasets: [{
        data: [pixTotal, cartaoTotal],
        backgroundColor: [metodoCores['PIX'], metodoCores['CARTÃO']],
        borderWidth: 0,
        hoverOffset: 6,
      }]
    },
    options: {
      cutout: '62%',
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ' R$ ' + ctx.parsed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
          }
        }
      }
    }
  });

  // Legend manual
  const legend = document.getElementById('pieLegend');
  const items = [
    { label: 'PIX',    pct: pixPct,    color: metodoCores['PIX'] },
    { label: 'Cartão', pct: cartaoPct, color: metodoCores['CARTÃO'] },
  ];
  legend.innerHTML = items.map(i => `
    <div class="legend-item">
      <span class="legend-dot" style="background:${i.color}"></span>
      <span>${i.label}</span>
      <span class="legend-pct">${i.pct}%</span>
    </div>
  `).join('');
}
