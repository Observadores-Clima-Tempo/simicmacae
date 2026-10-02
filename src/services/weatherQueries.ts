import { queryOptions } from "@tanstack/react-query";
import * as constantes from "../data/constantes";
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
      return montarDadosComIndiceCalor(formatarDadoInstantaneo(resposta));
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
