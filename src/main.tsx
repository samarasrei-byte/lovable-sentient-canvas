import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const isLovablePreview =
  window.location.hostname.endsWith(".lovable.app") &&
  window.location.hostname.includes("--");

const resetPreviewServiceWorker = async () => {
  if (!isLovablePreview || !("serviceWorker" in navigator)) return;
  if (sessionStorage.getItem("lovable-preview-sw-reset") === "1") return;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();

    if (registrations.length === 0) return;

    await Promise.all(registrations.map((registration) => registration.unregister()));

    if ("caches" in window) {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map((key) => caches.delete(key)));
    }

    sessionStorage.setItem("lovable-preview-sw-reset", "1");
    window.location.reload();
  } catch (error) {
    console.warn("Preview cache reset failed", error);
  }
};

void resetPreviewServiceWorker();

// Suppress native PWA install banner
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
});

createRoot(document.getElementById("root")!).render(<App />);
