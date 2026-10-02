import "./Sobre.css";

export default function Sobre() {
  return (
    <main id="sobre-o-projeto">
      <h2>Sobre o Projeto</h2>
      <p>
        O site <strong>SIMIC-Macaé</strong> é uma aplicação tecnológica voltada
        para o monitoramento da sensação térmica no município de Macaé-RJ. Esta
        iniciativa busca aproximar o conhecimento científico gerado na
        universidade da população local, fornecendo dados essenciais sobre o
        comportamento do Sistema Climático Terrestre em nossa região.
      </p>

      <hr />

      <h3>Nossa Missão</h3>
      <p>
        A nossa missão é promover a aproximação entre as pesquisas acadêmicas da{" "}
        <strong>UENF</strong> e a população de Macaé e região. Buscamos
        transformar dados meteorológicos complexos em informações acessíveis e
        operacionais, permitindo que cidadãos, gestores públicos e empresas
        compreendam e gerenciem melhor os impactos do clima em suas atividades
        diárias.
      </p>

      <h3>Como Funciona</h3>
      <ul>
        <li>
          <strong>Coleta de Dados:</strong> Utilizamos informações consolidadas
          de estações meteorológicas via API da{" "}
          <em>The Weather Company (IBM)</em>.
        </li>
        <li>
          <strong>Processamento Científico:</strong> O cálculo da sensação
          térmica segue a{" "}
          <a
            href="https://www.wpc.ncep.noaa.gov/html/heatindex_equation.shtml"
            target="_blank"
            rel="noopener noreferrer"
          >
            equação empírica
          </a>{" "}
          da <em>National Weather Service (NOAA)</em>, garantindo precisão
          técnica na classificação do estresse térmico.
        </li>
        <li>
          <strong>Interface Interativa:</strong> Desenvolvido como uma{" "}
          <em>Single Page Application</em> (SPA) em React, o site oferece uma
          experiência fluida, com alertas visuais que facilitam a interpretação
          dos riscos climáticos.
        </li>
      </ul>

      <h3>Impacto e Relevância</h3>
      <p>
        O monitoramento contínuo auxilia no planejamento urbano, na gestão
        energética e na comunicação de riscos climáticos. Ao traduzir dados
        complexos em categorias de risco (como normal, cuidado ou perigo), a
        ferramenta contribui diretamente para estratégias de adaptação ao
        aumento do estresse térmico na região.
      </p>

      <hr />

      <h3>Equipe e Coordenação</h3>
      <p>
        Este produto tecnológico é fruto de pesquisa acadêmica sob a coordenação
        da <strong>Profa. Maria Gertrudes Alvarez Justi da Silva (UENF)</strong>
        .
      </p>
      <ul>
        <li>
          <strong>Coordenação:</strong> Profa. Maria Gertrudes Alvarez Justi da
          Silva (justi@uenf.br)
        </li>
        <li>
          <strong>Participantes:</strong> Luciana da Silva Costa Teixeira,
          Tamiles Ferreira de Souza e Valmir Monteiro Junior
        </li>
      </ul>
    </main>
  );
}
