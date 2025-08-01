import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CssBaseline, 
  useTheme, 
  useMediaQuery, 
  styled
} from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const DRAWER_WIDTH = 280;
const HEADER_HEIGHT = 72;

const MainContent = styled(Box)(({ theme, $drawerwidth, $ismobileopen }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: $ismobileopen ? 0 : `${$drawerwidth}px`,
  marginTop: `${HEADER_HEIGHT}px`,
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
    padding: theme.spacing(2),
  },
  backgroundColor: theme.palette.background.default,
  minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
  overflowX: 'hidden',
}));

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerToggle = () => {
    if (isClosing) return;
    setMobileOpen((prev) => !prev);
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  useEffect(() => {
    if (isMobile && mobileOpen) {
      handleDrawerClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default,
    }}>
      <CssBaseline />
      
      <Header 
        onMenuClick={handleDrawerToggle} 
        sx={{
          position: 'fixed',
          width: `calc(100% - ${mobileOpen ? DRAWER_WIDTH : 0}px)`,
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      />
      
      <Sidebar 
        drawerWidth={DRAWER_WIDTH} 
        mobileOpen={mobileOpen} 
        onClose={handleDrawerClose}
        onTransitionEnd={handleDrawerTransitionEnd}
      />
      
      <MainContent 
  component="main"
  $drawerwidth={DRAWER_WIDTH}
  $ismobileopen={isMobile && !mobileOpen}
>
  <Box
    sx={{
      width: '100%',
      p: isMobile ? 0 : 2,
      borderRadius: 2,
      bgcolor: theme.palette.background.paper,
      boxShadow: theme.shadows[1],
      minHeight: `calc(100vh - ${HEADER_HEIGHT + 24}px)`,

      // Eklenen satır:
      maxWidth: '100%', // Harita gibi geniş içerikler için
    }}
  >
    <Outlet />
  </Box>
</MainContent>

    </Box>
  );
};

export default MainLayout;