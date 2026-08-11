import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { connection } from "next/server";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const brandTitle = "Karimun Innovation";
  const brandDescription = "Karimun Innovation";

  return {
    title: brandTitle,
    description: brandDescription,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon_jahris_colored.png", sizes: "32x32", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();

  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <div className="flex-1">{children}</div>
            
          </div>
        </Providers>
      </body>
    </html>
  );
}
