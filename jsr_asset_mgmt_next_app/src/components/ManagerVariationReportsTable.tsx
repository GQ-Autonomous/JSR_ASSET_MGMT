import { Box, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import React from "react";

const calculateDistanceInFeet = (lat1, lon1, lat2, lon2) => {
  if (lat1 === null || lon1 === null || lat2 === null || lon2 === null) {
    return "-"; // Return a placeholder if any value is null
  }

  const toRadians = (degree) => (degree * Math.PI) / 180;

  const R = 6371e3; // Radius of the Earth in meters
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
  const distanceInFeet = distanceInMeters * 3.28084; // Convert meters to feet

  return distanceInFeet.toFixed(2); // Return distance in feet rounded to two decimal places
};

const ManagerVariationReportsTable = ({ tableData }) => {
  return (
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
              <Th>Distance</Th>
              <Th>Variation</Th>
              <Th>Scanned By</Th>
              <Th>Scanned Date</Th>
              <Th>Scanned Time</Th>
              <Th>Supervisor Name</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tableData.map((data, index) => (
              <Tr key={index}>
                <Td>{data.code}</Td>
                <Td>{data.name}</Td>
                <Td>{data.locality}</Td>
                <Td>{`${data.zone} / ${data.area}`}</Td>
                <Td>{data.dal_latitude && data.dal_longitude ? `${data.dal_latitude}, ${data.dal_longitude}` : "-"}</Td>
                <Td>{data.scanned_latitude && data.scanned_longitude ? `${data.scanned_latitude}, ${data.scanned_longitude}` : "-"}</Td>
                <Td>{data.scanned_latitude && data.scanned_longitude ? `${calculateDistanceInFeet(data.dal_latitude, data.dal_longitude, data.scanned_latitude, data.scanned_longitude)} ft` : "-"}</Td>
                <Td>{data.scanned_latitude && data.scanned_longitude ? calculateDistanceInFeet(data.dal_latitude, data.dal_longitude, data.scanned_latitude, data.scanned_longitude) : "-"}</Td>
                <Td>{data.user_name}</Td>
                <Td>{data.scanned_date || "-"}</Td>
                <Td>{data.scanned_time || "-"}</Td>
                <Td>{data.supervisor_name || "-"}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManagerVariationReportsTable;
