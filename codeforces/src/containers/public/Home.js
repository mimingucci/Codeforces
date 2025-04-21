import { Route, Routes, useLocation } from "react-router-dom";
import { Navbar, Main } from "../../components/home/index";
const Home = () => {
  return (
    <div className="w-full h-full ">
      <div className="flex h-full">
        <Main className="" />
        <Navbar className="" />
      </div>
    </div>
  );
};

export default Home;
