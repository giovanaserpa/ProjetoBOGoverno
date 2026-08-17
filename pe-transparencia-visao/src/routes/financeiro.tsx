import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDown, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MunicipioSelect } from "@/components/dashboard/MunicipioSelect";
import { Abas } from "@/components/auditoria/Abas";
import { GraficoPizza } from "@/components/charts/GraficoPizza";
import {
  Badge,
  Barra,
  CampoBusca,
  Secao,
  TabelaDados,
  type Coluna,
} from "@/components/auditoria/ui";
import { formatBRL, getMunicipio, type Ano } from "@/data/pernambuco";
import {
  getCredores,
  getFasesPorFuncao,
  getReceitas,
  getTotaisFases,
  type Credor,
  type FaseFuncao,
  type ReceitaOrigem,
} from "@/data/auditoria";

export const Route = createFileRoute("/financeiro")({
  head: () => ({
    meta: [
      { title: "Execução Financeira e Orçamentária · Transparência PE" },
      {
        name: "description",
        content:
          "Receita prevista x arrecadada, gráficos de pizza por origem e função, fases da despesa e credores dos municípios de Pernambuco.",
      },
      { property: "og:title", content: "Execução Financeira e Orçamentária · Transparência PE" },
      {
        property: "og:description",
        content: "Acompanhe a arrecadação, a execução da despesa e os credores do município.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Financeiro,
});

const mi = (v: number) => +(v / 1e6).toFixed(2);

function Financeiro() {
  const [ano, setAno] = useState<Ano>(2026);
  const [municipioId, setMunicipioId] = useState("recife");
  const [atualizando, setAtualizando] = useState(false);
  const [buscaCredor, setBuscaCredor] = useState("");

  const m = getMunicipio(ano, municipioId);
  const receitas = getReceitas(ano, municipioId);
  const fases = getFasesPorFuncao(ano, municipioId);
  const totais = getTotaisFases(ano, municipioId);
  const credores = getCredores(ano, municipioId);

  const previsto = receitas.reduce((a, r) => a + r.previsto, 0);
  const arrecadado = receitas.reduce((a, r) => a + r.arrecadado, 0);

  const credoresFiltrados = useMemo(() => {
    const q = buscaCredor.trim().toLowerCase();
    if (!q) return credores;
    return credores.filter(
      (c) => c.nome.toLowerCase().includes(q) || c.documento.toLowerCase().includes(q),
    );
  }, [credores, buscaCredor]);

  const dadosReceita = receitas.map((r) => ({
    origem: r.origem.split(" ")[0],
    Previsto: mi(r.previsto),
    Arrecadado: mi(r.arrecadado),
  }));

  const pizzaReceitas = receitas.map((r) => ({ nome: r.origem, valor: r.arrecadado }));
  const pizzaDespesas = fases.map((f) => ({ nome: f.label, valor: f.empenhado }));

  const etapas = [
    { rotulo: "Empenhado", valor: totais.empenhado, perc: 100, tom: "azul" as const },
    { rotulo: "Liquidado", valor: totais.liquidado, perc: totais.percLiquidado, tom: "ouro" as const },
    { rotulo: "Pago", valor: totais.pago, perc: totais.percPago, tom: "verde" as const },
  ];

  const colsReceita: Coluna<ReceitaOrigem>[] = [
    {
      label: "Origem do recurso",
      resumo: true,
      celula: (r) => <span className="font-medium text-foreground">{r.origem}</span>,
    },
    {
      label: "Arrecadado",
      resumo: true,
      celula: (r) => <span className="font-semibold text-pe-green">{formatBRL(r.arrecadado)}</span>,
    },
    { label: "Previsto", celula: (r) => formatBRL(r.previsto) },
    {
      label: "Execução",
      celula: (r) => (
        <Badge
          texto={`${r.execucao}%`}
          tom={r.execucao >= 100 ? "verde" : r.execucao >= 85 ? "ouro" : "vermelho"}
        />
      ),
    },
  ];

  const colsFases: Coluna<FaseFuncao>[] = [
    {
      label: "Função",
      resumo: true,
      celula: (f) => <span className="font-medium text-foreground">{f.label}</span>,
    },
    {
      label: "Pago",
      resumo: true,
      celula: (f) => <span className="font-semibold text-pe-green">{formatBRL(f.pago)}</span>,
    },
    { label: "Empenhado", celula: (f) => formatBRL(f.empenhado) },
    { label: "Liquidado", celula: (f) => formatBRL(f.liquidado) },
    {
      label: "% Pago",
      className: "w-40",
      celula: (f) => {
        const perc = +((f.pago / f.empenhado) * 100).toFixed(1);
        return (
          <div className="flex items-center gap-2">
            <Barra valor={perc} tom="verde" />
            <span className="w-12 text-xs text-muted-foreground">{perc}%</span>
          </div>
        );
      },
    },
  ];

  const colsCredores: Coluna<Credor>[] = [
    {
      label: "Credor",
      resumo: true,
      celula: (c) => <span className="font-medium text-foreground">{c.nome}</span>,
    },
    {
      label: "Total recebido",
      resumo: true,
      celula: (c) => <span className="font-semibold text-pe-red">{formatBRL(c.valor)}</span>,
    },
    {
      label: "CNPJ / CPF",
      celula: (c) => <span className="font-mono text-xs">{c.documento}</span>,
    },
    { label: "Tipo", celula: (c) => <Badge texto={c.tipo} tom={c.tipo === "PJ" ? "azul" : "ouro"} /> },
    { label: "Contratos", celula: (c) => c.contratos },
  ];

  const secaoReceitas = (
    <div className="grid min-w-0 gap-6">
      <Secao
        titulo="Receitas — previsto x arrecadado"
        descricao={`Previsto ${formatBRL(previsto)} · Arrecadado ${formatBRL(arrecadado)} (${((arrecadado / previsto) * 100).toFixed(1)}% da previsão)`}
      >
        <div className="h-64 w-full sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosReceita} margin={{ top: 8, right: 8, left: -6, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="origem" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} interval={0} />
              <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} width={52} tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`)} />
              <Tooltip
                cursor={{ fill: "var(--secondary)" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                }}
                formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")} mi`}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Previsto" fill="var(--pe-navy)" radius={[6, 6, 0, 0]} maxBarSize={38} />
              <Bar dataKey="Arrecadado" fill="var(--pe-green)" radius={[6, 6, 0, 0]} maxBarSize={38} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-5">
          <TabelaDados itens={receitas} colunas={colsReceita} chave={(r) => r.origem} />
        </div>
      </Secao>

      <Secao
        titulo="Origem das receitas — distribuição proporcional"
        descricao="De onde vem o dinheiro arrecadado no exercício"
      >
        <GraficoPizza dados={pizzaReceitas} altura={340} />
      </Secao>
    </div>
  );

  const secaoDespesas = (
    <div className="grid min-w-0 gap-6">
      <Secao
        titulo="Despesas — Empenhado ➔ Liquidado ➔ Pago"
        descricao={`Restos a pagar processados: ${formatBRL(totais.restosAPagar)}`}
      >
        <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {etapas.map((e, i) => (
            <div key={e.rotulo} className="contents">
              <div className="rounded-lg border border-border bg-secondary/50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {e.rotulo}
                </p>
                <p className="mt-1 text-xl font-semibold text-foreground sm:text-2xl">
                  {formatBRL(e.valor)}
                </p>
                <p className="mb-2 mt-1 text-xs text-muted-foreground">
                  {e.perc}% do total empenhado
                </p>
                <Barra valor={e.perc} tom={e.tom} />
              </div>
              {i < etapas.length - 1 ? (
                <div className="flex items-center justify-center">
                  <ArrowDown className="size-5 text-muted-foreground md:hidden" />
                  <ArrowRight className="hidden size-5 text-muted-foreground md:block" />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-5">
          <TabelaDados itens={fases} colunas={colsFases} chave={(f) => f.funcao} />
        </div>
      </Secao>

      <Secao
        titulo="Despesas por função — divisão do orçamento"
        descricao="Participação de cada secretaria/função no total empenhado"
      >
        <GraficoPizza dados={pizzaDespesas} altura={340} />
      </Secao>
    </div>
  );

  const secaoCredores = (
    <Secao
      titulo="Credores — para onde foi o dinheiro"
      descricao="Maiores recebedores no exercício. CPF de pessoas físicas exibido parcialmente."
      acao={
        <CampoBusca
          value={buscaCredor}
          onChange={setBuscaCredor}
          placeholder="Buscar por nome ou CNPJ/CPF..."
        />
      }
    >
      <TabelaDados
        itens={credoresFiltrados}
        colunas={colsCredores}
        chave={(c) => c.nome}
        vazio="Nenhum credor encontrado."
      />
    </Secao>
  );

  return (
    <AppShell
      ano={ano}
      onAnoChange={setAno}
      atualizando={atualizando}
      subtitulo={`Execução financeira · ${m.nome} · ${ano}`}
      onRefresh={() => {
        setAtualizando(true);
        setTimeout(() => setAtualizando(false), 800);
      }}
    >
      <div className="mb-5 w-full sm:max-w-sm">
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Município</label>
        <MunicipioSelect value={municipioId} onChange={setMunicipioId} />
      </div>

      <Abas
        itens={[
          { id: "receitas", label: "Receitas", conteudo: secaoReceitas },
          { id: "despesas", label: "Despesas", conteudo: secaoDespesas },
          { id: "credores", label: "Credores", conteudo: secaoCredores },
        ]}
      />
    </AppShell>
  );
}
