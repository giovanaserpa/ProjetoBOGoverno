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
import { AppShell } from "@/components/layout/AppShell";
import { MunicipioSelect } from "@/components/dashboard/MunicipioSelect";
import { Abas } from "@/components/auditoria/Abas";
import { GraficoPizza } from "@/components/charts/GraficoPizza";
import { Badge, CampoBusca, Secao, TabelaDados, type Coluna } from "@/components/auditoria/ui";
import { formatBRL, getMunicipio, LIMITES, type Ano } from "@/data/pernambuco";
import {
  getDiarias,
  getDiariasPorMes,
  getServidores,
  getTotalPessoal,
  LOTACOES,
  type Diaria,
  type Servidor,
} from "@/data/auditoria";

export const Route = createFileRoute("/pessoal")({
  head: () => ({
    meta: [
      { title: "Gestão de Pessoal e Gastos Administrativos · Transparência PE" },
      {
        name: "description",
        content:
          "Folha de pagamento, remuneração de servidores, diárias e passagens dos municípios de Pernambuco.",
      },
      { property: "og:title", content: "Gestão de Pessoal · Transparência PE" },
      {
        property: "og:description",
        content: "Consulte servidores, cargos, lotação, remuneração e gastos com diárias e passagens.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pessoal,
});

function Pessoal() {
  const [ano, setAno] = useState<Ano>(2026);
  const [municipioId, setMunicipioId] = useState("recife");
  const [atualizando, setAtualizando] = useState(false);
  const [busca, setBusca] = useState("");
  const [lotacao, setLotacao] = useState("Todas");

  const m = getMunicipio(ano, municipioId);
  const servidores = getServidores(ano, municipioId);
  const diarias = getDiarias(ano, municipioId);
  const serieDiarias = getDiariasPorMes(ano, municipioId);
  const totalPessoal = getTotalPessoal(ano, municipioId);
  const totalDiarias = diarias.reduce((a, d) => a + d.valorDiarias + d.valorPassagens, 0);

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return servidores.filter(
      (s) =>
        (lotacao === "Todas" || s.lotacao === lotacao) &&
        (!q || s.nome.toLowerCase().includes(q) || s.cargo.toLowerCase().includes(q)),
    );
  }, [servidores, busca, lotacao]);

  const pessoalOk = m.percPessoal < LIMITES.pessoalPrudencial;

  const pizzaLotacoes = useMemo(() => {
    const mapa = new Map<string, number>();
    for (const s of servidores) mapa.set(s.lotacao, (mapa.get(s.lotacao) ?? 0) + s.bruto);
    return [...mapa.entries()].map(([nome, valor]) => ({ nome, valor }));
  }, [servidores]);

  const colsServidores: Coluna<Servidor>[] = [
    {
      label: "Servidor",
      resumo: true,
      celula: (s) => <span className="font-medium text-foreground">{s.nome}</span>,
    },
    {
      label: "Bruto",
      resumo: true,
      celula: (s) => <span className="font-semibold text-foreground">{formatBRL(s.bruto)}</span>,
    },
    { label: "Cargo", celula: (s) => s.cargo },
    { label: "Lotação", celula: (s) => s.lotacao },
    {
      label: "Vínculo",
      celula: (s) => <Badge texto={s.vinculo} tom={s.vinculo === "Efetivo" ? "azul" : "ouro"} />,
    },
    {
      label: "Líquido",
      celula: (s) => <span className="text-pe-green">{formatBRL(s.liquido)}</span>,
    },
  ];

  const colsDiarias: Coluna<Diaria>[] = [
    {
      label: "Servidor",
      resumo: true,
      celula: (d) => <span className="font-medium text-foreground">{d.servidor}</span>,
    },
    {
      label: "Diárias",
      resumo: true,
      celula: (d) => <span className="font-semibold text-foreground">{formatBRL(d.valorDiarias)}</span>,
    },
    { label: "Cargo", celula: (d) => d.cargo },
    { label: "Destino", celula: (d) => d.destino },
    { label: "Motivo", celula: (d) => d.motivo },
    { label: "Data", celula: (d) => d.data },
    { label: "Dias", celula: (d) => d.dias },
    { label: "Passagens", celula: (d) => (d.valorPassagens ? formatBRL(d.valorPassagens) : "—") },
  ];

  const secaoFolha = (
    <div className="grid min-w-0 gap-6">
      <Secao
        titulo="Folha de pagamento — relação de servidores"
        descricao="Amostra da relação nominal com cargo, lotação e remuneração"
        acao={<CampoBusca value={busca} onChange={setBusca} placeholder="Buscar servidor ou cargo..." />}
      >
        <div className="mb-4 flex flex-wrap gap-2">
          {["Todas", ...LOTACOES].map((l) => (
            <button
              key={l}
              onClick={() => setLotacao(l)}
              className={`rounded-full px-3 py-2 text-xs font-medium transition-colors ${
                lotacao === l
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <TabelaDados
          itens={filtrados}
          colunas={colsServidores}
          chave={(s) => s.nome}
          vazio="Nenhum servidor encontrado."
        />
      </Secao>

      <Secao
        titulo="Folha por lotação — distribuição proporcional"
        descricao="Participação de cada secretaria na remuneração bruta"
      >
        <GraficoPizza dados={pizzaLotacoes} altura={330} />
      </Secao>
    </div>
  );

  const secaoDiarias = (
    <Secao titulo="Diárias e passagens" descricao="Deslocamentos de agentes públicos a serviço">
      <div className="h-60 w-full sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={serieDiarias} margin={{ top: 8, right: 8, left: -6, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
            <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} width={52} tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`)} />
            <Tooltip
              cursor={{ fill: "var(--secondary)" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "var(--card)",
              }}
              formatter={(v: number) => formatBRL(v)}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="diarias" name="Diárias" stackId="a" fill="var(--pe-navy)" maxBarSize={40} />
            <Bar dataKey="passagens" name="Passagens" stackId="a" fill="var(--pe-gold)" radius={[6, 6, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5">
        <TabelaDados itens={diarias} colunas={colsDiarias} chave={(d, i) => `${d.servidor}-${i}`} />
      </div>
    </Secao>
  );

  return (
    <AppShell
      ano={ano}
      onAnoChange={setAno}
      atualizando={atualizando}
      subtitulo={`Pessoal e gastos administrativos · ${m.nome} · ${ano}`}
      onRefresh={() => {
        setAtualizando(true);
        setTimeout(() => setAtualizando(false), 800);
      }}
    >
      <div className="mb-5 w-full sm:max-w-sm">
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Município</label>
        <MunicipioSelect value={municipioId} onChange={setMunicipioId} />
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <p className="text-xs text-muted-foreground">Total gasto com pessoal</p>
          <p className="mt-1 text-xl font-semibold text-pe-navy sm:text-2xl">{formatBRL(totalPessoal)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <p className="text-xs text-muted-foreground">Pessoal / RCL (limite LRF 54%)</p>
          <p className={`mt-1 text-xl font-semibold sm:text-2xl ${pessoalOk ? "text-pe-green" : "text-pe-red"}`}>
            {m.percPessoal}%
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <p className="text-xs text-muted-foreground">Diárias e passagens no exercício</p>
          <p className="mt-1 text-xl font-semibold text-pe-navy sm:text-2xl">{formatBRL(totalDiarias)}</p>
        </div>
      </div>

      <Abas
        itens={[
          { id: "folha", label: "Folha de pagamento", conteudo: secaoFolha },
          { id: "diarias", label: "Diárias e passagens", conteudo: secaoDiarias },
        ]}
      />
    </AppShell>
  );
}
