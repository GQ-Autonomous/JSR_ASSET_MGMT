import React from "react";
import { Box, Text, Stack, Badge, Flex } from "@chakra-ui/react";

const AssetStatusCard = ({ tableData }) => {
  return (
    <div>
      {tableData?.map((item, index) => (
        <Box
          key={index}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p="4"
          mb="4"
          boxShadow="sm"
          bg="white"
        >
          <Stack spacing="2">
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontSize="lg" fontWeight="bold">
                #{index + 1}
              </Text>
              <Text>
                {item.code}
              </Text>
              <Text
                fontSize="lg"
                fontWeight="bold"
                color={item.status === "ACTIVE" ? "green.500" : "red.500"}
              >
                {item.name}
              </Text>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center">
              <Text>
                {item.zone}/{item.area}/{item.locality}
              </Text>
              <Text>
                <strong>Frequency:</strong> {item.frequency}
              </Text>
            </Flex>
          </Stack>
        </Box>
      ))}
    </div>
  );
};

export default AssetStatusCard;
