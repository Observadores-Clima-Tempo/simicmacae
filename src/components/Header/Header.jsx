import "./Header.css";
import image from '../../assets/thermometer.png';

export default function Header({ menuSelecionado, selecionarMenu }) {
  return (
    <header className="header-app">
      <img src={image} alt="Logo SIM-IC-Macae" className="logo-termometro" />
      <h1 className="titulo-app">Índice de Calor em Macaé/Rj </h1>
      <nav className="menu-navegacao">
        <button onClick={() => selecionarMenu("inicio")} disabled={menuSelecionado === "inicio"}>Início</button>
        <button onClick={() => selecionarMenu("estacoes")} disabled={menuSelecionado === "estacoes"}>Estações</button>
        <button onClick={() => selecionarMenu("sobre")} disabled={menuSelecionado === "sobre"}>Sobre</button>
      </nav>
    </header>
  );
}