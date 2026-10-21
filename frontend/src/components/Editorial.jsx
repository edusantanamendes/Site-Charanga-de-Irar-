import { Link } from "react-router-dom";
import { ArrowUpRight, Play } from "lucide-react";
import { useSite } from "../contexts/SiteContext";
import { ButtonLink, Eyebrow } from "./UI";
import { editorialTitle } from "../config/editorial";
import { MusicalStaff } from "./MusicalIdentity";

export const date = (value, options = {}) =>
  new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    ...options,
  }).format(new Date(value));

export const eventStatus = {
  CONFIRMED: "Confirmado",
  CANCELLED: "Cancelado",
  POSTPONED: "Adiado",
};

export function ArchiveFigure({
  photo,
  src,
  alt,
  label = "Acervo oficial",
  className = "",
  priority = false,
}) {
  const image = src || photo?.url;
  if (!image) return null;
  return (
    <figure className={`archive-figure ${className}`}>
      <img
        src={image}
        alt={alt || photo?.alt || ""}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
      />
      <figcaption>
        <span>{photo?.title || label}</span>
        {photo?.credit && <span>Foto: {photo.credit}</span>}
      </figcaption>
    </figure>
  );
}

export function EventCard({ event }) {
  return (
    <Link to={`/eventos/${event.slug}`} className="event-card">
      <time className="event-date" dateTime={event.startsAt}>
        <strong>{date(event.startsAt, { day: "2-digit" })}</strong>
        <span>
          {date(event.startsAt, { month: "short", year: "numeric" }).replace(
            " de ",
            " / ",
          )}
        </span>
      </time>
      <div className="event-copy">
        <span className={`status status-${event.status.toLowerCase()}`}>
          {eventStatus[event.status]}
        </span>
        <h3>{event.title}</h3>
      </div>
      <div className="event-place">
        <span>{event.location}</span>
        <span>
          {date(event.startsAt, { hour: "2-digit", minute: "2-digit" })} ·
          horário de Brasília
        </span>
      </div>
      <ArrowUpRight className="event-arrow" size={22} aria-hidden="true" />
    </Link>
  );
}

export function Invitation() {
  const item = useSite().content("invitation");
  return (
    <section className="invitation">
      <div className="container invitation-inner">
        <div>
          <Eyebrow>Apresentações e parcerias</Eyebrow>
          <h2>{editorialTitle("invitation", item?.title)}</h2>
          <p>
            {item?.body ||
              "Converse com a nossa equipe sobre apresentações, encontros e parcerias culturais."}
          </p>
        </div>
        <ButtonLink to="/contato">Entre em contato</ButtonLink>
      </div>
    </section>
  );
}

export function MediaCard({ item, onClick }) {
  return (
    <button className="media-card" onClick={onClick}>
      <span className="media-image">
        {item.type === "video" ? (
          <>
            {item.thumbnailUrl ? (
              <img src={item.thumbnailUrl} alt="" loading="lazy" />
            ) : (
              <span className="video-placeholder">
                <MusicalStaff />
                <span>
                  Charanga de Irará
                  <br />
                  <strong>Registro em vídeo</strong>
                </span>
              </span>
            )}
            <span className="play-icon">
              <Play size={22} fill="currentColor" aria-hidden="true" />
            </span>
          </>
        ) : (
          <img src={item.url} alt={item.alt} loading="lazy" />
        )}
      </span>
      <span className="media-card-label">
        <span>
          <small>
            {item.category?.name ||
              (item.type === "video" ? "Vídeo" : "Fotografia")}
          </small>
          <strong>{item.title}</strong>
        </span>
        <ArrowUpRight size={18} aria-hidden="true" />
      </span>
    </button>
  );
}
