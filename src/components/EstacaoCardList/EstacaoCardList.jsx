import EstacaoCard from "../EstacaoCard/EstacaoCard";
import { catalogoEstacoes } from "../../data/estacoes";
import "./EstacaoCardList.css";

export default function EstacaoCardList() {
  return (
    <div className="estacao-card-list-wrapper">
      {/* <h2 className="estacao-card-list-titulo">Estações Ativas</h2> */}
      <div className="estacao-card-list-container">
        {catalogoEstacoes.getEstacoesAtivas().map((estacao) =>
            <EstacaoCard key={estacao.id+"_card"} stationId={estacao.id}>{estacao.bairro}</EstacaoCard>
        )}
      </div>
    </div>
  );
}