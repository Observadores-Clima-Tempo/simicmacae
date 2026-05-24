import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { catalogoEstacoes } from "../../data/estacoes";
import { buscarDadosInstantaneosEstacao } from "../../utils/buscarDados";
import {
  calculateHeatIndex,
  getCategoriaIndiceCalor,
} from "../../utils/heatIndexCalculator";
import "./EstacaoMapGeral.css";

const CENTRO_MACAE = [-22.407436, -41.845993];
const ZOOM_INICIAL = 12;

function criarIcone(cor, hi) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 44px;
      height: 44px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      background-color: ${cor};
      border: 3px solid #000000;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        transform: rotate(45deg);
        color: #fff;
        font-weight: bold;
        font-size: 13px;
        font-family: sans-serif;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        text-align: center;
        line-height: 1.2;
        white-space: nowrap;
      ">${hi ? hi + "°" : "—"}</div>
    </div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -48],
  });
}

export default function EstacaoMapGeral({ refreshKey }) {
  const [marcadores, setMarcadores] = useState([]);

  useEffect(() => {
    const estacoes = catalogoEstacoes.getEstacoesAtivas();
    Promise.all(
      estacoes.map((estacao) =>
        buscarDadosInstantaneosEstacao(estacao.id).then((dados) => {
          if (!dados?.lat || !dados?.lon) return null;
          let cor = "#7f8c8d";
          let hi = null;
          if (dados.temperatura && dados.umidade) {
            const { indiceCalor } = calculateHeatIndex(
              Number(dados.temperatura),
              Number(dados.umidade),
            );
            const { cor: corCategoria } = getCategoriaIndiceCalor(
              Number(indiceCalor),
            );
            cor = corCategoria;
            hi = Number(indiceCalor).toFixed(1);
          }
          return { estacao, posicao: [dados.lat, dados.lon], cor, hi, dados };
        }),
      ),
    ).then((results) => setMarcadores(results.filter(Boolean)));
  }, [refreshKey]);

  return (
    <div className="estacao-map-geral-container">
      <h2 className="estacao-map-geral-titulo">Mapa das Estações</h2>
      <MapContainer
        center={CENTRO_MACAE}
        zoom={ZOOM_INICIAL}
        scrollWheelZoom={true}
        className="leaflet-map-geral"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {marcadores.map(({ estacao, posicao, cor, hi, dados }) => (
          <Marker
            key={estacao.id}
            position={posicao}
            icon={criarIcone(cor, hi)}
          >
            <Popup>
              <strong>{estacao.bairro}</strong>
              <br />
              Temperatura: {dados.temperatura}°C
              <br />
              Umidade: {dados.umidade}%
              <br />
              Índice de Calor: {hi}°C
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
