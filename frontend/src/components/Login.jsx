import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [clubs, setClubs] = useState([]);
  const stripRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchClubs = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/clubs");
        if (!res.ok) throw new Error("Failed to fetch clubs");
        const data = await res.json();
        if (mounted && Array.isArray(data) && data.length) setClubs(data);
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setClubs([
          {
            id: 1,
            club_name: "Tech Society",
            description: "Hackathons, workshops and more.",
            logo_image: "",
            type: "TECH",
            membersCount: 120,
          },
          {
            id: 2,
            club_name: "Drama Club",
            description: "Stage plays and acting workshops.",
            logo_image: "",
            type: "CULTURAL",
            membersCount: 45,
          },
          {
            id: 3,
            club_name: "Robotics",
            description: "Build robots & compete.",
            logo_image: "",
            type: "TECH",
            membersCount: 32,
          },
        ]);
      }
    };
    fetchClubs();
    return () => {
      mounted = false;
    };
  }, []);

  const handleTogglePassword = () => setShowPassword((s) => !s);

  const scrollStrip = (direction = "right") => {
    const el = stripRef.current;
    if (!el) return;
    const delta =
      direction === "left"
        ? -Math.min(320, el.clientWidth / 2)
        : Math.min(320, el.clientWidth / 2);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) return setError(data.error || "Invalid credentials");
      if (!data.accessToken) return setError("No access token received");
      // Use sessionStorage so the login does not persist across browser restarts
      sessionStorage.setItem("accessToken", data.accessToken);

      // decode token payload to store role and club_id for quick UI checks
      const parseJwt = (token) => {
        try {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join("")
          );
          return JSON.parse(jsonPayload);
        } catch (err) {
          console.error("Failed to parse JWT", err);
          return null;
        }
      };
      const payload = parseJwt(data.accessToken);
      if (payload) {
        if (payload.role) sessionStorage.setItem("role", payload.role);
        if (payload.club_id) sessionStorage.setItem("club_id", String(payload.club_id));
        if (payload.sub) sessionStorage.setItem("userId", String(payload.sub));
      }

      // navigate to dashboard for a smoother flow
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="md:w-2/3 bg-[#f3e6d9] p-12 flex flex-col justify-center">
        <div className="max-w-lg">
          <h1 className="text-4xl font-extrabold text-[#12202b] font-['Playfair_Display']">
            Clubs &amp; Societies
          </h1>
          <p className="mt-3 text-[#7b6f61]">
            Discover, join and manage campus clubs. Explore activities and stay
            updated.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <button
              onClick={() => scrollStrip("left")}
              className="px-3 py-2 bg-[#FFC107] text-[#12202b] rounded hover:bg-[#b8894a] transition-colors"
            >
              ◀
            </button>
            <div ref={stripRef} className="flex gap-3 overflow-x-auto py-2">
              {clubs.length === 0 ? (
                <div className="min-w-[220px] bg-white p-4 rounded shadow">
                  Loading clubs...
                </div>
              ) : (
                clubs.map((c) => (
                  <div
                    key={c.id}
                    className="min-w-[220px] bg-white p-4 rounded shadow"
                  >
                    <div className="font-semibold">{c.club_name}</div>
                    <div className="text-sm text-gray-600">{c.description}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      {c.type} · {c.membersCount ?? 0} members
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => scrollStrip("right")}
              className="px-3 py-2 bg-[#FFC107] text-[#12202b] rounded hover:bg-[#b8894a] transition-colors"
            >
              ▶
            </button>
          </div>
        </div>
      </aside>

      <main className="md:w-1/3 flex items-center justify-center p-12 bg-[#f6efe6]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#12202b]">
            Sign In to Continue
          </h2>
          <p className="text-sm text-[#7b6f61] mt-2">
            Use your club core-member account
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 p-2 rounded">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#12202b]">
                Email
              </label>
              <input
                className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                type="email"
                placeholder="Enter your college email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#12202b]">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  className="block w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="absolute right-2 top-2 text-sm text-[#b8894a] hover:text-[#12202b]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <a href="#" className="text-[#b8894a] hover:text-[#12202b]">
                Forgot password?
              </a>
              <a href="#" className="text-[#b8894a] hover:text-[#12202b]">
                Create an account
              </a>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FFC107] text-[#12202b] font-semibold py-2 rounded-md hover:bg-[#b8894a] transition-colors disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
