"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

/**
 * Botón de navegación hacia atrás.
 *
 * Redirige siempre a la página principal (`/`) en lugar de usar
 * `router.back()` para garantizar un destino consistente independientemente
 * del historial de navegación del usuario (evita que llegue a páginas externas
 * si ha accedido directamente por URL).
 *
 * Incluye un icono de flecha izquierda que se desplaza ligeramente al hover
 * para reforzar la indicación de navegación.
 *
 * @example
 * ```tsx
 * // Al inicio de cualquier página con vuelta al inventario:
 * <BackButton />
 * ```
 */
export function BackButton() {
  const router = useRouter();

  return (
    <div className="max-w-[1600px] mx-auto px-6 sm:px-8 pt-4">
      <button
        onClick={() => router.push('/')}
        className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#1A263C]/60 hover:text-[#3D70DD] transition-all bg-slate-50 hover:bg-[#F5F8FF] px-4 py-2 rounded-full border border-slate-100 active:scale-95 shadow-sm"
      >
        <svg
          className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Atrás
      </button>
    </div>
  );
}
