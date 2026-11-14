import type { IndiceCalorCalculado } from "../types/domain";
import { calculateHeatIndex } from "../utils/heatIndexCalculator";

const URL_PREVISAO =
  "https://raw.githubusercontent.com/Observadores-Clima-Tempo/dados-meteorologicos/main/PrevisaoMacae/macae_rj_previsao.csv";

const FUSO_MACAE = "America/Sao_Paulo";

export interface HorarioPrevisto extends IndiceCalorCalculado {
  data: string;
  hora: string;
  temperatura: number;
  umidade: number;
}

interface DiaPrevisto {
  data: string;
  horarios: HorarioPrevisto[];
}

const lerCampos = (linha: string) =>
  linha.split(",").map((campo) => campo.trim().replace(/^"(.*)"$/, "$1"));

// O CSV publica campos escalares sem vírgulas internas.
export function lerPrevisao(csv: string, aPartirDe = "") {
  const [cabecalho = "", ...linhas] = csv.trim().split(/\r?\n/);
  const colunas = lerCampos(cabecalho);
  const rodadaColuna = colunas.indexOf("rodada");
  const dataColuna = colunas.indexOf("data_hora_local");
  const temperaturaColuna = colunas.indexOf("temperatura_C");
  const umidadeColuna = colunas.indexOf("umidade_relativa_pct");

  if ([rodadaColuna, dataColuna, temperaturaColuna, umidadeColuna].includes(-1)) {
    throw new Error("Formato de previsão inválido.");
  }

  let rodada = "";
  const horarios = new Map<string, HorarioPrevisto>();

  for (const linha of linhas) {
    const campos = lerCampos(linha);
    const rodadaLinha = campos[rodadaColuna] ?? "";
    const dataHora = campos[dataColuna] ?? "";
    const temperaturaCampo = campos[temperaturaColuna];
    const umidadeCampo = campos[umidadeColuna];

    if (!/^\d{10}$/.test(rodadaLinha)) continue;
    if (rodadaLinha < rodada) continue;
    if (rodadaLinha > rodada) {
      rodada = rodadaLinha;
      horarios.clear();
    }

    const partes = /^(\d{4}-\d{2}-\d{2}) ([01]\d|2[0-3]):([0-5]\d)$/.exec(dataHora);
    if (!partes || dataHora < aPartirDe || !temperaturaCampo || !umidadeCampo) continue;
    const data = partes[1]!;
    const dataUtc = new Date(`${data}T00:00:00Z`);
    if (!Number.isFinite(+dataUtc) || dataUtc.toISOString().slice(0, 10) !== data) continue;

    const temperatura = Number(temperaturaCampo);
    const umidade = Number(umidadeCampo);
    if (!Number.isFinite(temperatura) || !Number.isFinite(umidade) || umidade < 0 || umidade > 100) continue;

    const calculo = calculateHeatIndex(temperatura, umidade);
    if (!Number.isFinite(calculo.indiceCalor)) continue;

    horarios.set(dataHora, {
      ...calculo,
      data,
      hora: dataHora.slice(11),
      temperatura,
      umidade,
    });
  }

  const dias = new Map<string, DiaPrevisto>();
  for (const chave of [...horarios.keys()].sort()) {
    const horario = horarios.get(chave)!;
    const dia = dias.get(horario.data);
    if (dia) {
      dia.horarios.push(horario);
    } else {
      dias.set(horario.data, { data: horario.data, horarios: [horario] });
    }
  }

  const diasPrevistos = [...dias.values()];
  const ultimoDia = diasPrevistos.at(-1);
  if (ultimoDia && ultimoDia.horarios.at(-1)?.hora !== "23:00") {
    diasPrevistos.pop();
  }

  return { dias: diasPrevistos };
}

export async function buscarPrevisao(signal: AbortSignal) {
  const resposta = await fetch(URL_PREVISAO, { signal, cache: "no-cache" });
  if (!resposta.ok) throw new Error("Não foi possível baixar a previsão.");
  const agora = new Intl.DateTimeFormat("sv-SE", {
    timeZone: FUSO_MACAE,
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());
  return lerPrevisao(await resposta.text(), agora);
}
