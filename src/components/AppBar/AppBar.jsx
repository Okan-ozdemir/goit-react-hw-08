import { AppBar as MuiAppBar, Toolbar, Typography, Container, Box, alpha } from '@mui/material';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { Navigation } from '../Navigation/Navigation';
import { UserMenu } from '../UserMenu/UserMenu';
import { AuthNav } from '../AuthNav/AuthNav';
import { useAuth } from '../../hooks/useAuth';

export const AppBar = () => {
  const { isLoggedIn } = useAuth();

  return (
    <MuiAppBar
      position="sticky"
      elevation={0}
      sx={{
        background: t =>
          `linear-gradient(90deg, ${alpha(t.palette.primary.main, 0.85)} 0%, ${alpha(
            t.palette.secondary.main,
            0.85
          )} 100%)`,
        backdropFilter: 'blur(8px)',
        borderBottom: t => `1.5px solid ${alpha(t.palette.primary.dark, 0.15)}`,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
        zIndex: 1201,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', minHeight: 72 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneAndroidIcon
              sx={{
                fontSize: 40,
                color: 'white',
                filter: 'drop-shadow(0 2px 8px #1976d2)',
                mr: 1,
              }}
            />
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 900,
                letterSpacing: 3,
                color: 'white',
                textShadow: '0 2px 12px #1976d2, 0 1px 0 #fff',
                userSelect: 'none',
                fontFamily: 'Inter, Roboto, Arial, sans-serif',
              }}
            >
              Phonebook
            </Typography>
          </Box>
          <Navigation />
          {isLoggedIn ? <UserMenu /> : <AuthNav />}
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
};
