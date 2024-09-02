"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import moment from "moment";

const ManagerFormReportsVariation = ({ TableDataHandler, setType, setLoadingTrue, setLoadingFalse }) => {
  const [duration, setDuration] = useState("");
  const [reportType, setReportType] = useState("");
  const toast = useToast();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoadingTrue()

    // Validate required fields
    if (!duration || !reportType) {
      toast({
        title: "Error",
        description: "Both duration and type fields are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Initialize start and end dates
    let startDate, endDate;

    // Calculate startDate and endDate based on the selected duration
    if (duration === "Today") {
      startDate = moment().startOf("day").format("YYYY-MM-DD HH:mm:ss");
      endDate = moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");
    } else if (duration === "This month") {
      startDate = moment().startOf("month").format("YYYY-MM-DD HH:mm:ss");
      endDate = moment().endOf("month").format("YYYY-MM-DD HH:mm:ss");
    } else if (duration === "Last month") {
      startDate = moment().subtract(1, "month").startOf("month").format("YYYY-MM-DD HH:mm:ss");
      endDate = moment().subtract(1, "month").endOf("month").format("YYYY-MM-DD HH:mm:ss");
    }

    // Prepare the data to be sent to the API
    const requestData = {
      startTime: startDate,
      endTime: endDate
    };

    try {
      const resp = await axios.post('/server/api/manager/reports-by-variation', requestData);
      TableDataHandler(resp.data);
      setType(reportType); // Set the type in the parent component
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "An error occurred while fetching data.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoadingFalse()
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        p={6}
        gap={6}
        flexWrap={"wrap"}
      >
        <FormControl w={"400px"} isRequired>
          <FormLabel>Select Duration</FormLabel>
          <Select
            value={duration}
            onChange={(e) => {
              setDuration(e.target.value);
              // Reset type if duration is not Today
              if (e.target.value !== "Today") {
                setReportType("");
              }
            }}
          >
            <option value="">Select</option>
            <option value="Today">Today</option>
            <option value="This month">This month</option>
            <option value="Last month">Last month</option>
          </Select>
        </FormControl>
        <FormControl w={"400px"} isRequired>
          <FormLabel>Select Type</FormLabel>
          <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="">Select</option>
            {duration === "Today" && <option value="All">All</option>}
            <option value="Exception">Exception</option>
          </Select>
        </FormControl>
        <Box>
          {/* <Text className="text-white">f</Text> */}
          <Button type="submit" colorScheme="blue">
            Submit
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default ManagerFormReportsVariation;
