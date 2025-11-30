const API_BASE_URL = "http://localhost:3001/api";

// Simple helper to get access token from sessionStorage (less persistent)
function getAccessToken() {
  try {
    return sessionStorage.getItem("accessToken");
  } catch (err) {
    console.error("Could not read accessToken:", err);
    return null;
  }
}

// Try to refresh token using refresh cookie. Returns new token string or null.
async function refreshToken() {
  try {
    const response = await fetch(API_BASE_URL + "/auth/refresh", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) return null;
    const body = await response.json();
    if (body && body.accessToken) {
      // store token in sessionStorage so it doesn't persist across browser restarts
      sessionStorage.setItem("accessToken", body.accessToken);
      return body.accessToken;
    }
    return null;
  } catch (err) {
    console.error("refreshToken error:", err);
    return null;
  }
}

// Low-level request function. Simple and easy to read.
async function makeRequest(method, endpoint, data) {
  // build headers
  const headers = { "Content-Type": "application/json" };
  const token = getAccessToken();
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  const options = {
    method: method,
    credentials: "include",
    headers: headers,
  };
  if (data !== undefined) {
    options.body = JSON.stringify(data);
  }

  // Try the request once. If 401, try refresh and retry once.
  let response = await fetch(API_BASE_URL + endpoint, options);
  if (response.status === 401) {
    // try refresh
    const newToken = await refreshToken();
    if (newToken) {
      // set new header and retry
      headers["Authorization"] = "Bearer " + newToken;
      options.headers = headers;
      response = await fetch(API_BASE_URL + endpoint, options);
    }
  }

  // If still not ok, throw an Error with useful info
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    let body = text;
    try {
      body = JSON.parse(text);
    } catch {
      // not JSON
    }
    const msg = `HTTP ${response.status} - ${JSON.stringify(body)}`;
    const err = new Error(msg);
    err.status = response.status;
    err.body = body;
    throw err;
  }

  // parse body if present
  const text = await response.text().catch(() => "");
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

const api = {
  get(endpoint) {
    return makeRequest("GET", endpoint);
  },
  post(endpoint, data) {
    return makeRequest("POST", endpoint, data);
  },
  put(endpoint, data) {
    return makeRequest("PUT", endpoint, data);
  },
  delete(endpoint) {
    return makeRequest("DELETE", endpoint);
  },
};

export default api;
