'use client';

import { useAuth } from '../hooks/useAuth';
import { NavigationMain } from './NavigationMain';

export function NavWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <>{children}</>;

  return (
    <>
      {isAuthenticated && <NavigationMain />}
      <div className={isAuthenticated ? "pt-2" : ""}>
        {children}
      </div>
    </>
  );
}