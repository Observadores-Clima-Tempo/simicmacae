import { useState, useEffect } from "react";
import { buscarDadosInstantaneosEstacao } from "../../utils/buscarDados";
import "./EstacaoBotao.css";

export default function EstacaoBotao({ children, stationId, funcaoClick, refreshKey }) {
  const [corCategoria, setCorCategoria] = useState(null);

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
