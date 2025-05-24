import { Box, Tabs, Tab } from "@mui/material";
import { useEffect, useState } from "react";
import {
  Person as PersonIcon,
  Article as ArticleIcon,
  Code as CodeIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

const NavProfile = ({ id, onTabChange, isHome, activeTab = 0 }) => {
  const [value, setValue] = useState(activeTab);

  useEffect(() => {
    setValue(activeTab);
  }, [activeTab]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onTabChange(newValue);
  };

  const a11yProps = (index) => {
    return {
      id: `profile-tab-${index}`,
      "aria-controls": `profile-tabpanel-${index}`,
    };
  };

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        mb: 3,
        mt: 2,
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        sx={{
          "& .MuiTab-root": {
            textTransform: "none",
            minWidth: 100,
            fontWeight: "medium",
          },
        }}
      >
        <Tab
          icon={<PersonIcon fontSize="small" />}
          iconPosition="start"
          label="Overview"
          sx={{ "&:hover": { color: "primary.main" } }}
          {...a11yProps(0)}
        />
        <Tab
          icon={<ArticleIcon fontSize="small" />}
          iconPosition="start"
          label="Blog"
          sx={{ "&:hover": { color: "primary.main" } }}
          {...a11yProps(1)}
        />
        <Tab
          icon={<CodeIcon fontSize="small" />}
          iconPosition="start"
          label="Submissions"
          sx={{ "&:hover": { color: "primary.main" } }}
          {...a11yProps(2)}
        />
        {isHome && (
          <Tab
            icon={<SettingsIcon fontSize="small" />}
            iconPosition="start"
            label="Settings"
            sx={{ "&:hover": { color: "primary.main" } }}
            {...a11yProps(3)}
          />
        )}
      </Tabs>
    </Box>
  );
};

export default NavProfile;
