'use client';

import { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  People as PeopleIcon,
  EmojiEvents as ContestIcon,
  Code as ProblemIcon,
  Send as SubmissionIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import Image from 'next/image';
import UserManagement from '@/components/Dashboard/UserManagement';
import ContestManagement from '@/components/Dashboard/ContestManagement';
import ProblemManagement from '@/components/Dashboard/ProblemManagement';
import SubmissionManagement from '@/components/Dashboard/SubmissionManagement';
import DashboardOverview from '@/components/Dashboard/DashboardOverview';

const drawerWidth = 240;

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'users':
        return <UserManagement />;
      case 'contests':
        return <ContestManagement />;
      case 'problems':
        return <ProblemManagement />;
      case 'submissions':
        return <SubmissionManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 0 }}>
            <Image
              src="/images/topcoder4.svg"
              alt="Polygon"
              width={70}
              height={70}
              style={{ marginRight: '8px' }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 'bold',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Dashboard
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          ...(open && {
            width: drawerWidth,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }),
          ...(!open && {
            width: theme.spacing(7),
            '& .MuiDrawer-paper': {
              width: theme.spacing(7),
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            },
          }),
        }}
      >
        <Toolbar />
        <List>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={selectedSection === 'dashboard'}
              onClick={() => setSelectedSection('dashboard')}
              sx={{ minHeight: 48 }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto' }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText
                primary="Dashboard"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={selectedSection === 'users'}
              onClick={() => setSelectedSection('users')}
              sx={{ minHeight: 48 }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto' }}>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Users" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={selectedSection === 'contests'}
              onClick={() => setSelectedSection('contests')}
              sx={{ minHeight: 48 }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto' }}>
                <ContestIcon />
              </ListItemIcon>
              <ListItemText primary="Contests" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={selectedSection === 'problems'}
              onClick={() => setSelectedSection('problems')}
              sx={{ minHeight: 48 }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto' }}>
                <ProblemIcon />
              </ListItemIcon>
              <ListItemText primary="Problems" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={selectedSection === 'submissions'}
              onClick={() => setSelectedSection('submissions')}
              sx={{ minHeight: 48 }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto' }}>
                <SubmissionIcon />
              </ListItemIcon>
              <ListItemText
                primary="Submissions"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
}
