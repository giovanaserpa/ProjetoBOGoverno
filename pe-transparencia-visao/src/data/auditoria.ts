/**
 * Base relacional (mock) de auditoria cidadã.
 *
 * Cada função abaixo simula uma tabela filtrada por município e exercício:
 *   receitas(municipio_id, ano, origem, previsto, arrecadado)
 *   despesas_fases(municipio_id, ano, funcao, empenhado, liquidado, pago)
 *   credores(municipio_id, ano, nome, documento, tipo, valor, contratos)
 *   licitacoes(municipio_id, ano, numero, objeto, modalidade, status, valor)
 *   contratos(municipio_id, ano, numero, fornecedor, objeto, valor, vigencia, aditivos[])
 *   obras(municipio_id, ano, nome, bairro, valor, fisico, financeiro, prazos)
 *   servidores(municipio_id, ano, nome, cargo, lotacao, bruto, liquido)
 *   diarias(municipio_id, ano, servidor, destino, motivo, dias, valor)
 */
import { MUNICIPIOS_PE } from "./municipios-pe";
import { FUNCOES, getMunicipio, type Ano, type Funcao } from "./pernambuco";

/* ----------------------------- utilitários ----------------------------- */

const seedOf = (id: string) =>
  MUNICIPIOS_PE.find((m) => m.id === id)?.seed ?? id.length * 37 + 11;

/** PRNG determinístico: mesmo município + ano ⇒ sempre os mesmos dados. */
function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const pick = <T,>(r: () => number, arr: readonly T[]) => arr[Math.floor(r() * arr.length)]!;
const round = (v: number) => Math.round(v);

const base = (id: string, ano: Ano) => {
  const m = getMunicipio(ano, id);
  const r = rng(seedOf(id) * 7 + ano);
  return { m, r };
};

/* ------------------------------- receitas ------------------------------- */

export const ORIGENS_RECEITA = [
  { key: "fpm", label: "FPM / Transferências da União", peso: 0.42 },
  { key: "icms", label: "Cota-parte ICMS / IPVA", peso: 0.22 },
  { key: "iss", label: "ISS", peso: 0.11 },
  { key: "iptu", label: "IPTU", peso: 0.07 },
  { key: "convenios", label: "Convênios e emendas", peso: 0.09 },
  { key: "taxas", label: "Taxas e contribuições", peso: 0.05 },
  { key: "outras", label: "Outras receitas correntes", peso: 0.04 },
] as const;

export type ReceitaOrigem = {
  origem: string;
  previsto: number;
  arrecadado: number;
  execucao: number;
};

export function getReceitas(ano: Ano, id: string): ReceitaOrigem[] {
  const { m, r } = base(id, ano);
  return ORIGENS_RECEITA.map((o) => {
    const previsto = round(m.receitaTotal * o.peso * (0.95 + r() * 0.12));
    const arrecadado = round(previsto * (0.78 + r() * 0.35));
    return {
      origem: o.label,
      previsto,
      arrecadado,
      execucao: +((arrecadado / previsto) * 100).toFixed(1),
    };
  });
}

/* ------------------------- despesas: 3 fases --------------------------- */

export type FaseFuncao = {
  funcao: Funcao;
  label: string;
  empenhado: number;
  liquidado: number;
  pago: number;
};

export function getFasesPorFuncao(ano: Ano, id: string): FaseFuncao[] {
  const { m, r } = base(id, ano);
  return FUNCOES.map(({ key, label }) => {
    const empenhado = m.despesas[key];
    const liquidado = round(empenhado * (0.8 + r() * 0.16));
    const pago = round(liquidado * (0.78 + r() * 0.18));
    return { funcao: key, label, empenhado, liquidado, pago };
  });
}

export function getTotaisFases(ano: Ano, id: string) {
  const fases = getFasesPorFuncao(ano, id);
  const soma = (k: "empenhado" | "liquidado" | "pago") =>
    fases.reduce((acc, f) => acc + f[k], 0);
  const empenhado = soma("empenhado");
  const liquidado = soma("liquidado");
  const pago = soma("pago");
  return {
    empenhado,
    liquidado,
    pago,
    percLiquidado: +((liquidado / empenhado) * 100).toFixed(1),
    percPago: +((pago / empenhado) * 100).toFixed(1),
    restosAPagar: liquidado - pago,
  };
}

/* -------------------------------- credores ------------------------------ */

