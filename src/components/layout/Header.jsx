import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Avatar, 
  Badge, 
  Box, 
  Tooltip, 
  Menu, 
  MenuItem, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  useTheme, 
  Chip, 
  Button, 
  styled, 
  alpha, 
  keyframes 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningIcon from '@mui/icons-material/Warning';
import SensorsIcon from '@mui/icons-material/Sensors';
import ReportIcon from '@mui/icons-material/Report';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread';
import { useNavigate } from 'react-router-dom';

// Animasyon tanımları
const bellRing = keyframes`
  0% { transform: rotate(0); }
  10% { transform: rotate(-10deg); }
  20% { transform: rotate(10deg); }
  30% { transform: rotate(-10deg); }
  40% { transform: rotate(5deg); }
  50% { transform: rotate(-5deg); }
  60% { transform: rotate(2deg); }
  70% { transform: rotate(-2deg); }
  80% { transform: rotate(0); }
  100% { transform: rotate(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(255, 0, 0, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
`;

const flash = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const glow = keyframes`
  0% { text-shadow: 0 0 5px rgba(255, 255, 255, 0); }
  50% { text-shadow: 0 0 10px rgba(255, 255, 255, 0.5); }
  100% { text-shadow: 0 0 5px rgba(255, 255, 255, 0); }
`;

// Özelleştirilmiş bileşenler
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const NotificationBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 5,
    top: 5,
    border: `2px solid ${theme.palette.error.main}`,
  },
}));

// Bildirim örnekleri
const notificationsSample = [
  { 
    id: 1, 
    type: 'alert', 
    severity: 'high',
    message: 'Yeni ihbar: Orman yangını tespit edildi.', 
    time: '1 dk önce',
    location: 'Antalya, Manavgat',
    unread: true
  },
  { 
    id: 2, 
    type: 'sensor', 
    severity: 'medium',
    message: 'Sensör #12 bağlantısı koptu.', 
    time: '5 dk önce',
    location: 'İzmir, Çeşme',
    unread: true
  },
  { 
    id: 3, 
    type: 'report', 
    severity: 'low',
    message: 'Rapor #45 başarıyla oluşturuldu.', 
    time: '10 dk önce',
    unread: false
  },
];

const typeIconMap = {
  alert: <WarningIcon fontSize="small" />,
  sensor: <SensorsIcon fontSize="small" />,
  report: <ReportIcon fontSize="small" />,
};

const severityColorMap = {
  high: 'error',
  medium: 'warning',
  low: 'info'
};

