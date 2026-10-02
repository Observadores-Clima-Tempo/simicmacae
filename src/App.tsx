import { lazy, Suspense, useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import EstacaoMenu from "./components/EstacaoMenu/EstacaoMenu";
import EstacaoCardList from "./components/EstacaoCardList/EstacaoCardList";
import EstacaoCard from "./components/EstacaoCard/EstacaoCard";
import Sobre from "./components/Sobre/Sobre";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { useContextoEstacoes } from "./context/estacoesContext";
import type { MenuPagina } from "./types/domain";

const EstacaoChart = lazy(
  () => import("./components/EstacaoChart/EstacaoChart"),
);
const EstacaoMap = lazy(() => import("./components/EstacaoMap/EstacaoMap"));

function App() {
  const { estacaoSelecionada } = useContextoEstacoes();
  const [menuSelecionado, setMenuSelecionado] = useState<MenuPagina>("inicio");

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
            <EstacaoMenu />
            <EstacaoCard
              stationId={estacaoSelecionada.id}
              bairro={estacaoSelecionada.bairro}
            />
            <ErrorBoundary fallback={<p>Não foi possível exibir o gráfico.</p>}>
              <Suspense fallback={<p>Carregando gráfico...</p>}>
                <EstacaoChart
                  stationId={estacaoSelecionada.id}
                  bairro={estacaoSelecionada.bairro}
                />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback={<p>Não foi possível exibir o mapa.</p>}>
              <Suspense fallback={<p>Carregando mapa...</p>}>
                <EstacaoMap
                  stationId={estacaoSelecionada.id}
                  bairro={estacaoSelecionada.bairro}
                />
              </Suspense>
            </ErrorBoundary>
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
        <ErrorBoundary fallback={<p>Ocorreu um erro ao exibir o conteúdo.</p>}>
          {conteudoPagina()}
        </ErrorBoundary>
      </div>
    </>
  );
}

export default App;
