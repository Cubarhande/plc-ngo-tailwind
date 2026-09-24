import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";

// =====================================================
// IMAGE URL
// =====================================================

const IMAGE_URL = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");

// =====================================================
// IMAGE URL HELPER
// =====================================================

const getImageUrl = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("blob:")
  ) {
    return image;
  }

  return `${IMAGE_URL}${image.startsWith("/") ? image : `/${image}`}`;
};

// =====================================================
// INITIAL FORM
// =====================================================

const initialForm = {
  // ===================================================
  // GENERAL SETTINGS
  // ===================================================

  siteName: "",
  siteFooter: "",
  email: "",
  phone: "",
  address: "",
  map: "",

  // ===================================================
  // SOCIAL MEDIA
  // ===================================================

  facebook: "",
  instagram: "",
  twitter: "",
  linkedin: "",
  youtube: "",

  // ===================================================
  // CTA SETTINGS
  // ===================================================

  ctaEnabled: true,
  ctaPhone: "",
  ctaEmail: "",

  ctaPreTitle: " ",
  ctaPreTitleHighlight: " ",

  ctaTitle: " ",
  ctaTitleHighlight: " ",

  ctaButtonText: " ",
  ctaButtonLink: " ",

  ctaBackgroundImage: "",
  ctaShapeImage1: "",
  ctaShapeImage3: "",
};

// =====================================================
// SETTINGS ADMIN
// =====================================================

