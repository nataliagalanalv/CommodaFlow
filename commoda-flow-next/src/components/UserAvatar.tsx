"use client";

import React from 'react';
import Image from 'next/image';
import type { User } from '../types/user.types';

interface UserAvatarProps {
  user: User | null; // Aceptamos null por si el estado de auth está cargando
  size?: 'sm' | 'md' | 'lg';
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md' }) => {
  // Clases de tamaño con la escala de Commodore
  const sizeClasses = {
    sm: 'h-8 w-8 text-[10px]',
    md: 'h-11 w-11 text-xs',
    lg: 'h-20 w-20 text-xl'
  };

  // Si no hay usuario (caso logout o carga), mostramos un círculo neutro
  if (!user) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-slate-100 animate-pulse border-2 border-white shadow-sm`} />
    );
  }

  // Lógica de iniciales
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className={`${sizeClasses[size]} relative rounded-full bg-[#F5F8FF] flex items-center justify-center border-2 border-white shadow-sm overflow-hidden flex-shrink-0 transition-transform hover:scale-105`}>
      {user.avatarUrl ? (
        <Image 
          src={user.avatarUrl} 
          alt={user.name} 
          fill // Usamos fill para que se adapte al contenedor circular
          className="object-cover"
          unoptimized={user.avatarUrl.includes('dicebear')} // Para avatars generados por API
        />
      ) : (
        <span className="font-black text-[#3D70DD] tracking-tighter">
          {initials}
        </span>
      )}
    </div>
  );
};