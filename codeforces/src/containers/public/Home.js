import { Navbar, Main } from "../../components/home/index";
const Home = () => {
  return (
    <div className="w-full h-full ">
      <div className="flex h-full gap-6 mt-4 mb-4">
        <Main className="flex-1" />
        <Navbar className="" />
      </div>
    </div>
  );
};

export default Home;
