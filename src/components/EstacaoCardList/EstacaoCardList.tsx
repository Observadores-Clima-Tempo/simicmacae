import { useEffect, useState } from "react";
import EstacaoCard from "../EstacaoCard/EstacaoCard";
import EstacaoMapGeral from "../EstacaoMapGeral/EstacaoMapGeral";
import { catalogoEstacoes } from "../../data/estacoes";
import { buscarDadosInstantaneosEstacao } from "../../utils/buscarDados";
import type { Estacao } from "../../types/domain";
import "./EstacaoCardList.css";

interface EstacaoCardListProps {
  mostrarGauge?: boolean;
  refreshKey?: number;
}

export default function EstacaoCardList({
  mostrarGauge = true,
  refreshKey,
}: EstacaoCardListProps) {
  const [estacoesOnline, setEstacoesOnline] = useState<Estacao[]>([]);

  useEffect(() => {
    const estacoes = catalogoEstacoes.getEstacoesAtivas();
    Promise.all(
      estacoes.map((estacao) =>
        buscarDadosInstantaneosEstacao(estacao.id).then((dados) => ({
          estacao,
          online: !!dados,
        })),
      ),
    ).then((resultados) => {
      const online = resultados
        .filter((r) => r.online)
        .map((r) => r.estacao);
      setEstacoesOnline(online);
    });
  }, [refreshKey]);

  return (
    <div className="estacao-card-list-wrapper">
      <EstacaoMapGeral refreshKey={refreshKey} />
      <div className="estacao-card-list-container">
        {estacoesOnline.map((estacao) => (
          <EstacaoCard key={estacao.id + "_card"} stationId={estacao.id} mostrarGauge={mostrarGauge}>
            {estacao.bairro}
          </EstacaoCard>
        ))}
      </div>
    </div>
  );
}
