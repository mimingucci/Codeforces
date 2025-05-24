import "./App.css";
import Home from "./containers/public/Home";
import Header from "./components/Header";
import { Footer } from "./components/home";
import { useEffect } from "react";
import { LoadingProvider } from "./components/shared/LoadingContext";
import HandleCookies from "./utils/HandleCookies";
import userPresenceService from "./services/UserPresenceService";

function App() {
  useEffect(() => {
    // Initialize user presence tracking if user is logged in
    if (HandleCookies.checkCookie("token")) {
      userPresenceService.init();
    }

    return () => {
      userPresenceService.cleanup();
    };
  }, []);
  return (
    <LoadingProvider>
      <div>
        <div className="App px-[120px] h-full">
          <Header />
          <Home />
        </div>
        <Footer />
      </div>
    </LoadingProvider>
  );
}

export default App;
