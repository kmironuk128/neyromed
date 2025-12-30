// src/hooks/useASRS.js
import { useRef, useCallback } from "react";
import { generateDocxClientSide } from "../services/docxGeneration";
import { sendResultsEmail } from "../services/sendEmail";
import { getExpandedFormData } from "../utils/dateAndAge";
import { saveAs } from "file-saver";
import { showQuickResult, showSuccess, showError } from '../utils/sweetAlert';

/**
 * Конфігурація шкал та логіки підрахунку ASRS v1.1 (18 питань)
 * Індекси — 0-based (0 = питання 1, 17 = питання 18)
 */
const ASRS_CONFIG = {
  // Групи для підрахунку "позитивних" відповідей
  group1: [0, 1, 2, 8, 11, 15, 17], // Позитивно: Іноді, Часто, Дуже часто
  group2: [3, 4, 5, 6, 7, 9, 10, 12, 13, 14, 16], // Позитивно: тільки Часто, Дуже часто

  // Субшкали
  inattention: [0, 1, 2, 3, 6, 7, 8, 9, 10],        // 9 питань
  hyperactivityMotor: [4, 5, 11, 12, 13],         // 5 питань
  hyperactivityVerbal: [14, 15, 16, 17],           // 4 питання

  // Нормативні дані для дорослих (середнє та SD за віковими групами)
  norms: [
    { min: 18, max: 29, mean: 2.99, sd: 4.1 },
    { min: 30, max: 39, mean: 2.59, sd: 3.1 },
    { min: 40, max: 49, mean: 2.26, sd: 3.1 },
    { min: 50, max: 64, mean: 1.82, sd: 3.1 },
    { min: 65, max: Infinity, mean: 1.23, sd: 2.1 },
  ],
};

/**
 * Варіанти відповідей, що вважаються "позитивними"
 */
const POSITIVE_ANSWERS = {
  group1: ["Іноді", "Часто", "Дуже часто"],
  group2: ["Часто", "Дуже часто"],
};

/**
 * Custom hook для логіки опитувальника ASRS v1.1 (Adult ADHD Self-Report Scale)
 */
