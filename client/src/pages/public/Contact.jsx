import { useEffect, useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import toast from "react-hot-toast";

import API from "../../services/api";

const Contact = () => {
  const [settings, setSettings] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // =====================================================
  // GET CONTACT SETTINGS
  // =====================================================

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await API.get("/settings");

        setSettings(response.data?.data || null);
      } catch (error) {
        console.error("Settings error:", error);
      }
    };

    loadSettings();
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    const newErrors = {};

    // NAME
    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    } else if (!/^[A-Za-z\s]+$/.test(form.name.trim())) {
      newErrors.name = "Name can contain only letters and spaces.";
    }

    // EMAIL
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    // PHONE
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else {
      const phone = form.phone.replace(/\s/g, "");

      if (!/^[+]?[0-9]{10,15}$/.test(phone)) {
        newErrors.phone = "Please enter a valid phone number.";
      }
    }

    // SUBJECT
    if (!form.subject.trim()) {
      newErrors.subject = "Subject is required.";
    } else if (form.subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters.";
    }

    // MESSAGE
    if (!form.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (form.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }

    return newErrors;
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const submit = async (e) => {
    e.preventDefault();

    setErrors({});

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      toast.error("Please correct the highlighted fields.");

      return;
    }

    setLoading(true);

    try {
      await API.post("/contacts", {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });

      toast.success("Your message has been submitted successfully.");

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to submit message. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INPUT CLASS
  // =====================================================

  const inputClass = (field) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 ${
      errors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
        : "border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:focus:border-white dark:focus:ring-white"
    }`;

  return (
    <section className="bg-slate-50 py-14 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white sm:py-20">
      <div className="container-custom">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-yellow-700 dark:bg-yellow-400/10 dark:text-yellow-400">
              Get In Touch
            </span>
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Contact Us
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            Have a question or want to get in touch? Send us a message or use
            the contact details below.
          </p>
        </div>

        {/* =====================================================
            MAIN GRID
        ===================================================== */}

        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2 lg:gap-8">

          {/* ===================================================
              CONTACT INFORMATION
          =================================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-8">

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Contact Information
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              We would love to hear from you. Contact us using the information
              below.
            </p>

            <div className="mt-7 space-y-4">

              {/* ADDRESS */}

              <div className="flex items-start gap-4 rounded-xl border border-transparent p-4 transition hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-800 dark:hover:bg-slate-950">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <MapPin size={20} />
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Address
                  </h3>

                  <p className="mt-1 break-words text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {settings?.address || "Address not available"}
                  </p>
                </div>
              </div>

              {/* PHONE */}

              <div className="flex items-start gap-4 rounded-xl border border-transparent p-4 transition hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-800 dark:hover:bg-slate-950">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <Phone size={20} />
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Phone
                  </h3>

                  {settings?.phone ? (
                    <a
                      href={`tel:${settings.phone.replace(/-/g, "")}`}
                      className="mt-1 block break-all text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      {settings.phone}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Phone not available
                    </p>
                  )}
                </div>
              </div>

              {/* EMAIL */}

              <div className="flex items-start gap-4 rounded-xl border border-transparent p-4 transition hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-800 dark:hover:bg-slate-950">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <Mail size={20} />
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Email
                  </h3>

                  {settings?.email ? (
                    <a
                      href={`mailto:${settings.email}`}
                      className="mt-1 block break-all text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      {settings.email}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Email not available
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* MAP */}

            {settings?.map && (
              <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                <iframe
                  title="PLC Organisation Location"
                  src={settings.map.trim()}
                  className="h-64 w-full border-0 sm:h-72"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>

          {/* ===================================================
              CONTACT FORM
          =================================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-8">

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Send Us a Message
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              Fill out the form and our team will get back to you as soon as
              possible.
            </p>

            <form onSubmit={submit} className="mt-7 space-y-5">

              {/* NAME + EMAIL */}

              <div className="grid gap-5 sm:grid-cols-2">

                {/* NAME */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Name
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className={inputClass("name")}
                  />

                  {errors.name && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* EMAIL */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email
                  </label>

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className={inputClass("email")}
                  />

                  {errors.email && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* PHONE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Phone
                </label>

                <input
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className={inputClass("phone")}
                />

                {errors.phone && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* SUBJECT */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Subject
                </label>

                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  className={inputClass("subject")}
                />

                {errors.subject && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.subject}
                  </p>
                )}
              </div>

              {/* MESSAGE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Message
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  rows={6}
                  className={`${inputClass("message")} resize-none`}
                />

                {errors.message && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* SUBMIT BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;