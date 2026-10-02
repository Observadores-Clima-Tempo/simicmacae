import { BASE_URL, commonParams, REQUEST_TIMEOUT } from "./apiConfig";
import { pwsResponseSchema, type PwsResponse } from "./pwsSchemas";

async function buscarObservacoes(
  url: string,
  signal?: AbortSignal,
): Promise<PwsResponse> {
  const sinal = signal
    ? AbortSignal.any([signal, AbortSignal.timeout(REQUEST_TIMEOUT)])
    : AbortSignal.timeout(REQUEST_TIMEOUT);

  const response = await fetch(url, { signal: sinal });
  if (!response.ok) {
    throw new Error(`Erro na requisição API: ${response.status}`);
  }

  const texto = await response.text();
  const json: unknown = texto ? JSON.parse(texto) : { observations: [] };
  return pwsResponseSchema.parse(json);
}

export const weatherServiceAPI = {
  getLeituraInstantaneaAPI: (
    stationId: string,
    signal?: AbortSignal,
  ): Promise<PwsResponse> =>
    buscarObservacoes(
      `${BASE_URL}/observations/current?stationId=${stationId}${commonParams}`,
      signal,
    ),

  getHistoricoDiariaAPI: (
    stationId: string,
    signal?: AbortSignal,
  ): Promise<PwsResponse> =>
    buscarObservacoes(
      `${BASE_URL}/observations/all/1day?stationId=${stationId}${commonParams}`,
      signal,
    ),

  getHistoricoIntervaloDataAPI: (
    stationId: string,
    startDate: string,
    endDate: string,
    signal?: AbortSignal,
  ): Promise<PwsResponse> =>
    buscarObservacoes(
      `${BASE_URL}/history/daily?stationId=${stationId}${commonParams}&startDate=${startDate}&endDate=${endDate}`,
      signal,
    ),
};
