import { Box } from "@chakra-ui/react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { Providers } from "./providers";
import NavText from "../components/NavText";
import UserDetails from "../components/UserDetails";
import StoreProvider from "./StoreProvider";

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
            <NavText />
            {children}
            <Footer />
          </Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
