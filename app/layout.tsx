import './globals.css';
import { ThemeProvider } from 'next-themes';

export const metadata = {
  title: 'Mokami',
  description: 'Solusi Web App untuk UMKM & Retail',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
