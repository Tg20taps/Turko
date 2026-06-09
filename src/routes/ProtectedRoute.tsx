import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAdminStore } from '../store/adminStore';

type Props = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: Props) {
  const user = useAdminStore((state) => state.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
