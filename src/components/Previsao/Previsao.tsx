import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import GraficoIndiceCalor from "../EstacaoChart/GraficoIndiceCalor";
import { timeToMinutes } from "../../utils/timeToMinutes";
import { buscarPrevisao } from "../../services/previsaoService";
import "./Previsao.css";

const formatoDia = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  timeZone: "UTC",
});

const formatarDia = (data: string) => {
  const dia = formatoDia.format(new Date(`${data}T00:00:00Z`)).replace(/-feira$/, "");
  return dia.charAt(0).toUpperCase() + dia.slice(1);
};

const formatarData = (data: string) => `${data.slice(8, 10)}/${data.slice(5, 7)}`;

export default function Previsao() {
  const [dataSelecionada, selecionarData] = useState("");
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ["previsao-macae"],
    queryFn: ({ signal }) => buscarPrevisao(signal),
    staleTime: 15 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const dias = data?.dias ?? [];
  const dia = dias.find(({ data }) => data === dataSelecionada) ?? dias[0];
  const pontos = dia?.horarios.map((horario) => ({
    time: horario.hora,
    timeValue: timeToMinutes(horario.hora),
    hi: horario.indiceCalor,
  })) ?? [];
  return (
    <main className="previsao" aria-label="Previsão do Índice de Calor">
      {isPending && <p role="status">Carregando previsão...</p>}
      {isError && (
        <div className="previsao-painel" role="status">
          <p>{dia ? "Não foi possível atualizar a previsão. Exibindo a última rodada carregada." : "Não foi possível carregar a previsão."}</p>
          <button className="previsao-tentar" type="button" disabled={isFetching} onClick={() => void refetch()}>
            Tentar novamente
          </button>
        </div>
      )}
      {!isPending && !isError && !dia && <p role="status">Sem previsão disponível para os próximos horários.</p>}

      {dia && (
        <>
          <section aria-labelledby="previsao-dias">
            <h3 id="previsao-dias">Próximos dias</h3>
            <div className="previsao-dias">
              {dias.map(({ data }) => (
                <button
                  key={data}
                  type="button"
                  className="previsao-painel previsao-dia"
                  aria-pressed={dia.data === data}
                  aria-controls="previsao-detalhes"
                  onClick={() => selecionarData(data)}
                >
                  <time dateTime={data}>
                    <span>{formatarDia(data)}</span>
                    <span>{formatarData(data)}</span>
                  </time>
                </button>
              ))}
            </div>
          </section>

          <section className="previsao-painel" id="previsao-detalhes" aria-labelledby="previsao-grafico">
            <h3 id="previsao-grafico" aria-live="polite">
              IC previsto · {formatarDia(dia.data)}, {formatarData(dia.data)}
            </h3>
            <div className="previsao-grafico">
              <GraficoIndiceCalor pontos={pontos} />
            </div>
          </section>
        </>
      )}
    </main>
  );
}
