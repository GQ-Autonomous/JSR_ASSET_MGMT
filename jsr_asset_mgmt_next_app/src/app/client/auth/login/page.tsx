"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Center,
  Input,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const router = useRouter();

  const handleSendOtp = () => {
    // Here you would typically send the OTP to the user's phone number
    setOtpSent(true);
  };

  const handleSubmitOtp = () => {
    // Handle OTP submission here
    router.push("/");
  };

  return (
    <Box display={"flex"} flexDir={"column"} gap={4}>
      <Box bg={useColorModeValue("blue.500", "blue.900")} px={4}>.</Box>
      <Center>
        <Box
          p={4}
          maxWidth="md"
          borderWidth={1}
          borderRadius="lg"
          overflow="hidden"
        >
          <VStack spacing={4}>
            <Text>Registered Mobile No.</Text>
            {!otpSent ? (
              <>
                <Input
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Button colorScheme="blue" onClick={handleSendOtp}>
                  Send OTP
                </Button>
              </>
            ) : (
              <>
                <Input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <Button colorScheme="blue" onClick={handleSubmitOtp}>
                  Submit OTP
                </Button>
              </>
            )}
          </VStack>
        </Box>
      </Center>
      <Box></Box>
    </Box>
  );
};

export default Login;
