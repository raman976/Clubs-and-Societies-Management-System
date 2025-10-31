import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleTogglePassword = () => setShowPassword((prev) => !prev);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log('Attempting login with:', { email }); // Debug log
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', res.status); // Debug log
      const data = await res.json();
      console.log('Response data:', data); // Debug log
      
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }

      if (!data.accessToken) {
        setError("No access token received");
        return;
      }

      // Store access token in localStorage
      localStorage.setItem("accessToken", data.accessToken);
      console.log('Token stored, navigating to dashboard');
      
      // Redirect after login
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="login-container">
      {/* Left Section */}
      <section className="login-left">
        <h1 className="app-title">CLUB & SOCIETY HUB</h1>
        <p className="description">
          A central platform to manage all college clubs, societies, and their
          events effortlessly. Stay updated with announcements, explore
          activities, and participate in what interests you!
        </p>
      </section>

      {/* Right Section */}
      <section className="login-right">
        <h2 className="login-heading">Sign In to Continue</h2>

        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your college email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={handleTogglePassword}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <div className="links">
            <a href="#">Forgot password?</a>
            <a href="#">Create an account</a>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Login;
