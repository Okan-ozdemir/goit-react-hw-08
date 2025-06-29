import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import HomePage from './pages/HomePage/HomePage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import LoginPage from './pages/LoginPage/LoginPage';
import ContactsPage from './pages/ContactsPage/ContactsPage';
import { refreshUser } from './redux/auth/operations';
import { clearError } from './redux/auth/authSlice';
import { selectIsRefreshing, selectAuthError } from './redux/auth/selectors';
import { PrivateRoute } from './components/PrivateRoute/PrivateRoute';
import { RestrictedRoute } from './components/RestrictedRoute/RestrictedRoute';
import { Snackbar, Alert, CircularProgress, Box } from '@mui/material';
import { useAuth } from './hooks/useAuth';

function App() {
  console.log('App component is rendering...');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isRefreshing = useSelector(selectIsRefreshing);
  const error = useSelector(selectAuthError);
  const { isLoggedIn } = useAuth();
  
  console.log('App component state:', { isRefreshing, error, isLoggedIn });

  // Handle token refresh on app load
  useEffect(() => {
    const token = localStorage.getItem('persist:auth');
    
    if (token && token !== 'null') {
      dispatch(refreshUser())
        .then((resultAction) => {
          if (refreshUser.rejected.match(resultAction)) {
            console.log('No valid session found, please log in.');
          }
        });
    }
  }, [dispatch]);

  const handleCloseError = () => {
    dispatch(clearError());
  };

  // Redirect to contacts if user is already logged in
  useEffect(() => {
    if (isLoggedIn && window.location.pathname === '/') {
      navigate('/contacts');
    }
  }, [isLoggedIn, navigate]);

  if (isRefreshing) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route
            path="/register"
            element={
              <RestrictedRoute
                redirectTo="/contacts"
                component={<RegisterPage />}
              />
            }
          />
          <Route
            path="/login"
            element={
              <RestrictedRoute
                redirectTo="/contacts"
                component={<LoginPage />}
              />
            }
          />
          <Route
            path="/contacts"
            element={
              <PrivateRoute redirectTo="/login" component={<ContactsPage />} />
            }
          />
        </Route>
      </Routes>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;
