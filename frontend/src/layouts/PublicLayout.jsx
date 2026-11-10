import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ArrowUpRight,
  MapPin,
  ArrowUp,
  Mail,
  MessageCircle,
} from "lucide-react";
import OfficialLogo from "../components/OfficialLogo";
import { useSite } from "../contexts/SiteContext";
import { footerTagline } from "../config/brand";

const links = [
  ["/", "Início"],
  ["/historia", "Nossa história"],
  ["/galeria", "Galeria"],
  ["/eventos", "Eventos"],
  ["/musicos", "Nossos músicos"],
];
export function Brand({ footer = false }) {
  const { settings } = useSite();
  return (
    <Link
      to="/"
      className={`brand ${footer ? "brand-footer" : ""}`}
      aria-label={`${settings?.name || "Charanga de Irará"} — início`}
    >
      <OfficialLogo decorative priority={!footer} />
      <span>
        {settings?.name || "Charanga de Irará"}
        <small>Irará, Bahia</small>
      </span>
    </Link>
  );
}
export default function PublicLayout() {
  const [open, setOpen] = useState(false);
  const menuToggle = useRef(null);
  const main = useRef(null);
  const previousPath = useRef(null);
  const location = useLocation();
  const { settings, socials } = useSite();
  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
    if (
      previousPath.current !== null &&
      previousPath.current !== location.pathname
    ) {
      requestAnimationFrame(() => main.current?.focus({ preventScroll: true }));
    }
    previousPath.current = location.pathname;
  }, [location.pathname]);
  useEffect(() => {
    const handler = (event) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        menuToggle.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1001px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="header">
        <div className="container header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Navegação principal">
            {links.map(([path, label]) => (
              <NavLink key={path} end={path === "/"} to={path}>
                {label}
              </NavLink>
            ))}
          </nav>
          <NavLink className="header-contact" to="/contato">
            Contato
            <ArrowUpRight size={16} aria-hidden="true" />
          </NavLink>
          <button
            ref={menuToggle}
            className="menu-toggle icon-button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen(!open)}
          >
            <span>{open ? "Fechar" : "Menu"}</span>
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav
            id="menu-mobile"
            className="mobile-nav"
            aria-label="Navegação móvel"
          >
            {[...links, ["/contato", "Contato"]].map(([path, label]) => (
              <NavLink key={path} to={path} end={path === "/"}>
                {label}
                <ArrowUpRight size={18} aria-hidden="true" />
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      <main ref={main} id="conteudo" className="public-main" tabIndex="-1">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">
          <div className="footer-main">
            <div>
              <Brand footer />
              <p className="footer-description">
                {footerTagline(settings?.tagline)}
              </p>
              <span className="footer-location">
                <MapPin size={15} />
                {settings?.locationLabel || "Irará, Bahia"}
              </span>
              <div className="footer-contacts">
                {settings?.officialEmail && (
                  <a href={`mailto:${settings.officialEmail}`}>
                    <Mail size={15} />
                    {settings.officialEmail}
                  </a>
                )}
                {settings?.whatsapp && (
                  <a
                    href={`https://wa.me/${settings.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle size={15} />
                    WhatsApp oficial
                    <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </div>
            <div className="footer-links">
              <span>Navegação</span>
              <div>
                {[...links.slice(1), ["/contato", "Contato"]].map(
                  ([path, label]) => (
                    <Link key={path} to={path}>
                      {label}
                    </Link>
                  ),
                )}
              </div>
            </div>
            <div className="footer-social">
              <span>Redes e contato</span>
              {socials.length ? (
                socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.label}
                    <ArrowUpRight size={16} />
                  </a>
                ))
              ) : (
                <Link to="/contato">
                  Fale com a Charanga
                  <ArrowUpRight size={16} />
                </Link>
              )}
              <button
                className="back-to-top"
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: matchMedia("(prefers-reduced-motion: reduce)")
                      .matches
                      ? "instant"
                      : "smooth",
                  })
                }
              >
                Voltar ao topo
                <ArrowUp size={16} />
              </button>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()}{" "}
              {settings?.name || "Charanga de Irará"}. Cultura que permanece.
            </span>
            <div>
              <Link to="/privacidade">Privacidade</Link>
              <Link to="/admin">
                Área administrativa
                <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
