import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

export const AuthNav = () => {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button
        component={Link}
        to="/register"
        variant="outlined"
        sx={{ color: 'white', borderColor: 'white' }}
      >
        Register
      </Button>
      <Button
        component={Link}
        to="/login"
        variant="outlined"
        sx={{ color: 'white', borderColor: 'white' }}
      >
        Log In
      </Button>
    </div>
  );
};
