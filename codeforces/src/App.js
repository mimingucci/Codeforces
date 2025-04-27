import "./App.css";
import Home from "./containers/public/Home";
import Header from "./components/Header";
import { Footer } from "./components/home";
import { useEffect } from "react";
import handleTokenAutomatically from "./utils/autoHandlerToken";
import { LoadingProvider } from './components/shared/LoadingContext';

function App() {
  useEffect(() => {
    async function init() {
      await handleTokenAutomatically();
    }
    init();
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
