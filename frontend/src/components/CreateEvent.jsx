import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    venue: "",
    start_time: "",
    end_time: "",
    capacity: "",
    poc: "",
    thumbnail_url: "",
    restrict_email_domain: false,
    allowed_email_domain: "adypu.edu.in",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        capacity: form.capacity ? Number(form.capacity) : undefined,
        restrict_email_domain: !!form.restrict_email_domain,
        allowed_email_domain: form.restrict_email_domain ? form.allowed_email_domain : undefined,
      };
      const created = await api.post("/events", payload);

      if (created?.id) navigate(`/events/${created.id}`);
      else navigate("/events");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6efe6] pt-24 px-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Create Event</h2>
        {error && <div className="text-red-600 mb-3">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          <input name="name" value={form.name} onChange={onChange} placeholder="Event title" className="w-full border px-3 py-2 rounded" required />
          <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" className="w-full border px-3 py-2 rounded" rows={4} />
          <input name="venue" value={form.venue} onChange={onChange} placeholder="Venue" className="w-full border px-3 py-2 rounded" />
          <input name="thumbnail_url" value={form.thumbnail_url} onChange={onChange} placeholder="Thumbnail Image URL (optional)" className="w-full border px-3 py-2 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm">Start</label>
              <input name="start_time" value={form.start_time} onChange={onChange} type="datetime-local" className="w-full border px-3 py-2 rounded" required />
            </div>
            <div>
              <label className="block text-sm">End</label>
              <input name="end_time" value={form.end_time} onChange={onChange} type="datetime-local" className="w-full border px-3 py-2 rounded" required />
            </div>
          </div>
          <input name="capacity" value={form.capacity} onChange={onChange} placeholder="Capacity (optional)" type="number" className="w-full border px-3 py-2 rounded" />
          <div className="flex items-center gap-3">
            <input id="restrict" name="restrict_email_domain" checked={form.restrict_email_domain} onChange={(e)=> setForm(s=> ({...s, restrict_email_domain: e.target.checked}))} type="checkbox" />
            <label htmlFor="restrict" className="text-sm">Restrict registrations to</label>
            <input name="allowed_email_domain" value={form.allowed_email_domain} onChange={onChange} placeholder="domain (e.g. adypu.edu.in)" className="border px-3 py-2 rounded" disabled={!form.restrict_email_domain} />
          </div>
          <input name="poc" value={form.poc} onChange={onChange} placeholder="Point of contact" className="w-full border px-3 py-2 rounded" />
          <div className="flex items-center gap-3">
            <button disabled={loading} className="bg-[#FFC107] px-4 py-2 rounded font-semibold">{loading ? 'Creating...' : 'Create Event'}</button>
            <button type="button" onClick={() => navigate('/events')} className="text-sm text-gray-600">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
