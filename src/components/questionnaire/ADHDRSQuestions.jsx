// src/components/questionnaire/ADHDRSQuestions.js
import React from "react";
import { QuestionItem, QuestionText } from "../ui/QuestionItem";
import { RadioGroup, HiddenRadio, RadioLabel } from "../ui/RadioGroup";
import { Subtitle, SectionTitle } from "../ui/Title";
import { ANSWERS, PARTS, PART_X } from "../../data/ADHD-RS_data";

export const ADHDRSQuestions = ({ maxes = [] }) => { 
  return (
    <>
      {PARTS.map((symptom, index) => {
        const sectionIndex = index + 1;
        const questions = PART_X[`part_${sectionIndex}`] || [];
        const currentMax = maxes[sectionIndex - 1] ?? 0;


        return (
          <QuestionItem key={index}>
            <Subtitle>
              {sectionIndex}. {symptom}
            </Subtitle>

            {questions.map((question, qIdx) => (
              <div key={qIdx}>
                <QuestionText>{question}</QuestionText>
                <RadioGroup columns={4}>
                  {ANSWERS.map((value) => (
                    <React.Fragment key={value}>
                      <HiddenRadio
                        type="radio"
                        name={`section_${sectionIndex}_q${qIdx + 1}`}
                        value={value}
                        id={`s${sectionIndex}_q${qIdx + 1}_a${value}`}
                      />
                      <RadioLabel
                        htmlFor={`s${sectionIndex}_q${qIdx + 1}_a${value}`}
                      >
                        {value}
                      </RadioLabel>
                    </React.Fragment>
                  ))}
                </RadioGroup>
              </div>
            ))}

            <SectionTitle>
              Найвищий бал за симптом "{symptom}": <strong>{currentMax}</strong>
            </SectionTitle>
          </QuestionItem>
        );
      })}
    </>
  );
};