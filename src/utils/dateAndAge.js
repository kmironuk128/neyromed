// src/utils/dateAndAge.js

/**
 * Масив назв місяців українською мовою (у родовому відмінку)
 */
const MONTH_NAMES = [
  "січня",
  "лютого",
  "березня",
  "квітня",
  "травня",
  "червня",
  "липня",
  "серпня",
  "вересня",
  "жовтня",
  "листопада",
  "грудня",
];

/**
 * Повертає поточну дату у форматі "27 грудня 2025"
 * @returns {string}
 */
export const getFormattedCurrentDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

/**
 * Перетворює рядок дати народження "дд.мм.рррр" на об'єкт Date
 * Повертає null, якщо формат некоректний або дата неможлива (наприклад, 31.04.2020)
 * @param {string} birthDateStr
 * @returns {Date|null}
 */
const parseBirthDate = (birthDateStr) => {
  if (!birthDateStr || typeof birthDateStr !== "string") return null;

  const trimmed = birthDateStr.trim();
  const match = trimmed.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return null;

  const [, dayStr, monthStr, yearStr] = match;
  const day = Number(dayStr);
  const month = Number(monthStr); // 1–12
  const year = Number(yearStr);

  // Базова перевірка діапазонів
  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    year < 1900 ||
    year > new Date().getFullYear() + 1
  ) {
    return null;
  }

  const date = new Date(year, month - 1, day);

  // Перевірка на валідність (відловлює 31.04, 30.02 тощо)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

/**
 * Обчислює вік на основі дати народження
 * @param {Date} birthDate
 * @param {Date} [referenceDate=new Date()] - дата, відносно якої рахуємо вік
 * @returns {{ years: number, months: number, days: number }}
 */
const calculateAge = (birthDate, referenceDate = new Date()) => {
  let years = referenceDate.getFullYear() - birthDate.getFullYear();
  let months = referenceDate.getMonth() - birthDate.getMonth();
  let days = referenceDate.getDate() - birthDate.getDate();

  // Корекція днів
  if (days < 0) {
    months--;
    const lastMonth = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth(),
      0
    );
    days += lastMonth.getDate();
  }

  // Корекція місяців
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
};

/**
 * Обчислює вік у роках, місяцях і днях за датою народження у форматі "дд.мм.рррр"
 * Повертає null, якщо вхідні дані некоректні
 * @param {string} birthDateStr
 * @returns {{ years: number, months: number, days: number } | null}
 */
export const calculateAgeFromBirthDate = (birthDateStr) => {
  const birthDate = parseBirthDate(birthDateStr);
  if (!birthDate) return null;

  return calculateAge(birthDate);
};

/**
 * Отримує базові дані з форми (ім'я, рік народження, додаткова інформація)
 * Використовується для опитувальників без статі та точного віку
 * @param {React.RefObject<HTMLFormElement>} formRef
 * @returns {object}
 */
export const getBaseFormData = (formRef) => {
  const form = formRef.current;
  if (!form) {
    console.warn("getBaseFormData: formRef is not attached");
    return {};
  }

  return {
    patient_name: form.patient_name?.value.trim() || "Невідомо",
    patient_year: form.patient_year?.value.trim() || "Невідомо",
    optional_text: form.optional_text?.value.trim() || "",
    formattedDate: getFormattedCurrentDate(),
  };
};

/**
 * Отримує розширені дані з форми (ім'я, дата народження, стать, вік, додаткова інформація)
 * Використовується для опитувальників, де потрібна стать та точний вік
 * @param {React.RefObject<HTMLFormElement>} formRef
 * @returns {object}
 */
export const getExpandedFormData = (formRef) => {
  const form = formRef.current;
  if (!form) {
    console.warn("getExpandedFormData: formRef is not attached");
    return {};
  }

  const birthDateInput = form.patient_year?.value.trim() || "";
  const age = calculateAgeFromBirthDate(birthDateInput);

  const sexSelect = form.querySelector('[name="patient_sex"]');
  const patient_sex = sexSelect?.value || "Невідомо";

  return {
    patient_name: form.patient_name?.value.trim() || "Невідомо",
    patient_year: birthDateInput || "Невідомо",
    patient_sex,
    age, // null, якщо дата невалідна
    optional_text: form.optional_text?.value.trim() || "",
    formattedDate: getFormattedCurrentDate(),
  };
};
