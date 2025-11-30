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

async function makeRequest(method, endpoint, data) {

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


  let response = await fetch(API_BASE_URL + endpoint, options);
  if (response.status === 401) {

    const newToken = await refreshToken();
    if (newToken) {

      headers["Authorization"] = "Bearer " + newToken;
      options.headers = headers;
      response = await fetch(API_BASE_URL + endpoint, options);
    }
  }

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
