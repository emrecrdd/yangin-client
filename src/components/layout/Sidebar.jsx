import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Toolbar,
  Box,
  Divider,
  Typography,
  useTheme,
  ListSubheader,
} from '@mui/material';
import {
  Home as HomeIcon,
  Sensors as SensorsIcon,
  Report as ReportIcon,
  WarningAmber as WarningIcon,
  ExpandLess,
  ExpandMore,
  ManageAccounts as ManageIcon,
  Settings as SettingsIcon,
  Whatshot as FireIcon,
  Logout as LogoutIcon,
  HelpOutline as HelpIcon,
} from '@mui/icons-material';
import { NavLink, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 280;

const groupedMenuItems = [
  {
    title: 'GENEL',
    items: [
      { text: 'Ana Sayfa', icon: <HomeIcon />, path: '/' },
      { text: 'Sensörler', icon: <SensorsIcon />, path: '/sensors' },
    ],
  },
  {
    title: 'İHBAR & RAPOR',
    items: [
      { text: 'İhbarlar', icon: <WarningIcon />, path: '/alerts' },
      { text: 'Raporlar', icon: <ReportIcon />, path: '/reports' },
    ],
  },
  {
    title: 'YÖNETİM',
    items: [
      {
        parent: true,
        text: 'Yönetim',
        icon: <ManageIcon />,
        children: [
          { text: 'Sensör Yönetimi', icon: <SettingsIcon />, path: '/admin/sensors' },
        ],
      },
    ],
  },
];

const Sidebar = ({ drawerWidth = DRAWER_WIDTH, mobileOpen, onClose }) => {
  const theme = useTheme();
  const location = useLocation();
  const [openManagement, setOpenManagement] = useState(false);

  useEffect(() => {
    groupedMenuItems.forEach((group) => {
      group.items.forEach((item) => {
        if (item.parent && item.children?.some((child) => location.pathname.startsWith(child.path))) {
          setOpenManagement(true);
        }
      });
    });
  }, [location.pathname]);

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Başlık */}
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          fontWeight: 'bold',
          fontSize: 20,
          justifyContent: 'center',
          userSelect: 'none',
          py: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <FireIcon sx={{ color: theme.palette.primary.main }} />
        <Typography
          sx={{
            background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            letterSpacing: 2,
          }}
        >
          AKILLI YANGIN
        </Typography>
      </Toolbar>

      {/* Menü Listesi */}
      <List sx={{ flexGrow: 1, py: 2 }}>
        {groupedMenuItems.map((group) => (
          <Box key={group.title}>
            <ListSubheader
              disableSticky
              sx={{
                px: 3,
                pt: 2,
                pb: 1,
                color: theme.palette.text.secondary,
                fontSize: 12,
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              {group.title}
            </ListSubheader>
            {group.items.map(({ text, icon, path, parent, children }) =>
              parent ? (
                <React.Fragment key={text}>
                  <ListItemButton
                    onClick={() => setOpenManagement((prev) => !prev)}
                    selected={children.some((c) => location.pathname.startsWith(c.path))}
                    sx={{
                      px: 3,
                      '&.Mui-selected': {
                        bgcolor: theme.palette.action.selected,
                        fontWeight: 'bold',
                      },
                      '&:hover': {
                        bgcolor: theme.palette.action.hover,
                      },
                      transition: 'all 0.3s',
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit' }}>{icon}</ListItemIcon>
                    <ListItemText primary={text} />
                    {openManagement ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={openManagement} timeout="auto" unmountOnExit>
                    <List disablePadding>
                      {children.map(({ text: childText, icon: childIcon, path: childPath }) => (
                        <NavLink to={childPath} key={childText} style={{ textDecoration: 'none' }}>
                          {({ isActive }) => (
                            <ListItemButton
                              selected={isActive}
                              onClick={onClose}
                              sx={{
                                pl: 6,
                                position: 'relative',
                                '&.Mui-selected': {
                                  bgcolor: theme.palette.primary.main,
                                  color: theme.palette.primary.contrastText,
                                  fontWeight: 'bold',
                                  '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: 4,
                                    bgcolor: theme.palette.primary.contrastText,
                                    borderRadius: '0 4px 4px 0',
                                    boxShadow: `2px 0 6px ${theme.palette.primary.light}`,
                                  },
                                },
                                '&:hover': {
                                  bgcolor: theme.palette.primary.light,
                                  color: theme.palette.primary.contrastText,
                                },
                                transition: 'all 0.3s',
                              }}
                            >
                              <ListItemIcon sx={{ color: 'inherit' }}>{childIcon}</ListItemIcon>
                              <ListItemText primary={childText} />
                            </ListItemButton>
                          )}
                        </NavLink>
                      ))}
                    </List>
                  </Collapse>
                </React.Fragment>
              ) : (
                <NavLink to={path} key={text} style={{ textDecoration: 'none' }}>
                  {({ isActive }) => (
                    <ListItemButton
                      selected={isActive}
                      onClick={onClose}
                      sx={{
                        px: 3,
                        position: 'relative',
                        '&.Mui-selected': {
                          bgcolor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                          fontWeight: 'bold',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 4,
                            bgcolor: theme.palette.primary.contrastText,
                            borderRadius: '0 4px 4px 0',
                            boxShadow: `2px 0 6px ${theme.palette.primary.light}`,
                          },
                        },
                        '&:hover': {
                          bgcolor: theme.palette.primary.light,
                          color: theme.palette.primary.contrastText,
                        },
                        transition: 'all 0.3s',
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: 'inherit',
                          transition: 'transform 0.2s ease',
                          ...(isActive && { transform: 'scale(1.15)' }),
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  )}
                </NavLink>
              )
            )}
          </Box>
        ))}
      </List>

      <Divider />

      {/* Yardım & Çıkış */}
      <Box sx={{ px: 2 }}>
        <ListItemButton
          sx={{ borderRadius: 2, mb: 1 }}
          onClick={() => alert('Yardım sayfası yakında...')}
        >
          <ListItemIcon><HelpIcon color="action" /></ListItemIcon>
          <ListItemText primary="Yardım" />
        </ListItemButton>
        <ListItemButton
          sx={{ borderRadius: 2 }}
          onClick={() => alert('Çıkış yapılıyor...')}
        >
          <ListItemIcon><LogoutIcon color="action" /></ListItemIcon>
          <ListItemText primary="Çıkış Yap" />
        </ListItemButton>
      </Box>

      {/* Altbilgi */}
      <Box sx={{ p: 2, textAlign: 'center', mt: 'auto' }}>
        <Typography variant="body2" color="text.secondary" sx={{ userSelect: 'none' }}>
          © 2025 Akıllı Yangın Sistemi
        </Typography>
        <Typography variant="caption" sx={{ fontSize: 11, mt: 1, color: 'success.main', fontWeight: 600 }}>
          v1.0.0 · Sistem Aktif
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobil */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Masaüstü */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
