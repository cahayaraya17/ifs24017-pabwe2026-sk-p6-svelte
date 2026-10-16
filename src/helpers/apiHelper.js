const DEFAULT_BASE_URL = "https://open-api.delcom.org/api/v1";

export function getBaseUrl() {
  return typeof DELCOM_BASEURL !== "undefined"
    ? DELCOM_BASEURL
    : DEFAULT_BASE_URL;
}

export function getAccessToken() {
  if (typeof window === "undefined" || !window.localStorage) return null;
  return localStorage.getItem("accessToken");
}

export function putAccessToken(token) {
  if (typeof window === "undefined" || !window.localStorage) return;
  if (!token) {
    localStorage.removeItem("accessToken");
  } else {
    localStorage.setItem("accessToken", token);
  }
}

export async function fetchData(endpoint, options = {}) {
  const cleanBase = getBaseUrl().replace(/\/+$/, "");
  let cleanEndpoint = endpoint || "";
  if (cleanEndpoint.startsWith("/")) {
    cleanEndpoint = cleanEndpoint.slice(1);
  }
  cleanEndpoint = cleanEndpoint.replace(/\/+$/, "");

  const url = cleanEndpoint.startsWith("http")
    ? cleanEndpoint
    : `${cleanBase}/${cleanEndpoint}`;

  const headers = { ...options.headers };
  const token = getAccessToken();

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData) && !headers["Content-Type"] && options.method && options.method !== "GET") {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    ...options,
    headers,
  };

  return await fetch(url, config);
}

async function request(endpoint, options = {}) {
  const response = await fetchData(endpoint, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const apiHelper = {
  fetchData,
  get: (endpoint, options) => request(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options) =>
    request(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: (endpoint, body, options) =>
    request(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: (endpoint, options) =>
    request(endpoint, { ...options, method: "DELETE" }),
  getAccessToken,
  putAccessToken,
};

export default apiHelper;