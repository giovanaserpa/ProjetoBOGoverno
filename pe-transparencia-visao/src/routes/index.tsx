import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { PainelMetricas } from "@/components/dashboard/PainelMetricas";
import { MunicipioSelect } from "@/components/dashboard/MunicipioSelect";
import { GraficoPizza } from "@/components/charts/GraficoPizza";
import {
  FUNCOES,
  formatBRL,
  getMunicipio,
  getRankingTransparencia,
  getSerieMensal,
  type Ano,
} from "@/data/pernambuco";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Visão Geral · Transparência Municipal PE" },
      {
        name: "description",
        content:
          "Receitas, despesas por função, gasto com pessoal e índice de transparência dos 184 municípios de Pernambuco.",
      },
      { property: "og:title", content: "Visão Geral · Transparência Municipal PE" },
      {
        property: "og:description",
        content: "Painel público com indicadores fiscais dos 184 municípios de Pernambuco.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [ano, setAno] = useState<Ano>(2026);
  const [municipioId, setMunicipioId] = useState("recife");
  const [atualizando, setAtualizando] = useState(false);

  const municipio = getMunicipio(ano, municipioId);
  const serie = getSerieMensal(ano, municipioId);
  const ranking = getRankingTransparencia(ano);

  return (
    <AppShell
      ano={ano}
      onAnoChange={setAno}
      atualizando={atualizando}
      subtitulo={`${municipio.nome} · exercício ${ano}`}
      onRefresh={() => {
        setAtualizando(true);
        setTimeout(() => setAtualizando(false), 900);
      }}
    >
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="w-full sm:max-w-sm">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Município
          </label>
          <MunicipioSelect value={municipioId} onChange={setMunicipioId} />
        </div>
        <p className="pb-2 text-xs text-muted-foreground">
          População estimada: {municipio.populacao.toLocaleString("pt-BR")} habitantes
        </p>
      </div>

      <PainelMetricas m={municipio} />

      <section className="mt-6 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-base font-semibold text-foreground">
            Receitas x Despesas — histórico mensal de {municipio.nome}
          </h2>
          <p className="text-xs text-muted-foreground">Valores em milhões de reais</p>
        </div>
        <div className="h-64 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={serie} margin={{ top: 8, right: 8, left: -6, bottom: 0 }}>
              <defs>
                <linearGradient id="gReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--pe-green)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--pe-green)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gDespesa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--pe-red)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--pe-red)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                  color: "var(--foreground)",
                }}
                formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")} mi`}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="receita"
                name="Receitas"
                stroke="var(--pe-green)"
                strokeWidth={2}
                fill="url(#gReceita)"
              />
              <Area
                type="monotone"
                dataKey="despesa"
                name="Despesas"
                stroke="var(--pe-red)"
                strokeWidth={2}
                fill="url(#gDespesa)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-base font-semibold text-foreground">
            Despesas por função — divisão do orçamento
          </h2>
          <p className="text-xs text-muted-foreground">
            Toque em uma fatia para ver valor e percentual
          </p>
        </div>
        <GraficoPizza
          dados={FUNCOES.map(({ key, label }) => ({
            nome: label,
            valor: municipio.despesas[key],
          }))}
          altura={340}
        />
      </section>

      <section className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-foreground">Ranking de Transparência</h2>
          <p className="text-xs text-muted-foreground">
            Top 5 entre os 184 municípios de Pernambuco em {ano}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">#</th>
                <th className="px-5 py-3 font-medium">Município</th>
                <th className="px-5 py-3 font-medium">População</th>
                <th className="px-5 py-3 font-medium">Receita</th>
                <th className="px-5 py-3 font-medium">Índice</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((m, i) => (
                <tr key={m.id} className="border-t border-border">
                  <td className="px-5 py-3 font-semibold text-muted-foreground">{i + 1}</td>
                  <td className="px-5 py-3 font-medium text-foreground">{m.nome}</td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {m.populacao.toLocaleString("pt-BR")}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{formatBRL(m.receitaTotal)}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        m.indiceTransparencia >= 85
                          ? "bg-pe-green/12 text-pe-green"
                          : m.indiceTransparencia >= 70
                            ? "bg-pe-gold/25 text-pe-navy"
                            : "bg-pe-red/12 text-pe-red"
                      }`}
                    >
                      {m.indiceTransparencia.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
