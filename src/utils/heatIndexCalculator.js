/**
 * Calcula o Índice de Calor (Heat Index) baseado na equação da NOAA.
 * https://www.wpc.ncep.noaa.gov/html/heatindex_equation.shtml#HIadjustments
 * @param {number} temperaturaC - Temperatura em graus Celsius.
 * @param {number} umidadeRelativa - Umidade Relativa (0 a 100).
 * @returns {number} - Índice de Calor calculado em Celsius.
 */
import { categoriasIndiceCalor } from "../data/heatIndex";

export const calculateHeatIndex = (temperaturaC, umidadeRelativa) => {
  // Celsius para Fahrenheit
  const temperaturaF = (temperaturaC * 9) / 5 + 32;

  // Primeiro calcula utilizando o modelo simplificado e calcula a média
  // entre o resultado simplificado e a temperatura real.
  let indiceCalorSimplificadoF =
    0.5 *
    (temperaturaF +
      61.0 +
      (temperaturaF - 68.0) * 1.2 +
      umidadeRelativa * 0.094);

  let indiceCalorMediaF = (indiceCalorSimplificadoF + temperaturaF) / 2;

  // Se o resultado simplificado for menor que 80°F, retorna a média convertida para Celsius
  if (indiceCalorMediaF < 80) {
    const indiceCalorC = ((indiceCalorMediaF - 32) * 5) / 9;
    const categoriaCalor = getCategoriaIndiceCalor(indiceCalorC);

    return { indiceCalor: indiceCalorC.toFixed(1), ...categoriaCalor };
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

  return { indiceCalor: indiceCalorC.toFixed(1), ...categoriaCalor };
};

/**
 * Classifica o nível de risco baseado no Índice de Calor.
 */
export const getCategoriaIndiceCalor = (indiceCalorC) => {
  const encontrada = categoriasIndiceCalor.find(
    ({ intervalo }) =>
      indiceCalorC >= intervalo.min && indiceCalorC < intervalo.max,
  );
  if (!encontrada)
    return categoriasIndiceCalor[categoriasIndiceCalor.length - 1];
  const { categoria, classe, cor } = encontrada;
  return { categoria, classe, cor };
};
