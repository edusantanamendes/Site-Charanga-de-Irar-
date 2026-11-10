import OfficialLogo from "./OfficialLogo";

export function BrandComposition() {
  return (
    <figure className="brand-composition">
      <OfficialLogo priority />
      <figcaption>Identidade da Charanga de Irará</figcaption>
    </figure>
  );
}

export function ArchiveNotice({ children, className = "" }) {
  return (
    <div className={`archive-notice ${className}`}>
      <div>{children}</div>
    </div>
  );
}
