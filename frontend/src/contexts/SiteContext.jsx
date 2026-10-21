import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { api } from "../services/api";

const SiteContext = createContext(null);
export function useRequest(path) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });
    api(path, { signal: controller.signal })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (error.name !== "AbortError")
          setState({ data: null, loading: false, error });
      });
    return () => controller.abort();
  }, [path, version]);
  const reload = useCallback(() => setVersion((value) => value + 1), []);
  return { ...state, reload };
}
export function SiteProvider({ children }) {
  const state = useRequest("/public/site");
  const content = (key) =>
    state.data?.contents.find((item) => item.key === key);
  return (
    <SiteContext.Provider
      value={{
        ...state,
        settings: state.data?.settings,
        contents: state.data?.contents || [],
        socials: state.data?.socials || [],
        categories: state.data?.categories || [],
        content,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}
export const useSite = () => useContext(SiteContext);
