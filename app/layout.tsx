import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "UCR Sales Funnel — Umara Catering",
  description: "Sales pipeline management untuk PT Umara Cipta Rasa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className={`${nunito.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
