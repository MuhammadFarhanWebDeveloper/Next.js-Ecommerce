import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import NextTopLoader from "nextjs-toploader";
import { cookies } from "next/headers";
import StoreProvider from "./StateWrapper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUser } from "@/lib/data";
import prisma from "@/util/db.config";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
export const metadata = {
  title: "Ventura | Online E-commerce Platform",
  description:
    "Ventura is an e-commerce (showcase) project developed using Next.js 14 and Prisma. Created by Hafiz Muhammad Farhan, this project provides a seamless shopping experience with efficient server-side rendering, user-friendly interfaces, and robust backend support.",
};

export default async function RootLayout({ children }) {
  const cookieStore = cookies();
  const token = cookieStore.get("authtoken")?.value;
  let user = token ? await getUser(token) : null;

  const categories = await prisma.category.findMany();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader
          color="#ff0000"
          height={4}
          showSpinner={false}
          delay={100}
          transitionDuration={300}
        />
        <StoreProvider initialUser={user} initialCategories={categories}>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          <header className="border">
            <Navbar user={user} />
          </header>
          <main className="py-32 md:py-24">{children}</main>
          <footer></footer>
        </StoreProvider>
      </body>
    </html>
  );
}
