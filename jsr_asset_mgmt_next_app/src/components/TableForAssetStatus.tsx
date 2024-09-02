"use client"

import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Box
  } from "@chakra-ui/react";
  import React, { useEffect } from 'react'
  
  const TableForAssetStatus = ({tableData}: {tableData: any}) => {

    useEffect(() => {
      console.log(tableData);
      
    }, [])
    return (
      <Box p={4} maxW="full" mx="auto">
        <TableContainer>
          <Table variant="striped" colorScheme="gray">
            <Thead>
              <Tr>
                <Th>Sl no.</Th>
                <Th>Zone</Th>
                <Th>Area</Th>
                <Th>Locality</Th>
                <Th>Code</Th>
                <Th>Name</Th>
                <Th>Frequency</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tableData?.map((item, index) => (
                <Tr key={index}>
                  <Td>{index + 1}</Td>
                  <Td>{item.zone}</Td>
                  <Td>{item.area}</Td>
                  <Td>{item.locality}</Td>
                  <Td>{item.code}</Td>
                  <Td>{item.name}</Td>
                  <Td>{item.frequency}</Td>
                  <Td>{item.status}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    )
  }
  
  export default TableForAssetStatus;
  