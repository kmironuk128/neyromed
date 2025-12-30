// src/components/questionnaire/WURS/useWURSLogic.js
import { useRef, useCallback } from "react";
import { generateDocxClientSide } from "../services/docxGeneration";
import { sendResultsEmail } from "../services/sendEmail";
import { getBaseFormData } from "../utils/dateAndAge";
import { saveAs } from "file-saver";

import { showQuickResult, showSuccess, showError } from '../utils/sweetAlert';

/**
 * Конфігурація субшкал WURS (25-item version)
 * Індекси — 0-based (відповідають question_1 ... question_25)
 */
const WURS_SUBSCALES = {
  impulsiveness: [
    4, 5, 7, 9, 11, 12, 13, 14, 15, 18, 19, 20, 21,
  ], // max 13 × 4 = 52
  inattention: [0, 3, 6, 16, 22, 23, 24], // max 7 × 4 = 28
  selfesteem: [1, 3, 10, 12, 19], // max 5 × 4 = 20
};

/**
 * Пороги для інтерпретації загального балу
 */
const INTERPRETATION_THRESHOLDS = {
  high: 50,    // > 50 → висока ймовірність
  low: 30,     // < 30 → низька ймовірність
};

/**
 * Custom hook для логіки опитувальника WURS (Wender Utah Rating Scale – 25 items)
 */
export const useWURS = () => {
  const formRef = useRef(null);

  /**
   * Отримує значення радіо-кнопки за іменем (0–4), якщо не вибрано — 0
   */
  const getQuestionValue = useCallback((questionNumber) => {
    const selector = `input[name="question_${questionNumber}"]:checked`;
    const selected = formRef.current?.querySelector(selector);
    return selected ? parseInt(selected.value, 10) : 0;
  }, []);

  /**
   * Обчислює суми за субшкалами та загальний бал
   */
  const calculateScores = useCallback(() => {
    const scores = {
      sum_impulsiveness: 0,
      sum_inattention: 0,
      sum_selfesteem: 0,
    };

    // Імпульсивність
    WURS_SUBSCALES.impulsiveness.forEach((idx) => {
      scores.sum_impulsiveness += getQuestionValue(idx + 1);
    });

    // Неуважність
    WURS_SUBSCALES.inattention.forEach((idx) => {
      scores.sum_inattention += getQuestionValue(idx + 1);
    });

    // Самооцінка
    WURS_SUBSCALES.selfesteem.forEach((idx) => {
      scores.sum_selfesteem += getQuestionValue(idx + 1);
    });

    const sum_overall =
      scores.sum_impulsiveness + scores.sum_inattention + scores.sum_selfesteem;

    return {
      ...scores,
      sum_overall,
    };
  }, [getQuestionValue]);

  /**
   * Визначає текстову інтерпретацію ймовірності РДУГ
   */
  const getProbabilityText = useCallback(() => {
    const { sum_overall } = calculateScores();
    if (sum_overall > INTERPRETATION_THRESHOLDS.high) return "високу";
    if (sum_overall < INTERPRETATION_THRESHOLDS.low) return "низьку";
    return "помірну";
  }, [calculateScores]);

  /**
   * Генерує текст результатів для alert та email
   */
  const generateResultsText = useCallback(() => {
    const { sum_overall, sum_impulsiveness, sum_inattention, sum_selfesteem } =
      calculateScores();
    const probability = getProbabilityText();

    return `
При інтерпретації результатів встановлено, що загальна кількість балів складає ${sum_overall} з 100 можливих, що свідчить про ${probability} ймовірність наявності РДУГ.

Субшкали:
• Імпульсивність та поведінкові проблеми: ${sum_impulsiveness} з 52 балів
• Неуважність та шкільні проблеми: ${sum_inattention} з 28 балів
• Низька самооцінка та поганий настрій: ${sum_selfesteem} з 20 балів
    `.trim();
  }, [calculateScores, getProbabilityText]);

  /**
   * Швидкий попередній результат у alert
   */
  const handleQuickResult = useCallback(() => {
    showQuickResult('Швидкий результат WURS', generateResultsText());
  }, [generateResultsText]);

  /**
   * Обробка submit: генерація DOCX + відправка email
   */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const patientInfo = getBaseFormData(formRef);
      const scores = calculateScores();
      const probability = getProbabilityText();
      const resultsText = generateResultsText();

      const payload = {
        variant: "WURS",
        ...patientInfo,
        ...scores,
        result_precondition: probability, // для DOCX шаблону
      };

      const emailData = {
        variant: "WURS",
        ...patientInfo,
        ...scores,
        precondition: probability,
        results: resultsText,
      };

      try {
        // 1. Генерація та збереження DOCX для користувача
        const blob = await generateDocxClientSide(payload, "WURS", false);
        saveAs(blob, "wurs.docx");

        // 2. Відправка текстових результатів на email
        await sendResultsEmail(emailData);

        // formRef.current?.reset();
        showSuccess(
          "Файл збережено на вашому пристрої, а результати надіслано на email адміністратора."
        );
      } catch (error) {
        console.error("Помилка при обробці форми WURS:", error);

        // Fallback: намагаємося хоча б зберегти файл
        try {
          const fallbackBlob = await generateDocxClientSide(payload, "WURS", false);
          saveAs(fallbackBlob, "wurs.docx");
          showSuccess(
            "Файл збережено, але email не відправився. Повідомте адміністратора вручну."
          );
        } catch (fallbackError) {
          console.error("Критична помилка генерації DOCX:", fallbackError);
          showError("Помилка генерації файлу. Спробуйте ще раз.");
        }
      }
    },
    [
      calculateScores,
      getProbabilityText,
      generateResultsText,
    ]
  );

  return {
    formRef,
    handleSubmit,
    handleQuickResult,
  };
};