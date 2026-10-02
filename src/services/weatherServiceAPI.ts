import { BASE_URL, commonParams } from "./apiConfig";
import type { PwsResponse } from "../types/domain";

export const weatherServiceAPI = {
  getLeituraInstantaneaAPI: async (stationId: string): Promise<PwsResponse> => {
    const url = `${BASE_URL}/observations/current?stationId=${stationId}${commonParams}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro na requisição API: ${response.status}`);
    }
    const text = await response.text();
    return text ? (JSON.parse(text) as PwsResponse) : { observations: [] };
  },

  getHistoricoDiariaAPI: async (stationId: string): Promise<PwsResponse> => {
    const url = `${BASE_URL}/observations/all/1day?stationId=${stationId}${commonParams}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro na requisição API: ${response.status}`);
    }
    const text = await response.text();
    return text ? (JSON.parse(text) as PwsResponse) : { observations: [] };
  },

  getHistoricoIntervaloDataAPI: async (
    stationId: string,
    startDate: string,
    endDate: string,
  ): Promise<PwsResponse> => {
    const url = `${BASE_URL}/history/daily?stationId=${stationId}${commonParams}&startDate=${startDate}&endDate=${endDate}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro na requisição API: ${response.status}`);
    }
    const text = await response.text();
    return text ? (JSON.parse(text) as PwsResponse) : { observations: [] };
  },
};
