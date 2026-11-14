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
import { getCategoriaIndiceCalor } from "../../utils/heatIndexCalculator";
import type { ChartPoint } from "../../types/domain";

const isMobile = (): boolean => window.innerWidth < 768;

// Passo padrão dos ticks do eixo X: 1 hora
const DESKTOP_TICK_STEP_MINUTES = 60;
// No mobile, alvo de intervalos entre rótulos (=> até 7 rótulos "HH:MM")
const MOBILE_MAX_TICK_INTERVALS = 6;

// Passo dos ticks do eixo X. No desktop mantém 1h; no mobile aumenta o passo
// (mínimo de 2h) para que os rótulos de horário não se sobreponham no fim do dia.
const getTickStepMinutes = (maxDomain: number): number => {
  if (!isMobile()) return DESKTOP_TICK_STEP_MINUTES;
  const maxHours = maxDomain / 60;
  const hoursPerTick = Math.max(
    2,
    Math.ceil(maxHours / MOBILE_MAX_TICK_INTERVALS),
  );
  return hoursPerTick * 60;
};

// Gerar ticks do início (00:00) até o máximo do domínio com o passo calculado
const buildTicks = (maxDomain: number): number[] => {
  const step = getTickStepMinutes(maxDomain);
  const ticks: number[] = [];
  for (let t = 0; t <= maxDomain; t += step) ticks.push(t);
  return ticks;
};

// Converter minutos de volta para formato HH:MM
const minutesToLabel = (min: number): string => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

export default function GraficoIndiceCalor({ pontos }: { pontos: ChartPoint[] }) {
  const maxDomain = pontos.at(-1)?.timeValue ?? 1440;
  const ticks = buildTicks(maxDomain);

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      minHeight={0}
      style={{ flex: 1 }}
    >
      <LineChart
        data={pontos}
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
  );
}
