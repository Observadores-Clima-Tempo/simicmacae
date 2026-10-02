import { useMemo, useState } from "react";
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
import { useEstacoesInstantaneas } from "./hooks/useEstacoes";
import type { Estacao, MenuPagina } from "./types/domain";

const ESTACAO_INDEFINIDA: Estacao = { id: "", bairro: "", operando: false };

function App() {
  const estacoesAtivas = useMemo(() => catalogoEstacoes.getEstacoesAtivas(), []);
  const leituras = useEstacoesInstantaneas(estacoesAtivas);

  const [estacaoEscolhida, setEstacaoEscolhida] = useState<Estacao | null>(null);
  const [menuSelecionado, setMenuSelecionado] = useState<MenuPagina>("inicio");

  const estacaoPadrao = useMemo(() => {
    const primeira = catalogoEstacoes.getPrimeiraEstacaoAtiva();
    const fallback = catalogoEstacoes.getTodasEstacoes()[0];
    return primeira ?? fallback ?? ESTACAO_INDEFINIDA;
  }, []);

  const aguardandoPrimeirasLeituras = leituras.some((leitura) => leitura.carregando);
  const primeiraOnline = leituras.find((leitura) => leitura.dados)?.estacao;

  const estacaoSelecionadaInfo =
    estacaoEscolhida ??
    (aguardandoPrimeirasLeituras ? estacaoPadrao : (primeiraOnline ?? estacaoPadrao));

  const conteudoPagina = () => {
    switch (menuSelecionado) {
      case "estacoes":
        return <EstacaoCardList mostrarGauge={false} />;
      case "sobre":
        return <Sobre />;
      case "inicio":
      default:
        return (
          <>
            <EstacaoMenu estacaoSelecionada={setEstacaoEscolhida} />
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
