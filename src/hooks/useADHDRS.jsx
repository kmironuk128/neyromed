// src/hooks/useADHDRS.js
import { useRef, useState, useCallback, useEffect } from "react";
import { generateDocxClientSide } from "../services/docxGeneration";
import { getBaseFormData } from "../utils/dateAndAge";
import { sendResultsEmail } from "../services/sendEmail";
import { showQuickResult, showSuccess, showError } from '../utils/sweetAlert';

export const useADHDRS = () => {
  const formRef = useRef(null);
  const [maxes, setMaxes] = useState(Array(18).fill(0));

  // Функція для обчислення максимального балу для однієї секції
  const calculateSectionMax = useCallback((sectionIndex) => {
    const form = formRef.current;
    if (!form) {
      console.log("Форма не знайдена!");
      return 0;
    }

    // Селектор для обранних радіокнопок цієї секції
    const selector = `input[name^="section_${sectionIndex}_q"]:checked`;

    const checkedRadios = form.querySelectorAll(selector);

    let maxScore = 0;
    checkedRadios.forEach((radio, i) => {
      const value = parseInt(radio.value, 10);
      if (value > maxScore) {
        maxScore = value;
      }
    });

    return maxScore;
  }, []);

  // Функція для оновлення всіх секцій
  const updateAllMaxes = useCallback(() => {
    const newMaxes = [];
    for (let i = 1; i <= 18; i++) {
      newMaxes.push(calculateSectionMax(i));
    }

    setMaxes(newMaxes);
  }, [calculateSectionMax]);

  // Додаємо глобальний обробник подій для форми
  useEffect(() => {
    const form = formRef.current;
    if (!form) {
      console.log("Форма ще не доступна");
      return;
    }

    const handleFormChange = (e) => {
      if (e.target.type === "radio") {
        // Затримка для того, щоб браузер встиг оновити checked стан
        setTimeout(() => {
          // Знаходимо номер секції з імені радіокнопки
          const name = e.target.name;
          const match = name.match(/section_(\d+)_q/);
          if (match) {
            const sectionIndex = parseInt(match[1], 10);
            const newMax = calculateSectionMax(sectionIndex);

            setMaxes((prev) => {
              const newMaxes = [...prev];
              newMaxes[sectionIndex - 1] = newMax;
              return newMaxes;
            });
          }
        }, 50);
      }
    };

    form.addEventListener("change", handleFormChange);

    // Ініціалізація при першому завантаженні
    setTimeout(() => {
      updateAllMaxes();
    }, 300);

    // Cleanup
    return () => {
      form.removeEventListener("change", handleFormChange);
    };
  }, [calculateSectionMax, updateAllMaxes]);

 

  const calculateTotals = useCallback(() => {
    const inattention = maxes.slice(0, 9).reduce((a, b) => a + b, 0);
    const hyperactivity = maxes.slice(9, 18).reduce((a, b) => a + b, 0);
    const overall = inattention + hyperactivity;

    const percent = (overall / 54) * 100;
    let precondition = "невідомо";
    if (percent <= 39) precondition = "низьку";
    else if (percent <= 69) precondition = "помірну";
    else if (percent > 70) precondition = "високу";

    return {
      result_inattention: inattention,
      result_hyperactivity: hyperactivity,
      result_overall: overall,
      result_precondition: precondition,
    };
  }, [maxes]);

  const getResMini = (score) => {
    if (score === 0) return "відсутній";
    if (score === 1) return "легкий";
    if (score === 2) return "помірний";
    if (score === 3) return "високий";
    return "невідомо";
  };

  const handleQuickResult = () => {
    const totals = calculateTotals();
    showQuickResult('Швидкий результат ADHD-RS',   `
Неуважність: ${totals.result_inattention} з 27 балів
Гіперактивність/імпульсивність: ${totals.result_hyperactivity} з 27 балів
Загальний бал: ${totals.result_overall} з 54
Свідчить про ймовірність РДУГ: ${totals.result_precondition}
    `.trim()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const baseData = getBaseFormData(formRef);
    const totals = calculateTotals();

    const resMiniObj = {};
    const maxObj = {};
    maxes.forEach((max, i) => {
      const idx = i + 1;
      resMiniObj[`res_mini_${idx}`] = getResMini(max);
      maxObj[`max_${idx}`] = max;
    });

    const payload = {
      variant: "ADHD-RS",
      ...baseData,
      ...totals,
      ...resMiniObj,
      ...maxObj,
    };

    try {
      // 1. Генеруємо файл для користувача
      const blob = await generateDocxClientSide(payload, "ADHD-RS", false);
      saveAs(blob, "adhd-rs.docx");

      // 2. Надсилаємо тільки текстові дані на email (без файлу)
      const resultsText = `
Неуважність: ${totals.result_inattention} з 27 балів
Гіперактивність/імпульсивність: ${totals.result_hyperactivity} з 27 балів
Загальний бал: ${totals.result_overall} з 54
Свідчить про ймовірність РДУГ: ${totals.result_precondition}
    `.trim();

      let dataForEmail = {
        variant: "ADHD-RS",
        ...baseData,
        ...totals,
        results: resultsText,
      };
      await sendResultsEmail(dataForEmail);

      // formRef.current?.reset();
      showSuccess(
        "Файл збережено на вашому пристрої, а результати надіслано на email адміністратора."
      );
    } catch (err) {
      console.error("Помилка в handleSubmit:", err);

      // Fallback: хоча б файл зберегти
      try {
        const fallbackBlob = await generateDocxClientSide(
          payload,
          "ADHD-RS",
          false
        );
        saveAs(fallbackBlob, "adhd-rs.docx");
        showSuccess(
          "Файл збережено, але email не відправився. Повідомте адміністратора вручну."
        );
      } catch (fallbackErr) {
        showError("Помилка генерації файлу. Спробуйте ще раз.");
      }
    }
  };

  return {
    formRef,
    handleSubmit,
    handleQuickResult,
    maxes,
    updateAllMaxes,
  };
};
