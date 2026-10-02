import { useMemo } from "react";
import EstacaoBotao from "../EstacaoBotao/EstacaoBotao";
import { catalogoEstacoes } from "../../data/estacoes";
import { useEstacoesInstantaneas } from "../../hooks/useEstacoes";
import type { Estacao } from "../../types/domain";
import "./EstacaoMenu.css";

interface EstacaoMenuProps {
  estacaoSelecionada: (estacao: Estacao) => void;
}

export default function EstacaoMenu({ estacaoSelecionada }: EstacaoMenuProps) {
  const estacoesAtivas = useMemo(() => catalogoEstacoes.getEstacoesAtivas(), []);
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
