// src/components/questionnaire/DIVA5/useDIVA5Logic.js
import { useRef, useEffect, useCallback } from "react";
import { generateDocxClientSide } from "../services/docxGeneration";
import { sendResultsEmail } from "../services/sendEmail";
import { saveAs } from "file-saver";
import { getExpandedFormData } from "../utils/dateAndAge";
import { showQuickResult, showSuccess, showError } from '../utils/sweetAlert';

/**
 * Custom hook для логіки DIVA-5 опитувальника
 * Забезпечує:
 * - Автоматичну синхронізацію чекбоксів та textarea з радіо-кнопками "Так/Ні"
 * - Очищення прикладів та textarea при виборі "Ні"
 * - Збір даних, генерацію DOCX та відправку результатів
 */
export const useDIVA5 = () => {
  const formRef = useRef(null);

  // ===================================================================
  // Константи для симптомів
  // ===================================================================
  const SYMPTOMS = {
    A: Array.from({ length: 9 }, (_, i) => `A${i + 1}`),
    H: Array.from({ length: 9 }, (_, i) => `H${i + 1}`),
  };

  const IMPAIRMENT_ADULT_FIELDS = ["C1", "C2", "C3", "C4", "C5"];
  const IMPAIRMENT_CHILD_FIELDS = ["C6", "C7", "C8", "C9", "C10"];

  // ===================================================================
  // Утиліти для роботи з формою
  // ===================================================================
  const getRadioValue = useCallback((name) => {
    const checked = formRef.current?.querySelector(
      `input[name="${name}"]:checked`
    );
    return checked?.value || "ні";
  }, []);

  const getCheckboxLabels = useCallback((prefix) => {
    const checkboxes =
      formRef.current?.querySelectorAll(`input[id^="${prefix}_"]:checked`) ?? [];
    return Array.from(checkboxes).map((cb) => {
      const label = formRef.current?.querySelector(`label[for="${cb.id}"]`);
      return label?.textContent?.trim() || cb.id;
    });
  }, []);

  const getTextareaValue = useCallback((id) => {
    return formRef.current?.querySelector(`#${id}`)?.value.trim() ?? "";
  }, []);

  // Функція для форматування виводу секцій A та H
  const formatSymptomOutput = (checkboxExamples, textareaValue, radioValue) => {
    if (radioValue === "ні") {
      return "НІ";
    }
    
    const parts = [];
    
    // Додаємо чекбокси
    if (checkboxExamples.length > 0) {
      parts.push(...checkboxExamples);
    }
    
    // Додаємо textarea
    if (textareaValue) {
      parts.push(textareaValue);
    }
    
    return parts.length > 0 
      ? `ТАК (${parts.join(", ")})` 
      : "ТАК";
  };

  // Функція для форматування виводу секції C (чекбокси + textarea)
  const formatImpairmentOutput = (checkboxExamples, textareaValue) => {
    const parts = [];
    
    // Додаємо чекбокси
    if (checkboxExamples.length > 0) {
      checkboxExamples.forEach(example => {
        parts.push(`- ${example}`);
      });
    }
    
    // Додаємо textarea (якщо є)
    if (textareaValue) {
      parts.push(`- ${textareaValue}`);
    }
    
    return parts.join("\n");
  };

  const countYesSymptoms = useCallback(
    (type, period) => {
      return SYMPTOMS[type].filter(
        (symptom) => getRadioValue(`part_${symptom}_${period}`) === "так"
      ).length;
    },
    [getRadioValue]
  );

  // ===================================================================
  // Синхронізація чекбоксів ↔ радіо
  // ===================================================================
  const syncRadioWithCheckboxes = useCallback(() => {
    const form = formRef.current;
    if (!form) return;

    [...SYMPTOMS.A, ...SYMPTOMS.H].forEach((symptom) => {
      ["adult", "child"].forEach((period) => {
        // Перевіряємо чи є будь-які чекбокси позначені
        const checkedCount = form.querySelectorAll(
          `input[id^="${symptom}_${period}_"]:checked`
        ).length;
        // Перевіряємо чи є щось в textarea
        const textarea = form.querySelector(`#${symptom}_text_${period}`);
        const hasText = textarea && textarea.value.trim().length > 0;

        const yesRadio = form.querySelector(`#part_${symptom}_${period}_yes`);
        const noRadio = form.querySelector(`#part_${symptom}_${period}_no`);

        if (yesRadio && noRadio) {
          // Якщо є чекбокси або текст - ставимо "Так"
          yesRadio.checked = checkedCount > 0 || hasText;
          noRadio.checked = !(checkedCount > 0 || hasText);
        }
      });
    });
  }, []);

  // Додаткова функція для синхронізації радіо при зміні textarea
  const syncRadioOnTextareaChange = useCallback((event) => {
    const textarea = event.target;
    if (textarea.tagName !== "TEXTAREA") return;

    const form = formRef.current;
    if (!form) return;

    // Для симптомів A/H
    const match = textarea.id.match(/^([AH]\d+)_text_(adult|child)$/);
    if (match) {
      const [_, symptom, period] = match;
      const yesRadio = form.querySelector(`#part_${symptom}_${period}_yes`);
      const noRadio = form.querySelector(`#part_${symptom}_${period}_no`);

      if (yesRadio && noRadio) {
        const hasText = textarea.value.trim().length > 0;
        const hasCheckboxes =
          form.querySelectorAll(`input[id^="${symptom}_${period}_"]:checked`)
            .length > 0;

        yesRadio.checked = hasText || hasCheckboxes;
        noRadio.checked = !(hasText || hasCheckboxes);
      }
    }
    
    // Для секції C (порушення функціонування)
    // Оновлюємо радіо-кнопки частини C при зміні textarea
    const cMatch = textarea.id.match(/^C(\d+)_text$/);
    if (cMatch) {
      const [_, cNumber] = cMatch;
      const period = cNumber <= 5 ? "adult" : "child";
      const radioName = `part_C_${period}`;
      
      // Оновлюємо радіо-кнопку для всієї групи C
      const form = formRef.current;
      if (!form) return;
      
      // Перевіряємо чи є будь-які дані в секції C для цього періоду
      const relevantFields = period === "adult" 
        ? IMPAIRMENT_ADULT_FIELDS 
        : IMPAIRMENT_CHILD_FIELDS;
      
      let hasAnyData = false;
      
      relevantFields.forEach((field) => {
        // Перевіряємо чекбокси
        const hasCheckboxes = form.querySelectorAll(`input[id^="${field}_"]:checked`).length > 0;
        
        // Перевіряємо textarea
        const textarea = form.querySelector(`#${field}_text`);
        const hasText = textarea && textarea.value.trim().length > 0;
        
        if (hasCheckboxes || hasText) {
          hasAnyData = true;
        }
      });
      
      const yesRadio = form.querySelector(`#part_C_${period}_yes`);
      const noRadio = form.querySelector(`#part_C_${period}_no`);
      
      if (yesRadio && noRadio) {
        yesRadio.checked = hasAnyData;
        noRadio.checked = !hasAnyData;
      }
    }
  }, []);

  const clearExamplesOnNo = useCallback((event) => {
    const radio = event.target;
    if (radio.type !== "radio" || radio.value !== "ні") return;

    const form = formRef.current;
    if (!form) return;

    const { name } = radio;

    // Для симптомів A/H
    const symptomMatch = name.match(/part_([AH]\d+)_(adult|child)/);
    if (symptomMatch) {
      const [_, symptom, period] = symptomMatch;

      // Очищаємо чекбокси
      form
        .querySelectorAll(`input[id^="${symptom}_${period}_"]:checked`)
        .forEach((cb) => {
          cb.checked = false;
        });

      // Очищаємо textarea
      const textarea = form.querySelector(`#${symptom}_text_${period}`);
      if (textarea) textarea.value = "";
    }

    // Для частини C (порушення функціонування)
    if (name === "part_C_adult") {
      IMPAIRMENT_ADULT_FIELDS.forEach((field) => {
        // Очищаємо чекбокси
        form
          .querySelectorAll(`input[id^="${field}_"]:checked`)
          .forEach((cb) => (cb.checked = false));
        
        // Очищаємо textarea
        const textarea = form.querySelector(`#${field}_text`);
        if (textarea) textarea.value = "";
      });
    }
    if (name === "part_C_child") {
      IMPAIRMENT_CHILD_FIELDS.forEach((field) => {
        // Очищаємо чекбокси
        form
          .querySelectorAll(`input[id^="${field}_"]:checked`)
          .forEach((cb) => (cb.checked = false));
        
        // Очищаємо textarea
        const textarea = form.querySelector(`#${field}_text`);
        if (textarea) textarea.value = "";
      });
    }
  }, []);

  // Додаткова функція для обробки змін у textarea в реальному часі
  const handleTextareaInput = useCallback((event) => {
    const textarea = event.target;
    const form = formRef.current;
    if (!form || !textarea) return;

    // Для симптомів A/H
    const match = textarea.id.match(/^([AH]\d+)_text_(adult|child)$/);
    if (match) {
      const [_, symptom, period] = match;
      const yesRadio = form.querySelector(`#part_${symptom}_${period}_yes`);
      const noRadio = form.querySelector(`#part_${symptom}_${period}_no`);

      if (yesRadio && noRadio) {
        const hasText = textarea.value.trim().length > 0;
        const hasCheckboxes = 
          form.querySelectorAll(`input[id^="${symptom}_${period}_"]:checked`).length > 0;
        
        // Автоматично ставимо "Так" якщо є текст
        if (hasText) {
          yesRadio.checked = true;
          noRadio.checked = false;
        } else if (!hasCheckboxes) {
          // Якщо немає ні тексту ні чекбоксів, ставимо "Ні"
          noRadio.checked = true;
          yesRadio.checked = false;
        }
      }
    }
    
    // Для секції C (порушення функціонування)
    const cMatch = textarea.id.match(/^C(\d+)_text$/);
    if (cMatch) {
      const [_, cNumber] = cMatch;
      const period = cNumber <= 5 ? "adult" : "child";
      
      // Оновлюємо радіо-кнопку для всієї групи C
      const relevantFields = period === "adult" 
        ? IMPAIRMENT_ADULT_FIELDS 
        : IMPAIRMENT_CHILD_FIELDS;
      
      let hasAnyData = false;
      
      relevantFields.forEach((field) => {
        // Перевіряємо чекбокси
        const hasCheckboxes = form.querySelectorAll(`input[id^="${field}_"]:checked`).length > 0;
        
        // Перевіряємо textarea
        const textarea = form.querySelector(`#${field}_text`);
        const hasText = textarea && textarea.value.trim().length > 0;
        
        if (hasCheckboxes || hasText) {
          hasAnyData = true;
        }
      });
      
      const yesRadio = form.querySelector(`#part_C_${period}_yes`);
      const noRadio = form.querySelector(`#part_C_${period}_no`);
      
      if (yesRadio && noRadio) {
        yesRadio.checked = hasAnyData;
        noRadio.checked = !hasAnyData;
      }
    }
  }, []);

  // ===================================================================
  // Ефекти для підписки на події
  // ===================================================================
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    const radios = form.querySelectorAll('input[type="radio"]');
    const textareas = form.querySelectorAll("textarea");

    checkboxes.forEach((cb) =>
      cb.addEventListener("change", syncRadioWithCheckboxes)
    );
    radios.forEach((radio) =>
      radio.addEventListener("change", clearExamplesOnNo)
    );
    
    // Додаємо обробники для textarea
    textareas.forEach((textarea) => {
      textarea.addEventListener("input", handleTextareaInput);
      textarea.addEventListener("change", syncRadioOnTextareaChange);
      textarea.addEventListener("keyup", handleTextareaInput);
    });

    // Початкова синхронізація
    syncRadioWithCheckboxes();

    return () => {
      checkboxes.forEach((cb) =>
        cb.removeEventListener("change", syncRadioWithCheckboxes)
      );
      radios.forEach((radio) =>
        radio.removeEventListener("change", clearExamplesOnNo)
      );
      textareas.forEach((textarea) => {
        textarea.removeEventListener("input", handleTextareaInput);
        textarea.removeEventListener("change", syncRadioOnTextareaChange);
        textarea.removeEventListener("keyup", handleTextareaInput);
      });
    };
  }, [syncRadioWithCheckboxes, clearExamplesOnNo, syncRadioOnTextareaChange, handleTextareaInput]);

  // ===================================================================
  // Швидкий результат (alert)
  // ===================================================================
  const handleQuickResult = useCallback(() => {
    const aAdult = countYesSymptoms("A", "adult");
    const aChild = countYesSymptoms("A", "child");
    const hAdult = countYesSymptoms("H", "adult");
    const hChild = countYesSymptoms("H", "child");

    showQuickResult('Швидкий результат DIVA 5', 
      `
DIVA-5 Діагностичне інтерв'ю для РДУГ у дорослих

Дорослий вік:
• Дефіцит уваги (A1): ${aAdult} з 9
• Гіперактивність/імпульсивність (A2): ${hAdult} з 9

Дитинство (5–12 років):
• Дефіцит уваги (A1): ${aChild} з 9
• Гіперактивність/імпульсивність (A2): ${hChild} з 9

Критерій B (початок до 12 років): ${
        getRadioValue("part_B") === "так" ? "Так" : "Ні"
      }
Критерій C (порушення в ≥2 сферах):
• Дорослий вік: ${getRadioValue("part_C_adult") === "так" ? "Так" : "Ні"}
• Дитинство: ${getRadioValue("part_C_child") === "так" ? "Так" : "Ні"}
    `.trim()
    );
  }, [countYesSymptoms, getRadioValue]);

  // ===================================================================
  // Формування даних для DOCX та email
  // ===================================================================
  const buildDocxData = useCallback(() => {
    const data = {
      formattedDate: new Date().toLocaleDateString("uk-UA"),
    };

    // Симптоми A та H - зберігаємо окремо для форматування
    [...SYMPTOMS.A, ...SYMPTOMS.H].forEach((symptom) => {
      ["adult", "child"].forEach((period) => {
        const radioValue = getRadioValue(`part_${symptom}_${period}`);
        const checkboxExamples = getCheckboxLabels(`${symptom}_${period}`);
        const textareaValue = getTextareaValue(`${symptom}_text_${period}`);
        
        // Форматований вивід для секцій A та H
        data[`${symptom}_${period}`] = formatSymptomOutput(
          checkboxExamples,
          textareaValue,
          radioValue
        );
      });
    });

    // Частина B та C
    data.res_partB = getRadioValue("part_B") === "так" ? "ТАК" : "НІ";
    data.partB_text = getTextareaValue("part_B_text") || "";
    data.partC_adult = getRadioValue("part_C_adult") === "так" ? "ТАК" : "НІ";
    data.partC_child = getRadioValue("part_C_child") === "так" ? "ТАК" : "НІ";

    // Сфери порушення (секція C) - чекбокси + textarea
    [...IMPAIRMENT_ADULT_FIELDS, ...IMPAIRMENT_CHILD_FIELDS].forEach(
      (field) => {
        const checkboxExamples = getCheckboxLabels(field);
        const textareaValue = getTextareaValue(`${field}_text`);
        
        // Форматований вивід для секції C (чекбокси + textarea)
        data[field] = formatImpairmentOutput(checkboxExamples, textareaValue);
      }
    );

    // Додаткова інформація (частина E)
    data.optional_text = getTextareaValue("part_E") || "";

    // Підсумки
    data.summary_A_adult = countYesSymptoms("A", "adult");
    data.summary_A_child = countYesSymptoms("A", "child");
    data.summary_H_adult = countYesSymptoms("H", "adult");
    data.summary_H_child = countYesSymptoms("H", "child");
    data.summary_combined_adult = data.summary_A_adult + data.summary_H_adult >= 6 ? "Так" : "Ні";
    data.summary_combined_child = data.summary_A_child + data.summary_H_child >= 6 ? "Так" : "Ні";

    return data;
  }, [getRadioValue, getCheckboxLabels, getTextareaValue, countYesSymptoms, formatSymptomOutput, formatImpairmentOutput]);

  // ===================================================================
  // Обробка submit
  // ===================================================================
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const patientInfo = getExpandedFormData(formRef);
      const docxData = buildDocxData();

      const payload = {
        variant: "DIVA5",
        ...docxData,
        ...patientInfo,
      };

      try {
        // 1. Генерація та збереження DOCX
        const blob = await generateDocxClientSide(payload, "ADHD_DIVA5", false);
        saveAs(blob, "adhd-diva5.docx");

        // 2. Відправка email (тільки текст)
        await sendResultsEmail({
          variant: "ADHD DIVA 5",
          ...docxData,
          ...patientInfo,
          results: generateEmailText(docxData, patientInfo),
        });

        // formRef.current?.reset();
        showSuccess(
          "Файл збережено на вашому пристрої, результати надіслано на email адміністратора."
        );
      } catch (error) {
        console.error("Помилка при відправці результатів:", error);

        // Fallback: хоча б зберегти файл
        try {
          const fallbackBlob = await generateDocxClientSide(
            payload,
            "ADHD_DIVA5",
            false
          );
          saveAs(fallbackBlob, "adhd-diva5.docx");
          showSuccess(
            "Файл збережено, але email не відправився. Повідомте адміністратора вручну."
          );
        } catch (fallbackError) {
          console.error("Критична помилка генерації DOCX:", fallbackError);
          showError("Помилка генерації файлу. Спробуйте ще раз.");
        }
      }
    },
    [buildDocxData]
  );

  // ===================================================================
  // Повертаємо API хука
  // ===================================================================
  return {
    formRef,
    handleSubmit,
    handleQuickResult,
  };
};

