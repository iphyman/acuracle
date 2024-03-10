import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { Providers } from "./providers";
import { Navbar } from "@app/components/Navbar";
import { config } from "@app/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Acuracle - a no-code oracle deployment for acurast cloud",
  description: "Acuracle is a hackathon submission for acurast bounty",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));

  return (
    <html lang="en">
      <body className={inter.className} color="#EDF2F7">
        <Providers initialState={initialState}>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
