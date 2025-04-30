import { Box, Tabs, Tab } from '@mui/material';
import { useState } from 'react';

const NavProfile = ({ id, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: 'Overview' },
    { label: 'Blog' },
    { label: 'Submissions' }
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    onTabChange?.(newValue); // Call parent handler to update content
  };

  return (
    <Box sx={{ 
      borderBottom: 1, 
      borderColor: 'divider',
      mb: 3,
      mt: 2
    }}>
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        sx={{
          '& .MuiTab-root': {
            textTransform: 'none',
            minWidth: 100,
            fontWeight: 'medium',
          }
        }}
      >
        {tabs.map((tab, index) => (
          <Tab 
            key={index} 
            label={tab.label}
            sx={{ '&:hover': { color: 'primary.main' } }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default NavProfile;
