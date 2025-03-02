(function () {
  console.log("CDN script started");

  // Function to load Mixpanel dynamically
  function loadMixpanel(callback) {
    // Prevent multiple Mixpanel script loads
    if (window.mixpanel) {
      console.log("Mixpanel already loaded.");
      callback(); // Initialize Mixpanel immediately
      return;
    }

    if (document.querySelector('script[src*="mixpanel"]')) {
      console.log("Mixpanel script already exists in the document.");
      return;
    }

    console.log("Loading Mixpanel...");
    const script = document.createElement("script");
    script.src = "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";
    script.async = true;

    script.onload = () => {
      console.log("Mixpanel script loaded, waiting for initialization...");
      waitForMixpanel(callback);
    };

    script.onerror = () => {
      console.error("Failed to load Mixpanel script.");
    };

    document.head.appendChild(script);
  }

  // Function to wait for Mixpanel to be available before initializing
  function waitForMixpanel(callback, retries = 10) {
    if (window.mixpanel && typeof mixpanel.init === "function") {
      console.log("Mixpanel is ready!");
      callback();
    } else if (retries > 0) {
      console.warn(`Waiting for Mixpanel... Retries left: ${retries}`);
      setTimeout(() => waitForMixpanel(callback, retries - 1), 300);
    } else {
      console.error("Mixpanel failed to initialize after multiple attempts.");
    }
  }

  // Function to initialize Mixpanel
  function initializeMixpanel() {
    if (window.mixpanel && typeof mixpanel.init === "function") {
      mixpanel.init("f103949fb7954f47635263e8387116ba", { debug: true });
      console.log("Mixpanel Initialized.");
    } else {
      console.error("Mixpanel is not available.");
    }
  }

  // Load Mixpanel and initialize it
  loadMixpanel(initializeMixpanel);

  // Function to track events
  function trackEvent(eventType, eventData) {
    if (window.mixpanel && typeof mixpanel.track === "function") {
      mixpanel.track(eventType, eventData);
      console.log(`Tracked Event: ${eventType}`, eventData);
    } else {
      console.warn("Mixpanel not initialized, event not tracked.");
    }
  }

  // Track user clicks
  document.addEventListener("click", (event) => {
    trackEvent("User Clicked", { element: event.target.tagName });
  });

  // Track user key presses
  document.addEventListener("keydown", (event) => {
    trackEvent("User Key Press", { key: event.key });
  });

  // Helper: Validate messages (for security)
  function isValidOrigin(origin) {
    const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
    return allowedOrigins.includes(origin);
  }

  // Securely listen for messages from iframes
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
