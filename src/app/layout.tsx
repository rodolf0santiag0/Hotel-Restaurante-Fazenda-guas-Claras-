import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/public/whatsapp-button";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans" 
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif"
});

export const metadata: Metadata = {
  title: "Hotel Fazenda Águas Claras | Hospedagem de Charme",
  description: "Descubra o aconchego de nossas 20 cabanas exclusivas cercadas pela natureza na Fazenda Águas Claras. Piscina aquecida, café colonial artesanal e tranquilidade.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="font-sans">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
