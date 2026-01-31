import "./EstacaoBotao.css"

export default function EstacaoBotao({children, funcaoClick}) {
  return <button className="estacao-botao-menu" onClick={funcaoClick}>{children}</button>;
}
