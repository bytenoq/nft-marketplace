import { Menu } from "@/components/menu";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AegeanSea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="md:block">
          <Menu />
          <div className="border-t">
            <div className="bg-background">
              <div className="grid lg:grid-cols-5"></div>
            </div>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
