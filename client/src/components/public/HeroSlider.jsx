import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import API from "../../services/api";

const IMAGE_URL =
  import.meta.env.VITE_IMAGE_URL || "http://localhost:5000";

const HeroSlider = () => {
  const [heroes, setHeroes] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH HEROES ================= */

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const response = await API.get("/hero");

        const data = response.data.data || [];

        const activeHeroes = data.filter(
          (item) => item.status === true
        );

        setHeroes(activeHeroes);
      } catch (error) {
        console.error("Failed to load heroes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroes();
  }, []);

  /* ================= AUTO SLIDER ================= */

  useEffect(() => {
    if (heroes.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === heroes.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroes.length]);

  /* ================= NEXT ================= */

  const nextSlide = () => {
    setCurrent((prev) =>
      prev === heroes.length - 1 ? 0 : prev + 1
    );
  };

  /* ================= PREVIOUS ================= */

  const previousSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? heroes.length - 1 : prev - 1
    );
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <section className="flex min-h-[600px] items-center justify-center bg-slate-900 dark:bg-black">
        <p className="text-white">Loading...</p>
      </section>
    );
  }

  /* ================= EMPTY ================= */

  if (heroes.length === 0) {
    return (
      <section className="flex min-h-[600px] items-center justify-center bg-slate-900 px-6 text-center text-white dark:bg-black">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Creating a better future together
          </h1>

          <p className="mt-4 text-slate-300">
            Working together to create positive change.
          </p>
        </div>
      </section>
    );
  }

  const hero = heroes[current];

  return (
    <section className="relative min-h-[600px] overflow-hidden sm:min-h-[650px] lg:min-h-[750px]">
      
      {/* ================= BACKGROUND ================= */}

      <div
        key={hero._id}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("${IMAGE_URL}${hero.image}")`,
        }}
      />

      {/* ================= DARK OVERLAY ================= */}

      <div className="absolute inset-0 bg-black/50" />

      {/* ================= GRADIENT ================= */}

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />

      {/* ================= CONTENT ================= */}

      <div className="container-custom relative z-10 flex min-h-[600px] items-center sm:min-h-[650px] lg:min-h-[750px]">
        <div className="max-w-3xl px-4 py-20 sm:px-8 lg:px-0">

          {/* ================= DESCRIPTION / SMALL TEXT ================= */}

          {hero.heading && (
            <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-yellow-400 sm:mt-6 sm:text-lg sm:leading-8">
              {hero.heading}
            </p>
          )}

          {/* ================= HEADING ================= */}

          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {hero.description}
          </h1>

          {/* ================= BUTTON ================= */}

          {hero.buttonText && hero.buttonLink && (
            <div className="mt-7 sm:mt-8">
              {hero.buttonLink.startsWith("/") ? (
                <Link
                  to={hero.buttonLink}
                  className="inline-flex items-center rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition duration-200 hover:-translate-y-1 hover:bg-slate-100 sm:px-7"
                >
                  {hero.buttonText}
                </Link>
              ) : (
                <Link
                  to={hero.buttonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition duration-200 hover:-translate-y-1 hover:bg-slate-100 sm:px-7"
                >
                  {hero.buttonText}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ================= LEFT ARROW ================= */}

      {heroes.length > 1 && (
        <button
          type="button"
          onClick={previousSlide}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm transition hover:bg-white hover:text-slate-900 sm:flex sm:left-5 sm:h-12 sm:w-12 lg:left-8"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* ================= RIGHT ARROW ================= */}

      {heroes.length > 1 && (
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm transition hover:bg-white hover:text-slate-900 sm:flex sm:right-5 sm:h-12 sm:w-12 lg:right-8"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* ================= BOTTOM CONTROLS ================= */}

      {heroes.length > 1 && (
        <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
          {heroes.map((item, index) => (
            <button
              key={item._id}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                current === index
                  ? "w-8 bg-white"
                  : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}

      {/* ================= SLIDE COUNT ================= */}

      {heroes.length > 1 && (
        <div className="absolute bottom-7 right-5 z-20 hidden text-sm font-medium text-white/80 sm:block lg:right-8">
          {String(current + 1).padStart(2, "0")}
          {" / "}
          {String(heroes.length).padStart(2, "0")}
        </div>
      )}
    </section>
  );
};

export default HeroSlider;