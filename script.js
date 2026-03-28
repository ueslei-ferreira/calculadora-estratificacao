// ============================================================
// FUNÇÕES DE VALIDAÇÃO E CÁLCULO DE RISCO
// ============================================================

/**
 * Classifica o HbA1c baseado no valor
 */
function classificarHbA1c(valor) {
  if (valor <= 7.0) return 'baixo';
  if (valor <= 9.0) return 'medio';
  return 'alto';
}

/**
 * Classifica a pressão arterial baseado em PAS e PAD
 */
function classificarPA(pas, pad) {
  // Alto: PAS > 160 OU PAD > 90
  if (pas > 160 || pad > 90) return 'alto';
  // Médio: PAS entre 130-160 OU PAD entre 80-90
  if ((pas >= 130 && pas <= 160) || (pad >= 80 && pad <= 90)) return 'medio';
  // Baixo: PAS < 130 E PAD < 80
  return 'baixo';
}

/**
 * Obtém o rótulo de classificação
 */
function getRotulo(classificacao) {
  const rotulos = {
    'baixo': 'Baixo Risco',
    'medio': 'Médio Risco',
    'alto': 'Alto Risco'
  };
  return rotulos[classificacao] || '-';
}

/**
 * Obtém a cor CSS baseada na classificação
 */
function getCorClassificacao(classificacao) {
  const cores = {
    'baixo': '#28a745',
    'medio': '#ffc107',
    'alto': '#dc3545'
  };
  return cores[classificacao] || '#666';
}

// ============================================================
// FUNÇÕES DE ATUALIZAÇÃO VISUAL (Tela 2)
// ============================================================

function atualizarClassificacaoHbA1c() {
  const valor = parseFloat(document.getElementById('hba1c').value);
  if (!isNaN(valor)) {
    const classe = classificarHbA1c(valor);
    const elemento = document.getElementById('hba1cClassificacao');
    elemento.textContent = `Classificação: ${getRotulo(classe)}`;
    elemento.style.color = getCorClassificacao(classe);
  }
}

function atualizarClassificacaoPA() {
  const pas = parseInt(document.getElementById('pas').value);
  const pad = parseInt(document.getElementById('pad').value);
  
  if (!isNaN(pas) && !isNaN(pad)) {
    const classe = classificarPA(pas, pad);
    const elemento = document.getElementById('paClassificacao');
    elemento.textContent = `Classificação: ${getRotulo(classe)}`;
    elemento.style.color = getCorClassificacao(classe);
  }
}

function atualizarClassificacaoDCV() {
  const valor = document.querySelector('input[name="dcv"]:checked')?.value;
  const elemento = document.getElementById('dcvClassificacao');
  if (valor) {
    elemento.textContent = `Classificação: ${getRotulo(valor)}`;
    elemento.style.color = getCorClassificacao(valor);
  }
}

function atualizarClassificacaoRetinopatia() {
  const valor = document.querySelector('input[name="retinopatia"]:checked')?.value;
  const elemento = document.getElementById('retinopatiClassificacao');
  if (valor) {
    elemento.textContent = `Classificação: ${getRotulo(valor)}`;
    elemento.style.color = getCorClassificacao(valor);
  }
}

function atualizarClassificacaoNefropatia() {
  const valor = document.querySelector('input[name="nefropatia"]:checked')?.value;
  const elemento = document.getElementById('nefropatiaClassificacao');
  if (valor) {
    elemento.textContent = `Classificação: ${getRotulo(valor)}`;
    elemento.style.color = getCorClassificacao(valor);
  }
}

function atualizarClassificacaoPeNeuropatia() {
  const valor = document.querySelector('input[name="peNeuropatia"]:checked')?.value;
  const elemento = document.getElementById('peNeuropatiClassificacao');
  if (valor) {
    elemento.textContent = `Classificação: ${getRotulo(valor)}`;
    elemento.style.color = getCorClassificacao(valor);
  }
}

// ============================================================
// NAVEGAÇÃO ENTRE TELAS
// ============================================================

function iniciarAvaliacao() {
  const profissional = document.getElementById('profissional').value.trim();
  
  if (!profissional) {
    alert('Por favor, preencheador o campo "Profissional Responsável"');
    return;
  }

  // Armazenar dados de identificação
  const dados = {
    nome: document.getElementById('nome').value.trim() || 'Sem nome',
    cpf: document.getElementById('cpf').value.trim() || 'Não informado',
    data: document.getElementById('data').value,
    profissional: profissional
  };

  sessionStorage.setItem('dadosIdentificacao', JSON.stringify(dados));
  window.location.href = 'estratificacao.html';
}

function voltar() {
  window.location.href = 'index.html';
}

