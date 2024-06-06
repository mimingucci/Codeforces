import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./containers/public/Home";
import Header from "./components/Header";
import { Footer } from "./components/home";
import { useEffect } from "react";
import handleTokenAutomatically from "./utils/autoHandlerToken";
function App() {
  useEffect(() => {
    async function init() {
      await handleTokenAutomatically();
    }
    init();
  }, []);
  return (
    <div>
      <div className="App px-[120px] h-full">
        <Header />
        <Home />
      </div>
      <Footer />
    </div>
  );
}

export default App;
