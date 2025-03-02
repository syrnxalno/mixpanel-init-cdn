(function () {
    console.log("CDN script started...");
  
    // Function to load Mixpanel dynamically
    function loadMixpanel(callback) {
      if (typeof mixpanel !== "undefined") {
        console.log("Mixpanel already loaded.");
        callback(); // Initialize Mixpanel immediately
        return;
      }
  
      console.log("Loading Mixpanel...");
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/mixpanel-browser";
      script.async = true;
  
      script.onload = () => {
        console.log("Mixpanel Loaded");
        callback();
      };
  
      script.onerror = () => {
        console.error("Failed to load Mixpanel");
      };
  
      document.head.appendChild(script);
    }
  
    // Function to initialize Mixpanel
    function initializeMixpanel() {
      if (typeof mixpanel !== "undefined") {
        mixpanel.init("f103949fb7954f47635263e8387116ba", { debug: true });
        console.log("Mixpanel Initialized");
      } else {
        console.error("Mixpanel is not available");
      }
    }
  
    // Load Mixpanel first, then initialize it
    loadMixpanel(initializeMixpanel);
  
    // Helper: Track user interactions
    function trackEvent(eventType, eventData) {
      if (typeof mixpanel !== "undefined") {
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
  
    // Helper: Validate messages (for security)
    function isValidOrigin(origin) {
      const allowedOrigins = ["http://localhost:5173", "https://yourdomain.com"];
      return allowedOrigins.includes(origin);
    }
  
    // Listen for messages securely
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
  
