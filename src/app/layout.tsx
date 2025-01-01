import { Menu } from "@/components/menu";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { getConfig } from "./config";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "AegeanSea",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get("cookie")
  );

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
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}
