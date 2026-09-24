import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Sun, Moon, ChevronDown, ArrowRight } from "lucide-react";

import API from "../../services/api";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "http://localhost:5000";

const Navbar = () => {
  const [settings, setSettings] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  // =====================================================
  // CATEGORY DATA
  // =====================================================

  const [aboutCategories, setAboutCategories] = useState([]);
  const [whatWeDoCategories, setWhatWeDoCategories] = useState([]);
  const [resourceCategories, setResourceCategories] = useState([]);

  // =====================================================
  // DROPDOWN STATE
  // =====================================================

  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);

  // =====================================================
  // THEME
  // =====================================================

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // =====================================================
  // LOAD SETTINGS + CATEGORIES
  // =====================================================

  useEffect(() => {
    const loadNavbarData = async () => {
      try {
        const [
          settingsResponse,
          aboutResponse,
          whatWeDoResponse,
          resourceResponse,
        ] = await Promise.all([
          API.get("/settings"),
          API.get("/about-categories"),
          API.get("/WhatwedoCategories"),
          API.get("/resource-categories"),
        ]);

        // Settings
        if (settingsResponse.data?.success) {
          setSettings(settingsResponse.data.data);
        }

        // Categories
        setAboutCategories(aboutResponse.data?.data || []);
        setWhatWeDoCategories(whatWeDoResponse.data?.data || []);
        setResourceCategories(resourceResponse.data?.data || []);
      } catch (error) {
        console.error("Failed to load navbar data:", error);
      }
    };

    loadNavbarData();
  }, []);

  // =====================================================
  // APPLY THEME
  // =====================================================

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((previous) => !previous);
  };

  // =====================================================
  // CLOSE ALL MENUS
  // =====================================================

  const closeMenus = () => {
    setOpenDropdown(null);
    setMobileDropdown(null);
    setMobileMenu(false);
  };

  // =====================================================
  // DROPDOWN DATA
  // =====================================================

  const dropdownMenus = [
    {
      name: "About",
      key: "about",
      path: "/about",
      categories: aboutCategories,
    },
    {
      name: "What We Do",
      key: "whatWeDo",
      path: "/what-we-do",
      categories: whatWeDoCategories,
    },
    {
      name: "Resources",
      key: "resources",
      path: "/resources",
      categories: resourceCategories,
    },
  ];

  // =====================================================
  // CATEGORY URL
  // =====================================================

  const getCategoryUrl = (path, category) => {
    const slug = category.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");

    return `${path}?category=${slug}`;
  };

  // =====================================================
  // COMMON NAV LINK CLASS
  // =====================================================

  const navLinkClass = ({ isActive }) =>
    `
      rounded-lg
      px-3 py-2
      text-sm
      font-medium
      transition
      ${
        isActive
          ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
      }
    `;

  return (
    <header
      className="
        sticky top-0 z-50 border-b border-slate-200 bg-white/70 backdrop-blur-md
        transition-colors
        dark:border-slate-800
        dark:bg-slate-950/95
      "
    >
      {/* =====================================================
          MAIN NAVBAR
      ===================================================== */}

      <div className="container-custom flex h-20 items-center justify-between">
        {/* =================================================
            LOGO
        ================================================= */}

        <Link to="/" onClick={closeMenus} className="flex min-w-0 items-center">
          {settings?.logo ? (
            <img
              src={`${IMAGE_URL}${settings.logo}`}
              alt={settings?.siteName || "PLC Organisation"}
              loading="lazy"
              className="
                h-14
                w-auto
                max-w-[100px]
                object-contain 
              "
            />
          ) : (
            <span
              className="
                truncate
                text-lg
                font-bold
                text-slate-900
                dark:text-white
                sm:text-xl
              "
            >
              {settings?.siteName || "PLC Organisation"}
            </span>
          )}
        </Link>

        {/* =================================================
            DESKTOP NAV
        ================================================= */}

        <nav className="hidden items-center gap-2 lg:flex">
          {/* HOME */}

          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          {/* =================================================
              DROPDOWN MENUS
          ================================================= */}

          {dropdownMenus.map((menu) => {
            const isOpen = openDropdown === menu.key;

            return (
              <div
                key={menu.key}
                className="relative"
                onMouseEnter={() => setOpenDropdown(menu.key)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {/* MENU BUTTON */}

                <button
                  type="button"
                  onClick={() => setOpenDropdown(isOpen ? null : menu.key)}
                  className="
                    flex
                    items-center
                    gap-1
                    rounded-lg
                    px-3 py-2
                    text-sm
                    font-medium
                    text-slate-600
                    transition
                    hover:bg-slate-100
                    hover:text-slate-900
                    dark:text-slate-400
                    dark:hover:bg-slate-800
                    dark:hover:text-white
                  "
                >
                  {menu.name}

                  <ChevronDown
                    size={15}
                    className={`
                      transition-transform
                      duration-200
                      ${isOpen ? "rotate-180" : ""}
                    `}
                  />
                </button>

                {/* =================================================
                    DROPDOWN PANEL
                ================================================= */}

                {isOpen && (
                  <div
                    className="
                      absolute
                      left-1/2
                      top-full
                      z-50
                      w-[280px]
                      -translate-x-1/2
                      pt-3
                    "
                  >
                    <div
                      className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-2
                        shadow-2xl
                        dark:border-slate-700
                        dark:bg-slate-900
                      "
                    >
                      {/* =================================================
                          CATEGORY LIST ONLY
                      ================================================= */}

                      {menu.categories.length > 0 ? (
                        <div className="space-y-1">
                          {menu.categories.map((category) => (
                            <Link
                              key={category._id}
                              to={getCategoryUrl(menu.path, category)}
                              onClick={closeMenus}
                              className="
                                  group
                                  flex
                                  items-center
                                  justify-between
                                  gap-3
                                  rounded-xl
                                  px-4
                                  py-3
                                  transition-all
                                  duration-200
                                  hover:bg-yellow-50
                                  dark:hover:bg-yellow-400/10
                                "
                            >
                              <span
                                className="
                                    min-w-0
                                    truncate
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                    transition
                                    group-hover:text-yellow-600
                                    dark:text-slate-200
                                    dark:group-hover:text-yellow-400
                                  "
                              >
                                {category.name}
                              </span>

                              <ArrowRight
                                size={15}
                                className="
                                    shrink-0
                                    text-slate-300
                                    transition
                                    group-hover:translate-x-1
                                    group-hover:text-yellow-500
                                    dark:text-slate-600
                                  "
                              />
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-6 text-center">
                          <p
                            className="
                              text-sm
                              text-slate-500
                              dark:text-slate-400
                            "
                          >
                            No categories available.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* =================================================
              NORMAL LINKS
          ================================================= */}

          <NavLink to="/causes" className={navLinkClass}>
            Causes
          </NavLink>

          <NavLink to="/events" className={navLinkClass}>
            Events
          </NavLink>

          <NavLink to="/contact" className={navLinkClass}>
            Contact Us
          </NavLink>

          {/* =================================================
              THEME BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={toggleTheme}
            className="
              ml-2
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-slate-200
              text-slate-600
              transition
              hover:bg-slate-100
              hover:text-slate-900
              dark:border-slate-700
              dark:text-slate-300
              dark:hover:bg-slate-800
              dark:hover:text-white
            "
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            title={darkMode ? "Light mode" : "Dark mode"}
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </nav>

        {/* =================================================
            MOBILE ACTIONS
        ================================================= */}

        <div className="flex items-center gap-2 lg:hidden">
          {/* THEME */}

          <button
            type="button"
            onClick={toggleTheme}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-slate-200
              text-slate-600
              transition
              hover:bg-slate-100
              dark:border-slate-700
              dark:text-slate-300
              dark:hover:bg-slate-800
            "
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* MENU */}

          <button
            type="button"
            onClick={() => setMobileMenu((previous) => !previous)}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              text-slate-700
              hover:bg-slate-100
              dark:text-slate-300
              dark:hover:bg-slate-800
            "
            aria-label={mobileMenu ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenu}
          >
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* =====================================================
          MOBILE NAVIGATION
      ===================================================== */}

      {mobileMenu && (
        <div
          className="
            border-t
            border-slate-200
            bg-white
            dark:border-slate-800
            dark:bg-slate-950
            lg:hidden
          "
        >
          <nav className="container-custom py-3">
            {/* HOME */}

            <NavLink
              to="/"
              onClick={closeMenus}
              className={({ isActive }) =>
                `
                  mb-1
                  block
                  rounded-xl
                  px-4 py-3
                  text-sm
                  font-semibold
                  ${
                    isActive
                      ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                      : "text-slate-600 dark:text-slate-400"
                  }
                `
              }
            >
              Home
            </NavLink>

            {/* =================================================
                MOBILE DROPDOWNS
            ================================================= */}

            {dropdownMenus.map((menu) => {
              const isOpen = mobileDropdown === menu.key;

              return (
                <div
                  key={menu.key}
                  className="
                    border-b
                    border-slate-100
                    dark:border-slate-800
                  "
                >
                  {/* DROPDOWN TITLE */}

                  <button
                    type="button"
                    onClick={() => setMobileDropdown(isOpen ? null : menu.key)}
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-xl
                      px-4 py-3
                      text-left
                      text-sm
                      font-semibold
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    {menu.name}

                    <ChevronDown
                      size={17}
                      className={`
                        transition-transform
                        duration-200
                        ${isOpen ? "rotate-180" : ""}
                      `}
                    />
                  </button>

                  {/* =================================================
                      MOBILE CATEGORY LIST
                  ================================================= */}

                  {isOpen && (
                    <div
                      className="
                        mb-2
                        space-y-1
                        rounded-xl
                        bg-slate-50
                        p-2
                        dark:bg-slate-900
                      "
                    >
                      {menu.categories.length > 0 ? (
                        menu.categories.map((category) => (
                          <Link
                            key={category._id}
                            to={getCategoryUrl(menu.path, category)}
                            onClick={closeMenus}
                            className="
                                flex
                                items-center
                                justify-between
                                rounded-lg
                                px-3 py-3
                                text-sm
                                text-slate-600
                                transition
                                hover:bg-white
                                hover:text-slate-900
                                dark:text-slate-400
                                dark:hover:bg-slate-800
                                dark:hover:text-white
                              "
                          >
                            <span>{category.name}</span>

                            <ArrowRight
                              size={15}
                              className="
                                  text-slate-400
                                  dark:text-slate-600
                                "
                            />
                          </Link>
                        ))
                      ) : (
                        <p
                          className="
                            px-3
                            py-4
                            text-center
                            text-sm
                            text-slate-500
                            dark:text-slate-400
                          "
                        >
                          No categories available.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* =================================================
                NORMAL LINKS
            ================================================= */}

            <NavLink
              to="/causes"
              onClick={closeMenus}
              className={({ isActive }) =>
                `
                  mt-1
                  block
                  rounded-xl
                  px-4 py-3
                  text-sm
                  font-semibold
                  ${
                    isActive
                      ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                      : "text-slate-600 dark:text-slate-400"
                  }
                `
              }
            >
              Causes
            </NavLink>

            <NavLink
              to="/events"
              onClick={closeMenus}
              className={({ isActive }) =>
                `
                  mt-1
                  block
                  rounded-xl
                  px-4 py-3
                  text-sm
                  font-semibold
                  ${
                    isActive
                      ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                      : "text-slate-600 dark:text-slate-400"
                  }
                `
              }
            >
              Events
            </NavLink>

            <NavLink
              to="/contact"
              onClick={closeMenus}
              className={({ isActive }) =>
                `
                  mt-1
                  block
                  rounded-xl
                  px-4 py-3
                  text-sm
                  font-semibold
                  ${
                    isActive
                      ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                      : "text-slate-600 dark:text-slate-400"
                  }
                `
              }
            >
              Contact Us
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
