# SIMIC-Macaé

Sistema de Monitoramento do Índice de Calor de Macaé — aplicação web para monitoramento em tempo real da sensação térmica no município de Macaé-RJ, desenvolvida como produto tecnológico de pesquisa acadêmica pela UENF.

## Sobre o Projeto

O **SIMIC-Macaé** coleta dados de estações meteorológicas distribuídas pelos bairros de Macaé e calcula o **Índice de Calor (IC)** a partir da equação de regressão múltipla da NOAA/National Weather Service. O objetivo é traduzir dados meteorológicos complexos em categorias de risco acessíveis à população, auxiliando no planejamento urbano, gestão energética e comunicação de riscos climáticos.

## Funcionalidades

- **Seleção de estação**: menu com todas as estações meteorológicas ativas em Macaé
- **Card de dados instantâneos**: exibe temperatura, umidade, índice de calor calculado e respectiva categoria de risco com alerta visual colorido
- **Gráfico histórico**: evolução temporal dos dados da estação selecionada (Recharts)
- **Mapa interativo**: localização geográfica da estação com marcador colorido conforme a categoria de risco atual (Leaflet)
- **Página "Estações"**: listagem de todas as estações cadastradas
- **Página "Sobre"**: descrição do projeto, metodologia e equipe

## Categorias do Índice de Calor

| Categoria       | Faixa (°C)  | Cor        |
|-----------------|-------------|------------|
| Normal          | < 27        | 🟢 Verde   |
| Cuidado         | 27 – 32     | 🟡 Amarelo |
| Cuidado Extremo | 32 – 41     | 🟠 Laranja |
| Perigo          | 41 – 54     | 🔴 Vermelho|
| Perigo Extremo  | ≥ 54        | 🟣 Roxo    |

## Estações Monitoradas

Estações dos bairros: Miramar, Mirante da Lagoa, Trapiche, Glória, Imboassica, Granja dos Cavalheiros, Aroeira, Botafogo, Visconde de Araújo, Córrego do Ouro, entre outros. Os dados são fornecidos via API da **The Weather Company (IBM)**.

## Tecnologias

| Pacote                  | Versão  | Uso                              |
|-------------------------|---------|----------------------------------|
| React                   | 19      | Framework de UI (SPA)            |
| Vite                    | 7       | Build tool e dev server          |
| React-Leaflet / Leaflet | 5 / 1.9 | Mapas interativos                |
| Recharts                | 3       | Gráficos históricos              |
| react-gauge-component   | 2       | Gauge visual do índice de calor  |

## Instalação e Execução

### Pré-requisitos

- Node.js 18+
- Chave de API da [The Weather Company (IBM)](https://www.wunderground.com/member/api-keys)

### Passos

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/simicmacae.git
cd simicmacae

# Instale as dependências
npm install

# Configure a variável de ambiente
cp .env.example .env
# Edite o arquivo .env e adicione sua chave de API:
# VITE_API_KEY=sua_chave_aqui

# Inicie o servidor de desenvolvimento
npm run dev
```

### Scripts disponíveis

| Comando         | Descrição                        |
|-----------------|----------------------------------|
| `npm run dev`   | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção         |
| `npm run preview` | Visualiza o build de produção  |
| `npm run lint`  | Executa o linter (ESLint)        |

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_KEY=sua_chave_da_weather_company
```

## Estrutura do Projeto

```
src/
├── components/
│   ├── Cortina/          # Tela de carregamento inicial
│   ├── EstacaoCard/      # Card com dados instantâneos da estação
│   ├── EstacaoCardList/  # Listagem de todas as estações
│   ├── EstacaoChart/     # Gráfico histórico de temperatura/umidade/IC
│   ├── EstacaoMap/       # Mapa de localização da estação
│   ├── EstacaoMenu/      # Menu de seleção de estação
│   ├── Header/           # Cabeçalho e navegação
│   └── Footer/           # Rodapé
├── data/
│   ├── estacoes.js       # Catálogo de estações meteorológicas
│   └── heatIndex.js      # Categorias e limiares do índice de calor
├── services/
│   ├── apiConfig.js      # Configuração da API Weather Company
│   ├── weatherCache.js   # Cache de requisições
│   └── weatherServiceAPI.js # Funções de acesso à API
└── utils/
    ├── buscarDados.js          # Orquestração de busca de dados
    └── heatIndexCalculator.js  # Cálculo do IC (equação NOAA)
```

## Equipe

**Coordenação:** Profa. Maria Gertrudes Alvarez Justi da Silva — UENF (justi@uenf.br)

**Participantes:** Luciana da Silva Costa Teixeira · Tamiles Ferreira de Souza · Valmir Monteiro Junior

---

Universidade Estadual do Norte Fluminense Darcy Ribeiro (UENF) — Macaé, RJ
