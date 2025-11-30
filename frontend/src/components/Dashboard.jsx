import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import api from "../lib/api";

const Dashboard = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const slides = [
    {
      title: "Experience Global Connections and Unity",
      subtitle:
        "Join our club and celebrate diversity, culture, and meaningful connections. Be a part of a vibrant international community",
      image:
        "https://images.unsplash.com/photo-1590161311659-852a5207c5b0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Connect with Students Worldwide",
      subtitle:
        "Build lasting friendships and expand your global network through our diverse community events",
      image:
        "https://images.unsplash.com/photo-1714976326749-a51805fa9c20?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Cultural Events and Celebrations",
      subtitle:
        "Experience the richness of different cultures through our exciting events and activities",
      image:
        "https://images.unsplash.com/photo-1744232255607-cad8c181b221?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtcHVzJTIwY2x1YiUyMGV2ZW50fGVufDB8fDB8fHww",
    },
  ];

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const allEvents = await api.get("/events");

        if (allEvents && Array.isArray(allEvents)) {
          const now = new Date();
          const upcoming = allEvents
            .filter((event) => new Date(event.start_time) > now)
            .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
            .slice(0, 3);

          setUpcomingEvents(upcoming);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navbar />

      <section className="relative h-screen overflow-hidden">
        <div className="relative h-full w-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 flex items-center ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20"></div>
              <div className="relative z-10 max-w-[1400px] mx-auto px-12 text-white">
                <h1 className="font-['Playfair_Display'] text-6xl font-normal leading-tight mb-6 max-w-[700px] drop-shadow-lg">
                  {slide.title}
                </h1>
                <p className="text-xl leading-relaxed mb-10 max-w-[600px] opacity-95">
                  {slide.subtitle}
                </p>
                <button
                  onClick={() => navigate("/events")}
                  className="bg-[#FFC107] text-[#12202b] px-12 py-4 rounded font-bold text-base tracking-widest hover:bg-black hover:text-[#FFC107] transition-all hover:-translate-y-0.5 hover:shadow-2xl"
                >
                  Events
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md border-none text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/40 transition-all z-20"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md border-none text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/40 transition-all z-20"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full border-none transition-all ${
                index === currentSlide ? "bg-white w-8" : "bg-white/50 w-3"
              }`}
            />
          ))}
        </div>
      </section>

      <section className="py-24 bg-[#f6efe6]">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.img
                src="https://plus.unsplash.com/premium_photo-1683121680448-ef3047b9351a?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Students"
                className="w-full rounded-lg shadow-2xl"
                whileHover={{ scale: 1.02, rotate: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <motion.h2
                className="font-['Playfair_Display'] text-5xl text-[#12202b] mb-6 font-normal"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                About Our Platform
              </motion.h2>
              <motion.p
                className="text-[#7b6f61] text-lg leading-relaxed mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Welcome to the central hub for all clubs and societies at our
                university. Our platform connects students with diverse
                organizations spanning cultural, technical, sports, arts, and
                social causes.
              </motion.p>
              <motion.p
                className="text-[#7b6f61] text-lg leading-relaxed mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Discover clubs that match your interests, stay updated on
                upcoming events, and become part of a vibrant campus community.
                Whether you're looking to develop new skills, pursue your
                passions, or make lasting friendships, there's a club for
                everyone.
              </motion.p>
              <motion.button
                className="bg-[#b8894a] text-white px-10 py-3.5 rounded font-semibold hover:bg-[#12202b] transition-all hover:-translate-y-0.5 mt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#f3e6d9]" id="events">
        <div className="max-w-[1200px] mx-auto px-8">
          <motion.h2
            className="font-['Playfair_Display'] text-5xl text-[#12202b] text-center mb-12 font-normal"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Upcoming Events
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <motion.div
                className="col-span-full text-center text-[#7b6f61]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Loading events...
              </motion.div>
            ) : upcomingEvents.length === 0 ? (
              <motion.div
                className="col-span-full text-center text-[#7b6f61]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                No upcoming events at the moment
              </motion.div>
            ) : (
              upcomingEvents.map((event, index) => {
                const startDate = new Date(event.start_time);
                const day = startDate.getDate();
                const month = startDate.toLocaleString("en-US", {
                  month: "short",
                });
                const endDate = new Date(event.end_time);
                const time = `${startDate.toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })} - ${endDate.toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}`;

                return (
                  <motion.div
                    key={event.id}
                    className="bg-white rounded-lg overflow-hidden shadow-lg transition-shadow group"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    whileHover={{
                      y: -8,
                      boxShadow:
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      transition: { duration: 0.2 },
                    }}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <motion.img
                        src={
                          event.thumbnail_url ||
                          event.image ||
                          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80"
                        }
                        alt={event.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.div
                        className="absolute top-4 right-4 bg-[#b8894a] text-[#12202b] px-4 py-2 rounded-lg text-center font-bold shadow-lg"
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          delay: index * 0.1 + 0.2,
                        }}
                      >
                        <span className="block text-2xl leading-none">
                          {day}
                        </span>
                        <span className="block text-xs tracking-widest uppercase">
                          {month.toUpperCase()}
                        </span>
                      </motion.div>
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#12202b] px-3 py-1 rounded-full text-xs font-semibold tracking-wider">
                        {event.club?.name || "Event"}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-['Playfair_Display'] text-2xl text-[#12202b] mb-4 font-semibold line-clamp-2">
                        {event.name}
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
                          <span>{time}</span>
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
                          <span>{event.venue}</span>
                        </div>
                      </div>

                      <motion.button
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="w-full bg-[#b8894a] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#12202b] transition-all hover:-translate-y-0.5 hover:shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Learn More
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#f6efe6]" id="gallery">
        <div className="max-w-[1200px] mx-auto px-8">
          <motion.h2
            className="font-['Playfair_Display'] text-5xl text-[#12202b] mb-12 font-normal text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Gallery
          </motion.h2>

          <div className="grid grid-cols-3 gap-6 mb-8">

            <motion.div
              className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
              initial={{ opacity: 0, x: -100, y: -100 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <img
                src="https://images.unsplash.com/photo-1761901219072-491a18f3ccd7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Gallery 1"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </motion.div>

            <motion.div
              className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
              initial={{ opacity: 0, y: -100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            >
              <img
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80"
                alt="Gallery 2"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </motion.div>

            <motion.div
              className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
              initial={{ opacity: 0, x: 100, y: -100 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <img
                src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&q=80"
                alt="Gallery 3"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </motion.div>

            <motion.div
              className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            >
              <img
                src="https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Gallery 4"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </motion.div>

            <motion.div
              className="rounded-lg overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.4,
              }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
            >
              <img
                src="https://images.unsplash.com/photo-1731160352698-cb7e2f142d7a?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Gallery Center"
                className="w-full h-64 object-cover"
              />
            </motion.div>

            <motion.div
              className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            >
              <img
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80"
                alt="Gallery 5"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </motion.div>

            <motion.div
              className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
              initial={{ opacity: 0, x: -100, y: 100 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
            >
              <img
                src="https://images.unsplash.com/photo-1695771079040-ef65e928944b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Gallery 6"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </motion.div>

            <motion.div
              className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
            >
              <img
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80"
                alt="Gallery 7"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </motion.div>

            <motion.div
              className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
              initial={{ opacity: 0, x: 100, y: 100 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
            >
              <img
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80"
                alt="Gallery 8"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
          </div>

          <div className="text-center">
            <motion.button
              onClick={() => navigate("/gallery")}
              className="inline-flex items-center gap-2 bg-transparent border-2 border-[#12202b] text-[#12202b] px-8 py-3 rounded font-semibold hover:bg-[#12202b] hover:text-white transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              VIEW ALL
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 3L11 8L6 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#f3e6d9]">
        <div className="max-w-[1300px] mx-auto px-8">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&q=80')",
              }}
            >
              <div className="absolute inset-0 bg-black/50"></div>
            </div>

            <motion.div
              className="relative z-10 py-24 px-8 text-center text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <motion.p
                className="text-lg mb-2 tracking-wide uppercase font-semibold"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Newsletter
              </motion.p>
              <motion.h2
                className="font-['Playfair_Display'] text-5xl md:text-6xl font-normal mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Stay Updated
              </motion.h2>
              <motion.p
                className="text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed opacity-95"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Get the latest news, updates, and stories from our vibrant
                community. Read about upcoming events, member highlights, and
                exclusive opportunities.
              </motion.p>

              <motion.button
                onClick={() =>
                  window.open(
                    "https://medium.com",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
                className="inline-flex items-center gap-3 bg-[#FFC107] text-[#12202b] px-12 py-4 rounded-lg font-bold text-lg hover:bg-white transition-all hover:-translate-y-0.5 hover:shadow-2xl group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Read Our Newsletter
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#062937] text-center">
        <div className="max-w-[700px] mx-auto px-8">
          <h2 className="font-['Playfair_Display'] text-5xl text-white mb-4 font-normal">
            Ready to Join Our Community?
          </h2>
          <p className="text-[#f3e6d9] text-xl mb-10">
            Become a part of our vibrant international community today
          </p>
          <button className="bg-[#FFC107] text-[#12202b] px-12 py-4 rounded font-bold text-lg tracking-wide hover:bg-white transition-all hover:-translate-y-0.5 hover:shadow-2xl">
            Apply for Membership
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;
