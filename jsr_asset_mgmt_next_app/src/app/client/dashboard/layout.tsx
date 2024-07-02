"use client"

import { Box } from "@chakra-ui/react";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Providers } from "@/app/providers";
import NavText from "@/components/NavText";
import UserDetails from "@/components/UserDetails";
import StoreProvider from "@/app/StoreProvider";


export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en">
        <body className="p-4">
          <StoreProvider>
            <Providers>
              <Box maxW="90%" mx="auto" paddingY={4}>
                <NavText />
                <Navbar />
                <UserDetails />
                {children}
                <Footer />
              </Box>
            </Providers>
          </StoreProvider>
        </body>
      </html>
    );
  }
  