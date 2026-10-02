import { useEstacaoInstantanea } from "../../hooks/useEstacoes";
import "./EstacaoBotao.css";

interface EstacaoBotaoProps {
  stationId: string;
  bairro: string;
  funcaoClick: () => void;
}

export default function EstacaoBotao({
  stationId,
  bairro,
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
      {bairro}
    </button>
  );
}