const EMPRESAS = [
  "Construtora Capibaribe LTDA",
  "Nordeste Serviços de Engenharia S/A",
  "Agreste Distribuidora de Alimentos",
  "MedFarma Distribuidora Hospitalar",
  "Sertão Transportes Escolares EIRELI",
  "TecInfo Soluções em TI LTDA",
  "Limpurb Serviços Urbanos S/A",
  "Papelaria Central Suprimentos",
  "Vale do São Francisco Combustíveis",
  "Recife Locação de Veículos LTDA",
  "Zona da Mata Construções e Reformas",
  "Saúde Total Serviços Médicos LTDA",
  "Alimenta Bem Merenda Escolar",
  "Guararapes Vigilância Patrimonial",
  "Obras & Cia Pavimentação LTDA",
];

const PESSOAS = [
  "José Ferreira da Silva",
  "Maria das Graças Barbosa",
  "Antônio Carlos de Melo",
  "Luciana Cavalcanti Lima",
  "Severino Ramos do Nascimento",
  "Ana Paula Siqueira",
];

const cnpj = (r: () => number) => {
  const n = (len: number) =>
    Array.from({ length: len }, () => Math.floor(r() * 10)).join("");
  return `${n(2)}.${n(3)}.${n(3)}/0001-${n(2)}`;
};
const cpfMascarado = (r: () => number) =>
  `***.${Math.floor(r() * 900 + 100)}.${Math.floor(r() * 900 + 100)}-**`;

export type Credor = {
  nome: string;
  documento: string;
  tipo: "PJ" | "PF";
  valor: number;
  contratos: number;
};

export function getCredores(ano: Ano, id: string): Credor[] {
  const { m, r } = base(id, ano);
  const pool = [
    ...EMPRESAS.map((nome) => ({ nome, tipo: "PJ" as const })),
    ...PESSOAS.map((nome) => ({ nome, tipo: "PF" as const })),
  ];
  return pool
    .map((p) => ({
      nome: p.nome,
      tipo: p.tipo,
      documento: p.tipo === "PJ" ? cnpj(r) : cpfMascarado(r),
      valor: round(m.despesaTotal * (p.tipo === "PJ" ? 0.004 + r() * 0.05 : 0.0004 + r() * 0.004)),
      contratos: 1 + Math.floor(r() * 5),
    }))
    .sort((a, b) => b.valor - a.valor);
}

/* ------------------------------ licitações ------------------------------ */

export const STATUS_LICITACAO = [
  "Em andamento",
  "Concluída",
  "Suspensa",
  "Deserta",
  "Homologada",
] as const;
export type StatusLicitacao = (typeof STATUS_LICITACAO)[number];

const MODALIDADES = [
  "Pregão Eletrônico",
  "Concorrência",
  "Dispensa de Licitação",
  "Inexigibilidade",
  "Tomada de Preços",
] as const;

const OBJETOS = [
  "Aquisição de medicamentos para a rede básica de saúde",
  "Contratação de serviços de coleta de resíduos sólidos",
  "Fornecimento de merenda escolar para a rede municipal",
  "Pavimentação asfáltica de vias urbanas",
  "Locação de veículos para a Secretaria de Saúde",
  "Reforma de unidade básica de saúde",
  "Aquisição de material de expediente",
  "Serviços de vigilância patrimonial armada",
  "Contratação de sistema de gestão pública integrada",
  "Transporte escolar da zona rural",
  "Construção de creche municipal",
  "Aquisição de combustíveis para a frota municipal",
];

export type Licitacao = {
  numero: string;
  objeto: string;
  modalidade: string;
  status: StatusLicitacao;
  valorEstimado: number;
  abertura: string;
  edital: string;
};

const dataBR = (r: () => number, ano: number) => {
  const mes = 1 + Math.floor(r() * 12);
  const dia = 1 + Math.floor(r() * 28);
  return `${String(dia).padStart(2, "0")}/${String(mes).padStart(2, "0")}/${ano}`;
};

export function getLicitacoes(ano: Ano, id: string): Licitacao[] {
  const { m, r } = base(id, ano);
  return Array.from({ length: 14 }, (_, i) => ({
    numero: `PL ${String(i + 1).padStart(3, "0")}/${ano}`,
    objeto: pick(r, OBJETOS),
    modalidade: pick(r, MODALIDADES),
    status: pick(r, STATUS_LICITACAO),
    valorEstimado: round(m.despesaTotal * (0.002 + r() * 0.02)),
    abertura: dataBR(r, ano),
    edital: `#edital-${id}-${i + 1}`,
  }));
}

/* ------------------------- contratos e convênios ------------------------ */

export type Aditivo = { tipo: "Valor" | "Prazo"; descricao: string; data: string };

