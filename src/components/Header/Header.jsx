import { useState } from "react";
import "./Header.css";
import image from '../../assets/thermometer.png';

export default function Header({ menuSelecionado, selecionarMenu }) {
  const [navAberta, setNavAberta] = useState(false);

  const handleNavClick = (pagina) => {
    selecionarMenu(pagina);
    setNavAberta(false);
  };

  return (
    <header className="header-app">
      <img src={image} alt="Logo SIM-IC-Macae" className="logo-termometro" />
      <h1 className="titulo-app">Índice de Calor em Macaé/Rj</h1>
      <button
        className="btn-menu-mobile"
        onClick={() => setNavAberta(!navAberta)}
        aria-label="Menu de navegação"
        aria-expanded={navAberta}
      >
        {navAberta ? "✕" : "☰"}
      </button>
      <nav className={`menu-navegacao${navAberta ? " nav-aberta" : ""}`}>
        <button onClick={() => handleNavClick("inicio")} disabled={menuSelecionado === "inicio"}>Painel</button>
        <button onClick={() => handleNavClick("estacoes")} disabled={menuSelecionado === "estacoes"}>Todas as Estações</button>
        <button onClick={() => handleNavClick("sobre")} disabled={menuSelecionado === "sobre"}>Sobre</button>
      </nav>
    </header>
  );
}