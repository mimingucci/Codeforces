import "../../assets/css/ranking.css";
const Ranking = ({ username, rating = 0, title = false }) => {
  if (title) {
    if (rating < 1200) {
      return (
        <>
          <h1 className="text-[20px] text-gray-600 font-bold">Newbie</h1>
          <h1 className="text-[20px] text-gray-600 font-bold">
            {username || "Username"}
          </h1>
        </>
      );
    } else {
      if (rating < 1400) {
        return (
          <>
            <h1 className="text-[20px] text-green-600 font-bold">Pupil</h1>
            <h1 className="text-[20px] text-green-600 font-bold">
              {username || "Username"}
            </h1>
          </>
        );
      } else {
        if (rating < 1600) {
          return (
            <>
              <h1 className="text-[20px] text-cyan-400 font-bold">
                Specialist
              </h1>
              <h1 className="text-[20px] text-cyan-400 font-bold">
                {username || "Username"}
              </h1>
            </>
          );
        } else {
          if (rating < 1900) {
            return (
              <>
                <h1 className="text-[20px] text-blue-600 font-bold">Expert</h1>
                <h1 className="text-[20px] text-blue-600 font-bold">
                  {username || "Username"}
                </h1>
              </>
            );
          } else {
            if (rating < 2400) {
              return (
                <>
                  <h1 className="text-[20px] text-yellow-300 font-bold">
                    Master
                  </h1>
                  <h1 className="text-[20px] text-yellow-300 font-bold">
                    {username || "Username"}
                  </h1>
                </>
              );
            } else {
              if (rating < 3000) {
                return (
                  <>
                    <h1 className="text-[20px] text-purple-600 font-bold">
                      Grandmaster
                    </h1>
                    <h1 className="text-[20px] text-purple-600 font-bold">
                      {username || "Username"}
                    </h1>
                  </>
                );
              } else {
                return (
                  <>
                    <h1 className="text-[20px] text-red-600 font-bold">
                      Legendary Grandmaster
                    </h1>
                    <h1 className="text-[20px] text-red-600 font-bold">
                      {username || "Username"}
                    </h1>
                  </>
                );
              }
            }
          }
        }
      }
    }
  }
  if (rating < 1200) {
    return <p className="text-gray-600">{username || "Username"}</p>;
  } else {
    if (rating < 1400) {
      return <p className=" text-green-600">{username || "Username"}</p>;
    } else {
      if (rating < 1600) {
        return <p className=" text-cyan-400">{username || "Username"}</p>;
      } else {
        if (rating < 1900) {
          return <p className=" text-blue-600 ">{username || "Username"}</p>;
        } else {
          if (rating < 2400) {
            return <p className=" text-yellow-300">{username || "Username"}</p>;
          } else {
            if (rating < 3000) {
              return (
                <p className=" text-purple-600">{username || "Username"}</p>
              );
            } else {
              return <p className=" text-red-600">{username || "Username"}</p>;
            }
          }
        }
      }
    }
  }
};

export default Ranking;
