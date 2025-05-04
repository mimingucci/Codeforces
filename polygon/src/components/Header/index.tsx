'use client';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  EmojiEvents as ContestIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { userAtom } from 'app/lib/auth-store';
import { signOut } from 'next-auth/react';

export default function Header() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const user = useAtomValue(userAtom);

  const setUser = useSetAtom(userAtom);

  const isAdmin =
    user?.roles.includes('ADMIN') || user?.roles.includes('SUPER_ADMIN');

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: false,
      });
      // Clear user data from Jotai store
      setUser(null);
      // Close the menu
      handleClose();
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 0 }}>
          <Image
            src="/images/topcoder.svg"
            alt="Polygon"
            width={40}
            height={40}
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
            Polygon
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ flexGrow: 1, ml: 4, display: { xs: 'none', md: 'flex' } }}>
          {isAdmin && (
            <Button
              startIcon={<DashboardIcon />}
              sx={{ mr: 2 }}
              onClick={() => router.push('/dashboard')}
            >
              Dashboard
            </Button>
          )}
          <Button
            startIcon={<ContestIcon />}
            onClick={() => router.push('/contests')}
          >
            Contests
          </Button>
        </Box>

        {/* User Menu */}
        <Box sx={{ flexGrow: 0 }}>
          <IconButton
            onClick={handleClick}
            sx={{ p: 0 }}
            aria-controls={open ? 'user-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <PersonIcon />
            </Avatar>
          </IconButton>
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => router.push(`/profile/${user?.id}`)}>
              <PersonIcon sx={{ mr: 1 }} /> Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <LogoutIcon sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
