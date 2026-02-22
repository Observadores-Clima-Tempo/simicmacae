import React, { useState, useEffect } from "react";
import { buscarDadosInstantaneosEstacao } from "../../utils/buscarDados";
import { GaugeComponent } from "react-gauge-component";
import "./EstacaoCard.css";

export default function EstacaoCard({ stationId, children, mostrarGauge = true, refreshKey }) {
  const [dadosEstacao, setDadosEstacao] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarDadosInstantaneosEstacao(stationId)
      .then((dados) => setDadosEstacao(dados))
      .finally(() => setLoading(false));
  }, [stationId, refreshKey]);

  if (loading) return <p>Carregando dados de Macaé...</p>;

  if (!dadosEstacao) {
    console.warn("Dados indisponíveis para a estação:", stationId);
    setDadosEstacao({
      temperatura: null,
      umidade: null,
      indiceCalor: null,
      categoria: "Estação Offline",
      cor: "#7f8c8d",
    });
    return null;
  }

  const offline = !dadosEstacao.indiceCalor;

  const coresSubArcs = offline
    ? ["#b0b0b0", "#959595", "#7a7a7a", "#606060", "#444444"]
    : ["#2ecc71", "#f1c40f", "#e67e22", "#e74c3c", "#8e44ad"];

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
          value={dadosEstacao.indiceCalor || 0}
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
              {dadosEstacao.temperatura}°C
            </td>
          </tr>
          <tr className="estacao-card-linha-tab">
            <td className="estacao-card-titulo-tab">Umidade:</td>
            <td className="estacao-card-valor-tab">{dadosEstacao.umidade}%</td>
          </tr>
          <tr className="estacao-card-linha-tab">
            <td className="estacao-card-titulo-tab">Sensação Térmica:</td>
            <td className="estacao-card-valor-tab">
              {dadosEstacao.indiceCalor}°C
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
