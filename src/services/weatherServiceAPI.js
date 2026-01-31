import {BASE_URL, commonParams} from  './apiConfig.js';

export const weatherServiceAPI = {

  // Leitura Instantânea
  getLeituraInstantaneaAPI: async (stationId) => {
    const url = `${BASE_URL}/observations/current?stationId=${stationId}${commonParams}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro na requisição API: ${response.status}`);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : { observations: [] };
  },

  // Histórico de 24 horas
  getHistoricoDiaAPI: async (stationId) => {
    const url = `${BASE_URL}/observations/all/1day?stationId=${stationId}${commonParams}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro na requisição API: ${response.status}`);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : { observations: [] };
  },

  // Histórico por Intervalo de Datas
  getHistoricoIntervaloDataAPI: async (stationId, startDate, endDate) => {
    const url = `${BASE_URL}/history/daily?stationId=${stationId}${commonParams}&startDate=${startDate}&endDate=${endDate}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro na requisição API: ${response.status}`);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : { observations: [] };
  }
};