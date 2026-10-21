import { useSite } from "../contexts/SiteContext";
import { Eyebrow, TextLink } from "./UI";
import OfficialLogo from "./OfficialLogo";
import { editorialTitle } from "../config/editorial";

export function ArchiveContext() {
  const item = useSite().content("patrimonio");
  if (!item?.body) return null;
  return (
    <article className="archive-context">
      <h3>{item.title}</h3>
      <p className="preserve-lines">{item.body}</p>
    </article>
  );
}

export function MusicianIntroduction() {
  const item = useSite().content("geracoes");
  if (!item?.body) return null;
  return (
    <article className="musician-introduction">
      <div className="musician-introduction-heading">
        <OfficialLogo decorative />
        <div>
          <Eyebrow>Música e comunidade</Eyebrow>
          <h2>{item.title}</h2>
        </div>
      </div>
      <p className="preserve-lines">{item.body}</p>
      <TextLink to="/historia">Conheça essa história</TextLink>
    </article>
  );
}

export function TraditionContext() {
  const { content } = useSite();
  const items = ["alvoradas", "lavagem", "cultura"]
    .map((key) => content(key))
    .filter((item) => item?.body);
  if (!items.length) return null;
  const heading = content("tradition-heading");
  return (
    <section
      className="programme-context"
      aria-labelledby="programme-context-title"
    >
      <div className="programme-context-heading">
        <div>
          <Eyebrow>Tradições da Charanga</Eyebrow>
          <h2 id="programme-context-title">
            {editorialTitle("tradition-heading", heading?.title)}
          </h2>
        </div>
        <p>{heading?.body}</p>
      </div>
      <div className="programme-traditions">
        {items.map((item) => (
          <article key={item.key}>
            <h3>{item.title}</h3>
            <p className="preserve-lines">{item.body}</p>
          </article>
        ))}
      </div>
      <TextLink to="/historia">Conheça a ligação com Irará</TextLink>
    </section>
  );
}
