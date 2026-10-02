export interface Estacao {
  id: string;
  bairro: string;
  operando: boolean;
}

export interface IntervaloIndiceCalor {
  min: number;
  max: number;
}

export interface CategoriaIndiceCalor {
  categoria: string;
  classe: string;
  cor: string;
  intervalo: IntervaloIndiceCalor;
}

export interface ClassificacaoIndiceCalor {
  categoria: string;
  classe: string;
  cor: string;
}

export type IndiceCalorCalculado = ClassificacaoIndiceCalor & {
  indiceCalor: number;
};

export interface TelemetriaInstantanea {
  temperatura: number;
  umidade: number;
  lat: number;
  lon: number;
}

export interface TelemetriaIndisponivel {
  temperatura: null;
  umidade: null;
  lat: null;
  lon: null;
}

export type DadosInstantaneos = TelemetriaInstantanea | TelemetriaIndisponivel;

export type DadosComIndiceCalor = TelemetriaInstantanea & IndiceCalorCalculado;

export interface DadoDiario {
  hora: string;
  temperatura: number;
  umidade: number;
}

export type MenuPagina = "inicio" | "estacoes" | "sobre";

export interface ChartPoint {
  time: string;
  hi: number;
  timeValue: number;
}

export interface MarcadorMapa {
  estacao: Estacao;
  posicao: [number, number];
  cor: string;
  hi: string | null;
  dados: DadosComIndiceCalor;
}
