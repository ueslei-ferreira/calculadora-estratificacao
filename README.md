# 🩺 Estratificação de Risco em Diabetes Mellitus Tipo 2

Aplicativo web responsivo para estratificação de risco clínico em pessoas com Diabetes Mellitus Tipo 2 (DM2) na Atenção Primária à Saúde (APS).

## ✨ Funcionalidades

- **Tela 1:** Identificação do paciente (Nome, CPF, Data, Profissional responsável)
- **Tela 2:** Coleta de dados clínicos:
  - Controle Metabólico (HbA1c)
  - Controle Pressórico (PAS/PAD)
  - Doença Cardiovascular
  - Retinopatia
  - Nefropatia
  - Pé Diabético / Neuropatia

- **Tela 3:** Resultado com:
  - Classificação global de risco (🟢 Baixo / 🟡 Moderado / 🔴 Alto)
  - Resumo dos critérios identificados
  - Periodicidade recomendada de acompanhamento
  - Exportação para PDF

## 🔬 Algoritmo de Classificação

```
if (qualquer critério = "Alto") → RISCO ALTO
else if (qualquer critério = "Médio") → RISCO MODERADO
else → RISCO BAIXO
```

## 📋 Classificações Automáticas

### HbA1c (%)
- ≤ 7,0% → Baixo
- > 7,0% e ≤ 9,0% → Médio
- > 9,0% → Alto

### Pressão Arterial
- PAS < 130 E PAD < 80 → Baixo
- PAS 130–160 OU PAD 80–90 → Médio
- PAS > 160 OU PAD > 90 → Alto

## 🚀 Como Usar

1. Abra `index.html` no navegador
2. Preencha os dados de identificação do paciente
3. Clique em "Iniciar Avaliação"
4. Insira os dados clínicos
5. Clique em "Calcular Risco"
6. Visualize o resultado com recomendações

## 🛠 Tecnologias

- HTML5
- CSS3 (Responsivo)
- JavaScript (Vanilla)
- html2pdf (para exportação)

## 📱 Responsividade

✅ Desktop  
✅ Tablet  
✅ Smartphone  

## 📦 Estrutura de Arquivos

```
calculadora_dm2/
├── index.html           # Tela de identificação
├── estratificacao.html  # Tela de dados clínicos
├── resultado.html       # Tela de resultado
├── script.js           # Lógica do aplicativo
├── styles.css          # Estilos responsivos
├── .gitignore
└── README.md
```

## 🌐 Deploy Recomendado

- **GitHub Pages** (grátis, direto do repositório)
- **Vercel** (grátis, muito rápido)
- **Netlify** (grátis, com preview automático)

## 📄 Licença

Livre para uso em contexto de saúde pública.

---

**Desenvolvido para melhorar a organização do acompanhamento de pacientes com DM2 na APS.**
