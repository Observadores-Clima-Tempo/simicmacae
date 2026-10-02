import { useMemo } from "react";
import type { CSSProperties } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { categoriasIndiceCalor } from "../../data/heatIndex";
import {
  calculateHeatIndex,
  getCategoriaIndiceCalor,
} from "../../utils/heatIndexCalculator";
import {
  useEstacaoDiaria,
  useEstacaoInstantanea,
} from "../../hooks/useEstacoes";
import type { ChartPoint } from "../../types/domain";
import "./EstacaoChart.css";

const isMobile = (): boolean => window.innerWidth < 768;

// Converter horário "HH:MM" para minutos totais (ex: "16:20" => 980)
const timeToMinutes = (timeStr: string): number => {
  const [h, m] = timeStr.split(":").map(Number);
  return h! * 60 + m!;
};

// Converter minutos de volta para formato HH:MM
const minutesToLabel = (min: number): string => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

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

  // domínio máximo é o valor do último ponto
  const maxDomain =
    chartData.length > 0 ? chartData[chartData.length - 1]!.timeValue : 1440;

  // Gerar ticks a cada 60 minutos (1 hora) até o máximo do domínio
  const ticks = Array.from(
    { length: Math.floor(maxDomain / 60) + 1 },
    (_, i) => i * 60,
  );

  return (
    <div className="estacao-chart-container">
      <h3 className="estacao-chart-title">
        Índice de Calor ao Longo do Dia - {bairro}
      </h3>

      {/* ResponsiveContainer preenche 100% da altura disponível na célula do grid */}
      <ResponsiveContainer
        width="100%"
        height="100%"
        style={{ flex: 1, minHeight: 0 } as CSSProperties}
      >
        <LineChart
          data={chartData}
          margin={isMobile()
            ? { top: 10, right: 8, bottom: 5, left: 0 }
            : { top: 20, right: 30, bottom: 5, left: 0 }
          }
        >
          <CartesianGrid stroke="#aaa" strokeDasharray="3 3" vertical={false} />

          {categoriasIndiceCalor.map(({ classe, cor, intervalo }) => (
            <ReferenceArea
              key={classe}
              y1={intervalo.min === -Infinity ? 16 : intervalo.min}
              y2={intervalo.max === Infinity ? 65 : intervalo.max}
              fill={cor}
              fillOpacity={0.25}
            />
          ))}

          <XAxis
            dataKey="timeValue"
            type="number"
            ticks={ticks}
            tickFormatter={minutesToLabel}
            domain={[0, maxDomain]}
            interval={0}
            tick={{ fontSize: 12, fill: "#666" }}
          />

          <YAxis
            domain={[16, 65]}
            tickCount={8}
            interval={0}
            tick={{ fontSize: 12, fill: "#666" }}
            allowDecimals={false}
            width={isMobile() ? 30 : undefined}
          />

          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const valor = payload[0].value;
              const { categoria, cor } = getCategoriaIndiceCalor(valor);
              return (
                <div
                  style={{
                    background: "#fff",
                    border: `2px solid ${cor}`,
                    padding: "8px 12px",
                    borderRadius: 8,
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                    {minutesToLabel(Number(label))}
                  </p>
                  <p
                    style={{
                      margin: "4px 0",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    {valor.toFixed(1)}°C
                  </p>
                  <p
                    style={{
                      margin: 0,
                      color: cor,
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    {categoria}
                  </p>
                </div>
              );
            }}
          />

          <Line
            type="monotone"
            dataKey="hi"
            stroke="purple"
            dot={false}
            strokeWidth={3}
            animationDuration={1500}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
