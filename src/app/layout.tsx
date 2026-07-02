import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/public/whatsapp-button";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
