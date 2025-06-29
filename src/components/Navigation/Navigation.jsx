import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Box, Button } from '@mui/material';

export const Navigation = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Box component="nav" sx={{ display: 'flex', gap: 2, mr: 2 }}>
      <Button
        component={NavLink}
        to="/"
        sx={{
          color: 'white',
          textDecoration: 'none',
          '&.active': {
            fontWeight: 'bold',
            textDecoration: 'underline',
          },
        }}
      >
        Home
      </Button>
      {isLoggedIn && (
        <Button
          component={NavLink}
          to="/contacts"
          sx={{
            color: 'white',
            textDecoration: 'none',
            '&.active': {
              fontWeight: 'bold',
              textDecoration: 'underline',
            },
          }}
        >
          Contacts
        </Button>
      )}
    </Box>
  );
};
