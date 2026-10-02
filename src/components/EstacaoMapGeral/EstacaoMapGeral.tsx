import * as L from "leaflet";
import type { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useContextoEstacoes } from "../../context/estacoesContext";
import { useEstacoesInstantaneas } from "../../hooks/useEstacoes";
import type { MarcadorMapa } from "../../types/domain";
import "./EstacaoMapGeral.css";

const CENTRO_MACAE: LatLngTuple = [-22.407436, -41.845993];
const ZOOM_INICIAL = 12;

function criarIcone(cor: string, hi: string | null) {
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

export default function EstacaoMapGeral() {
  const { estacoesAtivas } = useContextoEstacoes();
  const leituras = useEstacoesInstantaneas(estacoesAtivas);

  const marcadores: MarcadorMapa[] = leituras.flatMap(
    ({ estacao, dados }): MarcadorMapa[] => {
      if (!dados?.lat || !dados?.lon) return [];
      return [
        {
          estacao,
          posicao: [dados.lat, dados.lon],
          cor: dados.cor,
          hi: dados.indiceCalor.toFixed(1),
          dados,
        },
      ];
    },
  );

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
              Temperatura: {dados.temperatura.toFixed(1)}°C
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
