import { calculateHeatIndex } from "../utils/heatIndexCalculator";
import type {
  DadoDiario,
  DadosComIndiceCalor,
  DadosInstantaneos,
} from "../types/domain";
import type { PwsResponse } from "./pwsSchemas";

const DADOS_INDISPONIVEIS: DadosInstantaneos = {
  temperatura: null,
  umidade: null,
  lat: null,
  lon: null,
};

export function formatarDadoInstantaneo(
  resposta: PwsResponse,
): DadosInstantaneos | undefined {
  const observation = resposta.observations[0];
  if (!observation) return undefined;

  const temperatura = observation.metric?.temp;
  const umidade = observation.humidity;

  if (!temperatura || !umidade) return DADOS_INDISPONIVEIS;
  if (temperatura < -100 || temperatura > 100) return DADOS_INDISPONIVEIS;
  if (umidade < 0 || umidade > 100) return DADOS_INDISPONIVEIS;

  return {
    temperatura,
    umidade,
    lat: observation.lat ?? 0,
    lon: observation.lon ?? 0,
  };
}

export function formatarDadoDiario(resposta: PwsResponse): DadoDiario[] | undefined {
  if (resposta.observations.length === 0) return undefined;

  const dados: DadoDiario[] = [];
  for (const observation of resposta.observations) {
    const temperatura = observation.metric?.tempAvg;
    const umidade = observation.humidityAvg;
    const hora = observation.obsTimeLocal?.split(" ")[1]?.slice(0, 5);

    if (temperatura == null || temperatura <= -100 || temperatura >= 100) continue;
    if (umidade == null || umidade < 0 || umidade > 100) continue;
    if (!hora) continue;

    dados.push({ hora, temperatura, umidade });
  }
  return dados;
}

export function montarDadosComIndiceCalor(
  telemetria: DadosInstantaneos | undefined,
): DadosComIndiceCalor | null {
  if (!telemetria || !telemetria.temperatura || !telemetria.umidade) return null;

  const indiceCalor = calculateHeatIndex(telemetria.temperatura, telemetria.umidade);
  return { ...telemetria, ...indiceCalor };
}
