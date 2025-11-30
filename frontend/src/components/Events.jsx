import React, { useState, useEffect } from "react"; 
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import api from "../lib/api";

const Events = () => {

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const transformEvent = (event) => {

    const start = new Date(event.start_time);
    const end = new Date(event.end_time);
    const timeString = `${start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    return {
      id: event.id,
      title: event.name,
      description: event.description,
      location: event.venue,
      date: String(start.getDate()),
      month: start.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
      time: timeString,
      image: event.thumbnail_url || event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
      category: event.club?.name || 'General',
      attendees: event.attendees || 0,
    };
  };


  useEffect(() => {
    const fetchAndCategorizeEvents = async () => {
      try {
        setLoading(true);
        const allEvents = await api.get("/events");
        const now = new Date();
        const upcoming = [];
        const ongoing = [];
        const past = [];

        (allEvents || []).forEach((event) => {
          const startTime = new Date(event.start_time);
          const endTime = new Date(event.end_time);
          const e = transformEvent(event);
          if (endTime < now) past.push(e);
          else if (startTime <= now && endTime >= now) ongoing.push(e);
          else upcoming.push(e);
        });

        setUpcomingEvents(upcoming);
        setOngoingEvents(ongoing);
        setPastEvents(past);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchAndCategorizeEvents();
  }, []); 

  if (loading) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden bg-[#f6efe6] pt-24">
        <Navbar />
        <div className="max-w-[1200px] mx-auto px-8 mt-10 text-center">Loading events...</div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden bg-[#f6efe6] pt-24">
        <Navbar />
        <div className="max-w-[1200px] mx-auto px-8 mt-10 text-center text-red-600">{error}</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f6efe6] pt-24">
      <Navbar />


      <div className="max-w-[1200px] mx-auto px-8 mt-6">
        {(() => {
          const role = sessionStorage.getItem("role") || localStorage.getItem("role");
          const allowed = ["PRESIDENT", "VICE_PRESIDENT", "HANDLER", "SUPER_ADMIN"];
          if (role && allowed.includes(role)) {
            return (
              <div className="flex justify-end mb-4">
                <Link to="/events/new" className="bg-[#12202b] text-white px-4 py-2 rounded">Create Event</Link>
              </div>
            );
          }
          return null;
        })()}
      </div>

      <section className="pt-32 pb-12 bg-gradient-to-b from-[#f3e6d9] to-[#f6efe6]">
        <div className="max-w-[1200px] mx-auto px-8">
          <h1 className="font-['Playfair_Display'] text-6xl text-[#12202b] mb-6 font-normal text-center">
            Events
          </h1>
          <p className="text-center text-[#7b6f61] text-xl max-w-3xl mx-auto">
            Join us for exciting events that celebrate diversity, culture, and
            community. From cultural festivals to educational workshops, there's
            something for everyone.
          </p>
        </div>
      </section>

      <section className="py-8 bg-[#f6efe6]">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="text-4xl font-bold text-[#FFC107] mb-2">
                {upcomingEvents.length}
              </div>
              <div className="text-[#7b6f61] text-sm tracking-wider">
                UPCOMING EVENTS
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="text-4xl font-bold text-[#FFC107] mb-2">
                {ongoingEvents.length}
              </div>
              <div className="text-[#7b6f61] text-sm tracking-wider">
                ONGOING EVENTS
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="text-4xl font-bold text-[#FFC107] mb-2">
                {pastEvents.length}
              </div>
              <div className="text-[#7b6f61] text-sm tracking-wider">
                PAST EVENTS
              </div>
            </div>
          </div>
        </div>
      </section>

      {ongoingEvents.length > 0 && (
        <section className="py-16 bg-[#f6efe6]">
          <div className="max-w-[1200px] mx-auto px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-['Playfair_Display'] text-4xl text-[#12202b] font-normal">
                Ongoing Events
              </h2>
              <div className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full animate-pulse">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                <span className="text-sm font-bold">LIVE</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ongoingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-[#b8894a] text-[#12202b] px-4 py-2 rounded-lg text-center font-bold shadow-lg">
                      <span className="block text-2xl leading-none">
                        {event.date}
                      </span>
                      <span className="block text-xs tracking-widest uppercase">
                        {event.month}
                      </span>
                    </div>
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#12202b] px-3 py-1 rounded-full text-xs font-semibold tracking-wider">
                      {event.category}
                    </div>
                    <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider animate-pulse">
                      LIVE NOW
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-['Playfair_Display'] text-2xl text-[#12202b] mb-4 font-semibold line-clamp-2">
                      {event.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-[#7b6f61]">
                        <svg
                          className="w-4 h-4 text-[#b8894a] flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#7b6f61]">
                        <svg
                          className="w-4 h-4 text-[#b8894a] flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <Link to={`/events/${event.id}`} className="w-full block text-center bg-[#b8894a] text-[#12202b] px-8 py-3 rounded-lg font-semibold hover:bg-[#b8894a] hover:text-white transition-all hover:-translate-y-0.5 hover:shadow-lg">
                      Learn More
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-[#f3e6d9]">
        <div className="max-w-[1200px] mx-auto px-8">
          <h2 className="font-['Playfair_Display'] text-4xl text-[#12202b] mb-8 font-normal">
            Upcoming Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-[#b8894a] text-[#12202b] px-4 py-2 rounded-lg text-center font-bold shadow-lg">
                    <span className="block text-2xl leading-none">
                      {event.date}
                    </span>
                    <span className="block text-xs tracking-widest uppercase">
                      {event.month}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#12202b] px-3 py-1 rounded-full text-xs font-semibold tracking-wider">
                    {event.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-['Playfair_Display'] text-2xl text-[#12202b] mb-4 font-semibold line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-[#7b6f61]">
                      <svg className="w-4 h-4 text-[#b8894a] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#7b6f61]">
                      <svg className="w-4 h-4 text-[#b8894a] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <Link to={`/events/${event.id}`} className="w-full block text-center bg-[#b8894a] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#12202b] transition-all hover:-translate-y-0.5 hover:shadow-lg">
                    Learn More
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f6efe6]">
        <div className="max-w-[1200px] mx-auto px-8">
          <h2 className="font-['Playfair_Display'] text-4xl text-[#12202b] mb-8 font-normal">
            Past Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event, index) => (
              <motion.div
                key={event.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-[#b8894a] text-[#12202b] px-4 py-2 rounded-lg text-center font-bold shadow-lg">
                    <span className="block text-2xl leading-none">
                      {event.date}
                    </span>
                    <span className="block text-xs tracking-widest uppercase">
                      {event.month}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#12202b] px-3 py-1 rounded-full text-xs font-semibold tracking-wider">
                    {event.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-['Playfair_Display'] text-2xl text-[#12202b] mb-4 font-semibold line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-[#7b6f61]">
                      <svg className="w-4 h-4 text-[#b8894a] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#7b6f61]">
                      <svg className="w-4 h-4 text-[#b8894a] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <Link to={`/events/${event.id}`} className="w-full block text-center bg-[#b8894a] text-[#12202b] px-8 py-3 rounded-lg font-semibold hover:bg-[#b8894a] hover:text-white transition-all hover:-translate-y-0.5 hover:shadow-lg">
                    Learn More
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;