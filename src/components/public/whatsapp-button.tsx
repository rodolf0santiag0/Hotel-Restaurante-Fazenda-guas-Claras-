"use client";

import React from 'react';
import { ADMIN_WHATSAPP_NUMBER } from '@/types';

export default function WhatsAppButton() {
  const message = 'Olá! Gostaria de tirar algumas dúvidas sobre as acomodações do Hotel Fazenda Águas Claras.';
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${ADMIN_WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-2xl hover:shadow-[0_8px_30px_rgb(37,211,102,0.4)] transition-all hover:scale-110 flex items-center justify-center duration-300 group"
      aria-label="Fale conosco no WhatsApp"
      id="global-whatsapp-button"
    >
      {/* Ícone clássico do WhatsApp feito em SVG */}
      <svg
        className="w-7 h-7 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.536 0 10.039-4.502 10.043-10.04.002-2.684-1.038-5.207-2.93-7.101-1.892-1.892-4.407-2.933-7.098-2.935-5.542 0-10.044 4.502-10.048 10.043-.002 1.838.487 3.635 1.417 5.215l-.995 3.637 3.733-.979zm11.368-7.702c-.3-.15-1.77-.874-2.043-.974-.275-.098-.475-.149-.675.15-.2.299-.775.974-.95 1.173-.175.2-.35.226-.65.076-.3-.15-1.267-.467-2.413-1.488-.892-.796-1.493-1.78-1.668-2.08-.175-.3-.019-.461.13-.61.135-.133.3-.349.45-.523.15-.175.2-.299.3-.499.1-.2.05-.375-.025-.524-.075-.15-.675-1.624-.925-2.224-.244-.589-.493-.509-.675-.518-.172-.007-.371-.009-.571-.009-.2 0-.525.075-.8.374-.274.299-1.05 1.024-1.05 2.5 0 1.472 1.071 2.891 1.221 3.09.15.2 2.107 3.216 5.105 4.51.714.307 1.272.49 1.707.629.718.227 1.37.195 1.887.118.577-.085 1.77-.724 2.02-1.424.25-.699.25-1.297.175-1.424-.075-.125-.275-.199-.575-.349z" />
      </svg>
      {/* Texto de Tooltip suave ao passar o mouse */}
      <span className="absolute right-16 scale-0 group-hover:scale-100 bg-stone-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-md transition-all duration-200 origin-right whitespace-nowrap">
        Fale Conosco
      </span>
    </a>
  );
}
