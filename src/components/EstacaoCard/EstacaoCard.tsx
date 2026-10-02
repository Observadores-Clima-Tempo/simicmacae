import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { GaugeComponent } from "react-gauge-component";
import { buscarDadosInstantaneosEstacao } from "../../utils/buscarDados";
import type { DadosComIndiceCalor } from "../../types/domain";
import "./EstacaoCard.css";

interface EstacaoCardProps {
  stationId: string;
  children: ReactNode;
  mostrarGauge?: boolean;
  refreshKey?: number;
}

interface DadosOffline {
  temperatura: null;
  umidade: null;
  indiceCalor: null;
  categoria: string;
  cor: string;
}

const DADOS_OFFLINE: DadosOffline = {
  temperatura: null,
  umidade: null,
  indiceCalor: null,
  categoria: "Estação Offline",
  cor: "#7f8c8d",
};

export default function EstacaoCard({
  stationId,
  children,
  mostrarGauge = true,
  refreshKey,
}: EstacaoCardProps) {
  const [dadosEstacao, setDadosEstacao] = useState<DadosComIndiceCalor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarDadosInstantaneosEstacao(stationId)
      .then((dados) => {
        if (!dados) {
          console.warn("Dados indisponíveis para a estação:", stationId);
        }
        setDadosEstacao(dados);
      })
      .finally(() => setLoading(false));
  }, [stationId, refreshKey]);

  if (loading) return <p>Carregando dados de Macaé...</p>;

  const dados: DadosComIndiceCalor | DadosOffline = dadosEstacao ?? DADOS_OFFLINE;
  const offline = !dados.indiceCalor;

  const coresSubArcs: [string, string, string, string, string] = offline
    ? ["#b0b0b0", "#959595", "#7a7a7a", "#606060", "#444444"]
    : ["#2ecc71", "#f1c40f", "#e67e22", "#e74c3c", "#8e44ad"];

  return (
    <div className="estacao-card-container">
      <h3 className="estacao-card-bairro">{children}</h3>

      <div className="container-principal-gauge">
        <div
          className="bkg-categoria-ic"
          style={{
            backgroundColor: `${dados.cor}`,
          }}
        >
          <p className="categoria-ic"> {dados.categoria}</p>
        </div>

        <GaugeComponent
          value={Number(dados.indiceCalor) || 0}
          type="semicircle"
          minValue={16}
          maxValue={65}
          arc={{
            width: 0.3,
            padding: 0.015,
            cornerRadius: 2,
            subArcs: [
              {
                limit: 27,
                color: coresSubArcs[0],
                showTick: true,
                tooltip: { text: "Normal" },
              },
              {
                limit: 32,
                color: coresSubArcs[1],
                showTick: true,
                tooltip: { text: "Cuidado" },
              },
              {
                limit: 41,
                color: coresSubArcs[2],
                showTick: true,
                tooltip: { text: "Cuidado Extremo" },
              },
              {
                limit: 54,
                color: coresSubArcs[3],
                showTick: true,
                tooltip: { text: "Perigo" },
              },
              { color: coresSubArcs[4], tooltip: { text: "Perigo Extremo" } },
            ],
          }}
          pointer={{
            type: "needle",
            color: "#e0e0e0",
            length: 0.65,
            width: 8,
            maxFps: 30,
            baseColor: "#ffffff",
            strokeWidth: 0.5,
            strokeColor: "#000000",
          }}
          labels={{
            valueLabel: {
              formatTextValue: (e) => "".concat(e.toFixed(1), "\xb0C"),
              style: {
                fontSize: "1px",
                fill: "#e0e0e0",
                fontWeight: "bold",
              },
              offsetY: 58,
              hide: true,
            },
            tickLabels: {
              type: "outer",
              defaultTickValueConfig: {
                formatTextValue: (e) => "".concat(e, "\xb0"),
                style: { fontSize: "10px", fill: "#5f5f5f" },
              },
              defaultTickLineConfig: { color: "#5f5f5f", length: 4, width: 1 },
            },
          }}
          className="gauge-estacao"
          style={mostrarGauge ? undefined : { display: "none" }}
        />
      </div>

      <table className="estacao-card-tabela">
        <tbody>
          <tr className="estacao-card-linha-tab">
            <td className="estacao-card-titulo-tab">Temperatura:</td>
            <td className="estacao-card-valor-tab">
              {dados.temperatura}°C
            </td>
          </tr>
          <tr className="estacao-card-linha-tab">
            <td className="estacao-card-titulo-tab">Umidade:</td>
            <td className="estacao-card-valor-tab">{dados.umidade}%</td>
          </tr>
          <tr className="estacao-card-linha-tab">
            <td className="estacao-card-titulo-tab">Índice de Calor:</td>
            <td className="estacao-card-valor-tab">
              {dados.indiceCalor}°C
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
