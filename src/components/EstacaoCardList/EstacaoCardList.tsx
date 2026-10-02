import { useMemo } from "react";
import EstacaoCard from "../EstacaoCard/EstacaoCard";
import EstacaoMapGeral from "../EstacaoMapGeral/EstacaoMapGeral";
import { catalogoEstacoes } from "../../data/estacoes";
import { useEstacoesInstantaneas } from "../../hooks/useEstacoes";
import "./EstacaoCardList.css";

interface EstacaoCardListProps {
  mostrarGauge?: boolean;
}

export default function EstacaoCardList({
  mostrarGauge = true,
}: EstacaoCardListProps) {
  const estacoesAtivas = useMemo(() => catalogoEstacoes.getEstacoesAtivas(), []);
  const leituras = useEstacoesInstantaneas(estacoesAtivas);

  const estacoesOnline = leituras
    .filter((leitura) => leitura.dados)
    .map((leitura) => leitura.estacao);

  return (
    <div className="estacao-card-list-wrapper">
      <EstacaoMapGeral />
      <div className="estacao-card-list-container">
        {estacoesOnline.map((estacao) => (
          <EstacaoCard
            key={estacao.id + "_card"}
            stationId={estacao.id}
            mostrarGauge={mostrarGauge}
          >
            {estacao.bairro}
          </EstacaoCard>
        ))}
      </div>
    </div>
  );
}
