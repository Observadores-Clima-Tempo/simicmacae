import { calculateHeatIndex as calcularIndiceCalor } from "./heatIndexCalculator";
import { weatherCache } from "../services/weatherCache";

export async function buscarDadosInstantaneosEstacao(stationId) {
  try {
    const telemetria = await weatherCache.getLeituraInstantanea(stationId);

    if (telemetria?.temperatura && telemetria?.umidade) {
      const indiceCalor = calcularIndiceCalor(
        telemetria.temperatura,
        telemetria.umidade,
      );
      return { ...telemetria, ...indiceCalor };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return null;
  }
}

export async function buscarDadosDiariosEstacao(stationId) {
  try {
    const historicoDiario = await weatherCache.getLeituraDiaria(stationId);
    return historicoDiario;
  } catch (error) {
    console.error("Erro ao buscar dados diários:", error);
    return [];
  }
}