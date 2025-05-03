import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import "./lib/i18n";
import { I18nProvider } from "./hooks/use-i18n";

// Register service worker - do it later to improve initial page load
const registerSW = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      // Delay service worker registration to improve page load performance
      setTimeout(() => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then(registration => {
            console.log("SW registered: ", registration);
          })
          .catch(registrationError => {
            console.log("SW registration failed: ", registrationError);
          });
      }, 1000);
    });
  }
};

// Start registration after page load
registerSW();

// Use preconnect for external resources
const linkEl = document.createElement('link');
linkEl.rel = 'preconnect';
linkEl.href = 'https://fonts.googleapis.com';
document.head.appendChild(linkEl);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
