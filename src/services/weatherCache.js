import { weatherServiceAPI } from "./weatherServiceAPI";

const cache = {};
const VALIDADE_DADOS = 15 * 60 * 1000; // 15 minutos

export const weatherCache = {
  getLeituraInstantanea: async (stationId) => {
    const agora = Date.now();
    const itemGuardado = cache[stationId];

    // Verifica se temos o dado e se ele ainda é válido
    if (itemGuardado && agora - itemGuardado.timestamp < VALIDADE_DADOS) {
      return itemGuardado.dados;
    }

    // Se não tiver no cache ou expirou, busca na API
    try {
      const dadoBruto =
        await weatherServiceAPI.getLeituraInstantaneaAPI(stationId);
      const dadoFormatado = formatarDados(dadoBruto);

      // Salva no cache com o timestamp atual
      cache[stationId] = {
        dados: dadoFormatado,
        timestamp: agora,
      };
      return dadoFormatado;
    } catch (error) {
      // Se a API falhar mas tivermos um dado antigo, retornar o antigo
      if (itemGuardado) {
        return itemGuardado.dados;
      }
      throw error;
    }
  },
};

/**
 * Formata os dados brutos da API para o formato utilizado na aplicação.
 * @param {object} dados - Dados brutos da API.
 * @returns {object} - Dados formatados com temperatura e umidade.
 */
function formatarDados(dados) {
  if (dados?.observations.length > 0) {
    const observation = dados.observations[0];

    let semDadosValidos =
      !observation.metric || !observation.metric.temp || !observation.humidity;

    let dadosInvalidos =
      observation.metric.temp < -100 ||
      observation.metric.temp > 100 ||
      observation.humidity < 0 ||
      observation.humidity > 100;
      
    if (semDadosValidos || dadosInvalidos) {
      return { temperatura: null, umidade: null };
    }
    return {
      temperatura: observation.metric.temp,
      umidade: observation.humidity,
    };
  }
}
