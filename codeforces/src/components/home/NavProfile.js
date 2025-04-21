import { useNavigate } from "react-router-dom";

const NavProfile = ({ username }) => {
  const navigate = useNavigate();
  const handleNavigate = (url) => {
    navigate(url);
  };
  return (
    <div class="navbar" className="text-left gap-3 flex items-center h-10">
      <div>
        <button onClick={() => handleNavigate(`/profile/${username}`)}>
          Home
        </button>
      </div>
      <div>
        {" "}
        <button onClick={() => handleNavigate(`/userblog/${username}`)}>
          Blog
        </button>
      </div>
      <div>
        <button
          onClick={() => handleNavigate(`/profile/submissions/${username}/1`)}
        >
          Submissions
        </button>
      </div>
    </div>
  );
};

export default NavProfile;
