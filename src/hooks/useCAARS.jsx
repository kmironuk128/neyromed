// src/components/questionnaire/CAARS/useCAARSLogic.js
import { useRef, useCallback } from "react";
import { getExpandedFormData, getInformantFormData } from "../utils/dateAndAge";
import { sendResultsEmail } from "../services/sendEmail";
import { showSuccess, showError } from "../utils/sweetAlert";

/**
 * Конфігурація шкал CAARS (Conners' Adult ADHD Rating Scales)
 * Номери питань — 1-based (як у формі: question_1 ... question_66)
 */
const CAARS_SCALES = {
  A: [36, 3, 40, 7, 44, 11, 49, 16, 51, 18, 32, 66], // Неуважність/проблеми з пам'яттю
  B: [1, 5, 46, 13, 17, 20, 54, 57, 25, 59, 27, 31], // Гіперактивність/неспокій
  C: [35, 4, 39, 8, 43, 12, 47, 52, 19, 23, 61, 30], // Імпульсивність/емоційна лабільність
  D: [37, 6, 15, 56, 26, 63], // Проблеми з самооцінкою
  E: [2, 42, 48, 24, 60, 29, 64, 65, 33], // Загальні проблеми РДУГ
  F: [38, 41, 9, 14, 50, 21, 22, 58, 62], // Індекс неузгодженості (Inconsistency Index — частина)
  H: [34, 40, 10, 45, 19, 33, 55, 23, 26, 27, 28, 63], // DSM-IV симптоми (загалом)
};

/**
 * Пари питань для контрольної шкали неузгодженості (Inconsistency Index)
 * Кожна пара — схожі за змістом питання. Береться мінімальне значення.
 */
const INCONSISTENCY_PAIRS = [
  [11, 49],
  [40, 44],
  [20, 25],
  [13, 27],
  [30, 47],
  [19, 23],
  [6, 37],
  [26, 63],
];

const CAARS_SCALES_SMALL = {
  A: [3, 5, 17, 18, 21],
  B: [4, 6, 10, 11, 23],
  C: [1, 7, 8, 13, 20],
  D: [9, 15, 16, 25, 26],
  E: [2, 7, 8, 9, 11, 12, 14, 17, 19, 22, 24, 26],
};

const INCONSISTENCY_PAIRS_SMALL = [
  [3, 21],
  [17, 18],
  [6, 10],
  [4, 11],
  [13, 20],
  [7, 8],
  [15, 16],
  [9, 26],
];
/**
 * Поріг для виявлення неузгоджених відповідей
 */
const INCONSISTENCY_THRESHOLD = 8;

/**
 * Custom hook для логіки опитувальника CAARS
 */
export const useCAARS = ({ size }) => {
  const formRef = useRef(null);

  const CURR_SCALES = size === "small" ? CAARS_SCALES_SMALL : CAARS_SCALES;
  const CURR_INCONSISTENCY_PAIRS =
    size === "small" ? INCONSISTENCY_PAIRS_SMALL : INCONSISTENCY_PAIRS;
  /**
   * Отримує значення вибраної радіокнопки (0–3), якщо нічого не вибрано — 0
   */
  const getQuestionValue = useCallback((questionNumber) => {
    const selector = `input[name="question_${questionNumber}"]:checked`;
    const selected = formRef.current?.querySelector(selector);
    return selected ? parseInt(selected.value, 10) : 0;
  }, []);

  /**
   * Обчислює суми за всіма шкалами CAARS
   */
  const calculateScaleSums = useCallback(() => {
    const sums = {};

    Object.entries(CURR_SCALES).forEach(([scale, items]) => {
      sums[scale] = items.reduce((acc, idx) => acc + getQuestionValue(idx), 0);
    });

    if (size === "full") {
      // Шкала G = E + F (за стандартом CAARS)
      sums.G = (sums.E || 0) + (sums.F || 0);
    }

    return sums;
  }, [getQuestionValue, CURR_SCALES, size]);

  /**
   * Обчислює контрольну суму неузгодженості (Inconsistency Index)
   */
  const calculateInconsistencyScore = useCallback(() => {
    return CURR_INCONSISTENCY_PAIRS.reduce((sum, [a, b]) => {
      const valA = getQuestionValue(a);
      const valB = getQuestionValue(b);
      sum + Math.min(valA, valB);
      console.log([valA, valB, sum]);
      return sum + Math.abs(valA - valB);
    }, 0);
  }, [getQuestionValue, CURR_INCONSISTENCY_PAIRS]);

  /**
   * Генерує текст результатів (використовується і для alert, і для email)
   */
  const generateResultsText = useCallback(
    (patientData, informantData, scaleSums, inconsistencyScore) => {
      const { patient_sex = "Не вказано", age } = patientData;
      const { years = "-", months = "-", days = "-" } = age || {};
      const {
        informant_name,
        informant_year,
        informant_sex,
        informant_relation,
      } = informantData;

      const isInconsistent = inconsistencyScore >= INCONSISTENCY_THRESHOLD;

      let result = `
Результати опитувальника CAARS (Conners' Adult ADHD Rating Scales)

Додаткова інформація про пацієнта:
• Стать: ${patient_sex}
• Вік: ${years} років, ${months} місяців, ${days} днів
`;

      if (size === "small") {
        result += `
Інформація про інформанта:
• Імʼя: ${informant_name}
• Дата народження: ${informant_year}
• Стать: ${informant_sex}
• Відношення: ${informant_relation}
`;
      }

      result += `
Суми за шкалами:
• A (Проблеми з неуважністю/пам’яттю): ${scaleSums.A}
• B (Гіперактивність/неспокій): ${scaleSums.B}
• C (Імпульсивність/емоційна нестабільність): ${scaleSums.C}
• D (Проблеми з самооцінкою): ${scaleSums.D}
• E (Симптоми неуважності за DSM-IV): ${scaleSums.E}
      `.trim();

      if (size === "full") {
        result += `
• F (Гіперактивно-імпульсивні симптоми за DSM-IV): ${scaleSums.F}
• G (Загальна кількість симптомів СДУГ за DSM-IV): ${scaleSums.G}
• H (Індекс СДУГ): ${scaleSums.H}`;
      }

      result += `
Контрольна шкала неузгодженості (Inconsistency Index):
• Сума: ${inconsistencyScore}
• Перевищує поріг ≥8: ${
        isInconsistent
          ? "Так (можлива нещирість або випадкові відповіді)"
          : "Ні"
      }

${
  isInconsistent
    ? "УВАГА: Високий індекс неузгодженості може свідчити про невалідність результатів."
    : ""
}`;

      return result;
    },
    []
  );

  /**
   * Відправка результатів на email адміністратора
   */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const patientData = getExpandedFormData(formRef);
      const informantData = getInformantFormData(formRef);
      const scaleSums = calculateScaleSums();
      const inconsistencyScore = calculateInconsistencyScore();
      const resultsText = generateResultsText(
        patientData,
        informantData,
        scaleSums,
        inconsistencyScore
      );

      const emailPayload = {
        variant: "CAARS",
        ...patientData,
        ...scaleSums,
        controlSum: inconsistencyScore,
        isInconsistent: inconsistencyScore >= INCONSISTENCY_THRESHOLD,
        results: resultsText,
      };

      console.log(resultsText);
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
    [calculateScaleSums, calculateInconsistencyScore, generateResultsText]
  );

  return {
    formRef,
    handleSubmit,
  };
};
