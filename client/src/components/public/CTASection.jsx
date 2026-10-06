import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { Phone, Mail, ArrowRight } from "lucide-react";

// =====================================================
// CTA SECTION
// =====================================================

const CTASection = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===================================================
  // FETCH SETTINGS
  // ===================================================

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await API.get("/settings");

        if (response.data?.success) {
          setSettings(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load CTA settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return null;
  }

  // ===================================================
  // DISABLED
  // ===================================================

  if (!settings || settings.ctaEnabled === false) {
    return null;
  }

  // ===================================================
  // VALUES
  // ===================================================

  const phone = settings.ctaPhone || settings.phone || "";
  const email = settings.ctaEmail || settings.email || "";

  const preTitle = settings.ctaPreTitle || "";
  const preTitleHighlight = settings.ctaPreTitleHighlight || "";

  const title = settings.ctaTitle || "";
  const titleHighlight = settings.ctaTitleHighlight || "";

  const buttonText = settings.ctaButtonText || "";
  const buttonLink = settings.ctaButtonLink || "/contact";

  // ===================================================
  // EXTERNAL LINK
  // ===================================================

  const isExternalLink =
    buttonLink.startsWith("http://") ||
    buttonLink.startsWith("https://") ||
    buttonLink.startsWith("mailto:") ||
    buttonLink.startsWith("tel:");

  // ===================================================
  // BUTTON
  // ===================================================

  const buttonClassName = `
    group mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3 text-sm font-bold text-white transition duration-300 hover:bg-slate-800 dark:bg-yellow-400 dark:text-slate-950 dark:hover:bg-yellow-300
  `;

  return (
    <section
      aria-labelledby="cta-title"
      className="
        relative
        isolate
        overflow-hidden
        border-t
        border-slate-200
        bg-gradient-to-br
        from-slate-50
        via-blue-50
        to-slate-100
        py-16
        transition-colors
        duration-300

        dark:border-white/10
        dark:from-[#061426]
        dark:via-[#0B1F3A]
        dark:to-[#103B5C]

        sm:py-20
        lg:py-24
      "
    >
      {/* =================================================
          THEME DECORATION
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          -top-32
          h-80
          w-80
          rounded-full
          bg-blue-500/10
          blur-3xl

          dark:bg-blue-400/10
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          -right-20
          h-96
          w-96
          rounded-full
          bg-yellow-400/10
          blur-3xl

          dark:bg-yellow-400/10
        "
      />

      {/* =================================================
          SUBTLE CENTER GLOW
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-72
          w-72
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-blue-400/5
          blur-3xl

          dark:bg-cyan-400/5
        "
      />

      {/* =================================================
          CONTENT
      ================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-4
          sm:px-6
          lg:px-8
        "
      >
        <div
          className="
            grid
            items-center
            gap-10

            lg:grid-cols-12
            lg:gap-14
          "
        >
          {/* =================================================
              CONTACT INFORMATION
          ================================================== */}

          <div className="lg:col-span-4">
            <div
              className="
                rounded-3xl
                border
                border-slate-200
                bg-white/80
                p-6
                shadow-sm
                backdrop-blur-sm

                dark:border-white/10
                dark:bg-white/[0.04]
                dark:shadow-xl
              "
            >
              {/* LABEL */}

              <p
                className="
                  mb-5
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-slate-500

                  dark:text-slate-400
                "
              >
                Get in touch
              </p>

              <div className="space-y-3">
                {/* =================================================
                    PHONE
                ================================================== */}

                {phone && (
                  <Link
                    to={`tel:${phone.replace(/-/g, "")}`}
                    aria-label={`Call ${phone}`}
                    className="
                      group
                      flex
                      items-center
                      gap-4
                      rounded-2xl
                      p-2
                      transition-all
                      duration-300
                      hover:bg-slate-100

                      dark:hover:bg-white/5
                    "
                  >
                    <span
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-yellow-100
                        text-yellow-700
                        transition-all
                        duration-300

                        group-hover:bg-yellow-400
                        group-hover:text-slate-950

                        dark:bg-yellow-400/10
                        dark:text-yellow-400
                        dark:group-hover:bg-yellow-400
                        dark:group-hover:text-slate-950
                      "
                    >
                      <Phone size={19} strokeWidth={2} />
                    </span>

                    <span
                      className="
                        text-base
                        font-semibold
                        text-slate-900
                        transition-colors
                        duration-300
                        group-hover:text-blue-600

                        dark:text-white
                        dark:group-hover:text-yellow-400
                      "
                    >
                      {phone}
                    </span>
                  </Link>
                )}

                {/* =================================================
                    EMAIL
                ================================================== */}

                {email && (
                  <Link
                    to={`mailto:${email}`}
                    aria-label={`Email ${email}`}
                    className="
                      group
                      flex
                      items-center
                      gap-4
                      rounded-2xl
                      p-2
                      transition-all
                      duration-300
                      hover:bg-slate-100

                      dark:hover:bg-white/5
                    "
                  >
                    <span
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-yellow-100
                        text-yellow-700
                        transition-all
                        duration-300

                        group-hover:bg-yellow-400
                        group-hover:text-slate-950

                        dark:bg-yellow-400/10
                        dark:text-yellow-400
                        dark:group-hover:bg-yellow-400
                        dark:group-hover:text-slate-950
                      "
                    >
                      <Mail size={19} strokeWidth={2} />
                    </span>

                    <span
                      className="
                        min-w-0
                        break-all
                        text-sm
                        font-medium
                        text-slate-600
                        transition-colors
                        duration-300
                        group-hover:text-blue-600

                        dark:text-white/75
                        dark:group-hover:text-yellow-400
                      "
                    >
                      {email}
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* =================================================
              CTA CONTENT
          ================================================== */}

          <div className="lg:col-span-8">
            <div className="max-w-3xl">
              {/* =================================================
                  PRE TITLE
              ================================================== */}

              {(preTitle || preTitleHighlight) && (
                <div className="mb-5">
                  <span
                    className="
                      inline-flex
                      items-center
                      rounded-full
                      border
                      border-yellow-500/30
                      bg-yellow-100
                      px-4
                      py-2
                      text-xs
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-yellow-800

                      dark:border-yellow-400/20
                      dark:bg-yellow-400/10
                      dark:text-yellow-300
                    "
                  >
                    {preTitle}

                    {preTitleHighlight && (
                      <span
                        className="
                          ml-1.5
                          text-blue-600

                          dark:text-yellow-400
                        "
                      >
                        {preTitleHighlight}
                      </span>
                    )}
                  </span>
                </div>
              )}

              {/* =================================================
                  TITLE
              ================================================== */}

              {(title || titleHighlight) && (
                <h2
                  id="cta-title"
                  className="
                    max-w-3xl
                    text-3xl
                    font-extrabold
                    leading-[1.12]
                    tracking-tight
                    text-slate-950

                    sm:text-2xl
                    lg:text-4xl
                    xl:text-5xl

                    dark:text-white
                  "
                >
                  {title}

                  {titleHighlight && (
                    <Link
                      to={`mailto:${titleHighlight}`}
                      className="
                        text-blue-600
                        dark:text-yellow-400
                      "
                    >
                      {" "}
                      {titleHighlight}
                    </Link>
                  )}
                </h2>
              )}

              {/* =================================================
                  ACCENT LINE
              ================================================== */}

              <div
                className="
                  mt-6
                  h-1
                  w-16
                  rounded-full
                  bg-yellow-400
                  dark:bg-yellow-400
                "
              />

              {/* =================================================
                  BUTTON
              ================================================== */}

              {buttonText && buttonLink && (
                <div className="mt-8">
                  {isExternalLink ? (
                    <Link
                      to={buttonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonClassName}
                    >
                      {buttonText}

                      <ArrowRight
                        size={17}
                        strokeWidth={2.5}
                        className="
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        "
                      />
                    </Link>
                  ) : (
                    <Link to={buttonLink} className={buttonClassName}>
                      {buttonText}

                      <ArrowRight
                        size={17}
                        strokeWidth={2.5}
                        className="
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        "
                      />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
