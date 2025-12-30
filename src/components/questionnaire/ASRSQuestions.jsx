import React from "react";
import { QuestionItem, QuestionText } from "../ui/QuestionItem";
import { RadioGroup, HiddenRadio, RadioLabel } from "../ui/RadioGroup";

import { ANSWERS } from "../../data/ASRS_data";

export const ASRSQuestions = ({ part, letter }) => {
  return (
    <>
      {part.map((question, index) => (
        <QuestionItem key={index}>
          <QuestionText>
            {index + 1}. {question}
          </QuestionText>
          <RadioGroup columns={5}>
            {ANSWERS.map((answer, aIndex) => (
              <React.Fragment key={aIndex}>
                <HiddenRadio
                  type="radio"
                  name={`${letter}q${index + 1}`} 
                  value={answer}
                  id={`${letter}q${index + 1}_${aIndex}`}
              
                />
                <RadioLabel
                  htmlFor={`${letter}q${index + 1}_${aIndex}`}
                  columns={5}
                >
                  {answer}
                </RadioLabel>
              </React.Fragment>
            ))}
          </RadioGroup>
        </QuestionItem>
      ))}
    </>
  );
};