import { useEffect, useState, useDeferredValue, Suspense } from "react";
import logo from "../assets/image/Codeforces_logo.svg.png";
import icons from "../utils/icons";
import UserApi from "../getApi/UserApi";
import HandleCookies from "../utils/HandleCookies";
import SearchResults from "./home/SearchResults";
import { useNavigate } from "react-router-dom";
import { 
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  InputBase,
  Paper,
  Badge,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

const { IoIosNotifications, IoMdSearch } = icons;

// Styled components
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const Header = () => {
  let user = "";
  const [value, setValue] = useState("");
  const deferredQuery = useDeferredValue(value);
  const navigate = useNavigate();
  const handleClick = () => {
    const query = value;
    setValue("");
    navigate(`/search?query=${query}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      let query = value;
      setValue("");
      navigate(`/search?query=${query}`);
    }
  };

  const checkLogin = () => {
    if (HandleCookies.getCookie("username")?.length > 0) {
      user = HandleCookies.getCookie("username");
      return true;
    } else {
      return false;
    }
  };

  const handleLogout = async () => {
    user = "";
    const rs = await UserApi.logout(HandleCookies.getCookie("refreshToken"));
    console.log(rs);
    HandleCookies.setCookie("accessToken", "", 0);
    HandleCookies.setCookie("refreshToken", "", 0);
    HandleCookies.setCookie("username", "", 0);
    window.location.replace("/");
  };
  useEffect(() => {
    checkLogin();
  }, [user]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box sx={{ width: 300 }}>
            <a href="http://localhost:3000/">
              <img src={logo} alt="Codeforces" style={{ width: '100%' }} />
            </a>
          </Box>

          {/* User Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton>
              <Badge badgeContent={4} color="primary">
                <IoIosNotifications />
              </Badge>
            </IconButton>
            {checkLogin() ? (
              <>
                <Button 
                  href={`http://localhost:3000/profile/${user}`}
                  color="inherit"
                >
                  {user}
                </Button>
                <Button 
                  color="inherit"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
              ) : (
                <Button 
                  href="http://localhost:3000/login"
                  color="inherit"
                >
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
  
          {/* Navigation Bar */}
          <Paper elevation={0} sx={{ borderRadius: 0 }}>
            <Toolbar>
              <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
                <Button href="http://localhost:3000/home" color="inherit">HOME</Button>
                <Button href="http://localhost:3000/ide" color="inherit">IDE</Button>
                <Button href="http://localhost:3000/problems?page=0" color="inherit">PROBLEMSET</Button>
                <Button href="http://localhost:3000/rating" color="inherit">TOP USER</Button>
                <Button href="http://localhost:3000/calendar" color="inherit">CALENDAR</Button>
                <Button href="http://localhost:3000/createproblem" color="inherit">CREATE PROBLEM</Button>
                <Button color="inherit">HELP</Button>
                <Button color="inherit">CATALOG</Button>
              </Box>
          {/* Search Bar */}
          <Search>
              <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <IconButton onClick={handleClick}>
                  <IoMdSearch />
                </IconButton>
              </Paper>
              {/* Search Results */}
              {deferredQuery && (
                <Paper
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    zIndex: 1000,
                    mt: 0.5
                  }}
                >
                  <Suspense fallback={
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography>Loading...</Typography>
                    </Box>
                  }>
                    <SearchResults query={deferredQuery} />
                  </Suspense>
                </Paper>
              )}
            </Search>
          </Toolbar>
          </Paper>
      </AppBar>
    </Box>
  );
};
export default Header;
