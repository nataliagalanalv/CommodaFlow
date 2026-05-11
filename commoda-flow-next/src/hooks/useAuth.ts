import { useContext } from 'react';
import { AuthContext } from '../../../commoda-flow-next/src/context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};