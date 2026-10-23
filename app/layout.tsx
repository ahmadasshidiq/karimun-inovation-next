import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { connection } from "next/server";
import { Providers } from "@/components/providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
});

export async function generateMetadata(): Promise<Metadata> {
  const brandTitle = "Indeks Inovasi Daerah - Kabupaten Karimun";
  const brandDescription = "Portal resmi pelaporan dan informasi Indeks Inovasi Daerah (IID) Pemerintah Kabupaten Karimun. Mendorong transformasi digital dan ekosistem inovasi Bumi Berazam.";

  return {
    title: {
      default: brandTitle,
      template: `%s | ${brandTitle}`,
    },
    description: brandDescription,
    keywords: ["Karimun", "Inovasi", "Indeks Inovasi Daerah", "IID", "Baperlitbang", "Pelayanan Publik"],
    authors: [{ name: "Baperlitbang Kabupaten Karimun" }],
    creator: "Pemerintah Kabupaten Karimun",
    publisher: "Pemerintah Kabupaten Karimun",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL("https://baperlitbang.karimunkab.go.id"),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: brandTitle,
      description: brandDescription,
      url: "/",
      siteName: brandTitle,
      locale: "id_ID",
      type: "website",
      images: [
        {
          url: "/images/hero-karimun-new.jpg",
          width: 1200,
          height: 630,
          alt: brandTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: brandTitle,
      description: brandDescription,
      images: ["/images/hero-karimun-new.jpg"],
    },
    icons: {
      icon: [{ url: "/images/logo-karimun.webp", type: "image/webp" }],
      shortcut: "/images/logo-karimun.webp",
      apple: "/images/logo-karimun.webp",
    },
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 5,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
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
    <html lang="id" className={`${poppins.variable} scroll-smooth`}>
      <body className={`${poppins.className} antialiased bg-white`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
