import bandeiraAsset from "@/assets/bandeira-pe.png.asset.json";

/** Bandeira oficial de Pernambuco. */
export function BandeiraPE({ className = "" }: { className?: string }) {
  return (
    <img
      src={bandeiraAsset.url}
      alt="Bandeira de Pernambuco"
      loading="lazy"
      className={`block h-auto rounded-[3px] border border-border/40 object-cover shadow-sm ${className}`}
      style={{ aspectRatio: "10 / 7" }}
    />
  );
}