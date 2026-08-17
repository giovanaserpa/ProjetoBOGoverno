import { useState, type ReactNode } from "react";

export type ItemAba = { id: string; label: string; conteudo: ReactNode };

/**
 * No celular exibe abas superiores roláveis (uma seção por vez).
 * Em telas grandes empilha todas as seções.
 */
export function Abas({ itens }: { itens: ItemAba[] }) {
  const [ativa, setAtiva] = useState(itens[0]?.id ?? "");
  const atual = itens.find((i) => i.id === ativa) ?? itens[0];

  return (
    <>
      <div className="min-w-0 lg:hidden">
        <div
          role="tablist"
          className="-mx-4 mb-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {itens.map((i) => (
            <button
              key={i.id}
              role="tab"
              aria-selected={i.id === atual?.id}
              onClick={() => setAtiva(i.id)}
              className={`min-h-11 shrink-0 snap-start whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors ${
                i.id === atual?.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {i.label}
            </button>
          ))}
        </div>
        <div className="min-w-0">{atual?.conteudo}</div>
      </div>

      <div className="hidden gap-6 lg:grid">
        {itens.map((i) => (
          <div key={i.id} className="min-w-0">{i.conteudo}</div>
        ))}
      </div>
    </>
  );
}