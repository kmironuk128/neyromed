import React from "react";
import { QuestionItem, QuestionText } from "../ui/QuestionItem";
import { ExtraBigH1, SectionTitle } from "../ui/Title";
import {
  A_QUESTIONS,
  A_ANSWERS,
  H_QUESTIONS,
  H_ANSWERS,
  C_QUESTIONS,
  C_ANSWERS,
} from "../../data/DIVA5_data";
import {
  HorizontalContainer,
  HorizontalContainer12to80,
} from "../ui/Container";
import { Checkbox, CheckboxGroup } from "../ui/Checkbox";
import { Label } from "../ui/Label";
import { SmallTextarea } from "../ui/Input";
import { RadioGroup, RadioLabel, HiddenRadio } from "../ui/RadioGroup";

const Blueprint = ({ symptomKey, ageGroup, examples }) => {
  const title =
    ageGroup === "adult" ? "Приклади у дорослому віці" : "Приклади у дитинстві";

  return (
    <div key={`${symptomKey}_${ageGroup}`}>
      <SectionTitle>
        <strong>{title}</strong>
      </SectionTitle>

      <div style={{ margin: "2rem 0" }}>
        {examples.map((ex, exIdx) => (
          <CheckboxGroup key={`${symptomKey}_${ageGroup}_${exIdx}`}>
            <Checkbox
              id={`${symptomKey}_${ageGroup}_${exIdx}`}
              name={`${symptomKey}_${ageGroup}`}
              value={ex}
            />
            <Label htmlFor={`${symptomKey}_${ageGroup}_${exIdx}`}>{ex}</Label>
          </CheckboxGroup>
        ))}
      </div>

      <Label htmlFor={`${symptomKey}_text_${ageGroup}`}>Інші:</Label>
      <SmallTextarea id={`${symptomKey}_text_${ageGroup}`} />
      <QuestionItem>
        <QuestionText>Симптоми наявні:</QuestionText>
        <RadioGroup columns={2}>
          <HiddenRadio
            name={`part_${symptomKey}_${ageGroup}`}
            value="так"
            id={`part_${symptomKey}_${ageGroup}_yes`}
          />
          <RadioLabel htmlFor={`part_${symptomKey}_${ageGroup}_yes`}>
            Так
          </RadioLabel>
          <HiddenRadio
            name={`part_${symptomKey}_${ageGroup}`}
            value="ні"
            id={`part_${symptomKey}_${ageGroup}_no`}
          />
          <RadioLabel htmlFor={`part_${symptomKey}_${ageGroup}_no`}>
            Ні
          </RadioLabel>
        </RadioGroup>
      </QuestionItem>
    </div>
  );
};

export const A_H_Group = ({ letter }) => {
  const questions = letter === "A" ? A_QUESTIONS : H_QUESTIONS;
  const examplesObj = letter === "A" ? A_ANSWERS : H_ANSWERS;

  return (
    <>
      {questions.map((question, idx) => {
        const symptomKey = `${letter}${idx + 1}`; // A1, A2, ..., H9
        const examples = examplesObj[symptomKey];

        if (!examples) {
          console.warn(`No examples found for ${symptomKey}`);
          return null;
        }

        return (
          <div key={symptomKey}>
            <HorizontalContainer12to80>
              <ExtraBigH1>
                {letter === "A" ? `A${idx + 1}` : `H/I ${idx + 1}`}
              </ExtraBigH1>
              <QuestionText>{question}</QuestionText>
            </HorizontalContainer12to80>

            <HorizontalContainer>
              <Blueprint
                symptomKey={symptomKey}
                ageGroup="adult"
                examples={examples.adult || []}
              />
              <Blueprint
                symptomKey={symptomKey}
                ageGroup="child"
                examples={examples.child || []}
              />
            </HorizontalContainer>
          </div>
        );
      })}
    </>
  );
};

const C_Blueprint = ({ symptomKey }) => {
  const answers = C_ANSWERS[symptomKey] || [];

  return (
    <div key={symptomKey}>
      <div style={{ margin: "2rem 0" }}>
        {answers.map((ex, exIdx) => (
          <CheckboxGroup key={`${symptomKey}_${exIdx}`}>
            <Checkbox
              id={`${symptomKey}_${exIdx}`}
              name={`${symptomKey}`}
              value={ex}
            />
            <Label htmlFor={`${symptomKey}_${exIdx}`}>{ex}</Label>
          </CheckboxGroup>
        ))}
      </div>

      <Label htmlFor={`${symptomKey}_text`}>Інші:</Label>
      <SmallTextarea
        id={`${symptomKey}_text`}
        placeholder="Інші труднощі, не перелічені вище"
      />
    </div>
  );
};

export const C_Group = () => {
  return (
    <>
      <HorizontalContainer12to80>
        <ExtraBigH1>C</ExtraBigH1>
        <QuestionText>
          У яких сферах життя ви знаходили труднощі з цими симптомами?
        </QuestionText>
      </HorizontalContainer12to80>

      {C_QUESTIONS.map((sphere, idx) => {
        const symptomKey = `C${idx + 1}`;

        return (
          <div key={symptomKey}>
            <SectionTitle>
              <strong>{sphere}</strong>
            </SectionTitle>
            <C_Blueprint symptomKey={symptomKey} />
          </div>
        );
      })}
    </>
  );
};
