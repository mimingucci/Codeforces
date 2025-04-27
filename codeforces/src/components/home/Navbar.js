import { useLocation } from "react-router-dom";
import NavbarPart1 from "./NavbarPart1";
import NavbarPart2 from "./NavbarPart2";
import NavbarPart3 from "./NavbarPart3";
import NavbarPart4 from "./NavbarPart4";
import NavbarClock from "./NavbarClock";
import RunningContestClock from "./RunningContestClock";

const Navbar = () => {
  const location = useLocation();
  let inLoginPage = false;
  if (
    location?.pathname == "/login" ||
    location?.pathname == "/signup" ||
    location?.pathname == "/ide" ||
    location?.pathname.startsWith("/problem")
  ) {
    inLoginPage = true;
  } else {
    inLoginPage = false;
  }
  return (
    <div className={inLoginPage ? "hidden" : "w-[25%]"}>
      <NavbarPart1 />
      <NavbarClock />
      <RunningContestClock />
      <NavbarPart2 />
      <NavbarPart3 />
      <NavbarPart4 />
    </div>
  );
};
export default Navbar;
