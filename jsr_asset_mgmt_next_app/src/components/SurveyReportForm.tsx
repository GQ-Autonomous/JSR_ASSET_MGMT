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
import DataTableForSurvey from "./DataTableForSurvey";
import { format } from 'date-fns';

const SurveyReportForm = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState("");
  const [apiResponse, setApiResponse] = useState([]);
  const [loading, setLoading] = useState(false);
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
    maxEndDate.setDate(startDate.getDate() + 90);
    return endDate <= maxEndDate;
  };

  const handleSubmit = async () => {
    if (isDateRangeValid(fromDate, toDate)) {
      setLoading(true);
      try {
        const formattedFromDate = format(fromDate, "yyyy-MM-dd");
        const formattedToDate = format(toDate, "yyyy-MM-dd");

        const response = await axios.post("/server/api/manager/reports/surveyReport", {
          startDate: formattedFromDate,
          endDate: formattedToDate,
        });

        setApiResponse(response.data);
        toast({
          title: "Success",
          description: "The form has been submitted successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Submission Error",
          description: "An error occurred while submitting the form.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    } else {
      toast({
        title: "Invalid date range.",
        description: "The end date must be within 90 days of the start date.",
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
            value={fromDate ? format(fromDate, "yyyy-MM-dd") : ""}
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
                dateFormat="yyyy/MM/dd"
              />
            </Box>
          )}
        </FormControl>

        <FormControl position="relative">
          <FormLabel>To</FormLabel>
          <Input
            placeholder="Select end date"
            value={toDate ? format(toDate, "yyyy-MM-dd") : ""}
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
                dateFormat="yyyy/MM/dd"
              />
            </Box>
          )}
        </FormControl>
      </Box>

      <Center>
      <Button
        colorScheme="blue"
        w="full"
        mt={4}
        maxW={'400px'}
        onClick={handleSubmit}
      >
        Submit
      </Button>
      </Center>

      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Spinner size="xl" />
        </Box>
      )}

      {apiResponse.length > 0 && <DataTableForSurvey data={apiResponse} loading={loading}/>}
    </Box>
  );
};

export default SurveyReportForm;
