import {
  LayoutDashboard,
  Home,
  Image,
  FileText,
  Layers,
  CreditCard,
  Heart,
  Handshake,
  CalendarDays,
  ListChecks,
  MessageSquare,
  Settings,
  ChevronDown,
  BookOpen,
  FolderTree,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";
import API from "../../services/api";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "http://localhost:5000";

const menu = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },

  // Home
  {
    name: "Home",
    icon: Home,
    children: [
      {
        name: "Hero",
        path: "/admin/hero",
        icon: Image,
      },
    ],
  },

  // About
  {
    name: "About",
    icon: FileText,
    children: [
      {
        name: "About",
        path: "/admin/about",
        icon: FileText,
      },
      {
        name: "About Categories",
        path: "/admin/about/categories",
        icon: Layers,
      },
      {
        name: "About Cards",
        path: "/admin/about/cards",
        icon: CreditCard,
      },
    ],
  },

  // What We Do
  {
    name: "What We Do",
    icon: Layers,
    children: [
      {
        name: "What We Do Categories",
        path: "/admin/what-we-do/categories",
        icon: Layers,
      },
      {
        name: "What We Do Cards",
        path: "/admin/what-we-do/cards",
        icon: CreditCard,
      },
    ],
  },

  // Causes
  {
    name: "Causes",
    path: "/admin/causes",
    icon: Heart,
  },

  // Partners
  {
    name: "Partners",
    path: "/admin/partners",
    icon: Handshake,
  },

  // Events
  {
    name: "Events",
    icon: CalendarDays,
    children: [
      {
        name: "Events",
        path: "/admin/events",
        icon: CalendarDays,
      },
      {
        name: "Event Cards",
        path: "/admin/event-cards",
        icon: ListChecks,
      },
    ],
  },

  // Resources
  {
    name: "Resources",
    icon: BookOpen,
    children: [
      {
        name: "Resources Categories",
        path: "/admin/resources/categories",
        icon: FolderTree,
      },
      {
        name: "Resources Cards",
        path: "/admin/resources/cards",
        icon: FileText,
      },
    ],
  },

  // Contact
  {
    name: "Contact Messages",
    path: "/admin/contacts",
    icon: MessageSquare,
  },

  // Settings
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState("Home");

  const toggleMenu = (name) => {
    setOpenMenu((current) => (current === name ? null : name));
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/admin/login");
  };

  const handleNavigation = () => {
    // Close sidebar on mobile
    onClose();
  };

  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await API.get("/settings");

        if (response.data.success) {
          setSettings(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load footer settings:", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="
            fixed inset-0 z-40
            bg-black/50
            md:hidden
          "
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-72
          flex-col
          bg-slate-950
          text-white
          shadow-2xl

          transform
          transition-transform
          duration-300
          ease-in-out

          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          md:w-64
          md:translate-x-0
          md:shadow-none
        `}
      >
        {/* =====================================================
            LOGO
        ====================================================== */}

        <div className="flex h-16 shrink-0 items-center justify-between text-center border-b border-slate-800 px-5">
          {settings?.logo ? (
            <img
              src={`${IMAGE_URL}${settings.logo}`}
              alt={settings?.siteName || "PLC Admin"} loading="lazy"
              className="h-14 w-auto max-w-[180px] object-contain  "
            />
          ) : (
            <span className="truncate text-lg font-bold text-slate-900 sm:text-xl">
              {settings?.siteName || "PLC Admin"}
            </span>
          )}
          {/* Mobile close button */}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-lg
              text-slate-400
              transition
              hover:bg-slate-800
              hover:text-white
              md:hidden
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* =====================================================
            MENU
        ====================================================== */}

        <nav className="flex-1 overflow-x-hidden overflow-y-auto p-3">
          {menu.map((item) => {
            const Icon = item.icon;

            {
              /* =================================================
                PARENT MENU
            ================================================= */
            }

            if (item.children) {
              const isOpenMenu = openMenu === item.name;

              return (
                <div key={item.name} className="mb-1">
                  <button
                    type="button"
                    onClick={() => toggleMenu(item.name)}
                    className={`
                      flex w-full
                      items-center
                      justify-between
                      rounded-lg
                      px-3 py-3
                      text-sm
                      transition

                      ${
                        isOpenMenu
                          ? "bg-slate-800 text-white"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }
                    `}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <Icon size={18} className="shrink-0" />

                      <span className="truncate">{item.name}</span>
                    </span>

                    <ChevronDown
                      size={16}
                      className={`
                        shrink-0
                        transition-transform
                        duration-200

                        ${isOpenMenu ? "rotate-180" : ""}
                      `}
                    />
                  </button>

                  {/* =================================================
                      CHILDREN
                  ================================================= */}

                  {isOpenMenu && (
                    <div className="ml-3 mt-1 border-l border-slate-700 pl-2">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;

                        return (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            end={child.path === "/admin"}
                            onClick={handleNavigation}
                            className={({ isActive }) =>
                              `
                                mb-1 flex
                                min-w-0
                                items-center
                                gap-3
                                rounded-lg
                                px-3 py-2.5
                                text-sm
                                transition

                                ${
                                  isActive
                                    ? "bg-white font-semibold text-slate-900"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }
                                `
                            }
                          >
                            <ChildIcon size={16} className="shrink-0" />

                            <span className="truncate">{child.name}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            {
              /* =================================================
                INDEPENDENT MENU
            ================================================= */
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                onClick={handleNavigation}
                className={({ isActive }) =>
                  `
                  mb-1 flex
                  min-w-0
                  items-center
                  gap-3
                  rounded-lg
                  px-3 py-3
                  text-sm
                  transition

                  ${
                    isActive
                      ? "bg-white font-semibold text-slate-900"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }
                  `
                }
              >
                <Icon size={18} className="shrink-0" />

                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* =====================================================
            OPTIONAL FOOTER
        ====================================================== */}

        {/* <div className="shrink-0 border-t border-slate-800 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="
              flex w-full
              items-center
              gap-3
              rounded-lg
              px-3 py-3
              text-sm
              text-red-400
              transition
              hover:bg-red-500/10
              hover:text-red-300
            "
          >
            <span>Logout</span>
          </button>
        </div> */}
      </aside>
    </>
  );
};

export default Sidebar;
