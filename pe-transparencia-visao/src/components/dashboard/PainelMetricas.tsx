import {
  Banknote,
  Building2,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Palette,
  ShieldCheck,
  Droplets,
  Users,
  Gauge,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatBRL, LIMITES, type Municipio } from "@/data/pernambuco";

type Tone = "green" | "red" | "gold" | "navy";

const tones: Record<Tone, { icon: string; value: string }> = {
  green: { icon: "bg-pe-green/12 text-pe-green", value: "text-pe-green" },
  red: { icon: "bg-pe-red/12 text-pe-red", value: "text-pe-red" },
  gold: { icon: "bg-pe-gold/25 text-pe-navy", value: "text-pe-navy" },
  navy: { icon: "bg-pe-navy/10 text-pe-navy", value: "text-pe-navy" },
};

export function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "navy",
  progresso,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: Tone;
  progresso?: { valor: number; ok: boolean };
}) {
  const t = tones[tone];
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${t.icon}`}>
          <Icon className="size-4" />
        </span>
      </div>
      <p className={`mt-4 text-2xl font-semibold tracking-tight ${t.value}`}>{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      {progresso ? (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
          <div
            className={`h-full rounded-full ${progresso.ok ? "bg-pe-green" : "bg-pe-red"}`}
            style={{ width: `${Math.min(100, progresso.valor)}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}

export function PainelMetricas({ m }: { m: Municipio }) {
  const saudeOk = m.percSaude >= LIMITES.saudeMin;
  const educacaoOk = m.percEducacao >= LIMITES.educacaoMin;
  const pessoalOk = m.percPessoal < LIMITES.pessoalPrudencial;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Receita Total Arrecadada"
          value={formatBRL(m.receitaTotal)}
          hint={`R$ ${m.receitaPorHabitante.toLocaleString("pt-BR")} por habitante`}
          icon={Banknote}
          tone="green"
        />
        <MetricCard
          label="Despesa Total Liquidada"
          value={formatBRL(m.despesaTotal)}
          hint={`${m.saldo >= 0 ? "Superávit" : "Déficit"} de ${formatBRL(Math.abs(m.saldo))}`}
          icon={Building2}
          tone="red"
        />
        <MetricCard
          label="Investimento em Saúde"
          value={`${m.percSaude}%`}
          hint={`${formatBRL(m.despesas.saude)} · mínimo ${LIMITES.saudeMin}% ${saudeOk ? "atendido" : "não atendido"}`}
          icon={HeartPulse}
          tone={saudeOk ? "green" : "red"}
          progresso={{ valor: (m.percSaude / 30) * 100, ok: saudeOk }}
        />
        <MetricCard
          label="Investimento em Educação"
          value={`${m.percEducacao}%`}
          hint={`${formatBRL(m.despesas.educacao)} · mínimo ${LIMITES.educacaoMin}% ${educacaoOk ? "atendido" : "não atendido"}`}
          icon={GraduationCap}
          tone={educacaoOk ? "green" : "red"}
          progresso={{ valor: (m.percEducacao / 40) * 100, ok: educacaoOk }}
        />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Despesas por função
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            label="Segurança Pública"
            value={formatBRL(m.despesas.seguranca)}
            hint={`${((m.despesas.seguranca / m.despesaTotal) * 100).toFixed(1)}% da despesa`}
            icon={ShieldCheck}
            tone="navy"
          />
          <MetricCard
            label="Saneamento / Urbanismo"
            value={formatBRL(m.despesas.saneamento)}
            hint={`${((m.despesas.saneamento / m.despesaTotal) * 100).toFixed(1)}% da despesa`}
            icon={Droplets}
            tone="navy"
          />
          <MetricCard
            label="Assistência Social"
            value={formatBRL(m.despesas.assistencia)}
            hint={`${((m.despesas.assistencia / m.despesaTotal) * 100).toFixed(1)}% da despesa`}
            icon={HandHeart}
            tone="navy"
          />
          <MetricCard
            label="Administração"
            value={formatBRL(m.despesas.administracao)}
            hint={`${((m.despesas.administracao / m.despesaTotal) * 100).toFixed(1)}% da despesa`}
            icon={Building2}
            tone="navy"
          />
          <MetricCard
            label="Cultura"
            value={formatBRL(m.despesas.cultura)}
            hint={`${((m.despesas.cultura / m.despesaTotal) * 100).toFixed(1)}% da despesa`}
            icon={Palette}
            tone="gold"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard
          label="Gasto total com pessoal (LRF)"
          value={`${m.percPessoal}% da RCL`}
          hint={`Limite prudencial ${LIMITES.pessoalPrudencial}% · limite máximo ${LIMITES.pessoalMaximo}%`}
          icon={Users}
          tone={pessoalOk ? "green" : "red"}
          progresso={{
            valor: (m.percPessoal / LIMITES.pessoalMaximo) * 100,
            ok: pessoalOk,
          }}
        />
        <MetricCard
          label="Índice de Transparência (TCE-PE)"
          value={`${m.indiceTransparencia.toFixed(1)} / 100`}
          hint="Nota baseada nos critérios de transparência do TCE-PE"
          icon={Gauge}
          tone={m.indiceTransparencia >= 80 ? "green" : m.indiceTransparencia >= 65 ? "gold" : "red"}
          progresso={{ valor: m.indiceTransparencia, ok: m.indiceTransparencia >= 80 }}
        />
      </div>
    </div>
  );
}
