import { ConnectWallet } from "@/components/connect-wallet";
import { Menu } from "@/components/menu";
import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { getConfig } from "./config";
import "./globals.css";

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
          <div className="flex justify-between items-center px-2 lg:px-4 text-sm">
            <Menu />
            <Providers initialState={initialState}>
              <ConnectWallet />
            </Providers>
          </div>
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
