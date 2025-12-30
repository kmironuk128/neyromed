// src/components/questionnaire/WURS/WURSQuestions.jsx
import React from 'react';
import { QuestionItem, QuestionText} from '../ui/QuestionItem';
import {RadioGroup, HiddenRadio, RadioLabel} from '../ui/RadioGroup'
import { ANSWERS, QUESTIONS } from '../../data/WURS_data';

export const WURSQuestions = () => {
  return (
    <>
      {QUESTIONS.map((question, index) => (
        <QuestionItem key={index}>
          <QuestionText>{index + 1}. {question}</QuestionText>
          <RadioGroup columns={5}>
            {ANSWERS.map((answer, aIndex) => (
              <React.Fragment key={aIndex}>
                <HiddenRadio
                  name={`question_${index + 1}`}
                  value={aIndex}
                  id={`q${index + 1}_a${aIndex}`}
                />
                <RadioLabel htmlFor={`q${index + 1}_a${aIndex}`} columns={5}>
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