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
    'medio': '#e6a800',
    'moderado': '#e6a800',
    'alto': '#dc3545'
  };
  return cores[classificacao] || '#666';
}

// ============================================================
// NAVEGAÇÃO ENTRE TELAS
// ============================================================

function iniciarAvaliacao() {
  const profissional = document.getElementById('profissional').value.trim();
  
  if (!profissional) {
    alert('Por favor, preencha o campo "Profissional Responsável"');
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
  if (criterios.hba1c === 'alto' || 
      criterios.pa === 'alto' || 
      criterios.dcv === 'alto' || 
      criterios.retinopatia === 'alto' || 
      criterios.nefropatia === 'alto' || 
      criterios.peNeuropatia === 'alto') {
    return 'alto';
  }

  if (criterios.hba1c === 'medio' || 
      criterios.pa === 'medio' || 
      criterios.dcv === 'medio' || 
      criterios.retinopatia === 'medio' || 
      criterios.nefropatia === 'medio' || 
      criterios.peNeuropatia === 'medio') {
    return 'moderado';
  }

  return 'baixo';
}

/**
 * Retorna as recomendações conforme o estrato de risco
 */
function getRecomendacoes(riscoGlobal) {
  const recomendacoes = {
    baixo: [
      'Manter acompanhamento regular na APS',
      'Reforçar alimentação saudável, atividade física regular e uso correto das medicações',
      'Incentivar cessação do tabagismo, redução do consumo de bebidas alcoólicas e controle do peso',
      'Estimular autocuidado e adesão ao plano terapêutico'
    ],
    moderado: [
      'Intensificar acompanhamento clínico',
      'Reforçar adesão ao tratamento medicamentoso e não medicamentoso',
      'Avaliar necessidade de ajuste terapêutico conforme protocolo local',
      'Ampliar vigilância para complicações crônicas',
      'Considerar interconsulta/discussão de caso com equipe/eMulti, se necessário'
    ],
    alto: [
      'Priorizar seguimento mais próximo',
      'Avaliar necessidade de compartilhamento do cuidado com a atenção especializada',
      'Intensificar controle glicêmico e pressórico',
      'Investigar e acompanhar complicações instaladas',
      'Elaborar plano de cuidado individualizado'
    ]
  };
  return recomendacoes[riscoGlobal] || recomendacoes['baixo'];
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
  const nomeRisco = riscoGlobal === 'alto' ? 'ALTO RISCO' : riscoGlobal === 'moderado' ? 'RISCO MODERADO' : 'BAIXO RISCO';
  const corRisco = getCorClassificacao(riscoGlobal);
  const iconeRisco = riscoGlobal === 'alto' ? '🔴' : riscoGlobal === 'moderado' ? '🟡' : '🟢';
  riscoBox.innerHTML = `
    <div class="risco-resultado" style="background-color: ${corRisco};">
      <div class="risco-icone">${iconeRisco}</div>
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
  let textoPeriodicidade = '';
  let iconePeriodicidade = '';
  if (riscoGlobal === 'alto') {
    textoPeriodicidade = 'Consulta a cada <strong>1–3 meses</strong>';
    iconePeriodicidade = '🔴';
  } else if (riscoGlobal === 'moderado') {
    textoPeriodicidade = 'Consulta a cada <strong>3–4 meses</strong>';
    iconePeriodicidade = '🟡';
  } else {
    textoPeriodicidade = 'Consulta a cada <strong>6 meses</strong>';
    iconePeriodicidade = '🟢';
  }
  periodicidadeBox.innerHTML = `<p>${iconePeriodicidade} ${textoPeriodicidade}</p>`;

  // Preencher recomendações
  const recomendacoesBox = document.getElementById('recomendacoes');
  const listaRecomendacoes = getRecomendacoes(riscoGlobal);
  const corBorda = getCorClassificacao(riscoGlobal);
  recomendacoesBox.style.borderLeftColor = corBorda;
  recomendacoesBox.innerHTML = `<ul class="recomendacoes-list">${listaRecomendacoes.map(r => `<li>${r}</li>`).join('')}</ul>`;
}

function novaAvaliacao() {
  sessionStorage.clear();
  window.location.href = 'index.html';
}

function exportarPDF() {
  const examesContent = document.getElementById('examesContent');
  const examesIcon = document.getElementById('examesIcon');
  const wasHidden = examesContent.style.display === 'none';
  if (wasHidden) {
    examesContent.style.display = 'block';
    if (examesIcon) examesIcon.textContent = '▲';
  }

  window.scrollTo(0, 0);

  setTimeout(function() {
    const elemento = document.querySelector('.result-container');
    const opt = {
      margin: [8, 8, 8, 8],
      filename: 'Estratificacao_DM2.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: -window.scrollY
      },
      jsPDF: {
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      },
      pagebreak: {
        mode: 'css',
        avoid: ['.criterios-list', '.periodicidade-box', '.recomendacoes-box', '.exames-box', '.risco-box', '.info-grid']
      }
    };

    html2pdf()
      .set(opt)
      .from(elemento)
      .save()
      .then(function() {
        if (wasHidden) {
          examesContent.style.display = 'none';
          if (examesIcon) examesIcon.textContent = '▼';
        }
      })
      .catch(function(err) {
        console.error('Erro ao gerar PDF:', err);
        if (wasHidden) {
          examesContent.style.display = 'none';
          if (examesIcon) examesIcon.textContent = '▼';
        }
      });
  }, 200);
}

function formatarData(data) {
  if (!data) return '';
  const d = new Date(data);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}
