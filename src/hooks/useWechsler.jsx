// src/components/questionnaire/Wechsler/useWechslerLogic.js
import { useRef, useCallback } from "react";
import { sendResultsEmail } from "../services/sendEmail";
import { getExpandedFormData } from "../utils/dateAndAge";
import {
  SCORE_NAMES,
  SCORE_TABLES,
  VC_TABLE,
  PR_TABLE,
  QI_TABLE,
  WM_TABLE,
  PS_TABLE,
} from "../data/Wechsler_data";
import { showQuickResult, showSuccess, showError } from '../utils/sweetAlert';


/**
 * Константи для індексів та таблиць
 */
const INDEX_CONFIG = {
  VCI: { sumKeys: ["SI", "VC", "CO", "IN", "WR"], table: VC_TABLE, labels: { iq: "ICV", rp: "Rp", ci: "CI_95" } },
  PRI: { sumKeys: ["BD", "PCn", "MR", "PCm"], table: PR_TABLE, labels: { iq: "IRP", rp: "Rp", ci: "CI_95" } },
  WMI: { sumKeys: ["DS", "LN", "AR"], table: WM_TABLE, labels: { iq: "IML", rp: "Rp", ci: "CI_95" } },
  PSI: { sumKeys: ["CD", "SS", "CA"], table: PS_TABLE, labels: { iq: "IVE", rp: "Rp", ci: "CI_95" } },
  FSIQ: { sumKeys: [], table: QI_TABLE, labels: { iq: "QI", rp: "Rp", ci: "CI_95" } }, // QI розраховується окремо
};

/**
 * Допустимий діапазон віку: 6–16 років
 */
const MIN_AGE_YEARS = 6;
const MAX_AGE_YEARS = 16;

/**
 * Отримує ключ таблиці норм за віком (наприклад, "8y.4m0d-7m30d")
 */
const getAgeTableKey = ({ years, months }) => {
  if (years < MIN_AGE_YEARS || years > MAX_AGE_YEARS) {
    return null;
  }

  let range;
  if (months <= 3) range = "0m0d-3m30d";
  else if (months <= 7) range = "4m0d-7m30d";
  else if (months <= 11) range = "8m0d-11m30d";
  else range = "0m0d-3m30d"; // 12+ місяців → наступний рік

  return `${years}y.${range}`;
};

/**
 * Знаходить зважений бал за сирим значенням у таблиці
 */
const lookupScaledScore = (tableEntry, subtest, rawScore) => {
  if (!rawScore || isNaN(rawScore)) return 0;
  const value = Number(rawScore);

  for (const score in tableEntry) {
    const range = tableEntry[score][subtest];
    if (range && value >= range.min && value <= range.max) {
      return Number(score);
    }
  }
  return 0;
};

/**
 * Custom hook для логіки тесту Wechsler (WISC-UA або аналог)
 */
