import React, { useState, useMemo } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Button,
  ButtonGroup,
  Center,
} from "@chakra-ui/react";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const DataTableForSurvey = ({ data, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;

  const ratingDescriptions = {
    1: "Very Poor",
    2: "Poor",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  }, [currentPage, data]);

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

  const downloadCSV = () => {
    const csvData = data.map((item) => ({
      Zone: item.zone,
      Area: item.area,
      Locality: item.locality,
      Code: item.code,
      Name: item.name,
      Question: item.questions,
      Rating: ratingDescriptions[item.rating] || item.rating,
      Remarks: item.remarks,
      Entry_Date: new Date(item.entry_date).toLocaleDateString(),
      Entry_time: item.entry_time,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "survey_data.csv");
  };

  return (
    <Box p={4} maxW="full" mx="auto">
      {!loading && (
        <Center>
          <Button colorScheme="blue" onClick={downloadCSV} mb={4}>
            Download CSV
          </Button>
        </Center>
      )}
      <TableContainer>
        <Table variant="striped" colorScheme="blue">
          <Thead>
            <Tr>
              <Th>Zone</Th>
              <Th>Area</Th>
              <Th>Locality</Th>
              <Th>Code</Th>
              <Th>Name</Th>
              <Th>Question</Th>
              <Th>Rating</Th>
              <Th>Remarks</Th>
              <Th>Entry Date</Th>
              <Th>Entry Time</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentData.map((item, index) => (
              <Tr key={index}>
                <Td>{item.zone}</Td>
                <Td>{item.area}</Td>
                <Td>{item.locality}</Td>
                <Td>{item.code}</Td>
                <Td>{item.name}</Td>
                <Td>{item.questions}</Td>
                <Td>{ratingDescriptions[item.rating] || item.rating}</Td>
                <Td>{item.remarks}</Td>
                <Td>{new Date(item.entry_date).toLocaleDateString()}</Td>
                <Td>{item.entry_time}</Td>
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
  );
};

export default DataTableForSurvey;
