import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, userId } = useAuth();
  const { userId: paramUserId } = useParams();

  if (!isAuthenticated || userId !== paramUserId) {
    return <Navigate to={`/${paramUserId || ''}`} replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, userId } = useAuth();
  const { userId: paramUserId } = useParams();

  if (isAuthenticated && userId === paramUserId) {
    return <Navigate to={`/${userId}/home`} replace />;
  }

  return children;
};
