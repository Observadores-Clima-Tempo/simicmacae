/**
 * Calcula o Índice de Calor (Heat Index) baseado na equação da NOAA.
 * @param {number} temperaturaC - Temperatura em graus Celsius.
 * @param {number} umidadeRelativa - Umidade Relativa (0 a 100).
 * @returns {number} - Índice de Calor calculado em Celsius.
 */
export const calculateHeatIndex = (temperaturaC, umidadeRelativa) => {
  // Celsius para Fahrenheit
  const temperaturaF = (temperaturaC * 9) / 5 + 32;

  // Se a temperatura for menor que 80°F (aprox. 26.7°C),
  // o índice de calor é igual à própria temperatura.
  if (temperaturaF < 80) {
    const categoriaCalor = getCategoriaIndiceCalor(temperaturaC);
    return { indiceCalor: Math.round(temperaturaC), ...categoriaCalor };
  }

  // Equação de Regressão Múltipla da NOAA
  let indiceCalorF =
    -42.379 +
    2.04901523 * temperaturaF +
    10.14333127 * umidadeRelativa -
    0.22475541 * temperaturaF * umidadeRelativa -
    0.00683783 * temperaturaF * temperaturaF -
    0.05481717 * umidadeRelativa * umidadeRelativa +
    0.00122874 * temperaturaF * temperaturaF * umidadeRelativa +
    0.00085282 * temperaturaF * umidadeRelativa * umidadeRelativa -
    0.00000199 *
      temperaturaF *
      temperaturaF *
      umidadeRelativa *
      umidadeRelativa;

  // Ajuste 1: Se umidade < 13% e temp entre 80 e 112°F
  if (umidadeRelativa < 13 && temperaturaF >= 80 && temperaturaF <= 112) {
    const ajuste =
      ((13 - umidadeRelativa) / 4) *
      Math.sqrt((17 - Math.abs(temperaturaF - 95)) / 17);
    indiceCalorF -= ajuste;
  }
  // Ajuste 2: Se umidade > 85% e temp entre 80 e 87°F
  else if (umidadeRelativa > 85 && temperaturaF >= 80 && temperaturaF <= 87) {
    const ajuste = ((umidadeRelativa - 85) / 10) * ((87 - temperaturaF) / 5);
    indiceCalorF += ajuste;
  }

  // Converte o resultado de volta para Celsius
  const indiceCalorC = ((indiceCalorF - 32) * 5) / 9;
  const categoriaCalor = getCategoriaIndiceCalor(indiceCalorC);

  return { indiceCalor: Math.round(indiceCalorC), ...categoriaCalor };
};

/**
 * Classifica o nível de risco baseado no Índice de Calor.
 */
export const getCategoriaIndiceCalor = (indiceCalorC) => {
  if (indiceCalorC < 27)
    return { categoria: "Normal", classe: "ic-normal", cor: "#2ecc71" };
  if (indiceCalorC < 32)
    return { categoria: "Cuidado", classe: "ic-cuidado", cor: "#f1c40f" };
  if (indiceCalorC < 41)
    return {
      categoria: "Cuidado Extremo",
      classe: "ic-cuidado-extremo",
      cor: "#e67e22",
    };
  if (indiceCalorC < 54)
    return { categoria: "Perigo", classe: "ic-perigo", cor: "#e74c3c" };
  return {
    categoria: "Perigo Extremo",
    classe: "ic-perigo-extremo",
    cor: "#8e44ad",
  };
};
