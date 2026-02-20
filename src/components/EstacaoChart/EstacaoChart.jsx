import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { categoriasIndiceCalor } from "../../data/heatIndex";
import { getCategoriaIndiceCalor } from "../../utils/heatIndexCalculator";

// #region Sample data
const data = [
  { time: "00:00", hi: 27 },
  { time: "00:15", hi: 27 },
  { time: "00:30", hi: 27 },
  { time: "00:45", hi: 27 },
  { time: "01:00", hi: 27 },
  { time: "01:15", hi: 27 },
  { time: "01:45", hi: 27 },
  { time: "02:00", hi: 27 },
  { time: "02:15", hi: 27 },
  { time: "04:15", hi: 27 },
  { time: "04:38", hi: 29 },
  { time: "08:00", hi: 30 },
  { time: "12:00", hi: 35 },
  { time: "16:00", hi: 42 },
  { time: "20:00", hi: 33 },
];
// 1. Helper para converter "HH:mm" em minutos totais do dia
const timeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

// 2. Helper para formatar o número de volta para "HH:00" na legenda
const minutesToLabel = (min) => {
  const h = Math.floor(min / 60);
  return `${h.toString().padStart(2, "0")}:00`;
};

export default function EstacaoChart({ stationId, children }) {
  // Preparamos os dados para o formato numérico
  const chartData = data.map((d) => ({
    ...d,
    timeValue: timeToMinutes(d.time),
  }));

  // Geramos os ticks para cada hora (0, 60, 120... até 1440)
  const ticks = Array.from({ length: 25 }, (_, i) => i * 60);

  return (
    <LineChart
      style={{ width: "100%", aspectRatio: 4, maxWidth: 1200 }}
      responsive
      data={chartData}
      margin={{
        top: 20,
        right: 20,
        bottom: 5,
        left: 0,
      }}
    >
      <CartesianGrid stroke="#aaa" strokeDasharray="3 3" />
      {categoriasIndiceCalor.map(({ categoria, classe, cor, intervalo }) => (
        <ReferenceArea
          key={classe}
          y1={intervalo.min === -Infinity ? 16 : intervalo.min}
          y2={intervalo.max === Infinity ? 65 : intervalo.max}
          fill={cor}
          fillOpacity={0.25}
          label={{
            value: categoria,
            position: "insideTopLeft",
            fontSize: 14,
            fill: cor,
          }}
        />
      ))}

      <Line
        type="monotone"
        dataKey="hi"
        stroke="purple"
        dot={false}
        connectNulls
        name="Sensação Térmica"
        strokeWidth={2}
      />

      <XAxis
        dataKey="timeValue"
        type="number"
        interval={0}
        tick={{ fontSize: 12, fill: "#666" }}
        ticks={ticks}
        tickFormatter={minutesToLabel}
        domain = {[0, 1440]}
      />

      <YAxis
        domain={[16, 65]}
        label={{
        //   value: "Sensação Térmica",
          position: "insideLeft",
          angle: -90,
        }}
        tick={{ fontSize: 12, fill: "#666" }}
        interval={0}
        allowDecimals={false}
        tickCount={8}

      />
      <Legend align="right" />
      <Tooltip
        content={({ active, payload }) => {
          if (!active || !payload?.length) return null;
          const valor = payload[0].value;
          const { categoria, cor } = getCategoriaIndiceCalor(valor);
          return (
            <div style={{ background: "#fff", border: "1px solid #ccc", padding: "8px 12px", borderRadius: 4 }}>
              <p style={{ margin: 0, fontWeight: "bold" }}>Sensação Térmica: {valor}°C</p>
              <p style={{ margin: 0, color: cor }}>{categoria}</p>
            </div>
          );
        }}
      />
    </LineChart>
  );
}
