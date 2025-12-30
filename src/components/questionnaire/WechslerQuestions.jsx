// src/components/questionnaire/Wechsler/WechslerForm.jsx
import React from 'react';
import { QuestionItem, QuestionText } from '../ui/QuestionItem';
import { Input } from '../ui/Input';
import { SCORE_NAMES } from '../../data/Wechsler_data';

const subtestLabels = {
  BD: "Блоковий дизайн (BD)",
  SI: "Словниковий запас (SI)",
  DS: "Цифровий діапазон (DS)",
  PCn: "Пазли (PCn)",
  CD: "Кодування (CD)",
  VC: "Вокабуляр (VC)",
  LN: "Буквено-цифрове впорядкування (LN)",
  MR: "Матричне мислення (MR)",
  CO: "Розуміння (CO)",
  SS: "Символьний пошук (SS)",
  PCm: "Пазли (матриця) (PCm)",
  CA: "Скасування (CA)",
  IN: "Інформація (IN)",
  AR: "Арифметика (AR)",
  WR: "Словниковий запас (письмовий) (WR)"
};

export const WechslerForm = () => {
  return (
    <>
      {SCORE_NAMES.map(code => (
        <QuestionItem key={code} style={{marginBottom: '0'}}> 
          <QuestionText>{subtestLabels[code] || code}</QuestionText>
          <Input
            type="number"
            id={code}
            name={code}
            min="0"
            style={{marginBottom: '0'}}
          />
        </QuestionItem>
      ))}
    </>
  );
};