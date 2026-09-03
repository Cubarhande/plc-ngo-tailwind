import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import API from "../../services/api";

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
    <main
      className="
        min-h-screen
        bg-white
        text-slate-900
        transition-colors
        dark:bg-slate-950
        dark:text-white
      "
    >
      <div
        className="
          container-custom
          py-16
          md:py-20
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            mx-auto
            mb-10
            max-w-3xl
            text-center
          "
        >
          <span
            className="
              inline-flex
              rounded-full
              border
              border-yellow-400/30
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
            Our Work
          </span>

          <h1
            className="
              mt-5
              text-3xl
              font-bold
              md:text-4xl
            "
          >
            What We Do
          </h1>

          <p
            className="
              mt-4
              text-sm
              leading-7
              text-slate-500
              dark:text-slate-400
              md:text-base
            "
          >
            Explore the different areas where PLC Organisation works to create
            positive change.
          </p>
        </div>

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
