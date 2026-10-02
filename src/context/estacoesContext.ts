import { createContext, useContext } from "react";
import type { Estacao } from "../types/domain";

export interface EstacoesContextValue {
  estacoesAtivas: Estacao[];
  estacaoSelecionada: Estacao;
  selecionarEstacao: (estacao: Estacao) => void;
}

export const EstacoesContext = createContext<EstacoesContextValue | null>(null);

export function useContextoEstacoes(): EstacoesContextValue {
  const valor = useContext(EstacoesContext);

  if (!valor) {
    throw new Error(
      "useContextoEstacoes deve ser usado dentro de EstacoesProvider.",
    );
  }

  return valor;
}
