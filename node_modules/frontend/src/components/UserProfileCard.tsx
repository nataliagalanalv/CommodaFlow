import React from 'react';
import { UserAvatar } from './UserAvatar';
import type { User } from '../types/user.types';

export const UserProfileCard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
      <UserAvatar user={user} size="lg" />
      <div>
        <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
        <p className="text-sm text-slate-500">{user.email}</p>
        <div className="mt-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {user.role.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};