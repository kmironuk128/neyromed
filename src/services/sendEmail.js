// src/services/sendResultsEmail.js
import emailjs from "@emailjs/browser";


export const sendResultsEmail = async (results) => {
  
  try {
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      results,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
    console.log("Результати успішно надіслано на email");
  } catch (error) {
    console.error("Помилка відправки email:", error);
  }
};
