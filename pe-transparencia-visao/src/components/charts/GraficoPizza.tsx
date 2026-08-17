import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatBRL } from "@/data/pernambuco";

export type FatiaPizza = { nome: string; valor: number };

/** Tons harmônicos derivados da bandeira de Pernambuco. */
export const CORES_PIZZA = [
  "var(--pe-c1)",
  "var(--pe-c2)",
  "var(--pe-c3)",
  "var(--pe-c4)",
  "var(--pe-c5)",
  "var(--pe-c6)",
  "var(--pe-c7)",
];

function TooltipPizza({ active, payload, total }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  const perc = total ? (p.value / total) * 100 : 0;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-[var(--shadow-card)]">
      <p className="text-xs font-semibold text-foreground">{p.name}</p>
      <p className="text-sm font-semibold text-pe-navy">{formatBRL(p.value)}</p>
      <p className="text-xs text-muted-foreground">{perc.toFixed(1)}% do total</p>
    </div>
  );
}

export function GraficoPizza({
  dados,
  altura = 300,
}: {
  dados: FatiaPizza[];
  altura?: number;
}) {
  const total = dados.reduce((a, d) => a + d.valor, 0);
  return (
    <div className="w-full" style={{ height: altura }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dados}
            dataKey="valor"
            nameKey="nome"
            innerRadius="45%"
            outerRadius="72%"
            paddingAngle={2}
            stroke="var(--card)"
            strokeWidth={2}
          >
            {dados.map((d, i) => (
              <Cell key={d.nome} fill={CORES_PIZZA[i % CORES_PIZZA.length]} />
            ))}
          </Pie>
          <Tooltip content={<TooltipPizza total={total} />} />
          <Legend
            iconType="circle"
            layout="horizontal"
            verticalAlign="bottom"
            wrapperStyle={{ fontSize: 11, lineHeight: "18px", paddingTop: 8 }}
            formatter={(v: string) => (
              <span className="text-muted-foreground">{v}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}