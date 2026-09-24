import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import API from "../../services/api";
import { BookOpen } from "lucide-react";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "http://localhost:5000";

// =====================================================
// CREATE URL SLUG
// Example:
// "Community Development" → "community-development"

// =====================================================

const createSlug = (name) => {
  return name
    ?.toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-+/g, "-");
};

const WhatWeDo = () => {
  const [categories, setCategories] = useState([]);
  const [cards, setCards] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    const load = async () => {
      try {
        const [categoryResponse, cardResponse] = await Promise.all([
          API.get("/WhatwedoCategories"),
          API.get("/WhatwedoCards?limit=100"),
        ]);

        setCategories(categoryResponse.data?.data || []);

        setCards(cardResponse.data?.data || []);
      } catch (error) {
        console.error("Failed to load What We Do:", error);
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

    // Find category by slug
    const selectedCategory = categories.find(
      (category) => createSlug(category.name) === categoryFromUrl,
    );

    if (selectedCategory) {
      // URL category found
      setActiveCategory(selectedCategory._id);
    } else {
      // No valid category in URL
      const firstCategory = categories[0];

      setActiveCategory(firstCategory._id);

      // Set first category slug in URL
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

    // Set active category using MongoDB ID
    setActiveCategory(categoryId);

    // Put category name slug in URL
    setSearchParams(
      {
        category: createSlug(category.name),
      },
      {
        replace: true,
      },
    );
  };

  // =====================================================
  // SELECTED CATEGORY
  // =====================================================

  const selectedCategory = categories.find(
    (category) => category._id === activeCategory,
  );

  // =====================================================
  // FILTER CARDS
  // =====================================================

  const categoryCards = cards.filter((card) => {
    const cardCategoryId = card.category?._id || card.category;

    return cardCategoryId === activeCategory && card.status !== false;
  });

  return (
    <main className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* =================================================
            HEADER
        ================================================= */}
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
          backgroundImage: selectedCategory?.bgimage
            ? `url("${IMAGE_URL}${selectedCategory.bgimage}")`
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
              Our Work
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
              {selectedCategory?.name || "About Us"}
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
                Explore the different areas where PLC Organisation works to create
            positive change.
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
           
      

      <div
        className="
          container-custom
          py-16
          md:py-20
        "
      >
        {/* =================================================
            CATEGORY TABS
        ================================================= */}

        {categories.length > 0 && (
          <div className="mb-12">
            <div
              className="
                overflow-x-auto
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                p-2
                shadow-sm
                dark:border-slate-800
                dark:bg-slate-900
                dark:shadow-xl
              "
            >
              <div
                className="
                  flex
                  min-w-max
                  justify-center
                  gap-2
                "
              >
                {categories.map((category) => {
                  const isActive = activeCategory === category._id;

                  return (
                    <button
                      key={category._id}
                      type="button"
                      onClick={() => handleCategoryChange(category._id)}
                      className={`
                          rounded-xl
                          px-5
                          py-3
                          text-sm
                          font-semibold
                          transition-all
                          duration-300

                          ${
                            isActive
                              ? `
                                bg-slate-900
                                text-white
                                shadow-lg
                                dark:bg-yellow-400
                                dark:text-slate-950
                              `
                              : `
                                text-slate-600
                                hover:bg-white
                                hover:text-slate-950
                                dark:text-slate-400
                                dark:hover:bg-slate-800
                                dark:hover:text-white
                              `
                          }
                        `}
                    >
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            ACTIVE CATEGORY
        ================================================= */}

        {selectedCategory && (
          <section>
            <div className="mb-10">
              <h2
                className="
                  text-2xl
                  font-bold
                  md:text-3xl
                "
              >
                {selectedCategory.name}
              </h2>

              {selectedCategory.description && (
                <p
                  className="
                    mt-3
                    max-w-3xl
                    text-sm
                    leading-7
                    text-slate-500
                    dark:text-slate-400
                    md:text-base
                  "
                >
                  {selectedCategory.description}
                </p>
              )}
            </div>

            {/* =================================================
                CARDS
            ================================================= */}

            {categoryCards.length > 0 ? (
              <div
                className="
                  grid
                  gap-6
                  sm:grid-cols-2
                  lg:grid-cols-3
                "
              >
                {categoryCards.map((card) => (
                  <article
                    key={card._id}
                    className="
                        group
                        overflow-hidden
                        rounded-3xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                        transition-all
                        duration-300
                        hover:-translate-y-2
                        hover:shadow-xl
                        dark:border-white/10
                        dark:bg-slate-900
                        dark:shadow-xl
                        dark:hover:border-yellow-400/30
                      "
                    style={{
                      backgroundColor: card.backgroundColor || undefined,
                    }}
                  >
                    {/* IMAGE */}

                    {card.image ? (
                      <div className="overflow-hidden">
                        <img
                          src={`${IMAGE_URL}${card.image}`}
                          alt={card.title || "What We Do"}
                          loading="lazy"
                          className="
                              h-52
                              w-full
                              object-cover
                              transition
                              duration-700
                              group-hover:scale-105
                            "
                        />
                      </div>
                    ) : (
                      <div
                        className="
                            flex
                            h-52
                            items-center
                            justify-center
                            bg-slate-100
                            dark:bg-slate-800
                          "
                      >
                        <span
                          className="
                              text-sm
                              text-slate-400
                            "
                        >
                          No Image
                        </span>
                      </div>
                    )}

                    {/* CONTENT */}

                    <div className="p-6">
                      <h3
                        className="
                            text-xl
                            font-bold
                            text-slate-900
                           
                          "
                      >
                        {card.title}
                      </h3>

                      {card.description && (
                        <p
                          className="
                              mt-3
                              line-clamp-6
                              text-sm
                              leading-7
                              text-slate-600
                              dark:text-slate-400
                            "
                        >
                          {card.description}
                        </p>
                      )}

                      {card.buttonText && card.buttonLink && (
                        <a
                          href={card.buttonLink}
                          className="
                                mt-5
                                inline-flex
                                rounded-full
                                bg-slate-900
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-slate-700
                                dark:bg-yellow-400
                                dark:text-slate-950
                                dark:hover:bg-yellow-300
                              "
                        >
                          {card.buttonText}
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div
                className="
                  rounded-3xl
                  border
                  border-dashed
                  border-slate-300
                  bg-slate-50
                  px-6
                  py-16
                  text-center
                  dark:border-slate-700
                  dark:bg-slate-900
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
          </section>
        )}

        {/* =================================================
            NO CATEGORIES
        ================================================= */}

        {categories.length === 0 && (
          <div
            className="
              rounded-3xl
              bg-slate-50
              px-6
              py-16
              text-center
              dark:bg-slate-900
            "
          >
            <p
              className="
                text-slate-500
                dark:text-slate-400
              "
            >
              No categories available.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default WhatWeDo;
