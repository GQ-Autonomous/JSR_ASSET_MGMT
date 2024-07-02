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
import { useRouter } from "next/navigation"; // Changed from "next/navigation"
import axios from "axios";
import { setUser } from "@/lib/features/user/userSlice";
import { useAppDispatch } from "@/lib/hooks";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSendOtp = () => {
    // Here you would typically send the OTP to the user's phone number
    setOtpSent(true);
  };

  const handleSubmitOtp = async () => {
    try {
      // Make a POST request to your server-side authentication route
      const response = await axios.post("/server/auth/login", {
        mobile_number: phoneNumber,
      });

      // Assuming successful login, you would typically handle the response
      console.log("Login successful:", response.data);

      // Example: Save token in session storage
      const { token } = response.data;
      sessionStorage.setItem("authToken", token);

      dispatch(
        setUser({
          id: response.data.user.id,
          firstName: response.data.user.first_name,
          lastName: response.data.user.last_name,
          role: response.data.user.role,
          token: sessionStorage.getItem("authToken"),
        })
      );

      // Redirect to the desired route
      router.push("/");
    } catch (error) {
      // Handle errors
      console.error("Login error:", error);
      // Example: Show error message to the user
      alert("Login failed. Please try again.");
    }
  };

  return (
    <Box display={"flex"} flexDir={"column"} gap={4}>
      <Box bg={useColorModeValue("blue.500", "blue.900")} px={4}>
        .
      </Box>
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
