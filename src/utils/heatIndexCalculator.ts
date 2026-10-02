import { categoriasIndiceCalor } from "../data/heatIndex";
import type {
  ClassificacaoIndiceCalor,
  IndiceCalorCalculado,
} from "../types/domain";

/**
 * Índice de Calor (Heat Index) pela equação da NOAA.
 * https://www.wpc.ncep.noaa.gov/html/heatindex_equation.shtml#HIadjustments
 */
export const calculateHeatIndex = (
  temperaturaC: number,
  umidadeRelativa: number,
): IndiceCalorCalculado => {
  // Celsius para Fahrenheit
  const temperaturaF = (temperaturaC * 9) / 5 + 32;

  // Modelo simplificado, com média entre o resultado e a temperatura real.
  const indiceCalorSimplificadoF =
    0.5 *
    (temperaturaF + 61.0 + (temperaturaF - 68.0) * 1.2 + umidadeRelativa * 0.094);

  const indiceCalorMediaF = (indiceCalorSimplificadoF + temperaturaF) / 2;

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
    0.00000199 * temperaturaF * temperaturaF * umidadeRelativa * umidadeRelativa;

  // Ajuste 1: umidade < 13% e temperatura entre 80 e 112°F
  if (umidadeRelativa < 13 && temperaturaF >= 80 && temperaturaF <= 112) {
    const ajuste =
      ((13 - umidadeRelativa) / 4) *
      Math.sqrt((17 - Math.abs(temperaturaF - 95)) / 17);
    indiceCalorF -= ajuste;
  } else if (umidadeRelativa > 85 && temperaturaF >= 80 && temperaturaF <= 87) {
    // Ajuste 2: umidade > 85% e temperatura entre 80 e 87°F
    const ajuste = ((umidadeRelativa - 85) / 10) * ((87 - temperaturaF) / 5);
    indiceCalorF += ajuste;
  }

  const indiceCalorC = ((indiceCalorF - 32) * 5) / 9;
  const categoriaCalor = getCategoriaIndiceCalor(indiceCalorC);

  return { indiceCalor: indiceCalorC.toFixed(1), ...categoriaCalor };
};

export const getCategoriaIndiceCalor = (
  indiceCalorC: number,
): ClassificacaoIndiceCalor => {
  const encontrada = categoriasIndiceCalor.find(
    ({ intervalo }) =>
      indiceCalorC >= intervalo.min && indiceCalorC < intervalo.max,
  );

  const categoria = encontrada ?? categoriasIndiceCalor[categoriasIndiceCalor.length - 1]!;
  const { classe, cor } = categoria;
  return { categoria: categoria.categoria, classe, cor };
};