export type Contrato = {
  numero: string;
  fornecedor: string;
  objeto: string;
  valorGlobal: number;
  inicio: string;
  fim: string;
  situacao: "Vigente" | "Encerrado" | "Rescindido";
  aditivos: Aditivo[];
};

export function getContratos(ano: Ano, id: string): Contrato[] {
  const { m, r } = base(id, ano);
  return Array.from({ length: 10 }, (_, i) => {
    const valorGlobal = round(m.despesaTotal * (0.003 + r() * 0.03));
    const qtdAditivos = Math.floor(r() * 3);
    const aditivos: Aditivo[] = Array.from({ length: qtdAditivos }, () => {
      const tipo = r() > 0.5 ? "Valor" : "Prazo";
      return {
        tipo,
        descricao:
          tipo === "Valor"
            ? `Acréscimo de ${(5 + r() * 20).toFixed(1)}% ao valor global`
            : `Prorrogação de ${pick(r, [3, 6, 12])} meses de vigência`,
        data: dataBR(r, ano),
      } as Aditivo;
    });
    return {
      numero: `CT ${String(i + 1).padStart(3, "0")}/${ano}`,
      fornecedor: pick(r, EMPRESAS),
      objeto: pick(r, OBJETOS),
      valorGlobal,
      inicio: `01/${String(1 + Math.floor(r() * 6)).padStart(2, "0")}/${ano}`,
      fim: `31/12/${ano + (r() > 0.6 ? 1 : 0)}`,
      situacao: pick(r, ["Vigente", "Vigente", "Encerrado", "Rescindido"] as const),
      aditivos,
    };
  });
}

/* ------------------------------- obras ---------------------------------- */

const OBRAS_NOMES = [
  "Construção da Creche Municipal",
  "Reforma do Hospital Municipal",
  "Pavimentação do Bairro Novo",
  "Ampliação da Escola Municipal Padre Cícero",
  "Requalificação da Praça Central",
  "Construção de Sistema de Esgotamento Sanitário",
  "Reforma da Unidade Básica de Saúde",
  "Construção do Mercado Público",
];

const BAIRROS = ["Centro", "Alto do Cruzeiro", "São José", "Boa Vista", "Nova Esperança", "Zona Rural"];

export type Obra = {
  nome: string;
  bairro: string;
  empresa: string;
  valorContratado: number;
  valorPago: number;
  fisico: number;
  financeiro: number;
  prazoOriginal: string;
  prazoAtualizado: string;
  situacao: "Em execução" | "Concluída" | "Paralisada";
};

export function getObras(ano: Ano, id: string): Obra[] {
  const { m, r } = base(id, ano);
  return Array.from({ length: 6 }, (_, i) => {
    const valorContratado = round(m.despesaTotal * (0.004 + r() * 0.025));
    const fisico = +(r() * 100).toFixed(0);
    const financeiro = Math.min(100, +(fisico * (0.75 + r() * 0.4)).toFixed(0));
    const atraso = r() > 0.55;
    return {
      nome: OBRAS_NOMES[(i + Math.floor(r() * 3)) % OBRAS_NOMES.length]!,
      bairro: pick(r, BAIRROS),
      empresa: pick(r, EMPRESAS),
      valorContratado,
      valorPago: round((valorContratado * financeiro) / 100),
      fisico,
      financeiro,
      prazoOriginal: `${String(1 + Math.floor(r() * 12)).padStart(2, "0")}/${ano}`,
      prazoAtualizado: `${String(1 + Math.floor(r() * 12)).padStart(2, "0")}/${ano + (atraso ? 1 : 0)}`,
      situacao: fisico >= 100 ? "Concluída" : r() > 0.82 ? "Paralisada" : "Em execução",
    };
  });
}

export function getIndiceConclusaoObras(ano: Ano, id: string) {
  const obras = getObras(ano, id);
  return +(obras.reduce((a, o) => a + o.fisico, 0) / obras.length).toFixed(1);
}

/* ---------------------------- folha de pagamento ------------------------ */

const NOMES = [
  "Ana Beatriz Souza", "Carlos Eduardo Lins", "Fernanda Alves Correia", "João Pedro Bezerra",
  "Marcos Antônio Pereira", "Patrícia Gomes Vasconcelos", "Rafael Duarte Monteiro",
  "Juliana Ferreira Rocha", "Bruno Henrique Amorim", "Camila Torres Sampaio",
  "Eduardo Nunes Farias", "Gabriela Menezes Pinto", "Hugo Leal Barros", "Isabel Cristina Aragão",
  "Leonardo Cunha Tavares", "Mariana Xavier Neves", "Otávio Lira Campelo", "Renata Sales Coutinho",
  "Sérgio Bandeira Filho", "Tatiana Melo Guedes", "Vinícius Andrade Costa", "Yasmin Falcão Ribeiro",
];

