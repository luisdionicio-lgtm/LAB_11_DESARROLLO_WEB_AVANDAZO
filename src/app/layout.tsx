import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Órbita — Ideas que se convierten en logros',description:'Tu equipo, en la misma órbita. Proyectos, personas y tareas en un espacio diseñado para crear juntos.',icons:{icon:'/icon.svg'}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="es"><body>{children}</body></html>;}
