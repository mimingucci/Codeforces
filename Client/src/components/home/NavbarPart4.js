import icons from "../../utils/icons";
const { FaArrowRightLong, FaStar, GoDotFill } = icons;
const NavbarPart4 = () => {
  return (
    <div className="w-full border-[2px] rounded-t-md border-solid border-black mt-4">
      <div className="flex items-center text-blue-800">
        <FaArrowRightLong size={20} className="mx-[5px] " />
        Recent actions
      </div>
      <hr />
      <div>
        <div>
            <div className="flex mx-[5px] items-center">
                mimingucci <FaArrowRightLong size={15} className="mx-[5px]"/> Ask something such that xxxxxxxxx
            </div>
            <div className="flex mx-[5px] items-center">
                tourist <FaArrowRightLong size={15} className="mx-[5px]"/> Hello everyone
            </div>
            <div className="flex mx-[5px] items-center">
                Radewoosh <FaArrowRightLong size={15} className="mx-[5px]"/> How can I help you?
            </div>
        </div>
        <div className="flex items-center bg-gray-100 text-blue-800 flex-row-reverse">
           <FaArrowRightLong size={15} className="mx-[5px]"/> 
           View all
        </div>
      </div>
    </div>
  );
};
export default NavbarPart4;
