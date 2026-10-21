let csrfToken = "";
export const setCsrf = (value) => {
  csrfToken = value || "";
};
export async function api(path, options = {}) {
  const isForm = options.body instanceof FormData;
  const response = await fetch(`/api${path}`, {
    ...options,
    credentials: "same-origin",
    headers: {
      ...(!isForm && options.body
        ? { "Content-Type": "application/json" }
        : {}),
      ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
      ...options.headers,
    },
    body: options.body
      ? isForm
        ? options.body
        : JSON.stringify(options.body)
      : undefined,
  });
  if (response.status === 204) return null;
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      setCsrf("");
      window.dispatchEvent(new Event("charanga:unauthorized"));
    }
    const error = new Error(
      result.error || "Não foi possível conectar. Tente novamente.",
    );
    error.status = response.status;
    error.fields = result.fields;
    throw error;
  }
  return result;
}
