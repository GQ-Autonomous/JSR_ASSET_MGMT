// RadioQuestion.tsx

import { Box, FormControl, FormLabel, Radio, RadioGroup } from "@chakra-ui/react";
import React from "react";

interface RadioQuestionProps {
  id: string | number;
  question: string;
  options: string[];
  onChange: (value: string, id: string) => void;
}

const RadioQuestion: React.FC<RadioQuestionProps> = ({ id, question, options, onChange }) => {
  return (
    <FormControl key={id}>
      <FormLabel>{question}</FormLabel>
      <RadioGroup onChange={(value) => onChange(value, id)}>
        <Box display="flex" gap={4}>
          {options.map((option, index) => (
            <Radio key={index} value={option}>
              {option}
            </Radio>
          ))}
        </Box>
      </RadioGroup>
    </FormControl>
  );
};

export default RadioQuestion;
