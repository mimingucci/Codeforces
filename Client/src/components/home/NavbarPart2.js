import icons from "../../utils/icons";
import { useEffect, useState } from "react";
import UserApi from "../../getApi/UserApi";
const { FaArrowRightLong } = icons;
const NavbarPart2 = () => {
  const [users, setUsers] = useState();
  useEffect(() => {
    UserApi.getTopUsers({ field: "-rating" }).then((res) =>
      setUsers(res.data.data)
    );
  }, []);
  return (
    <div className="w-full border-[2px] rounded-t-md border-solid border-gray-400 mt-4">
      <div className="flex items-center text-blue-800">
        <FaArrowRightLong size={20} className="mx-[5px] " />
        Top rated
      </div>
      <hr />
      <div>
        <table className="table-fixed w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user, index) => {
                if (index < 10) {
                  return (
                    <tr className="odd:bg-gray-100" key={user._id}>
                      <td>{index + 1}</td>
                      <td>
                        <a href={"/profile/" + user.username}>
                          {user.username}
                        </a>
                      </td>
                      <td>{user.rating}</td>
                    </tr>
                  );
                }
              })}
          </tbody>
        </table>
        <div className="flex items-center bg-gray-100 text-blue-800 flex-row-reverse">
          <FaArrowRightLong size={15} className="mx-[5px]" />
          <a href="/rating">View all</a>
        </div>
      </div>
    </div>
  );
};
export default NavbarPart2;
