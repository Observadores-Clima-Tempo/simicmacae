import React, { useState, useEffect } from "react";
import { weatherServiceAPI } from "../../services/weatherServiceAPI";
import { calculateHeatIndex as calcularIndiceCalor } from "../../utils/heatIndexCalculator";
import { getCategoriaIndiceCalor } from "../../utils/heatIndexCalculator";
import { weatherCache } from "../../services/weatherCache";
import { GaugeComponent } from "react-gauge-component";
import "./EstacaoCard.css";

export default function EstacaoCard({ stationId, children }) {
  const [dadosEstacao, setDadosEstacao] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function buscarDadosEstacao() {
      try {
        // Busca dados da estação
        const telemetria = await weatherCache.getLeituraInstantanea(stationId);

        if (telemetria?.temperatura && telemetria?.umidade) {
          // Calcula índice de calor e categoriza
          const indiceCalor = calcularIndiceCalor(
            telemetria.temperatura,
            telemetria.umidade,
          );
          setDadosEstacao({ ...telemetria, ...indiceCalor });
        } else {
          setDadosEstacao(null);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    buscarDadosEstacao();
  }, [stationId]);

  if (loading) return <p>Carregando dados de Macaé...</p>;

  if (!dadosEstacao) {
    console.warn("Dados indisponíveis para a estação:", stationId);
    return null;
  }

  return (
    <div className="estacao-card-container">
      <h3 className="estacao-card-bairro">{children}</h3>

      <div className="container-principal-gauge">
        <div
          className="bkg-categoria-ic"
          style={{
            backgroundColor: `${dadosEstacao.cor}`,
          }}
        >
          <p className="categoria-ic"> {dadosEstacao.categoria}</p>
        </div>

        <GaugeComponent
          value={dadosEstacao.indiceCalor}
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
                color: "#2ecc71",
                showTick: true,
                tooltip: { text: "Normal" },
              },
              {
                limit: 32,
                color: "#f1c40f",
                showTick: true,
                tooltip: { text: "Cuidado" },
              },
              {
                limit: 41,
                color: "#e67e22",
                showTick: true,
                tooltip: { text: "Cuidado Extremo" },
              },
              {
                limit: 54,
                color: "#e74c3c",
                showTick: true,
                tooltip: { text: "Perigo" },
              },
              { color: "#8e44ad", tooltip: { text: "Perigo Extremo" } },
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
        />
      </div>

      <table className="estacao-card-tabela">
        <tbody>
          <tr className="estacao-card-linha-tab">
            <td className="estacao-card-titulo-tab">Temperatura:</td>
            <td className="estacao-card-valor-tab">
              {dadosEstacao.temperatura}°C
            </td>
          </tr>
          <tr className="estacao-card-linha-tab">
            <td className="estacao-card-titulo-tab">Umidade:</td>
            <td className="estacao-card-valor-tab">{dadosEstacao.umidade}%</td>
          </tr>
          <tr className="estacao-card-linha-tab">
            <td className="estacao-card-titulo-tab">Índice de Calor:</td>
            <td className="estacao-card-valor-tab">
              {dadosEstacao.indiceCalor}°C
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
