import React from 'react';
import type { User } from '../types/user.types';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-xl'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-indigo-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden`}>
      {user.avatarUrl ? (
        <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
      ) : (
        <span className="font-bold text-indigo-700">
          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </span>
      )}
    </div>
  );
};