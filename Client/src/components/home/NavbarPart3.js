import { useEffect, useState } from "react";
import icons from "../../utils/icons";
import UserApi from "../../getApi/UserApi";
const { FaArrowRightLong, FaStar, GoDotFill } = icons;
const NavbarPart3 = () => {
  const [users, setUsers]=useState()
  useEffect(()=>{
       UserApi.getTopContributors().then(res=>setUsers(res.data))
  }, [])
  return (
    <div className="w-full border-[2px] rounded-t-md border-solid border-black mt-4">
      <div className="flex items-center text-blue-800">
        <FaArrowRightLong size={20} className="mx-[5px] " />
        Top contributors
      </div>
      <hr />
      <div>
        <table class="table-fixed w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Contribution</th>
            </tr>
          </thead>
          <tbody>
            {users && users.map((user, index)=>{
              return <tr className="odd:bg-gray-100">
              <td>{index+1}</td>
              <td><a href={'/profile/'+user.nickname}>{user.nickname}</a></td>
              <td>{user.posts.length}</td>
            </tr>
            })}
          </tbody>
        </table>
        <div className="flex items-center bg-gray-100 text-blue-800 flex-row-reverse">
           <FaArrowRightLong size={15} className="mx-[5px]"/> 
           View all
        </div>
      </div>
    </div>
  );
};
export default NavbarPart3;
