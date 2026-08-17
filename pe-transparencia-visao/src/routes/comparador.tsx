import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
import { AppShell } from "@/components/layout/AppShell";
import { MunicipioSelect } from "@/components/dashboard/MunicipioSelect";
import {
  FUNCOES,
  LIMITES,
  formatBRL,
  formatNum,
  getMunicipio,
  type Ano,
  type Municipio,
} from "@/data/pernambuco";
import { getResumoAuditoria } from "@/data/auditoria";

export const Route = createFileRoute("/comparador")({
  head: () => ({
    meta: [
      { title: "Comparador de Municípios · Transparência PE" },
      {
        name: "description",
        content:
          "Compare lado a lado saúde, educação, segurança, gasto com pessoal e transparência entre os 184 municípios de Pernambuco.",
      },
      { property: "og:title", content: "Comparador de Municípios · Transparência PE" },
      {
        property: "og:description",
        content: "Análise lado a lado dos indicadores fiscais dos municípios pernambucanos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Comparador,
});

function Linha({ label, valor, destaque }: { label: string; valor: string; destaque?: string }) {
  return (
    <div className="rounded-lg bg-secondary px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-lg font-semibold ${destaque ?? "text-foreground"}`}>{valor}</p>
    </div>
  );
}

function Painel({
  municipio,
  onChange,
  lado,
}: {
  municipio: Municipio;
  onChange: (id: string) => void;
  lado: "A" | "B";
}) {
  const pessoalOk = municipio.percPessoal < LIMITES.pessoalPrudencial;
  const resumo = getResumoAuditoria(municipio.ano, municipio.id);
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5">
      <div className="flex items-center gap-2">
        <span
          className={`flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
            lado === "A" ? "bg-pe-navy text-primary-foreground" : "bg-pe-gold text-pe-navy"
          }`}
        >
          {lado}
        </span>
        <MunicipioSelect value={municipio.id} onChange={onChange} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3">
        <Linha label="População" valor={formatNum(municipio.populacao)} />
        <Linha
          label="Receita por habitante"
          valor={formatBRL(municipio.receitaPorHabitante)}
          destaque="text-pe-green"
        />
        <Linha
          label="Receita total"
          valor={formatBRL(municipio.receitaTotal)}
          destaque="text-pe-green"
        />
        <Linha
          label="Despesa total"
          valor={formatBRL(municipio.despesaTotal)}
          destaque="text-pe-red"
        />
        <Linha
          label="Saúde (mín. 15%)"
          valor={`${municipio.percSaude}%`}
          destaque={municipio.percSaude >= LIMITES.saudeMin ? "text-pe-green" : "text-pe-red"}
        />
        <Linha
          label="Educação (mín. 25%)"
          valor={`${municipio.percEducacao}%`}
          destaque={municipio.percEducacao >= LIMITES.educacaoMin ? "text-pe-green" : "text-pe-red"}
        />
        <Linha
          label="Pessoal / RCL (LRF)"
          valor={`${municipio.percPessoal}%`}
          destaque={pessoalOk ? "text-pe-green" : "text-pe-red"}
        />
        <Linha
          label="Índice de Transparência"
          valor={`${municipio.indiceTransparencia.toFixed(1)} / 100`}
          destaque="text-pe-navy"
        />
        <Linha
          label="Total gasto com pessoal"
          valor={formatBRL(resumo.totalPessoal)}
          destaque="text-pe-red"
        />
        <Linha
          label="Total pago em contratos"
          valor={formatBRL(resumo.totalContratos)}
          destaque="text-pe-navy"
        />
        <Linha
          label="Despesa liquidada / habitante"
          valor={formatBRL(resumo.liquidadoPorHabitante)}
        />
        <Linha
          label="Índice de conclusão de obras"
          valor={`${resumo.conclusaoObras}%`}
          destaque={resumo.conclusaoObras >= 60 ? "text-pe-green" : "text-pe-red"}
        />
      </div>
    </div>
  );
}

/** Tick do eixo X que quebra rótulos longos em até duas linhas. */
function TickQuebrado({ x, y, payload }: any) {
  const texto: string = String(payload?.value ?? "");
  const palavras = texto.split(/\s+/);
  const linhas: string[] = [];
  let atual = "";
  for (const p of palavras) {
    if ((atual + " " + p).trim().length > 12 && atual) {
      linhas.push(atual);
      atual = p;
    } else {
      atual = (atual + " " + p).trim();
    }
  }
  if (atual) linhas.push(atual);

  return (
    <g transform={`translate(${x},${y + 12})`}>
      {linhas.slice(0, 2).map((linha, i) => (
        <text
          key={linha + i}
          x={0}
          y={i * 13}
          textAnchor="middle"
          fill="var(--muted-foreground)"
          fontSize={11}
        >
          {linha}
        </text>
      ))}
    </g>
  );
}

function Grafico({
  titulo,
  legenda,
  dados,
  keyA,
  keyB,
  formatador,
}: {
  titulo: string;
  legenda: string;
  dados: Record<string, string | number>[];
  keyA: string;
  keyB: string;
  formatador: (v: number) => string;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-base font-semibold text-foreground">{titulo}</h2>
        <p className="text-xs text-muted-foreground">{legenda}</p>
      </div>
      <div className="h-72 w-full sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dados} margin={{ top: 8, right: 8, left: -12, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="indicador"
              stroke="var(--muted-foreground)"
              tickLine={false}
              interval={0}
              height={46}
              tick={<TickQuebrado />}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: "var(--secondary)" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--foreground)",
              }}
              formatter={(v: number) => formatador(v)}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey={keyA} fill="var(--pe-navy)" radius={[6, 6, 0, 0]} maxBarSize={48} />
            <Bar dataKey={keyB} fill="var(--pe-gold)" radius={[6, 6, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function Comparador() {
  const [ano, setAno] = useState<Ano>(2026);
  const [atualizando, setAtualizando] = useState(false);
  const [idA, setIdA] = useState("recife");
  const [idB, setIdB] = useState("caruaru");

  const a = getMunicipio(ano, idA);
  const b = getMunicipio(ano, idB);
  const keyA = `${a.nome} (A)`;
  const keyB = `${b.nome} (B)`;
  const ra = getResumoAuditoria(ano, idA);
  const rb = getResumoAuditoria(ano, idB);

  const gastos = FUNCOES.map(({ key, label }) => ({
    indicador: label,
    [keyA]: +(a.despesas[key] / 1e6).toFixed(1),
    [keyB]: +(b.despesas[key] / 1e6).toFixed(1),
  }));

  const indices = [
    { indicador: "Saúde %", [keyA]: a.percSaude, [keyB]: b.percSaude },
    { indicador: "Educação %", [keyA]: a.percEducacao, [keyB]: b.percEducacao },
    { indicador: "Pessoal % RCL", [keyA]: a.percPessoal, [keyB]: b.percPessoal },
    {
      indicador: "Transparência",
      [keyA]: +a.indiceTransparencia.toFixed(1),
      [keyB]: +b.indiceTransparencia.toFixed(1),
    },
  ];

  const auditoria = [
    {
      indicador: "Gasto com pessoal (R$ mi)",
      [keyA]: +(ra.totalPessoal / 1e6).toFixed(1),
      [keyB]: +(rb.totalPessoal / 1e6).toFixed(1),
    },
    {
      indicador: "Contratos (R$ mi)",
      [keyA]: +(ra.totalContratos / 1e6).toFixed(1),
      [keyB]: +(rb.totalContratos / 1e6).toFixed(1),
    },
    {
      indicador: "Restos a pagar (R$ mi)",
      [keyA]: +(ra.restosAPagar / 1e6).toFixed(1),
      [keyB]: +(rb.restosAPagar / 1e6).toFixed(1),
    },
  ];

  const eficiencia = [
    {
      indicador: "Liquidado por habitante (R$)",
      [keyA]: ra.liquidadoPorHabitante,
      [keyB]: rb.liquidadoPorHabitante,
    },
    { indicador: "Conclusão de obras (%)", [keyA]: ra.conclusaoObras, [keyB]: rb.conclusaoObras },
    { indicador: "Despesa paga (% empenhado)", [keyA]: ra.percPago, [keyB]: rb.percPago },
  ];

  return (
    <AppShell
      ano={ano}
      onAnoChange={setAno}
      atualizando={atualizando}
      subtitulo={`${a.nome} x ${b.nome} · exercício ${ano}`}
      onRefresh={() => {
        setAtualizando(true);
        setTimeout(() => setAtualizando(false), 900);
      }}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Painel municipio={a} onChange={setIdA} lado="A" />
        <Painel municipio={b} onChange={setIdB} lado="B" />
      </div>

      <div className="mt-6 grid gap-6">
        <Grafico
          titulo={`Despesas por função — ${a.nome} x ${b.nome}`}
          legenda="Valores em milhões de reais"
          dados={gastos}
          keyA={keyA}
          keyB={keyB}
          formatador={(v) => `R$ ${v.toLocaleString("pt-BR")} mi`}
        />
        <Grafico
          titulo="Índices e limites legais"
          legenda="Percentuais e nota de transparência (0 a 100)"
          dados={indices}
          keyA={keyA}
          keyB={keyB}
          formatador={(v) => `${v}`}
        />
        <Grafico
          titulo="Pessoal, contratos e restos a pagar"
          legenda="Valores em milhões de reais"
          dados={auditoria}
          keyA={keyA}
          keyB={keyB}
          formatador={(v) => `R$ ${v.toLocaleString("pt-BR")} mi`}
        />
        <Grafico
          titulo="Eficiência da execução e das obras"
          legenda="Despesa liquidada por habitante, conclusão física e pagamento"
          dados={eficiencia}
          keyA={keyA}
          keyB={keyB}
          formatador={(v) => v.toLocaleString("pt-BR")}
        />
      </div>
    </AppShell>
  );
}
