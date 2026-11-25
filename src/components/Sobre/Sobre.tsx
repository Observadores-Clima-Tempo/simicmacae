import logoUenf from "../../assets/logo-uenf-sem-texto.png";
import "./Sobre.css";

export default function Sobre() {
  return (
    <main id="sobre-o-projeto">
      <h2>Sobre o Projeto</h2>
      <p>
        O <strong>SIMIC-Macaé</strong> — Sistema de Monitoramento do Índice de
        Calor de Macaé é um produto tecnológico derivado da pesquisa de mestrado
        de Luciana da Silva Costa Teixeira, intitulada{" "}
        <em>
          Estresse térmico em Macaé-RJ: Análise do Índice de Calor e Principais
          Implicações
        </em>
        . A pesquisa foi desenvolvida no Programa de Pós-Graduação em Clima e
        Energia da Universidade Estadual do Norte Fluminense Darcy Ribeiro
        (UENF), sob orientação da professora Maria Gertrudes Alvarez Justi da
        Silva, e deu origem à plataforma desenvolvida no Laboratório de
        Meteorologia (LAMET/UENF).
      </p>

      <hr />

      <h3>Nossa Missão</h3>
      <p>
        Aproximar a pesquisa da UENF da população de Macaé, transformando dados
        meteorológicos em informações que ajudem moradores e gestores públicos a
        acompanhar as condições de calor, entender os riscos e planejar medidas
        de proteção.
      </p>

      <h3>Como Funciona</h3>
      <ul>
        <li>
          <strong>Coleta de dados:</strong> a plataforma reúne dados de
          temperatura do ar e umidade relativa de estações meteorológicas em
          diferentes localidades de Macaé, acessados pela API da{" "}
          <em>The Weather Company</em>.
        </li>
        <li>
          <strong>Cálculo do Índice de Calor:</strong> o IC combina a temperatura
          do ar e a umidade relativa para estimar a sensação de calor à sombra. O
          cálculo tem como referência a{" "}
          <a
            href="https://www.wpc.ncep.noaa.gov/html/heatindex_equation.shtml"
            target="_blank"
            rel="noopener noreferrer"
          >
            metodologia do National Weather Service (NOAA)
          </a>
          , que inclui a regressão de Rothfusz. Em condições quentes, a umidade
          elevada dificulta a evaporação do suor, reduzindo a capacidade do corpo
          de dissipar calor.
        </li>
        <li>
          <strong>Visualização por localidade:</strong> o mapa e os indicadores
          da plataforma mostram o Índice de Calor em cada ponto monitorado e
          facilitam a comparação das condições entre diferentes locais do
          município.
        </li>
      </ul>

      <h3>Impacto e Relevância</h3>
      <p>
        As condições de calor variam dentro de Macaé. Acompanhar mais de uma
        localidade ajuda a identificar onde e em quais horários o Índice de Calor
        atinge valores mais altos. Essas informações apoiam a comunicação de
        riscos à população e o planejamento das ações de proteção pela Defesa
        Civil. A plataforma fornece os dados de apoio; a emissão de alertas
        oficiais e o acionamento de medidas seguem os critérios do protocolo
        municipal.
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
        <li>
          <strong>Colaboradores:</strong> Nadja Nucia Marinho Batista
        </li>
      </ul>

      <img
        src={logoUenf}
        alt="Universidade Estadual do Norte Fluminense Darcy Ribeiro"
        className="logo-uenf"
      />
    </main>
  );
}
