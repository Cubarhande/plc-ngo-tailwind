import { Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
// Public Components
import Navbar from "./components/public/Navbar";
import Footer from "./components/public/Footer";

// Admin Components
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";

// Public Pages
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import WhatWeDo from "./pages/public/WhatWeDo";
import Causes from "./pages/public/Causes";
import Events from "./pages/public/Events";
import Resources from "./pages/public/Resources";
import Contact from "./pages/public/Contact";

// Admin Pages
import Login from "./pages/admin/Login";
import Register from "./pages/admin/Register";
import Dashboard from "./pages/admin/Dashboard";
import Hero from "./pages/admin/Hero";
import AboutAdmin from "./pages/admin/AboutAdmin";
import AboutCategories from "./pages/admin/AboutCategories";
import AboutCards from "./pages/admin/AboutCards";
import WhatwedoCategories from "./pages/admin/WhatwedoCategories";
import WhatwedoCards from "./pages/admin/WhatwedoCards";
import CausesAdmin from "./pages/admin/CausesAdmin";
import PartnersAdmin from "./pages/admin/PartnersAdmin";
import Profile from "./pages/admin/Profile";

// Events - Independent
import EventsAdmin from "./pages/admin/EventsAdmin";
import EventCardsAdmin from "./pages/admin/EventCardsAdmin";
//
import ResourcesCategories from "./pages/admin/ResourcesCategories";
import ResourcesCards from "./pages/admin/ResourcesCards";

import ContactsAdmin from "./pages/admin/ContactsAdmin";
import SettingsAdmin from "./pages/admin/SettingsAdmin";

// =========================
// PUBLIC LAYOUT
// =========================

const PublicLayout = ({ children }) => {
  return (
    <>
      <Navbar />

      <main>{children}</main>

      <Footer />
    </>
  );
};

// =========================
// APP ROUTES
// =========================

const App = () => {
  return (
    <>
      {/* your routes */}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
      <Routes>
        {/* =========================
          PUBLIC WEBSITE
      ========================= */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-slate-50 px-6 py-20">
                {/* Background decoration */}
                <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-slate-200/60 blur-3xl" />
                <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-slate-200/60 blur-3xl" />

                <div className="relative mx-auto max-w-2xl text-center">
                  {/* 404 */}
                  <div className="mb-6">
                    <h1 className="text-8xl font-extrabold tracking-tight text-slate-200 sm:text-9xl">
                      404
                    </h1>
                  </div>

                  {/* Small badge */}
                  <div className="mx-auto mb-5 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
                    Page Not Found
                  </div>

                  {/* Heading */}
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    Oops! We can't find that page.
                  </h2>

                  {/* Description */}
                  <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
                    The page you are looking for may have been removed, renamed,
                    or temporarily unavailable. Please check the URL or return
                    to our homepage.
                  </p>

                  {/* Buttons */}
                  <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                      to="/"
                      className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Back to Home
                    </Link>

                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </PublicLayout>
          }
        />
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />

        <Route
          path="/about"
          element={
            <PublicLayout>
              <About />
            </PublicLayout>
          }
        />

        <Route
          path="/what-we-do"
          element={
            <PublicLayout>
              <WhatWeDo />
            </PublicLayout>
          }
        />

        <Route
          path="/causes"
          element={
            <PublicLayout>
              <Causes />
            </PublicLayout>
          }
        />

        {/* Public Events */}
        <Route
          path="/events"
          element={
            <PublicLayout>
              <Events />
            </PublicLayout>
          }
        />
        <Route
          path="/resources"
          element={
            <PublicLayout>
              <Resources />
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          }
        />

        {/* =========================
          ADMIN AUTH
      ========================= */}

        <Route path="/admin/login" element={<Login />} />

        <Route path="/admin/register" element={<Register />} />

        {/* =========================
          PROTECTED ADMIN
      ========================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Hero */}
          <Route path="hero" element={<Hero />} />

          {/* =========================
            ABOUT
        ========================= */}

          <Route path="about" element={<AboutAdmin />} />

          <Route path="about/categories" element={<AboutCategories />} />

          <Route path="about/cards" element={<AboutCards />} />

          {/* =========================
            WHAT WE DO
        ========================= */}

          <Route
            path="what-we-do/categories"
            element={<WhatwedoCategories />}
          />

          <Route path="what-we-do/cards" element={<WhatwedoCards />} />

          {/* =========================
            CAUSES
        ========================= */}

          <Route path="causes" element={<CausesAdmin />} />

          {/* =========================
            PARTNERS
        ========================= */}

          <Route path="partners" element={<PartnersAdmin />} />

          {/* =========================
            EVENTS
            COMPLETELY INDEPENDENT
        ========================= */}

          <Route path="events" element={<EventsAdmin />} />

          <Route path="event-cards" element={<EventCardsAdmin />} />

          <Route
            path="resources/categories"
            element={<ResourcesCategories />}
          />

          <Route path="resources/cards" element={<ResourcesCards />} />

          {/* =========================
            CONTACTS
        ========================= */}

          <Route path="contacts" element={<ContactsAdmin />} />

          {/* =========================
            SETTINGS
        ========================= */}

          <Route path="settings" element={<SettingsAdmin />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
