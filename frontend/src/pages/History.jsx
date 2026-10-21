import { useSite, useRequest } from "../contexts/SiteContext";
import {
  PageHeading,
  Eyebrow,
  TextLink,
  Loading,
  ErrorState,
} from "../components/UI";
import { ArchiveFigure } from "../components/Editorial";
import { editorialTitle } from "../config/editorial";
import usePageMeta from "../hooks/usePageMeta";

export function History() {
  const { contents, content, loading, error, reload } = useSite();
  const gallery = useRequest("/public/gallery");
  const history = contents.filter((item) => item.section === "historia");
  const timeline = contents.filter((item) => item.section === "timeline");
  const heading = content("page-history");
  const photo = gallery.data?.photographs.find((item) =>
    item.category?.name.toLocaleLowerCase("pt-BR").includes("hist"),
  );
  usePageMeta(
    "Nossa história",
    "A história, a cultura e a tradição musical da Charanga de Irará.",
  );
  return (
    <>
      <PageHeading
        label="Charanga de Irará / Memória"
        title={editorialTitle("page-history", heading?.title)}
        variant="history"
      >
        {heading?.body}
      </PageHeading>
      <section className="section story-content">
        <div className="container story-layout">
          <aside className="story-aside">
            {history.length > 0 && (
              <nav className="story-index" aria-label="Nesta história">
                <span className="chapter-label">Nesta história</span>
                {history.map((item, index) => (
                  <a key={item.id} href={`#capitulo-${item.key}`}>
                    <span aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {editorialTitle(item.key, item.title)}
                  </a>
                ))}
              </nav>
            )}
            {photo && (
              <ArchiveFigure
                photo={photo}
                label="Arquivo histórico da Charanga"
              />
            )}
            <p>
              Conheça a trajetória da Charanga e sua ligação com a cultura
              popular de Irará.
            </p>
            <TextLink to="/galeria">Consultar o acervo</TextLink>
          </aside>
          <div className="story-body">
            {loading ? (
              <Loading />
            ) : error ? (
              <ErrorState error={error} reload={reload} />
            ) : (
              history.map((item) => (
                <article
                  className="story-section"
                  id={`capitulo-${item.key}`}
                  key={item.id}
                >
                  <h2>{editorialTitle(item.key, item.title)}</h2>
                  <p className="preserve-lines">{item.body}</p>
                </article>
              ))
            )}
            {timeline.length > 0 && (
              <section className="timeline">
                <Eyebrow>Contexto histórico</Eyebrow>
                <h2>Raízes musicais de Irará</h2>
                {timeline.map((item) => (
                  <div className="timeline-item" key={item.id}>
                    <strong>{item.year || "Memória"}</strong>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </div>
                  </div>
                ))}
              </section>
            )}
            <div className="story-end">
              <TextLink to="/musicos">Conheça os músicos</TextLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
