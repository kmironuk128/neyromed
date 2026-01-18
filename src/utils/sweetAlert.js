// src/utils/sweetAlert.js
import Swal from "sweetalert2";

export const showQuickResult = (title, html) => {
  Swal.fire({
    title: title,
    html: html.replace(/\n/g, "<br>"), // для перенесень рядків
    icon: "info",
    confirmButtonText: "OK",
    width: "800px",
    customClass: {
      popup: "swal-wide",
    },
  });
};

export const showSuccess = (message) => {
  Swal.fire({
    title: "Успіх!",
    text: message,
    icon: "success",
    confirmButtonText: "OK",
  });
};

export const showError = (message) => {
  Swal.fire({
    title: "Помилка",
    text: message,
    icon: "error",
    confirmButtonText: "OK",
  });
};

export const checkAllAnswered = (formRef, QUESTIONS_COUNT) => {
  const form = formRef.current;

  for (let i = 1; i <= QUESTIONS_COUNT; i++) {
    const value = form?.[`question_${i}`]?.value;

    if (!value) {
      alert(`Дайте відповідь на питання ${i}`);
      throw new Error(`Не відповіли на питання ${i}`);
    }
  }
};
