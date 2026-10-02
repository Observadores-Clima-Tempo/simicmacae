import EstacaoBotao from "../EstacaoBotao/EstacaoBotao";
import { useContextoEstacoes } from "../../context/estacoesContext";
import { useEstacoesInstantaneas } from "../../hooks/useEstacoes";
import "./EstacaoMenu.css";

export default function EstacaoMenu() {
  const { estacoesAtivas, selecionarEstacao } = useContextoEstacoes();
  const leituras = useEstacoesInstantaneas(estacoesAtivas);

  const estacoesOrdenadas = [...leituras]
    .sort((a, b) => Number(!!b.dados) - Number(!!a.dados))
    .map((leitura) => leitura.estacao);

  return (
    <>
      <div className="container-menu-estacoes">
      <h2 className="titulo-selecao-estacao">Selecione uma Estação</h2>
        <menu className="scroll-menu-estacoes">
          {estacoesOrdenadas.map((estacao) => (
            <EstacaoBotao
              key={estacao.id}
              stationId={estacao.id}
              bairro={estacao.bairro}
              funcaoClick={() => selecionarEstacao(estacao)}
            />
          ))}
        </menu>
      </div>
    </>
  );
}
