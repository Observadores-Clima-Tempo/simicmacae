import { useEffect, useState } from "react";
import "./App.css";
import "leaflet/dist/leaflet.css";
import Header from "./components/Header/Header";
import EstacaoMenu from "./components/EstacaoMenu/EstacaoMenu";
import EstacaoCardList from "./components/EstacaoCardList/EstacaoCardList";
import EstacaoCard from "./components/EstacaoCard/EstacaoCard";
import { catalogoEstacoes } from "./data/estacoes";
import EstacaoChart from "./components/EstacaoChart/EstacaoChart";
import EstacaoMap from "./components/EstacaoMap/EstacaoMap";
import Sobre from "./components/Sobre/Sobre";
import * as constantes from "./data/constantes";
import { buscarDadosInstantaneosEstacao } from "./utils/buscarDados";
import type { Estacao, MenuPagina } from "./types/domain";

const ESTACAO_INDEFINIDA: Estacao = { id: "", bairro: "", operando: false };

function App() {
  const [estacaoSelecionadaInfo, setEstacaoSelecionadaInfo] =
    useState<Estacao>(() => {
      const primeira = catalogoEstacoes.getPrimeiraEstacaoAtiva();
      const fallback = catalogoEstacoes.getTodasEstacoes()[0];
      return primeira ?? fallback ?? ESTACAO_INDEFINIDA;
    });
  const [menuSelecionado, setMenuSelecionado] = useState<MenuPagina>("inicio");
  const [refreshKey, setRefreshKey] = useState(0);

  // Seleciona a primeira estação com dados reais disponíveis na API
  useEffect(() => {
    const estacoes = catalogoEstacoes.getEstacoesAtivas();
    Promise.all(
      estacoes.map((estacao, index) =>
        buscarDadosInstantaneosEstacao(estacao.id).then((dados) => ({
          estacao,
          index,
          online: !!dados,
        })),
      ),
    ).then((resultados) => {
      const primeiraOnline = resultados
        .sort((a, b) => a.index - b.index)
        .find((r) => r.online);
      if (primeiraOnline) {
        setEstacaoSelecionadaInfo(primeiraOnline.estacao);
      }
    });
  }, []);

  // Atualiza os dados de todas as estações periodicamente
  useEffect(() => {
    const intervalo = setInterval(() => {
      setRefreshKey((k) => k + 1);
    }, constantes.INTERVALO_ATUALIZACAO);
    return () => clearInterval(intervalo);
  }, []);

  const conteudoPagina = () => {
    switch (menuSelecionado) {
      case "estacoes":
        return <EstacaoCardList mostrarGauge={false} refreshKey={refreshKey} />;
      case "sobre":
        return <Sobre />;
      case "inicio":
      default:
        return (
          <>
            <EstacaoMenu
              estacaoSelecionada={setEstacaoSelecionadaInfo}
              refreshKey={refreshKey}
            />
            <EstacaoCard
              stationId={estacaoSelecionadaInfo.id}
              refreshKey={refreshKey}
            >
              {estacaoSelecionadaInfo.bairro}
            </EstacaoCard>
            <EstacaoChart
              stationId={estacaoSelecionadaInfo.id}
              refreshKey={refreshKey}
            >
              {estacaoSelecionadaInfo.bairro}
            </EstacaoChart>
            <EstacaoMap stationId={estacaoSelecionadaInfo.id}>
              {estacaoSelecionadaInfo.bairro}
            </EstacaoMap>
          </>
        );
    }
  };

  return (
    <>
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
