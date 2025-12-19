import type { Metadata } from "next";
import { inter } from "@/config/fonts";
import { VanillaCookieConsent } from "@/utils/cookieconsent/VanillaCookieConsent";
import { PayPalProvider } from "@/components";

import "./globals.css";
import "../components/components.css";
import "./legal/legal.css";



export const metadata: Metadata = {
  title: {
    template: "%s - Generador de webs",
    default: "Home - Generador de webs",
  },
  description: "Crea tu web profesional en minutos. Plantillas de webs corporativas y portfolios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} antialiased bg-secondary text-primary dark:bg-primary dark:text-secondary transition-colors`}
      >
        <PayPalProvider>
          {children}
          <VanillaCookieConsent />
        </PayPalProvider>
      </body>
    </html>
  );
}
