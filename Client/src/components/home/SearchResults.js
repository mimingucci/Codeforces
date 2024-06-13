import { useEffect, useState } from "react";
import UserApi from "../../getApi/UserApi";
import { useNavigate } from "react-router-dom";

const SearchResults = ({ query }) => {
  const [users, setUsers] = useState([]);
  const naviagte = useNavigate();
  useEffect(() => {
    UserApi.search({ page: 1, username: query, limit: 10 }).then((rs) => {
      if (rs?.data?.status === "success") {
        setUsers(rs?.data?.data);
      }
    });
  }, [query]);
  return (
    <div className={`${!query ? "hidden" : ""}`}>
      {users.length === 0 && <div>No results for "{query}"</div>}
      {users.length > 0 &&
        users.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between hover:bg-slate-200 hover:cursor-pointer"
            onClick={() => naviagte(`/profile/${user?.username}`)}
          >
            <div className="text-left px-3">{user?.username}</div>
            <div className="px-3 text-gray-500 text-sm">
              Rating: {user?.rating}
            </div>
          </div>
        ))}
    </div>
  );
};
export default SearchResults;