const Header = ({ 
  onMenuClick, 
  notificationCount = notificationsSample.filter(n => n.unread).length,
  user = {
    name: 'Ahmet Yılmaz',
    role: 'Sistem Yöneticisi',
    avatar: '/avatar-placeholder.png'
  }
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorUserMenu, setAnchorUserMenu] = useState(null);
  const [anchorNotifMenu, setAnchorNotifMenu] = useState(null);
  const [notifications, setNotifications] = useState(notificationsSample);
  const [unreadCount, setUnreadCount] = useState(notificationCount);
  const [isNotifying, setIsNotifying] = useState(false);
  
  const hasNewNotifications = unreadCount > 0;

  const handleUserMenuOpen = (e) => setAnchorUserMenu(e.currentTarget);
  const handleUserMenuClose = () => setAnchorUserMenu(null);

  const handleNotifMenuOpen = (e) => {
    setAnchorNotifMenu(e.currentTarget);
    setNotifications(notifications.map(n => ({...n, unread: false})));
    setUnreadCount(0);
  };
  
  const handleNotifMenuClose = () => setAnchorNotifMenu(null);

  const handleNotificationClick = (id) => {
    console.log(`Bildirim ${id} tıklandı`);
    handleNotifMenuClose();
  };

  const handleLogout = () => {
    console.log('Çıkış yapılıyor');
    handleUserMenuClose();
    navigate('/login');
  };

  // Simüle edilmiş gerçek zamanlı bildirimler
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newNotification = {
          id: Date.now(),
          type: ['alert', 'sensor', 'report'][Math.floor(Math.random() * 3)],
          severity: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
          message: `Yeni ${Math.random() > 0.5 ? 'yangın ihbarı' : 'sensor uyarısı'} alındı`,
          time: 'Şimdi',
          unread: true,
          location: ['İstanbul', 'Ankara', 'İzmir', 'Antalya'][Math.floor(Math.random() * 4)]
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
        setIsNotifying(true);
        setTimeout(() => setIsNotifying(false), 3000);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AppBar
      position="fixed"
      elevation={6}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        backdropFilter: 'blur(8px)',
        backgroundColor: alpha(theme.palette.primary.dark, 0.92),
        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.dark, 0.97),
        }
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 4 }, minHeight: '72px !important' }}>
        {/* Mobil Menü Butonu */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menüyü aç"
          onClick={onMenuClick}
          sx={{
            mr: 2,
            display: { sm: 'none' },
            transition: 'all 0.3s',
            '&:hover': { 
              transform: 'scale(1.1)', 
              color: theme.palette.secondary.main,
              backgroundColor: alpha(theme.palette.common.white, 0.1)
            },
          }}
          size="large"
        >
          <MenuIcon />
        </IconButton>

        {/* Başlık */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: '0.05em',
            userSelect: 'none',
            color: theme.palette.common.white,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: { xs: '1rem', sm: '1.25rem' },
            cursor: 'pointer',
            '&:hover': {
              animation: `${glow} 2s ease-in-out infinite`,
            }
          }}
          onClick={() => navigate('/dashboard')}
          title="Akıllı Yangın İzleme ve Müdahale Sistemi"
        >
          Akıllı Yangın İzleme ve Müdahale Sistemi
        </Typography>

        {/* Bildirimler */}
        <Box sx={{ mr: 2, position: 'relative' }}>
          <Tooltip title={`${unreadCount} okunmamış bildirim`}>
            <IconButton
              color={hasNewNotifications ? 'error' : 'inherit'}
              aria-haspopup="true"
              aria-controls="notification-menu"
              aria-expanded={Boolean(anchorNotifMenu)}
              onClick={handleNotifMenuOpen}
              size="large"
              sx={{
                position: 'relative',
                animation: isNotifying ? `${bellRing} 1s ease, ${flash} 1s ease 2` : '',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                },
              }}
            >
              <NotificationBadge 
                badgeContent={unreadCount} 
                color="error" 
                overlap="circular"
                invisible={!hasNewNotifications}
                sx={{
                  '& .MuiBadge-badge': {
                    animation: isNotifying ? `${pulse} 1.5s ease infinite` : '',
                  }
                }}
              >
                <NotificationsIcon 
                  sx={{ 
                    color: theme.palette.common.white,
                    animation: hasNewNotifications && !isNotifying ? `${flash} 2s ease infinite` : '',
                  }} 
                />
              </NotificationBadge>
              
              {/* Yeni bildirim efekti */}
              {isNotifying && (
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  animation: `${pulse} 1.5s ease`,
                  backgroundColor: alpha(theme.palette.error.main, 0.3),
                  zIndex: -1,
                }} />
              )}
            </IconButton>
          </Tooltip>

          <Menu
            id="notification-menu"
            anchorEl={anchorNotifMenu}
            open={Boolean(anchorNotifMenu)}
            onClose={handleNotifMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                width: 380,
                maxHeight: '70vh',
                p: 0,
                borderRadius: 2,
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                boxShadow: theme.shadows[10],
                overflow: 'hidden',
              },
            }}
          >
            <Box sx={{ 
              p: 2, 
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Bildirimler ({notifications.length})
              </Typography>
              {hasNewNotifications && (
                <Button 
                  size="small" 
                  startIcon={<MarkAsUnreadIcon />}
                  onClick={() => {
                    setNotifications(notifications.map(n => ({...n, unread: false})));
                    setUnreadCount(0);
                  }}
                  sx={{
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                    }
                  }}
                >
                  Tümünü okundu olarak işaretle
                </Button>
              )}
            </Box>
            
            <Divider />
            
            <List sx={{ 
              maxHeight: '60vh', 
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.action.hover,
                borderRadius: '3px',
              }
            }}>
              {notifications.length > 0 ? (
                notifications.map(({ id, type, message, time, severity, location, unread }) => (
                  <ListItem
                    key={id}
                    disablePadding
                    onClick={() => handleNotificationClick(id)}
                    sx={{
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        backgroundColor: theme.palette.action.hover,
                        cursor: 'pointer',
                        transform: 'translateX(5px)'
                      },
                      borderLeft: unread ? `4px solid ${theme.palette.error.main}` : 'none',
                      bgcolor: unread ? alpha(theme.palette.error.main, 0.05) : 'inherit',
                    }}
                  >
                    <Box sx={{ p: 2, width: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <ListItemIcon sx={{ 
                          color: theme.palette[severityColorMap[severity]]?.main || 'inherit',
                          minWidth: '32px'
                        }}>
                          {typeIconMap[type]}
                        </ListItemIcon>
                        <ListItemText
                          primary={message}
                          primaryTypographyProps={{
                            fontWeight: unread ? 'bold' : 'normal'
                          }}
                        />
                        <Typography variant="caption" sx={{ 
                          color: theme.palette.text.secondary,
                          whiteSpace: 'nowrap',
                          ml: 1
                        }}>
                          {time}
                        </Typography>
                      </Box>
                      {location && (
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 4 }}>
                          <Chip 
                            label={location} 
                            size="small" 
                            color={severityColorMap[severity]}
                            variant="outlined"
                            sx={{ mr: 1 }}
                          />
                          {unread && (
                            <Chip 
                              label="Yeni" 
                              size="small" 
                              color="error"
                              sx={{ 
                                fontSize: '0.65rem',
                                height: '20px',
                                animation: `${flash} 1.5s ease infinite`
                              }}
                            />
                          )}
                        </Box>
                      )}
                    </Box>
                  </ListItem>
                ))
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  p: 4,
                  color: theme.palette.text.secondary
                }}>
                  <NotificationsIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="body2">Bildirim bulunmamaktadır</Typography>
                </Box>
              )}
            </List>
          </Menu>
        </Box>

        {/* Kullanıcı avatarı */}
        <Box sx={{ position: 'relative' }}>
          <Tooltip title={`${user.name} (${user.role})`}>
            <IconButton
              onClick={handleUserMenuOpen}
              color="inherit"
              aria-haspopup="true"
              aria-controls="user-menu"
              aria-expanded={Boolean(anchorUserMenu)}
              aria-label="kullanıcı menüsünü aç"
              size="large"
              sx={{
                p: 0,
                borderRadius: '50%',
                overflow: 'hidden',
                transition: 'all 0.3s',
                '&:hover': {
                  boxShadow: `0 0 0 3px ${theme.palette.secondary.main}`,
                },
              }}
            >
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                color="success"
              >
                <Avatar
                  alt={user.name}
                  src={user.avatar}
                  sx={{ 
                    width: 40, 
                    height: 40,
                    bgcolor: theme.palette.secondary.main,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: `0 0 15px ${alpha(theme.palette.secondary.main, 0.5)}`
                    }
                  }}
                >
                  {user.name.charAt(0)}
                </Avatar>
              </StyledBadge>
            </IconButton>
          </Tooltip>

          <Menu
            id="user-menu"
            anchorEl={anchorUserMenu}
            open={Boolean(anchorUserMenu)}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                width: 240,
                borderRadius: 2,
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                boxShadow: theme.shadows[10],
                overflow: 'hidden',
                p: 1,
                transformOrigin: 'top right',
                animation: 'scaleIn 0.2s ease',
                '@keyframes scaleIn': {
                  '0%': { opacity: 0, transform: 'scale(0.95) translateY(-10px)' },
                  '100%': { opacity: 1, transform: 'scale(1) translateY(0)' }
                }
              },
            }}
          >
            <Box sx={{ 
              p: 2, 
              textAlign: 'center',
              animation: `${glow} 3s ease infinite`
            }}>
              <Avatar
                alt={user.name}
                src={user.avatar}
                sx={{ 
                  width: 64, 
                  height: 64,
                  mx: 'auto',
                  mb: 1,
                  bgcolor: theme.palette.primary.main,
                  boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.5)}`,
                  transition: 'all 0.3s ease',
                }}
              />
              <Typography variant="subtitle1" fontWeight="bold">
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.role}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 1 }} />
            
            <MenuItem
              onClick={() => {
                handleUserMenuClose();
                navigate('/profile');
              }}
              sx={{
                borderRadius: 1,
                transition: 'all 0.2s ease',
                '&:hover': { 
                  bgcolor: theme.palette.action.hover,
                  transform: 'translateX(5px)'
                },
              }}
            >
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profil</ListItemText>
            </MenuItem>
            
            <MenuItem
              onClick={() => {
                handleUserMenuClose();
                navigate('/settings');
              }}
              sx={{
                borderRadius: 1,
                transition: 'all 0.2s ease',
                '&:hover': { 
                  bgcolor: theme.palette.action.hover,
                  transform: 'translateX(5px)'
                },
              }}
            >
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Ayarlar</ListItemText>
            </MenuItem>
            
            <Divider sx={{ my: 1 }} />
            
            <MenuItem
              onClick={handleLogout}
              sx={{
                borderRadius: 1,
                color: theme.palette.error.main,
                transition: 'all 0.2s ease',
                '&:hover': { 
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  transform: 'translateX(5px)'
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                <ExitToAppIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Çıkış Yap</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;