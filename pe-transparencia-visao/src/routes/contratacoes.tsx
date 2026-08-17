import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarClock, HardHat, ImageIcon } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MunicipioSelect } from "@/components/dashboard/MunicipioSelect";
import {
  Badge,
  Barra,
  CampoBusca,
  Secao,
  TabelaDados,
  tomStatus,
  type Coluna,
} from "@/components/auditoria/ui";
import { Abas } from "@/components/auditoria/Abas";
import { formatBRL, getMunicipio, type Ano } from "@/data/pernambuco";
import {
  getContratos,
  getLicitacoes,
  getObras,
  STATUS_LICITACAO,
  type Licitacao,
} from "@/data/auditoria";

export const Route = createFileRoute("/contratacoes")({
  head: () => ({
    meta: [
      { title: "Contratações e Obras Públicas · Transparência PE" },
      {
        name: "description",
        content:
          "Licitações, dispensas, contratos, termos aditivos e andamento físico e financeiro das obras municipais em Pernambuco.",
      },
      { property: "og:title", content: "Contratações e Obras Públicas · Transparência PE" },
      {
        property: "og:description",
        content: "Acompanhe editais, contratos vigentes e o status das obras do seu município.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contratacoes,
});

function Contratacoes() {
  const [ano, setAno] = useState<Ano>(2026);
  const [municipioId, setMunicipioId] = useState("recife");
  const [atualizando, setAtualizando] = useState(false);
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState<string>("Todas");

  const m = getMunicipio(ano, municipioId);
  const licitacoes = getLicitacoes(ano, municipioId);
  const contratos = getContratos(ano, municipioId);
  const obras = getObras(ano, municipioId);

  const licitacoesFiltradas = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return licitacoes.filter(
      (l) =>
        (status === "Todas" || l.status === status) &&
        (!q || l.objeto.toLowerCase().includes(q) || l.numero.toLowerCase().includes(q)),
    );
  }, [licitacoes, busca, status]);

  const colsLicitacoes: Coluna<Licitacao>[] = [
    {
      label: "Objeto",
      resumo: true,
      celula: (l) => (
        <span className="font-medium text-foreground">
          <span className="font-mono text-xs text-muted-foreground">{l.numero}</span> — {l.objeto}
        </span>
      ),
    },
    {
      label: "Status",
      resumo: true,
      celula: (l) => <Badge texto={l.status} tom={tomStatus(l.status)} />,
    },
    { label: "Modalidade", celula: (l) => l.modalidade },
    { label: "Abertura", celula: (l) => l.abertura },
    {
      label: "Valor estimado",
      celula: (l) => <span className="font-semibold text-pe-navy">{formatBRL(l.valorEstimado)}</span>,
    },
    {
      label: "Edital",
      celula: (l) => (
        <a href={l.edital} className="text-sm font-medium text-pe-navy underline underline-offset-2">
          Ver edital
        </a>
      ),
    },
  ];

  const secaoLicitacoes = (
    <Secao
      titulo="Licitações, dispensas e inexigibilidades"
      descricao="Processos de compra publicados no exercício"
      acao={<CampoBusca value={busca} onChange={setBusca} placeholder="Buscar objeto ou nº..." />}
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {["Todas", ...STATUS_LICITACAO].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-full px-3 py-2 text-xs font-medium transition-colors ${
              status === s
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <TabelaDados
        itens={licitacoesFiltradas}
        colunas={colsLicitacoes}
        chave={(l) => l.numero}
        vazio="Nenhum processo encontrado."
      />
    </Secao>
  );

  return (
    <AppShell
      ano={ano}
      onAnoChange={setAno}
      atualizando={atualizando}
      subtitulo={`Contratações e obras · ${m.nome} · ${ano}`}
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
          { id: "licitacoes", label: "Licitações", conteudo: secaoLicitacoes },
          {
            id: "contratos",
            label: "Contratos",
            conteudo: (
        <Secao titulo="Contratos e convênios" descricao="Valores globais, vigência e termos aditivos">
          <div className="grid gap-4 lg:grid-cols-2">
            {contratos.map((c) => (
              <article key={c.numero} className="rounded-lg border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{c.numero}</p>
                    <h3 className="text-sm font-semibold text-foreground">{c.fornecedor}</h3>
                  </div>
                  <Badge texto={c.situacao} tom={tomStatus(c.situacao)} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{c.objeto}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                  <span className="font-semibold text-pe-navy">{formatBRL(c.valorGlobal)}</span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarClock className="size-3.5" />
                    {c.inicio} a {c.fim}
                  </span>
                </div>
                <div className="mt-3 border-t border-border pt-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Termos aditivos ({c.aditivos.length})
                  </p>
                  {c.aditivos.length === 0 ? (
                    <p className="mt-1 text-xs text-muted-foreground">Nenhum aditivo registrado.</p>
                  ) : (
                    <ul className="mt-1.5 space-y-1.5">
                      {c.aditivos.map((a, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-foreground">
                          <Badge texto={a.tipo} tom={a.tipo === "Valor" ? "vermelho" : "ouro"} />
                          <span>{a.descricao}</span>
                          <span className="text-muted-foreground">· {a.data}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Secao>
            ),
          },
          {
            id: "obras",
            label: "Obras",
            conteudo: (
        <Secao titulo="Obras públicas" descricao="Execução física e financeira, cronograma e responsável">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {obras.map((o, i) => {
              const atrasada = o.prazoAtualizado.slice(3) !== o.prazoOriginal.slice(3) ||
                o.prazoAtualizado !== o.prazoOriginal;
              return (
                <article key={`${o.nome}-${i}`} className="overflow-hidden rounded-lg border border-border">
                  <div className="flex h-32 items-center justify-center bg-secondary text-muted-foreground">
                    <div className="flex flex-col items-center gap-1">
                      <ImageIcon className="size-6" />
                      <span className="text-xs">Foto da obra indisponível</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-foreground">{o.nome}</h3>
                      <Badge texto={o.situacao} tom={tomStatus(o.situacao)} />
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <HardHat className="size-3.5" /> {o.empresa} · {o.bairro}
                    </p>

                    <div className="mt-3 space-y-2">
                      <div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Execução física</span>
                          <span className="font-semibold text-foreground">{o.fisico}%</span>
                        </div>
                        <Barra valor={o.fisico} tom="azul" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Execução financeira</span>
                          <span className="font-semibold text-foreground">{o.financeiro}%</span>
                        </div>
                        <Barra valor={o.financeiro} tom="verde" />
                      </div>
                    </div>

                    <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3 text-xs">
                      <div>
                        <dt className="text-muted-foreground">Contratado</dt>
                        <dd className="font-semibold text-foreground">{formatBRL(o.valorContratado)}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Pago</dt>
                        <dd className="font-semibold text-pe-green">{formatBRL(o.valorPago)}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Prazo original</dt>
                        <dd className="text-foreground">{o.prazoOriginal}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Prazo atualizado</dt>
                        <dd className={atrasada ? "font-semibold text-pe-red" : "text-foreground"}>
                          {o.prazoAtualizado}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </article>
              );
            })}
          </div>
        </Secao>
            ),
          },
        ]}
      />
    </AppShell>
  );
}
