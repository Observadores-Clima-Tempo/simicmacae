# SIMIC-Macaé

Sistema de Monitoramento do Índice de Calor de Macaé — aplicação web para monitoramento em tempo real da sensação térmica no município de Macaé-RJ, desenvolvida como produto tecnológico de pesquisa acadêmica pela UENF.

## Sobre o Projeto

O **SIMIC-Macaé** coleta dados de estações meteorológicas distribuídas pelos bairros de Macaé e calcula o **Índice de Calor (IC)** a partir da equação de regressão múltipla da NOAA/National Weather Service. O objetivo é traduzir dados meteorológicos complexos em categorias de risco acessíveis à população, auxiliando no planejamento urbano, gestão energética e comunicação de riscos climáticos.

## Funcionalidades

- **Seleção de estação**: menu com todas as estações meteorológicas ativas em Macaé
- **Seleção automática**: ao carregar, a primeira estação com leitura disponível é selecionada automaticamente
- **Card de dados instantâneos**: exibe temperatura, umidade, índice de calor calculado e respectiva categoria de risco com alerta visual colorido
- **Gráfico histórico**: evolução temporal dos dados da estação selecionada (Recharts)
- **Mapa interativo**: localização geográfica da estação com marcador colorido conforme a categoria de risco atual (Leaflet)
- **Página "Estações"**: listagem de todas as estações cadastradas e mapa geral com todas elas
- **Página "Sobre"**: descrição do projeto, metodologia e equipe
- **Atualização automática**: os dados são revalidados a cada 5 minutos

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

| Tecnologia              | Versão  | Uso                                              |
|-------------------------|---------|--------------------------------------------------|
| TypeScript              | 6       | Linguagem e tipagem estática da aplicação        |
| React                   | 19      | Framework de UI (SPA)                            |
| Vite                    | 7       | Build tool e dev server                          |
| TanStack Query          | 5       | Cache, revalidação periódica e estado assíncrono |
| Zod                     | 4       | Validação das respostas da API                   |
| React-Leaflet / Leaflet | 5 / 1.9 | Mapas interativos                                |
| Recharts                | 3       | Gráficos históricos                              |
| react-gauge-component   | 2       | Gauge visual do índice de calor                  |

### Arquitetura de Dados

As leituras vêm da API da The Weather Company e passam por validação com Zod antes de virarem dados da aplicação. O cache, a não-duplicação de requisições, a revalidação a cada 5 minutos e as tentativas automáticas em caso de falha ficam a cargo do TanStack Query: cada estação possui uma única consulta, compartilhada entre card, menu, gráfico e mapas.

## Instalação e Execução

### Pré-requisitos

- Node.js 20.19+ ou 22.12+ (exigência do Vite 7)
- Chave de API da [The Weather Company (IBM)](https://www.wunderground.com/member/api-keys)

### Passos

```bash
# Clone o repositório
git clone https://github.com/Observadores-Clima-Tempo/simicmacae.git
cd simicmacae

# Instale as dependências
npm install

# Crie um arquivo .env na raiz do projeto com a sua chave de API:
# VITE_API_KEY=sua_chave_aqui

# Inicie o servidor de desenvolvimento
npm run dev
```

### Scripts disponíveis

| Comando             | Descrição                                     |
|---------------------|-----------------------------------------------|
| `npm run dev`       | Inicia o servidor de desenvolvimento          |
| `npm run build`     | Verifica os tipos e gera o build de produção  |
| `npm run preview`   | Visualiza o build de produção                 |
| `npm run typecheck` | Verifica os tipos sem gerar build             |
| `npm run lint`      | Executa o linter (ESLint)                     |

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_KEY=sua_chave_da_weather_company
```

A aplicação valida essa variável na inicialização e falha com uma mensagem clara caso ela não esteja definida.

## Estrutura do Projeto

```
src/
├── components/
│   ├── ErrorBoundary/    # Isola falhas de renderização dos widgets
│   ├── EstacaoBotao/     # Botão de seleção de estação
│   ├── EstacaoCard/      # Card com dados instantâneos da estação
│   ├── EstacaoCardList/  # Listagem de todas as estações
│   ├── EstacaoChart/     # Gráfico histórico do índice de calor
│   ├── EstacaoMap/       # Mapa de localização da estação
│   ├── EstacaoMapGeral/  # Mapa com todas as estações
│   ├── EstacaoMenu/      # Menu de seleção de estação
│   ├── Header/           # Cabeçalho e navegação
│   └── Sobre/            # Página sobre o projeto
├── context/
│   ├── estacoesContext.ts    # Contexto de estações e seleção
│   └── EstacoesProvider.tsx  # Provedor do contexto
├── data/
│   ├── constantes.ts     # Intervalos e prazos de validade dos dados
│   ├── estacoes.ts       # Catálogo de estações meteorológicas
│   └── heatIndex.ts      # Categorias e limiares do índice de calor
├── hooks/
│   └── useEstacoes.ts    # Hooks de consulta das estações
├── services/
│   ├── apiConfig.ts          # Configuração e chave da API
│   ├── pwsSchemas.ts         # Schemas de validação das respostas da API
│   ├── weatherFormatters.ts  # Conversão dos dados brutos em dados da aplicação
│   ├── weatherQueries.ts     # Opções de consulta (TanStack Query)
│   └── weatherServiceAPI.ts  # Requisições à API Weather Company
├── types/
│   └── domain.ts         # Tipos de domínio da aplicação
└── utils/
    └── heatIndexCalculator.ts  # Cálculo do IC (equação NOAA)
```

## Equipe

**Coordenação:** Profa. Maria Gertrudes Alvarez Justi da Silva — UENF (justi@uenf.br)

**Participantes:** Luciana da Silva Costa Teixeira · Tamiles Ferreira de Souza · Valmir Monteiro Junior

---

Universidade Estadual do Norte Fluminense Darcy Ribeiro (UENF) — Macaé, RJ
