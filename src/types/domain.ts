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
  indiceCalor: string;
};

export interface TelemetriaInstantanea {
  temperatura: string;
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
  temperatura: string;
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

export interface CacheEntry<T> {
  dados: T;
  timestamp: number;
}

export interface PwsMetric {
  temp: number;
  tempAvg: number;
}

export interface PwsObservation {
  metric: PwsMetric;
  humidity: number;
  humidityAvg: number;
  lat: number;
  lon: number;
  obsTimeLocal: string;
}

export interface PwsResponse {
  observations: PwsObservation[];
}
