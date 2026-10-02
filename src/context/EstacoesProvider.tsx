import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { catalogoEstacoes } from "../data/estacoes";
import { useEstacoesInstantaneas } from "../hooks/useEstacoes";
import { EstacoesContext } from "./estacoesContext";
import type { EstacoesContextValue } from "./estacoesContext";
import type { Estacao } from "../types/domain";

const ESTACAO_INDEFINIDA: Estacao = { id: "", bairro: "", operando: false };

interface EstacoesProviderProps {
  children: ReactNode;
}

export default function EstacoesProvider({ children }: EstacoesProviderProps) {
  const estacoesAtivas = useMemo(() => catalogoEstacoes.getEstacoesAtivas(), []);
  const leituras = useEstacoesInstantaneas(estacoesAtivas);

  const [estacaoEscolhida, setEstacaoEscolhida] = useState<Estacao | null>(null);

  const estacaoPadrao = useMemo(() => {
    const primeira = catalogoEstacoes.getPrimeiraEstacaoAtiva();
    const fallback = catalogoEstacoes.getTodasEstacoes()[0];
    return primeira ?? fallback ?? ESTACAO_INDEFINIDA;
  }, []);

  const aguardandoPrimeirasLeituras = leituras.some(
    (leitura) => leitura.carregando,
  );
  const primeiraOnline = leituras.find((leitura) => leitura.dados)?.estacao;

  const estacaoSelecionada =
    estacaoEscolhida ??
    (aguardandoPrimeirasLeituras ? estacaoPadrao : (primeiraOnline ?? estacaoPadrao));

  const valor = useMemo<EstacoesContextValue>(
    () => ({
      estacoesAtivas,
      estacaoSelecionada,
      selecionarEstacao: setEstacaoEscolhida,
    }),
    [estacoesAtivas, estacaoSelecionada],
  );

  return (
    <EstacoesContext.Provider value={valor}>{children}</EstacoesContext.Provider>
  );
}
