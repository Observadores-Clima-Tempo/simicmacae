export const catalogoEstacoes = {
    // Retorna apenas as que estão funcionando
    getEstacoesAtivas: () => ESTACOES.filter(s => s.operando),
    // Retorna o nome do bairro pela ID da estação
    getNomeBairroPorId: (stationId) => {
        const estacao = ESTACOES.find(s => s.id === stationId);
        return estacao ? estacao.bairro : null;
    },
    // Retorna a primeira estação ativa
    getPrimeiraEstacaoAtiva: () => {
        return ESTACOES.find(s => s.operando);
    },
    // Retorna todas
    getTodasEstacoes: () => ESTACOES
};

let ESTACOES = [
  {
    id: "IMACA6",
    bairro: "Miramar",
    operando: true
  },{
    id: "IMACA7",
    bairro: "Mirante da Lagoa",
    operando: true
  },{
    id: "IMACA13",
    bairro: "Trapiche",
    operando: true
  },{
    id: "IMACA15",
    bairro: "Glória",
    operando: true
  },{
    id: "IMACA23",
    bairro: "Imboassica",
    operando: true
  },{
    id: "IMACA26",
    bairro: "Granja dos Cavalheiros",
    operando: true
  },{
    id: "IMACA28",
    bairro: "Aroeira",
    operando: true
  },{
    id: "IMACA30",
    bairro: "Imboassica",
    operando: true
  },{
    id: "IMACA31",
    bairro: "Botafogo",
    operando: true
  },{
    id: "IMACA32",
    bairro: "Visconde de Araújo",
    operando: true
  },{
    id: "IMACA36",
    bairro: "Córrego do Ouro",
    operando: true
  },{
    id: "IMACA41",
    bairro: "Lagomar",
    operando: true
  },{
    id: "IMACA42",
    bairro: "Virgem Santa",
    operando: true
  },{
    id: "IMACA43",
    bairro: "Aeroporto",
    operando: true
  },{
    id: "IMACA46",
    bairro: "Cajueiros",
    operando: true
  },{
    id: "IMACA52",
    bairro: "Barreto",
    operando: true
  },{
    id: "IMACA53",
    bairro: "Sana",
    operando: true
  },{
    id: "IMACA54",
    bairro: "A. Celso Daniel",
    operando: true
  },{
    id: "IMACA56",
    bairro: "Praia do Pecado",
    operando: true
  },{
    id: "IMACA58",
    bairro: "Barra",
    operando: true
  }
];