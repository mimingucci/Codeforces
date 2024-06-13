import { useEffect, useState } from "react";
import icons from "../../utils/icons";
import UserApi from "../../getApi/UserApi";
import Ranking from "./Ranking";
const { FaArrowRightLong } = icons;
const NavbarPart3 = () => {
  const [users, setUsers] = useState();
  useEffect(() => {
    UserApi.getTopUsers({ field: "-contribution" }).then((res) =>
      setUsers(res.data.data)
    );
  }, []);
  return (
    <div className="w-full border-[2px] rounded-t-md border-solid border-gray-400 mt-4">
      <div className="flex items-center text-blue-800">
        <FaArrowRightLong size={20} className="mx-[5px] " />
        Top contributors
      </div>
      <hr />
      <div>
        <table className="table-fixed w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Contribution</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user, index) => {
                return (
                  <tr className="odd:bg-gray-100" key={user._id}>
                    <td>{index + 1}</td>
                    <td>
                      <a href={"/profile/" + user.username}>
                        <Ranking
                          username={user.username}
                          rating={user.rating}
                          title={false}
                        />
                      </a>
                    </td>
                    <td>{user.contribution}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div className="flex items-center bg-gray-100 text-blue-800 flex-row-reverse"></div>
      </div>
    </div>
  );
};
export default NavbarPart3;
