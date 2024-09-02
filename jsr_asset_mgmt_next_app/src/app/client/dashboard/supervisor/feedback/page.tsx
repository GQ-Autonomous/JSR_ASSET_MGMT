"use client";

import RadioQuestion from "@/components/RadioQuestion";
import { Box, FormControl, FormLabel, Input, Button, useToast } from "@chakra-ui/react";
import React, { useState } from "react";

const questions = [
  { id: 1, question: "Is the toilet clean ?", options: ["OK", "NOT OK"] },
  { id: 2, question: "Is the floor clean ?", options: ["OK", "NOT OK"] },
  { id: 3, question: "Is there water on the floor ?", options: ["OK", "NOT OK"] },
  { id: 4, question: "Is the basins clean ?", options: ["OK", "NOT OK"] },
  { id: 5, question: "Is the toilets clean ?", options: ["OK", "NOT OK"] },
  { id: 6, question: "Any water leaks ?", options: ["OK", "NOT OK"] },
  { id: 7, question: "Exhaust fan working ?", options: ["OK", "NOT OK"] },
  { id: 8, question: "Are all lights working ?", options: ["OK", "NOT OK"] },
  { id: 9, question: "Are all taps ok ?", options: ["OK", "NOT OK"] },
  { id: 10, question: "Any foul smell inside the toilet ?", options: ["OK", "NOT OK"] },
];

const SuperVisorFeedback = () => {
  const [formData, setFormData] = useState({
    assetId: "",
    assetAddress: "",
    location: "",
    questions: questions.reduce((acc, question) => {
      acc[question.id] = { question: question.question, answer: "" };
      return acc;
    }, {}),
  });

  const toast = useToast();

  const onRadioChangeHandler = (value, id) => {
    setFormData((prevData) => ({
      ...prevData,
      questions: {
        ...prevData.questions,
        [id]: { ...prevData.questions[id], answer: value },
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { assetId, assetAddress, location, questions } = formData;

    // Validate all fields
    if (
      !assetId ||
      !assetAddress ||
      !location ||
      Object.values(questions).some((question) => !question.answer)
    ) {
      toast({
        title: "Validation Error",
        description: "All fields are mandatory.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const formattedData = {
      assetId,
      assetAddress,
      location,
      questions: Object.values(questions).map((q) => ({
        question: q.question,
        answer: q.answer,
      })),
    };

    console.log(formattedData);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Box>
          <FormControl isRequired>
            <FormLabel>Asset Id</FormLabel>
            <Input
              type="text"
              name="asset_id"
              width={"50%"}
              value={formData.assetId}
              onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
              placeholder="Asset Id"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Asset address</FormLabel>
            <Input
              type="text"
              name="asset_address"
              width={"50%"}
              value={formData.assetAddress}
              onChange={(e) => setFormData({ ...formData, assetAddress: e.target.value })}
              placeholder="Asset address"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Your location</FormLabel>
            <Input
              type="text"
              name="location"
              width={"50%"}
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="location"
            />
          </FormControl>

          <Box>
            {questions.map((question) => (
              <RadioQuestion
                options={question.options}
                key={question.id}
                onChange={onRadioChangeHandler}
                id={String(question.id)}
                question={question.question}
              />
            ))}
          </Box>
          <Button type="submit" mt={4}>
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default SuperVisorFeedback;
