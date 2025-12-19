import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// Variables de entorno
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Mi Portfolio";
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Portfolio profesional";
const primaryColor = process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#3B82F6";
const secondaryColor = process.env.NEXT_PUBLIC_SECONDARY_COLOR || "#1E40AF";

export const metadata: Metadata = {
  title: siteName,
  description: siteDescription,
  openGraph: {
    title: siteName,
    description: siteDescription,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} antialiased`}
        style={{
          // @ts-expect-error - CSS custom properties
          '--primary-color': primaryColor,
          '--secondary-color': secondaryColor,
        }}
      >
        {children}
      </body>
    </html>
  );
}
