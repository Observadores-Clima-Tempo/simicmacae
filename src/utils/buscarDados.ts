import { calculateHeatIndex as calcularIndiceCalor } from "./heatIndexCalculator";
import { weatherCache } from "../services/weatherCache";
import type { DadoDiario, DadosComIndiceCalor } from "../types/domain";

export async function buscarDadosInstantaneosEstacao(
  stationId: string,
): Promise<DadosComIndiceCalor | null> {
  try {
    const telemetria = await weatherCache.getLeituraInstantanea(stationId);

    if (!telemetria || !telemetria.temperatura || !telemetria.umidade) {
      return null;
    }

    const indiceCalor = calcularIndiceCalor(
      Number(telemetria.temperatura),
      telemetria.umidade,
    );

    return { ...telemetria, ...indiceCalor };
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return null;
  }
}

export async function buscarDadosDiariosEstacao(
  stationId: string,
): Promise<DadoDiario[] | undefined> {
  try {
    const historicoDiario = await weatherCache.getLeituraDiaria(stationId);
    return historicoDiario;
  } catch (error) {
    console.error("Erro ao buscar dados diários:", error);
    return [];
  }
}
