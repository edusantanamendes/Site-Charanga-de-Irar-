import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Clock3,
  Send,
  Mail,
  MessageCircle,
  Check,
} from "lucide-react";
import { useSite, useRequest } from "../contexts/SiteContext";
import {
  ButtonLink,
  TextLink,
  Eyebrow,
  PageHeading,
  EmptyState,
  Loading,
  ErrorState,
  Lightbox,
} from "../components/UI";
import {
  date,
  eventStatus,
  EventCard,
  MediaCard,
} from "../components/Editorial";
import { ArchiveNotice } from "../components/MusicalIdentity";
import {
  ArchiveContext,
  MusicianIntroduction,
  TraditionContext,
} from "../components/CulturalContext";
import { editorialTitle } from "../config/editorial";
import { api } from "../services/api";
import usePageMeta from "../hooks/usePageMeta";
export { Home } from "./Home";
export { History } from "./History";

function ManagedHeading({ contentKey, label, fallback }) {
  const item = useSite().content(contentKey);
  return (
    <PageHeading
      label={label}
      title={editorialTitle(contentKey, item?.title, fallback)}
      variant={contentKey.replace("page-", "")}
    >
      {item?.body}
    </PageHeading>
  );
}
export function Gallery() {
  const { categories } = useSite();
  const state = useRequest("/public/gallery");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [index, setIndex] = useState(null);
  usePageMeta("Galeria", "Fotografias e vídeos oficiais da Charanga de Irará.");
  const allItems = state.data
    ? [
        ...state.data.photographs.map((item) => ({ ...item, type: "photo" })),
        ...state.data.videos.map((item) => ({ ...item, type: "video" })),
      ]
    : [];
  const available = allItems.filter(
    (item) => category === "all" || item.categoryId === category,
  );
  const items = available.filter(
    (item) => type === "all" || item.type === type,
  );
  return (
    <>
      <ManagedHeading
        contentKey="page-gallery"
        label="Nosso acervo"
        fallback={"Cada registro,\numa história."}
      />
      <section className="section">
        <div className="container">
          <div className="gallery-toolbar">
            <div className="filter-tabs" aria-label="Tipo de registro">
              {[
                ["all", "Todos os registros"],
                ["photo", "Fotografias"],
                ["video", "Vídeos"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  aria-pressed={type === value}
                  onClick={() => setType(value)}
                >
                  {label}
                  {state.data && (
                    <span className="filter-count">
                      {value === "all"
                        ? available.length
                        : available.filter((item) => item.type === value)
                            .length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <label className="category-select">
              Categoria
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="all">Todas as categorias</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {state.loading ? (
            <Loading />
          ) : state.error ? (
            <ErrorState {...state} />
          ) : items.length ? (
            <>
              <p className="result-count" aria-live="polite">
                {items.length} {items.length === 1 ? "registro" : "registros"}
              </p>
              <div className="media-grid gallery-full">
                {items.map((item, position) => (
                  <MediaCard
                    key={`${item.type}-${item.id}`}
                    item={item}
                    onClick={() => setIndex(position)}
                  />
                ))}
              </div>
            </>
          ) : category === "all" && type === "all" ? (
            <div className="gallery-preparation">
              <ArchiveNotice>
                <Eyebrow>Acervo em preparação</Eyebrow>
                <h2>Apresentações, cortejos e memória.</h2>
                <p>
                  Este espaço reunirá fotografias e vídeos oficiais da Charanga,
                  com descrições e créditos. Os registros aparecerão aqui assim
                  que forem publicados.
                </p>
                <TextLink to="/historia">Leia a história da Charanga</TextLink>
              </ArchiveNotice>
              <ArchiveContext />
            </div>
          ) : (
            <div className="gallery-no-results">
              <EmptyState
                title={
                  category !== "all" || type !== "all"
                    ? "Nenhum registro nesta seleção."
                    : "Acervo em preparação"
                }
              >
                O acervo receberá fotografias e vídeos oficiais da Charanga.
                Novos registros aparecerão aqui assim que forem publicados.
              </EmptyState>
              <button
                className="text-button"
                onClick={() => {
                  setCategory("all");
                  setType("all");
                }}
              >
                Limpar filtros
              </button>
            </div>
          )}
          {index !== null && (
            <Lightbox
              items={items}
              index={index}
              setIndex={setIndex}
              onClose={() => setIndex(null)}
            />
          )}
        </div>
      </section>
    </>
  );
}

export function Events() {
  const state = useRequest("/public/events");
  const [tab, setTab] = useState("upcoming");
  usePageMeta(
    "Agenda",
    "Próximas apresentações e eventos realizados pela Charanga de Irará.",
  );
  const items = (state.data || [])
    .filter((event) =>
      tab === "upcoming"
        ? new Date(event.endsAt || event.startsAt) >= new Date()
        : new Date(event.endsAt || event.startsAt) < new Date(),
    )
    .sort((a, b) =>
      tab === "past"
        ? new Date(b.startsAt) - new Date(a.startsAt)
        : new Date(a.startsAt) - new Date(b.startsAt),
    );
  return (
    <>
      <ManagedHeading
        contentKey="page-events"
        label="Agenda da Charanga"
        fallback={"O nosso próximo\nencontro."}
      />
      <section className="section">
        <div className="container">
          <div className="filter-tabs event-tabs">
            {[
              ["upcoming", "Próximos eventos"],
              ["past", "Eventos realizados"],
            ].map(([value, label]) => (
              <button
                key={value}
                aria-pressed={tab === value}
                onClick={() => setTab(value)}
              >
                {label}
              </button>
            ))}
          </div>
          {state.loading ? (
            <Loading />
          ) : state.error ? (
            <ErrorState {...state} />
          ) : items.length ? (
            <div className="event-list">
              {items.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="events-preparation">
              <EmptyState
                title={
                  tab === "upcoming"
                    ? "Nenhuma apresentação publicada."
                    : "Nenhum evento realizado publicado."
                }
              >
                {tab === "upcoming"
                  ? "Ainda não há apresentações publicadas na agenda. Volte em breve ou entre em contato para saber mais."
                  : "Os registros dos eventos realizados serão publicados neste espaço."}
              </EmptyState>
              <TextLink to="/contato">
                Consulte apresentações e parcerias
              </TextLink>
            </div>
          )}
          {!state.loading && !state.error && state.data.length === 0 && (
            <TraditionContext />
          )}
        </div>
      </section>
    </>
  );
}
export function EventDetail() {
  const { slug } = useParams();
  const state = useRequest(`/public/events/${encodeURIComponent(slug)}`);
  const event = state.data;
  usePageMeta(event?.title || "Evento", event?.description.slice(0, 160));
  if (state.loading)
    return (
      <div className="container section">
        <Loading />
      </div>
    );
  if (state.error?.status === 404) return <NotFound />;
  if (state.error)
    return (
      <div className="container section">
        <ErrorState {...state} />
      </div>
    );
  return (
    <>
      <PageHeading label="Agenda da Charanga" title={event.title} />
      <section className="section">
        <div className="container event-detail">
          <Link className="text-link" to="/eventos">
            ← Voltar à agenda
          </Link>
          {event.imageUrl && (
            <img
              className="event-cover"
              src={event.imageUrl}
              alt={event.title}
            />
          )}
          <span className={`status status-${event.status.toLowerCase()}`}>
            {eventStatus[event.status]}
          </span>
          <div className="event-facts">
            <p>
              <CalendarDays />
              {date(event.startsAt, { dateStyle: "long" })}
            </p>
            <p>
              <Clock3 />
              {date(event.startsAt, { hour: "2-digit", minute: "2-digit" })} ·
              horário de Brasília
            </p>
            <p>
              <MapPin />
              {event.location}
            </p>
          </div>
          <p className="event-description preserve-lines">
            {event.description}
          </p>
          <ButtonLink to="/contato">Fale com a Charanga</ButtonLink>
        </div>
      </section>
    </>
  );
}
export function Musicians() {
  const state = useRequest("/public/musicians");
  usePageMeta(
    "Nossos músicos",
    "Os músicos que dão vida à tradição da Charanga de Irará.",
  );
  return (
    <>
      <ManagedHeading
        contentKey="page-musicians"
        label="Quem faz a música acontecer"
        fallback={"Muitas histórias.\nUma só harmonia."}
      />
      <section className="section">
        <div className="container">
          {state.loading ? (
            <Loading />
          ) : state.error ? (
            <ErrorState {...state} />
          ) : state.data.length ? (
            <div className="musician-grid">
              {state.data.map((item) => (
                <article className="musician-card" key={item.id}>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} loading="lazy" />
                  ) : (
                    <div className="musician-monogram" aria-hidden="true">
                      <span>
                        {item.name
                          .split(/\s+/)
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((name) => name[0])
                          .join("")}
                      </span>
                    </div>
                  )}
                  <div className="musician-info">
                    <span className="musician-instrument">
                      {item.instrument}
                    </span>
                    <h2>{item.name}</h2>
                    {item.role && <strong>{item.role}</strong>}
                    <p className="preserve-lines">{item.bio}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="roster-preparation">
              <MusicianIntroduction />
              <div className="roster-notice">
                <Eyebrow>Os integrantes</Eyebrow>
                <h2>Quem faz a Charanga.</h2>
                <p>
                  Os perfis oficiais dos músicos estão em preparação. Aqui serão
                  apresentados os integrantes, seus instrumentos e suas
                  histórias.
                </p>
                <TextLink to="/contato">Fale com a equipe</TextLink>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export function Contact() {
  const { settings, socials, content } = useSite();
  const [status, setStatus] = useState({
    sending: false,
    success: "",
    error: "",
    fields: [],
  });
  usePageMeta(
    "Contato",
    "Fale com a Charanga de Irará sobre apresentações, parcerias e eventos.",
  );
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form));
    values.consent = values.consent === "on";
    setStatus({ sending: true, success: "", error: "", fields: [] });
    try {
      const result = await api("/public/contact", {
        method: "POST",
        body: values,
      });
      form.reset();
      setStatus({
        sending: false,
        success: result.message,
        error: "",
        fields: [],
      });
    } catch (error) {
      setStatus({
        sending: false,
        success: "",
        error: error.message,
        fields: error.fields || [],
      });
    }
  }
  return (
    <>
      <ManagedHeading
        contentKey="page-contact"
        label="Vamos conversar"
        fallback={"Boas histórias começam\ncom um encontro."}
      />
      <section className="section">
        <div className="container contact-layout">
          <form onSubmit={submit} className="contact-form">
            <h2>Deixe a sua mensagem</h2>
            <p className="form-intro">
              Os campos marcados com * são obrigatórios.
            </p>
            <div className="form-grid">
              <label className="field full">
                Nome completo *
                <input
                  name="name"
                  autoComplete="name"
                  required
                  minLength="2"
                  maxLength="160"
                  placeholder="Como podemos chamar você?"
                />
              </label>
              <label className="field">
                E-mail *
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength="254"
                  placeholder="voce@exemplo.com"
                />
              </label>
              <label className="field">
                Telefone
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength="40"
                  placeholder="DDD + número"
                />
              </label>
              <label className="field full">
                Assunto *
                <select name="subject" required defaultValue="">
                  <option value="" disabled>
                    Selecione o motivo do contato
                  </option>
                  {[
                    "Contratação para apresentações",
                    "Informações sobre eventos",
                    "Parcerias",
                    "Imprensa",
                    "Outros assuntos",
                  ].map((subject) => (
                    <option key={subject}>{subject}</option>
                  ))}
                </select>
              </label>
              <label className="field full">
                Mensagem *
                <textarea
                  name="body"
                  required
                  minLength="20"
                  maxLength="6000"
                  rows="5"
                  placeholder="Conte um pouco sobre o seu evento ou como podemos ajudar…"
                />
              </label>
              <div className="honeypot" aria-hidden="true">
                <label>
                  Website
                  <input name="website" tabIndex="-1" autoComplete="off" />
                </label>
              </div>
              <label className="checkbox-field full">
                <input type="checkbox" name="consent" required />
                <span>
                  Autorizo o uso dos meus dados para responder a esta mensagem,
                  conforme a{" "}
                  <Link to="/privacidade">política de privacidade</Link>. *
                </span>
              </label>
            </div>
            {status.error && (
              <div className="form-alert error" role="alert">
                {status.error}
                {status.fields.map((item) => (
                  <p key={item.field}>{item.message}</p>
                ))}
              </div>
            )}
            {status.success && (
              <div className="form-alert success" role="status">
                <Check size={20} />
                {status.success}
              </div>
            )}
            <button className="button" type="submit" disabled={status.sending}>
              {status.sending ? "Enviando mensagem…" : "Enviar mensagem"}
              <Send size={16} />
            </button>
            <p className="form-footnote">
              Seus dados serão usados apenas para atender ao seu contato.
            </p>
          </form>
          <aside className="contact-aside">
            <Eyebrow>FALE COM A CHARANGA</Eyebrow>
            <h2>
              {editorialTitle("contact-aside", content("contact-aside")?.title)}
            </h2>
            <p>{content("contact-aside")?.body}</p>
            <div className="contact-info">
              <MapPin size={21} />
              <div>
                <strong>Nossa terra</strong>
                <span>{settings?.locationLabel || "Irará, Bahia"}</span>
              </div>
            </div>
            {settings?.officialEmail && (
              <a
                className="contact-info"
                href={`mailto:${settings.officialEmail}`}
              >
                <Mail size={21} />
                <div>
                  <strong>E-mail</strong>
                  <span>{settings.officialEmail}</span>
                </div>
                <ArrowUpRight size={16} />
              </a>
            )}
            {settings?.whatsapp && (
              <a
                className="button button-secondary"
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={18} />
                Conversar pelo WhatsApp
                <ArrowUpRight size={16} />
              </a>
            )}
            {socials.length > 0 && (
              <div className="contact-socials">
                <span>ENCONTRE A CHARANGA</span>
                {socials.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                    <ArrowUpRight size={15} />
                  </a>
                ))}
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
export function Privacy() {
  const { settings } = useSite();
  usePageMeta(
    "Privacidade",
    "Como os dados de contato são tratados no site da Charanga de Irará.",
  );
  return (
    <>
      <PageHeading label="Seus dados" title="Política de privacidade" />
      <section className="section">
        <article className="container prose">
          <h2>Dados enviados por você</h2>
          <p>
            O formulário coleta nome, e-mail, telefone opcional, assunto e
            mensagem, com sua autorização, para que a equipe da Charanga de
            Irará possa responder à solicitação.
          </p>
          <h2>Uso e armazenamento</h2>
          <p>
            As mensagens ficam armazenadas no banco de dados do site, com acesso
            restrito à administração. Quando configurado, o serviço de e-mail
            também encaminha a mensagem ao endereço oficial. Os dados não são
            vendidos ou usados para publicidade.
          </p>
          <h2>Seus direitos</h2>
          <p>
            Você pode solicitar acesso, correção ou exclusão dos seus dados pelo{" "}
            <Link to="/contato">formulário de contato</Link>
            {settings?.officialEmail && (
              <>
                {" "}
                ou pelo e-mail{" "}
                <a href={`mailto:${settings.officialEmail}`}>
                  {settings.officialEmail}
                </a>
              </>
            )}
            . As mensagens devem ser mantidas apenas pelo tempo necessário para
            atender ao contato e às obrigações aplicáveis.
          </p>
          <h2>Cookies e serviços externos</h2>
          <p>
            O site utiliza um cookie estritamente necessário para a sessão de
            administradores. Não há rastreamento publicitário. Vídeos do YouTube
            ou Vimeo só são carregados quando você escolhe abri-los; esses
            serviços possuem suas próprias políticas de privacidade. Links de
            redes sociais e WhatsApp direcionam para serviços externos.
          </p>
          <h2>Proteção dos dados</h2>
          <p>
            O acesso administrativo é autenticado. A aplicação aplica validação
            de dados, limites de solicitações e restrições de acesso às
            mensagens recebidas.
          </p>
        </article>
      </section>
    </>
  );
}
export function NotFound() {
  usePageMeta(
    "Página não encontrada",
    "A página que você procura não foi encontrada.",
  );
  return (
    <section className="not-found container">
      <span className="not-found-number">404</span>
      <Eyebrow>Erro 404</Eyebrow>
      <h1>Página não encontrada</h1>
      <p>A página que você procura não foi encontrada.</p>
      <ButtonLink to="/">Voltar ao início</ButtonLink>
    </section>
  );
}
