import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  Coins,
  HardHat,
  LayoutDashboard,
  Menu,
  RefreshCw,
  Users,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { BandeiraPE } from "@/components/brand/BandeiraPE";
import { anos, type Ano } from "@/data/pernambuco";

type Props = {
  children: ReactNode;
  ano: Ano;
  onAnoChange: (ano: Ano) => void;
  onRefresh: () => void;
  atualizando?: boolean;
  subtitulo?: string;
};

const nav = [
  { to: "/", label: "Visão Geral", curto: "Geral", icon: LayoutDashboard },
  { to: "/financeiro", label: "Execução Financeira", curto: "Finanças", icon: Coins },
  { to: "/contratacoes", label: "Contratações e Obras", curto: "Obras", icon: HardHat },
  { to: "/pessoal", label: "Pessoal e Diárias", curto: "Pessoal", icon: Users },
  { to: "/comparador", label: "Comparador", curto: "Comparar", icon: BarChart3 },
] as const;

export function AppShell({
  children,
  ano,
  onAnoChange,
  onRefresh,
  atualizando,
  subtitulo,
}: Props) {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex items-center gap-3 px-6 py-7">
          <BandeiraPE className="w-10" />
          <div className="leading-tight">
            <p className="text-base font-semibold tracking-tight">Transparência PE</p>
            <p className="text-xs text-sidebar-foreground/60">Portal do cidadão</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              activeProps={{
                className:
                  "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-sidebar-primary",
              }}
              activeOptions={{ exact: to === "/" }}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
        <p className="px-6 py-6 text-xs text-sidebar-foreground/50">
          184 municípios · dados demonstrativos
        </p>
      </aside>

      {/* menu hambúrguer (mobile) */}
      {menuAberto ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Fechar menu"
            onClick={() => setMenuAberto(false)}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          />
          <nav className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col bg-sidebar text-sidebar-foreground shadow-xl">
            <div className="flex items-center justify-between gap-3 px-5 py-5">
              <div className="flex min-w-0 items-center gap-3">
                <BandeiraPE className="w-9 shrink-0" />
                <p className="truncate text-base font-semibold">Transparência PE</p>
              </div>
              <button
                aria-label="Fechar menu"
                onClick={() => setMenuAberto(false)}
                className="grid size-11 shrink-0 place-items-center rounded-lg text-sidebar-foreground/70"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-1 px-3">
              {nav.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuAberto(false)}
                  className="flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm font-medium text-sidebar-foreground/80"
                  activeProps={{
                    className: "bg-sidebar-accent text-sidebar-accent-foreground",
                  }}
                  activeOptions={{ exact: to === "/" }}
                >
                  <Icon className="size-5 shrink-0" />
                  {label}
                </Link>
              ))}
            </div>
            <p className="px-5 py-6 text-xs text-sidebar-foreground/50">
              184 municípios · dados demonstrativos
            </p>
          </nav>
        </div>
      ) : null}

      <div className="md:pl-64">
        <header className="sticky top-0 z-20 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-card/90 px-4 py-3 backdrop-blur md:flex md:flex-wrap md:justify-between md:px-8 md:py-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              aria-label="Abrir menu"
              onClick={() => setMenuAberto(true)}
              className="grid size-11 shrink-0 place-items-center rounded-lg bg-secondary text-foreground md:hidden"
            >
              <Menu className="size-5" />
            </button>
            <BandeiraPE className="w-9 shrink-0 sm:w-11" />
            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold tracking-tight text-foreground sm:text-lg">
                Transparência Municipal - PE
              </h1>
              <p className="truncate text-xs text-muted-foreground">
                {subtitulo ?? `Exercício ${ano}`}
              </p>
            </div>
          </div>
          <div className="col-span-2 flex items-center justify-between gap-2 md:col-span-1 md:justify-end">
            <div className="flex rounded-lg border border-border bg-secondary p-1">
              {anos.map((a) => (
                <button
                  key={a}
                  onClick={() => onAnoChange(a)}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    a === ano
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
            <button
              onClick={onRefresh}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent px-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            >
              <RefreshCw className={`size-4 ${atualizando ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
          </div>
        </header>
        <main className="px-4 pb-24 pt-5 sm:px-5 md:px-8 md:pb-8 md:pt-6">{children}</main>
      </div>

      {/* bottom navigation fixa (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {nav.map(({ to, curto, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground"
            activeProps={{ className: "text-pe-navy" }}
            activeOptions={{ exact: to === "/" }}
          >
            <Icon className="size-5" />
            {curto}
          </Link>
        ))}
      </nav>
    </div>
  );
}
