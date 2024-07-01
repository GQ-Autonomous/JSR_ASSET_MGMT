import { Box } from "@chakra-ui/react";
import Footer from "@/components/Footer";
import NavText from "@/components/NavText";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box maxW="90%" mx="auto" paddingY={4}>
      <NavText />
      {children}
      <Footer />
    </Box>
  );
}