export const useWechsler = () => {
  const formRef = useRef(null);

  /**
   * Отримує сирі бали з форми
   */
  const getRawScores = useCallback(() => {
    const rawScores = {};
    SCORE_NAMES.forEach((name) => {
      const input = formRef.current?.[name];
      rawScores[name] = input ? Number(input.value) || 0 : 0;
    });
    return rawScores;
  }, []);

  /**
   * Розраховує всі бали та індекси за віком
   */
  const calculateResults = useCallback((age) => {
    const tableKey = getAgeTableKey(age);
    if (!tableKey || !SCORE_TABLES[tableKey]) {
      return null;
    }

    const rawScores = getRawScores();
    const scaledScores = {};

    // Зважені бали
    SCORE_NAMES.forEach((name) => {
      scaledScores[name] = lookupScaledScore(SCORE_TABLES[tableKey], name, rawScores[name]);
    });

    // Сума індексів
    const VCI = INDEX_CONFIG.VCI.sumKeys.reduce((sum, key) => sum + scaledScores[key], 0);
    const PRI = INDEX_CONFIG.PRI.sumKeys.reduce((sum, key) => sum + scaledScores[key], 0);
    const WMI = INDEX_CONFIG.WMI.sumKeys.reduce((sum, key) => sum + scaledScores[key], 0);
    const PSI = INDEX_CONFIG.PSI.sumKeys.reduce((sum, key) => sum + scaledScores[key], 0);
    const FSIQ = VCI + PRI + WMI + PSI;

    // Таблиці норм для індексів
    const indexResults = {
      VCI: { sum: VCI, ... (VC_TABLE[VCI] || {}) },
      PRI: { sum: PRI, ... (PR_TABLE[PRI] || {}) },
      WMI: { sum: WMI, ... (WM_TABLE[WMI] || {}) },
      PSI: { sum: PSI, ... (PS_TABLE[PSI] || {}) },
      FSIQ: { sum: FSIQ, ... (QI_TABLE[FSIQ] || {}) },
    };

    return {
      scaledScores,
      indices: {
        VCI,
        PRI,
        WMI,
        PSI,
        FSIQ,
      },
      indexResults,
      tableKey,
    };
  }, [getRawScores]);

  /**
   * Генерує текст результатів (для alert та email)
   */
  const generateResultsText = useCallback((age, results) => {
    if (!results) return "Дані для цього віку недоступні.";

    const { scaledScores, indices, indexResults } = results;
    const { years, months, days } = age;

    const scaledLine = SCORE_NAMES.map(
      (name) => `${name}: ${scaledScores[name]}`
    ).join(" ");

    const indicesLines = Object.entries(indexResults).map(([key, data]) => {
      const config = INDEX_CONFIG[key];
      const iq = data[config.labels.iq] || "-";
      const rp = data[config.labels.rp] || "-";
      const ci = data[config.labels.ci] || "-";
      return `${key}: ${data.sum} → IQ ${iq} (Rp: ${rp}, 95% CI: ${ci})`;
    }).join("\n");

    return `
Вік: ${years} років, ${months} місяців, ${days} днів

Зважені бали:
${scaledLine}

Індекси:
${indicesLines}
    `.trim();
  }, []);

  /**
   * Швидкий результат у alert
   */
  const handleQuickResult = useCallback(() => {
    const patientData = getExpandedFormData(formRef);
    const { age } = patientData;

    if (age.years < MIN_AGE_YEARS || age.years > MAX_AGE_YEARS) {
      showError(`Вік ${age.years} років не підтримується. Доступно: 6–16 років.`);
      return;
    }

    const results = calculateResults(age);
    if (!results) {
      showError("Таблиця норм для цього віку не знайдена.");
      return;
    }

    const text = generateResultsText(age, results);
    showQuickResult('Швидкий результат Wechsler', text);
  }, [calculateResults, generateResultsText]);

  /**
   * Відправка результатів на email
   */
  const handleSubmit = useCallback(async () => {
    const patientData = getExpandedFormData(formRef);
    const { age, patient_name = "Не вказано", patient_year = "Не вказано" } = patientData;

    if (age.years < MIN_AGE_YEARS || age.years > MAX_AGE_YEARS) {
      showError(`Вік ${age.years} років не підтримується. Доступно: 6–16 років.`);
      return;
    }

    const results = calculateResults(age);
    if (!results) {
      showError("Таблиця норм для цього віку не знайдена.");
      return;
    }

    const resultsText = generateResultsText(age, results);

    const emailPayload = {
      variant: "Wechsler",
      patient_name,
      patient_year,
      age: `${age.years} років, ${age.months} місяців, ${age.days} днів`,
      ...patientData,
      ...results,
      results: resultsText,
    };

    try {
      await sendResultsEmail(emailPayload);
      // formRef.current?.reset();
      showSuccess("Результати успішно надіслано на email адміністратора.");
    } catch (error) {
      console.error("Помилка відправки результатів Wechsler:", error);
      showError("Виникла помилка при відправці. Спробуйте ще раз.");
    }
  }, [calculateResults, generateResultsText]);

  return {
    formRef,
    handleSubmit,
    handleQuickResult,
  };
};