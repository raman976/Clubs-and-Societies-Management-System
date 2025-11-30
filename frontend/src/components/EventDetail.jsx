import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import api from "../lib/api"; 

const EventDetail = () => {
  const { id } = useParams();    
  const navigate = useNavigate()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const role = (typeof window !== 'undefined') ? (sessionStorage.getItem('role') || localStorage.getItem('role')) : null;
  const canViewData = ["SUPER_ADMIN", "PRESIDENT", "VICE_PRESIDENT"].includes(role);

//   event details
  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        const data = await api.get(`/events/${id}`);
        setEvent(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [id]);

//   form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

//   submition(form)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    // client-side domain check
    if (event?.restrict_email_domain) {
      const allowed = (event.allowed_email_domain || "").toLowerCase();
      if (!form.email?.toLowerCase()?.endsWith(`@${allowed}`)) {
        setSubmitError(`Registrations are restricted to @${allowed} email addresses`);
        return;
      }
    }
    try {
      await api.post(`/events/${id}/register`, form);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitError(err?.message || "Failed to register");
    }
  };

//   loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6efe6]">
        <Navbar />
        <div className="p-20 text-center mt-24">Loading...</div>
        <Footer />
      </div>
    );
  }

//   error handeling
  if (error) {
    return (
      <div className="min-h-screen bg-[#f6efe6]">
        <Navbar />
        <div className="p-20 text-center text-red-500 mt-24">{error}</div>
        <Footer />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#f6efe6]">
      <Navbar />

      <main className="max-w-[900px] mx-auto px-6 py-12 mt-24">

        <img
          src={event.thumbnail_url || event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80'}
          alt={event.name}
          className="w-full rounded-lg mb-6"
        />

        <h1 className="text-3xl font-semibold mb-4">{event.name}</h1>

        <p className="mb-6 text-gray-700">{event.description}</p>

        <div className="mb-6">
          <p><strong>Venue:</strong> {event.venue}</p>
          <p><strong>Start:</strong> {event.start_time}</p>
          <p><strong>End:</strong> {event.end_time}</p>
        </div>


        {/* button for selected roles */}
        {canViewData && (
          <button
            onClick={() => navigate(`/events/${id}/registrations`)}
            className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
          >
            View Registrations
          </button>
        )}

        {/* registration form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl mb-4">Register</h2>

          {submitted ? (
            <p className="text-green-600">Registration successful!</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {submitError && <div className="text-red-600">{submitError}</div>}

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border px-3 py-2 rounded"
                required
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder="Email"
                className="w-full border px-3 py-2 rounded"
                required
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full border px-3 py-2 rounded"
              />

              <button className="bg-yellow-500 px-4 py-2 rounded">
                Submit
              </button>

            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetail;