export const useASRS = () => {
  const formRef = useRef(null);

  /**
   * Отримує текстову відповідь на питання за глобальним індексом (0–17)
   */
  const getAnswerText = useCallback((globalIndex) => {
    const part = globalIndex <= 5 ? "A" : "B";
    const localIndex = globalIndex <= 5 ? globalIndex + 1 : globalIndex - 5;

    const selector = `input[name="${part}q${localIndex}"]:checked`;
    const checked = formRef.current?.querySelector(selector);
    return checked?.value ?? null;
  }, []);

  /**
   * Обчислює всі бали згідно з офіційною логікою ASRS
   */
  const calculateScores = useCallback(() => {
    let partA = 0;
    let partB = 0;
    let inattention = 0;
    let motor = 0;
    let verbal = 0;
    let overall = 0;

    for (let i = 0; i < 18; i++) {
      const answer = getAnswerText(i);
      if (!answer) continue;

      const isPositive =
        ASRS_CONFIG.group1.includes(i)
          ? POSITIVE_ANSWERS.group1.includes(answer)
          : POSITIVE_ANSWERS.group2.includes(answer);

      if (isPositive) {
        overall++;
        if (i < 6) partA++;
        else partB++;

        if (ASRS_CONFIG.inattention.includes(i)) inattention++;
        if (ASRS_CONFIG.hyperactivityMotor.includes(i)) motor++;
        if (ASRS_CONFIG.hyperactivityVerbal.includes(i)) verbal++;
      }
    }

    return {
      sum_partA: partA,
      sum_partB: partB,
      sum_inattention: inattention,
      sum_hyperactivity_motor: motor,
      sum_hyperactivity_verbal: verbal,
      sum_overall: overall,
    };
  }, [getAnswerText]);

  /**
   * Визначає ймовірність РДУГ на основі z-оцінки та віку
   */
  const getProbabilityLevel = useCallback((ageYears, totalScore) => {
    if (!ageYears || ageYears < 18) return "невідома (вік < 18)";

    const norm = ASRS_CONFIG.norms.find(
      ({ min, max }) => ageYears >= min && ageYears <= max
    );

    if (!norm) return "невідома (вік поза нормами)";

    const zScore = (totalScore - norm.mean) / norm.sd;

    if (zScore <= 1) return "низьку";
    if (zScore <= 2) return "помірну";
    return "високу";
  }, []);

  /**
   * Генерує текст результатів (для alert та email)
   */
  const generateResultsText = useCallback(
    (scores, probability) => {
      const {
        sum_partA,
        sum_partB,
        sum_inattention,
        sum_hyperactivity_motor,
        sum_hyperactivity_verbal,
        sum_overall,
      } = scores;

      return `
Результати опитувальника ASRS v1.1 (18 питань)

Частина A (питання 1–6): ${sum_partA} з 6 балів
Частина B (питання 7–18): ${sum_partB} з 12 балів

Субшкали:
• Неуважність: ${sum_inattention} з 9 балів
• Гіперактивність (моторна): ${sum_hyperactivity_motor} з 5 балів
• Гіперактивність/імпульсивність (вербальна): ${sum_hyperactivity_verbal} з 4 балів

Загальний бал: ${sum_overall} з 18 можливих балів

Інтерпретація:
Результати свідчать про ${probability} ймовірність наявності симптомів РДУГ у дорослому віці.
      `.trim();
    },
    []
  );

  /**
   * Швидкий попередній результат у alert
   */
  const handleQuickResult = useCallback(() => {
    const patientData = getExpandedFormData(formRef);
    const { age } = patientData;

    if (!age?.years || age.years < 18) {
      showError("Будь ласка, введіть коректну дату народження (для дорослих ≥18 років).");
      return;
    }

    const scores = calculateScores();
    const probability = getProbabilityLevel(age.years, scores.sum_overall);

    const text = generateResultsText(scores, probability);
    showQuickResult('Швидкий результат ASRS', text);
  }, [calculateScores, getProbabilityLevel, generateResultsText]);

  /**
   * Обробка submit: генерація DOCX + відправка email
   */
  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      const patientData = getExpandedFormData(formRef);
      const { age } = patientData;

      if (!age?.years || age.years < 18) {
        showError("Невірний вік. Опитувальник ASRS призначений для дорослих (≥18 років).");
        return;
      }

      const scores = calculateScores();
      const probability = getProbabilityLevel(age.years, scores.sum_overall);
      const resultsText = generateResultsText(scores, probability);

      const payload = {
        variant: "ASRS",
        ...patientData,
        ...scores,
        result_precondition: probability,
      };

      const emailData = {
        variant: "ASRS",
        ...patientData,
        ...scores,
        precondition: probability,
        results: resultsText,
      };

      try {
        // 1. Генерація та збереження DOCX
        const blob = await generateDocxClientSide(payload, "ASRS", false);
        saveAs(blob, "asrs.docx");

        // 2. Відправка email
        await sendResultsEmail(emailData);

        // formRef.current?.reset();
        showSuccess("Файл збережено на вашому пристрої, а результати надіслано на email адміністратора.");
      } catch (error) {
        console.error("Помилка при обробці ASRS:", error);

        // Fallback: намагаємося зберегти хоча б файл
        try {
          const fallbackBlob = await generateDocxClientSide(payload, "ASRS", false);
          saveAs(fallbackBlob, "asrs.docx");
          showSuccess("Файл збережено, але email не відправився. Повідомте адміністратора вручну.");
        } catch (fallbackError) {
          console.error("Критична помилка генерації DOCX:", fallbackError);
          showError("Помилка генерації файлу. Спробуйте ще раз.");
        }
      }
    },
    [calculateScores, getProbabilityLevel, generateResultsText]
  );

  return {
    formRef,
    handleSubmit,
    handleQuickResult,
    calculateScores, // експортуємо для можливого тестування або розширення
    getProbabilityLevel,
  };
};