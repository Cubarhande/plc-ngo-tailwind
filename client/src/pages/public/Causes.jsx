import { useEffect, useState } from "react";

import API from "../../services/api";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "http://localhost:5000";

const Causes = () => {
  const [causes, setCauses] = useState([]);

  useEffect(() => {
    API.get("/causes")
      .then((response) => setCauses(response.data.data || []))
      .catch(console.error);
  }, []);

  const activeCauses = causes.filter((cause) => cause.status);

  return (
    <section className="bg-white py-16 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white md:py-20">
      <div className="container-custom">
        {/* ================= HEADER ================= */}

        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-yellow-700 dark:bg-yellow-400/10 dark:text-yellow-400">
              Support Us
            </span>
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
            Our Causes
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
            Together, we can support meaningful causes and create lasting
            positive change in our communities.
          </p>
        </div>

        {/* ================= CAUSES ================= */}

        {activeCauses.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeCauses.map((cause) => {
              const percentage =
                cause.goalAmount > 0
                  ? Math.min(100, (cause.raisedAmount / cause.goalAmount) * 100)
                  : 0;

              return (
                <div
                  key={cause._id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                >
                  {/* ================= IMAGE ================= */}

                  {cause.image && (
                    <div className="overflow-hidden">
                      <img
                        src={`${IMAGE_URL}${cause.image}`}
                        alt={cause.title}
                        loading="lazy"
                        className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* ================= CONTENT ================= */}

                  <div className="p-6">
                    {/* TITLE */}

                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {cause.title}
                    </h2>

                    {/* DESCRIPTION */}

                    {cause.description && (
                      <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                        {cause.description}
                      </p>
                    )}

                    {/* ================= PROGRESS ================= */}

                    <div className="mt-6">
                      {/* <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          Fundraising Progress
                        </span>

                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {Math.round(percentage)}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <div
                          className="h-full rounded-full bg-slate-900 transition-all duration-700 dark:bg-yellow-400"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div> */}

                      {/* AMOUNTS */}

                      {/* <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-600 dark:text-slate-400">
                          ₹{Number(cause.raisedAmount || 0).toLocaleString(
                            "en-IN",
                          )}{" "}
                          raised
                        </span>

                        <span className="font-semibold text-slate-900 dark:text-white">
                          Goal ₹
                          {Number(cause.goalAmount || 0).toLocaleString(
                            "en-IN",
                          )}
                        </span>
                      </div> */}
                    </div>

                    {/* ================= BUTTON ================= */}

                    {/* {cause.buttonText && (
                      <a
                        href={cause.buttonLink || "#"}
                        className="mt-6 block rounded-lg bg-slate-900 py-3 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                      >
                        {cause.buttonText}
                      </a>
                    )} */}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ================= EMPTY STATE ================= */

          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              No causes available
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              There are currently no active causes to display.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Causes;
