import { MUNICIPIOS_PE, type MunicipioBase } from "./municipios-pe";

export const anos = [2024, 2025, 2026] as const;
export type Ano = (typeof anos)[number];

const fator: Record<Ano, number> = { 2024: 1, 2025: 1.08, 2026: 1.15 };

/** Limites legais de referência */
export const LIMITES = {
  saudeMin: 15,
  educacaoMin: 25,
  pessoalPrudencial: 51.3,
  pessoalMaximo: 54,
};

export type Funcao =
  | "saude"
  | "educacao"
  | "seguranca"
  | "saneamento"
  | "assistencia"
  | "administracao"
  | "cultura";

export type Municipio = {
  id: string;
  nome: string;
  populacao: number;
  ano: Ano;
  receitaTotal: number;
  despesaTotal: number;
  saldo: number;
  receitaPorHabitante: number;
  percSaude: number;
  percEducacao: number;
  percPessoal: number;
  indiceTransparencia: number;
  despesas: Record<Funcao, number>;
};

export const FUNCOES: { key: Funcao; label: string }[] = [
  { key: "saude", label: "Saúde" },
  { key: "educacao", label: "Educação" },
  { key: "seguranca", label: "Segurança Pública" },
  { key: "saneamento", label: "Saneamento / Urbanismo" },
  { key: "assistencia", label: "Assistência Social" },
  { key: "administracao", label: "Administração" },
  { key: "cultura", label: "Cultura" },
];

const frac = (seed: number, offset: number) => {
  const x = Math.sin(seed * 12.9898 + offset * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * Mock determinístico. Substituir por:
 *   supabase.from("indicadores_municipais").select("*").eq("ano", ano)
 */
function build(base: MunicipioBase, ano: Ano): Municipio {
  const f = fator[ano];
  const perCapita = (2600 + frac(base.seed, 1) * 4200) * f;
  const receitaTotal = Math.round(base.populacao * perCapita);
  const despesaTotal = Math.round(receitaTotal * (0.9 + frac(base.seed, 2) * 0.18));

  const percSaude = +(15 + frac(base.seed, 3) * 9).toFixed(1);
  const percEducacao = +(25 + frac(base.seed, 4) * 8).toFixed(1);
  const percPessoal = +(41 + frac(base.seed, 5) * 15).toFixed(1);

  const despesas: Record<Funcao, number> = {
    saude: Math.round((despesaTotal * percSaude) / 100),
    educacao: Math.round((despesaTotal * percEducacao) / 100),
    seguranca: Math.round(despesaTotal * (0.02 + frac(base.seed, 6) * 0.035)),
    saneamento: Math.round(despesaTotal * (0.04 + frac(base.seed, 7) * 0.06)),
    assistencia: Math.round(despesaTotal * (0.03 + frac(base.seed, 8) * 0.05)),
    administracao: Math.round(despesaTotal * (0.07 + frac(base.seed, 9) * 0.06)),
    cultura: Math.round(despesaTotal * (0.005 + frac(base.seed, 10) * 0.02)),
  };

  const indiceTransparencia = +Math.min(
    99,
    (52 + frac(base.seed, 11) * 32 + Math.log10(base.populacao) * 1.2) * (1 + (f - 1) / 4),
  ).toFixed(1);

  return {
    id: base.id,
    nome: base.nome,
    populacao: base.populacao,
    ano,
    receitaTotal,
    despesaTotal,
    saldo: receitaTotal - despesaTotal,
    receitaPorHabitante: Math.round(receitaTotal / base.populacao),
    percSaude,
    percEducacao,
    percPessoal,
    indiceTransparencia,
    despesas,
  };
}

export function getMunicipios(ano: Ano): Municipio[] {
  return MUNICIPIOS_PE.map((m) => build(m, ano));
}

export function getMunicipio(ano: Ano, id: string): Municipio {
  const base = MUNICIPIOS_PE.find((m) => m.id === id) ?? MUNICIPIOS_PE[0]!;
  return build(base, ano);
}

export const listaMunicipios = MUNICIPIOS_PE.map(({ id, nome }) => ({ id, nome }));

export type SerieMensal = { mes: string; receita: number; despesa: number };

const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

/** Série mensal do município selecionado, em milhões de reais. */
export function getSerieMensal(ano: Ano, id: string): SerieMensal[] {
  const m = getMunicipio(ano, id);
  return meses.map((mes, i) => {
    const sazonalR = 1 + Math.sin((i / 11) * Math.PI) * 0.16 + frac(i + 1, 3) * 0.06;
    const sazonalD = 1 + Math.cos((i / 11) * Math.PI) * 0.1 + frac(i + 2, 5) * 0.08;
    return {
      mes,
      receita: +((m.receitaTotal / 12 / 1e6) * sazonalR).toFixed(1),
      despesa: +((m.despesaTotal / 12 / 1e6) * sazonalD).toFixed(1),
    };
  });
}

export function getRankingTransparencia(ano: Ano, limite = 5) {
  return getMunicipios(ano)
    .slice()
    .sort((a, b) => b.indiceTransparencia - a.indiceTransparencia)
    .slice(0, limite);
}

export const formatBRL = (v: number) => {
  const compacto = Math.abs(v) >= 1_000_000;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: compacto ? "compact" : "standard",
    maximumFractionDigits: compacto ? 1 : 0,
  }).format(v);
};

export const formatNum = (v: number) => new Intl.NumberFormat("pt-BR").format(v);
