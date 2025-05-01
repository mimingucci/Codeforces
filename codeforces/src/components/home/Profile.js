import { 
  Box,
} from '@mui/material';
import ProfileOverview from './ProfileOverview';
import UserSubmissions from './UserSubmissions';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HandleCookies from "../../utils/HandleCookies";
import NavProfile from "./NavProfile";
import Blogs from './Blogs';

const Profile = () => {
  const [isHome, setIsHome] = useState(false);
  const params = useParams();
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    if (params?.id === HandleCookies.getCookie("id")) {
      setIsHome(true);
    }
  }, [params?.id]);

  const handleTabChange = (tabIndex) => {
    setCurrentTab(tabIndex);
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return <ProfileOverview id={params?.id} isHome={isHome} />;
      case 1:
        return <Blogs author={params?.id} />;
      case 2:
        return <UserSubmissions userId={params?.id} />;
      default:
        return <ProfileOverview id={params?.id} isHome={isHome} />;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <NavProfile id={params?.id} onTabChange={handleTabChange} />
      {renderTabContent()}
    </Box>
  );
};
export default Profile;
