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
  Center
} from "@chakra-ui/react";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { parse, differenceInMinutes } from 'date-fns';

const DataTable = ({ data, loading, timeInterval }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Helper function to aggregate data
  const aggregateData = (data) => {
    const aggregated = {};

    data.forEach((item) => {
      const key = `${item.code}-${item.entry_date}`;
      if (!aggregated[key]) {
        const entryTimes = item.entry_times.split(", ").filter((v, i, a) => {
          const parsedTime = parse(v, 'HH:mm:ss', new Date());
          return !a.slice(0, i).some((time) => 
            differenceInMinutes(parsedTime, parse(time, 'HH:mm:ss', new Date())) <= timeInterval
          );
        });

        aggregated[key] = {
          ...item,
          user_names: item.user_names.split(" / ").filter((v, i, a) => a.indexOf(v) === i).join(" / "), // Remove duplicate usernames
          entry_times: entryTimes.join(", "), // Remove duplicate times within the time interval
          count_of_frequency: entryTimes.length, // Count the unique entry times
        };
      } else {
        // Combine entry times and user names
        const newEntryTimes = item.entry_times.split(", ").filter((v, i, a) => {
          const parsedTime = parse(v, 'HH:mm:ss', new Date());
          return !a.slice(0, i).some((time) => 
            differenceInMinutes(parsedTime, parse(time, 'HH:mm:ss', new Date())) <= timeInterval
          );
        });

        aggregated[key].entry_times += `, ${newEntryTimes.join(", ")}`;
        aggregated[key].user_names += ` / ${item.user_names}`;
        aggregated[key].count_of_frequency += newEntryTimes.length; // Update the count of unique entry times
      }
    });

    return Object.values(aggregated);
  };

  // Aggregate data
  const aggregatedData = useMemo(() => aggregateData(data), [data]);

  // Calculate the maximum number of entry times for dynamic columns
  const maxEntryCount = Math.max(
    ...aggregatedData.map((item) =>
      item.entry_times ? item.entry_times.split(", ").length : 0
    )
  );

  const totalPages = Math.ceil(aggregatedData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const currentData = aggregatedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    const csvData = aggregatedData.map((item) => {
      const entryTimes = item.entry_times
        ? item.entry_times.split(", ")
        : [];
      const entryTimesColumns = entryTimes.reduce((acc, time, index) => {
        acc[`Entry_Time_${index + 1}`] = time;
        return acc;
      }, {});

      const emptyColumns = [
        ...Array(maxEntryCount - entryTimes.length).keys(),
      ].reduce((acc, i) => {
        acc[`Entry_Time_${entryTimes.length + i + 1}`] = "";
        return acc;
      }, {});

      return {
        Zone: item.zone,
        Area: item.area,
        Locality: item.locality,
        Code: item.code,
        Name: item.name,
        Entry_Date: new Date(item.entry_date).toLocaleDateString(),
        Original_Entry_Time: item.entry_times,
        ...entryTimesColumns,
        ...emptyColumns,
        Count_of_Frequency: item.count_of_frequency, // Include Count of Frequency in CSV
        Remarks: item.remarks,
        Status: item.status,
        User_role: item.role,
        UserName: item.user_names,
      };
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "table_data.csv");
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
      <TableContainer display={'none'}>
        <Table variant="striped" colorScheme="blue">
          <Thead>
            <Tr>
              <Th>Zone</Th>
              <Th>Area</Th>
              <Th>Locality</Th>
              <Th>Code</Th>
              <Th>Name</Th>
              <Th>Entry Date</Th>
              <Th>Original Entry Time</Th>
              {[...Array(maxEntryCount).keys()].map((i) => (
                <Th key={i}>Entry Time {i + 1}</Th>
              ))}
              <Th>Count of Frequency</Th> {/* New column for Count of Frequency */}
              <Th>Remarks</Th>
              <Th>Status</Th>
              <Th>User Role</Th>
              <Th>User Name</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentData.map((item, index) => {
              const entryTimes = item.entry_times
                ? item.entry_times.split(", ")
                : [];

              return (
                <Tr key={index}>
                  <Td>{item.zone}</Td>
                  <Td>{item.area}</Td>
                  <Td>{item.locality}</Td>
                  <Td>{item.code}</Td>
                  <Td>{item.name}</Td>
                  <Td>{new Date(item.entry_date).toLocaleDateString()}</Td>
                  <Td>{item.entry_times}</Td>
                  {entryTimes.map((time, i) => (
                    <Td key={i}>{time}</Td>
                  ))}
                  {[...Array(maxEntryCount - entryTimes.length).keys()].map(
                    (i) => (
                      <Td key={`empty-${i}`}></Td>
                    )
                  )}
                  <Td>{item.count_of_frequency}</Td> {/* Display Count of Frequency */}
                  <Td>{item.remarks}</Td>
                  <Td>{item.status}</Td>
                  <Td>{item.role}</Td>
                  <Td>{item.user_names}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Box justifyContent="center" mt={4} display={'none'}>
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

export default DataTable;
