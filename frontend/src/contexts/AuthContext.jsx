import { createContext, useContext, useEffect, useState } from "react";
import { api, setCsrf } from "../services/api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  async function check() {
    setLoading(true);
    setError(null);
    try {
      const result = await api("/auth/session");
      setCsrf(result.csrfToken);
      setUser(result.user);
    } catch (error) {
      if (error.status !== 401) setError(error);
      setUser(null);
      setCsrf("");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void check();
  }, []);
  useEffect(() => {
    const handler = () => setUser(null);
    window.addEventListener("charanga:unauthorized", handler);
    return () => window.removeEventListener("charanga:unauthorized", handler);
  }, []);
  async function login(values) {
    const result = await api("/auth/login", { method: "POST", body: values });
    setCsrf(result.csrfToken);
    setUser(result.user);
  }
  async function logout() {
    await api("/auth/logout", { method: "POST" });
    setCsrf("");
    setUser(null);
  }
  return (
    <AuthContext.Provider
      value={{ user, loading, error, check, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
