// js/data.js — Palavras-chave para categorização automática

const categorias = {
  'Alimentação':  ['mercado', 'supermercado', 'restaurante', 'lanche', 'ifood', 'padaria', 'açougue', 'pizza', 'sushi', 'bar', 'cafe', 'café', 'almoço', 'jantar', 'feira'],
  'Transporte':   ['uber', '99', 'taxi', 'táxi', 'ônibus', 'metrô', 'metro', 'gasolina', 'posto', 'estacionamento', 'pedagio', 'pedágio', 'combustivel', 'combustível'],
  'Saúde':        ['farmácia', 'farmacia', 'remedio', 'remédio', 'médico', 'medico', 'consulta', 'exame', 'hospital', 'clinica', 'clínica', 'dentista', 'academia', 'smartfit'],
  'Moradia':      ['aluguel', 'condomínio', 'condominio', 'luz', 'água', 'agua', 'internet', 'gas', 'gás', 'iptu', 'reforma'],
  'Lazer':        ['netflix', 'cinema', 'teatro', 'show', 'viagem', 'hotel', 'spotify', 'jogo', 'game', 'amazon prime', 'disney'],
  'Educação':     ['livro', 'curso', 'faculdade', 'escola', 'mensalidade', 'udemy', 'alura', 'material'],
  'Vestuário':    ['roupa', 'calçado', 'calcado', 'tênis', 'tenis', 'camisa', 'loja', 'shopping'],
  'Outros':       [],
};

const metodosDisponiveis = [
  { value: 'dinheiro', label: 'DINHEIRO EM CÉDULAS' },
  { value: 'pix',      label: 'PIX' },
  { value: 'cartao',   label: 'CARTÃO DE CRÉDITO' },
  { value: 'debito',   label: 'CARTÃO DE DÉBITO' },
];
