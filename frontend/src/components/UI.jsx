import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function ButtonLink({
  children,
  to,
  secondary = false,
  className = "",
  arrow = true,
}) {
  return (
    <Link
      to={to}
      className={`button ${secondary ? "button-secondary" : ""} ${className}`}
    >
      {children}
      {arrow && <ArrowUpRight size={17} />}
    </Link>
  );
}
export function TextLink({ to, children }) {
  return (
    <Link className="text-link" to={to}>
      {children}
    </Link>
  );
}
export function Eyebrow({ children, light = false }) {
  return (
    <p className={`eyebrow ${light ? "eyebrow-light" : ""}`}>{children}</p>
  );
}
export function PageHeading({ label, title, children, variant = "default" }) {
  return (
    <section className={`page-heading page-heading-${variant}`}>
      <div className="container">
        <div className="page-breadcrumb">
          <Link to="/">Início</Link>
          <span aria-hidden="true">/</span>
          <span>{label}</span>
        </div>
        <h1>{title}</h1>
        {children && <p className="page-intro">{children}</p>}
      </div>
    </section>
  );
}
export function EmptyState({ title, children, compact = false }) {
  return (
    <div className={`empty-state ${compact ? "empty-compact" : ""}`}>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
export function Loading({ label = "Carregando conteúdo…" }) {
  return (
    <div className="loading-state" role="status" aria-label={label}>
      <div className="skeleton skeleton-title" />
      <div className="skeleton" />
      <div className="skeleton" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
export function ErrorState({ error, reload }) {
  return (
    <div className="error-state" role="alert">
      <p>{error?.message || "Não foi possível carregar o conteúdo."}</p>
      {reload && (
        <button className="button button-secondary" onClick={reload}>
          <RefreshCw size={16} />
          Tentar novamente
        </button>
      )}
    </div>
  );
}
export function Dialog({ children, title, onClose, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = before;
      dialog.close();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`dialog ${className}`}
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-inner">
        <button
          className="icon-button dialog-close"
          aria-label="Fechar janela"
          onClick={onClose}
          autoFocus
        >
          <X size={22} />
        </button>
        {children}
      </div>
    </dialog>
  );
}
export function Lightbox({ items, index, setIndex, onClose }) {
  const item = items[index];
  const move = (direction) =>
    setIndex((index + direction + items.length) % items.length);
  useEffect(() => {
    const handler = (event) => {
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });
  function embed(url) {
    const u = new URL(url);
    if (u.hostname.includes("vimeo.com"))
      return `https://player.vimeo.com/video/${u.pathname.slice(1)}`;
    return `https://www.youtube-nocookie.com/embed/${u.hostname === "youtu.be" ? u.pathname.slice(1) : u.searchParams.get("v") || u.pathname.slice(1)}`;
  }
  return (
    <Dialog title={item.title} onClose={onClose} className="lightbox">
      <div className="lightbox-media">
        {item.type === "video" ? (
          <iframe
            key={item.id}
            src={embed(item.url)}
            title={item.title}
            allow="fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <img src={item.url} alt={item.alt} />
        )}
      </div>
      <div className="lightbox-caption">
        <div>
          <h2>{item.title}</h2>
          <p>
            {item.credit ? `Crédito: ${item.credit}` : item.description}
            {item.type === "video" && " · Reprodução por serviço externo."}
          </p>
        </div>
        <span aria-live="polite">
          {index + 1} / {items.length}
        </span>
      </div>
      {items.length > 1 && (
        <div className="lightbox-controls">
          <button
            className="icon-button"
            onClick={() => move(-1)}
            aria-label="Registro anterior"
          >
            <ChevronLeft />
          </button>
          <button
            className="icon-button"
            onClick={() => move(1)}
            aria-label="Próximo registro"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </Dialog>
  );
}
