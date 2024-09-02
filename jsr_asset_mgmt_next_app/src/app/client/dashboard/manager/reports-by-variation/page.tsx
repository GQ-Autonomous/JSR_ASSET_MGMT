"use client"

import React, { useState, useMemo } from 'react';
import { Box, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Button, ButtonGroup, Center, Spinner } from "@chakra-ui/react";
import DownloadCSV from '@/components/DownloadCSV';
import ManagerFormReportsVariation from '@/components/ManagerFormReportsVariation';

const calculateDistanceInFeet = (lat1, lon1, lat2, lon2) => {
  if (lat1 === null || lon1 === null || lat2 === null || lon2 === null) {
    return "-";
  }

  const toRadians = (degree) => (degree * Math.PI) / 180;

  const R = 6371e3;
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceInMeters = R * c;
  const distanceInFeet = distanceInMeters * 3.28084;

  return distanceInFeet.toFixed(2);
};

const calculateVariation = (distance) => {
  if (distance === "-") {
    return "-";
  }

  const variation = distance - 10;
  return variation.toFixed(2);
};

const Home = () => {
  const [tableData, setTableData] = useState([]);
  const [isTableDisplay, setIsTableDisplay] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const [type, setType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100; // Number of rows per page

  const TableDataHandler = (data) => {
    setIsTableDisplay(false);
    setTableData(data);
    setIsTableDisplay(true);
  };

  const setLoadingTrue = () => {
    setIsLoading(true)
    setIsTableDisplay(false);
  }

  const setLoadingFalse = () => {
    setIsLoading(false)
    setIsTableDisplay(true);
  }

  const filteredTableData = tableData.map(data => {
    const distance = calculateDistanceInFeet(data.dal_latitude, data.dal_longitude, data.scanned_latitude, data.scanned_longitude);
    const variation = calculateVariation(distance);
    
    return {
      ...data,
      variation,
      distance,
    };
  }).filter(data => {
    if (type === "Exception") {
      return data.distance !== "-" && data.variation > 0;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredTableData.length / itemsPerPage);
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredTableData.slice(start, end);
  }, [currentPage, filteredTableData]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Button
            key={i}
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </Button>
        );
      }
    } else {
      pages.push(
        <Button
          key={1}
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </Button>
      );
      pages.push(
        <Button
          key={2}
          onClick={() => handlePageChange(2)}
          isActive={currentPage === 2}
        >
          2
        </Button>
      );

      if (currentPage > 4) {
        pages.push(
          <Button key="dots1" disabled>
            ...
          </Button>
        );
      }

      if (currentPage > 3 && currentPage < totalPages - 2) {
        pages.push(
          <Button
            key={currentPage}
            onClick={() => handlePageChange(currentPage)}
            isActive={true}
          >
            {currentPage}
          </Button>
        );
      }

      if (currentPage < totalPages - 3) {
        pages.push(
          <Button key="dots2" disabled>
            ...
          </Button>
        );
      }

      pages.push(
        <Button
          key={totalPages - 1}
          onClick={() => handlePageChange(totalPages - 1)}
          isActive={currentPage === totalPages - 1}
        >
          {totalPages - 1}
        </Button>
      );
      pages.push(
        <Button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          isActive={currentPage === totalPages}
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div>
      <ManagerFormReportsVariation TableDataHandler={TableDataHandler} setType={setType} setLoadingTrue={setLoadingTrue} setLoadingFalse={setLoadingFalse}/>
      {isTableDisplay && <DownloadCSV tableData={filteredTableData} />}
      {isLoading ? (
        <Center h="100vh">
          <Spinner size="xl" />
        </Center>
      ) : (
        isTableDisplay && (
          <Box p={4}>
            <TableContainer>
              <Table variant="striped" colorScheme="blue">
                <Thead>
                  <Tr>
                    <Th>Code</Th>
                    <Th>Name</Th>
                    <Th>Location</Th>
                    <Th>Zone / Area</Th>
                    <Th>Registered <br /> Lat/Long</Th>
                    <Th>Scanned <br /> Lat/Long</Th>
                    <Th>Variation</Th>
                    <Th>Scanned By</Th>
                    <Th>Scanned Date</Th>
                    <Th>Scanned Time</Th>
                    <Th>Supervisor Name</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {currentData.map((data, index) => (
                    <Tr key={index}>
                      <Td>{data.code}</Td>
                      <Td>{data.name}</Td>
                      <Td>{data.locality}</Td>
                      <Td>{`${data.zone} / ${data.area}`}</Td>
                      <Td>{data.dal_latitude && data.dal_longitude ? `${data.dal_latitude}, ${data.dal_longitude}` : "-"}</Td>
                      <Td>{data.scanned_latitude && data.scanned_longitude ? `${data.scanned_latitude}, ${data.scanned_longitude}` : "-"}</Td>
                      <Td>{data.variation !== "-" ? `${data.variation} ft` : "-"}</Td>
                      <Td>{data.user_name}</Td>
                      <Td>{data.scanned_date || "-"}</Td>
                      <Td>{data.scanned_time || "-"}</Td>
                      <Td>{data.supervisor_name || "-"}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Box display={"flex"} justifyContent="center" mt={4}>
              <ButtonGroup isAttached variant="outline">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {renderPageNumbers()}
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </ButtonGroup>
            </Box>
          </Box>
        )
      )}
    </div>
  );
};

export default Home;
