// src/components/questionnaire/CAT/useCAT.js
import { useRef, useCallback } from "react";
import { getExpandedFormData } from "../utils/dateAndAge";
import { sendResultsEmail } from "../services/sendEmail";
import { showSuccess, showError } from "../utils/sweetAlert";

const CAT_Q_SUBSCALES = {
  compensation: [1, 4, 5, 8, 11, 14, 17, 20, 23], // 9 питань
  masking: [2, 6, 9, 12, 15, 18, 21, 24], // 8 питань
  assimilation: [3, 7, 10, 13, 16, 19, 22, 25], // 8 питань
};

const REVERSED_QUESTIONS = [3, 12, 19, 22, 24]; // питання, де бал інвертується

const RANGES = {
  extremely_low: [25, 51],
  low: [52, 75],
  moderate: [76, 112],
  high: [113, 136],
  extremely_high: [137, 175],
};

const LABELS = {
  extremely_low: "Вкрай низький (≤ 5-й перцентиль)",
  low: "Низький (6–24-й перцентиль)",
  moderate: "Середній (25–75-й перцентиль)",
  high: "Високий (76–94-й перцентиль)",
  extremely_high: "Вкрай високий (≥ 95-й перцентиль)",
};

const REVERSED_MAP = {
  1: 7,
  2: 6,
  3: 5,
  4: 4,
  5: 3,
  6: 2,
  7: 1,
};

export const useCAT = () => {
  const formRef = useRef(null);

  let client_answers = "";

  const getQuestionValue = useCallback((questionNumber) => {
    const selector = `input[name="question_${questionNumber}"]:checked`;
    const selected = formRef.current?.querySelector(selector);
    if (!selected) return 0;

    let value = parseInt(selected.value, 10);

    // Інвертуємо для реверсних питань
    if (REVERSED_QUESTIONS.includes(questionNumber)) {
      value = REVERSED_MAP[value] || value;
    }

    client_answers += `${questionNumber}: ${value} | `

    return value;
  }, []);

  const calculateScores = useCallback(() => {
    const scores = {
      sum_compensation: 0,
      sum_masking: 0,
      sum_assimilation: 0,
    };

    CAT_Q_SUBSCALES.compensation.forEach((q) => {
      scores.sum_compensation += getQuestionValue(q);
    });
    CAT_Q_SUBSCALES.masking.forEach((q) => {
      scores.sum_masking += getQuestionValue(q);
    });
    CAT_Q_SUBSCALES.assimilation.forEach((q) => {
      scores.sum_assimilation += getQuestionValue(q);
    });

    const sum_overall =
      scores.sum_compensation + scores.sum_masking + scores.sum_assimilation;

    let range = "Невідомо";
    for (const [key, [min, max]] of Object.entries(RANGES)) {
      if (sum_overall >= min && sum_overall <= max) {
        range = LABELS[key];
        break;
      }
    }

    return {
      ...scores,
      sum_overall,
      range,
    };
  }, [getQuestionValue]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const patientData = getExpandedFormData(formRef);
      const scores = calculateScores();

      const { patient_sex = "Не вказано" } = patientData;

      const {
        sum_assimilation,
        sum_masking,
        sum_compensation,
        sum_overall,
        range,
      } = scores;

      const resultsText = `
Результати опитувальника СAT-Q (The Camouflaging Autistic Traits Questionnaire)

Додаткова інформація про пацієнта:
• Стать: ${patient_sex}

Відповіді клієнта:
${client_answers}

Сума compensation - ${sum_compensation}
Сума masking - ${sum_masking}
Сума assimilation - ${sum_assimilation}

Сума загальна - ${sum_overall}

Це вказує на рівень: ${range}
`;

      const emailPayload = {
        variant: "CAT-Q",
        ...patientData,
        ...scores,
        client_answers: client_answers,
        results: resultsText,
      };

      // console.log(resultsText);
      try {
        await sendResultsEmail(emailPayload);
        formRef.current?.reset();
        showSuccess(
          "Результати CAARS успішно надіслано на email адміністратора."
        );
      } catch (error) {
        console.error("Помилка при відправці результатів CAARS:", error);
        showError(
          "Виникла помилка при відправці результатів. Спробуйте ще раз."
        );
      }
    },
    [calculateScores]
  );

  return {
    formRef,
    handleSubmit,
  };
};
