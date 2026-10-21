import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import { useSite, useRequest } from "../contexts/SiteContext";
import {
  ButtonLink,
  TextLink,
  Eyebrow,
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
      <section
        className={`hero ${!site.settings?.heroImageUrl ? "hero-no-photo" : ""}`}
      >
        <div className="container hero-grid">
          <div className="hero-copy">
            <Eyebrow>
              <span className="eyebrow-line" />
              {site.settings?.locationLabel || "Irará, Bahia"} · Cultura popular
            </Eyebrow>
            <h1>
              Charanga
              <br />
              <span>de Irará</span>
            </h1>
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
        <div className="container hero-footnote">
          <a href="#nossa-historia">
            Conheça a Charanga <ArrowDown size={18} />
          </a>
        </div>
      </section>
      <div className="institutional-strip">
        <div className="container">
          <span>Tradição</span>
          <i aria-hidden="true">•</i>
          <span>Música</span>
          <i aria-hidden="true">•</i>
          <span>Cultura</span>
          <i aria-hidden="true">•</i>
          <span>Irará, Bahia</span>
        </div>
      </div>
      {site.error && (
        <div className="container">
          <ErrorState error={site.error} reload={site.reload} />
        </div>
      )}
      <section className="section history-preview" id="nossa-historia">
        <div className="container history-grid">
          <div className="history-heading">
            <Eyebrow>Nossa história</Eyebrow>
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
      <section className="section traditions">
        <div className="container">
          <div className="section-top">
            <div>
              <Eyebrow>Nossas tradições</Eyebrow>
              <h2>
                {editorialTitle(
                  "tradition-heading",
                  site.content("tradition-heading")?.title,
                )}
              </h2>
            </div>
            <p>{site.content("tradition-heading")?.body}</p>
          </div>
          <div
            className={`tradition-layout ${photoFor("alvorada") ? "has-lead-photo" : ""}`}
          >
            <article className="tradition-lead">
              <ArchiveFigure
                photo={photoFor("alvorada")}
                label="Alvoradas · registro oficial"
              />
              <div>
                <span className="chapter-label">Ao amanhecer</span>
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
              <span className="chapter-label">Nas ruas de Irará</span>
              <h3>{site.content("lavagem")?.title || "Lavagem de Irará"}</h3>
              <p>{site.content("lavagem")?.body}</p>
              <TextLink to="/historia">Música e tradição popular</TextLink>
            </article>
            <article className="tradition-note">
              <span className="chapter-label">Entre gerações</span>
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
        <section className="home-gallery" aria-labelledby="home-gallery-title">
          <div className="section-top">
            <div>
              <Eyebrow>Acervo visual</Eyebrow>
              <h2 id="home-gallery-title">
                {editorialTitle(
                  "gallery-heading",
                  site.content("gallery-heading")?.title,
                )}
              </h2>
            </div>
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
              <span className="chapter-label">Acervo em preparação</span>
              <h3>Fotografias e vídeos oficiais.</h3>
              <p>
                Os registros de apresentações, cortejos e encontros serão
                reunidos aqui, com suas legendas e créditos.
              </p>
              <TextLink to="/galeria">Acompanhe o acervo</TextLink>
            </ArchiveNotice>
          )}
        </section>
        <section className="agenda-preview" aria-labelledby="home-agenda-title">
          <div className="section-top">
            <div>
              <Eyebrow>Próximas apresentações</Eyebrow>
              <h2 id="home-agenda-title">
                {editorialTitle(
                  "events-heading",
                  site.content("events-heading")?.title,
                )}
              </h2>
            </div>
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
