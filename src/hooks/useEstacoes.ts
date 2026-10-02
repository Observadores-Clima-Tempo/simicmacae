import { useQueries, useQuery } from "@tanstack/react-query";
import {
  estacaoDiariaQueryOptions,
  estacaoInstantaneaQueryOptions,
} from "../services/weatherQueries";
import type { Estacao } from "../types/domain";

export function useEstacaoInstantanea(stationId: string) {
  return useQuery(estacaoInstantaneaQueryOptions(stationId));
}

export function useEstacoesInstantaneas(estacoes: Estacao[]) {
  return useQueries({
    queries: estacoes.map((estacao) => estacaoInstantaneaQueryOptions(estacao.id)),
    combine: (resultados) =>
      resultados.map((resultado, index) => ({
        estacao: estacoes[index]!,
        dados: resultado.data ?? null,
        carregando: resultado.isPending,
      })),
  });
}

export function useEstacaoDiaria(stationId: string) {
  return useQuery(estacaoDiariaQueryOptions(stationId));
}
