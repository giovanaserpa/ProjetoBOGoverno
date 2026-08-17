import { ChevronDown, Search } from "lucide-react";
import { useState, type ReactNode } from "react";

export function Secao({
  titulo,
  descricao,
  acao,
  children,
  className = "",
}: {
  titulo: string;
  descricao?: string;
  acao?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`min-w-0 rounded-xl border border-border bg-card shadow-[var(--shadow-card)] ${className}`}
    >
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground">{titulo}</h2>
          {descricao ? <p className="text-xs text-muted-foreground">{descricao}</p> : null}
        </div>
        {acao}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function CampoBusca({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 sm:max-w-xs">
      <Search className="size-4 shrink-0 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}

const tonalidades: Record<string, string> = {
  verde: "bg-pe-green/12 text-pe-green",
  vermelho: "bg-pe-red/12 text-pe-red",
  ouro: "bg-pe-gold/25 text-pe-navy",
  azul: "bg-pe-navy/10 text-pe-navy",
  neutro: "bg-secondary text-muted-foreground",
};

export function Badge({ texto, tom = "neutro" }: { texto: string; tom?: keyof typeof tonalidades }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${tonalidades[tom]}`}
    >
      {texto}
    </span>
  );
}

export function tomStatus(status: string): keyof typeof tonalidades {
  if (["Concluída", "Homologada", "Vigente"].includes(status)) return "verde";
  if (["Em andamento", "Em execução"].includes(status)) return "azul";
  if (["Suspensa", "Paralisada", "Rescindido"].includes(status)) return "vermelho";
  if (["Deserta"].includes(status)) return "ouro";
  return "neutro";
}

export function Tabela({ cabecalho, children }: { cabecalho: string[]; children: ReactNode }) {
  return (
    <div className="-mx-4 overflow-x-auto overscroll-x-contain px-4 [scroll-behavior:smooth] [-webkit-overflow-scrolling:touch] sm:mx-0 sm:px-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
            {cabecalho.map((c) => (
              <th key={c} className="whitespace-nowrap px-4 py-3 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

/* ------------------- tabela responsiva com cards no mobile ------------------- */

export type Coluna<T> = {
  label: string;
  celula: (item: T) => ReactNode;
  /** exibido sempre no card mobile (fora do conteúdo expansível) */
  resumo?: boolean;
  className?: string;
};

export function TabelaDados<T>({
  itens,
  colunas,
  chave,
  vazio = "Nenhum registro encontrado.",
}: {
  itens: T[];
  colunas: Coluna<T>[];
  chave: (item: T, i: number) => string;
  vazio?: string;
}) {
  if (itens.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">{vazio}</p>;
  }

  const resumo = colunas.filter((c) => c.resumo);
  const detalhe = colunas.filter((c) => !c.resumo);

  return (
    <>
      {/* mobile: cards de dados expansíveis */}
      <ul className="min-w-0 space-y-2.5 md:hidden">
        {itens.map((item, i) => (
          <CardDados
            key={chave(item, i)}
            item={item}
            resumo={resumo.length ? resumo : colunas.slice(0, 2)}
            detalhe={resumo.length ? detalhe : colunas.slice(2)}
          />
        ))}
      </ul>

      {/* desktop/tablet: tabela com rolagem horizontal */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
              {colunas.map((c) => (
                <th key={c.label} className="whitespace-nowrap px-4 py-3 font-medium">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {itens.map((item, i) => (
              <tr key={chave(item, i)} className="border-t border-border">
                {colunas.map((c) => (
                  <td key={c.label} className={`px-4 py-3 ${c.className ?? ""}`}>
                    {c.celula(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function CardDados<T>({
  item,
  resumo,
  detalhe,
}: {
  item: T;
  resumo: Coluna<T>[];
  detalhe: Coluna<T>[];
}) {
  const [aberto, setAberto] = useState(false);
  return (
    <li className="rounded-lg border border-border bg-card">
      <button
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        className="flex w-full items-start justify-between gap-3 p-4 text-left"
      >
        <div className="min-w-0 space-y-1">
          {resumo.map((c) => (
            <div key={c.label} className="min-w-0 text-sm text-foreground">
              {c.celula(item)}
            </div>
          ))}
        </div>
        <ChevronDown
          className={`mt-0.5 size-5 shrink-0 text-muted-foreground transition-transform ${
            aberto ? "rotate-180" : ""
          }`}
        />
      </button>
      {aberto && detalhe.length ? (
        <dl className="grid grid-cols-2 gap-3 border-t border-border px-4 py-3 text-xs">
          {detalhe.map((c) => (
            <div key={c.label} className="min-w-0">
              <dt className="text-muted-foreground">{c.label}</dt>
              <dd className="mt-0.5 break-words text-sm text-foreground">{c.celula(item)}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </li>
  );
}

export function Barra({ valor, tom = "azul" }: { valor: number; tom?: "azul" | "verde" | "ouro" }) {
  const cor = tom === "verde" ? "bg-pe-green" : tom === "ouro" ? "bg-pe-gold" : "bg-pe-navy";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
      <div className={`h-full rounded-full ${cor}`} style={{ width: `${Math.min(100, valor)}%` }} />
    </div>
  );
}