function calcularRisco() {
  // Validar campos obrigatórios
  const hba1c = parseFloat(document.getElementById('hba1c').value);
  const pas = parseInt(document.getElementById('pas').value);
  const pad = parseInt(document.getElementById('pad').value);
  const dcv = document.querySelector('input[name="dcv"]:checked')?.value;
  const retinopatia = document.querySelector('input[name="retinopatia"]:checked')?.value;
  const nefropatia = document.querySelector('input[name="nefropatia"]:checked')?.value;
  const peNeuropatia = document.querySelector('input[name="peNeuropatia"]:checked')?.value;

  if (isNaN(hba1c) || isNaN(pas) || isNaN(pad) || !dcv || !retinopatia || !nefropatia || !peNeuropatia) {
    alert('Por favor, preencha todos os campos obrigatórios');
    return;
  }

  // Classificar cada critério
  const criterios = {
    hba1c: classificarHbA1c(hba1c),
    pa: classificarPA(pas, pad),
    dcv: dcv,
    retinopatia: retinopatia,
    nefropatia: nefropatia,
    peNeuropatia: peNeuropatia
  };

  // Armazenar dados clínicos
  const dadosClinic = {
    hba1c: hba1c,
    pas: pas,
    pad: pad,
    dcv: dcv,
    retinopatia: retinopatia,
    nefropatia: nefropatia,
    peNeuropatia: peNeuropatia,
    microalbuminuria: document.getElementById('microalbuminuria').value,
    macroalbuminuria: document.getElementById('macroalbuminuria').value
  };

  sessionStorage.setItem('dadosClinic', JSON.stringify(dadosClinic));
  sessionStorage.setItem('criterios', JSON.stringify(criterios));

  // Calcular risco global
  const riscoGlobal = calcularRiscoGlobal(criterios);
  sessionStorage.setItem('riscoGlobal', riscoGlobal);

  window.location.href = 'resultado.html';
}

/**
 * Calcula o risco global baseado na lógica:
 * - Se qualquer critério é "Alto" → Risco Alto
 * - Else if qualquer critério é "Médio" → Risco Moderado
 * - Else → Risco Baixo
 */
function calcularRiscoGlobal(criterios) {
  // Verificar critérios de Alto risco
  if (criterios.hba1c === 'alto' || 
      criterios.pa === 'alto' || 
      criterios.dcv === 'alto' || 
      criterios.retinopatia === 'alto' || 
      criterios.nefropatia === 'alto' || 
      criterios.peNeuropatia === 'alto') {
    return 'alto';
  }

  // Verificar critérios de Médio risco
  if (criterios.hba1c === 'medio' || 
      criterios.pa === 'medio' || 
      criterios.dcv === 'medio' || 
      criterios.retinopatia === 'medio' || 
      criterios.nefropatia === 'medio' || 
      criterios.peNeuropatia === 'medio') {
    return 'moderado';
  }

  // Caso contrário → Baixo risco
  return 'baixo';
}

function mostrarResultado() {
  const riscoGlobal = sessionStorage.getItem('riscoGlobal');
  const criterios = JSON.parse(sessionStorage.getItem('criterios') || '{}');
  const dadosIdentificacao = JSON.parse(sessionStorage.getItem('dadosIdentificacao') || '{}');
  const dadosClinic = JSON.parse(sessionStorage.getItem('dadosClinic') || '{}');

  // Preencher informações de identificação
  document.getElementById('resultNome').textContent = dadosIdentificacao.nome || '-';
  document.getElementById('resultCPF').textContent = dadosIdentificacao.cpf || '-';
  document.getElementById('resultData').textContent = formatarData(dadosIdentificacao.data) || '-';
  document.getElementById('resultProfissional').textContent = dadosIdentificacao.profissional || '-';

  // Preencher classificação global
  const riscoBox = document.getElementById('riscoGlobal');
  const nomeRisco = riscoGlobal === 'alto' ? 'RISCO ALTO' : riscoGlobal === 'moderado' ? 'RISCO MODERADO' : 'RISCO BAIXO';
  const corRisco = getCorClassificacao(riscoGlobal);
  riscoBox.innerHTML = `
    <div class="risco-resultado" style="background-color: ${corRisco};">
      <h1>${nomeRisco}</h1>
    </div>
  `;

  // Preencher resumo dos critérios
  document.getElementById('critHba1c').innerHTML = `${dadosClinic.hba1c}% → <span style="color: ${getCorClassificacao(criterios.hba1c)}">${getRotulo(criterios.hba1c)}</span>`;
  document.getElementById('critPA').innerHTML = `${dadosClinic.pas}/${dadosClinic.pad} mmHg → <span style="color: ${getCorClassificacao(criterios.pa)}">${getRotulo(criterios.pa)}</span>`;
  document.getElementById('critDCV').innerHTML = `<span style="color: ${getCorClassificacao(criterios.dcv)}">${getRotulo(criterios.dcv)}</span>`;
  document.getElementById('critRetinopatia').innerHTML = `<span style="color: ${getCorClassificacao(criterios.retinopatia)}">${getRotulo(criterios.retinopatia)}</span>`;
  document.getElementById('critNefropatia').innerHTML = `<span style="color: ${getCorClassificacao(criterios.nefropatia)}">${getRotulo(criterios.nefropatia)}</span>`;
  document.getElementById('critPeNeuropatia').innerHTML = `<span style="color: ${getCorClassificacao(criterios.peNeuropatia)}">${getRotulo(criterios.peNeuropatia)}</span>`;

  // Preencher periodicidade
  const periodicidadeBox = document.getElementById('periodicidade');
  let texto = '';
  let icone = '';
  if (riscoGlobal === 'alto') {
    texto = 'Consulta a cada <strong>1–3 meses</strong>';
    icone = '🔴';
  } else if (riscoGlobal === 'moderado') {
    texto = 'Consulta a cada <strong>3–4 meses</strong>';
    icone = '🟡';
  } else {
    texto = 'Consulta a cada <strong>6 meses</strong>';
    icone = '🟢';
  }
  periodicidadeBox.innerHTML = `<p>${icone} ${texto}</p>`;
}

function novaAvaliacao() {
  sessionStorage.clear();
  window.location.href = 'index.html';
}

function exportarPDF() {
  const elemento = document.querySelector('.result-container');
  const opt = {
    margin: 10,
    filename: 'Estratificacao_DM2.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  };
  html2pdf().set(opt).from(elemento).save();
}

function formatarData(data) {
  if (!data) return '';
  const d = new Date(data);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}
