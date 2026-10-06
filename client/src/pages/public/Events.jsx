import { useEffect, useState } from "react";
import { X, CalendarDays, MapPin } from "lucide-react";

import API from "../../services/api";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "http://localhost:5000";

const Events = () => {
  const [cards, setCards] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [cardRes, eventRes] = await Promise.all([
          API.get("/event-cards"),
          API.get("/events"),
        ]);

        setCards(
          (cardRes.data?.data || [])
            .filter((x) => x.status)
            .sort(
              (a, b) =>
                Number(a.displayOrder || 0) - Number(b.displayOrder || 0),
            ),
        );

        setEvents(
          (eventRes.data?.data || [])
            .filter((x) => x.status)
            .sort(
              (a, b) =>
                Number(a.displayOrder || 0) - Number(b.displayOrder || 0),
            ),
        );
      } catch (error) {
        console.error("Failed to load events:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <section className="min-h-screen bg-slate-50 py-16 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white md:py-20">
      <div className="container-custom">
        {/* =====================================================
            EVENTS HEADER
        ===================================================== */}

        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-yellow-700 dark:bg-yellow-400/10 dark:text-yellow-400">
              Activities
            </span>
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
            Events
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
            Discover our upcoming events, activities, and opportunities to
            connect with our community.
          </p>
        </div>

        {/* =====================================================
            EVENTS
        ===================================================== */}

        {events.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                onClick={() => setSelectedEvent(event)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                {/* IMAGE */}

                {event.image && (
                  <div className="overflow-hidden">
                    <img
                      src={`${IMAGE_URL}${event.image}`}
                      alt={event.title}
                      loading="lazy"
                      className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                )}

                {/* CONTENT */}

                <div
                  className="p-6"
                  style={{
                    backgroundColor: event.backgroundColor || undefined,
                  }}
                >
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {event.title}
                  </h2>

                  {/* DATE */}

                  {event.eventDate && (
                    <div className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                      <CalendarDays size={16} />

                      <span>
                        {new Date(event.eventDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}

                  {/* LOCATION */}

                  {event.location && (
                    <div className="mt-2 flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <MapPin size={16} className="mt-0.5 shrink-0" />

                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  )}

                  {/* DESCRIPTION */}

                  {event.description && (
                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                      {event.description}
                    </p>
                  )}

                  {/* READ MORE */}

                  <div className="mt-5 text-sm font-semibold text-slate-900 dark:text-white">
                    View Details
                    <span className="ml-2 transition group-hover:ml-3">→</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              No events available
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              There are currently no active events to display.
            </p>
          </div>
        )}

        {/* =====================================================
            EVENT CARDS HEADER
        ===================================================== */}

        <div className="mx-auto mb-12 mt-20 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-yellow-700 dark:bg-yellow-400/10 dark:text-yellow-400">
              Activities
            </span>
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Event Highlights
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
            Explore some of the activities and initiatives organized by our
            team.
          </p>
        </div>

        {/* =====================================================
            EVENT CARDS
        ===================================================== */}

        {!loading && (
          <>
            {cards.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => (
                  <article
                    key={card._id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                  >
                    {/* IMAGE */}

                    {card.image && (
                      <div className="overflow-hidden">
                        <img
                          src={`${IMAGE_URL}${card.image}`}
                          alt={card.title}
                          loading="lazy"
                          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}

                    {/* CONTENT */}

                    <div
                      className="p-6"
                      style={{
                        backgroundColor: card.backgroundColor || undefined,
                      }}
                    >
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {card.title}
                      </h2>

                      {card.description && (
                        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                          {card.description}
                        </p>
                      )}

                      {card.buttonText && card.buttonLink && (
                        <a
                          href={card.buttonLink}
                          className="mt-5 inline-flex items-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                        >
                          {card.buttonText}
                          <span className="ml-2">→</span>
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No event highlights available.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* =======================================================
          EVENT MODAL
      ======================================================= */}

      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              aria-label="Close event details"
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition hover:bg-black"
            >
              <X size={20} />
            </button>

            {/* MODAL IMAGE */}

            {selectedEvent.image && (
              <img
                src={`${IMAGE_URL}${selectedEvent.image}`}
                alt={selectedEvent.title}
                loading="lazy"
                className="h-64 w-full object-cover sm:h-72"
              />
            )}

            {/* MODAL CONTENT */}

            <div
              className="p-6 sm:p-8"
              style={{
                backgroundColor: selectedEvent.backgroundColor || undefined,
              }}
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                {selectedEvent.title}
              </h2>

              {/* DATE */}

              {selectedEvent.eventDate && (
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                  <CalendarDays size={17} />

                  <span>
                    {new Date(selectedEvent.eventDate).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </span>
                </div>
              )}

              {/* LOCATION */}

              {selectedEvent.location && (
                <div className="mt-3 flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin size={17} className="mt-0.5 shrink-0" />

                  <span>{selectedEvent.location}</span>
                </div>
              )}

              {/* DESCRIPTION */}

              {selectedEvent.description && (
                <p className="mt-6 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                  {selectedEvent.description}
                </p>
              )}

              {/* BUTTON */}

              {selectedEvent.buttonText && selectedEvent.buttonLink && (
                <a
                  href={selectedEvent.buttonLink}
                  target={
                    selectedEvent.buttonLink.startsWith("/")
                      ? undefined
                      : "_blank"
                  }
                  rel={
                    selectedEvent.buttonLink.startsWith("/")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className="mt-7 inline-flex items-center rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  {selectedEvent.buttonText}
                  <span className="ml-2">→</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Events;
