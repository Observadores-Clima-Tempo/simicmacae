import { useState, useEffect } from "react";
import EstacaoCard from "../EstacaoCard/EstacaoCard";
import { catalogoEstacoes } from "../../data/estacoes";
import { buscarDadosInstantaneosEstacao } from "../../utils/buscarDados";
import "./EstacaoCardList.css";

export default function EstacaoCardList({ mostrarGauge = true, refreshKey }) {
  const [estacoesOrdenadas, setEstacoesOrdenadas] = useState(
    catalogoEstacoes.getEstacoesAtivas()
  );

  useEffect(() => {
    const estacoes = catalogoEstacoes.getEstacoesAtivas();
    Promise.all(
      estacoes.map((estacao) =>
        buscarDadosInstantaneosEstacao(estacao.id).then((dados) => ({
          estacao,
          online: !!dados,
        }))
      )
    ).then((resultados) => {
      const ordenadas = resultados
        .sort((a, b) => Number(b.online) - Number(a.online))
        .map((r) => r.estacao);
      setEstacoesOrdenadas(ordenadas);
    });
  }, [refreshKey]);

  return (
    <div className="estacao-card-list-wrapper">
      {/* <h2 className="estacao-card-list-titulo">Estações Ativas</h2> */}
      <div className="estacao-card-list-container">
        {estacoesOrdenadas.map((estacao) => (
          <EstacaoCard key={estacao.id + "_card"} stationId={estacao.id} mostrarGauge={mostrarGauge}>
            {estacao.bairro}
          </EstacaoCard>
        ))}
      </div>
    </div>
  );
}