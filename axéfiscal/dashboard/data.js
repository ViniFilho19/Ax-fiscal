// js/data.js — Dados financeiros do cliente

const transacoes = [
  { nome: 'Restaurante Bella Vista', categoria: 'Alimentação', data: '18/03/2026', valor: 145.50, metodo: 'CARTÃO', icone: 'ti-tools-kitchen-2' },
  { nome: 'Uber — Corrida',          categoria: 'Transporte',  data: '18/03/2026', valor: 32.80,  metodo: 'PIX',    icone: 'ti-bolt' },
  { nome: 'Farmácia São Paulo',       categoria: 'Saúde',       data: '17/03/2026', valor: 89.90,  metodo: 'CARTÃO', icone: 'ti-tools-kitchen-2' },
  { nome: 'Mercado Superbom',         categoria: 'Alimentação', data: '16/03/2026', valor: 325.40, metodo: 'CARTÃO', icone: 'ti-tools-kitchen-2' },
  { nome: 'Aluguel Março',            categoria: 'Moradia',     data: '15/03/2026', valor: 1500.00,metodo: 'PIX',    icone: 'ti-bolt' },
  { nome: 'Netflix',                  categoria: 'Lazer',       data: '14/03/2026', valor: 55.90,  metodo: 'CARTÃO', icone: 'ti-tools-kitchen-2' },
  { nome: 'iFood — Jantar',           categoria: 'Alimentação', data: '13/03/2026', valor: 78.60,  metodo: 'PIX',    icone: 'ti-bolt' },
  { nome: 'Academia SmartFit',        categoria: 'Saúde',       data: '10/03/2026', valor: 99.90,  metodo: 'CARTÃO', icone: 'ti-tools-kitchen-2' },
  { nome: 'Posto Shell — Gasolina',   categoria: 'Transporte',  data: '09/03/2026', valor: 220.00, metodo: 'PIX',    icone: 'ti-bolt' },
  { nome: 'Livros — Amazon',          categoria: 'Educação',    data: '07/03/2026', valor: 105.30, metodo: 'CARTÃO', icone: 'ti-tools-kitchen-2' },
];

// Cores por categoria
const categoriaCores = {
  'Alimentação': '#C4622D',
  'Transporte':  '#5DCAA5',
  'Saúde':       '#378ADD',
  'Moradia':     '#5C1F00',
  'Lazer':       '#E8A882',
  'Educação':    '#7a2800',
};

// Cores dos métodos de pagamento
const metodoCores = {
  'PIX':    '#5DCAA5',
  'CARTÃO': '#1A1208',
};