const CARGOS = [
  "Professor(a) Nível II", "Agente Comunitário de Saúde", "Auxiliar Administrativo",
  "Enfermeiro(a)", "Médico(a) Clínico Geral", "Fiscal de Tributos", "Motorista",
  "Assistente Social", "Engenheiro(a) Civil", "Procurador(a) Municipal", "Secretário(a) Municipal",
];

export const LOTACOES = [
  "Secretaria de Saúde",
  "Secretaria de Educação",
  "Secretaria de Administração",
  "Secretaria de Infraestrutura",
  "Secretaria de Assistência Social",
  "Gabinete do Prefeito",
] as const;

export type Servidor = {
  nome: string;
  cargo: string;
  lotacao: string;
  vinculo: "Efetivo" | "Comissionado" | "Contrato Temporário";
  bruto: number;
  liquido: number;
};

export function getServidores(ano: Ano, id: string): Servidor[] {
  const { r } = base(id, ano);
  const f = ano === 2024 ? 1 : ano === 2025 ? 1.06 : 1.12;
  return NOMES.map((nome) => {
    const bruto = round((2100 + r() * 14000) * f);
    return {
      nome,
      cargo: pick(r, CARGOS),
      lotacao: pick(r, LOTACOES),
      vinculo: pick(r, ["Efetivo", "Efetivo", "Comissionado", "Contrato Temporário"] as const),
      bruto,
      liquido: round(bruto * (0.7 + r() * 0.15)),
    };
  }).sort((a, b) => b.bruto - a.bruto);
}

export function getTotalPessoal(ano: Ano, id: string) {
  const m = getMunicipio(ano, id);
  return round((m.despesaTotal * m.percPessoal) / 100);
}

/* --------------------------- diárias e passagens ------------------------ */

const DESTINOS = ["Recife/PE", "Brasília/DF", "Petrolina/PE", "Caruaru/PE", "São Paulo/SP", "Salvador/BA"];
const MOTIVOS = [
  "Reunião no Ministério da Saúde",
  "Capacitação em licitações e contratos",
  "Audiência no TCE-PE",
  "Participação em congresso de gestão municipal",
  "Entrega de documentos em órgão estadual",
  "Tratativa de convênio federal",
];

export type Diaria = {
  servidor: string;
  cargo: string;
  destino: string;
  motivo: string;
  dias: number;
  valorDiarias: number;
  valorPassagens: number;
  data: string;
};

export function getDiarias(ano: Ano, id: string): Diaria[] {
  const { r } = base(id, ano);
  return Array.from({ length: 16 }, () => {
    const dias = 1 + Math.floor(r() * 5);
    return {
      servidor: pick(r, NOMES),
      cargo: pick(r, CARGOS),
      destino: pick(r, DESTINOS),
      motivo: pick(r, MOTIVOS),
      dias,
      valorDiarias: round(dias * (180 + r() * 520)),
      valorPassagens: round(r() > 0.4 ? 400 + r() * 2200 : 0),
      data: dataBR(r, ano),
    };
  }).sort((a, b) => b.valorDiarias + b.valorPassagens - (a.valorDiarias + a.valorPassagens));
}

export function getDiariasPorMes(ano: Ano, id: string) {
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const diarias = getDiarias(ano, id);
  return meses.map((mes, i) => {
    const doMes = diarias.filter((d) => Number(d.data.slice(3, 5)) === i + 1);
    return {
      mes,
      diarias: doMes.reduce((a, d) => a + d.valorDiarias, 0),
      passagens: doMes.reduce((a, d) => a + d.valorPassagens, 0),
    };
  });
}

/* ------------------------- resumo p/ comparador ------------------------- */

export function getResumoAuditoria(ano: Ano, id: string) {
  const m = getMunicipio(ano, id);
  const fases = getTotaisFases(ano, id);
  const contratos = getContratos(ano, id);
  return {
    totalPessoal: getTotalPessoal(ano, id),
    totalContratos: contratos.reduce((a, c) => a + c.valorGlobal, 0),
    liquidadoPorHabitante: round(fases.liquidado / m.populacao),
    conclusaoObras: getIndiceConclusaoObras(ano, id),
    percPago: fases.percPago,
    restosAPagar: fases.restosAPagar,
  };
}
