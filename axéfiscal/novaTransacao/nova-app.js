// js/app.js — Lógica da tela Nova Transação

document.addEventListener('DOMContentLoaded', () => {

  // ── Elementos ──────────────────────────────────────────
  const form             = document.getElementById('transacaoForm');
  const selectBtn        = document.getElementById('selectBtn');
  const selectLabel      = document.getElementById('selectLabel');
  const dropdownList     = document.getElementById('dropdownList');
  const descricaoInput   = document.getElementById('descricao');
  const valorInput       = document.getElementById('valor');
  const dataInput        = document.getElementById('data');
  const categoriaHint    = document.getElementById('categoriaDetectada');
  const toast            = document.getElementById('toast');
  const btnRegistrar     = document.getElementById('btnRegistrar');

  let metodoSelecionado  = 'dinheiro';

  // ── Data padrão: hoje ──────────────────────────────────
  const hoje = new Date().toISOString().split('T')[0];
  dataInput.value = hoje;
  dataInput.max   = hoje;

  // ── Dropdown ───────────────────────────────────────────
  selectBtn.addEventListener('click', () => {
    const open = dropdownList.classList.toggle('show');
    selectBtn.classList.toggle('open', open);
    selectBtn.setAttribute('aria-expanded', open);
  });

  dropdownList.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      metodoSelecionado = item.dataset.value;
      selectLabel.textContent = item.textContent;

      dropdownList.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');

      dropdownList.classList.remove('show');
      selectBtn.classList.remove('open');
      selectBtn.setAttribute('aria-expanded', false);
      selectBtn.classList.remove('error');
    });
  });

  document.addEventListener('click', e => {
    if (!selectBtn.contains(e.target) && !dropdownList.contains(e.target)) {
      dropdownList.classList.remove('show');
      selectBtn.classList.remove('open');
      selectBtn.setAttribute('aria-expanded', false);
    }
  });

  // ── Máscara de valor monetário ─────────────────────────
  valorInput.addEventListener('input', () => {
    let raw = valorInput.value.replace(/\D/g, '');
    if (raw === '') { valorInput.value = ''; return; }
    const num = (parseInt(raw, 10) / 100).toFixed(2);
    valorInput.value = num.replace('.', ',');
    valorInput.classList.remove('error');
    removeErrorMsg(valorInput);
  });

  // ── Categorização automática ───────────────────────────
  let debounce;
  descricaoInput.addEventListener('input', () => {
    descricaoInput.classList.remove('error');
    removeErrorMsg(descricaoInput);
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const cat = detectarCategoria(descricaoInput.value.trim());
      categoriaHint.textContent = cat ? `📂 Categoria detectada: ${cat}` : '';
    }, 300);
  });

  function detectarCategoria(texto) {
    if (!texto) return '';
    const lower = texto.toLowerCase();
    for (const [cat, palavras] of Object.entries(categorias)) {
      if (cat === 'Outros') continue;
      if (palavras.some(p => lower.includes(p))) return cat;
    }
    return 'Outros';
  }

  // ── Validação ──────────────────────────────────────────
  function showError(input, msg) {
    input.classList.add('error');
    const existing = input.parentElement.querySelector('.error-msg');
    if (!existing) {
      const span = document.createElement('span');
      span.className = 'error-msg';
      span.textContent = msg;
      input.parentElement.appendChild(span);
    }
  }

  function removeErrorMsg(input) {
    const msg = input.parentElement.querySelector('.error-msg');
    if (msg) msg.remove();
  }

  function validarForm() {
    let valido = true;

    if (!descricaoInput.value.trim()) {
      showError(descricaoInput, 'Informe uma descrição para a transação.');
      valido = false;
    }

    const valorRaw = valorInput.value.replace(',', '.').replace(/[^\d.]/g, '');
    if (!valorRaw || parseFloat(valorRaw) <= 0) {
      showError(valorInput, 'Informe um valor válido.');
      valido = false;
    }

    if (!dataInput.value) {
      showError(dataInput, 'Selecione a data da transação.');
      valido = false;
    }

    return valido;
  }

  // ── Submit ─────────────────────────────────────────────
  form.addEventListener('submit', e => {
    e.preventDefault();

    if (!validarForm()) return;

    const descricao = descricaoInput.value.trim();
    const valorRaw  = valorInput.value.replace(',', '.').replace(/[^\d.]/g, '');
    const valor     = parseFloat(valorRaw);
    const data      = dataInput.value;
    const metodo    = metodosDisponiveis.find(m => m.value === metodoSelecionado)?.label || metodosDisponiveis[0].label;
    const categoria = detectarCategoria(descricao) || 'Outros';

    const transacao = { descricao, valor, data, metodo, categoria };
    salvarTransacao(transacao);

    exibirToast(`✔ Transação registrada em "${categoria}"`);
    resetForm();
  });

  // ── Salvar no localStorage ─────────────────────────────
  function salvarTransacao(t) {
    const existentes = JSON.parse(localStorage.getItem('transacoes') || '[]');
    existentes.unshift({ ...t, id: Date.now() });
    localStorage.setItem('transacoes', JSON.stringify(existentes));
  }

  // ── Reset ──────────────────────────────────────────────
  function resetForm() {
    descricaoInput.value  = '';
    valorInput.value      = '';
    dataInput.value       = hoje;
    categoriaHint.textContent = '';
    metodoSelecionado     = 'dinheiro';
    selectLabel.textContent = 'DINHEIRO EM CÉDULAS';
    dropdownList.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('selected'));
  }

  // ── Toast ──────────────────────────────────────────────
  function exibirToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // ── Navegação lateral ──────────────────────────────────
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });

});
