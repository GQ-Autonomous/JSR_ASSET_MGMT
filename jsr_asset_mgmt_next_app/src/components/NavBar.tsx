"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";

const LinksManager = [
  { name: "Grid Report", path: "/grid-report" },
  { name: "History Reports", path: "/history-reports" },
  { name: "Feedback Report", path: "/feedback-report" },
  { name: "Google Map", path: "/google-map" },
  { name: "Change Frequency", path: "/change-frequency" },
  { name: "Frequency List", path: "/frequency-list" },
  { name: "Asset Status", path: "/asset-status" },
];

const LinksSupervisor = [
  { name: "My Grid Report", path: "/my-grid-report" },
  { name: "My performance reports", path: "/my-performance-report" },
  { name: "Feedback Report", path: "/feedback-report" },
  { name: "My Google Map", path: "/my-google-map" },
];

const LinksCleaner: [] = [];

const NavLink = ({ children, path }: { children: string; path: string }) => (
  <Link href={path}>
    <Button
      px={2}
      py={1}
      rounded={"md"}
      color="white"
      bg="blue.500"
      _hover={{ bg: "blue.400" }}
    >
      {children}
    </Button>
  </Link>
);

const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile, setIsMobile] = useState(false);

  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box bg={useColorModeValue("blue.500", "blue.900")} px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <HStack spacing={8} alignItems={"center"}>
          <Box color="white">Home</Box>
          <HStack as={"nav"} spacing={4} display={{ base: "none", lg: "flex" }}>
            {user.role === "cleaner" &&
              LinksCleaner.map((link: { name: string; path: string }) => (
                <NavLink key={link.name} path={link.path}>
                  {link.name}
                </NavLink>
              ))}
            {user.role === "supervisor" &&
              LinksSupervisor.map((link: { name: string; path: string }) => (
                <NavLink key={link.name} path={link.path}>
                  {link.name}
                </NavLink>
              ))}
            {user.role === "manager" &&
              LinksManager.map((link: { name: string; path: string }) => (
                <NavLink key={link.name} path={link.path}>
                  {link.name}
                </NavLink>
              ))}
            <NavLink key={"logout"} path={"/logout"}>
              {"Logout"}
            </NavLink>
          </HStack>
        </HStack>
        <IconButton
          size={"md"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ base: "flex", lg: "none" }}
          onClick={isOpen ? onClose : onOpen}
          color="white"
          bg="blue.500"
          _hover={{ bg: "blue.400" }}
        />
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ lg: "none" }}>
          <Stack as={"nav"} spacing={4}>
            {LinksManager.map((link) => (
              <NavLink key={link.name} path={link.path}>
                {link.name}
              </NavLink>
            ))}
            <NavLink key={"logout"} path={"/logout"}>
              {"Logout"}
            </NavLink>
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};

export default NavBar;
