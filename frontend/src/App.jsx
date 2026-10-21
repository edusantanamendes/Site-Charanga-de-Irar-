import { lazy, Suspense, useEffect, Component } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { SiteProvider } from "./contexts/SiteContext";
import { AuthProvider } from "./contexts/AuthContext";
import PublicLayout from "./layouts/PublicLayout";
import {
  Home,
  History,
  Gallery,
  Events,
  EventDetail,
  Musicians,
  Contact,
  Privacy,
  NotFound,
} from "./pages/PublicPages";
import { Loading } from "./components/UI";

const adminComponent = (name) =>
  lazy(() =>
    import("./pages/admin/Admin").then((module) => ({ default: module[name] })),
  );
const AdminLayout = adminComponent("AdminLayout");
const Dashboard = adminComponent("Dashboard");
const Login = adminComponent("Login");
const ResourcePage = adminComponent("ResourcePage");
const SettingsPage = adminComponent("SettingsPage");
function AdminRoot() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.append(meta);
    return () => meta.remove();
  }, []);
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
class ErrorBoundary extends Component {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="container section">
        <h1>Não foi possível abrir esta página.</h1>
        <p>Recarregue para tentar novamente.</p>
        <button className="button" onClick={() => window.location.reload()}>
          Recarregar página
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <SiteProvider>
          <Suspense
            fallback={
              <div className="container section">
                <Loading />
              </div>
            }
          >
            <Routes>
              <Route element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="historia" element={<History />} />
                <Route path="galeria" element={<Gallery />} />
                <Route path="eventos" element={<Events />} />
                <Route path="eventos/:slug" element={<EventDetail />} />
                <Route path="musicos" element={<Musicians />} />
                <Route path="contato" element={<Contact />} />
                <Route path="privacidade" element={<Privacy />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="admin" element={<AdminRoot />}>
                <Route path="login" element={<Login />} />
                <Route path="recuperar" element={<Login mode="recover" />} />
                <Route path="redefinir" element={<Login mode="reset" />} />
                <Route element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route
                    path=":resource"
                    element={<ResourcePage key={window.location.pathname} />}
                  />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </SiteProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
