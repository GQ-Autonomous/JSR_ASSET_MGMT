"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Box, Heading, Link, Text, VStack, Card, CardBody, CardHeader, Stack } from "@chakra-ui/react";

export default function Home() {
  const user = useAppSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    // Uncomment and customize the following lines based on user roles
    // if (user.role === "cleaner") {
    //   router.push("/client/dashboard/cleaner/scan-qr-cleaner");
    // }
    // if (user.role === "registerer") {
    //   router.push("/client/dashboard/registerer/register-toilet");
    // }
  }, [user, router]);

  return (
    <main>
      <Box p={6}>
        <VStack spacing={4} align="stretch">
          <Card>
            <CardHeader>
              <Heading size="md">Asset Status </Heading>
            </CardHeader>
            <CardBody>
              <Link
                href="/client/dashboard/supervisor/asset-status"
                color="teal.500"
                fontSize="lg"
              >
                Link
              </Link>
              <Text mt={2}>
                To check the asset status 
              </Text>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Cleaning and survey report</Heading>
            </CardHeader>
            <CardBody>
              <Link
                href="/client/dashboard/manager/reports"
                color="teal.500"
                fontSize="lg"
              >
                Link
              </Link>
              <Text mt={2}>
                To download cleaning and survey report
              </Text>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Variation Report</Heading>
            </CardHeader>
            <CardBody>
              <Link
                href="/client/dashboard/manager/reports-by-variation"
                color="teal.500"
                fontSize="lg"
              >
                Link
              </Link>
              <Text mt={2}>
                To download report with variation using location
              </Text>
            </CardBody>
          </Card>
        </VStack>
      </Box>
    </main>
  );
}
