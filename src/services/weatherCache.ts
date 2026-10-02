import { weatherServiceAPI } from "./weatherServiceAPI";
import * as constantes from "../data/constantes";
import type {
  CacheEntry,
  DadoDiario,
  DadosInstantaneos,
  PwsResponse,
} from "../types/domain";

const cache_instantaneo: Record<
  string,
  CacheEntry<DadosInstantaneos | undefined>
> = {};
const cache_diaria: Record<string, CacheEntry<DadoDiario[] | undefined>> = {};

export const weatherCache = {
  getLeituraInstantanea: async (
    stationId: string,
  ): Promise<DadosInstantaneos | undefined> => {
    const agora = Date.now();
    const itemGuardado = cache_instantaneo[stationId];

    if (
      itemGuardado &&
      agora - itemGuardado.timestamp <
        constantes.PRAZO_VALIDADE_DADOS_INSTANTANEOS
    ) {
      return itemGuardado.dados;
    }

    try {
      const dadoBruto =
        await weatherServiceAPI.getLeituraInstantaneaAPI(stationId);
      const dadoFormatado = formatarDadoInstantaneo(dadoBruto);

      cache_instantaneo[stationId] = {
        dados: dadoFormatado,
        timestamp: agora,
      };
      return dadoFormatado;
    } catch (error) {
      if (itemGuardado) {
        if (
          agora - itemGuardado.timestamp <
          constantes.TEMPO_MAXIMO_DADOS_INSTANTANEOS
        ) {
          console.warn(
            `API falhou para estação ${stationId}, retornando dado antigo do cache.`,
          );
          return itemGuardado.dados;
        } else {
          console.warn(
            `API falhou para estação ${stationId} e o dado do cache está muito antigo. Não retornando dados.`,
          );
          return { temperatura: null, umidade: null, lat: null, lon: null };
        }
      }
      throw error;
    }
  },

  getLeituraDiaria: async (
    stationId: string,
  ): Promise<DadoDiario[] | undefined> => {
    const agora = Date.now();
    const itemGuardado = cache_diaria[stationId];

    if (
      itemGuardado &&
      agora - itemGuardado.timestamp < constantes.PRAZO_VALIDADE_DADOS_DIARIOS
    ) {
      return itemGuardado.dados;
    }

    try {
      const dadoBruto =
        await weatherServiceAPI.getHistoricoDiariaAPI(stationId);
      const dadoFormatado = formatarDadoDiario(dadoBruto);

      cache_diaria[stationId] = {
        dados: dadoFormatado,
        timestamp: agora,
      };
      return dadoFormatado;
    } catch (error) {
      if (itemGuardado) {
        return itemGuardado.dados;
      }
      throw error;
    }
  },

  clearAll: (): void => {
    Object.keys(cache_instantaneo).forEach((k) => delete cache_instantaneo[k]);
    Object.keys(cache_diaria).forEach((k) => delete cache_diaria[k]);
  },
};

function formatarDadoInstantaneo(
  dados: PwsResponse,
): DadosInstantaneos | undefined {
  if (dados?.observations.length > 0) {
    const observation = dados.observations[0]!;

    const semDadosValidos =
      !observation.metric || !observation.metric.temp || !observation.humidity;

    const dadosInvalidos =
      observation.metric.temp < -100 ||
      observation.metric.temp > 100 ||
      observation.humidity < 0 ||
      observation.humidity > 100;

    if (semDadosValidos || dadosInvalidos) {
      return { temperatura: null, umidade: null, lat: null, lon: null };
    }
    return {
      temperatura: observation.metric.temp.toFixed(1),
      umidade: observation.humidity,
      lat: observation.lat,
      lon: observation.lon,
    };
  }
  return undefined;
}

function formatarDadoDiario(dados: PwsResponse): DadoDiario[] | undefined {
  if (dados?.observations.length > 0) {
    const observation = dados.observations;
    return observation
      .filter(
        (obs) =>
          obs.metric?.tempAvg !== undefined &&
          obs.metric?.tempAvg !== null &&
          obs.metric.tempAvg > -100 &&
          obs.metric.tempAvg < 100 &&
          obs.humidityAvg !== undefined &&
          obs.humidityAvg !== null &&
          obs.humidityAvg >= 0 &&
          obs.humidityAvg <= 100,
      )
      .map((obs) => ({
        hora: obs.obsTimeLocal.split(" ")[1]!.slice(0, 5),
        temperatura: obs.metric.tempAvg.toFixed(1),
        umidade: obs.humidityAvg,
      }));
  }
  return undefined;
}
