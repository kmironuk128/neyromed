
import React from 'react';
import { QuestionItem, QuestionText} from '../ui/QuestionItem';
import {RadioGroup, HiddenRadio, RadioLabel} from '../ui/RadioGroup'
import { ANSWERS, QUESTIONS } from '../../data/CAARS_data';
import { QUESTIONS_SMALL } from '../../data/CAARS_Small_data';

export const CAARSQuestions = ({size}) => {
  const CURR_QUESTIONS = size === 'full' ? QUESTIONS : QUESTIONS_SMALL;

  return (
    <>
      {CURR_QUESTIONS.map((question, index) => (
        <QuestionItem key={index}>
          <QuestionText>{index + 1}. {question}</QuestionText>
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