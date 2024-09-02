"use client";

import React from "react";
import {
  Box,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Center,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import DateRangeForm from "@/components/DateRangeForm";
import SurveyReportForm from "@/components/SurveyReportForm";

const page = () => {
  return (
    <Box w="full" minH="100vh" bg="gray.50">
      <Flex
        as="nav"
        w="full"
        p={4}
        bg="white"
        justifyContent="center"
        alignItems="center"
      ></Flex>
      <Center>
        <Heading>Download cleaning report</Heading>
      </Center>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={4}
        w="full"
      >
        <DateRangeForm />
      </Box>
    </Box>
  );
};

export default page;
