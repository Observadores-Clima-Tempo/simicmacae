import { useState, useEffect } from "react";
import EstacaoBotao from "../EstacaoBotao/EstacaoBotao";
import { catalogoEstacoes } from "../../data/estacoes";
import { buscarDadosInstantaneosEstacao } from "../../utils/buscarDados";
import "./EstacaoMenu.css";

export default function EstacaoMenu({ estacaoSelecionada }) {
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
  }, []);

  return (
    <>
      <div className="container-menu-estacoes">
      <h2 className="titulo-selecao-estacao">Selecione uma Estação</h2>
        <menu className="scroll-menu-estacoes">
          {estacoesOrdenadas.map((estacao) => (
            <EstacaoBotao
              key={estacao.id}
              stationId={estacao.id}
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
