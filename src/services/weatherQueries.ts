import { queryOptions } from "@tanstack/react-query";
import * as constantes from "../data/constantes";
import { catalogoEstacoes } from "../data/estacoes";
import type { DadoDiario, DadosComIndiceCalor } from "../types/domain";
import { weatherServiceAPI } from "./weatherServiceAPI";
import {
  formatarDadoDiario,
  formatarDadoInstantaneo,
  montarDadosComIndiceCalor,
} from "./weatherFormatters";

export const estacaoInstantaneaQueryOptions = (stationId: string) =>
  queryOptions({
    queryKey: ["estacao-instantanea", stationId],
    queryFn: async ({ signal }): Promise<DadosComIndiceCalor | null> => {
      const resposta = await weatherServiceAPI.getLeituraInstantaneaAPI(
        stationId,
        signal,
      );
      const dados = montarDadosComIndiceCalor(formatarDadoInstantaneo(resposta));
      if (!dados) return null;

      // O catálogo é a fonte autoritativa das coordenadas; a API é o fallback.
      const coordenadas = catalogoEstacoes.getCoordenadasPorId(stationId);
      return coordenadas ? { ...dados, ...coordenadas } : dados;
    },
    staleTime: constantes.PRAZO_VALIDADE_DADOS_INSTANTANEOS,
    refetchInterval: constantes.INTERVALO_ATUALIZACAO,
  });

export const estacaoDiariaQueryOptions = (stationId: string) =>
  queryOptions({
    queryKey: ["estacao-diaria", stationId],
    queryFn: async ({ signal }): Promise<DadoDiario[] | undefined> => {
      const resposta = await weatherServiceAPI.getHistoricoDiariaAPI(
        stationId,
        signal,
      );
      return formatarDadoDiario(resposta);
    },
    staleTime: constantes.PRAZO_VALIDADE_DADOS_DIARIOS,
    refetchInterval: constantes.INTERVALO_ATUALIZACAO,
  });
