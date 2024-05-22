import { useEffect, useState } from "react";
import UserApi from "../../getApi/UserApi";

const Rating = () => {
  const [users, setUsers]=useState()
  useEffect(()=>{
    UserApi.getListUserByRating(1).then(res=>setUsers(res.data.content))
  }, [])
  return (
    <div className="w-full pr-5 pt-[20px]">
      <table class="border-collapse border border-slate-400 w-full" className="w-full">
        <thead>
          <tr className="h-[50px]">
            <th className="w-[10%]" class="border border-slate-300">#</th>
            <th className="w-[60%]" class="border border-slate-300">Who</th>
            <th className="w-[30%]" class="border border-slate-300">Rating</th>
          </tr>
        </thead>
        <tbody>
          {users && users.map((user, index)=><tr class='odd:bg-gray-100 hover:cursor-pointer hover:bg-gray-200'>
            <td class="border border-slate-300">{index+1}</td>
            <td class="border border-slate-300"><a href={'/profile/'+user.nickname}>{user.nickname}</a></td>
            <td class="border border-slate-300">{user.rating}</td>
          </tr>)}
        </tbody>
      </table>
    </div>
  );
};
export default Rating;
