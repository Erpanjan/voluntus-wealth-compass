
import { NavigateFunction } from 'react-router-dom';

export const useRouteProtection = (navigate: NavigateFunction) => {
  // Check if current route needs authentication and redirect to login if necessary
  const checkProtectedRoute = () => {
    const currentPath = window.location.pathname;
    const protectedRoutes = ['/welcome', '/onboarding', '/pending-approval', '/dashboard', '/questionnaire'];
    const isAdminRoute = currentPath.startsWith('/admin');
    
    if (protectedRoutes.includes(currentPath) || isAdminRoute) {
      navigate('/login');
      return true;
    }
    
    return false;
  };

  return { checkProtectedRoute };
};
