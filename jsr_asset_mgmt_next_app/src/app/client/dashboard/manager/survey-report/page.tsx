"use client"

import SurveyReportForm from '@/components/SurveyReportForm'
import { Box, Center, Flex, Heading } from '@chakra-ui/react'
import React from 'react'

const SurveyReport = () => {
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
        <Heading>Download survey report</Heading>
      </Center>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={4}
        w="full"
      >
        <SurveyReportForm />
      </Box>
    </Box>
  )
}

export default SurveyReport
