// src/services/docxGenerator.js
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

// Безпосередньо імпортуємо шаблони
import ASRS_TEMPLATE from '../templates/ASRS_v1.1.docx';
import ADHD_RS_TEMPLATE from '../templates/ADHD-RS-IV.docx';
import ADHD_DIVA5_TEMPLATE from '../templates/ADHD_DIVA-5.docx';
import WURS_TEMPLATE from '../templates/WURS-25.docx';

const templatesMap = {
  'ASRS': ASRS_TEMPLATE,
  "ADHD-RS": ADHD_RS_TEMPLATE,
  "ADHD_DIVA5": ADHD_DIVA5_TEMPLATE,
  'WURS': WURS_TEMPLATE,
};

export const generateDocxClientSide = async (
  data,
  variant,
  autoDownload = true
) => {
  try {
    // Отримуємо шлях до шаблону з мапи
    const templateUrl = templatesMap[variant];
    
    if (!templateUrl) {
      throw new Error(`Шаблон для варіанту "${variant}" не знайдено`);
    }
    
    console.log(`Завантаження шаблону для ${variant} з: ${templateUrl}`);

    // Завантажуємо шаблон
    const response = await fetch(templateUrl);
    if (!response.ok) {
      throw new Error(`Не вдалося завантажити шаблон: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
   
    if (arrayBuffer.byteLength === 0) {
      throw new Error("Завантажений файл порожній");
    }

    console.log(`Шаблон завантажено успішно, розмір: ${arrayBuffer.byteLength} байт`);

    // Розпаковуємо DOCX
    const zip = new PizZip(arrayBuffer);
    
    // Ініціалізуємо docxtemplater
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Встановлюємо дані
    doc.setData(data);

    try {
      // Рендеримо документ
      doc.render();
    } catch (error) {
      console.error("Помилка рендерингу:", error);
      throw new Error(`Помилка рендерингу шаблону: ${error.message}`);
    }

    // Генеруємо блоб
    const out = doc.getZip().generate({
      type: "blob",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      compression: "DEFLATE",
    });

    if (out.size === 0) {
      throw new Error("Згенерований файл порожній");
    }

    console.log(`Файл успішно згенеровано, розмір: ${out.size} байт`);

    if (autoDownload) {
      // Створюємо ім'я файлу
      const fileName = `${variant}_результат_${new Date().toISOString().split('T')[0]}.docx`;
      saveAs(out, fileName);
      console.log(`Файл збережено як: ${fileName}`);
    }

    return out;

  } catch (error) {
    console.error("Помилка генерації DOCX:", error);
    throw error;
  }
};