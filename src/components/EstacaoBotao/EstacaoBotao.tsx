import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { buscarDadosInstantaneosEstacao } from "../../utils/buscarDados";
import "./EstacaoBotao.css";

interface EstacaoBotaoProps {
  children: ReactNode;
  stationId: string;
  funcaoClick: () => void;
  refreshKey?: number;
}

export default function EstacaoBotao({
  children,
  stationId,
  funcaoClick,
  refreshKey,
}: EstacaoBotaoProps) {
  const [corCategoria, setCorCategoria] = useState<string | null>(null);

  useEffect(() => {
    if (!stationId) return;
    buscarDadosInstantaneosEstacao(stationId).then((dados) => {
      if (dados?.cor) setCorCategoria(dados.cor);
    });
  }, [stationId, refreshKey]);

  return (
    <button className="estacao-botao-menu" onClick={funcaoClick}>
      <i
        className="fa fa-thermometer"
        style={{ color: corCategoria ?? "#aaa", marginRight: "8px", fontSize: "24px" }}
      />
      {children}
    </button>
  );
}
