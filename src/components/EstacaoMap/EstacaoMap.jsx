import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./EstacaoMap.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { buscarDadosInstantaneosEstacao } from "../../utils/buscarDados";
import {
  calculateHeatIndex,
  getCategoriaIndiceCalor,
} from "../../utils/heatIndexCalculator";

const CENTRO_MACAE_PADRAO = [-22.407436, -41.845993];

function RecentralizarMapa({ posicao }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(posicao ?? CENTRO_MACAE_PADRAO);
  }, [posicao, map]);
  return null;
}

export default function EstacaoMap({ stationId, children }) {
  const [posicao, setPosicao] = useState(null);
  const [corCategoria, setCorCategoria] = useState("#2ecc71");

  useEffect(() => {
    if (!stationId) return;
    buscarDadosInstantaneosEstacao(stationId).then((dados) => {
      if (dados?.lat && dados?.lon) {
        setPosicao([dados.lat, dados.lon]);
        if (dados.temperatura && dados.umidade) {
          const { indiceCalor } = calculateHeatIndex(
            Number(dados.temperatura),
            Number(dados.umidade),
          );
          const { cor } = getCategoriaIndiceCalor(Number(indiceCalor));
          setCorCategoria(cor);
        }
      } else {
        setPosicao(null);
      }
    });
  }, [stationId]);

  const iconeColorido = L.divIcon({
    className: "",
    html: `<div style="
      width: 36px;
      height: 36px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      background-color: ${corCategoria};
      border: 3px solid #000000;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background-color: #fff;
        transform: rotate(45deg);
      "></div>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -40],
  });

  return (
    <div className="estacao-map-container">
      <h2>Mapa das Estações</h2>
      <MapContainer
        center={posicao ?? CENTRO_MACAE_PADRAO}
        zoom={15}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        zoomControl={false}
        interactive={false} 
        dragging={false}
        boxZoom={false}
        keyboard={false}
        touchZoom={false}
        className="leaflet-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecentralizarMapa posicao={posicao} />
        {posicao && (
          <Marker position={posicao} icon={iconeColorido}>
            <Popup>
              Bairro: {children} <br /> ID: {stationId}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
