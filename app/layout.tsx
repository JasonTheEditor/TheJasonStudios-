import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'TheJason Studios', description: 'My portfolio of photography, apps, and edits.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
