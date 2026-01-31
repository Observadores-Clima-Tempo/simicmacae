import EstacaoBotao from "../EstacaoBotao/EstacaoBotao";
import { catalogoEstacoes } from "../../data/estacoes";
import "./EstacaoMenu.css";

export default function EstacaoMenu({ estacaoSelecionada }) {
  return (
    <>
      <div className="container-menu-estacoes">
      <h2 className="titulo-selecao-estacao">Selecione uma Estação</h2>
        <menu className="scroll-menu-estacoes">
          {catalogoEstacoes.getEstacoesAtivas().map((estacao) => (
            <EstacaoBotao
              key={estacao.id}
              funcaoClick={() => estacaoSelecionada(estacao)}
            >
              {estacao.bairro}
            </EstacaoBotao>
          ))}
        </menu>
      </div>
    </>
  );
}
