import { useMemo } from "react";
import { calculateHeatIndex } from "../../utils/heatIndexCalculator";
import {
  useEstacaoDiaria,
  useEstacaoInstantanea,
} from "../../hooks/useEstacoes";
import type { ChartPoint } from "../../types/domain";
import GraficoIndiceCalor from "./GraficoIndiceCalor";
import { timeToMinutes } from "../../utils/timeToMinutes";
import "./EstacaoChart.css";

interface EstacaoChartProps {
  stationId: string;
  bairro: string;
}

export default function EstacaoChart({
  stationId,
  bairro,
}: EstacaoChartProps) {
  const { data: dadosDiarios, isPending } = useEstacaoDiaria(stationId);
  const { data: instantaneo } = useEstacaoInstantanea(stationId);

  const chartData = useMemo<ChartPoint[]>(() => {
    const processado: ChartPoint[] =
      dadosDiarios && dadosDiarios.length > 0
        ? dadosDiarios.map((d) => ({
            time: d.hora.slice(0, 5),
            hi: calculateHeatIndex(d.temperatura, d.umidade).indiceCalor,
            timeValue: timeToMinutes(d.hora),
          }))
        : [];

    if (instantaneo) {
      const agora = new Date();
      const horaAtual = `${agora.getHours().toString().padStart(2, "0")}:${agora.getMinutes().toString().padStart(2, "0")}`;
      const ultimoPonto: ChartPoint = {
        time: horaAtual,
        hi: instantaneo.indiceCalor,
        timeValue: timeToMinutes(horaAtual),
      };
      const ultimo = processado[processado.length - 1];
      if (!ultimo || ultimo.timeValue !== ultimoPonto.timeValue) {
        processado.push(ultimoPonto);
      }
    }

    return processado;
  }, [dadosDiarios, instantaneo]);

  if (isPending) return <p>Carregando gráfico...</p>;

  if (chartData.length === 0) {
    return (
      <div className="estacao-chart-container">
        <h3 className="estacao-chart-title">
          Índice de Calor ao Longo do Dia - {bairro}
        </h3>
        <p>Sem dados para exibir.</p>
      </div>
    );
  }

  return (
    <div className="estacao-chart-container">
      <h3 className="estacao-chart-title">
        Índice de Calor ao Longo do Dia - {bairro}
      </h3>

      <GraficoIndiceCalor pontos={chartData} />
    </div>
  );
}
