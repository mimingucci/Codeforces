import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import UserApi from "../../getApi/UserApi";
import Ranking from "./Ranking";
const SearchList = () => {
  const [users, setUsers] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    UserApi.search({
      page: 1,
      limit: 100,
      username: searchParams.get("query"),
    }).then((res) => {
      if (res?.data?.status === "success") {
        setUsers(res?.data?.data);
      }
    });
  }, [searchParams.get("query")]);
  return (
    <div className="w-full h-auto">
      {users.length === 0 && <h1>No Results</h1>}
      {users.length > 0 && (
        <div className="border-[2px] rounded-md border-solid mt-[15px] mr-5 border-gray-300 text-left p-3">
          {users?.map((user) => (
            <div
              className="flex gap-5 items-center hover:cursor-pointer"
              key={user?._id}
              onClick={() => navigate(`/profile/${user?.username}`)}
            >
              <div>
                <img src={user?.avatar} className="h-10 w-auto" />
              </div>
              <div>
                {/* <p>{user?.username}</p> */}
                <Ranking
                  username={user?.username}
                  rating={user?.rating}
                  title={false}
                />
                <p className="text-sm text-gray-500">Rating: {user?.rating}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default SearchList;
