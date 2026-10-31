import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Laboratorio 11 · Componentes", description: "CSS Modules y Tailwind CSS" };
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) { return <html lang="es"><body>{children}</body></html>; }
