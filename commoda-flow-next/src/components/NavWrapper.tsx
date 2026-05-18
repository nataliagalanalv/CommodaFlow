import React from 'react';

export interface NavWrapperProps {
  children?: React.ReactNode;
}

export const NavWrapper = ({ children }: NavWrapperProps) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Aquí es donde van tus componentes de logo e inventario que ya tenías */}
        <div className="font-bold text-xl text-[#3D70DD]">CommodaFlow</div>
        <div>{/* Tus links de Usuario / Inventario */}</div>
      </div>
    </nav>
  );
};