import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Handshake,
} from "lucide-react";

import API from "../../services/api";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "http://localhost:5000";

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loading, setLoading] = useState(true);

  /* =====================================================
     FETCH PARTNERS
  ===================================================== */

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await API.get("/partners");

        const data = response.data?.data || [];

        const activePartners = data
          .filter((partner) => partner.status !== false)
          .sort(
            (a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0),
          );

        setPartners(activePartners);
      } catch (error) {
        console.error("Failed to load partners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  /* =====================================================
     RESPONSIVE VISIBLE COUNT
  ===================================================== */

  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setVisibleCount(1);
      } else if (width < 768) {
        setVisibleCount(2);
      } else if (width < 1024) {
        setVisibleCount(3);
      } else {
        setVisibleCount(4);
      }
    };

    updateVisibleCount();

    window.addEventListener("resize", updateVisibleCount);

    return () => {
      window.removeEventListener("resize", updateVisibleCount);
    };
  }, []);

  /* =====================================================
     SLIDER CALCULATIONS
  ===================================================== */

  const maxIndex = Math.max(0, partners.length - visibleCount);

  const showControls = partners.length > visibleCount;

  /* =====================================================
     KEEP INDEX VALID
  ===================================================== */

  useEffect(() => {
    setCurrentIndex((previous) => Math.min(previous, maxIndex));
  }, [maxIndex]);

  /* =====================================================
     AUTO SLIDER
  ===================================================== */

  useEffect(() => {
    if (!showControls) return;

    const interval = setInterval(() => {
      setCurrentIndex((previous) => (previous >= maxIndex ? 0 : previous + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [showControls, maxIndex]);

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const previous = () => {
    setCurrentIndex((previous) => (previous <= 0 ? maxIndex : previous - 1));
  };

  const next = () => {
    setCurrentIndex((previous) => (previous >= maxIndex ? 0 : previous + 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <section
        className="
          border-t border-slate-200
          bg-white
          py-14
          text-slate-900
          transition-colors duration-300
          dark:border-slate-800
          dark:bg-slate-950
          dark:text-white
          sm:py-20
        "
      >
        <div className="container-custom">
          <div className="flex min-h-[180px] items-center justify-center">
            <div className="text-center">
              <div
                className="
                  mx-auto
                  h-8
                  w-8
                  animate-spin
                  rounded-full
                  border-2
                  border-slate-200
                  border-t-yellow-400
                  dark:border-slate-700
                  dark:border-t-yellow-400
                "
              />

              <p
                className="
                  mt-4
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Loading partners...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* =====================================================
     EMPTY STATE
  ===================================================== */

  if (partners.length === 0) {
    return null;
  }

  return (
    <section
      className="
        overflow-hidden
        border-t border-slate-200
        bg-slate-50
        py-14
        text-slate-900
        transition-colors duration-300

        dark:border-slate-800
        dark:bg-slate-950
        dark:text-white

        sm:py-20
      "
    >
      <div className="container-custom">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          {/* ICON */}

          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              border
              border-yellow-400/20
              bg-yellow-400/10
              text-yellow-500
              dark:text-yellow-400
            "
          >
            <Handshake size={25} aria-hidden="true" />
          </div>

          {/* LABEL */}

          <p className="mt-5">
            <span
              className="
                inline-flex
                rounded-full
                border
                border-yellow-400/20
                bg-yellow-400/10
                px-4
                py-2
                text-xs
                font-bold
                uppercase
                tracking-[0.2em]
                text-yellow-600

                dark:text-yellow-400
              "
            >
              Our Partners
            </span>
          </p>

          {/* TITLE */}

          <h2
            className="
              mt-4
              text-3xl
              font-bold
              leading-tight
              text-slate-900

              dark:text-white

              sm:text-4xl
            "
          >
            Our Valued Partners
          </h2>

          {/* DESCRIPTION */}

          <p
            className="
              mt-4
              text-sm
              leading-7
              text-slate-600

              dark:text-slate-400

              sm:text-base
            "
          >
            We are proud to work with organisations and partners who support our
            mission.
          </p>
        </div>

        {/* =================================================
            SLIDER
        ================================================= */}

        <div className="relative">
          {/* PREVIOUS BUTTON */}

          {showControls && (
            <button
              type="button"
              onClick={previous}
              aria-label="Previous partners"
              className="
                absolute
                left-0
                top-1/2
                z-10
                flex
                h-9
                w-9
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-slate-200
                bg-white
                text-slate-700
                shadow-lg
                transition-all
                duration-300

                hover:border-yellow-400
                hover:bg-yellow-400
                hover:text-slate-950

                dark:border-slate-700
                dark:bg-slate-900
                dark:text-slate-300
                dark:hover:border-yellow-400
                dark:hover:bg-yellow-400
                dark:hover:text-slate-950

                sm:h-10
                sm:w-10
              "
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
          )}

          {/* VIEWPORT */}

          <div
            className="overflow-hidden px-8 sm:px-10 md:px-12"
            style={{
              "--visible-count": visibleCount,
            }}
          >
            {/* TRACK */}

            <div
              className="
                flex
                transition-transform
                duration-500
                ease-in-out
              "
              style={{
                transform: `translateX(
                  calc(
                    -${currentIndex} *
                    (100% / var(--visible-count))
                  )
                )`,
              }}
            >
              {partners.map((partner) => {
                /* =================================================
                   PARTNER CONTENT
                ================================================= */

                const partnerContent = (
                  <>
                    {/* LOGO */}

                    <div
                      className="
                        flex
                        h-28
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-slate-100
                        bg-slate-50
                        p-4
                        transition-colors

                        dark:border-slate-800
                        dark:bg-slate-900

                        sm:h-32
                      "
                    >
                      {partner.logo ? (
                        <img
                          src={`${IMAGE_URL}${partner.logo}`}
                          alt={
                            partner.name
                              ? `${partner.name} logo`
                              : "Partner logo"
                          }
                          loading="lazy"
                          className="
                            max-h-20
                            w-full
                            object-contain
                            transition
                            duration-300
                            group-hover:scale-105
                          "
                        />
                      ) : (
                        <div
                          className="
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-xl
                            bg-slate-100
                            text-slate-400

                            dark:bg-slate-800
                            dark:text-slate-500
                          "
                        >
                          <Handshake size={28} aria-hidden="true" />
                        </div>
                      )}
                    </div>

                    {/* NAME */}

                    <div className="mt-3 flex min-h-[40px] items-center justify-center gap-1 px-2">
                      <h3
                        className="
                          line-clamp-2
                          text-center
                          text-sm
                          font-semibold
                          text-slate-800

                          dark:text-slate-200
                        "
                      >
                        {partner.name}
                      </h3>

                      {partner.website && (
                        <ExternalLink
                          size={13}
                          className="
                            shrink-0
                            text-slate-400
                            dark:text-slate-500
                          "
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </>
                );

                return (
                  <div
                    key={partner._id}
                    className="shrink-0 px-2"
                    style={{
                      width: `${100 / visibleCount}%`,
                    }}
                  >
                    {partner.website ? (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${
                          partner.name || "partner"
                        } website`}
                        className="
                          group
                          block
                          rounded-2xl
                          border
                          border-slate-200
                          bg-white
                          p-3
                          transition-all
                          duration-300

                          hover:-translate-y-1
                          hover:border-yellow-400/40
                          hover:shadow-xl

                          dark:border-slate-800
                          dark:bg-slate-900
                          dark:hover:border-yellow-400/30

                          sm:p-4
                        "
                      >
                        {partnerContent}
                      </a>
                    ) : (
                      <div
                        className="
                          group
                          rounded-2xl
                          border
                          border-slate-200
                          bg-white
                          p-3
                          transition-all
                          duration-300

                          hover:-translate-y-1
                          hover:border-yellow-400/40
                          hover:shadow-xl

                          dark:border-slate-800
                          dark:bg-slate-900
                          dark:hover:border-yellow-400/30

                          sm:p-4
                        "
                      >
                        {partnerContent}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* NEXT BUTTON */}

          {showControls && (
            <button
              type="button"
              onClick={next}
              aria-label="Next partners"
              className="
                absolute
                right-0
                top-1/2
                z-10
                flex
                h-9
                w-9
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-slate-200
                bg-white
                text-slate-700
                shadow-lg
                transition-all
                duration-300

                hover:border-yellow-400
                hover:bg-yellow-400
                hover:text-slate-950

                dark:border-slate-700
                dark:bg-slate-900
                dark:text-slate-300
                dark:hover:border-yellow-400
                dark:hover:bg-yellow-400
                dark:hover:text-slate-950

                sm:h-10
                sm:w-10
              "
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* =================================================
            SLIDER DOTS
        ================================================= */}

        {showControls && (
          <div
            className="mt-8 flex justify-center gap-2"
            role="tablist"
            aria-label="Partner slides"
          >
            {Array.from({
              length: maxIndex + 1,
            }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Go to partner slide ${index + 1}`}
                aria-selected={currentIndex === index}
                className={`
                  h-2
                  rounded-full
                  transition-all
                  duration-300

                  ${
                    currentIndex === index
                      ? `
                        w-7
                        bg-yellow-400
                      `
                      : `
                        w-2
                        bg-slate-300
                        hover:bg-slate-400
                        dark:bg-slate-700
                        dark:hover:bg-slate-600
                      `
                  }
                `}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Partners;
