import { useState, useEffect } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { categoriasIndiceCalor } from "../../data/heatIndex";
import {
  getCategoriaIndiceCalor,
  calculateHeatIndex,
} from "../../utils/heatIndexCalculator";
import { buscarDadosDiariosEstacao } from "../../utils/buscarDados";
import "./EstacaoChart.css";

// Converter horário "HH:MM" para minutos totais (ex: "16:20" => 980)
const timeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

// Converter minutos de volta para formato HH:MM
const minutesToLabel = (min) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

export default function EstacaoChart({ stationId, children }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarDadosDiariosEstacao(stationId)
      .then((dados) => {
        if (!dados || dados.length === 0) {
          setChartData([]);
          return;
        }
        const processado = dados.map((d) => {
          const { indiceCalor } = calculateHeatIndex(
            Number(d.temperatura),
            Number(d.umidade),
          );
          return {
            time: d.hora.slice(0, 5),
            hi: Number(indiceCalor),
            timeValue: timeToMinutes(d.hora),
          };
        });
        setChartData(processado);
      })
      .finally(() => setLoading(false));
  }, [stationId]);

  if (loading) return <p>Carregando gráfico...</p>;

  // domínio máximo é o valor do último ponto
  const maxDomain =
    chartData.length > 0 ? chartData[chartData.length - 1].timeValue : 1440;

  // Gerar ticks a cada 60 minutos (1 hora) até o máximo do domínio
  const ticks = Array.from(
    { length: Math.floor(maxDomain / 60) + 1 },
    (_, i) => i * 60,
  );

  return (
    <div className="estacao-chart-container">
      <h3 className="estacao-chart-title">
        Sensação Térmica ao Longo do Dia - {children}
      </h3>

      {/* ResponsiveContainer preenche 100% da altura disponível na célula do grid */}
      <ResponsiveContainer
        width="100%"
        height="100%"
        style={{ flex: 1, minHeight: 0 }}
      >
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, bottom: 5, left: 0 }}
        >
          <CartesianGrid stroke="#aaa" strokeDasharray="3 3" vertical={false} />

          {categoriasIndiceCalor.map(
            ({ categoria, classe, cor, intervalo }) => (
              <ReferenceArea
                key={classe}
                y1={intervalo.min === -Infinity ? 16 : intervalo.min}
                y2={intervalo.max === Infinity ? 65 : intervalo.max}
                fill={cor}
                fillOpacity={0.25}
              />
            ),
          )}

          <XAxis
            dataKey="timeValue"
            type="number"
            ticks={ticks}
            tickFormatter={minutesToLabel}
            domain={[0, maxDomain]} // Agora termina exatamente no último dado
            interval={0}
            tick={{ fontSize: 12, fill: "#666" }}
          />

          <YAxis
            domain={[16, 65]}
            tickCount={8}
            interval={0}
            tick={{ fontSize: 12, fill: "#666" }}
            allowDecimals={false}
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
                    {minutesToLabel(label)} {/* Mostrará ex: 16:20 */}
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
