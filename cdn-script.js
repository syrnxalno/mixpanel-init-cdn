(function () {
    // Initialize Mixpanel
    mixpanel.init("f103949fb7954f47635263e8387116ba");
  
    // Helper: Track user interactions
    function trackEvent(eventType, eventData) {
      mixpanel.track(eventType, eventData);
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

  

  //Project Token - f103949fb7954f47635263e8387116ba