import type { ReactNode } from "react";
import { useEstacaoInstantanea } from "../../hooks/useEstacoes";
import "./EstacaoBotao.css";

interface EstacaoBotaoProps {
  children: ReactNode;
  stationId: string;
  funcaoClick: () => void;
}

export default function EstacaoBotao({
  children,
  stationId,
  funcaoClick,
}: EstacaoBotaoProps) {
  const { data } = useEstacaoInstantanea(stationId);

  return (
    <button className="estacao-botao-menu" onClick={funcaoClick}>
      <i
        className="fa fa-thermometer"
        style={{
          color: data?.cor ?? "#aaa",
          marginRight: "8px",
          fontSize: "24px",
        }}
      />
      {children}
    </button>
  );
}
