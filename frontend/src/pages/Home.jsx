import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import { useSite, useRequest } from "../contexts/SiteContext";
import {
  ButtonLink,
  TextLink,
  Loading,
  ErrorState,
  Lightbox,
} from "../components/UI";
import {
  ArchiveFigure,
  EventCard,
  Invitation,
  MediaCard,
} from "../components/Editorial";
import { ArchiveNotice, BrandComposition } from "../components/MusicalIdentity";
import { editorialTitle } from "../config/editorial";
import { heroDescription } from "../config/brand";
import usePageMeta from "../hooks/usePageMeta";

export function Home() {
  const site = useSite();
  const events = useRequest("/public/events");
  const gallery = useRequest("/public/gallery");
  const [lightbox, setLightbox] = useState(null);
  const hero = site.content("hero");
  const history = site.content("history-intro");
  const photos = gallery.data?.photographs || [];
  const photoFor = (term) =>
    photos.find((photo) =>
      photo.category?.name.toLocaleLowerCase("pt-BR").includes(term),
    );
  const upcoming = (events.data || [])
    .filter((event) => new Date(event.endsAt || event.startsAt) >= new Date())
    .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt))
    .slice(0, 3);
  const media = gallery.data
    ? [
        ...photos.map((item) => ({ ...item, type: "photo" })),
        ...gallery.data.videos.map((item) => ({ ...item, type: "video" })),
      ].slice(0, 4)
    : [];
  usePageMeta("Tradição, música e cultura", heroDescription(hero?.body));
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-masthead">
            <h1>
              Charanga <span>de Irará</span>
            </h1>
            <div className="hero-provenance">
              <p>Filarmônica 25 de Dezembro</p>
              <p className="hero-location">
                {site.settings?.locationLabel || "Irará, Bahia"}
              </p>
            </div>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="hero-subtitle">
                {hero?.title ||
                  "Tradição, música e cultura que atravessam gerações."}
              </p>
              <p className="hero-description">{heroDescription(hero?.body)}</p>
              <div className="hero-actions">
                <ButtonLink to="/historia">Conheça nossa história</ButtonLink>
                <ButtonLink to="/contato" secondary arrow={false}>
                  Entre em contato
                </ButtonLink>
              </div>
            </div>
            <div className="hero-art">
              {site.settings?.heroImageUrl ? (
                <ArchiveFigure
                  className="hero-photo"
                  src={site.settings?.heroImageUrl}
                  alt={site.settings?.heroImageAlt}
                  label="Charanga de Irará · registro de apresentação"
                  priority
                />
              ) : (
                <BrandComposition />
              )}
            </div>
          </div>
        </div>
      </section>
      <nav className="home-index" aria-label="Nesta página">
        <div className="container">
          <a href="#nossa-historia">
            História <ArrowDown size={16} aria-hidden="true" />
          </a>
          <a href="#tradicoes">
            Tradições <ArrowDown size={16} aria-hidden="true" />
          </a>
          <a href="#acervo">
            Acervo <ArrowDown size={16} aria-hidden="true" />
          </a>
          <a href="#agenda">
            Agenda <ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>
      </nav>
      {site.error && (
        <div className="container">
          <ErrorState error={site.error} reload={site.reload} />
        </div>
      )}
      <section className="section history-preview" id="nossa-historia">
        <div className="container history-grid">
          <div className="history-heading">
            <h2>{editorialTitle("history-intro", history?.title)}</h2>
          </div>
          <div className="history-text">
            <p>{history?.body}</p>
            <p>{site.content("history-connection")?.body}</p>
            <TextLink to="/historia">Leia a nossa história</TextLink>
          </div>
          {photoFor("hist") && (
            <ArchiveFigure
              photo={photoFor("hist")}
              label="Memória da Charanga"
              className="history-visual"
            />
          )}
        </div>
      </section>
      <section className="section traditions" id="tradicoes">
        <div className="container traditions-inner">
          <div className="section-top">
            <h2>
              {editorialTitle(
                "tradition-heading",
                site.content("tradition-heading")?.title,
              )}
            </h2>
            <p>{site.content("tradition-heading")?.body}</p>
          </div>
          <div className="tradition-layout">
            <article className="tradition-lead">
              <ArchiveFigure
                photo={photoFor("alvorada")}
                label="Alvoradas · registro oficial"
              />
              <div>
                <h3>
                  {site.content("alvoradas")?.title || "Alvoradas musicais"}
                </h3>
                <p>{site.content("alvoradas")?.body}</p>
                <TextLink to="/historia">Conheça essa tradição</TextLink>
              </div>
            </article>
            <article className="tradition-note">
              {photoFor("lavagem") && (
                <ArchiveFigure
                  photo={photoFor("lavagem")}
                  label="Lavagem de Irará"
                />
              )}
              <h3>{site.content("lavagem")?.title || "Lavagem de Irará"}</h3>
              <p>{site.content("lavagem")?.body}</p>
              <TextLink to="/historia">Música e tradição popular</TextLink>
            </article>
            <article className="tradition-note">
              <h3>{site.content("cultura")?.title || "Cultura e tradição"}</h3>
              <p>{site.content("cultura")?.body}</p>
              <TextLink to="/musicos">Conheça nossos músicos</TextLink>
            </article>
          </div>
        </div>
      </section>
      <div
        className={`container home-programme ${media.length ? "has-media" : ""}`}
      >
        <section
          className="home-gallery"
          id="acervo"
          aria-labelledby="home-gallery-title"
        >
          <div className="section-top">
            <h2 id="home-gallery-title">
              {editorialTitle(
                "gallery-heading",
                site.content("gallery-heading")?.title,
              )}
            </h2>
            <TextLink to="/galeria">Ver fotografias e vídeos</TextLink>
          </div>
          {gallery.loading ? (
            <Loading />
          ) : gallery.error ? (
            <ErrorState {...gallery} />
          ) : media.length ? (
            <div className="media-grid">
              {media.map((item, index) => (
                <MediaCard
                  key={`${item.type}-${item.id}`}
                  item={item}
                  onClick={() => setLightbox(index)}
                />
              ))}
            </div>
          ) : (
            <ArchiveNotice>
              <h3>Fotografias e vídeos oficiais.</h3>
              <p>
                Os registros de apresentações, cortejos e encontros serão
                reunidos aqui, com suas legendas e créditos.
              </p>
              <TextLink to="/galeria">Acompanhe o acervo</TextLink>
            </ArchiveNotice>
          )}
        </section>
        <section
          className="agenda-preview"
          id="agenda"
          aria-labelledby="home-agenda-title"
        >
          <div className="section-top">
            <h2 id="home-agenda-title">
              {editorialTitle(
                "events-heading",
                site.content("events-heading")?.title,
              )}
            </h2>
            <TextLink to="/eventos">Agenda completa</TextLink>
          </div>
          {events.loading ? (
            <Loading />
          ) : events.error ? (
            <ErrorState {...events} />
          ) : upcoming.length ? (
            <div className="event-list">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="agenda-empty">
              <h3>Agenda em atualização</h3>
              <p>
                As próximas apresentações serão publicadas aqui. Para consultar
                disponibilidade, <Link to="/contato">fale com a Charanga</Link>.
              </p>
            </div>
          )}
        </section>
      </div>
      <Invitation />
      {lightbox !== null && (
        <Lightbox
          items={media}
          index={lightbox}
          setIndex={setLightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
