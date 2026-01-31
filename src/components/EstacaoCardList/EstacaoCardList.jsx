import EstacaoCard from "../EstacaoCard/EstacaoCard";
import { catalogoEstacoes } from "../../data/estacoes";

export default function EstacaoCardList() {
  return (
    <>
      <h2>Estações Ativas</h2>
      <div>
        {catalogoEstacoes.getEstacoesAtivas().map((estacao) =>
            <EstacaoCard key={estacao.id+"_card"} stationId={estacao.id}>{estacao.bairro}</EstacaoCard>
        )}
      </div>
    </>
  );
}