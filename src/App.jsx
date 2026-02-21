import { useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import EstacaoMenu from "./components/EstacaoMenu/EstacaoMenu";
import EstacaoCardList from "./components/EstacaoCardList/EstacaoCardList";
import EstacaoCard from "./components/EstacaoCard/EstacaoCard";
import { catalogoEstacoes } from "./data/estacoes";
import Cortina from "./components/Cortina/Cortina";
import EstacaoChart from "./components/EstacaoChart/EstacaoChart";
import EstacaoMap from "./components/EstacaoMap/EstacaoMap";

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
            <EstacaoCardList />
          </>
        );
      case "sobre":
        return (
          <main>
            <h2>Sobre este projeto</h2>
            <p>
              Este projeto visa fornecer informações sobre o índice de calor nas
              estações meteorológicas de Macaé/RJ.
            </p>
          </main>
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
