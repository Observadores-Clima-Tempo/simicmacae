import { useState } from "react";
import "./App.css";
import "leaflet/dist/leaflet.css";
import Header from "./components/Header/Header";
import EstacaoMenu from "./components/EstacaoMenu/EstacaoMenu";
import EstacaoCardList from "./components/EstacaoCardList/EstacaoCardList";
import EstacaoCard from "./components/EstacaoCard/EstacaoCard";
import { catalogoEstacoes } from "./data/estacoes";
import Cortina from "./components/Cortina/Cortina";
import EstacaoChart from "./components/EstacaoChart/EstacaoChart";
import EstacaoMap from "./components/EstacaoMap/EstacaoMap";
import Sobre from "./components/Sobre/Sobre";

function App() {
  const [estacaoSelecionadaInfo, setEstacaoSelecionadaInfo] = useState(() =>
    catalogoEstacoes.getPrimeiraEstacaoAtiva(),
  );
  const [menuSelecionado, setMenuSelecionado] = useState("inicio");

  // Função para renderizar o conteúdo da página com base no menu selecionado
  const conteudoPagina = () => {
    switch (menuSelecionado) {
      case "estacoes":
        return (
          <>
            <EstacaoCardList mostrarGauge={false} />
          </>
        );
      case "sobre":
        return (
          <Sobre />
        );
      case "inicio":
      default:
        return (
          <>
            <EstacaoMenu estacaoSelecionada={setEstacaoSelecionadaInfo} />
            <EstacaoCard stationId={estacaoSelecionadaInfo.id}>
              {estacaoSelecionadaInfo.bairro}
            </EstacaoCard>
            <EstacaoChart stationId={estacaoSelecionadaInfo.id}>
              {estacaoSelecionadaInfo.bairro}
            </EstacaoChart>
            <EstacaoMap stationId={estacaoSelecionadaInfo.id}>
              {estacaoSelecionadaInfo.bairro}
            </EstacaoMap>
          </>
        );
    }
  };

  // Renderização principal do app
  return (
    <>
      {/* <Cortina /> */}
      <div className="App">
        <Header
          menuSelecionado={menuSelecionado}
          selecionarMenu={setMenuSelecionado}
        />
        {conteudoPagina()}
      </div>
    </>
  );
}

export default App;
