import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Spinner,
  Center,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import DataTable from "./DataTable"; // Import the DataTable component

const DateRangeForm = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [timeInterval, setTimeInterval] = useState("");
  const [calendarOpen, setCalendarOpen] = useState("");
  const [apiResponse, setApiResponse] = useState([]); // State to store API response
  const [loading, setLoading] = useState(false); // State to manage loading spinner
  const toast = useToast();
  const today = new Date();

  const handleDateChange = (date, type) => {
    if (type === "from") {
      setFromDate(date);
      if (toDate && date > toDate) {
        setToDate(null);
      }
    } else if (type === "to") {
      setToDate(date);
    }
  };

  const isDateRangeValid = (startDate, endDate) => {
    if (!startDate || !endDate) return true;
    const maxEndDate = new Date(startDate);
    maxEndDate.setDate(startDate.getDate() + 30);
    return endDate <= maxEndDate;
  };

  const handleSubmit = async () => {
    if (isDateRangeValid(fromDate, toDate)) {
      setLoading(true); // Set loading to true before the API call
      try {
        const startDate = new Date(
          fromDate.getTime() - fromDate.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0];
        const endDate = new Date(
          toDate.getTime() - toDate.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0];
        const response = await axios.post("/server/api/manager/reports/dateRange", {
          startDate,
          endDate,
          timeInterval: Number(timeInterval),
        });
        setApiResponse(response.data); // Store the response data in the state
        toast({
          title: "Success",
          description: "Dates and interval submitted successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while submitting the data.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false); // Set loading to false after the API call
      }
    } else {
      toast({
        title: "Invalid date range.",
        description: "The end date must be within 30 days of the start date.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const isDateDisabled = (date) => {
    if (!fromDate) return false;
    const maxEndDate = new Date(fromDate);
    maxEndDate.setDate(fromDate.getDate() + 30);
    return date > maxEndDate || date > today;
  };

  return (
    <Box
      p={6}
      mx="auto"
      w="full"
      minW="360px"
      bg="white"
      borderRadius="md"
      boxShadow="lg"
    >
      <Box
        mb={4}
        display="flex"
        flexDir={{ base: "column", md: "row" }}
        gap={4}
        alignItems="center"
      >
        <FormControl position="relative">
          <FormLabel>From</FormLabel>
          <Input
            placeholder="Select start date"
            value={fromDate ? fromDate.toLocaleDateString() : ""}
            onClick={() => setCalendarOpen("from")}
            readOnly
          />
          {calendarOpen === "from" && (
            <Box position="absolute" zIndex={10}>
              <DatePicker
                selected={fromDate}
                onChange={(date) => handleDateChange(date, "from")}
                maxDate={today}
                onClickOutside={() => setCalendarOpen("")}
                inline
              />
            </Box>
          )}
        </FormControl>

        <FormControl position="relative">
          <FormLabel>To</FormLabel>
          <Input
            placeholder="Select end date"
            value={toDate ? toDate.toLocaleDateString() : ""}
            onClick={() => setCalendarOpen("to")}
            readOnly
          />
          {calendarOpen === "to" && (
            <Box position="absolute" zIndex={10}>
              <DatePicker
                selected={toDate}
                onChange={(date) => handleDateChange(date, "to")}
                minDate={fromDate ? new Date(fromDate) : undefined}
                maxDate={
                  fromDate
                    ? new Date(fromDate).setDate(fromDate.getDate() + 30)
                    : today
                }
                filterDate={(date) => !isDateDisabled(date)}
                onClickOutside={() => setCalendarOpen("")}
                inline
              />
            </Box>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Time Interval (in minutes)</FormLabel>
          <Input
            type="number"
            value={timeInterval}
            onChange={(e) => setTimeInterval(e.target.value)}
            placeholder="Enter time interval"
          />
        </FormControl>
      </Box>

      <Center>
      <Button
        colorScheme="blue"
        w="full"
        maxW={'400px'}
        mt={4}
        onClick={handleSubmit}
      >
        Submit
      </Button>
      </Center>

      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Spinner size="xl" /> {/* Show spinner while loading */}
        </Box>
      )}

      {apiResponse.length > 0 && <DataTable data={apiResponse} timeInterval={timeInterval}/>}
    </Box>
  );
};

export default DateRangeForm;
