import { Stomp } from "@stomp/stompjs";
const JSONbig = require("json-bigint")({ storeAsString: true });

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.subscriptions = new Map();
  }

  isConnected() {
    return this.stompClient && this.stompClient.connected;
  }

  connect(accessToken, onConnected) {
    if (this.stompClient && this.stompClient.connected) {
      if (onConnected) onConnected();
      return;
    }

    // Use native WebSocket instead of SockJS
    // const socket = new WebSocket(`ws://${window.location.host}/ws/v1/chat`);
    // For local development with different ports:
    const socket = new WebSocket(`ws://localhost:8080/ws/v1/chat`);

    this.stompClient = Stomp.over(socket);

    // Disable debug logs in production
    this.stompClient.debug =
      process.env.NODE_ENV === "development" ? console.log : () => {};

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    this.stompClient.connect(
      headers,
      () => {
        if (onConnected) onConnected();
      },
      (error) => {
        // Implement reconnection logic if needed
        setTimeout(() => this.connect(accessToken, onConnected), 5000);
      }
    );
  }

  disconnect() {
    if (this.stompClient) {
      // Unsubscribe from all topics
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();

      // Disconnect the client
      this.stompClient.disconnect();
      this.stompClient = null;
    }
  }

  subscribe(topic, callback) {
    if (!this.stompClient || !this.stompClient.connected) {
      return;
    }

    if (this.subscriptions.has(topic)) {
      return;
    }

    const subscription = this.stompClient.subscribe(topic, (message) => {
      try {
        // Use JSONbig.parse instead of JSON.parse
        const data = JSONbig.parse(message.body);
        callback(data);
      } catch (error) {
        callback(message.body);
      }
    });

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
    if (!this.stompClient) {
      return false;
    }

    if (!this.stompClient.connected) {
      return false;
    }

    try {
      // Use JSONbig.stringify instead of JSON.stringify
      this.stompClient.send(destination, {}, JSONbig.stringify(body));
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;
