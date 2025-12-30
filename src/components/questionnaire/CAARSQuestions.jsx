
import React from 'react';
import { QuestionItem, QuestionText} from '../ui/QuestionItem';
import {RadioGroup, HiddenRadio, RadioLabel} from '../ui/RadioGroup'
import { ANSWERS, QUESTIONS } from '../../data/CAARS_data';

export const CAARSQuestions = () => {
  return (
    <>
      {QUESTIONS.map((question, index) => (
        <QuestionItem key={index}>
          <QuestionText>{question}</QuestionText>
          <RadioGroup columns={4} >
            {ANSWERS.map((answer, aIndex) => (
              <React.Fragment key={aIndex}>
                <HiddenRadio
                  name={`question_${index + 1}`}
                  value={aIndex}
                  id={`q${index + 1}_a${aIndex}`}
                />
                <RadioLabel htmlFor={`q${index + 1}_a${aIndex}`}>
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