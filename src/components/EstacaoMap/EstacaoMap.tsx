import { useEffect, useMemo } from "react";
import * as L from "leaflet";
import type { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./EstacaoMap.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEstacaoInstantanea } from "../../hooks/useEstacoes";

const CENTRO_MACAE_PADRAO: LatLngTuple = [-22.407436, -41.845993];

interface RecentralizarMapaProps {
  posicao: LatLngTuple | null;
  zoom: number;
}

function RecentralizarMapa({ posicao, zoom }: RecentralizarMapaProps) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(posicao ?? CENTRO_MACAE_PADRAO, zoom);
  }, [posicao, zoom, map]);
  return null;
}

interface EstacaoMapProps {
  stationId: string;
  bairro: string;
}

export default function EstacaoMap({ stationId, bairro }: EstacaoMapProps) {
  const { data } = useEstacaoInstantanea(stationId);

  const posicao = useMemo<LatLngTuple | null>(
    () => (data && data.lat && data.lon ? [data.lat, data.lon] : null),
    [data],
  );
  const corCategoria = data?.cor ?? "#2ecc71";
  const zoom = posicao ? 15 : 12;

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
      <h2 className="estacao-map-titulo">Localização da Estação</h2>
      <MapContainer
        center={posicao ?? CENTRO_MACAE_PADRAO}
        zoom={zoom}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        zoomControl={false}
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
        <RecentralizarMapa posicao={posicao} zoom={zoom} />
        {posicao && (
          <Marker position={posicao} icon={iconeColorido}>
            <Popup>
              Bairro: {bairro} <br /> ID: {stationId}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
