import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const RestrictedRoute = ({ component: Component, redirectTo = '/contacts' }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to={redirectTo} /> : Component;
};
