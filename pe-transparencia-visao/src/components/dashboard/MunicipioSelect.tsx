import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { listaMunicipios } from "@/data/pernambuco";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function MunicipioSelect({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [busca, setBusca] = useState("");

  const atual = listaMunicipios.find((m) => m.id === value);
  const filtrados = useMemo(() => {
    const q = normalize(busca.trim());
    if (!q) return listaMunicipios;
    return listaMunicipios.filter((m) => normalize(m.nome).includes(q));
  }, [busca]);

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setBusca("");
      }}
    >
      <PopoverTrigger asChild>
        <button
          className={`flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary ${className}`}
        >
          <span className="truncate">{atual?.nome ?? "Selecione um município"}</span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[--radix-popover-trigger-width] min-w-64 p-0">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <Search className="size-4 text-muted-foreground" />
          <input
            autoFocus
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar entre os 184 municípios..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="max-h-72 overflow-y-auto py-1">
          {filtrados.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Nenhum município encontrado.
            </p>
          ) : (
            filtrados.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  onChange(m.id);
                  setOpen(false);
                  setBusca("");
                }}
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-secondary"
              >
                <span className="truncate">{m.nome}</span>
                {m.id === value ? <Check className="size-4 text-pe-green" /> : null}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}