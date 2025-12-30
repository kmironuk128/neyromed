// src/components/questionnaire/CAARS/useCAARSLogic.js
import { useRef, useCallback } from "react";
import { getExpandedFormData } from "../utils/dateAndAge";
import { sendResultsEmail } from "../services/sendEmail";
import { showSuccess, showError } from '../utils/sweetAlert';

/**
 * Конфігурація шкал CAARS (Conners' Adult ADHD Rating Scales)
 * Номери питань — 1-based (як у формі: question_1 ... question_66)
 */
const CAARS_SCALES = {
  A: [36, 3, 40, 7, 44, 11, 49, 16, 51, 18, 32, 66], // Неуважність/проблеми з пам'яттю
  B: [1, 5, 46, 13, 17, 20, 54, 57, 25, 59, 27, 31], // Гіперактивність/неспокій
  C: [35, 4, 39, 8, 43, 12, 47, 52, 19, 23, 61, 30], // Імпульсивність/емоційна лабільність
  D: [37, 6, 15, 56, 26, 63],                         // Проблеми з самооцінкою
  E: [2, 42, 48, 24, 60, 29, 64, 65, 33],             // Загальні проблеми РДУГ
  F: [38, 41, 9, 14, 50, 21, 22, 58, 62],             // Індекс неузгодженості (Inconsistency Index — частина)
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
  [28, 63],
];

/**
 * Поріг для виявлення неузгоджених відповідей
 */
const INCONSISTENCY_THRESHOLD = 8;

/**
 * Custom hook для логіки опитувальника CAARS
 */
export const useCAARS = () => {
  const formRef = useRef(null);

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

    Object.entries(CAARS_SCALES).forEach(([scale, items]) => {
      sums[scale] = items.reduce((acc, idx) => acc + getQuestionValue(idx), 0);
    });

    // Шкала G = E + F (за стандартом CAARS)
    sums.G = (sums.E || 0) + (sums.F || 0);

    return sums;
  }, [getQuestionValue]);

  /**
   * Обчислює контрольну суму неузгодженості (Inconsistency Index)
   */
  const calculateInconsistencyScore = useCallback(() => {
    return INCONSISTENCY_PAIRS.reduce((sum, [a, b]) => {
      const valA = getQuestionValue(a);
      const valB = getQuestionValue(b);
      return sum + Math.min(valA, valB);
    }, 0);
  }, [getQuestionValue]);

  /**
   * Генерує текст результатів (використовується і для alert, і для email)
   */
  const generateResultsText = useCallback(
    (patientData, scaleSums, inconsistencyScore) => {
      const { patient_sex = "Не вказано", age } = patientData;
      const { years = "-", months = "-", days = "-" } = age || {};

      const isInconsistent = inconsistencyScore >= INCONSISTENCY_THRESHOLD;

      return `
Результати опитувальника CAARS (Conners' Adult ADHD Rating Scales)

Інформація про пацієнта:
• Стать: ${patient_sex}
• Вік: ${years} років, ${months} місяців, ${days} днів

Суми за шкалами:
• A (Неуважність/пам'ять): ${scaleSums.A}
• B (Гіперактивність/неспокій): ${scaleSums.B}
• C (Імпульсивність/емоційна лабільність): ${scaleSums.C}
• D (Проблеми з самооцінкою): ${scaleSums.D}
• E (Загальні проблеми РДУГ): ${scaleSums.E}
• F (Індекс неузгодженості — частина): ${scaleSums.F}
• G (E + F — Загальний індекс РДУГ): ${scaleSums.G}
• H (Симптоми за DSM-IV): ${scaleSums.H}

Контрольна шкала неузгодженості (Inconsistency Index):
• Сума: ${inconsistencyScore}
• Перевищує поріг ≥8: ${isInconsistent ? "ТАК (можлива нещирість або випадкові відповіді)" : "Ні"}

${isInconsistent ? "УВАГА: Високий індекс неузгодженості може свідчити про невалідність результатів." : ""}
      `.trim();
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
      const scaleSums = calculateScaleSums();
      const inconsistencyScore = calculateInconsistencyScore();
      const resultsText = generateResultsText(patientData, scaleSums, inconsistencyScore);

      const emailPayload = {
        variant: "CAARS",
        ...patientData,
        ...scaleSums,
        controlSum: inconsistencyScore,
        isInconsistent: inconsistencyScore >= INCONSISTENCY_THRESHOLD,
        results: resultsText,
      };

      try {
        await sendResultsEmail(emailPayload);

        formRef.current?.reset();
        showSuccess("Результати CAARS успішно надіслано на email адміністратора.");
      } catch (error) {
        console.error("Помилка при відправці результатів CAARS:", error);
        showError("Виникла помилка при відправці результатів. Спробуйте ще раз.");
      }
    },
    [calculateScaleSums, calculateInconsistencyScore, generateResultsText]
  );

  return {
    formRef,
    handleSubmit
  };
};