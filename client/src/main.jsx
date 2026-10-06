import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";

import App from "./App";
import "./index.css";

import { LoadingProvider } from "./context/LoadingContext";

import GlobalLoader from "./components/GlobalLoader";

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname, search]);

  return null;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoadingProvider>
      <BrowserRouter>
        <ScrollToTop />

        <GlobalLoader />

        <App />
      </BrowserRouter>
    </LoadingProvider>
  </React.StrictMode>,
);
