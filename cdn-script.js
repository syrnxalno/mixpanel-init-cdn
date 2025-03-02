(function () {
  console.log("CDN script started");

  function loadMixpanel(callback) {
    if (window.mixpanel) {
      console.log("Mixpanel already loaded.");
      callback();
      return;
    }

    console.log("Loading Mixpanel...");
    const script = document.createElement("script");
    script.src = "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";
    script.async = true;

    script.onload = () => {
      console.log("Mixpanel Loaded!");
      waitForMixpanel(callback);
    };

    script.onerror = () => {
      console.error("Failed to load Mixpanel script.");
    };

    document.head.appendChild(script);
  }

  function waitForMixpanel(callback, retries = 10) {
    if (window.mixpanel && typeof mixpanel.init === "function") {
      callback();
    } else if (retries > 0) {
      console.log(`Waiting for Mixpanel... Retries left: ${retries}`);
      setTimeout(() => waitForMixpanel(callback, retries - 1), 300);
    } else {
      console.error("Mixpanel failed to initialize after multiple attempts.");
    }
  }

  function initializeMixpanel() {
    if (window.mixpanel && typeof mixpanel.init === "function") {
      mixpanel.init("f103949fb7954f47635263e8387116ba", { debug: true });
      console.log("Mixpanel Initialized.");
    } else {
      console.error("Mixpanel is not available.");
    }
  }

  loadMixpanel(initializeMixpanel);

  function trackEvent(eventType, eventData) {
    if (window.mixpanel && typeof mixpanel.track === "function") {
      mixpanel.track(eventType, eventData);
      console.log(`Tracked Event: ${eventType}`, eventData);
    } else {
      console.warn("Mixpanel not initialized, event not tracked.");
    }
  }

  document.addEventListener("click", (event) => {
    trackEvent("User Clicked", { element: event.target.tagName });
  });

  document.addEventListener("keydown", (event) => {
    trackEvent("User Key Press", { key: event.key });
  });

  function isValidOrigin(origin) {
    const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
    return allowedOrigins.includes(origin);
  }

  window.addEventListener("message", (event) => {
    if (!isValidOrigin(event.origin)) {
      console.warn("Blocked message from unknown origin:", event.origin);
      return;
    }

    const { type, payload } = event.data;
    if (type === "USER_INTERACTION") {
      trackEvent("Iframe Interaction", payload);
    }
  });

})();
