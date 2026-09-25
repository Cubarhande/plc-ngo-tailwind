import { useEffect, useState } from "react";
import { CalendarDays, MapPin, ArrowRight, ArrowLeft } from "lucide-react";

import API from "../../services/api";
import HeroSlider from "../../components/public/HeroSlider";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "http://localhost:5000";

const Home = () => {
  const [about, setAbout] = useState(null);
  const [cards, setCards] = useState([]);
  const [causes, setCauses] = useState([]);
  const [event, setEvent] = useState(null);

  // What We Do slider
  const [currentIndex, setCurrentIndex] = useState(0);

  /* =====================================================
     LOAD HOME DATA
  ===================================================== */

  useEffect(() => {
    const loadData = async () => {
      try {
        const [aboutRes, cardsRes, causesRes, eventsRes] = await Promise.all([
          API.get("/about"),
          API.get("/whatwedocards?limit=6"),
          API.get("/causes?limit=3"),
          API.get("/events?limit=1"),
        ]);

        // ABOUT
        setAbout(aboutRes.data?.data || null);

        // WHAT WE DO
        const activeCards = (cardsRes.data?.data || []).filter(
          (item) => item.status !== false,
        );

        setCards(activeCards);

        // Reset slider when cards change
        setCurrentIndex(0);

        // CAUSES
        setCauses(
          (causesRes.data?.data || []).filter((item) => item.status !== false),
        );

        // LATEST ACTIVE EVENT
        const activeEvent = (eventsRes.data?.data || []).find(
          (item) => item.status !== false,
        );

        setEvent(activeEvent || null);
      } catch (error) {
        console.error("Failed to load homepage:", error);
      }
    };

    loadData();
  }, []);

  /* =====================================================
     WHAT WE DO SLIDER
  ===================================================== */

  const cardsPerView = 3;

  const maxIndex = Math.max(0, cards.length - cardsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* =====================================================
          HERO
      ===================================================== */}

      <HeroSlider />

      {/* =====================================================
          ABOUT
      ===================================================== */}

      {about && (
        <section className="bg-white py-16 transition-colors duration-300 dark:bg-slate-950 sm:py-20 lg:py-24">
          <div className="container-custom">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              {/* IMAGE */}
              <div className="relative">
                <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-yellow-400/10 blur-2xl" />

                {about.image ? (
                  <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-xl dark:border-white/10 dark:bg-slate-900 dark:shadow-2xl">
                    <img
                      src={`${IMAGE_URL}${about.image}`}
                      alt={about.title || "About PLC"}
                      loading="lazy"
                      className="h-72 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-96"
                    />
                  </div>
                ) : (
                  <div className="flex h-72 items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 sm:h-96 dark:border-white/10 dark:bg-slate-900">
                    <span className="text-sm text-slate-400 dark:text-slate-500">
                      No Image
                    </span>
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div>
                <span className="inline-flex rounded-full border border-yellow-500/20 bg-yellow-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-yellow-700 dark:border-yellow-400/20 dark:bg-yellow-400/10 dark:text-yellow-400">
                  About Us
                </span>

                <h2 className="mt-5 text-3xl font-bold leading-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
                  {about.title}
                </h2>

                {about.description && (
                  <p className="mt-6 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
                    {about.description}
                  </p>
                )}

                {about.buttonText && about.buttonLink && (
                  <a
                    href={about.buttonLink}
                    className="group mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3 text-sm font-bold text-white transition duration-300 hover:bg-slate-800 dark:bg-yellow-400 dark:text-slate-950 dark:hover:bg-yellow-300"
                  >
                    {about.buttonText}

                    <ArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          WHAT WE DO
      ===================================================== */}

      <section className="border-y border-slate-200 bg-slate-50 py-16 transition-colors duration-300 dark:border-white/5 dark:bg-slate-900 sm:py-20 lg:py-24">
        <div className="container-custom">
          {/* HEADER */}
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="inline-flex rounded-full border border-yellow-500/20 bg-yellow-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-yellow-700 dark:border-yellow-400/20 dark:bg-yellow-400/10 dark:text-yellow-400">
              What We Do
            </span>

            <h2 className="mt-5 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
              Our Work
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
              Discover how PLC Organisation works with communities and partners
              to create positive change.
            </p>
          </div>

          {/* CARDS */}
          {cards.length > 0 ? (
            <div>
              {/* SLIDER */}
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${
                      currentIndex * (100 / cardsPerView)
                    }%)`,
                  }}
                >
                  {cards.map((card) => (
                    <div
                      key={card._id}
                      className="w-full shrink-0 px-3 sm:w-1/2 lg:w-1/3"
                    >
                      <article className="group h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-yellow-400/30 hover:shadow-xl dark:border-white/10 dark:bg-slate-950 dark:shadow-xl dark:hover:border-yellow-400/30 dark:hover:shadow-yellow-400/5">
                        {/* IMAGE */}
                        {card.image ? (
                          <div className="relative overflow-hidden">
                            <img
                              src={`${IMAGE_URL}${card.image}`}
                              alt={card.title || "Our work"}
                              loading="lazy"
                              className="h-56 w-full object-cover transition duration-700 group-hover:scale-105"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                          </div>
                        ) : (
                          <div className="flex h-56 items-center justify-center bg-slate-100 dark:bg-slate-900">
                            <span className="text-sm text-slate-400 dark:text-slate-600">
                              No Image
                            </span>
                          </div>
                        )}

                        {/* CONTENT */}
                        <div className="p-6">
                          {card.category?.name && (
                            <span className="text-xs font-bold uppercase tracking-widest text-yellow-600 dark:text-yellow-400">
                              {card.category.name}
                            </span>
                          )}

                          <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
                            {card.title}
                          </h3>

                          {card.description && (
                            <p className="mt-3 line-clamp-5 text-sm leading-6 text-slate-600 dark:text-slate-400">
                              {card.description}
                            </p>
                          )}

                          {card.buttonText && card.buttonLink && (
                            <a
                              href={card.buttonLink}
                              className="group/link mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-800 transition hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300"
                            >
                              {card.buttonText}

                              <ArrowRight
                                size={15}
                                className="transition-transform duration-300 group-hover/link:translate-x-1"
                              />
                            </a>
                          )}
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              </div>

              {/* ARROWS */}
              {cards.length > cardsPerView && (
                <div className="mt-8 flex justify-center gap-3">
                  {/* PREVIOUS */}
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    aria-label="Previous slide"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:hover:border-yellow-400 dark:hover:bg-yellow-400"
                  >
                    <ArrowLeft size={18} />
                  </button>

                  {/* NEXT */}
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentIndex === maxIndex}
                    aria-label="Next slide"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:hover:border-yellow-400 dark:hover:bg-yellow-400"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 dark:border-white/10 dark:bg-slate-950">
              No content available.
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          CAUSES
      ===================================================== */}

      <section className="bg-white py-16 transition-colors duration-300 dark:bg-slate-950 sm:py-20 lg:py-24">
        <div className="container-custom">
          {/* HEADER */}
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="inline-flex rounded-full border border-yellow-500/20 bg-yellow-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-yellow-700 dark:border-yellow-400/20 dark:bg-yellow-400/10 dark:text-yellow-400">
              Support
            </span>

            <h2 className="mt-5 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
              Our Causes
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
              Support the causes that help create meaningful change in our
              communities.
            </p>
          </div>

          {/* CAUSES */}
          {causes.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {causes.map((cause) => (
                <article
                  key={cause._id}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-yellow-400/30 hover:shadow-xl dark:border-white/10 dark:bg-slate-900 dark:shadow-xl"
                >
                  {/* IMAGE */}
                  {cause.image ? (
                    <div className="relative overflow-hidden">
                      <img
                        src={`${IMAGE_URL}${cause.image}`}
                        alt={cause.title || "Cause"}
                        loading="lazy"
                        className="h-56 w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-slate-100 dark:bg-slate-800">
                      <span className="text-sm text-slate-400 dark:text-slate-600">
                        No Image
                      </span>
                    </div>
                  )}

                  {/* CONTENT */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {cause.title}
                    </h3>

                    {cause.description && (
                      <p className="mt-3 line-clamp-5 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {cause.description}
                      </p>
                    )}

                    {/* AMOUNTS */}
                    <div className="mt-6 hidden grid-cols-2 gap-3 border-t border-slate-200 pt-5 dark:border-white/10">
                      <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-950">
                        <p className="text-xs uppercase tracking-wider text-slate-500">
                          Goal
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                          ₹{cause.goalAmount || 0}
                        </p>
                      </div>

                      <div className="rounded-xl bg-yellow-50 p-3 dark:bg-yellow-400/10">
                        <p className="text-xs uppercase tracking-wider text-yellow-700 dark:text-yellow-500">
                          Raised
                        </p>

                        <p className="mt-1 text-sm font-bold text-yellow-700 dark:text-yellow-400">
                          ₹{cause.raisedAmount || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-slate-500">
              No causes available.
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          LATEST EVENT
      ===================================================== */}

      <section className="border-t border-slate-200 bg-slate-50 py-16 transition-colors duration-300 dark:border-white/5 dark:bg-slate-900 sm:py-20 lg:py-24">
        <div className="container-custom">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            {/* LEFT CONTENT */}
            <div className="flex flex-col justify-center lg:col-span-5">
              <span className="w-fit rounded-full border border-yellow-500/20 bg-yellow-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-yellow-700 dark:border-yellow-400/20 dark:bg-yellow-400/10 dark:text-yellow-400">
                Activities
              </span>

              <h2 className="mt-5 text-4xl font-bold leading-tight text-slate-900 dark:text-white sm:text-5xl">
                Join our upcoming events
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
                Stay connected with our latest events, activities and community
                initiatives.
              </p>

              <a
                href="/events"
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-slate-900 px-7 py-3 text-sm font-bold uppercase text-slate-900 transition duration-300 hover:bg-slate-900 hover:text-white dark:border-white/20 dark:text-white dark:hover:border-yellow-400 dark:hover:bg-yellow-400 dark:hover:text-slate-950"
              >
                View Events
                <ArrowRight size={16} />
              </a>
            </div>

            {/* EVENT */}
            <div className="lg:col-span-7">
              {event ? (
                <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-slate-950 dark:shadow-2xl">
                  <div className="grid lg:grid-cols-5">
                    {/* IMAGE */}
                    {event.image && (
                      <div className="lg:order-2 lg:col-span-2">
                        <img
                          src={`${IMAGE_URL}${event.image}`}
                          alt={event.title || "Event"}
                          loading="lazy"
                          className="h-64 w-full object-cover lg:h-full"
                        />
                      </div>
                    )}

                    {/* DETAILS */}
                    <div className="p-6 sm:p-10 lg:col-span-3">
                      <span className="text-xs font-bold uppercase tracking-widest text-yellow-600 dark:text-yellow-400">
                        Latest Event
                      </span>

                      <h3 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                        {event.title}
                      </h3>

                      {event.subtitle && (
                        <p className="mt-4 text-lg font-medium text-slate-700 dark:text-slate-300">
                          {event.subtitle}
                        </p>
                      )}

                      {event.description && (
                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                          {event.description}
                        </p>
                      )}

                      {/* DATE */}
                      {event.eventDate && (
                        <div className="mt-7 flex items-center gap-3">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-yellow-500/20 bg-yellow-100 text-yellow-700 dark:border-yellow-400/20 dark:bg-yellow-400/10 dark:text-yellow-400">
                            <CalendarDays size={19} />
                          </span>

                          <div>
                            <p className="text-xs text-slate-500">Event Date</p>

                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {new Date(event.eventDate).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* LOCATION */}
                      {event.location && (
                        <div className="mt-4 flex items-center gap-3">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-yellow-500/20 bg-yellow-100 text-yellow-700 dark:border-yellow-400/20 dark:bg-yellow-400/10 dark:text-yellow-400">
                            <MapPin size={19} />
                          </span>

                          <div>
                            <p className="text-xs text-slate-500">Location</p>

                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {event.location}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* BUTTON */}
                      {event.buttonText && event.buttonLink && (
                        <a
                          href={event.buttonLink}
                          className="mt-7 inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3 text-sm font-bold uppercase text-white transition hover:bg-slate-800 dark:bg-yellow-400 dark:text-slate-950 dark:hover:bg-yellow-300"
                        >
                          {event.buttonText}
                          <ArrowRight size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ) : (
                <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950">
                  <p className="text-slate-500">No active events available.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