const SettingsAdmin = () => {
  const [form, setForm] = useState(initialForm);

  const [settings, setSettings] = useState(null);

  const [logo, setLogo] = useState(null);
  const [favicon, setFavicon] = useState(null);

  const [logoPreview, setLogoPreview] = useState("");
  const [faviconPreview, setFaviconPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // =====================================================
  // FETCH SETTINGS
  // =====================================================

  const fetchSettings = async () => {
    try {
      setFetching(true);

      const response = await API.get("/settings");

      const data = response.data?.data;

      if (data) {
        setSettings(data);

        setForm({
          // =============================================
          // GENERAL
          // =============================================

          siteName: data.siteName || "",
          siteFooter: data.siteFooter || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          map: data.map || "",

          // =============================================
          // SOCIAL MEDIA
          // =============================================

          facebook: data.facebook || "",
          instagram: data.instagram || "",
          twitter: data.twitter || "",
          linkedin: data.linkedin || "",
          youtube: data.youtube || "",

          // =============================================
          // CTA
          // =============================================

          ctaEnabled: data.ctaEnabled !== false,

          ctaPhone: data.ctaPhone || "",
          ctaEmail: data.ctaEmail || "",

          ctaPreTitle: data.ctaPreTitle || " ",

          ctaPreTitleHighlight: data.ctaPreTitleHighlight || "Smart Outcomes",

          ctaTitle: data.ctaTitle || " ",

          ctaTitleHighlight: data.ctaTitleHighlight || " ",

          ctaButtonText: data.ctaButtonText || " ",

          ctaButtonLink: data.ctaButtonLink || " ",

          ctaBackgroundImage: data.ctaBackgroundImage || "",

          ctaShapeImage1: data.ctaShapeImage1 || "",

          ctaShapeImage3: data.ctaShapeImage3 || "",
        });

        // =============================================
        // LOGO PREVIEW
        // =============================================

        setLogoPreview(data.logo ? getImageUrl(data.logo) : "");

        // =============================================
        // FAVICON PREVIEW
        // =============================================

        setFaviconPreview(data.favicon ? getImageUrl(data.favicon) : "");
      }
    } catch (error) {
      console.error("Failed to load settings:", error);

      toast.error(error.response?.data?.message || "Failed to load settings.");
    } finally {
      setFetching(false);
    }
  };

  // =====================================================
  // LOAD SETTINGS
  // =====================================================

  useEffect(() => {
    fetchSettings();
  }, []);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // LOGO CHANGE
  // =====================================================

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setLogo(file);

    const previewUrl = URL.createObjectURL(file);

    setLogoPreview(previewUrl);
  };

  // =====================================================
  // FAVICON CHANGE
  // =====================================================

  const handleFaviconChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFavicon(file);

    const previewUrl = URL.createObjectURL(file);

    setFaviconPreview(previewUrl);
  };

  // =====================================================
  // SUBMIT SETTINGS
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = new FormData();

      // ===============================================
      // ADD ALL FORM FIELDS
      // ===============================================

      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value);
      });

      // ===============================================
      // ADD LOGO
      // ===============================================

      if (logo) {
        data.append("logo", logo);
      }

      // ===============================================
      // ADD FAVICON
      // ===============================================

      if (favicon) {
        data.append("favicon", favicon);
      }

      // ===============================================
      // UPDATE SETTINGS
      // ===============================================

      const response = await API.put("/settings", data);

      toast.success(response.data?.message || "Settings updated successfully.");

      // ===============================================
      // RESET FILE STATES
      // ===============================================

      setLogo(null);
      setFavicon(null);

      // ===============================================
      // RELOAD SETTINGS
      // ===============================================

      await fetchSettings();

      // ===============================================
      // RESET FILE INPUTS
      // ===============================================

      e.target.reset();
    } catch (error) {
      console.error("Settings update error:", error);

      toast.error(
        error.response?.data?.message || "Failed to update settings.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (fetching) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-slate-500">Loading settings...</p>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================
// =====================================================
// DELETE LOGO
// =====================================================

const handleDeleteLogo = async () => {
  if (!logoPreview) return;

  try {
    setLoading(true);

    await API.delete("/settings/image/logo");

    setLogo(null);
    setLogoPreview("");

    await fetchSettings();

    toast.success("Logo removed successfully");
  } catch (error) {
    console.error("DELETE LOGO ERROR:", error);

    toast.error(
      error.response?.data?.message ||
        "Failed to remove logo"
    );
  } finally {
    setLoading(false);
  }
};


// =====================================================
// DELETE FAVICON
// =====================================================

const handleDeleteFavicon = async () => {
  if (!faviconPreview) return;

  try {
    setLoading(true);

    await API.delete("/settings/image/favicon");

    setFavicon(null);
    setFaviconPreview("");

    await fetchSettings();

    toast.success("Favicon removed successfully");
  } catch (error) {
    console.error("DELETE FAVICON ERROR:", error);

    toast.error(
      error.response?.data?.message ||
        "Failed to remove favicon"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Site Settings</h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage global website information.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* =================================================
            GENERAL INFORMATION
        ================================================= */}

        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="border-b border-slate-200 pb-4 text-lg font-semibold text-slate-900">
            General Information
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {/* SITE NAME */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Site Name
              </label>

              <input
                type="text"
                name="siteName"
                value={form.siteName}
                onChange={handleChange}
                placeholder="PLC Organisation"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
              />
            </div>

            {/* SITE FOOTER */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Site Footer
              </label>

              <input
                type="text"
                name="siteFooter"
                value={form.siteFooter}
                onChange={handleChange}
                placeholder="Working together to create positive change..."
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
              />

              <p className="mt-2 text-xs text-slate-400">
                Enter the text displayed in the website footer.
              </p>
            </div>

            {/* EMAIL */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="info@example.com"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
              />
            </div>

            {/* PHONE */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
              />
            </div>

            {/* ADDRESS */}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Address
              </label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                placeholder="Organisation address"
                className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
              />
            </div>
          </div>

          {/* =================================================
    LOGO + FAVICON
================================================= */}

<div className="mt-6 grid gap-6 md:grid-cols-2">

  {/* =================================================
      LOGO
  ================================================= */}

  <div>
    <label className="mb-2 block text-sm font-medium text-slate-700">
      Logo
    </label>

    <div className="flex min-h-[120px] items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">

      {/* UPLOAD */}

      <div className="flex-1">
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleLogoChange}
          className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm"
        />

        {logo && (
          <p className="mt-2 truncate text-xs text-slate-500">
            Selected: {logo.name}
          </p>
        )}
      </div>

      {/* LOGO PREVIEW */}

      <div className="relative flex h-24 w-32 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white p-2">

  {logoPreview ? (
    <>
      <img
        src={logoPreview}
        alt="Logo preview"
        className="max-h-20 max-w-full object-contain"  loading="lazy"
      />

      <button
  type="button"
  onClick={handleDeleteLogo}
  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700"
>
  ×
</button>
    </>
  ) : (
    <span className="text-xs text-slate-400">
      No logo
    </span>
  )}

</div>
    </div>
  </div>


  {/* =================================================
      FAVICON
  ================================================= */}

  <div>
    <label className="mb-2 block text-sm font-medium text-slate-700">
      Favicon / Icon
    </label>

    <div className="flex min-h-[120px] items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">

      {/* UPLOAD */}

      <div className="flex-1">
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,image/x-icon"
          onChange={handleFaviconChange}
          className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm"
        />

        {favicon && (
          <p className="mt-2 truncate text-xs text-slate-500">
            Selected: {favicon.name}
          </p>
        )}
      </div>

      {/* FAVICON PREVIEW */}

      <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white p-2">

  {faviconPreview ? (
    <>
      <img
        src={faviconPreview}
        alt="Favicon preview"
        className="h-16 w-16 object-contain"  loading="lazy"
      />

      <button
  type="button"
  onClick={handleDeleteFavicon}
  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700"
>
  ×
</button>
    </>
  ) : (
    <span className="text-xs text-slate-400">
      No icon
    </span>
  )}

</div>
    </div>
  </div>

</div>

          {/* =================================================
              MAP
          ================================================= */}

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Map Embed URL
            </label>

            <input
              type="text"
              name="map"
              value={form.map}
              onChange={handleChange}
              placeholder="https://www.google.com/maps/embed?..."
              className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
            />

            <p className="mt-2 text-xs text-slate-400">
              Add the Google Maps embed URL for your organisation location.
            </p>
          </div>
        </div>

        {/* =================================================
            SOCIAL MEDIA
        ================================================= */}

        <div className="mt-5 rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="border-b border-slate-200 pb-4 text-lg font-semibold text-slate-900">
            Social Media
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {["facebook", "instagram", "twitter", "linkedin", "youtube"].map(
              (name) => (
                <div key={name}>
                  <label className="mb-2 block text-sm font-medium capitalize text-slate-700">
                    {name}
                  </label>

                  <input
                    type="url"
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={`https://${name}.com/...`}
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
                  />
                </div>
              ),
            )}
          </div>
        </div>

        {/* =================================================
            CTA SECTION
        ================================================= */}

        <div className="mt-5 rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              CTA Section
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage the call-to-action section displayed on the website.
            </p>
          </div>

          <div className="mt-6">
            {/* ENABLE CTA */}

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="ctaEnabled"
                checked={form.ctaEnabled}
                onChange={(e) =>
                  setForm((previous) => ({
                    ...previous,
                    ctaEnabled: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-slate-300"
              />

              <span className="text-sm font-medium text-slate-700">
                Enable CTA Section
              </span>
            </label>

            {/* CTA PHONE + EMAIL */}

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {/* CTA PHONE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  CTA Phone
                </label>

                <input
                  type="text"
                  name="ctaPhone"
                  value={form.ctaPhone}
                  onChange={handleChange}
                  placeholder="+1-973-796-2300"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              {/* CTA EMAIL */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  CTA Email
                </label>

                <input
                  type="email"
                  name="ctaEmail"
                  value={form.ctaEmail}
                  onChange={handleChange}
                  placeholder="sales@example.com"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>
            </div>

            {/* CTA PRE TITLE */}

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                CTA Pre Title
              </label>

              <input
                type="text"
                name="ctaPreTitle"
                value={form.ctaPreTitle}
                onChange={handleChange}
                placeholder="SMART Capabilities for"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
              />
            </div>

            {/* CTA PRE TITLE HIGHLIGHT */}

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                CTA Pre Title Highlight
              </label>

              <input
                type="text"
                name="ctaPreTitleHighlight"
                value={form.ctaPreTitleHighlight}
                onChange={handleChange}
                placeholder="Smart Outcomes"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
              />
            </div>

            {/* CTA MAIN TITLE */}

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                CTA Main Title
              </label>

              <textarea
                name="ctaTitle"
                value={form.ctaTitle}
                onChange={handleChange}
                rows={2}
                placeholder="Embark on a Journey towards Measurable"
                className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
              />
            </div>

            {/* CTA MAIN TITLE HIGHLIGHT */}

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                CTA Main Title Highlight
              </label>

              <input
                type="text"
                name="ctaTitleHighlight"
                value={form.ctaTitleHighlight}
                onChange={handleChange}
                placeholder="Business Excellence"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
              />
            </div>

            {/* CTA BUTTON */}

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {/* BUTTON TEXT */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  CTA Button Text
                </label>

                <input
                  type="text"
                  name="ctaButtonText"
                  value={form.ctaButtonText}
                  onChange={handleChange}
                  placeholder="Get Started"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              {/* BUTTON LINK */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  CTA Button Link
                </label>

                <input
                  type="text"
                  name="ctaButtonLink"
                  value={form.ctaButtonLink}
                  onChange={handleChange}
                  placeholder="/contact"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            SAVE BUTTON
        ================================================= */}

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : settings
                ? "Update Settings"
                : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsAdmin;
