const NavProfile = ({ username }) => {
  return (
    <div class="navbar" className="text-left gap-3 flex items-center h-10">
      <div>
        <a href={`/profile/${username}`} class="active">
          Home
        </a>
      </div>
      <div>
        {" "}
        <a href={`/profile/blog/${username}`}>Blog</a>
      </div>
      <div>
        <a href={`/profile/submissions/${username}/1`}>Submissions</a>
      </div>
    </div>
  );
};

export default NavProfile;
