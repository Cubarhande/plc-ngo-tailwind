import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../../services/api";
import { BookOpen } from "lucide-react";

// =====================================================
// IMAGE URL
// =====================================================

const IMAGE_URL = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");

// =====================================================
// CREATE URL SLUG
// =====================================================

const createSlug = (name) => {
  return name
    ?.toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
};

// =====================================================
// IMAGE URL HELPER
// =====================================================

const getImageUrl = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("blob:")
  ) {
    return image;
  }

  return `${IMAGE_URL}${image.startsWith("/") ? image : `/${image}`}`;
};

// =====================================================
// ABOUT
// =====================================================

const About = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [about, setAbout] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cards, setCards] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");

  // =====================================================
  // LOAD ABOUT + CATEGORIES + CARDS
  // =====================================================

  useEffect(() => {
    const load = async () => {
      try {
        const [aboutResponse, categoryResponse, cardResponse] =
          await Promise.all([
            API.get("/about"),
            API.get("/about-categories"),
            API.get("/about-cards?limit=100"),
          ]);

        setAbout(aboutResponse.data?.data || null);

        setCategories(categoryResponse.data?.data || []);

        setCards(cardResponse.data?.data || []);
      } catch (error) {
        console.error("Failed to load About page:", error);
      }
    };

    load();
  }, []);

  // =====================================================
  // SELECT CATEGORY FROM URL
  // =====================================================

  useEffect(() => {
    if (categories.length === 0) return;

    const categoryFromUrl = searchParams.get("category");

    const selectedCategory = categories.find(
      (category) => createSlug(category.name) === categoryFromUrl,
    );

    if (selectedCategory) {
      setActiveCategory(selectedCategory._id);
    } else {
      // Default first category
      const firstCategory = categories[0];

      setActiveCategory(firstCategory._id);

      setSearchParams(
        {
          category: createSlug(firstCategory.name),
        },
        {
          replace: true,
        },
      );
    }
  }, [categories, searchParams, setSearchParams]);

  // =====================================================
  // CHANGE CATEGORY
  // =====================================================

  const handleCategoryChange = (categoryId) => {
    const category = categories.find((item) => item._id === categoryId);

    if (!category) return;

    setActiveCategory(categoryId);

    setSearchParams(
      {
        category: createSlug(category.name),
      },
      {
        replace: true,
      },
    );

    // Scroll page to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // ACTIVE CATEGORY
  // =====================================================

  const activeCategoryData = categories.find(
    (category) => category._id === activeCategory,
  );

  // =====================================================
  // ACTIVE CARDS
  // =====================================================

  const activeCards = cards.filter((card) => {
    const cardCategoryId = card.category?._id || card.category;

    return cardCategoryId === activeCategory && card.status !== false;
  });

  // =====================================================
  // LOADING
  // =====================================================

  if (!about) {
    return (
      <div
        className="
          min-h-[50vh]
          bg-white
          px-4
          py-20
          text-slate-900
          dark:bg-slate-950
          dark:text-white
        "
      >
        <div className="container-custom">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* =====================================================
          ABOUT INTRO
      ===================================================== */}

      <section
        className="
    relative isolate overflow-hidden
     border-slate-200
    bg-slate-50
    py-16 sm:py-20 lg:py-24
    transition-colors duration-300
    dark:border-white/10
    dark:bg-slate-950
  "
        style={{
          backgroundImage: activeCategoryData?.bgimage
            ? `url("${getImageUrl(activeCategoryData.bgimage)}")`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Background overlay */}
        <div
          className="
      absolute inset-0
      bg-white/55
      dark:bg-slate-950/65
    "
        />

        {/* Gradient for better text readability */}
        <div
          className="
      absolute inset-0
      bg-gradient-to-b
      from-white/40
      via-white/55
      to-white/80
      dark:from-slate-950/45
      dark:via-slate-950/65
      dark:to-slate-950/85
    "
        />

        {/* Soft yellow glow */}
        <div
          className="
      pointer-events-none
      absolute left-1/2 top-0
      h-72 w-72
      -translate-x-1/2
      rounded-full
      bg-yellow-400/20
      blur-3xl
      dark:bg-yellow-400/10
    "
        />

        {/* Content */}
        <div className="container-custom relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Icon */}
            <div
              className="
          mx-auto flex h-14 w-14 items-center justify-center
          rounded-2xl
          border border-yellow-500/40
          bg-white/90
          text-yellow-600
          shadow-lg shadow-black/5
          backdrop-blur-sm
          dark:border-yellow-400/30
          dark:bg-slate-900/80
          dark:text-yellow-400
        "
            >
              <BookOpen size={26} strokeWidth={2} />
            </div>

            {/* Label */}
            <div
              className="
          mt-6 inline-flex items-center
          rounded-full
          border border-yellow-500/40
          bg-yellow-50/90
          px-4 py-2
          text-xs font-bold
          uppercase tracking-[0.2em]
          text-yellow-800
          shadow-sm
          backdrop-blur-sm
          dark:border-yellow-400/30
          dark:bg-yellow-400/10
          dark:text-yellow-300
        "
            >
              Our company
            </div>

            {/* Heading */}
            <h1
              className="
          mt-5
          text-3xl font-extrabold
          leading-tight
          tracking-tight
          text-slate-950
          drop-shadow-sm
          sm:text-4xl
          lg:text-5xl
          dark:text-white
          dark:drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]
        "
            >
              {activeCategoryData?.name || "About Us"}
            </h1>

            {/* Description */}
            <p
              className="
          mx-auto mt-5
          max-w-2xl
          text-sm font-medium
          leading-7
          text-slate-700
          sm:text-base
          dark:text-slate-200
          dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]
        "
            >
              Learn more about our organisation, our work, and the difference we
              aim to make.
            </p>

            {/* Optional bottom accent */}
            <div
              className="
          mx-auto mt-8
          h-1 w-16
          rounded-full
          bg-yellow-500
          shadow-sm
          dark:bg-yellow-400
        "
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          ABOUT CATEGORIES
      ===================================================== */}

      {categories.length > 0 && (
        <section
          className="
          container-custom
          py-16
          md:py-20
        "
        >
          {/* =====================================================
              BACKGROUND OVERLAY
          ===================================================== */}

          {/* =====================================================
              CONTENT
          ===================================================== */}

          <div className="container-custom relative z-10">
            {/* =================================================
                HEADER
            ================================================= */}

            {/* =================================================
                CATEGORY TABS
            ================================================= */}

            <div
              className="
                mb-10
                flex
                flex-wrap
                justify-center
                gap-2
                rounded-2xl
                border
                border-slate-200
                bg-white/95
                p-2
                shadow-sm
                backdrop-blur-sm
                dark:border-slate-800
                dark:bg-slate-900/95
              "
            >
              {categories.map((category) => (
                <button
                  key={category._id}
                  type="button"
                  onClick={() => handleCategoryChange(category._id)}
                  className={`
                    rounded-lg
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    transition-all
                    duration-200

                    ${
                      activeCategory === category._id
                        ? `
                          bg-slate-900
                          text-white
                          shadow-lg
                          dark:bg-yellow-400
                          dark:text-slate-950
                        `
                        : `
                          text-slate-600
                          hover:bg-slate-100
                          hover:text-slate-900
                          dark:text-slate-400
                          dark:hover:bg-slate-800
                          dark:hover:text-white
                        `
                    }
                  `}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* =================================================
                ACTIVE CATEGORY
            ================================================= */}

            {activeCategoryData && (
              <div
                className="
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white/90
                  p-8
                  shadow-sm
                  backdrop-blur-sm
                  dark:border-slate-800
                  dark:bg-slate-900/90
                "
              >
                <div className="relative z-10">
                  <h3
                    className="
                      text-2xl
                      font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {activeCategoryData.name}
                  </h3>

                  {activeCategoryData.description && (
                    <p
                      className="
                        mt-3
                        max-w-3xl
                        leading-7
                        text-slate-600
                        dark:text-slate-400
                      "
                    >
                      {activeCategoryData.description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* =================================================
                CARDS
            ================================================= */}

            {activeCards.length > 0 ? (
              <div
                className="
                  mt-8
                  grid
                  gap-6
                  sm:grid-cols-2
                  lg:grid-cols-3
                "
              >
                {activeCards.map((card) => (
                  <div
                    key={card._id}
                    className="
                      group
                      overflow-hidden
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      shadow-sm
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-xl
                      dark:border-slate-800
                      dark:bg-slate-900
                    "
                  >
                    {/* =================================================
                        CARD IMAGE
                    ================================================= */}

                    {card.image && (
                      <div className="overflow-hidden">
                        <img
                          src={getImageUrl(card.image)}
                          alt={card.title || "About PLC"}
                          loading="lazy"
                          className="
                            h-52
                            w-full
                            object-cover
                            transition
                            duration-500
                            group-hover:scale-105
                          "
                        />
                      </div>
                    )}

                    {/* =================================================
                        CARD CONTENT
                    ================================================= */}

                    <div className="p-6">
                      <h3
                        className="
                          text-xl
                          font-semibold
                          text-slate-900
                          dark:text-white
                        "
                      >
                        {card.title}
                      </h3>

                      {card.description && (
                        <p
                          className="
                            mt-3
                            text-sm
                            leading-7
                            text-slate-600
                            dark:text-slate-400
                          "
                        >
                          {card.description}
                        </p>
                      )}

                      {card.buttonText && (
                        <a
                          href={card.buttonLink || "#"}
                          className="
                            mt-5
                            inline-flex
                            items-center
                            rounded-lg
                            bg-slate-900
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            shadow-sm
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                            hover:bg-slate-800
                            dark:bg-white
                            dark:text-slate-900
                            dark:hover:bg-slate-100
                          "
                        >
                          {card.buttonText}

                          <span
                            className="
                              ml-2
                              transition-transform
                              duration-200
                              group-hover:translate-x-1
                            "
                          >
                            →
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="
                  mt-8
                  rounded-2xl
                  border
                  border-dashed
                  border-slate-300
                  bg-white/95
                  px-6
                  py-12
                  text-center
                  backdrop-blur-sm
                  dark:border-slate-700
                  dark:bg-slate-900/95
                "
              >
                <p
                  className="
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  No active cards available for this category.
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
};

export default About;
