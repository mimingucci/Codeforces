import UserApi from "../getApi/UserApi";
import HandleCookies from "../utils/HandleCookies";

/**
 * Service to manage user online status across the entire application
 */
class UserPresenceService {
  constructor() {
    this.isInitialized = false;
    this.isOnline = false;
  }

  /**
   * Initialize the presence service
   */
  init() {
    if (this.isInitialized) return;

    // Set user as online when app loads
    this.setOnline();

    // Track page visibility changes
    document.addEventListener("visibilitychange", this.handleVisibilityChange);

    // Track page unload
    window.addEventListener("beforeunload", this.handleBeforeUnload);

    // Track page close
    window.addEventListener("unload", this.handleUnload);

    // Mark as initialized
    this.isInitialized = true;

    console.log("UserPresenceService initialized (REST API version)");
  }

  /**
   * Clean up event listeners
   */
  cleanup() {
    // Remove all event listeners
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange
    );
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
    window.removeEventListener("unload", this.handleUnload);

    this.setOffline();
    this.isInitialized = false;
  }

  handleVisibilityChange = () => {
    if (document.hidden) {
      // Page is hidden (minimized or switched tab)
      console.log("Page hidden");
    } else {
      // Page is visible again
      this.setOnline();
      console.log("Page visible");
    }
  };

  handleBeforeUnload = (event) => {
    const token = HandleCookies.getCookie("token");
    if (!token) return;

    // Use synchronous XHR for immediate execution
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", "http://localhost:8080/api/v1/user/status/offline", false); // false makes it synchronous
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("Content-Type", "application/json");

    try {
      xhr.send(JSON.stringify({}));
      console.log("Offline status sent successfully");
    } catch (error) {
      console.error("Failed to send offline status:", error);
    }
  };

  handleUnload = () => {
    const token = HandleCookies.getCookie("token");
    if (!token) return;

    // Fallback to navigator.sendBeacon
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify({})], {
        type: "application/json",
      });

      navigator.sendBeacon(
        "http://localhost:8080/api/v1/user/status/offline",
        blob
      );
    }
  };

  /**
   * Set user as online
   */
  setOnline() {
    if (this.isOnline) return;

    this.isOnline = true;

    const token = HandleCookies.getCookie("token");
    if (!token) return;

    UserApi.setOnline(token)
      .then(() => console.log("User set to ONLINE"))
      .catch((err) => console.error("Failed to set user ONLINE:", err));
  }

  setOffline() {
    if (!this.isOnline) return;

    const token = HandleCookies.getCookie("token");
    if (!token) return;

    // Use synchronous request for immediate execution
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", "http://localhost:8080/api/v1/user/status/offline", false);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("Content-Type", "application/json");

    try {
      xhr.send(JSON.stringify({}));
      this.isOnline = false;
      console.log("User set to OFFLINE");
    } catch (error) {
      console.error("Failed to set user OFFLINE:", error);
    }
  }
}

// Create singleton instance
const userPresenceService = new UserPresenceService();
export default userPresenceService;
