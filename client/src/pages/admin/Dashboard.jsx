import { useEffect, useState } from "react";
import {
  Image,
  FileText,
  Layers,
  CreditCard,
  Heart,
  Handshake,
  CalendarDays,
  MessageSquare,
} from "lucide-react";

import API from "../../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    hero: 0,
    aboutCategories: 0,
    aboutCards: 0,
    categories: 0,
    cards: 0,
    causes: 0,
    partners: 0,
    events: 0,
    eventCards: 0,
    messages: 0,
    resourceCategories: 0,
    resourceCards: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     GET API LIST DATA SAFELY
  ===================================================== */

  const getList = (response) => {
    if (Array.isArray(response?.data?.data)) {
      return response.data.data;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    return [];
  };

  /* =====================================================
     LOAD DASHBOARD DATA
  ===================================================== */

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          heroRes,
          aboutCategoriesRes,
          aboutCardsRes,
          categoriesRes,
          cardsRes,
          causesRes,
          partnersRes,
          eventsRes,
          eventCardsRes,
          contactsRes,
          resourceCategoriesRes,
          resourceCardsRes,
        ] = await Promise.all([
          API.get("/hero"),
          API.get("/about-categories"),
          API.get("/about-cards"),
          API.get("/whatwedocategories"),
          API.get("/whatwedocards"),
          API.get("/causes"),
          API.get("/partners"),
          API.get("/events"),
          API.get("/event-cards"),
          API.get("/contacts"),
          API.get("/resource-categories"),
          API.get("/resource-cards"),
        ]);

        const heroData = getList(heroRes);

        setStats({
          hero: heroData.length,

          aboutCategories: getList(aboutCategoriesRes).length,

          aboutCards: getList(aboutCardsRes).length,

          categories: getList(categoriesRes).length,

          cards: getList(cardsRes).length,

          causes: getList(causesRes).length,

          partners: getList(partnersRes).length,

          events: getList(eventsRes).length,

          eventCards: getList(eventCardsRes).length,

          messages: getList(contactsRes).length,

          resourceCategories: getList(resourceCategoriesRes).length,

          resourceCards: getList(resourceCardsRes).length,
        });
      } catch (err) {
        console.error("Failed to load dashboard:", err);

        setError(
          err.response?.data?.message || "Unable to load dashboard statistics.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  /* =====================================================
     STATISTICS
  ===================================================== */

  const statsCards = [
    {
      title: "Hero",
      value: stats.hero,
      icon: Image,
    },
    {
      title: "About Categories",
      value: stats.aboutCategories,
      icon: Layers,
    },
    {
      title: "About Cards",
      value: stats.aboutCards,
      icon: CreditCard,
    },
    {
      title: "What We Do Categories",
      value: stats.categories,
      icon: FileText,
    },
    {
      title: "What We Do Cards",
      value: stats.cards,
      icon: CreditCard,
    },
    {
      title: "Causes",
      value: stats.causes,
      icon: Heart,
    },
    {
      title: "Partners",
      value: stats.partners,
      icon: Handshake,
    },
    {
      title: "Events",
      value: stats.events,
      icon: CalendarDays,
    },
    {
      title: "Event Cards",
      value: stats.eventCards,
      icon: CreditCard,
    },
    {
      title: "Resource Categories",
      value: stats.resourceCategories,
      icon: FileText,
    },
    {
      title: "Resource Cards",
      value: stats.resourceCards,
      icon: CreditCard,
    },
    {
      title: "Contact Messages",
      value: stats.messages,
      icon: MessageSquare,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-1">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage and monitor your PLC website content.
        </p>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {statsCards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
                group
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-slate-300
                hover:shadow-lg
              "
            >
              <div className="flex items-center justify-between gap-4">
                {/* CONTENT */}

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-500">
                    {item.title}
                  </p>

                  <div className="mt-2">
                    {loading ? (
                      <div className="h-9 w-14 animate-pulse rounded-lg bg-slate-200" />
                    ) : (
                      <p className="text-3xl font-bold tracking-tight text-slate-900">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>

                {/* ICON */}

                <div
                  className="
                    shrink-0
                    rounded-xl
                    bg-slate-100
                    p-3
                    text-slate-700
                    transition-all
                    duration-300
                    group-hover:bg-slate-900
                    group-hover:text-white
                  "
                >
                  <Icon size={22} strokeWidth={2} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
