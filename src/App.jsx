import { useState } from "react";
import "./App.css";
import "leaflet/dist/leaflet.css";
import Header from "./components/Header/Header";
import EstacaoMenu from "./components/EstacaoMenu/EstacaoMenu";
import EstacaoCardList from "./components/EstacaoCardList/EstacaoCardList";
import EstacaoCard from "./components/EstacaoCard/EstacaoCard";
import { catalogoEstacoes } from "./data/estacoes";
import Cortina from "./components/Cortina/Cortina";
import EstacaoChart from "./components/EstacaoChart/EstacaoChart";
import EstacaoMap from "./components/EstacaoMap/EstacaoMap";

function App() {
  const [estacaoSelecionadaInfo, setEstacaoSelecionadaInfo] = useState(() =>
    catalogoEstacoes.getPrimeiraEstacaoAtiva(),
  );
  const [menuSelecionado, setMenuSelecionado] = useState("inicio");

  // Função para renderizar o conteúdo da página com base no menu selecionado
  const conteudoPagina = () => {
    switch (menuSelecionado) {
      case "estacoes":
        return (
          <>
            <EstacaoCardList mostrarGauge={false} />
          </>
        );
      case "sobre":
        return (
          <main id="sobre-o-projeto">
            <h2>Sobre o Projeto</h2>
            <p>
              O site <strong>SIM-IC Macaé</strong> é uma
              aplicação tecnológica voltada para o monitoramento da sensação
              térmica no município de Macaé-RJ. Esta iniciativa
              busca aproximar o conhecimento científico gerado na universidade
              da população local, fornecendo dados essenciais sobre o
              comportamento do Sistema Climático Terrestre em nossa região.
            </p>

            <hr />

            <h3>Nossa Missão</h3>
            <p>
            A nossa missão é promover a aproximação entre as pesquisas acadêmicas da 
            <strong>UENF</strong> e a população de Macaé e região. Buscamos transformar 
            dados meteorológicos complexos em informações acessíveis e operacionais, 
            permitindo que cidadãos, gestores públicos e empresas compreendam e gerenciem 
            melhor os impactos do clima em suas atividades diárias.
            </p>
            <p>
              O foco principal é a análise do{" "}
              <strong>Índice de Calor (IC)</strong>, uma ferramenta crucial em
              regiões tropicais úmidas como Macaé, onde a alta umidade
              potencializa o desconforto térmico e os impactos à saúde.
            </p>

            <h3>Como Funciona</h3>
            <ul>
              <li>
                <strong>Coleta de Dados:</strong> Utilizamos informações
                consolidadas de estações meteorológicas via API da{" "}
                <em>The Weather Company (IBM)</em>.
              </li>
              <li>
                <strong>Processamento Científico:</strong> O cálculo da sensação
                térmica segue a equação empírica da{" "}
                <em>National Weather Service (NOAA)</em>, garantindo precisão
                técnica na classificação do estresse térmico.
              </li>
              <li>
                <strong>Interface Interativa:</strong> Desenvolvido como uma{" "}
                <em>Single Page Application</em> (SPA) em React, o site oferece
                uma experiência fluida, com alertas visuais que facilitam a
                interpretação dos riscos climáticos.
              </li>
            </ul>

            <h3>Impacto e Relevância</h3>
            <p>
              O monitoramento contínuo auxilia no planejamento urbano, na gestão
              energética e na comunicação de riscos climáticos. Ao
              traduzir dados complexos em categorias de risco (como normal,
              cuidado ou perigo), a ferramenta contribui diretamente para
              estratégias de adaptação ao aumento do estresse térmico na
              região.
            </p>

            <hr />

            <h3>Equipe e Coordenação</h3>
            <p>
              Este produto tecnológico é fruto de pesquisa acadêmica sob a
              coordenação da{" "}
              <strong>
                Profa. Maria Gertrudes Alvarez Justi da Silva (UENF)
              </strong>
              .
            </p>
            <ul>
              <li>
                <strong>Coordenação:</strong> Profa. Maria Gertrudes Alvarez
                Justi da Silva (justi@uenf.br)
              </li>
              <li>
                <strong>Participantes:</strong> Luciana da Silva Costa Teixeira,
                Tamiles Ferreira de Souza e Valmir Monteiro Junior 
              </li>
            </ul>
          </main>
        );
      case "inicio":
      default:
        return (
          <>
            <EstacaoMenu estacaoSelecionada={setEstacaoSelecionadaInfo} />
            <EstacaoCard stationId={estacaoSelecionadaInfo.id}>
              {estacaoSelecionadaInfo.bairro}
            </EstacaoCard>
            <EstacaoChart stationId={estacaoSelecionadaInfo.id}>
              {estacaoSelecionadaInfo.bairro}
            </EstacaoChart>
            <EstacaoMap stationId={estacaoSelecionadaInfo.id}>
              {estacaoSelecionadaInfo.bairro}
            </EstacaoMap>
          </>
        );
    }
  };

  // Renderização principal do app
  return (
    <>
      {/* <Cortina /> */}
      <div className="App">
        <Header
          menuSelecionado={menuSelecionado}
          selecionarMenu={setMenuSelecionado}
        />
        {conteudoPagina()}
      </div>
    </>
  );
}

export default App;
