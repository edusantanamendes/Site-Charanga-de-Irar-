import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Camera,
  Video,
  Tags,
  FileText,
  Mail,
  Share2,
  Settings,
  LogOut,
  ArrowUpRight,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Upload,
  Save,
  ChevronLeft,
  ChevronRight,
  Menu,
  Send,
  Eye,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useRequest, useSite } from "../../contexts/SiteContext";
import { api } from "../../services/api";
import { Dialog, EmptyState, ErrorState, Loading } from "../../components/UI";
import OfficialLogo from "../../components/OfficialLogo";
import { sections, settingFields } from "./fields";
import { date } from "../../components/Editorial";
import usePageMeta from "../../hooks/usePageMeta";

const navigation = [
  ["", "Visão geral", LayoutDashboard],
  ["events", "Eventos", CalendarDays],
  ["musicians", "Músicos", Users],
  ["photographs", "Fotografias", Camera],
  ["videos", "Vídeos", Video],
  ["categories", "Categorias", Tags],
  ["contents", "Conteúdo institucional", FileText],
  ["messages", "Mensagens", Mail],
  ["socials", "Redes sociais", Share2],
  ["settings", "Configurações", Settings],
];

export function AdminLayout() {
  const auth = useAuth();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  if (auth.loading)
    return (
      <div className="container section">
        <Loading label="Verificando acesso…" />
      </div>
    );
  if (auth.error)
    return (
      <div className="container section">
        <ErrorState error={auth.error} reload={auth.check} />
      </div>
    );
  if (!auth.user) return <Navigate to="/admin/login" replace />;
  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${open ? "admin-sidebar-open" : ""}`}>
        <Link to="/admin" className="admin-brand">
          <OfficialLogo decorative priority />
          <span>
            Charanga de Irará<small>PAINEL ADMINISTRATIVO</small>
          </span>
        </Link>
        <nav aria-label="Administração">
          {navigation.map(([path, label, Icon]) => (
            <NavLink end to={`/admin${path ? `/${path}` : ""}`} key={path}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <Link className="admin-site-link" to="/">
          Ver o site
          <ArrowUpRight size={17} />
        </Link>
      </aside>
      {open && (
        <button
          className="sidebar-scrim"
          onClick={() => setOpen(false)}
          aria-label="Fechar navegação"
        />
      )}
      <div className="admin-main">
        <header className="admin-header">
          <button
            className="icon-button admin-menu"
            aria-label="Alternar navegação"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <Menu />
          </button>
          <span>Administração do site</span>
          <div>
            <span className="admin-avatar">{auth.user.name.slice(0, 1)}</span>
            <span className="admin-user-name">{auth.user.name}</span>
            <button
              className="icon-button"
              title="Sair"
              aria-label="Sair da administração"
              onClick={() =>
                auth.logout().catch((error) => setError(error.message))
              }
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <main className="admin-content">
          {error && (
            <p role="alert" className="form-alert error">
              {error}
            </p>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function Login({ mode = "login" }) {
  const auth = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState({ busy: false, error: "", message: "" });
  const recovery = mode === "recover";
  const reset = mode === "reset";
  usePageMeta(
    reset
      ? "Redefinir senha"
      : recovery
        ? "Recuperar acesso"
        : "Acesso administrativo",
    "Área restrita da Charanga de Irará.",
  );
  useEffect(() => {
    setStatus({ busy: false, error: "", message: "" });
  }, [mode]);
  if (auth.user && mode === "login") return <Navigate to="/admin" replace />;
  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (reset && values.password !== values.confirmation) {
      setStatus({
        busy: false,
        error: "As senhas não coincidem.",
        message: "",
      });
      return;
    }
    setStatus({ busy: true, error: "", message: "" });
    try {
      if (mode === "login") {
        await auth.login(values);
        navigate("/admin", { replace: true });
      } else {
        const result = await api(`/auth/${reset ? "reset" : "recover"}`, {
          method: "POST",
          body: reset
            ? { token: params.get("token") || "", password: values.password }
            : values,
        });
        setStatus({ busy: false, error: "", message: result.message });
      }
    } catch (error) {
      setStatus({
        busy: false,
        error: error.fields?.[0]?.message || error.message,
        message: "",
      });
    }
  }
  return (
    <div className="login-page">
      <div className="login-art">
        <OfficialLogo priority />
        <h2>
          Charanga de Irará
          <br />
          <em>Administração do site</em>
        </h2>
        <span>CHARANGA DE IRARÁ · BAHIA</span>
      </div>
      <div className="login-panel">
        <Link to="/" className="text-link">
          ← Voltar ao site
        </Link>
        <form onSubmit={submit} className="login-form" key={mode}>
          <OfficialLogo className="login-mobile-logo" priority />
          <p className="eyebrow">ÁREA ADMINISTRATIVA</p>
          <h1>
            {reset
              ? "Uma nova senha."
              : recovery
                ? "Vamos recuperar o acesso."
                : "Bem-vindo de volta."}
          </h1>
          <p>
            {reset
              ? "Crie uma senha de pelo menos 12 caracteres."
              : recovery
                ? "Informe seu e-mail para receber um link de recuperação."
                : "Entre para atualizar o site e cuidar do acervo da Charanga."}
          </p>
          {!reset && (
            <label className="field">
              E-mail
              <input
                name="email"
                type="email"
                autoComplete="username"
                required
                maxLength="254"
              />
            </label>
          )}
          {!recovery && (
            <label className="field">
              {reset ? "Nova senha" : "Senha"}
              <input
                name="password"
                type="password"
                autoComplete={reset ? "new-password" : "current-password"}
                required
                minLength={reset ? 12 : 1}
                maxLength={reset ? 72 : 200}
              />
            </label>
          )}
          {reset && (
            <label className="field">
              Confirme a senha
              <input
                name="confirmation"
                type="password"
                autoComplete="new-password"
                required
                minLength="12"
                maxLength="72"
              />
            </label>
          )}
          {status.error && (
            <p className="form-alert error" role="alert">
              {status.error}
            </p>
          )}
          {status.message && (
            <p className="form-alert success" role="status">
              {status.message}
            </p>
          )}
          <button className="button" disabled={status.busy}>
            {status.busy
              ? "Aguarde…"
              : reset
                ? "Redefinir senha"
                : recovery
                  ? "Enviar link de recuperação"
                  : "Entrar no painel"}
            <ArrowUpRight size={18} />
          </button>
          <Link
            className="login-recovery"
            to={mode === "login" ? "/admin/recuperar" : "/admin/login"}
          >
            {mode === "login" ? "Esqueci minha senha" : "Voltar para o login"}
          </Link>
        </form>
        <p className="login-footer">
          Acesso exclusivo aos responsáveis pela Charanga.
        </p>
      </div>
    </div>
  );
}

export function Dashboard() {
  const state = useRequest("/admin/dashboard");
  const auth = useAuth();
  usePageMeta("Visão geral · Administração");
  if (state.loading) return <Loading />;
  if (state.error)
    return state.error.status === 401 ? (
      <Navigate to="/admin/login" />
    ) : (
      <ErrorState {...state} />
    );
  const data = state.data;
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">PAINEL DA CHARANGA</p>
          <h1>Olá, {auth.user.name.split(" ")[0]}.</h1>
          <p>A nossa história continua. Vamos cuidar dela?</p>
        </div>
        <Link className="button" to="/admin/events">
          Gerenciar eventos
          <ArrowUpRight size={17} />
        </Link>
      </div>
      <div className="dashboard-stats">
        {[
          ["events", "Eventos", CalendarDays],
          ["musicians", "Músicos", Users],
          ["photographs", "Fotografias", Camera],
          ["messages", "Mensagens", Mail],
        ].map(([key, label, Icon]) => (
          <Link to={`/admin/${key}`} key={key} className="stat-card">
            <Icon size={23} strokeWidth={1.5} />
            <strong>{data[key]}</strong>
            <span>{label}</span>
            {key === "messages" && data.unread > 0 && (
              <small>{data.unread} novas</small>
            )}
          </Link>
        ))}
      </div>
      {!data.mailConfigured && (
        <div className="admin-notice">
          <Mail size={22} />
          <div>
            <strong>Configure o envio de e-mails.</strong>
            <p>
              As mensagens de contato ficam salvas no painel. Configure o SMTP
              no servidor e o e-mail oficial em Configurações para receber os
              encaminhamentos e habilitar a recuperação de senha.
            </p>
          </div>
        </div>
      )}
      {data.pending > 0 && (
        <p className="admin-note">
          {data.pending} mensagem(ns) aguardando encaminhamento por e-mail.
        </p>
      )}
      <div className="dashboard-columns">
        <section className="admin-card">
          <div className="admin-card-heading">
            <h2>Próximas apresentações</h2>
            <Link to="/admin/events" className="text-link">
              Ver todas
              <ArrowUpRight size={16} />
            </Link>
          </div>
          {data.upcoming.length ? (
            data.upcoming.map((event) => (
              <div className="dashboard-event" key={event.id}>
                <span>
                  {date(event.startsAt, { day: "2-digit", month: "short" })}
                </span>
                <div>
                  <strong>{event.title}</strong>
                  <p>
                    {event.location} ·{" "}
                    {event.published ? "Publicado" : "Rascunho"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              compact
              icon={CalendarDays}
              title="A agenda está pronta para começar."
            >
              Cadastre uma apresentação na seção Eventos.
            </EmptyState>
          )}
        </section>
        <section className="admin-card">
          <h2>Por onde começar</h2>
          <ol className="onboarding-list">
            <li>
              <span>01</span>
              <div>
                <Link to="/admin/settings">
                  Adicione os contatos oficiais
                  <ArrowUpRight size={15} />
                </Link>
                <p>E-mail, WhatsApp e logomarca.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <Link to="/admin/contents">
                  Revise o conteúdo institucional
                  <ArrowUpRight size={15} />
                </Link>
                <p>Textos e marcos historicamente confirmados.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <Link to="/admin/photographs">
                  Comece o acervo de fotografias
                  <ArrowUpRight size={15} />
                </Link>
                <p>Imagens oficiais, descrições e créditos.</p>
              </div>
            </li>
          </ol>
        </section>
      </div>
    </>
  );
}

function ImageUpload({ field, value, onChange }) {
  const [state, setState] = useState({ busy: false, error: "" });
  async function upload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setState({ busy: false, error: "A imagem deve ter no máximo 8 MB." });
      return;
    }
    setState({ busy: true, error: "" });
    try {
      const form = new FormData();
      form.append("image", file);
      const result = await api("/admin/upload", { method: "POST", body: form });
      onChange(result.url);
      setState({ busy: false, error: "" });
    } catch (error) {
      setState({ busy: false, error: error.message });
    }
    event.target.value = "";
  }
  return (
    <div className="field full">
      <span>{field.label}</span>
      <div className="image-upload">
        {value && <img src={value} alt="Prévia da imagem selecionada" />}
        <label
          className={`button button-secondary upload-label ${state.busy ? "disabled" : ""}`}
        >
          <Upload size={17} />
          {state.busy
            ? "Processando imagem…"
            : value
              ? "Trocar imagem"
              : "Enviar imagem"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={upload}
            disabled={state.busy}
            aria-label={field.label}
          />
        </label>
        {value && (
          <button
            className="text-button"
            type="button"
            onClick={() => onChange("")}
          >
            Remover seleção
          </button>
        )}
        <small>
          JPEG, PNG ou WebP · até 8 MB. A imagem será otimizada e os metadados
          removidos.
        </small>
      </div>
      {state.error && (
        <span className="field-error" role="alert">
          {state.error}
        </span>
      )}
    </div>
  );
}
function EditorForm({
  fields,
  initial,
  onSave,
  onCancel,
  busy,
  errors = [],
  categories = [],
  events = [],
}) {
  const [values, setValues] = useState(() =>
    Object.fromEntries(
      fields.map((field) => {
        let value =
          initial?.[field.name] ??
          field.default ??
          (field.type === "checkbox" ? false : "");
        if (field.type === "datetime-local" && value)
          value = new Date(new Date(value).getTime() - 3 * 3600000)
            .toISOString()
            .slice(0, 16);
        return [field.name, value];
      }),
    ),
  );
  function change(name, value) {
    setValues((old) => ({ ...old, [name]: value }));
  }
  function submit(event) {
    event.preventDefault();
    const output = { ...values };
    for (const field of fields) {
      if (field.type === "number")
        output[field.name] =
          values[field.name] === "" ? null : Number(values[field.name]);
      if (field.type === "datetime-local")
        output[field.name] = values[field.name]
          ? `${values[field.name]}:00-03:00`
          : null;
    }
    onSave(output);
  }
  return (
    <form onSubmit={submit}>
      <div className="form-grid">
        {fields.map((field) => {
          const error = errors.find(
            (error) => error.field === field.name,
          )?.message;
          if (field.type === "image")
            return (
              <ImageUpload
                key={field.name}
                field={field}
                value={values[field.name]}
                onChange={(value) => change(field.name, value)}
              />
            );
          const props = {
            name: field.name,
            required: field.required,
            value: values[field.name],
            onChange: (event) => change(field.name, event.target.value),
            min: field.min,
            max: field.max,
            minLength: field.minLength,
            maxLength: field.maxLength,
            "aria-invalid": !!error,
            "aria-describedby": `${field.name}-help`,
          };
          return (
            <label
              className={`${field.type === "checkbox" ? "checkbox-field full" : `field ${["textarea", "url"].includes(field.type) ? "full" : ""}`}`}
              key={field.name}
            >
              {field.type === "checkbox" ? (
                <>
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={values[field.name]}
                    onChange={(event) =>
                      change(field.name, event.target.checked)
                    }
                  />
                  <span>{field.label}</span>
                </>
              ) : (
                <>
                  {field.label}
                  {field.required && " *"}
                  {field.type === "textarea" ? (
                    <textarea {...props} rows="5" />
                  ) : ["select", "category", "event"].includes(field.type) ? (
                    <select {...props}>
                      {field.type !== "select" && (
                        <option value="">Nenhum(a)</option>
                      )}
                      {(field.type === "category"
                        ? categories.map((item) => [item.id, item.name])
                        : field.type === "event"
                          ? events.map((item) => [item.id, item.title])
                          : field.options
                      ).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input {...props} type={field.type} />
                  )}
                  <small id={`${field.name}-help`}>{error || field.help}</small>
                </>
              )}
            </label>
          );
        })}
      </div>
      <div className="editor-actions">
        <button className="button" disabled={busy} type="submit">
          <Save size={17} />
          {busy ? "Salvando…" : "Salvar alterações"}
        </button>
        {onCancel && (
          <button
            type="button"
            className="button button-secondary"
            disabled={busy}
            onClick={onCancel}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export function ResourcePage() {
  const { resource } = useParams();
  const config = sections[resource];
  const [page, setPage] = useState(1);
  const state = useRequest(`/admin/${resource}?page=${page}`);
  const categories = useRequest("/admin/categories?limit=100");
  const events = useRequest("/admin/events?limit=100");
  const { reload: reloadSite } = useSite();
  const [editor, setEditor] = useState(null);
  const [remove, setRemove] = useState(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState({
    message: "",
    error: "",
    fields: [],
  });
  usePageMeta(`${config?.title || "Seção"} · Administração`);
  useEffect(() => {
    setPage(1);
    setEditor(null);
    setRemove(null);
    setFeedback({ message: "", error: "", fields: [] });
  }, [resource]);
  if (!config) return <Navigate to="/admin" replace />;
  if (state.error?.status === 401)
    return <Navigate to="/admin/login" replace />;
  async function save(values) {
    setBusy(true);
    setFeedback({ message: "", error: "", fields: [] });
    try {
      await api(`/admin/${resource}${editor?.id ? `/${editor.id}` : ""}`, {
        method: editor?.id ? "PUT" : "POST",
        body: values,
      });
      setEditor(null);
      setFeedback({
        message: "Registro salvo com sucesso.",
        error: "",
        fields: [],
      });
      state.reload();
      reloadSite();
    } catch (error) {
      setFeedback({
        message: "",
        error: error.message,
        fields: error.fields || [],
      });
    } finally {
      setBusy(false);
    }
  }
  async function confirmRemove() {
    setBusy(true);
    try {
      await api(`/admin/${resource}/${remove.id}`, { method: "DELETE" });
      setRemove(null);
      setFeedback({ message: "Registro excluído.", error: "", fields: [] });
      if (state.data?.items.length === 1 && page > 1) setPage(page - 1);
      else state.reload();
      reloadSite();
    } catch (error) {
      setFeedback({ message: "", error: error.message, fields: [] });
    } finally {
      setBusy(false);
    }
  }
  async function retry(item) {
    setBusy(true);
    try {
      await api(`/admin/messages/${item.id}/retry`, { method: "POST" });
      setFeedback({
        message: "Mensagem encaminhada por e-mail.",
        error: "",
        fields: [],
      });
      state.reload();
    } catch (error) {
      setFeedback({ message: "", error: error.message, fields: [] });
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">GESTÃO DO SITE</p>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
        </div>
        <button
          className="button"
          onClick={() => {
            setFeedback({ message: "", error: "", fields: [] });
            setEditor({});
          }}
        >
          <Plus size={17} />
          Adicionar {config.singular}
        </button>
      </div>
      {feedback.message && (
        <p className="form-alert success" role="status">
          <Check size={18} />
          {feedback.message}
        </p>
      )}
      {feedback.error && !editor && (
        <p className="form-alert error" role="alert">
          {feedback.error}
        </p>
      )}
      <section className="admin-card resource-list">
        {state.loading ? (
          <Loading />
        ) : state.error ? (
          <ErrorState {...state} />
        ) : state.data.items.length ? (
          <>
            <div
              className="resource-table"
              role="table"
              aria-label={config.title}
            >
              <div className="resource-row resource-table-head" role="row">
                <span role="columnheader">Registro</span>
                <span role="columnheader">Situação</span>
                <span role="columnheader">Ações</span>
              </div>
              {state.data.items.map((item) => (
                <div className="resource-row" role="row" key={item.id}>
                  <div role="cell" className="resource-name">
                    <strong>{item.title || item.name || item.label}</strong>
                    <span>
                      {resource === "events"
                        ? `${date(item.startsAt, { dateStyle: "short", timeStyle: "short" })} · ${item.location}`
                        : resource === "messages"
                          ? `${item.subject} · ${item.email}`
                          : resource === "musicians"
                            ? item.instrument
                            : item.key || item.credit || item.url || ""}
                    </span>
                  </div>
                  <div role="cell">
                    {item.published !== undefined ? (
                      <span
                        className={`badge ${item.published ? "badge-green" : ""}`}
                      >
                        {item.published ? "Publicado" : "Rascunho"}
                      </span>
                    ) : resource === "messages" ? (
                      <>
                        <span className="badge">
                          {
                            {
                              NEW: "Nova",
                              READ: "Lida",
                              ARCHIVED: "Arquivada",
                            }[item.status]
                          }
                        </span>
                        <small className="delivery-status">
                          {item.deliveryStatus === "SENT"
                            ? "E-mail encaminhado"
                            : "E-mail pendente"}
                        </small>
                      </>
                    ) : (
                      <span className="badge">Disponível</span>
                    )}
                  </div>
                  <div className="resource-actions" role="cell">
                    {resource === "messages" &&
                      item.deliveryStatus !== "SENT" && (
                        <button
                          className="icon-button"
                          disabled={busy}
                          title="Encaminhar por e-mail"
                          aria-label={`Encaminhar mensagem de ${item.name}`}
                          onClick={() => retry(item)}
                        >
                          <Send size={17} />
                        </button>
                      )}
                    <button
                      className="icon-button"
                      aria-label={`Editar ${item.title || item.name || item.label}`}
                      title="Editar registro"
                      onClick={() => {
                        setFeedback({ message: "", error: "", fields: [] });
                        setEditor(item);
                      }}
                    >
                      <Pencil size={17} />
                    </button>
                    <button
                      className="icon-button delete-button"
                      aria-label={`Excluir ${item.title || item.name || item.label}`}
                      title="Excluir registro"
                      onClick={() => setRemove(item)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="pagination">
              <span>
                {state.data.total} registro(s) · página {page} de{" "}
                {Math.max(1, Math.ceil(state.data.total / state.data.pageSize))}
              </span>
              <div>
                <button
                  className="icon-button"
                  aria-label="Página anterior"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  className="icon-button"
                  aria-label="Próxima página"
                  disabled={page * state.data.pageSize >= state.data.total}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            compact
            title={`Nenhum registro de ${config.title.toLowerCase()} ainda.`}
          >
            Use o botão acima para adicionar o primeiro registro.
          </EmptyState>
        )}
      </section>
      {editor && (
        <Dialog
          title={`${editor.id ? "Editar" : "Adicionar"} ${config.singular}`}
          onClose={() => {
            if (!busy) setEditor(null);
          }}
          className="editor-dialog"
        >
          <p className="eyebrow">{config.title}</p>
          <h2>
            {editor.id ? "Editar" : "Adicionar"} {config.singular}
          </h2>
          <p className="editor-intro">{config.description}</p>
          {feedback.error && (
            <p className="form-alert error" role="alert">
              {feedback.error}
            </p>
          )}
          <EditorForm
            key={editor.id || "new"}
            fields={config.fields}
            initial={editor}
            onSave={save}
            onCancel={() => setEditor(null)}
            busy={busy}
            errors={feedback.fields}
            categories={categories.data?.items || []}
            events={events.data?.items || []}
          />
        </Dialog>
      )}
      {remove && (
        <Dialog
          title="Confirmar exclusão"
          onClose={() => {
            if (!busy) setRemove(null);
          }}
          className="confirm-dialog"
        >
          <span className="confirm-icon">
            <Trash2 size={27} />
          </span>
          <h2>Excluir este registro?</h2>
          <p>
            “{remove.title || remove.name || remove.label}” será excluído
            permanentemente. Esta ação não pode ser desfeita.
          </p>
          {resource === "categories" && (
            <p>
              As fotografias e os vídeos serão preservados, sem esta categoria.
            </p>
          )}
          {feedback.error && (
            <p className="form-alert error" role="alert">
              {feedback.error}
            </p>
          )}
          <div className="editor-actions">
            <button
              className="button danger"
              disabled={busy}
              onClick={confirmRemove}
            >
              {busy ? "Excluindo…" : "Sim, excluir"}
            </button>
            <button
              className="button button-secondary"
              disabled={busy}
              onClick={() => setRemove(null)}
            >
              Cancelar
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}

export function SettingsPage() {
  const state = useRequest("/admin/settings");
  const site = useSite();
  const [feedback, setFeedback] = useState({
    busy: false,
    message: "",
    error: "",
    fields: [],
  });
  usePageMeta("Configurações · Administração");
  async function save(values) {
    setFeedback({ busy: true, message: "", error: "", fields: [] });
    try {
      await api("/admin/settings", { method: "PUT", body: values });
      setFeedback({
        busy: false,
        message: "Configurações atualizadas.",
        error: "",
        fields: [],
      });
      site.reload();
    } catch (error) {
      setFeedback({
        busy: false,
        message: "",
        error: error.message,
        fields: error.fields || [],
      });
    }
  }
  if (state.error?.status === 401) return <Navigate to="/admin/login" />;
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">IDENTIDADE E CONTATOS</p>
          <h1>Configurações</h1>
          <p>Os contatos só aparecem no site depois que você os cadastrar.</p>
        </div>
      </div>
      <section className="admin-card settings-card">
        {state.loading ? (
          <Loading />
        ) : state.error ? (
          <ErrorState {...state} />
        ) : (
          <>
            {feedback.error && (
              <p role="alert" className="form-alert error">
                {feedback.error}
              </p>
            )}
            {feedback.message && (
              <p role="status" className="form-alert success">
                {feedback.message}
              </p>
            )}
            <EditorForm
              fields={settingFields}
              initial={state.data}
              onSave={save}
              busy={feedback.busy}
              errors={feedback.fields}
            />
          </>
        )}
      </section>
      <p className="admin-note">
        Credenciais de SMTP e de banco de dados são configuradas no ambiente do
        servidor. Elas não são expostas neste painel.
      </p>
    </>
  );
}