/**
 * Генерує текстовий вміст email з результатами DIVA-5 для відправки адміністратору
 * @param {Object} docxData - Дані, зібрані з форми (симптоми, приклади, підсумки тощо)
 * @param {Object} patientInfo - Розширена інформація про пацієнта (ПІБ, дата народження, вік, стать тощо)
 * @returns {string} Відформатований текст email
 */
function generateEmailText(docxData) {
  // Отримуємо всі необхідні дані з docxData
  const {
    // Секції A та H - тепер вони містять форматований вивід
    A1_adult, A1_child, A2_adult, A2_child, A3_adult, A3_child, A4_adult, A4_child,
    A5_adult, A5_child, A6_adult, A6_child, A7_adult, A7_child, A8_adult, A8_child,
    A9_adult, A9_child,
    H1_adult, H1_child, H2_adult, H2_child, H3_adult, H3_child, H4_adult, H4_child,
    H5_adult, H5_child, H6_adult, H6_child, H7_adult, H7_child, H8_adult, H8_child,
    H9_adult, H9_child,
    
    // Частина B
    res_partB, partB_text,
    
    // Секція C - тепер вони містять форматований вивід (чекбокси + textarea)
    C1, C2, C3, C4, C5, C6, C7, C8, C9, C10,
    
    // Частина C - радіо-кнопки
    partC_adult, partC_child
  } = docxData;

  return `

Скарги:
Анамнез хвороби: 

DIVA-5 Діагностичне інтерв'ю для РДУГ у дорослих

Частина 1: Симптоми дефіциту уваги (Критерій А1 за DSM-5) 

А1 Симптоми наявні у дорослому віці: ${A1_adult}
Симптоми наявні у дитячому віці: ${A1_child}

А2 Симптоми наявні у дорослому віці: ${A2_adult}
Симптоми наявні у дитячому віці: ${A2_child}

А3 Симптоми наявні у дорослому віці: ${A3_adult}
Симптоми наявні у дитячому віці: ${A3_child}

А4 Симптоми наявні у дорослому віці: ${A4_adult}
Симптоми наявні у дитячому віці: ${A4_child}

А5 Симптоми наявні у дорослому віці: ${A5_adult}
Симптоми наявні у дитячому віці: ${A5_child}

А6 Симптоми наявні у дорослому віці: ${A6_adult}
Симптоми наявні у дитячому віці: ${A6_child}

А7 Симптоми наявні у дорослому віці: ${A7_adult}
Симптоми наявні у дитячому віці: ${A7_child}

А8 Симптоми наявні у дорослому віці: ${A8_adult}
Симптоми наявні у дитячому віці: ${A8_child}

А9 Симптоми наявні у дорослому віці: ${A9_adult}
Симптоми наявні у дитячому віці: ${A9_child} 

Частина 2: Симптоми гіперактивності-імпульсивності (Критерій А2 за DSM-5) 

Н/І 1 Симптоми наявні у дорослому віці: ${H1_adult}
Симптоми наявні у дитячому віці: ${H1_child}

Н/І 2 Симптоми наявні у дорослому віці: ${H2_adult} 
Симптоми наявні у дитячому віці: ${H2_child}

Н/І 3 Симптоми наявні у дорослому віці: ${H3_adult}
Симптоми наявні у дитячому віці: ${H3_child} 

Н/І 4 Симптоми наявні у дорослому віці: ${H4_adult}
Симптоми наявні у дитячому віці: ${H4_child}

Н/І 5 Симптоми наявні у дорослому віці: ${H5_adult}
Симптоми наявні у дитячому віці: ${H5_child}

Н/І 6 Симптоми наявні у дорослому віці: ${H6_adult} 
Симптоми наявні у дитячому віці: ${H6_child}

Н/І 7 Симптоми наявні у дорослому віці: ${H7_adult}
Симптоми наявні у дитячому віці: ${H7_child}

Н/І 8 Симптоми наявні у дорослому віці: ${H8_adult}
Симптоми наявні у дитячому віці: ${H8_child} 

Н/І 9 Симптоми наявні у дорослому віці: ${H9_adult}
Симптоми наявні у дитячому віці: ${H9_child} 

Частина 3: Порушення функціонування через симптоми (Критерії B, C, D за DSM-5) 

Чи завжди у вас були ці симптоми РДУГ? ${res_partB}
${partB_text}

У яких сферах життя ви мали труднощі через свої симптоми:
ДОРОСЛИЙ ВІК: 
Робота/освіта
${C1}
Відносини/сім’я
${C2}
Вільний час/хобі
${C3}
Спілкування з людьми
${C4}
Самооцінка/самовпевненість
${C5}

ДИТИНСТВО ТА ПІДЛІТКОВІ РОКИ:
Освіта
${C6}
Спілкування з людьми
${C7}
Самооцінка/самовпевненість
${C8}
Сім'я
${C9}
Вільний час/хобі
${C10}

Дорослий вік: Ознаки порушення в двох або більше сферах?  ${partC_adult}
Дитинство: Ознаки порушення в двох або більше сферах?  ${partC_child}
`.trim();
}

export default generateEmailText;