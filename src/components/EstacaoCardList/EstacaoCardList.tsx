import { lazy, Suspense } from "react";
import EstacaoCard from "../EstacaoCard/EstacaoCard";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";
import { useContextoEstacoes } from "../../context/estacoesContext";
import { useEstacoesInstantaneas } from "../../hooks/useEstacoes";
import "./EstacaoCardList.css";

const EstacaoMapGeral = lazy(
  () => import("../EstacaoMapGeral/EstacaoMapGeral"),
);

interface EstacaoCardListProps {
  mostrarGauge?: boolean;
}

export default function EstacaoCardList({
  mostrarGauge = true,
}: EstacaoCardListProps) {
  const { estacoesAtivas } = useContextoEstacoes();
  const leituras = useEstacoesInstantaneas(estacoesAtivas);

  const estacoesOnline = leituras
    .filter((leitura) => leitura.dados)
    .map((leitura) => leitura.estacao);
  const carregando = leituras.some((leitura) => leitura.carregando);

  return (
    <div className="estacao-card-list-wrapper">
      <ErrorBoundary fallback={<p>Não foi possível exibir o mapa.</p>}>
        <Suspense fallback={<p>Carregando mapa...</p>}>
          <EstacaoMapGeral />
        </Suspense>
      </ErrorBoundary>
      <div className="estacao-card-list-container">
        {!carregando && estacoesOnline.length === 0 && (
          <p>Nenhuma estação online no momento.</p>
        )}
        {estacoesOnline.map((estacao) => (
          <EstacaoCard
            key={estacao.id + "_card"}
            stationId={estacao.id}
            bairro={estacao.bairro}
            mostrarGauge={mostrarGauge}
          />
        ))}
      </div>
    </div>
  );
}
