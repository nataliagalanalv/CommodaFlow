import React from 'react';
import { UserAvatar } from './UserAvatar';
import type { User } from '../types/user.types';

export const Navbar: React.FC<{ user: User }> = ({ user }) => {
  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold text-indigo-600 tracking-tight">CommodaFlow</span>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-indigo-600 transition-colors">Inventario</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Alquileres</a>
            {user.role === 'admin' && (
              <a href="#" className="hover:text-indigo-600 transition-colors">Panel Admin</a>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
          </div>
          <UserAvatar user={user} size="sm" />
        </div>
      </div>
    </nav>
  );
};