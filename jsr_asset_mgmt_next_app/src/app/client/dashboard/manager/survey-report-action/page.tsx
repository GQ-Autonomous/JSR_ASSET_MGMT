"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Spinner,
  Center,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Select,
  Textarea,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { format } from "date-fns";

const SurveyReportAction = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState("");
  const [apiResponse, setApiResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [remarks, setRemarks] = useState("");
  const [supervisors, setSupervisors] = useState([]);
  const [supervisor, setSupervisor] = useState("");
  const toast = useToast();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState("");

  const getSupervisors = async () => {
    try {
      const res = await axios.get(
        "/server/api/supervisor/asset-status/getSupervisors"
      );
      setSupervisors(res.data.supervisors);
    } catch (error) {
      console.error("Error fetching supervisors:", error);
    }
  };

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

        const response = await axios.post(
          "/server/api/manager/survey-closure-by-supervisor/retriveAverageRating",
          {
            startDate: formattedFromDate,
            endDate: formattedToDate,
          }
        );

        setApiResponse(response.data.data); // assuming the data comes under `data`
        console.log(apiResponse);

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

  const handleActionClick = (survey) => {
    setSelectedSurvey(survey);
    onOpen();
  };

  const handleSave = async () => {
    try {
      const entryDateTimeString = `${selectedSurvey.entry_date.split("T")[0]}T${
        selectedSurvey.entry_time
      }`;
      const entryDateTime = new Date(entryDateTimeString);

      if (isNaN(entryDateTime.getTime())) {
        throw new Error("Invalid date format");
      }

      const year = entryDateTime.getFullYear();
      const month = String(entryDateTime.getMonth() + 1).padStart(2, "0");
      const day = String(entryDateTime.getDate()).padStart(2, "0");
      const hours = String(entryDateTime.getHours()).padStart(2, "0");
      const minutes = String(entryDateTime.getMinutes()).padStart(2, "0");
      const seconds = String(entryDateTime.getSeconds()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      await axios.post(
        "/server/api/manager/survey-closure-by-supervisor/insertIntoMatrixSurvey",
        {
          user_id: supervisor,
          code: selectedSurvey.code,
          date: formattedDate,
          average_rating: selectedSurvey.average_rating,
          remarks,
          resolve_date_time: selectedDate,
        }
      );

      toast({
        title: "Success",
        description: "Survey data has been saved successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reload data after saving
      await handleSubmit(); // Re-fetch the data

      onClose(); // Close the modal after reloading data
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the data.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Function to format questions_and_ratings
  const formatQuestionsAndRatings = (questionsAndRatings) => {
    return questionsAndRatings
      .split(";")
      .map((item, index) => <Text key={index}>{item.trim()}</Text>);
  };

  // Helper function to round average rating
  const formatAverageRating = (rating) => {
    return rating.toFixed(2);
  };

  useEffect(() => {
    getSupervisors();
  }, []);

  const handleSupervisorChange = async (e) => {
    const selectedSupervisor = e.target.value;
    setSupervisor(selectedSupervisor); // Update supervisor state
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
          maxW="400px"
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

      {!loading && apiResponse.length > 0 && (
        <Box mt={6}>
          <div>
            {apiResponse.map((survey, index) => (
              <Box
                key={index}
                borderWidth="1px"
                borderRadius="md"
                p={8}
                mb={4}
                boxShadow="md"
                bg="white"
              >
                <Box
                  display={"flex"}
                  gap={3}
                  justifyContent={"space-between"}
                  flexWrap={"wrap"}
                >
                  <Text fontWeight="bold">Code: {survey.code}</Text>
                  <Box>
                    <Text fontWeight="bold">Questions and Ratings:</Text>
                    <Box>
                      {formatQuestionsAndRatings(survey.questions_and_ratings)}
                    </Box>
                  </Box>
                  <Text fontWeight="bold">
                    Average Rating: {formatAverageRating(survey.average_rating)}
                  </Text>
                  <Box width={"300px"}>
                    <Text fontWeight="bold">Remarks:</Text>
                    <Text
                      fontWeight="bold"
                      whiteSpace="normal" // Allow text to wrap
                    >
                      {survey.remarks.length === 0 ? "NONE" : survey.remarks}
                    </Text>
                  </Box>

                  {survey.resolve_remarks ? (
                    <Box>
                      <Box><Text fontWeight={"bold"}>Resolving remarks: </Text> <Text>{survey.resolve_remarks}</Text></Box>
                      <Box><Text fontWeight={"bold"}>Resolving Supervisor: </Text><Text>{survey.resolving_supervisor}</Text></Box>
                    </Box>
                  ) : survey.average_rating >= 4 ? (
                    <div></div>
                  ) : (
                    <Button
                      colorScheme="blue"
                      onClick={() => handleActionClick(survey)}
                      isDisabled={survey.average_rating >= 4}
                    >
                      Take Action
                    </Button>
                  )}
                </Box>
              </Box>
            ))}
          </div>
        </Box>
      )}

      {/* Modal for Action */}
      {selectedSurvey && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Action for {selectedSurvey.questions}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl w={"400px"} isRequired>
                <FormLabel>Select Supervisor</FormLabel>
                <Select value={supervisor} onChange={handleSupervisorChange}>
                  <option value="">Select supervisor</option>
                  {supervisors.map((item) => (
                    <option key={item.id} value={item.id}>
                      {`${item.user_name}`}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl mt={4} position="relative">
                <FormLabel>Date</FormLabel>
                <Input
                  placeholder="Select date"
                  value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
                  onClick={() => setCalendarOpen(true)}
                  readOnly
                />
                {calendarOpen && (
                  <Box position="absolute" zIndex={10}>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date);
                        setCalendarOpen(false);
                      }}
                      onClickOutside={() => setCalendarOpen(false)}
                      inline
                      dateFormat="yyyy-MM-dd"
                    />
                  </Box>
                )}
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Remarks</FormLabel>
                <Textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter remarks"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  handleSave(), onClose();
                }}
              >
                Save
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default SurveyReportAction;
