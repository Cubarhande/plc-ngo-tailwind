import { useEffect, useState } from "react";

import { Bell, User, LogOut, Mail, ChevronDown, Menu } from "lucide-react";

import { useNavigate } from "react-router-dom";

import API from "../../services/api";
import { logout } from "../../utils/auth";

const Topbar = ({ title = "Admin", onMenuClick }) => {
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin") || "null");

  const [messages, setMessages] = useState([]);

  const [showProfile, setShowProfile] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);

  // =====================================================
  // LOAD MESSAGES
  // =====================================================

  const loadMessages = async () => {
    try {
      const response = await API.get("/contacts");

      setMessages(response.data?.data || []);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  useEffect(() => {
    loadMessages();

    const interval = setInterval(loadMessages, 30000);

    return () => clearInterval(interval);
  }, []);

  // =====================================================
  // UNREAD
  // =====================================================

  const unreadMessages = messages.filter((message) => message.status === "new");

  const unreadCount = unreadMessages.length;

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    logout();

    navigate("/admin/login");
  };

  // =====================================================
  // OPEN CONTACTS
  // =====================================================

  const openContacts = () => {
    setShowNotifications(false);

    navigate("/admin/contacts");
  };

  // =====================================================
  // CLOSE DROPDOWNS
  // =====================================================

  const closeNotifications = () => {
    setShowNotifications(false);
  };

  const closeProfile = () => {
    setShowProfile(false);
  };

  return (
    <header
      className="
        sticky top-0 z-30
        flex h-16 w-full
        items-center
        justify-between
        border-b border-slate-200
        bg-white
        px-3
        shadow-sm
        sm:px-5
        md:px-6
      "
    >
      {/* =================================================
          LEFT SIDE
      ================================================== */}

      <div className="flex min-w-0 items-center gap-2">
        {/* HAMBURGER - MOBILE ONLY */}

        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="
            flex h-10 w-10
            shrink-0
            items-center
            justify-center
            rounded-lg
            text-slate-700
            transition
            hover:bg-slate-100
            md:hidden
          "
        >
          <Menu size={22} />
        </button>

        {/* TITLE */}

        <h2
          className="
            min-w-0
            truncate
            text-base
            font-semibold
            text-slate-900
            sm:text-lg
            md:text-xl
          "
        >
          {title}
        </h2>
      </div>

      {/* =================================================
          RIGHT SIDE
      ================================================== */}

      <div
        className="
          ml-2
          flex
          shrink-0
          items-center
          gap-1
          sm:gap-3
        "
      >
        {/* =================================================
            NOTIFICATIONS
        ================================================== */}

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);

              setShowProfile(false);
            }}
            className="
              relative
              flex h-10 w-10
              items-center
              justify-center
              rounded-full
              text-slate-600
              transition
              hover:bg-slate-100
            "
          >
            <Bell size={20} />

            {unreadCount > 0 && (
              <span
                className="
                  absolute
                  right-0
                  top-0
                  flex
                  h-5
                  min-w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-red-500
                  px-1
                  text-[10px]
                  font-bold
                  text-white
                "
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* =================================================
              NOTIFICATION DROPDOWN
          ================================================== */}

          {showNotifications && (
            <div
              className="
                absolute
                right-0
                top-full
                mt-3
                w-[calc(100vw-1.5rem)]
                max-w-80
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-xl
              "
            >
              {/* HEADER */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  px-4 py-3
                "
              >
                <h3 className="font-semibold text-slate-900">Notifications</h3>

                <span className="text-xs text-slate-500">
                  {unreadCount} unread
                </span>
              </div>

              {/* EMPTY */}

              {unreadMessages.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Bell size={26} className="mx-auto text-slate-300" />

                  <p className="mt-2 text-sm text-slate-500">No new messages</p>
                </div>
              ) : (
                <>
                  {/* MESSAGES */}

                  <div className="max-h-80 overflow-y-auto">
                    {unreadMessages.slice(0, 5).map((message) => (
                      <button
                        key={message._id}
                        type="button"
                        onClick={openContacts}
                        className="
                            flex
                            w-full
                            gap-3
                            border-b
                            px-4 py-3
                            text-left
                            transition
                            hover:bg-slate-50
                          "
                      >
                        <div
                          className="
                              flex
                              h-9 w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-slate-100
                            "
                        >
                          <Mail size={17} />
                        </div>

                        <div className="min-w-0">
                          <p
                            className="
                                truncate
                                text-sm
                                font-medium
                                text-slate-900
                              "
                          >
                            {message.name || "New Message"}
                          </p>

                          <p
                            className="
                                truncate
                                text-xs
                                text-slate-500
                              "
                          >
                            {message.subject ||
                              message.message ||
                              "New contact message"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* VIEW ALL */}

                  <button
                    type="button"
                    onClick={openContacts}
                    className="
                      w-full
                      border-t
                      px-4 py-3
                      text-sm
                      font-semibold
                      text-slate-700
                      hover:bg-slate-50
                    "
                  >
                    View all messages
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* =================================================
            PROFILE
        ================================================== */}

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowProfile(!showProfile);

              setShowNotifications(false);
            }}
            className="
              flex
              items-center
              gap-1.5
              rounded-lg
              p-1.5
              transition
              hover:bg-slate-100
              sm:gap-3
            "
          >
            {/* AVATAR */}

            <div
              className="
                flex
                h-9 w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-slate-900
                text-sm
                font-bold
                text-white
              "
            >
              {admin?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            {/* USER INFO - DESKTOP */}

            <div className="hidden min-w-0 text-left sm:block">
              <p
                className="
                  max-w-32
                  truncate
                  text-sm
                  font-medium
                  text-slate-900
                "
              >
                {admin?.name || "Admin"}
              </p>

              <p
                className="
                  max-w-40
                  truncate
                  text-xs
                  text-slate-500
                "
              >
                {admin?.email || ""}
              </p>
            </div>

            {/* ARROW - DESKTOP */}

            <ChevronDown size={16} className="hidden shrink-0 sm:block" />
          </button>

          {/* =================================================
              PROFILE DROPDOWN
          ================================================== */}

          {showProfile && (
            <div
              className="
                absolute
                right-0
                top-full
                mt-3
                w-64
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-xl
              "
            >
              {/* PROFILE INFO */}

              <div className="border-b p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-10 w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-slate-900
                      font-bold
                      text-white
                    "
                  >
                    {admin?.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        truncate
                        font-semibold
                        text-slate-900
                      "
                    >
                      {admin?.name || "Admin"}
                    </p>

                    <p
                      className="
                        truncate
                        text-xs
                        text-slate-500
                      "
                    >
                      {admin?.email || ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* MENU */}

              <div className="p-2">
                {/* PROFILE */}

                <button
                  type="button"
                  onClick={() => {
                    closeProfile();

                    navigate("/admin/profile");
                  }}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-3 py-2.5
                    text-sm
                    text-slate-700
                    hover:bg-slate-100
                  "
                >
                  <User size={17} />
                  Profile
                </button>

                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-3 py-2.5
                    text-sm
                    text-red-600
                    hover:bg-red-50
                  "
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
