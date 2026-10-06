import { useEffect, useState } from "react";

import { Mail, Phone, MapPin } from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import CTASection from "./CTASection";
import API from "../../services/api";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "http://localhost:5000";

const Footer = () => {
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

  const socialLinks = [
    {
      name: "Facebook",
      url: settings?.facebook,
      icon: FaFacebookF,
    },
    {
      name: "Instagram",
      url: settings?.instagram,
      icon: FaInstagram,
    },
    {
      name: "Twitter",
      url: settings?.twitter,
      icon: FaTwitter,
    },
    {
      name: "LinkedIn",
      url: settings?.linkedin,
      icon: FaLinkedinIn,
    },
    {
      name: "YouTube",
      url: settings?.youtube,
      icon: FaYoutube,
    },
  ];

  return (
    <>
    
<CTASection />
    <footer className="pt-16 bg-slate-950 py-10 text-white sm:pt-20">
      {/* ================= MAIN FOOTER ================= */}

      <div className="container-custom grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 md:gap-12">
        {/* ================= COMPANY ================= */}

        <div className="min-w-0">
          {settings?.logo ? (
            <Link to="/">
              <img
                src={`${IMAGE_URL}${settings.logo}`}
                alt={settings?.siteName || "PLC Organisation"} loading="lazy"
                className="mb-4 h-16 w-auto max-w-[180px] object-contain "
              />
            </Link>
          ) : (
            <Link to="/" className="text-xl font-bold">
              {settings?.siteName || "PLC Organisation"}
            </Link>
          )}

          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
            {settings?.siteFooter ||
              " We are a non-profit organization dedicated to making a positive impact in our community. Join us in our mission to create a better future for all."}
          </p>

          {/* SOCIAL ICONS */}

          <div className="mt-5 flex flex-wrap gap-3">
            {socialLinks.map((social) => {
              if (!social.url) {
                return null;
              }

              const Icon = social.icon;

              return (
                <Link
                  key={social.name}
                  to={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition-all duration-200 hover:-translate-y-1 hover:bg-white hover:text-slate-950"
                >
                  <Icon size={17} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* ================= QUICK LINKS ================= */}

        <div>
          <h4 className="text-base font-semibold sm:text-lg">Quick Links</h4>

          <div className="my-3 space-y-4 text-sm text-slate-400">
            <Link
              to="/about"
              className="block transition-all hover:translate-x-1 hover:text-white"
            >
              About
            </Link>

            <Link
              to="/what-we-do"
              className="block transition-all hover:translate-x-1 hover:text-white"
            >
              What We Do
            </Link>

            <Link
              to="/causes"
              className="block transition-all hover:translate-x-1 hover:text-white"
            >
              Causes
            </Link>

            <Link
              to="/events"
              className="block transition-all hover:translate-x-1 hover:text-white"
            >
              Events
            </Link>

            <Link
              to="/contact"
              className="block transition-all hover:translate-x-1 hover:text-white"
            >
              Contact
            </Link>

            <Link
              to="/admin/login"
              className="block transition-all hover:translate-x-1 hover:text-white"
            >
              Login
            </Link>
          </div>
        </div>

        {/* ================= CONTACT ================= */}

        <div className="min-w-0">
          <h4 className="text-base font-semibold sm:text-lg">Contact Us</h4>

          <div className="my-3 space-y-4 text-sm text-slate-400">
            {/* EMAIL */}

            {settings?.email && (
              <Link
                to={`mailto:${settings.email}`}
                className="group flex min-w-0 items-start gap-3 transition hover:text-white"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition group-hover:bg-white group-hover:text-slate-950">
                  <Mail size={17} />
                </span>

                <span className="min-w-0 break-words pt-1.5">
                  {settings.email}
                </span>
              </Link>
            )}

            {/* PHONE */}

            {settings?.phone && (
              <Link
                to={`tel:${settings.phone.replace(/-/g, "")}`}
                className="group flex items-start gap-3 transition hover:text-white"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition group-hover:bg-white group-hover:text-slate-950">
                  <Phone size={17} />
                </span>

                <span className="pt-1.5">{settings.phone}</span>
              </Link>
            )}

            {/* ADDRESS */}

            {settings?.address && (
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
                  <MapPin size={17} />
                </span>

                <span className="min-w-0 break-words leading-6">
                  {settings.address}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= COPYRIGHT ================= */}

      <div className="container-custom mt-10 border-t border-slate-800 pt-6">
        <div className="flex flex-col gap-3 text-center text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>
            © {new Date().getFullYear()}{" "}
            {settings?.siteName || "PLC Organisation"}. All rights reserved.
          </p>

          <p>Powered by {settings?.siteName || "PLC Organisation"}</p>
        </div>
      </div>
    </footer>
        </>
  );
};

export default Footer;
