import { useEffect, useState, useDeferredValue, Suspense } from "react";
import logo from "../assets/image/Codeforces_logo.svg.png";
import icons from "../utils/icons";
import HandleCookies from "../utils/HandleCookies";
import SearchResults from "./home/SearchResults";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  InputBase,
  Paper,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

const { IoMdSearch } = icons;

// Styled components
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const Header = () => {
  let user = "";
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [debouncedQuery] = useDebouncedValue(searchQuery, 300);

  const { t } = useTranslation();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    // Delay hiding to allow clicking on search results
    setTimeout(() => {
      setIsSearchFocused(false);
    }, 200);
  };

  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    // setSearchQuery("");
    if (searchQuery.trim().length > 0) {
      setIsSearchFocused(false);
      navigate(`/search?query=${searchQuery.trim()}`);
    }
  };

  const checkLogin = () => {
    if (HandleCookies.getCookie("id")?.length > 0) {
      user = HandleCookies.getCookie("id");
      return true;
    } else {
      return false;
    }
  };

  const handleLogout = async () => {
    user = "";
    // await UserApi.logout(HandleCookies.getCookie("token"));
    HandleCookies.setCookie("token", "", 0);
    HandleCookies.setCookie("username", "", 0);
    HandleCookies.setCookie("id", "", 0);
    HandleCookies.setCookie("email", "", 0);
    window.location.replace("/");
  };

  useEffect(() => {
    checkLogin();
  }, [user]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Box sx={{ width: 300 }}>
            <a href="http://localhost:3000/">
              <img src={logo} alt="Codeforces" style={{ width: "100%" }} />
            </a>
          </Box>

          {/* User Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {checkLogin() ? (
              <>
                <Button
                  href={`http://localhost:3000/profile/${user}`}
                  color="inherit"
                >
                  {t("header.profile")}
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  {t("header.logout")}
                </Button>
              </>
            ) : (
              <Button href="http://localhost:3000/login" color="inherit">
                {t("header.login")}
              </Button>
            )}
            <LanguageSwitcher />
          </Box>
        </Toolbar>

        {/* Navigation Bar */}
        <Paper elevation={0} sx={{ borderRadius: 0 }}>
          <Toolbar>
            <Box sx={{ display: "flex", gap: 2, flexGrow: 1 }}>
              <Button href="http://localhost:3000/home" color="inherit">
                {t("header.home")}
              </Button>
              <Button href="http://localhost:3000/contests" color="inherit">
                {t("header.contest")}
              </Button>
              <Button href="http://localhost:3000/ide" color="inherit">
                {t("header.ide")}
              </Button>
              <Button
                href="http://localhost:3000/problems?page=0"
                color="inherit"
              >
                {t("header.problemset")}
              </Button>
              <Button href="http://localhost:3000/rating" color="inherit">
                {t("header.topUser")}
              </Button>
              <Button href="http://localhost:3000/calendar" color="inherit">
                {t("header.calendar")}
              </Button>
            </Box>
            {/* Search Bar */}
            <Search>
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: 400,
                }}
                onSubmit={(e) => {
                  e.preventDefault(); // Prevent form submission
                  handleClick(e);
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder={t("header.searchPlaceholder")}
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                />
                <IconButton type="submit" onClick={handleClick}>
                  <IoMdSearch />
                </IconButton>
              </Paper>
              {debouncedQuery && isSearchFocused && (
                <Paper
                  sx={{
                    position: "absolute",
                    width: "100%",
                    zIndex: 1000,
                    mt: 0.5,
                  }}
                >
                  <SearchResults query={debouncedQuery} />
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
