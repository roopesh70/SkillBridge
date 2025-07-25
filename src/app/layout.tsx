import type {Metadata} from 'next';
import './globals.css';
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from '@/context/user-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SkillBridge',
  description: 'Connect. Earn. Grow.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={cn('antialiased bg-background font-sans', inter.variable)}>
        <UserProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
