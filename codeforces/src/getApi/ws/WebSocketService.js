import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { API_BASE_URL } from "../../config";

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.connectionPromise = null;
    this.connectionCallbacks = [];
    this.errorCallbacks = [];
  }

  connect(accessToken, onConnected) {
    if (this.connected) {
      if (onConnected) onConnected();
      return;
    }

    if (this.connectionPromise) {
      // If already connecting, add callback to the queue
      if (onConnected) this.connectionCallbacks.push(onConnected);
      return this.connectionPromise;
    }

    // Create promise for connection
    this.connectionPromise = new Promise((resolve, reject) => {
      const socket = new SockJS(`${API_BASE_URL}/ws/v1/chat`);
      this.stompClient = Stomp.over(socket);

      // Disable debug logging
      this.stompClient.debug = null;

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      this.stompClient.connect(
        headers,
        () => {
          console.log("WebSocket connected");
          this.connected = true;

          // Resolve the promise
          resolve();

          // Call any pending callbacks
          if (onConnected) onConnected();
          this.connectionCallbacks.forEach((callback) => callback());
          this.connectionCallbacks = [];

          // Reset connection promise
          this.connectionPromise = null;
        },
        (error) => {
          console.error("WebSocket connection error:", error);
          this.connected = false;
          this.connectionPromise = null;

          // Notify error callbacks
          this.errorCallbacks.forEach((callback) => callback(error));

          // Reject promise
          reject(error);
        }
      );
    });

    return this.connectionPromise;
  }

  disconnect() {
    if (this.stompClient && this.connected) {
      // Unsubscribe from all topics
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();

      // Disconnect from server
      this.stompClient.disconnect();
      this.stompClient = null;
      this.connected = false;
      console.log("WebSocket disconnected");
    }
  }

  subscribe(topic, callback) {
    if (!this.connected) {
      console.error("WebSocket not connected. Cannot subscribe.");
      return { unsubscribe: () => {} };
    }

    // Create subscription
    const subscription = this.stompClient.subscribe(topic, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error("Error parsing message:", error);
        callback(message.body);
      }
    });

    // Store subscription for later cleanup
    this.subscriptions.set(topic, subscription);
    return subscription;
  }

  unsubscribe(topic) {
    const subscription = this.subscriptions.get(topic);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(topic);
    }
  }

  send(destination, body) {
    if (!this.connected) {
      console.error("WebSocket not connected. Cannot send message.");
      return false;
    }

    this.stompClient.send(destination, {}, JSON.stringify(body));
    return true;
  }

  onError(callback) {
    this.errorCallbacks.push(callback);
    return () => {
      this.errorCallbacks = this.errorCallbacks.filter((cb) => cb !== callback);
    };
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;
