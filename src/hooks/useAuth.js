import { useSelector } from 'react-redux';
import {
  selectUser,
  selectIsLoggedIn,
  selectIsRefreshing,
  selectToken,
  selectAuthError,
} from '../redux/auth/selectors';

/**
 * Authentication bilgilerine erişmek için özel hook
 * @returns {Object} Kullanıcı kimlik doğrulama durumu ve bilgileri
 */
export const useAuth = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectIsRefreshing);
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const error = useSelector(selectAuthError);

  return {
    isLoggedIn,
    isRefreshing,
    user,
    token,
    error,
  };
};
